const MAX_IMAGE_SIZE = 1800;
const JPEG_QUALITY = 0.86;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossible de lire cette image.'));
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  return resizeImageDataUrl(dataUrl, MAX_IMAGE_SIZE, JPEG_QUALITY);
}

export function resizeImageDataUrl(dataUrl: string, maxSize = MAX_IMAGE_SIZE, quality = JPEG_QUALITY): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas indisponible sur ce navigateur.'));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    image.onerror = () => reject(new Error('Image invalide.'));
    image.src = dataUrl;
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export async function copyImageToClipboard(dataUrl: string) {
  if (!navigator.clipboard || !('ClipboardItem' in window)) {
    throw new Error('Copie image non supportee par ce navigateur.');
  }

  const blob = await dataUrlToBlob(dataUrl);
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
}

export async function shareImage(dataUrl: string, filename: string) {
  if (!navigator.share) {
    throw new Error('Partage natif non supporte par ce navigateur.');
  }

  const blob = await dataUrlToBlob(dataUrl);
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'Creation Slap',
      text: 'Image stylisee avec Slap',
      files: [file]
    });
    return;
  }

  await navigator.share({
    title: 'Creation Slap',
    text: 'Image stylisee avec Slap'
  });
}
