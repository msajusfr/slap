import { Gauge, KeyRound, RotateCcw, WandSparkles } from 'lucide-react';
import { quickVariations } from '../data/styles';
import type { AiProvider, GenerationMode, GenerationSettings, QuickVariation } from '../types';

interface ControlsPanelProps {
  settings: GenerationSettings;
  canGenerate: boolean;
  canUseVariations: boolean;
  isGenerating: boolean;
  error?: string;
  onGenerate: () => void;
  onRetry: () => void;
  onVariation: (variation: QuickVariation) => void;
  onSettingsChange: (settings: GenerationSettings) => void;
}

const providers: AiProvider[] = ['mock', 'openai', 'fal'];
const modes: GenerationMode[] = ['fast', 'quality'];

export function ControlsPanel({
  settings,
  canGenerate,
  canUseVariations,
  isGenerating,
  error,
  onGenerate,
  onRetry,
  onVariation,
  onSettingsChange
}: ControlsPanelProps) {
  return (
    <section className="space-y-4 rounded-[8px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Transformation</h2>
          <p className="text-xs text-slate-400">Provider, rythme et controles fins.</p>
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
        <div className="rounded-[8px] border border-cyan-200/20 bg-cyan-200/8 p-3 text-xs text-cyan-50">
          <span className="flex items-center gap-2 font-medium">
            <KeyRound className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            Cle {settings.provider === 'openai' ? 'OpenAI' : 'fal.ai'} protegee par Vercel
          </span>
          <p className="mt-1 text-slate-300">
            Variable requise: {settings.provider === 'openai' ? 'OPENAI_API_KEY' : 'FAL_KEY'}.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <SliderControl
          label="Intensite"
          value={settings.intensity}
          onChange={(value) => onSettingsChange({ ...settings, intensity: value })}
        />
        <SliderControl
          label="Fidelite au visage"
          value={settings.faceFidelity}
          onChange={(value) => onSettingsChange({ ...settings, faceFidelity: value })}
          hint="Niveau de verrouillage des traits du visage."
        />
        <SliderControl
          label="Force du style"
          value={settings.styleStrength}
          onChange={(value) => onSettingsChange({ ...settings, styleStrength: value })}
        />
        <SliderControl
          label="Creativite"
          value={settings.creativity}
          onChange={(value) => onSettingsChange({ ...settings, creativity: value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PreserveToggle
          label="Sujet intact"
          hint="Mode conservateur: meme personne, corps, vetements et pose."
          checked={settings.preserve.subject}
          onChange={(checked) =>
            onSettingsChange({
              ...settings,
              faceFidelity: checked ? Math.max(settings.faceFidelity, 95) : settings.faceFidelity,
              preserve: {
                ...settings.preserve,
                subject: checked,
                face: checked ? true : settings.preserve.face,
                clothing: checked ? true : settings.preserve.clothing,
                pose: checked ? true : settings.preserve.pose
              }
            })
          }
        />
        <PreserveToggle
          label="Conserver le visage"
          hint="Verrouille seulement l identite et les traits du visage."
          checked={settings.preserve.face}
          disabled={settings.preserve.subject}
          onChange={(checked) => onSettingsChange({ ...settings, preserve: { ...settings.preserve, face: checked } })}
        />
        <PreserveToggle
          label="Conserver les vetements"
          checked={settings.preserve.clothing}
          disabled={settings.preserve.subject}
          onChange={(checked) => onSettingsChange({ ...settings, preserve: { ...settings.preserve, clothing: checked } })}
        />
        <PreserveToggle
          label="Conserver la pose"
          checked={settings.preserve.pose}
          disabled={settings.preserve.subject}
          onChange={(checked) => onSettingsChange({ ...settings, preserve: { ...settings.preserve, pose: checked } })}
        />
        <PreserveToggle
          label="Conserver l arriere-plan"
          checked={settings.preserve.background}
          onChange={(checked) => onSettingsChange({ ...settings, preserve: { ...settings.preserve, background: checked } })}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium text-slate-300">Prompt avance</span>
        <textarea
          value={settings.customPrompt}
          onChange={(event) => onSettingsChange({ ...settings, customPrompt: event.target.value })}
          placeholder="Ajouter des bulles, changer l ambiance, modifier un detail..."
          rows={3}
          className="w-full resize-none rounded-[8px] border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
        />
      </label>

      {canUseVariations && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-300">Variations rapides</p>
          <div className="flex flex-wrap gap-2">
            {quickVariations.map((variation) => (
              <button
                key={variation.id}
                type="button"
                onClick={() => onVariation(variation)}
                disabled={isGenerating}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {variation.label}
              </button>
            ))}
          </div>
        </div>
      )}

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

function SliderControl({
  label,
  value,
  onChange,
  hint
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
        <Gauge className="h-4 w-4 text-cyan-300" aria-hidden="true" />
        {label} {value}%
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
      {hint && <span className="block text-[11px] leading-snug text-slate-500">{hint}</span>}
    </label>
  );
}

function PreserveToggle({
  label,
  hint,
  checked,
  onChange,
  disabled = false
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex min-h-11 items-start gap-2 rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-cyan-300"
      />
      <span>
        <span className="block">{label}</span>
        {hint && <span className="mt-0.5 block leading-snug text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}
