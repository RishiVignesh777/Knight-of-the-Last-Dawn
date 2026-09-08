import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Zap, Sparkles, Sword, MessageCircle } from 'lucide-react';
import { game } from '../game/gameEngine';

export const ControlsOverlay: React.FC = () => {
  // Mobile touch buttons mapped directly to game.keys
  const handleTouchStart = (key: keyof typeof game.keys) => {
    game.keys[key] = true;
  };

  const handleTouchEnd = (key: keyof typeof game.keys) => {
    game.keys[key] = false;
  };

  return (
    <div className="absolute inset-0 pointer-events-none sm:hidden flex flex-col justify-end p-3 z-20 select-none">
      <div className="flex justify-between items-end w-full">
        {/* D-Pad Left & Right */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onPointerDown={() => handleTouchStart('left')}
            onPointerUp={() => handleTouchEnd('left')}
            onPointerLeave={() => handleTouchEnd('left')}
            className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 active:bg-amber-600/40 flex items-center justify-center text-white backdrop-blur-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => handleTouchStart('right')}
            onPointerUp={() => handleTouchEnd('right')}
            onPointerLeave={() => handleTouchEnd('right')}
            className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 active:bg-amber-600/40 flex items-center justify-center text-white backdrop-blur-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pointer-events-auto">
          {/* Dash */}
          <button
            onPointerDown={() => handleTouchStart('dash')}
            onPointerUp={() => handleTouchEnd('dash')}
            className="w-10 h-10 rounded-full bg-sky-950/80 border border-sky-600 active:bg-sky-600 flex items-center justify-center text-sky-300 font-retro text-[9px]"
          >
            DASH
          </button>

          {/* Block */}
          <button
            onPointerDown={() => handleTouchStart('block')}
            onPointerUp={() => handleTouchEnd('block')}
            className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-600 active:bg-emerald-600 flex items-center justify-center text-emerald-300 font-retro text-[9px]"
          >
            DEF
          </button>

          {/* Interact */}
          <button
            onPointerDown={() => handleTouchStart('interact')}
            onPointerUp={() => handleTouchEnd('interact')}
            className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-600 active:bg-purple-600 flex items-center justify-center text-purple-300 font-retro text-[9px]"
          >
            E
          </button>

          {/* Heavy Attack */}
          <button
            onPointerDown={() => handleTouchStart('attackHeavy')}
            onPointerUp={() => handleTouchEnd('attackHeavy')}
            className="w-11 h-11 rounded-full bg-rose-950/80 border border-rose-600 active:bg-rose-600 flex items-center justify-center text-rose-300 font-retro text-[9px]"
          >
            HVY
          </button>

          {/* Light Attack */}
          <button
            onPointerDown={() => handleTouchStart('attackLight')}
            onPointerUp={() => handleTouchEnd('attackLight')}
            className="w-12 h-12 rounded-full bg-amber-900/80 border border-amber-500 active:bg-amber-500 flex items-center justify-center text-amber-200 font-retro text-[10px]"
          >
            ATK
          </button>

          {/* Jump */}
          <button
            onPointerDown={() => handleTouchStart('jump')}
            onPointerUp={() => handleTouchEnd('jump')}
            className="w-12 h-12 rounded-full bg-indigo-900/80 border border-indigo-500 active:bg-indigo-500 flex items-center justify-center text-indigo-200 font-retro text-[10px]"
          >
            JMP
          </button>
        </div>
      </div>
    </div>
  );
};
