import React from 'react';
import { Skull, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  onRespawn: () => void;
  onQuitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ onRespawn, onQuitToMenu }) => {
  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      <div className="w-full max-w-md bg-slate-950 border-2 border-rose-900/80 p-6 sm:p-8 rounded shadow-2xl text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.4)]">
          <Skull className="w-7 h-7" />
        </div>

        <span className="font-retro text-[10px] text-rose-400 tracking-widest uppercase">The Darkness Overcomes</span>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 tracking-wider mt-1 mb-2">
          The Dawn Has Fallen
        </h1>

        <p className="font-cinzel text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
          Sir Cael falls in the dying lands of Eldoria. Yet the vow engraved upon your armor still beckons from the last shrine.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRespawn}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-retro font-bold text-xs rounded border border-amber-400 shadow-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Awaken at Shrine [Space]</span>
          </button>

          <button
            onClick={onQuitToMenu}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-retro text-xs rounded border border-slate-800 transition cursor-pointer"
          >
            Return to Title
          </button>
        </div>
      </div>
    </div>
  );
};
