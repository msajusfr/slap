import { Images, Trash2 } from 'lucide-react';
import type { SourcePhoto } from '../types';

interface SourceLibraryProps {
  sources: SourcePhoto[];
  activeSourceId?: string;
  onSelect: (source: SourcePhoto) => void;
  onDelete: (sourceId: string) => void;
}

export function SourceLibrary({ sources, activeSourceId, onSelect, onDelete }: SourceLibraryProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1 text-sm font-semibold text-white">
        <Images className="h-4 w-4 text-cyan-300" aria-hidden="true" />
        Photos sources
      </div>

      {sources.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm text-slate-400">
          Les photos importees resteront ici pour relancer plusieurs essais.
        </div>
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
          {sources.map((source) => {
            const active = activeSourceId === source.id;

            return (
              <article
                key={source.id}
                className={`relative min-w-[128px] overflow-hidden rounded-[8px] border bg-white/[0.05] ${
                  active ? 'border-cyan-200/70 shadow-glow' : 'border-white/10'
                }`}
              >
                <button type="button" onClick={() => onSelect(source)} className="block w-full text-left">
                  <img src={source.dataUrl} alt={source.label} className="h-28 w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-xs font-semibold text-white">{source.label}</p>
                    <p className="text-[11px] text-slate-500">{new Date(source.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </button>
                <button
                  type="button"
                  title="Supprimer cette source"
                  aria-label="Supprimer cette source"
                  onClick={() => onDelete(source.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-xl transition hover:bg-rose-400/80 hover:text-slate-950"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
