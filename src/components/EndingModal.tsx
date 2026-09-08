import React from 'react';
import { EndingType } from '../types';

interface EndingModalProps {
  isChoicePhase: boolean;
  chosenEnding: EndingType | null;
  epilogueLines: string[];
  currentStep: number;
  onSelectEnding: (choice: EndingType) => void;
  onNextStep: () => void;
  onRestartGame: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  isChoicePhase,
  chosenEnding,
  epilogueLines,
  currentStep,
  onSelectEnding,
  onNextStep,
  onRestartGame
}) => {
  const isFinalStep = currentStep >= epilogueLines.length - 1;

  if (isChoicePhase) {
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 select-none font-mono">
        <div className="w-full max-w-xl bg-[#0b0714] border-4 border-[#f8a020] p-5 sm:p-6 shadow-[6px_6px_0px_#000000] text-center">
          {/* 8-bit Crystal Icon */}
          <div className="w-6 h-6 mx-auto mb-2 rotate-45 bg-[#f8f870] border-2 border-black shadow-[0_0_8px_#f8a020]" />

          <div className="text-[#f8a020] text-[10px] font-bold tracking-widest uppercase">
            SUMMIT OF THE TOWER OF DAWN
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#f8f8f8] tracking-widest uppercase mt-1 mb-3">
            THE FINAL CHOICE
          </h1>

          <p className="text-[#c0c0c0] text-xs leading-relaxed max-w-lg mx-auto mb-5">
            THE DYING KING HAS FALLEN. BEFORE YOU RESTS THE SHATTERED HEART OF DAWN.
            ITS LIGHT CANNOT BE REPAIRED—IT CAN ONLY BE TRANSFERRED INTO A LIVING SOUL, OR SHATTERED FOREVER.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Option 1: Sacrifice */}
            <button
              onClick={() => onSelectEnding(EndingType.SACRIFICE)}
              className="p-3 bg-[#181818] hover:bg-[#303030] border-2 border-[#f8a020] transition cursor-pointer flex flex-col justify-between shadow-[2px_2px_0px_#000000]"
            >
              <div>
                <div className="text-[#f8a020] font-bold text-xs uppercase mb-1">
                  ENDING I: SACRIFICE
                </div>
                <p className="text-[10px] text-[#c0c0c0] leading-relaxed">
                  SURRENDER SIR CAEL'S LIFE TO BECOME THE NEW SUN AND RESTORE ELDORIA'S DAWN.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-[#f8f870] font-bold">
                FULFILL THE VOW ▶
              </div>
            </button>

            {/* Option 2: The New Dawn */}
            <button
              onClick={() => onSelectEnding(EndingType.NEW_DAWN)}
              className="p-3 bg-[#181818] hover:bg-[#303030] border-2 border-[#58a8f8] transition cursor-pointer flex flex-col justify-between shadow-[2px_2px_0px_#000000]"
            >
              <div>
                <div className="text-[#58a8f8] font-bold text-xs uppercase mb-1">
                  ENDING II: NEW DAWN
                </div>
                <p className="text-[10px] text-[#c0c0c0] leading-relaxed">
                  SHATTER THE CORRUPTED CORE. BREAK THE CYCLE OF SACRIFICE AND WALK FORWARD AS MORTAL.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-[#88d8f8] font-bold">
                BREAK THE CYCLE ▶
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Epilogue Sequence
  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="w-full max-w-xl bg-[#0b0714] border-4 border-[#f8a020] p-5 sm:p-6 shadow-[6px_6px_0px_#000000] text-center">
        <div className="text-[10px] text-[#f8a020] font-bold tracking-widest uppercase mb-1">
          {chosenEnding === EndingType.SACRIFICE ? 'ENDING I: THE ETERNAL SACRIFICE' : 'ENDING II: THE HONEST SUNRISE'}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#f8f8f8] tracking-widest uppercase mb-4">
          KNIGHT OF THE LAST DAWN
        </h2>

        {/* 8-bit Epilogue Box */}
        <div className="bg-[#181818] border-2 border-[#585858] p-4 text-left min-h-24 mb-4">
          <p className="text-[#f8f8f8] text-xs sm:text-sm leading-relaxed tracking-wide">
            "{epilogueLines[currentStep]}"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#909090]">
            {currentStep + 1}/{epilogueLines.length}
          </span>

          {!isFinalStep ? (
            <button
              onClick={onNextStep}
              className="px-4 py-1.5 bg-[#f8a020] hover:bg-[#f8f870] text-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              NEXT [SPACE] ▶
            </button>
          ) : (
            <button
              onClick={onRestartGame}
              className="px-4 py-2 bg-[#f8a020] hover:bg-[#f8f870] text-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              RETURN TO TITLE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
