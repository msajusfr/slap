import { Gauge, KeyRound, RotateCcw, WandSparkles } from 'lucide-react';
import type { AiProvider, GenerationMode, GenerationSettings } from '../types';

interface ControlsPanelProps {
  settings: GenerationSettings;
  canGenerate: boolean;
  isGenerating: boolean;
  error?: string;
  onGenerate: () => void;
  onRetry: () => void;
  onSettingsChange: (settings: GenerationSettings) => void;
}

const providers: AiProvider[] = ['mock', 'openai', 'fal'];
const modes: GenerationMode[] = ['fast', 'quality'];

export function ControlsPanel({
  settings,
  canGenerate,
  isGenerating,
  error,
  onGenerate,
  onRetry,
  onSettingsChange
}: ControlsPanelProps) {
  return (
    <section className="space-y-4 rounded-[8px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Transformation</h2>
          <p className="text-xs text-slate-400">Provider, intensite et prompt avance.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-white/10 bg-black/20 p-1">
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSettingsChange({ ...settings, mode })}
              className={`rounded-full px-3 py-1.5 text-xs capitalize transition ${
                settings.mode === mode ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Gauge className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          Intensite {settings.intensity}%
        </span>
        <input
          type="range"
          min="20"
          max="100"
          value={settings.intensity}
          onChange={(event) => onSettingsChange({ ...settings, intensity: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        {providers.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => onSettingsChange({ ...settings, provider })}
            className={`rounded-[8px] border px-3 py-2 text-xs uppercase transition ${
              settings.provider === provider
                ? 'border-cyan-200/60 bg-cyan-200/12 text-cyan-50'
                : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>

      {settings.provider !== 'mock' && (
        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <KeyRound className="h-4 w-4 text-violet-300" aria-hidden="true" />
            Cle API locale
          </span>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(event) => onSettingsChange({ ...settings, apiKey: event.target.value })}
            placeholder="sk-... ou fal-key"
            className="w-full rounded-[8px] border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
          />
        </label>
      )}

      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-300">Prompt avance</span>
        <textarea
          value={settings.customPrompt}
          onChange={(event) => onSettingsChange({ ...settings, customPrompt: event.target.value })}
          placeholder="Ajouter une intention, un decor, une humeur..."
          rows={3}
          className="w-full resize-none rounded-[8px] border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
        />
      </label>

      {error && (
        <div className="rounded-[8px] border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-100">
          <p>{error}</p>
          <button type="button" onClick={onRetry} className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-white">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reessayer
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
      >
        <WandSparkles className="h-5 w-5" aria-hidden="true" />
        {isGenerating ? 'Generation...' : 'Generer'}
      </button>
    </section>
  );
}
