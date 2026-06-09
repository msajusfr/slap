import { Sparkles } from 'lucide-react';
import { categories } from '../data/styles';
import type { ArtStyle, StyleCategory } from '../types';

interface StyleRailProps {
  styles: ArtStyle[];
  selectedStyleId: string;
  selectedCategory: StyleCategory | 'Tous';
  onSelectCategory: (category: StyleCategory | 'Tous') => void;
  onSelectStyle: (style: ArtStyle) => void;
}

export function StyleRail({
  styles,
  selectedStyleId,
  selectedCategory,
  onSelectCategory,
  onSelectStyle
}: StyleRailProps) {
  const visibleStyles =
    selectedCategory === 'Tous' ? styles : styles.filter((style) => style.category === selectedCategory);

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
          <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          Styles
        </div>
        <div className="flex max-w-[70%] gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1">
          {(['Tous', ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
                selectedCategory === category
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
        {visibleStyles.map((style) => {
          const selected = selectedStyleId === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style)}
              className={`min-w-[136px] rounded-[8px] border p-3 text-left transition ${
                selected
                  ? 'border-white/50 bg-white/[0.14] shadow-glow'
                  : 'border-white/10 bg-white/[0.05] hover:border-white/25 hover:bg-white/[0.08]'
              }`}
              style={{ boxShadow: selected ? `0 0 28px ${style.accent}26` : undefined }}
            >
              <span
                className="mb-4 block h-10 rounded-[6px]"
                style={{
                  background: `linear-gradient(135deg, ${style.accent}, rgba(255,255,255,0.08))`
                }}
              />
              <span className="block text-sm font-semibold text-white">{style.name}</span>
              <span className="mt-1 block text-xs text-slate-400">{style.category}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
