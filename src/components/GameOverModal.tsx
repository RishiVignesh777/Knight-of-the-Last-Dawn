import React from 'react';

interface GameOverModalProps {
  onRespawn: () => void;
  onQuitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ onRespawn, onQuitToMenu }) => {
  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-50 select-none font-mono">
      {/* 8-Bit NES Game Over Window */}
      <div className="w-full max-w-md bg-[#0b0714] border-4 border-[#d82838] p-6 shadow-[6px_6px_0px_#000000] text-center">
        {/* 8-bit skull pixel art */}
        <div className="w-8 h-8 mx-auto mb-3 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 8 8" className="shape-rendering-crispEdges">
            <path d="M2,0 H6 V1 H7 V4 H6 V5 H5 V6 H3 V5 H2 V4 H1 V1 H2 Z" fill="#f8f8f8" />
            <rect x="2" y="2" width="1" height="2" fill="#0b0714" />
            <rect x="5" y="2" width="1" height="2" fill="#0b0714" />
            <rect x="3" y="6" width="2" height="2" fill="#f8f8f8" />
          </svg>
        </div>

        <div className="text-[#f83800] text-xs font-bold tracking-widest uppercase mb-1">
          THE LAST LIGHT FADES
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#d82838] tracking-widest uppercase mb-3 drop-shadow-[2px_2px_0px_#400010]">
          GAME OVER
        </h1>

        <p className="text-[#c0c0c0] text-[11px] leading-relaxed mb-6 px-2">
          SIR CAEL HAS FALLEN. YET THE PROMISE OF THE LAST DAWN REMAINS UNFULFILLED.
        </p>

        <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
          <button
            onClick={onRespawn}
            className="w-full py-2.5 bg-[#f8a020] hover:bg-[#f8f870] text-black font-extrabold text-xs uppercase tracking-wider border-2 border-[#f8f8f8] shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            CONTINUE [SPACE]
          </button>

          <button
            onClick={onQuitToMenu}
            className="w-full py-2 bg-[#181818] hover:bg-[#303030] text-[#909090] hover:text-[#f8f8f8] font-bold text-xs uppercase tracking-wider border-2 border-[#585858] shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            RETURN TO TITLE
          </button>
        </div>
      </div>
    </div>
  );
};
