import React from 'react';
import { MemoryShard } from '../types';

interface MemoryShardModalProps {
  shard: MemoryShard;
  onClose: () => void;
}

export const MemoryShardModal: React.FC<MemoryShardModalProps> = ({ shard, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-40 select-none font-mono">
      <div className="w-full max-w-lg bg-[#0b0714] border-4 border-[#58a8f8] p-5 shadow-[6px_6px_0px_#000000] text-center">
        {/* 8-bit Shard Icon */}
        <div className="mx-auto w-6 h-6 rotate-45 bg-[#88d8f8] border-2 border-black mb-3 shadow-[0_0_8px_#58a8f8]" />

        <div className="text-[#58a8f8] text-[10px] font-bold tracking-widest uppercase mb-1">
          MEMORY SHARD RECOVERED
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#f8f870] tracking-wider uppercase mb-1">
          {shard.title}
        </h2>

        <div className="text-[9px] text-[#909090] mb-3 pb-2 border-b border-[#303030] uppercase">
          {shard.areaName} • {shard.timestampHint}
        </div>

        {/* Narrative Memory Excerpt in 8-bit box */}
        <div className="bg-[#181818] border-2 border-[#585858] p-3 text-left mb-4">
          <p className="text-[#f8f8f8] text-xs leading-relaxed tracking-wide">
            "{shard.memoryText}"
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#58a8f8] hover:bg-[#88d8f8] text-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] cursor-pointer"
        >
          ABSORB MEMORY [E]
        </button>
      </div>
    </div>
  );
};

interface LandmarkModalProps {
  text: string;
  onClose: () => void;
}

export const LandmarkModal: React.FC<LandmarkModalProps> = ({ text, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-40 select-none font-mono">
      <div className="w-full max-w-md bg-[#0b0714] border-4 border-[#f8a020] p-4 shadow-[4px_4px_0px_#000000] text-center">
        <p className="text-[#f8f870] text-xs sm:text-sm leading-relaxed my-3 px-2 tracking-wide uppercase">
          {text}
        </p>

        <button
          onClick={onClose}
          className="mt-2 px-5 py-1.5 bg-[#f8a020] hover:bg-[#f8f870] text-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000000] cursor-pointer"
        >
          CONTINUE [E]
        </button>
      </div>
    </div>
  );
};
