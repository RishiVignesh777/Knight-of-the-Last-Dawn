import React, { useState } from 'react';
import { soundEngine } from '../audio/soundManager';
import { PlayerStats, MemoryShard } from '../types';
import { WORLD_AREAS } from '../game/worldData';
import { BESTIARY_ENTRIES, BestiaryEntry } from '../game/bestiaryData';
import { BestiaryModal } from './BestiaryModal';

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
  const [activeTab, setActiveTab] = useState<'main' | 'controls' | 'codex' | 'bestiary' | 'sound'>('main');
  const [inspectedEntry, setInspectedEntry] = useState<BestiaryEntry | null>(null);
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

  const allShards: MemoryShard[] = Object.values(WORLD_AREAS).flatMap(a => a.memoryShards);

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="w-full max-w-lg bg-[#0b0714] border-4 border-[#f8a020] p-5 shadow-[6px_6px_0px_#000000]">
        {/* 8-bit Pause Header */}
        <div className="flex items-center justify-between border-b-2 border-[#585858] pb-3 mb-4">
          <h2 className="text-[#f8f870] text-sm sm:text-base font-extrabold uppercase tracking-widest drop-shadow-[1px_1px_0px_#000000]">
            PAUSE
          </h2>
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-2 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
                activeTab === 'main'
                  ? 'bg-[#f8a020] text-black border-[#f8f8f8]'
                  : 'bg-[#181818] text-[#909090] border-[#303030]'
              }`}
            >
              MENU
            </button>
            <button
              onClick={() => setActiveTab('codex')}
              className={`px-2 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
                activeTab === 'codex'
                  ? 'bg-[#58a8f8] text-black border-[#f8f8f8]'
                  : 'bg-[#181818] text-[#909090] border-[#303030]'
              }`}
            >
              SHARDS ({player.memoryShards.length}/5)
            </button>
            <button
              onClick={() => setActiveTab('bestiary')}
              className={`px-2 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
                activeTab === 'bestiary'
                  ? 'bg-[#ecc25e] text-black border-[#f8f8f8]'
                  : 'bg-[#181818] text-[#909090] border-[#303030]'
              }`}
            >
              BESTIARY ({(player.discoveredEnemies || []).length}/9)
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-2 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
                activeTab === 'controls'
                  ? 'bg-[#f8a020] text-black border-[#f8f8f8]'
                  : 'bg-[#181818] text-[#909090] border-[#303030]'
              }`}
            >
              KEYS
            </button>
            <button
              onClick={() => setActiveTab('sound')}
              className={`px-2 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
                activeTab === 'sound'
                  ? 'bg-[#f8a020] text-black border-[#f8f8f8]'
                  : 'bg-[#181818] text-[#909090] border-[#303030]'
              }`}
            >
              AUDIO
            </button>
          </div>
        </div>

        {/* Tab 1: Main Menu Options */}
        {activeTab === 'main' && (
          <div className="flex flex-col gap-2.5 py-1">
            <button
              onClick={onResume}
              className="w-full py-2.5 bg-[#f8a020] hover:bg-[#f8f870] text-black font-extrabold text-xs uppercase tracking-wider border-2 border-[#f8f8f8] shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              RESUME GAME [ESC]
            </button>

            <button
              onClick={onToggleCrt}
              className="flex items-center justify-between px-3 py-2 bg-[#181818] hover:bg-[#303030] text-[#f8f8f8] border-2 border-[#585858] text-xs uppercase cursor-pointer"
            >
              <span>CRT SCANLINES</span>
              <span className={crtEnabled ? 'text-[#58c868] font-bold' : 'text-[#909090]'}>
                {crtEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={handleToggleMute}
              className="flex items-center justify-between px-3 py-2 bg-[#181818] hover:bg-[#303030] text-[#f8f8f8] border-2 border-[#585858] text-xs uppercase cursor-pointer"
            >
              <span>CHIPTUNE AUDIO</span>
              <span className={isMuted ? 'text-[#d82838] font-bold' : 'text-[#58c868] font-bold'}>
                {isMuted ? 'MUTED' : 'ENABLED'}
              </span>
            </button>

            <button
              onClick={onQuitToMenu}
              className="w-full py-2 bg-[#181818] hover:bg-[#303030] text-[#d82838] hover:text-[#f83800] border-2 border-[#d82838] text-xs uppercase font-bold tracking-wider cursor-pointer mt-2"
            >
              QUIT TO TITLE
            </button>
          </div>
        )}

        {/* Tab 2: Lore & Memory Shards Codex */}
        {activeTab === 'codex' && (
          <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2 py-1">
            <p className="text-[10px] text-[#909090] uppercase mb-1">
              RECOVERED MEMORIES OF ELDORIA:
            </p>
            {allShards.map(shard => {
              const unlocked = player.memoryShards.includes(shard.id);
              return (
                <div
                  key={shard.id}
                  className={`p-2.5 border-2 text-left ${
                    unlocked
                      ? 'bg-[#181818] border-[#58a8f8]'
                      : 'bg-[#0b0714] border-[#303030] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={unlocked ? 'text-[#88d8f8]' : 'text-[#585858]'}>
                      {unlocked ? shard.title : '??? UNKNOWN SHARD'}
                    </span>
                    <span className="text-[9px] text-[#909090]">
                      {unlocked ? shard.areaName : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#c0c0c0] leading-relaxed">
                    {unlocked ? `"${shard.memoryText}"` : 'Explore Eldoria to uncover this memory shard.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Bestiary Lore & Codex */}
        {activeTab === 'bestiary' && (
          <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2 py-1">
            <div className="flex items-center justify-between text-[10px] text-[#909090] uppercase mb-1">
              <span>DISCOVERED FOES: {(player.discoveredEnemies || []).length}/9</span>
              <span className="text-[#ecc25e]">CLICK ENTRY TO VIEW 16-BIT PORTRAIT</span>
            </div>
            {BESTIARY_ENTRIES.map(entry => {
              const unlocked =
                (player.discoveredEnemies || []).includes(entry.id) ||
                entry.aliases.some(a => (player.discoveredEnemies || []).includes(a));

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    if (unlocked) {
                      soundEngine.playMenuBeep(true);
                      setInspectedEntry(entry);
                    }
                  }}
                  className={`p-2 border-2 text-left transition ${
                    unlocked
                      ? 'bg-[#181818] hover:bg-[#251835] border-[#ecc25e] cursor-pointer'
                      : 'bg-[#0b0714] border-[#303030] opacity-40 cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                    <span className={unlocked ? 'text-[#f8f870]' : 'text-[#585858]'}>
                      {unlocked ? entry.name : '??? UNKNOWN FIEND'}
                    </span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.2 border uppercase"
                      style={{
                        borderColor: unlocked ? entry.threatColor : '#404040',
                        color: unlocked ? entry.threatColor : '#606060'
                      }}
                    >
                      {unlocked ? entry.threatLevel : 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#88d8f8] mb-1">
                    {unlocked ? `${entry.category} • ${entry.habitat}` : 'ENCOUNTER IN ELDORIA TO UNLOCK'}
                  </div>
                  <p className="text-[10px] text-[#c0c0c0] leading-relaxed line-clamp-2">
                    {unlocked ? `"${entry.loreDescription}"` : 'This creature remains shrouded in the shadows of the Eclipse.'}
                  </p>
                  {unlocked && (
                    <div className="mt-1.5 text-[9px] text-[#ecc25e] font-bold flex items-center justify-end gap-1">
                      <span>OPEN CODEX PORTRAIT</span>
                      <span>→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Controls Reference */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-2 gap-2 text-[10px] py-1">
            <div className="bg-[#181818] p-2 border border-[#303030]">
              <span className="text-[#f8a020] block font-bold">A / D</span>
              <span className="text-[#909090]">MOVE LEFT / RIGHT</span>
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
              <span className="text-[#909090]">INTERACT (SHRINE, NPC, DOOR, SHARD)</span>
            </div>
          </div>
        )}

        {/* Tab 4: Audio Volumes */}
        {activeTab === 'sound' && (
          <div className="flex flex-col gap-3 py-1 text-xs">
            <div>
              <div className="flex justify-between text-[#c0c0c0] mb-1 text-[10px]">
                <span>MASTER LEVEL</span>
                <span>{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={e => handleVolumeChange('master', parseFloat(e.target.value))}
                className="w-full accent-[#f8a020] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[#c0c0c0] mb-1 text-[10px]">
                <span>CHIPTUNE MUSIC</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={e => handleVolumeChange('music', parseFloat(e.target.value))}
                className="w-full accent-[#f8a020] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[#c0c0c0] mb-1 text-[10px]">
                <span>8-BIT SOUND FX</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={e => handleVolumeChange('sfx', parseFloat(e.target.value))}
                className="w-full accent-[#f8a020] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 border-t border-[#303030] pt-2 flex justify-end">
          <button
            onClick={onResume}
            className="px-3 py-1 bg-[#181818] border-2 border-[#585858] text-[#f8f8f8] hover:text-[#f8a020] text-[10px] uppercase font-bold cursor-pointer"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Bestiary Portrait & Lore Modal */}
        {inspectedEntry && (
          <BestiaryModal
            entry={inspectedEntry}
            onClose={() => setInspectedEntry(null)}
          />
        )}
      </div>
    </div>
  );
};
