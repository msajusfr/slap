import { useMemo, useState } from 'react';
import { Bolt, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { ControlsPanel } from '../components/ControlsPanel';
import { ExportActions } from '../components/ExportActions';
import { HistoryStrip } from '../components/HistoryStrip';
import { PhotoDropzone } from '../components/PhotoDropzone';
import { StyleRail } from '../components/StyleRail';
import { artStyles } from '../data/styles';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateImage } from '../services/ai';
import { compressImage, copyImageToClipboard, downloadDataUrl, shareImage } from '../services/image';
import type { Creation, GenerationSettings, StyleCategory } from '../types';

const defaultSettings: GenerationSettings = {
  provider: 'mock',
  apiKey: '',
  intensity: 72,
  mode: 'fast',
  customPrompt: ''
};

export function Home() {
  const [sourceUrl, setSourceUrl] = useLocalStorage<string>('slap.source', '');
  const [resultUrl, setResultUrl] = useLocalStorage<string>('slap.result', '');
  const [settings, setSettings] = useLocalStorage<GenerationSettings>('slap.settings', defaultSettings);
  const [creations, setCreations] = useLocalStorage<Creation[]>('slap.creations', []);
  const [selectedStyleId, setSelectedStyleId] = useLocalStorage<string>('slap.style', artStyles[0].id);
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory | 'Tous'>('Tous');
  const [compareValue, setCompareValue] = useState(55);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const selectedStyle = useMemo(
    () => artStyles.find((style) => style.id === selectedStyleId) ?? artStyles[0],
    [selectedStyleId]
  );

  async function handleFile(file: File) {
    try {
      setError('');
      setToast('Compression image');
      const compressed = await compressImage(file);
      setSourceUrl(compressed);
      setResultUrl('');
      setCompareValue(55);
      setToast('Photo prete');
      window.setTimeout(() => setToast(''), 1500);
    } catch (importError) {
      setToast('');
      setError(importError instanceof Error ? importError.message : 'Import image impossible.');
    }
  }

  async function runGeneration() {
    if (!sourceUrl || isGenerating) {
      return;
    }

    const controller = new AbortController();
    setError('');
    setIsGenerating(true);
    setProgress(0);
    setProgressLabel('Demarrage');

    try {
      const response = await generateImage({
        imageDataUrl: sourceUrl,
        style: selectedStyle,
        settings,
        signal: controller.signal,
        onProgress: (value, message) => {
          setProgress(value);
          setProgressLabel(message);
        }
      });

      setResultUrl(response.imageDataUrl);
      setCompareValue(58);

      const creation: Creation = {
        id: crypto.randomUUID(),
        sourceUrl,
        resultUrl: response.imageDataUrl,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        createdAt: Date.now(),
        favorite: false
      };

      setCreations((currentCreations) => [creation, ...currentCreations].slice(0, 18));
      setToast('Generation terminee');
      window.setTimeout(() => setToast(''), 1800);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Generation impossible.');
    } finally {
      setIsGenerating(false);
    }
  }

  function selectCreation(creation: Creation) {
    setSourceUrl(creation.sourceUrl);
    setResultUrl(creation.resultUrl);
    setSelectedStyleId(creation.styleId);
    setCompareValue(58);
  }

  function toggleFavorite(id: string) {
    setCreations((currentCreations) =>
      currentCreations.map((creation) =>
        creation.id === id ? { ...creation, favorite: !creation.favorite } : creation
      )
    );
  }

  async function handleShare() {
    if (!resultUrl) {
      return;
    }

    try {
      await shareImage(resultUrl, `slap-${selectedStyle.id}.jpg`);
    } catch (shareError) {
      setToast(shareError instanceof Error ? shareError.message : 'Partage indisponible');
    }
  }

  async function handleCopy() {
    if (!resultUrl) {
      return;
    }

    try {
      await copyImageToClipboard(resultUrl);
      setToast('Image copiee');
    } catch (copyError) {
      setToast(copyError instanceof Error ? copyError.message : 'Copie indisponible');
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b18] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(41,211,255,0.14),transparent_28%),radial-gradient(circle_at_84%_14%,rgba(166,122,255,0.16),transparent_28%),linear-gradient(180deg,#070b18_0%,#0d1020_52%,#090b12_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">
        <header className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-cyan-200/30 bg-cyan-200/10 shadow-glow">
              <Bolt className="h-5 w-5 text-cyan-100" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">Slap</h1>
              <p className="text-xs text-slate-400 sm:text-sm">Studio photo IA instantane</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/8 px-3 py-2 text-xs text-emerald-100 sm:flex">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Local-first
          </div>
        </header>

        <div className="grid min-w-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_390px]">
          <div className="min-w-0 space-y-5">
            <PhotoDropzone
              imageUrl={sourceUrl}
              resultUrl={resultUrl}
              compareValue={compareValue}
              isGenerating={isGenerating}
              progress={progress}
              progressLabel={progressLabel}
              onFile={handleFile}
              onCompareChange={setCompareValue}
            />

            <StyleRail
              styles={artStyles}
              selectedStyleId={selectedStyle.id}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectStyle={(style) => setSelectedStyleId(style.id)}
            />
          </div>

          <aside className="min-w-0 space-y-4">
            <ControlsPanel
              settings={settings}
              canGenerate={Boolean(sourceUrl)}
              isGenerating={isGenerating}
              error={error}
              onGenerate={runGeneration}
              onRetry={runGeneration}
              onSettingsChange={setSettings}
            />
            <ExportActions
              hasResult={Boolean(resultUrl)}
              onDownload={() => resultUrl && downloadDataUrl(resultUrl, `slap-${selectedStyle.id}.jpg`)}
              onShare={handleShare}
              onCopy={handleCopy}
            />
            <HistoryStrip
              creations={creations}
              onSelect={selectCreation}
              onToggleFavorite={toggleFavorite}
              onClear={() => setCreations([])}
            />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <button
          type="button"
          onClick={runGeneration}
          disabled={!sourceUrl || isGenerating}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-bold text-slate-950 transition disabled:bg-white/20 disabled:text-white/40"
        >
          <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isGenerating ? 'Generation...' : `Generer ${selectedStyle.name}`}
        </button>
      </div>

      {toast && (
        <div className="fixed left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-slate-950/82 px-4 py-2 text-sm text-white shadow-glow backdrop-blur-xl">
          <Check className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          {toast}
        </div>
      )}
    </main>
  );
}
