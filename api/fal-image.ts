const FAL_IMAGE_URL = 'https://fal.run/fal-ai/flux-1/dev/image-to-image';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = getEnv('FAL_KEY');

    if (!apiKey) {
      return jsonError('FAL_KEY est absente des variables d environnement Vercel.', 500);
    }

    const incoming = await request.formData();
    const image = incoming.get('image');
    const prompt = String(incoming.get('prompt') ?? '').trim();
    const mode = incoming.get('mode') === 'quality' ? 'quality' : 'fast';
    const intensity = clampIntensity(Number(incoming.get('intensity') ?? 72));

    if (!(image instanceof Blob)) {
      return jsonError('Image manquante dans la requete.', 400);
    }

    if (!prompt) {
      return jsonError('Prompt manquant dans la requete.', 400);
    }

    const imageUrl = await blobToDataUrl(image);
    const response = await fetch(FAL_IMAGE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt,
        strength: Math.max(0.45, Math.min(0.95, intensity / 100)),
        num_inference_steps: mode === 'quality' ? 40 : 28,
        guidance_scale: mode === 'quality' ? 3.8 : 3.2,
        num_images: 1,
        enable_safety_checker: true,
        output_format: 'jpeg',
        acceleration: mode === 'fast' ? 'regular' : 'none',
        sync_mode: true
      })
    });

    const payload = (await response.json().catch(() => null)) as FalImageResponse | FalErrorResponse | null;

    if (!response.ok) {
      return jsonError(getFalErrorMessage(response.status, payload), response.status);
    }

    const imageDataUrl = getFalImageUrl(payload);
    if (!imageDataUrl) {
      return jsonError('fal.ai n a pas renvoye d image exploitable.', 502);
    }

    return Response.json({ imageDataUrl });
  } catch (error) {
    console.error('fal-image function failed', error);
    return jsonError('Generation fal.ai impossible pour le moment.', 500);
  }
}

interface FalImageResponse {
  images?: Array<{
    url?: string;
    content_type?: string;
  }>;
}

interface FalErrorResponse {
  detail?: string | Array<{ msg?: string; message?: string }>;
  error?: string;
  message?: string;
}

function getEnv(name: string) {
  const runtime = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return runtime.process?.env?.[name]?.trim();
}

async function blobToDataUrl(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return `data:${blob.type || 'image/jpeg'};base64,${btoa(binary)}`;
}

function clampIntensity(value: number) {
  if (!Number.isFinite(value)) {
    return 72;
  }

  return Math.max(20, Math.min(100, value));
}

function getFalImageUrl(payload: FalImageResponse | FalErrorResponse | null) {
  if (!payload || !('images' in payload)) {
    return undefined;
  }

  return payload.images?.[0]?.url;
}

function getFalErrorMessage(status: number, payload: FalImageResponse | FalErrorResponse | null) {
  if (payload && 'detail' in payload && payload.detail) {
    if (Array.isArray(payload.detail)) {
      return payload.detail.map((entry) => entry.msg ?? entry.message).filter(Boolean).join(' ');
    }

    return `fal.ai: ${payload.detail}`;
  }

  if (payload && 'error' in payload && payload.error) {
    return `fal.ai: ${payload.error}`;
  }

  if (payload && 'message' in payload && payload.message) {
    return `fal.ai: ${payload.message}`;
  }

  if (status === 401 || status === 403) {
    return 'Cle fal.ai refusee. Verifiez FAL_KEY dans Vercel.';
  }

  if (status === 429) {
    return 'fal.ai limite temporairement les requetes. Reessayez dans un instant.';
  }

  return `fal.ai a renvoye une erreur HTTP ${status}.`;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
