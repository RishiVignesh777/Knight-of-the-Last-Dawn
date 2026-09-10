import React, { useState, useEffect, useRef } from 'react';
import { BESTIARY_ENTRIES, BestiaryEntry } from '../game/bestiaryData';
import { BestiaryModal } from './BestiaryModal';
import { soundEngine } from '../audio/soundManager';

interface BestiaryProps {
  discoveredEnemyIds: string[];
  onClose: () => void;
  initialSelectedId?: string | null;
}

// Mini Animated Portrait Preview for the Grid Cards
const MiniPortraitCanvas: React.FC<{ entry: BestiaryEntry; isHovered: boolean }> = ({ entry, isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [entry]);

  return (
    <div className={`relative w-16 h-16 bg-[#181818] border-2 transition ${isHovered ? 'border-[#ecc25e]' : 'border-[#443852]'}`}>
      <canvas ref={canvasRef} width={64} height={64} className="w-full h-full pixelated block" />
    </div>
  );
};

export const Bestiary: React.FC<BestiaryProps> = ({
  discoveredEnemyIds,
  onClose,
  initialSelectedId
}) => {
  const [filter, setFilter] = useState<'all' | 'discovered' | 'unknown'>('all');
  const [activeModalEntry, setActiveModalEntry] = useState<BestiaryEntry | null>(() => {
    if (initialSelectedId) {
      return BESTIARY_ENTRIES.find(e => e.id === initialSelectedId || e.aliases.includes(initialSelectedId as any)) || null;
    }
    return null;
  });

  const isDiscovered = (entry: BestiaryEntry) => {
    return (
      discoveredEnemyIds.includes(entry.id) ||
      entry.aliases.some(alias => discoveredEnemyIds.includes(alias))
    );
  };

  const discoveredEntries = BESTIARY_ENTRIES.filter(isDiscovered);
  const totalEntries = BESTIARY_ENTRIES.length;
  const discoveredCount = discoveredEntries.length;
  const percentage = Math.round((discoveredCount / totalEntries) * 100);

  const filteredEntries = BESTIARY_ENTRIES.filter(entry => {
    const discovered = isDiscovered(entry);
    if (filter === 'discovered') return discovered;
    if (filter === 'unknown') return !discovered;
    return true;
  });

  // Cycle navigation inside the modal
  const handleNextCreature = () => {
    if (!activeModalEntry) return;
    const currentIndex = discoveredEntries.findIndex(e => e.id === activeModalEntry.id);
    if (currentIndex >= 0 && currentIndex < discoveredEntries.length - 1) {
      setActiveModalEntry(discoveredEntries[currentIndex + 1]);
    }
  };

  const handlePrevCreature = () => {
    if (!activeModalEntry) return;
    const currentIndex = discoveredEntries.findIndex(e => e.id === activeModalEntry.id);
    if (currentIndex > 0) {
      setActiveModalEntry(discoveredEntries[currentIndex - 1]);
    }
  };

  const activeIndex = activeModalEntry
    ? discoveredEntries.findIndex(e => e.id === activeModalEntry.id)
    : -1;

  // Keyboard shortcut to close Bestiary
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.code === 'KeyB') && !activeModalEntry) {
        soundEngine.playMenuBeep(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeModalEntry]);

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-5 z-45 select-none font-mono">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0b0714] border-4 border-[#f8a020] shadow-[8px_8px_0px_#000000] p-4 sm:p-6 flex flex-col overflow-hidden">
        {/* Bestiary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#585858] pb-3 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rotate-45 bg-[#ecc25e] border border-black shadow-[0_0_6px_#f8a020]" />
              <h2 className="text-[#f8f870] text-sm sm:text-base font-extrabold uppercase tracking-widest drop-shadow-[1px_1px_0px_#000000]">
                BESTIARY OF ELDORIA
              </h2>
            </div>
            <p className="text-[10px] text-[#909090] mt-0.5 uppercase tracking-wider">
              Chronicles of the Cursed Fiends & Fallen Knights
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Discovery Progress Meter */}
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-bold text-[#ecc25e] tracking-wider">
                DISCOVERED: {discoveredCount} / {totalEntries} [{percentage}%]
              </div>
              <div className="w-32 h-2.5 bg-[#181818] border border-black flex gap-0.5 p-0.5 mt-0.5">
                {BESTIARY_ENTRIES.map((entry, idx) => {
                  const unlocked = isDiscovered(entry);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full ${unlocked ? 'bg-[#ecc25e]' : 'bg-[#252525]'}`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playMenuBeep(false);
                onClose();
              }}
              className="px-3 py-1.5 bg-[#181818] hover:bg-[#303030] text-[#f8f8f8] hover:text-[#f8a020] border-2 border-[#585858] text-[10px] uppercase font-bold cursor-pointer"
            >
              CLOSE [ESC / B]
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex gap-2 mb-3 border-b border-[#303030] pb-2">
          <button
            onClick={() => {
              soundEngine.playMenuBeep(true);
              setFilter('all');
            }}
            className={`px-3 py-1 text-[10px] uppercase font-bold border-2 transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#f8a020] text-black border-[#f8f8f8]'
                : 'bg-[#181818] text-[#909090] border-[#303030]'
            }`}
          >
            ALL CREATURES ({totalEntries})
          </button>
          <button
            onClick={() => {
              soundEngine.playMenuBeep(true);
              setFilter('discovered');
            }}
            className={`px-3 py-1 text-[10px] uppercase font-bold border-2 transition cursor-pointer ${
              filter === 'discovered'
                ? 'bg-[#ecc25e] text-black border-[#f8f8f8]'
                : 'bg-[#181818] text-[#909090] border-[#303030]'
            }`}
          >
            DISCOVERED ({discoveredCount})
          </button>
          <button
            onClick={() => {
              soundEngine.playMenuBeep(true);
              setFilter('unknown');
            }}
            className={`px-3 py-1 text-[10px] uppercase font-bold border-2 transition cursor-pointer ${
              filter === 'unknown'
                ? 'bg-[#821628] text-[#f8f8f8] border-[#f8f8f8]'
                : 'bg-[#181818] text-[#909090] border-[#303030]'
            }`}
          >
            UNDISCOVERED ({totalEntries - discoveredCount})
          </button>
        </div>

        {/* Bestiary Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEntries.map(entry => {
            const discovered = isDiscovered(entry);

            if (!discovered) {
              return (
                <div
                  key={entry.id}
                  className="bg-[#0e0a16] border-2 border-[#2b2438] p-3 flex gap-3 items-center opacity-60 text-left"
                >
                  <div className="w-16 h-16 bg-[#14101e] border-2 border-[#322a42] flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-[#4c3e64]">?</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#64567e] text-xs font-bold uppercase tracking-wider">
                      ??? UNKNOWN
                    </span>
                    <span className="text-[#4c3e64] text-[9px] uppercase mt-0.5">
                      SHROUDED IN ECLIPSE
                    </span>
                    <p className="text-[9px] text-[#55476d] mt-1 leading-tight">
                      Encounter this fiend in the shadows of Eldoria to reveal its portrait and lore.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={entry.id}
                onClick={() => {
                  soundEngine.playMenuBeep(true);
                  setActiveModalEntry(entry);
                }}
                className="group bg-[#140e22] hover:bg-[#1f1533] border-2 border-[#483a5e] hover:border-[#ecc25e] p-3 flex gap-3 items-center cursor-pointer transition shadow-[2px_2px_0px_#000000]"
              >
                <MiniPortraitCanvas entry={entry} isHovered={false} />

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[#f8f870] group-hover:text-[#ecc25e] text-xs font-extrabold uppercase tracking-wide truncate">
                      {entry.name}
                    </span>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.2 border shrink-0 uppercase"
                      style={{
                        borderColor: entry.threatColor,
                        color: entry.threatColor
                      }}
                    >
                      {entry.threatLevel}
                    </span>
                  </div>

                  <span className="text-[#88d8f8] text-[9px] uppercase truncate">
                    {entry.category}
                  </span>

                  <div className="text-[8px] text-[#909090] mt-1 flex items-center gap-1 truncate">
                    <span>DOM:</span>
                    <span className="text-[#c0c0c0] truncate">{entry.habitat}</span>
                  </div>

                  <div className="text-[9px] text-[#ecc25e] mt-1.5 font-bold tracking-wider uppercase group-hover:underline flex items-center gap-1">
                    <span>INSPECT CODEX</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-[#303030] pt-2 mt-3 flex items-center justify-between text-[9px] text-[#909090]">
          <span>TIP: CLICK ANY DISCOVERED CREATURE TO INSPECT FULL 16-BIT PORTRAIT & LORE</span>
          <span>PRESS [B] TO TOGGLE BESTIARY AT ANY TIME</span>
        </div>

        {/* Detailed Portrait & Lore Modal */}
        {activeModalEntry && (
          <BestiaryModal
            entry={activeModalEntry}
            onClose={() => setActiveModalEntry(null)}
            onPrev={handlePrevCreature}
            onNext={handleNextCreature}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex >= 0 && activeIndex < discoveredEntries.length - 1}
          />
        )}
      </div>
    </div>
  );
};
