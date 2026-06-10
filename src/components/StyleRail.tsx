import { Heart, Search, Sparkles, WandSparkles } from 'lucide-react';
import { getCategories } from '../services/styleService';
import type { ArtStyle, StyleCategory, StyleRecommendation } from '../types';

interface StyleRailProps {
  styles: ArtStyle[];
  allStyles: ArtStyle[];
  selectedStyleId: string;
  selectedCategory: StyleCategory | 'Tous';
  query: string;
  favoriteStyleIds: string[];
  recentStyleIds: string[];
  recommendations: StyleRecommendation[];
  isRecommending: boolean;
  canRecommend: boolean;
  onQueryChange: (query: string) => void;
  onSelectCategory: (category: StyleCategory | 'Tous') => void;
  onSelectStyle: (style: ArtStyle) => void;
  onToggleFavorite: (styleId: string) => void;
  onRecommend: () => void;
}

export function StyleRail({
  styles,
  allStyles,
  selectedStyleId,
  selectedCategory,
  query,
  favoriteStyleIds,
  recentStyleIds,
  recommendations,
  isRecommending,
  canRecommend,
  onQueryChange,
  onSelectCategory,
  onSelectStyle,
  onToggleFavorite,
  onRecommend
}: StyleRailProps) {
  const categories = getCategories();
  const favoriteStyles = allStyles.filter((style) => favoriteStyleIds.includes(style.id));
  const recentStyles = recentStyleIds
    .map((styleId) => allStyles.find((style) => style.id === styleId))
    .filter((style): style is ArtStyle => Boolean(style));

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
          <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          Styles
        </div>
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher un style..."
            className="h-10 w-full rounded-full border border-white/10 bg-white/[0.05] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
          />
        </div>
      </div>

      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
        {(['Tous', ...categories] as const).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
              selectedCategory === category
                ? 'bg-white text-slate-950'
                : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={onRecommend}
          disabled={!canRecommend || isRecommending}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-200/16 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <WandSparkles className={`h-4 w-4 ${isRecommending ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isRecommending ? 'Analyse...' : 'Styles recommandes'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
          {recommendations.map((recommendation) => (
            <button
              key={recommendation.style.id}
              type="button"
              onClick={() => onSelectStyle(recommendation.style)}
              className="min-w-[220px] rounded-[8px] border border-cyan-200/20 bg-cyan-200/8 p-3 text-left transition hover:bg-cyan-200/12"
            >
              <span className="block text-sm font-semibold text-white">{recommendation.style.name}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-300">{recommendation.reason}</span>
            </button>
          ))}
        </div>
      )}

      {favoriteStyles.length > 0 && (
        <StyleMiniRail title="Favoris" styles={favoriteStyles} onSelectStyle={onSelectStyle} />
      )}

      {recentStyles.length > 0 && (
        <StyleMiniRail title="Recents" styles={recentStyles} onSelectStyle={onSelectStyle} />
      )}

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
        {styles.map((style) => {
          const selected = selectedStyleId === style.id;
          const favorite = favoriteStyleIds.includes(style.id);

          return (
            <article
              key={style.id}
              className={`relative min-w-[152px] rounded-[8px] border p-3 text-left transition ${
                selected
                  ? 'border-white/50 bg-white/[0.14] shadow-glow'
                  : 'border-white/10 bg-white/[0.05] hover:border-white/25 hover:bg-white/[0.08]'
              }`}
              style={{ boxShadow: selected ? `0 0 28px ${style.accent}26` : undefined }}
            >
              <button type="button" onClick={() => onSelectStyle(style)} className="block w-full text-left">
                <span
                  className="mb-4 block h-10 rounded-[6px]"
                  style={{
                    background: `linear-gradient(135deg, ${style.accent}, rgba(255,255,255,0.08))`
                  }}
                />
                <span className="block text-sm font-semibold text-white">{style.name}</span>
                <span className="mt-1 block text-xs text-slate-400">{style.category}</span>
                <span className="mt-2 line-clamp-2 block text-xs leading-5 text-slate-500">{style.description}</span>
              </button>
              <button
                type="button"
                aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                onClick={() => onToggleFavorite(style.id)}
                className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 backdrop-blur-xl transition ${
                  favorite ? 'bg-pink-300 text-slate-950' : 'bg-black/35 text-white hover:bg-white/20'
                }`}
              >
                <Heart className="h-4 w-4" fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StyleMiniRail({
  title,
  styles,
  onSelectStyle
}: {
  title: string;
  styles: ArtStyle[];
  onSelectStyle: (style: ArtStyle) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-xs font-semibold text-slate-300">{title}</p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-1">
        {styles.map((style) => (
          <button
            key={`${title}-${style.id}`}
            type="button"
            onClick={() => onSelectStyle(style)}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
}
