import React from 'react';
import { game } from '../game/gameEngine';

export const ControlsOverlay: React.FC = () => {
  const handleTouchStart = (key: keyof typeof game.keys) => {
    game.keys[key] = true;
  };

  const handleTouchEnd = (key: keyof typeof game.keys) => {
    game.keys[key] = false;
  };

  return (
    <div className="absolute inset-0 pointer-events-none sm:hidden flex flex-col justify-end p-2 z-30 select-none font-mono">
      <div className="flex justify-between items-end w-full">
        {/* 8-bit D-Pad Left & Right */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onPointerDown={() => handleTouchStart('left')}
            onPointerUp={() => handleTouchEnd('left')}
            onPointerLeave={() => handleTouchEnd('left')}
            className="w-12 h-12 bg-[#181818] border-2 border-[#585858] active:bg-[#f8a020] active:text-black flex items-center justify-center text-[#f8f8f8] text-sm font-bold shadow-[2px_2px_0px_#000000]"
          >
            ◀
          </button>
          <button
            onPointerDown={() => handleTouchStart('right')}
            onPointerUp={() => handleTouchEnd('right')}
            onPointerLeave={() => handleTouchEnd('right')}
            className="w-12 h-12 bg-[#181818] border-2 border-[#585858] active:bg-[#f8a020] active:text-black flex items-center justify-center text-[#f8f8f8] text-sm font-bold shadow-[2px_2px_0px_#000000]"
          >
            ▶
          </button>
        </div>

        {/* 8-bit Arcade Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pointer-events-auto">
          {/* Dash */}
          <button
            onPointerDown={() => handleTouchStart('dash')}
            onPointerUp={() => handleTouchEnd('dash')}
            className="w-10 h-10 bg-[#181818] border-2 border-[#58a8f8] active:bg-[#58a8f8] active:text-black flex items-center justify-center text-[#88d8f8] text-[9px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            DSH
          </button>

          {/* Block */}
          <button
            onPointerDown={() => handleTouchStart('block')}
            onPointerUp={() => handleTouchEnd('block')}
            className="w-10 h-10 bg-[#181818] border-2 border-[#58c868] active:bg-[#58c868] active:text-black flex items-center justify-center text-[#58c868] text-[9px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            DEF
          </button>

          {/* Interact */}
          <button
            onPointerDown={() => handleTouchStart('interact')}
            onPointerUp={() => handleTouchEnd('interact')}
            className="w-10 h-10 bg-[#181818] border-2 border-[#f8f870] active:bg-[#f8f870] active:text-black flex items-center justify-center text-[#f8f870] text-[9px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            ACT
          </button>

          {/* Heavy Attack */}
          <button
            onPointerDown={() => handleTouchStart('attackHeavy')}
            onPointerUp={() => handleTouchEnd('attackHeavy')}
            className="w-11 h-11 bg-[#181818] border-2 border-[#f83800] active:bg-[#f83800] active:text-black flex items-center justify-center text-[#f83800] text-[9px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            HVY
          </button>

          {/* Light Attack */}
          <button
            onPointerDown={() => handleTouchStart('attackLight')}
            onPointerUp={() => handleTouchEnd('attackLight')}
            className="w-11 h-11 bg-[#181818] border-2 border-[#f8a020] active:bg-[#f8a020] active:text-black flex items-center justify-center text-[#f8a020] text-[10px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            ATK
          </button>

          {/* Jump */}
          <button
            onPointerDown={() => handleTouchStart('jump')}
            onPointerUp={() => handleTouchEnd('jump')}
            className="w-11 h-11 bg-[#181818] border-2 border-[#f8f8f8] active:bg-[#f8f8f8] active:text-black flex items-center justify-center text-[#f8f8f8] text-[10px] font-bold shadow-[2px_2px_0px_#000000]"
          >
            JMP
          </button>
        </div>
      </div>
    </div>
  );
};
