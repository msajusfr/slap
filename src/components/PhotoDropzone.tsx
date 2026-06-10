import { Camera, ImagePlus, LocateFixed, Minus, Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import type { CropState } from '../types';

interface PhotoDropzoneProps {
  imageUrl?: string;
  crop: CropState;
  isGenerating: boolean;
  progress: number;
  progressLabel: string;
  onFile: (file: File) => void;
  onCropChange: (crop: CropState) => void;
  onResetCrop: () => void;
}

interface PointerSnapshot {
  id: number;
  x: number;
  y: number;
}

export function PhotoDropzone({
  imageUrl,
  crop,
  isGenerating,
  progress,
  progressLabel,
  onFile,
  onCropChange,
  onResetCrop
}: PhotoDropzoneProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pointersRef = useRef<PointerSnapshot[]>([]);
  const gestureRef = useRef<{ crop: CropState; distance: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasImage = Boolean(imageUrl);

  function readFiles(files: FileList | null) {
    const file = files?.[0];
    if (file?.type.startsWith('image/')) {
      onFile(file);
    }
  }

  function updateZoom(nextZoom: number) {
    onCropChange({
      ...crop,
      zoom: clamp(nextZoom, 1, 4)
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasImage) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current = [
      ...pointersRef.current.filter((pointer) => pointer.id !== event.pointerId),
      { id: event.pointerId, x: event.clientX, y: event.clientY }
    ];

    if (pointersRef.current.length === 2) {
      gestureRef.current = {
        crop,
        distance: getDistance(pointersRef.current[0], pointersRef.current[1])
      };
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const pointerIndex = pointersRef.current.findIndex((pointer) => pointer.id === event.pointerId);

    if (pointerIndex < 0 || !hasImage) {
      return;
    }

    const previousPointer = pointersRef.current[pointerIndex];
    pointersRef.current[pointerIndex] = { id: event.pointerId, x: event.clientX, y: event.clientY };

    if (pointersRef.current.length >= 2 && gestureRef.current) {
      const distance = getDistance(pointersRef.current[0], pointersRef.current[1]);
      const zoom = clamp(gestureRef.current.crop.zoom * (distance / gestureRef.current.distance), 1, 4);
      onCropChange({ ...crop, zoom });
      return;
    }

    const deltaX = event.clientX - previousPointer.x;
    const deltaY = event.clientY - previousPointer.y;
    const sensitivity = 0.85 / crop.zoom / 320;

    onCropChange({
      ...crop,
      centerX: clamp(crop.centerX - deltaX * sensitivity, 0, 1),
      centerY: clamp(crop.centerY - deltaY * sensitivity, 0, 1)
    });
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current = pointersRef.current.filter((pointer) => pointer.id !== event.pointerId);
    gestureRef.current = null;
  }

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        readFiles(event.dataTransfer.files);
      }}
      className={`relative overflow-hidden rounded-[8px] border bg-slate-950/58 shadow-violet transition ${
        isDragging ? 'border-cyan-300/70' : 'border-white/12'
      }`}
    >
      <div className="aspect-[4/5] max-h-[68vh] min-h-[360px] w-full sm:aspect-[16/11]">
        {hasImage ? (
          <div
            className="relative h-full w-full touch-none overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-[background-size,background-position] duration-75"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `${crop.centerX * 100}% ${crop.centerY * 100}%`,
                backgroundSize: `${crop.zoom * 100}%`
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:33.333%_33.333%]" />
            <div className="pointer-events-none absolute inset-4 rounded-[8px] border border-white/70 shadow-[0_0_0_999px_rgba(0,0,0,0.22)]" />
            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs text-white backdrop-blur-xl">
              Cadrer avec le doigt ou pincer
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/10 text-cyan-100 shadow-glow">
              <Upload className="h-8 w-8" aria-hidden="true" />
            </span>
            <span className="max-w-xs text-balance text-2xl font-semibold text-white">Deposez une photo ou importez depuis votre galerie</span>
            <span className="text-sm text-slate-400">Camera mobile, fichiers locaux et glisser-deposer desktop.</span>
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="absolute inset-x-4 top-4 rounded-[8px] border border-cyan-200/20 bg-slate-950/76 p-3 backdrop-blur-2xl">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-200">
            <span>{progressLabel}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 transition-all"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-3">
        {hasImage && (
          <>
            <button
              type="button"
              aria-label="Zoom arriere"
              title="Zoom arriere"
              onClick={() => updateZoom(crop.zoom - 0.15)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Recentrer le cadrage"
              title="Recentrer le cadrage"
              onClick={onResetCrop}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <LocateFixed className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Zoom avant"
              title="Zoom avant"
              onClick={() => updateZoom(crop.zoom + 0.15)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="Prendre une photo"
          title="Prendre une photo"
          onClick={() => cameraInputRef.current?.click()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl transition hover:bg-white/20"
        >
          <Camera className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Importer une image"
          title="Importer une image"
          onClick={() => importInputRef.current?.click()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-xl transition hover:bg-white/20"
        >
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <input
        ref={importInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => readFiles(event.currentTarget.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => readFiles(event.currentTarget.files)}
      />
    </section>
  );
}

function getDistance(first: PointerSnapshot, second: PointerSnapshot) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
