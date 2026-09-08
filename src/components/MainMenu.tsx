import React, { useState, useEffect } from 'react';
import { soundEngine } from '../audio/soundManager';

interface MainMenuProps {
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ hasSave, onNewGame, onContinue }) => {
  const [showStory, setShowStory] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const [selectedIdx, setSelectedIdx] = useState(hasSave ? 0 : 1);

  // Menu items list
  const menuItems = [
    ...(hasSave ? [{ id: 'continue', label: 'CONTINUE JOURNEY' }] : []),
    { id: 'new', label: hasSave ? 'NEW JOURNEY (RESET)' : 'BEGIN JOURNEY' },
    { id: 'story', label: 'PROLOGUE' },
    { id: 'controls', label: 'CONTROLS' }
  ];

  // Keyboard navigation for authentic 8-bit feel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showStory || showControls) {
        if (e.code === 'Escape' || e.code === 'Space' || e.code === 'KeyE') {
          setShowStory(false);
          setShowControls(false);
          soundEngine.playMenuBeep(false);
        }
        return;
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        setSelectedIdx(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
        soundEngine.playMenuBeep(false);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setSelectedIdx(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
        soundEngine.playMenuBeep(false);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        triggerSelected(selectedIdx);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showStory, showControls, selectedIdx, menuItems.length]);

  const triggerSelected = (idx: number) => {
    const item = menuItems[idx];
    if (!item) return;

    soundEngine.playMenuBeep(true);
    if (item.id === 'continue') {
      onContinue();
    } else if (item.id === 'new') {
      onNewGame();
    } else if (item.id === 'story') {
      setShowStory(true);
    } else if (item.id === 'controls') {
      setShowControls(true);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-6 select-none font-mono">
      {/* Top Header */}
      <div className="w-full max-w-2xl flex items-center justify-between z-10">
        <div className="bg-[#0b0714] border-2 border-[#f8a020] px-2.5 py-1 text-[#f8a020] text-[10px] sm:text-xs tracking-widest shadow-[2px_2px_0px_#000000]">
          ELDORIA - 1989
        </div>

        <button
          onClick={handleToggleMute}
          className="bg-[#0b0714] border-2 border-[#f8f8f8] px-2.5 py-1 text-[10px] sm:text-xs text-[#f8f8f8] hover:bg-[#303030] cursor-pointer shadow-[2px_2px_0px_#000000]"
        >
          SOUND: {isMuted ? 'OFF' : 'ON'}
        </button>
      </div>

      {/* Center 8-Bit Title Box */}
      <div className="z-10 text-center my-auto max-w-lg w-full flex flex-col items-center">
        {/* Title Badge */}
        <div className="bg-[#0b0714] border-2 border-[#f83800] px-3 py-1 text-[#f83800] text-[9px] sm:text-[10px] tracking-widest uppercase mb-3 shadow-[2px_2px_0px_#000000]">
          THE HEART OF DAWN HAS SHATTERED
        </div>

        {/* 8-Bit Title */}
        <div className="bg-[#0b0714] border-4 border-[#f8a020] p-3 sm:p-5 w-full shadow-[4px_4px_0px_#000000] mb-6">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#f8f870] tracking-widest drop-shadow-[2px_2px_0px_#c86810] uppercase">
            KNIGHT OF THE
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#f8a020] tracking-widest drop-shadow-[2px_2px_0px_#702008] uppercase mt-1">
            LAST DAWN
          </h2>
        </div>

        {/* 8-Bit Menu Options with Blinking Cursor */}
        <div className="bg-[#0b0714] border-2 border-[#f8f8f8] p-4 w-full max-w-xs shadow-[4px_4px_0px_#000000] flex flex-col gap-2.5 text-left">
          {menuItems.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  triggerSelected(idx);
                }}
                onMouseEnter={() => setSelectedIdx(idx)}
                className={`flex items-center gap-2 py-1.5 px-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer text-left ${
                  isSelected
                    ? 'text-[#f8f870] bg-[#303030]'
                    : 'text-[#c0c0c0] hover:text-[#f8f8f8]'
                }`}
              >
                <span className={`w-3 ${isSelected ? 'opacity-100 text-[#f83800]' : 'opacity-0'}`}>
                  ▶
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-2xl flex items-center justify-between text-[#909090] text-[9px] z-10 border-t border-[#303030] pt-2">
        <span>© 1989 ELDORIA SOFT</span>
        <span>KEYBOARD & GAMEPAD READY</span>
      </div>

      {/* Story Prologue Modal (8-Bit Dialogue Box) */}
      {showStory && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#0b0714] border-4 border-[#f8a020] p-4 sm:p-5 shadow-[4px_4px_0px_#000000] text-left">
            <div className="flex items-center justify-between border-b-2 border-[#585858] pb-2 mb-3">
              <span className="text-[#f8a020] font-bold text-xs uppercase tracking-wider">
                PROLOGUE: THE SHATTERED HEART
              </span>
              <button
                onClick={() => setShowStory(false)}
                className="text-[#f83800] text-xs font-bold hover:text-white cursor-pointer"
              >
                [X]
              </button>
            </div>
            <div className="space-y-2.5 text-[11px] text-[#c0c0c0] leading-relaxed max-h-60 overflow-y-auto">
              <p>
                The kingdom of <strong className="text-[#f8f870]">Eldoria</strong> was once protected by a magical crystal called the <strong className="text-[#f8a020]">Heart of Dawn</strong>.
              </p>
              <p>
                One night, the ward shattered. Creeping darkness consumed the realms, corrupting ancient knights and forest guardians.
              </p>
              <p className="p-2 bg-[#181818] border border-[#f8a020] text-[#f8f870]">
                "WHEN THE FINAL LIGHT REACHES THE TOWER, REMEMBER WHAT YOU PROMISED."
              </p>
              <p>
                As <strong className="text-[#88d8f8]">Sir Cael</strong>, traverse 5 ruined provinces to reach the Tower of Dawn before the last light vanishes forever.
              </p>
            </div>
            <button
              onClick={() => setShowStory(false)}
              className="mt-4 w-full py-2 bg-[#f8a020] hover:bg-[#f8f870] text-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              RETURN TO TITLE
            </button>
          </div>
        </div>
      )}

      {/* Controls Modal (8-Bit Double-Line Box) */}
      {showControls && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#0b0714] border-4 border-[#58a8f8] p-4 sm:p-5 shadow-[4px_4px_0px_#000000] text-left">
            <div className="flex items-center justify-between border-b-2 border-[#585858] pb-2 mb-3">
              <span className="text-[#58a8f8] font-bold text-xs uppercase tracking-wider">
                8-BIT CONTROLS
              </span>
              <button
                onClick={() => setShowControls(false)}
                className="text-[#f83800] text-xs font-bold hover:text-white cursor-pointer"
              >
                [X]
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">A / D or ◄ / ►</span>
                <span className="text-[#909090]">WALK LEFT / RIGHT</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">SPACE</span>
                <span className="text-[#909090]">JUMP / CLIMB</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">SHIFT</span>
                <span className="text-[#909090]">DASH EVADE</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">J</span>
                <span className="text-[#909090]">LIGHT SLASH</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">K</span>
                <span className="text-[#909090]">HEAVY CLEAVE</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030]">
                <span className="text-[#f8a020] block font-bold">L</span>
                <span className="text-[#909090]">SHIELD BLOCK</span>
              </div>
              <div className="bg-[#181818] p-2 border border-[#303030] col-span-2">
                <span className="text-[#f8a020] block font-bold">E</span>
                <span className="text-[#909090]">INTERACT (SHRINE, NPC, SHARD, DOOR)</span>
              </div>
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="mt-4 w-full py-2 bg-[#58a8f8] hover:bg-[#88d8f8] text-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              RETURN TO TITLE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
