import { Clipboard, Download, Share2 } from 'lucide-react';

interface ExportActionsProps {
  hasResult: boolean;
  onDownload: () => void;
  onShare: () => void;
  onCopy: () => void;
}

export function ExportActions({ hasResult, onDownload, onShare, onCopy }: ExportActionsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        title="Telecharger"
        aria-label="Telecharger"
        disabled={!hasResult}
        onClick={onDownload}
        className="flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        title="Partager"
        aria-label="Partager"
        disabled={!hasResult}
        onClick={onShare}
        className="flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        title="Copier"
        aria-label="Copier"
        disabled={!hasResult}
        onClick={onCopy}
        className="flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600"
      >
        <Clipboard className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
