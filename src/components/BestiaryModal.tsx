import React, { useEffect, useRef } from 'react';
import { BestiaryEntry } from '../game/bestiaryData';
import { soundEngine } from '../audio/soundManager';

interface BestiaryModalProps {
  entry: BestiaryEntry;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const BestiaryModal: React.FC<BestiaryModalProps> = ({
  entry,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Pixel Art Portrait Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const time = (now - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      entry.drawPortrait(ctx, canvas.width, canvas.height, time);

      // Ornate Wrought-Iron Inner Filigree Border on the Canvas
      ctx.strokeStyle = '#3c1d0c';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

      ctx.strokeStyle = '#ecc25e';
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [entry]);

  // Keyboard navigation for Prev/Next and Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'KeyB') {
        soundEngine.playMenuBeep(false);
        onClose();
      } else if ((e.key === 'ArrowLeft' || e.code === 'KeyA') && hasPrev && onPrev) {
        soundEngine.playMenuBeep(true);
        onPrev();
      } else if ((e.key === 'ArrowRight' || e.code === 'KeyD') && hasNext && onNext) {
        soundEngine.playMenuBeep(true);
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-5 z-50 select-none font-mono">
      <div className="w-full max-w-xl bg-[#0b0714] border-4 border-[#f8a020] shadow-[8px_8px_0px_#000000] p-4 sm:p-6 flex flex-col gap-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#585858] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rotate-45 bg-[#f8a020] border border-black shadow-[0_0_4px_#f8a020]" />
            <span className="text-[#f8a020] text-xs font-extrabold uppercase tracking-widest">
              BESTIARY CODEX
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 border"
              style={{
                borderColor: entry.threatColor,
                color: entry.threatColor,
                backgroundColor: 'rgba(0,0,0,0.6)'
              }}
            >
              THREAT: {entry.threatLevel.toUpperCase()}
            </span>
            <button
              onClick={() => {
                soundEngine.playMenuBeep(false);
                onClose();
              }}
              className="px-2 py-0.5 bg-[#181818] hover:bg-[#303030] text-[#909090] hover:text-[#f8f8f8] border border-[#585858] text-[10px] uppercase font-bold cursor-pointer"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Creature Profile: Portrait + Lore Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Pixel-Art Animated Portrait Frame */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-1 bg-[#181818] border-2 border-[#ecc25e] shadow-[4px_4px_0px_#000000]">
              <canvas
                ref={canvasRef}
                width={128}
                height={128}
                className="w-32 h-32 sm:w-36 sm:h-36 pixelated block bg-black"
              />
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#f8a020] border border-black" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#f8a020] border border-black" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#f8a020] border border-black" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#f8a020] border border-black" />
            </div>
            <div className="text-[9px] text-[#909090] mt-2 uppercase tracking-wider text-center">
              16-BIT ARCHIVAL RENDERING
            </div>
          </div>

          {/* Identity & Vital Statistics */}
          <div className="sm:col-span-7 flex flex-col gap-2">
            <div>
              <h3 className="text-[#f8f870] text-base sm:text-lg font-extrabold uppercase tracking-wide drop-shadow-[1px_1px_0px_#000000]">
                {entry.name}
              </h3>
              <p className="text-[#88d8f8] text-[10px] font-semibold tracking-wider uppercase">
                {entry.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 bg-[#140e22] border border-[#3c1d0c] p-2 text-[10px]">
              <div>
                <span className="text-[#909090] block text-[9px] uppercase">CLASS:</span>
                <span className="text-[#f8f8f8] font-bold">{entry.category}</span>
              </div>
              <div>
                <span className="text-[#909090] block text-[9px] uppercase">ESTIMATED HP:</span>
                <span className="text-[#f83800] font-bold">{entry.hpEstimate}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#302040]">
                <span className="text-[#909090] block text-[9px] uppercase">KNOWN DOMAIN:</span>
                <span className="text-[#ecc25e] font-medium leading-tight">{entry.habitat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Lore Excerpt */}
        <div className="bg-[#120a1c] border-2 border-[#585858] p-3 text-left">
          <div className="flex items-center gap-1.5 text-[#ecc25e] text-[9px] font-bold uppercase tracking-wider mb-1.5">
            <span>CHRONICLE EXCERPT</span>
          </div>
          <p className="text-[#dcd8e6] text-xs leading-relaxed tracking-wide italic font-serif">
            "{entry.loreDescription}"
          </p>
        </div>

        {/* Combat Tactics & Weakness Advice */}
        <div className="bg-[#181818] border border-[#58a8f8] p-2.5 text-left">
          <div className="text-[#58a8f8] text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#58a8f8] inline-block" />
            <span>TACTICAL COMBAT REPORT</span>
          </div>
          <p className="text-[#c0c0c0] text-[11px] leading-relaxed">
            {entry.tacticalNotes}
          </p>
        </div>

        {/* Footer Navigation & Controls */}
        <div className="border-t border-[#303030] pt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (hasPrev && onPrev) {
                  soundEngine.playMenuBeep(true);
                  onPrev();
                }
              }}
              disabled={!hasPrev}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold border-2 transition ${
                hasPrev
                  ? 'bg-[#181818] hover:bg-[#303030] text-[#f8f8f8] border-[#585858] cursor-pointer'
                  : 'bg-[#101010] text-[#505050] border-[#252525] cursor-not-allowed opacity-50'
              }`}
            >
              PREV [A / ←]
            </button>
            <button
              onClick={() => {
                if (hasNext && onNext) {
                  soundEngine.playMenuBeep(true);
                  onNext();
                }
              }}
              disabled={!hasNext}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold border-2 transition ${
                hasNext
                  ? 'bg-[#181818] hover:bg-[#303030] text-[#f8f8f8] border-[#585858] cursor-pointer'
                  : 'bg-[#101010] text-[#505050] border-[#252525] cursor-not-allowed opacity-50'
              }`}
            >
              NEXT [D / →]
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playMenuBeep(false);
              onClose();
            }}
            className="px-4 py-1.5 bg-[#f8a020] hover:bg-[#f8f870] text-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            RETURN TO GAME [B]
          </button>
        </div>
      </div>
    </div>
  );
};
