import { Camera, ImagePlus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface PhotoDropzoneProps {
  imageUrl?: string;
  resultUrl?: string;
  compareValue: number;
  isGenerating: boolean;
  progress: number;
  progressLabel: string;
  onFile: (file: File) => void;
  onCompareChange: (value: number) => void;
}

export function PhotoDropzone({
  imageUrl,
  resultUrl,
  compareValue,
  isGenerating,
  progress,
  progressLabel,
  onFile,
  onCompareChange
}: PhotoDropzoneProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasImage = Boolean(imageUrl);

  function readFiles(files: FileList | null) {
    const file = files?.[0];
    if (file?.type.startsWith('image/')) {
      onFile(file);
    }
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
          <div className="relative h-full w-full overflow-hidden">
            <img src={imageUrl} alt="Photo source" className="h-full w-full object-contain" />
            {resultUrl && (
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}>
                <img src={resultUrl} alt="Resultat stylise" className="h-full w-full object-contain" />
              </div>
            )}
            {resultUrl && (
              <div className="absolute inset-x-4 bottom-4 rounded-full border border-white/15 bg-black/45 px-3 py-2 backdrop-blur-xl">
                <input
                  aria-label="Comparer avant apres"
                  type="range"
                  min="0"
                  max="100"
                  value={compareValue}
                  onChange={(event) => onCompareChange(Number(event.target.value))}
                  className="h-1 w-full accent-cyan-300"
                />
              </div>
            )}
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
