import React from 'react';
import { PlayerStats, AreaId, Enemy } from '../types';
import { WORLD_AREAS } from '../game/worldData';
import { Heart, Zap, Sparkles, MapPin, Gem } from 'lucide-react';

interface HUDProps {
  player: PlayerStats;
  currentAreaId: AreaId;
  bossEnemy?: Enemy;
}

export const HUD: React.FC<HUDProps> = ({ player, currentAreaId, bossEnemy }) => {
  const currentArea = WORLD_AREAS[currentAreaId];
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (player.stamina / player.maxStamina) * 100));
  const dawnPercent = Math.max(0, Math.min(100, (player.dawnEnergy / player.maxDawnEnergy) * 100));

  const totalShards = 5;
  const collectedCount = player.memoryShards.length;

  return (
    <div id="game-hud" className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="flex items-start justify-between">
        {/* Vitality & Energy Bars */}
        <div className="flex flex-col gap-2">
          {/* Health Bar */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1.5 rounded shadow-lg backdrop-blur-xs">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <div className="w-36 sm:w-48 h-3 bg-slate-900 rounded-xs overflow-hidden border border-slate-700 relative">
              <div
                className="h-full bg-linear-to-r from-red-700 via-red-600 to-rose-500 transition-all duration-150"
                style={{ width: `${hpPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-retro text-[9px] text-white tracking-wider">
                {Math.round(player.hp)} / {player.maxHp}
              </span>
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded shadow-lg backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-xs overflow-hidden border border-slate-700">
              <div
                className="h-full bg-linear-to-r from-emerald-600 to-teal-400 transition-all duration-75"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>

          {/* Dawn Energy Bar */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded shadow-lg backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-xs overflow-hidden border border-slate-700">
              <div
                className="h-full bg-linear-to-r from-amber-600 via-amber-500 to-yellow-300 transition-all duration-100"
                style={{ width: `${dawnPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Area Badge & Shards Counter */}
        <div className="flex flex-col items-end gap-2">
          {/* Area Title */}
          <div className="bg-slate-950/80 border border-amber-500/30 px-3 py-1.5 rounded shadow-lg text-right backdrop-blur-xs">
            <div className="flex items-center justify-end gap-1.5 text-amber-400 text-xs font-cinzel font-bold tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentArea.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-retro">
              {currentArea.subtitle}
            </div>
          </div>

          {/* Shard Counter */}
          <div className="bg-slate-950/80 border border-sky-500/30 px-2.5 py-1 rounded flex items-center gap-1.5 text-sky-400 text-xs font-retro shadow-md">
            <Gem className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
            <span>Memory Shards: {collectedCount} / {totalShards}</span>
          </div>
        </div>
      </div>

      {/* Boss Health Bar (when Boss is active) */}
      {bossEnemy && bossEnemy.state !== 'dead' && (
        <div className="self-center w-full max-w-lg mb-2 flex flex-col items-center gap-1 bg-slate-950/90 border border-amber-500/60 p-2.5 rounded shadow-2xl backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between w-full text-amber-400 font-cinzel font-bold text-xs sm:text-sm tracking-wider px-1">
            <span>THE DYING KING</span>
            <span className="text-purple-400 text-[10px] font-retro">
              {bossEnemy.bossPhase === 3 ? 'Phase 3: Shadow Fiend' : bossEnemy.bossPhase === 2 ? 'Phase 2: Corrupted Sovereign' : 'Phase 1: High King of Eldoria'}
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-900 rounded-xs overflow-hidden border border-slate-700 relative">
            <div
              className={`h-full transition-all duration-150 ${
                bossEnemy.bossPhase === 3
                  ? 'bg-linear-to-r from-purple-800 via-fuchsia-600 to-rose-500'
                  : 'bg-linear-to-r from-amber-700 via-amber-500 to-yellow-400'
              }`}
              style={{ width: `${Math.max(0, (bossEnemy.hp / bossEnemy.maxHp) * 100)}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-retro text-[9px] text-white tracking-widest">
              {Math.max(0, Math.round(bossEnemy.hp))} / {bossEnemy.maxHp}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Control Helpers subtle hint */}
      <div className="text-[10px] text-slate-500 font-retro flex justify-between">
        <span className="hidden sm:inline">A/D: Move | Space: Jump | Shift: Dash | J: Light Attack | K: Heavy Attack | L: Block | E: Interact</span>
        <span className="ml-auto">ESC: Pause Menu</span>
      </div>
    </div>
  );
};
