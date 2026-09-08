import React, { useState } from 'react';
import { EndingType } from '../types';
import { Sun, Shield, Sparkles, Sword, RotateCcw } from 'lucide-react';

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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
        <div className="w-full max-w-2xl bg-slate-950 border-2 border-amber-500/80 p-6 sm:p-8 rounded shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
            <Sun className="w-8 h-8 animate-spin-slow" />
          </div>

          <span className="font-retro text-xs text-amber-400 tracking-widest uppercase">The Summit of Dawn</span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 tracking-wider mt-1 mb-3">
            The Final Choice
          </h1>

          <p className="font-cinzel text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            The Dying King has fallen. Before you rests the shattered core of the Heart of Dawn.
            Its golden light cannot be repaired—it can only be transferred into a living soul, or broken forever.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Ending 1 Option: Sacrifice */}
            <button
              onClick={() => onSelectEnding(EndingType.SACRIFICE)}
              className="group p-4 bg-slate-900/90 hover:bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 rounded transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-base mb-1">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>ENDING I: SACRIFICE</span>
                </div>
                <p className="font-cinzel text-xs text-slate-300 leading-relaxed">
                  Surrender Sir Cael’s life to transfer the remaining light into his soul, restoring the golden sun over Eldoria.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-retro text-amber-400/80 group-hover:text-amber-300">
                Fulfill the Ancient Oath →
              </div>
            </button>

            {/* Ending 2 Option: The New Dawn */}
            <button
              onClick={() => onSelectEnding(EndingType.NEW_DAWN)}
              className="group p-4 bg-slate-900/90 hover:bg-sky-950/40 border border-sky-500/40 hover:border-sky-400 rounded transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-sky-400 font-cinzel font-bold text-base mb-1">
                  <Sword className="w-5 h-5 text-sky-300" />
                  <span>ENDING II: THE NEW DAWN</span>
                </div>
                <p className="font-cinzel text-xs text-slate-300 leading-relaxed">
                  Shatter the corrupted crystal forever. Refuse martyrdom and allow the kingdom to rebuild through mortal hands.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-retro text-sky-400/80 group-hover:text-sky-300">
                Break the Cycle →
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Epilogue Sequence & Credits
  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      <div className="w-full max-w-xl bg-slate-950 border border-amber-500/60 p-6 sm:p-8 rounded shadow-2xl text-center">
        <div className="text-xs font-retro text-amber-400 tracking-widest uppercase mb-2">
          {chosenEnding === EndingType.SACRIFICE ? 'Ending I — The Eternal Flame' : 'Ending II — The New Dawn'}
        </div>

        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 tracking-wider mb-6">
          Knight of the Last Dawn
        </h2>

        {/* Epilogue Text Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded text-left min-h-28 mb-6">
          <p className="font-cinzel text-slate-200 text-sm sm:text-base leading-relaxed">
            {epilogueLines[currentStep]}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-retro text-[10px] text-slate-500">
            {currentStep + 1} of {epilogueLines.length}
          </span>

          {!isFinalStep ? (
            <button
              onClick={onNextStep}
              className="px-5 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/60 rounded font-retro text-xs transition cursor-pointer"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onRestartGame}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-retro font-bold text-xs rounded border border-amber-400 shadow-lg transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Title</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
