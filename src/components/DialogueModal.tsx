import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface DialogueModalProps {
  npcName: string;
  npcTitle: string;
  lines: string[];
  currentLine: number;
  onNext: () => void;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  npcName,
  npcTitle,
  lines,
  currentLine,
  onNext,
  onClose
}) => {
  const isLastLine = currentLine >= lines.length - 1;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-30 select-none animate-fade-in">
      <div className="w-full max-w-xl bg-slate-950 border-2 border-amber-600/70 p-5 rounded shadow-2xl relative">
        {/* Speaker Badge */}
        <div className="flex items-center gap-2.5 mb-3 border-b border-slate-800 pb-2.5">
          <div className="w-9 h-9 rounded bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-amber-300 text-sm tracking-wider">{npcName}</h3>
            <span className="font-retro text-[10px] text-slate-400">{npcTitle}</span>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="font-cinzel text-slate-100 text-sm sm:text-base leading-relaxed min-h-16 py-2">
          “{lines[currentLine]}”
        </div>

        {/* Footer Navigation */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-900 pt-3">
          <span className="font-retro text-[10px] text-slate-500">
            {currentLine + 1} of {lines.length}
          </span>
          <button
            onClick={isLastLine ? onClose : onNext}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 rounded font-retro text-xs transition cursor-pointer"
          >
            <span>{isLastLine ? 'Close [E]' : 'Continue [E]'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
