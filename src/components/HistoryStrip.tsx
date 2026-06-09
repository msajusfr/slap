import { Heart, ImageOff, Trash2 } from 'lucide-react';
import type { Creation } from '../types';

interface HistoryStripProps {
  creations: Creation[];
  onSelect: (creation: Creation) => void;
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
}

export function HistoryStrip({ creations, onSelect, onToggleFavorite, onClear }: HistoryStripProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-white">Historique recent</h2>
        {creations.length > 0 && (
          <button
            type="button"
            title="Vider l historique"
            aria-label="Vider l historique"
            onClick={onClear}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {creations.length === 0 ? (
        <div className="flex items-center gap-3 rounded-[8px] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm text-slate-400">
          <ImageOff className="h-5 w-5 text-slate-500" aria-hidden="true" />
          Vos generations apparaitront ici.
        </div>
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
          {creations.map((creation) => (
            <article
              key={creation.id}
              className="group relative min-w-[132px] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.05]"
            >
              <button type="button" onClick={() => onSelect(creation)} className="block w-full text-left">
                <img src={creation.resultUrl} alt={creation.styleName} className="h-36 w-full object-cover" />
                <div className="p-2">
                  <p className="truncate text-xs font-semibold text-white">{creation.styleName}</p>
                  <p className="text-[11px] text-slate-500">{new Date(creation.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </button>
              <button
                type="button"
                title="Favori"
                aria-label="Favori"
                onClick={() => onToggleFavorite(creation.id)}
                className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 backdrop-blur-xl transition ${
                  creation.favorite ? 'bg-pink-400/85 text-slate-950' : 'bg-black/35 text-white hover:bg-white/20'
                }`}
              >
                <Heart className="h-4 w-4" fill={creation.favorite ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
