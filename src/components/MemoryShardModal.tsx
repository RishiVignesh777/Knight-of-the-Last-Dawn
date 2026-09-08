import React from 'react';
import { MemoryShard } from '../types';
import { Gem, Sparkles, X } from 'lucide-react';

interface MemoryShardModalProps {
  shard: MemoryShard;
  onClose: () => void;
}

export const MemoryShardModal: React.FC<MemoryShardModalProps> = ({ shard, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-40 select-none animate-fade-in">
      <div className="w-full max-w-lg bg-slate-950 border-2 border-sky-500/80 p-6 rounded shadow-2xl relative text-center">
        {/* Shimmering Top Crystal */}
        <div className="mx-auto w-14 h-14 rounded-full bg-sky-950/80 border-2 border-sky-400 flex items-center justify-center text-sky-300 mb-4 shadow-[0_0_20px_rgba(56,189,248,0.4)] animate-pulse">
          <Gem className="w-7 h-7" />
        </div>

        <div className="flex items-center justify-center gap-1 text-sky-400 text-xs font-retro tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MEMORY SHARD RESTORED</span>
        </div>

        <h2 className="font-cinzel text-xl font-bold text-amber-200 tracking-wider mb-2">
          {shard.title}
        </h2>

        <div className="text-[11px] font-retro text-slate-400 mb-4 pb-2 border-b border-slate-800">
          {shard.areaName} • {shard.timestampHint}
        </div>

        {/* Narrative Memory Excerpt */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded text-left mb-5">
          <p className="font-cinzel italic text-slate-200 text-sm leading-relaxed">
            “{shard.memoryText}”
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-linear-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-retro text-xs rounded border border-sky-400 transition cursor-pointer shadow-lg"
        >
          Absorb Memory [E]
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
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-30 select-none animate-fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-amber-500/60 p-5 rounded shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="font-cinzel text-slate-200 text-sm sm:text-base leading-relaxed my-3 px-2">
          {text}
        </p>

        <button
          onClick={onClose}
          className="mt-2 px-5 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 rounded font-retro text-xs transition cursor-pointer"
        >
          Continue [E]
        </button>
      </div>
    </div>
  );
};
