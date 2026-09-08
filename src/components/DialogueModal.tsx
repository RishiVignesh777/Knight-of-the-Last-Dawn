import React from 'react';

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
    <div className="absolute inset-0 bg-black/60 flex items-end sm:items-center justify-center p-4 z-40 select-none font-mono">
      {/* 8-Bit NES Dialogue Box */}
      <div className="w-full max-w-xl bg-[#0b0714] border-4 border-[#f8f8f8] p-4 shadow-[4px_4px_0px_#000000] relative">
        {/* Speaker Name Tag */}
        <div className="flex items-center justify-between border-b-2 border-[#585858] pb-2 mb-3">
          <div className="flex items-center gap-2">
            {/* 8-bit avatar icon */}
            <div className="w-6 h-6 bg-[#303030] border-2 border-[#f8a020] flex items-center justify-center text-[10px] text-[#f8f870]">
              NPC
            </div>
            <div>
              <span className="text-[#f8a020] font-bold text-xs uppercase tracking-wider block">
                {npcName}
              </span>
              <span className="text-[#909090] text-[9px] uppercase">
                {npcTitle}
              </span>
            </div>
          </div>
          <span className="text-[#909090] text-[9px]">
            {currentLine + 1}/{lines.length}
          </span>
        </div>

        {/* 8-Bit Stepped Dialogue Text */}
        <div className="text-[#f8f8f8] text-xs sm:text-sm leading-relaxed min-h-16 py-2 tracking-wide">
          "{lines[currentLine]}"
        </div>

        {/* Footer Navigation */}
        <div className="mt-3 flex items-center justify-end border-t border-[#303030] pt-2">
          <button
            onClick={isLastLine ? onClose : onNext}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#181818] border-2 border-[#f8a020] hover:bg-[#303030] text-[#f8f870] text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer shadow-[2px_2px_0px_#000000]"
          >
            <span>{isLastLine ? 'CLOSE [E]' : 'NEXT [E]'}</span>
            <span className="animate-pulse">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};
