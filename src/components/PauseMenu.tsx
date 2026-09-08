import React, { useState } from 'react';
import { Play, Volume2, VolumeX, BookOpen, Compass, RotateCcw, Monitor } from 'lucide-react';
import { soundEngine } from '../audio/soundManager';
import { PlayerStats, MemoryShard } from '../types';
import { WORLD_AREAS } from '../game/worldData';

interface PauseMenuProps {
  player: PlayerStats;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onResume: () => void;
  onQuitToMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  player,
  crtEnabled,
  onToggleCrt,
  onResume,
  onQuitToMenu
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'controls' | 'codex' | 'sound'>('main');
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const [masterVol, setMasterVol] = useState(0.8);
  const [musicVol, setMusicVol] = useState(0.65);
  const [sfxVol, setSfxVol] = useState(0.85);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', val: number) => {
    if (type === 'master') setMasterVol(val);
    if (type === 'music') setMusicVol(val);
    if (type === 'sfx') setSfxVol(val);
    soundEngine.setVolumes(
      type === 'master' ? val : masterVol,
      type === 'music' ? val : musicVol,
      type === 'sfx' ? val : sfxVol
    );
  };

  // Collect all world shards for codex
  const allShards: MemoryShard[] = Object.values(WORLD_AREAS).flatMap(a => a.memoryShards);

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
      <div className="w-full max-w-lg bg-slate-950 border-2 border-amber-600/70 p-6 rounded shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h2 className="font-cinzel text-lg font-bold text-amber-300 tracking-wider">
            PAUSED
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-2.5 py-1 text-[10px] font-retro rounded border transition cursor-pointer ${
                activeTab === 'main' ? 'bg-amber-600/30 border-amber-400 text-amber-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('codex')}
              className={`px-2.5 py-1 text-[10px] font-retro rounded border transition cursor-pointer ${
                activeTab === 'codex' ? 'bg-amber-600/30 border-amber-400 text-amber-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Codex ({player.memoryShards.length}/5)
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-2.5 py-1 text-[10px] font-retro rounded border transition cursor-pointer ${
                activeTab === 'controls' ? 'bg-amber-600/30 border-amber-400 text-amber-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Controls
            </button>
            <button
              onClick={() => setActiveTab('sound')}
              className={`px-2.5 py-1 text-[10px] font-retro rounded border transition cursor-pointer ${
                activeTab === 'sound' ? 'bg-amber-600/30 border-amber-400 text-amber-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Audio
            </button>
          </div>
        </div>

        {/* Tab 1: Main Menu Options */}
        {activeTab === 'main' && (
          <div className="flex flex-col gap-3 py-2">
            <button
              onClick={onResume}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 rounded font-retro text-xs transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Resume Game</span>
            </button>

            <button
              onClick={onToggleCrt}
              className="flex items-center justify-between px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded font-retro text-xs transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-sky-400" />
                CRT Scanline Shader
              </span>
              <span className={crtEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                {crtEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </button>

            <button
              onClick={handleToggleMute}
              className="flex items-center justify-between px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded font-retro text-xs transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                Audio Mute
              </span>
              <span className={isMuted ? 'text-rose-400' : 'text-emerald-400'}>
                {isMuted ? 'MUTED' : 'ACTIVE'}
              </span>
            </button>

            <button
              onClick={onQuitToMenu}
              className="flex items-center justify-center gap-2 w-full py-2 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/50 rounded font-retro text-xs transition cursor-pointer mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Quit to Main Menu</span>
            </button>
          </div>
        )}

        {/* Tab 2: Lore & Memory Shards Codex */}
        {activeTab === 'codex' && (
          <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5 py-1">
            <p className="font-cinzel text-xs text-slate-300 mb-1">
              Collected memories of Sir Cael and the Fall of Eldoria:
            </p>
            {allShards.map(shard => {
              const unlocked = player.memoryShards.includes(shard.id);
              return (
                <div
                  key={shard.id}
                  className={`p-3 rounded border text-left ${
                    unlocked
                      ? 'bg-slate-900/80 border-sky-500/40'
                      : 'bg-slate-950 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-cinzel font-bold mb-1">
                    <span className={unlocked ? 'text-sky-300' : 'text-slate-500'}>
                      {unlocked ? shard.title : '??? Unknown Memory'}
                    </span>
                    <span className="text-[9px] font-retro text-slate-500">
                      {unlocked ? shard.areaName : 'Locked'}
                    </span>
                  </div>
                  <p className="font-cinzel text-xs text-slate-300 leading-relaxed italic">
                    {unlocked ? `“${shard.memoryText}”` : 'Explore the dying kingdom to discover this memory shard.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Controls Reference */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-2 gap-2 text-xs font-retro py-2">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">A / D</span>
              <span className="text-slate-300 text-[10px]">Move Left / Right</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">SPACE</span>
              <span className="text-slate-300 text-[10px]">Jump (Climb Ledges)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">SHIFT</span>
              <span className="text-slate-300 text-[10px]">Dash (Evade & Gap)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">J</span>
              <span className="text-slate-300 text-[10px]">Light Attack (Fast)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">K</span>
              <span className="text-slate-300 text-[10px]">Heavy Attack (Break)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-amber-400 block mb-1">L</span>
              <span className="text-slate-300 text-[10px]">Block (Parry Guard)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 col-span-2">
              <span className="text-amber-400 block mb-1">E</span>
              <span className="text-slate-300 text-[10px]">Interact (Shrines, NPCs, Murals, Shards)</span>
            </div>
          </div>
        )}

        {/* Tab 4: Audio Volumes */}
        {activeTab === 'sound' && (
          <div className="flex flex-col gap-4 py-2 font-retro text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Master Volume</span>
                <span>{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={e => handleVolumeChange('master', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Music Volume</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={e => handleVolumeChange('music', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>SFX Volume</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={e => handleVolumeChange('sfx', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 border-t border-slate-900 pt-3 flex justify-end">
          <button
            onClick={onResume}
            className="px-4 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 rounded font-retro text-xs transition cursor-pointer"
          >
            Close Menu [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
