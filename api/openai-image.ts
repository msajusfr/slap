const OPENAI_IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = getEnv('OPENAI_API_KEY');

    if (!apiKey) {
      return jsonError('OPENAI_API_KEY est absente des variables d environnement Vercel.', 500);
    }

    const incoming = await request.formData();
    const image = incoming.get('image');
    const prompt = String(incoming.get('prompt') ?? '').trim();
    const mode = incoming.get('mode') === 'quality' ? 'quality' : 'fast';
    const surfaceOnly = incoming.get('surfaceOnly') === 'true';

    if (!(image instanceof Blob)) {
      return jsonError('Image manquante dans la requete.', 400);
    }

    if (!prompt) {
      return jsonError('Prompt manquant dans la requete.', 400);
    }

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('image', image, 'source.jpg');
    formData.append('prompt', surfaceOnly ? buildOpenAiIdentityLockedPrompt(prompt) : prompt);
    formData.append('size', mode === 'quality' ? '1536x1024' : '1024x1024');
    formData.append('quality', mode === 'quality' ? 'high' : 'medium');
    formData.append('output_format', 'jpeg');

    const response = await fetch(OPENAI_IMAGE_EDIT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });

    const payload = (await response.json().catch(() => null)) as OpenAiImageResponse | null;

    if (!response.ok) {
      return jsonError(getOpenAiErrorMessage(response.status, payload), response.status);
    }

    const firstImage = payload?.data?.[0];
    if (!firstImage?.b64_json && !firstImage?.url) {
      return jsonError('OpenAI n a pas renvoye d image exploitable.', 502);
    }

    return Response.json({
      imageDataUrl: firstImage.b64_json ? `data:image/jpeg;base64,${firstImage.b64_json}` : firstImage.url
    });
  } catch (error) {
    console.error('openai-image function failed', error);
    return jsonError('Generation OpenAI impossible pour le moment.', 500);
  }
}

interface OpenAiImageResponse {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
    type?: string;
  };
}

function getEnv(name: string) {
  const runtime = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return runtime.process?.env?.[name]?.trim();
}

function getOpenAiErrorMessage(status: number, payload: OpenAiImageResponse | null) {
  const apiMessage = payload?.error?.message;

  if (apiMessage) {
    return `OpenAI: ${apiMessage}`;
  }

  if (status === 401) {
    return 'Cle OpenAI refusee. Verifiez OPENAI_API_KEY dans Vercel.';
  }

  if (status === 429) {
    return 'OpenAI limite temporairement les requetes. Reessayez dans un instant.';
  }

  return `OpenAI a renvoye une erreur HTTP ${status}.`;
}

function buildOpenAiIdentityLockedPrompt(prompt: string) {
  return [
    'IDENTITY-LOCKED STYLE TRANSFER.',
    'The person, face geometry, expression, age, body, hair, clothes, pose, and visible identity must remain the same as the input image.',
    'Do not beautify, recast, replace, age, de-age, reshape, repaint, or redesign the character.',
    'Only change the visual rendering layer: line work, charcoal/ink/paint texture, color grading, lighting mood, contrast, grain, and atmosphere.',
    'The final image must still be immediately recognizable as the exact same person and scene.',
    prompt
  ].join('\n');
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
