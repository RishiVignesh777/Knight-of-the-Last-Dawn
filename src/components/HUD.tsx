import React from 'react';
import { PlayerStats, AreaId, Enemy } from '../types';
import { WORLD_AREAS } from '../game/worldData';

interface HUDProps {
  player: PlayerStats;
  currentAreaId: AreaId;
  bossEnemy?: Enemy;
  discoveryToast?: { enemyName: string; timer: number } | null;
  onOpenBestiary?: () => void;
  onOpenAchievements?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  currentAreaId,
  bossEnemy,
  discoveryToast,
  onOpenBestiary,
  onOpenAchievements
}) => {
  const currentArea = WORLD_AREAS[currentAreaId];

  // Segmented 8-bit Health: 5 hearts total (each represents 20 HP of 100 max HP)
  const maxHearts = 5;
  const hpPerHeart = player.maxHp / maxHearts;
  const currentHp = Math.max(0, player.hp);

  // Stepped Stamina: 8 segments
  const totalStaminaSegments = 8;
  const staminaSegments = Math.ceil((player.stamina / player.maxStamina) * totalStaminaSegments);

  // Dawn Energy: 4 sacred crystal orbs
  const totalDawnOrbs = 4;
  const dawnOrbs = Math.ceil((player.dawnEnergy / player.maxDawnEnergy) * totalDawnOrbs);

  const totalShards = 5;
  const collectedCount = player.memoryShards.length;

  return (
    <div id="game-hud" className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between select-none font-mono">
      {/* Top Status Panel */}
      <div className="flex items-start justify-between">
        {/* Vitality Panel (Classic 8-Bit NES Frame) */}
        <div className="bg-[#0b0714] border-2 border-[#f8f8f8] p-2 flex flex-col gap-2 shadow-[2px_2px_0px_#000000]">
          {/* Hearts Row */}
          <div className="flex items-center gap-2">
            <span className="text-[#f83800] text-xs font-bold tracking-wider">HP</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxHearts }).map((_, i) => {
                const heartHp = currentHp - (i * hpPerHeart);
                const isFull = heartHp >= hpPerHeart;
                const isHalf = heartHp > 0 && heartHp < hpPerHeart;

                return (
                  <div key={i} className="relative w-4 h-4 flex items-center justify-center">
                    {isFull ? (
                      // Full 8-bit Heart
                      <svg width="14" height="14" viewBox="0 0 7 7" className="shape-rendering-crispEdges">
                        <path d="M1,0 H3 V1 H4 V0 H6 V2 H7 V4 H6 V5 H5 V6 H4 V7 H3 V6 H2 V5 H1 V4 H0 V2 H1 Z" fill="#d82838" />
                        <rect x="2" y="1" width="1" height="1" fill="#f8f8f8" />
                        <rect x="5" y="1" width="1" height="1" fill="#f8f8f8" />
                      </svg>
                    ) : isHalf ? (
                      // Half 8-bit Heart
                      <svg width="14" height="14" viewBox="0 0 7 7" className="shape-rendering-crispEdges">
                        <path d="M1,0 H3 V1 H4 V0 H6 V2 H7 V4 H6 V5 H5 V6 H4 V7 H3 V6 H2 V5 H1 V4 H0 V2 H1 Z" fill="#303030" />
                        <path d="M1,0 H3 V1 H4 V7 H3 V6 H2 V5 H1 V4 H0 V2 H1 Z" fill="#d82838" />
                      </svg>
                    ) : (
                      // Empty 8-bit Heart
                      <svg width="14" height="14" viewBox="0 0 7 7" className="shape-rendering-crispEdges">
                        <path d="M1,0 H3 V1 H4 V0 H6 V2 H7 V4 H6 V5 H5 V6 H4 V7 H3 V6 H2 V5 H1 V4 H0 V2 H1 Z" fill="#181818" stroke="#585858" strokeWidth="0.5" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-[#f8f8f8] text-[10px] ml-1">
              {Math.max(0, Math.round(player.hp))}
            </span>
          </div>

          {/* Stepped Stamina Blocks */}
          <div className="flex items-center gap-2">
            <span className="text-[#58c868] text-xs font-bold tracking-wider">ST</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalStaminaSegments }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-2 border border-black ${
                    i < staminaSegments ? 'bg-[#58c868]' : 'bg-[#181818]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Dawn Crystal Orbs */}
          <div className="flex items-center gap-2">
            <span className="text-[#f8a020] text-xs font-bold tracking-wider">DW</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalDawnOrbs }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rotate-45 border border-black ${
                    i < dawnOrbs ? 'bg-[#f8f870] shadow-[0_0_2px_#f8a020]' : 'bg-[#181818]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Area & Shard Info Panel */}
        <div className="flex flex-col items-end gap-2">
          {/* 8-bit Area Title Card */}
          <div className="bg-[#0b0714] border-2 border-[#f8a020] px-3 py-1.5 text-right shadow-[2px_2px_0px_#000000]">
            <div className="text-[#f8a020] text-xs font-bold tracking-wider uppercase">
              {currentArea.name}
            </div>
            <div className="text-[#c0c0c0] text-[9px] mt-0.5">
              {currentArea.subtitle}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 8-bit Bestiary Button */}
            <button
              onClick={onOpenBestiary}
              className="pointer-events-auto bg-[#0b0714] hover:bg-[#1f1530] border-2 border-[#ecc25e] px-2.5 py-1 flex items-center gap-1.5 text-[#ecc25e] hover:text-[#f8f870] text-[10px] shadow-[2px_2px_0px_#000000] cursor-pointer transition"
              title="Open Bestiary (B)"
            >
              <div className="w-2 h-2 rotate-45 bg-[#ecc25e] border border-black" />
              <span>BESTIARY: {(player.discoveredEnemies || []).length}/9 [B]</span>
            </button>

            {/* 8-bit Achievements Button */}
            <button
              onClick={onOpenAchievements}
              className="pointer-events-auto bg-[#0b0714] hover:bg-[#1f1530] border-2 border-[#f8a020] px-2.5 py-1 flex items-center gap-1.5 text-[#f8a020] hover:text-[#f8f870] text-[10px] shadow-[2px_2px_0px_#000000] cursor-pointer transition"
              title="Open Achievements & Milestones"
            >
              <div className="w-2 h-2 rotate-45 bg-[#f8a020] border border-black" />
              <span>MILESTONES: {(player.unlockedAchievements || []).length}/10</span>
            </button>

            {/* 8-bit Shard Tracker */}
            <div className="bg-[#0b0714] border-2 border-[#58a8f8] px-2.5 py-1 flex items-center gap-2 text-[#88d8f8] text-[10px] shadow-[2px_2px_0px_#000000]">
              <div className="w-2 h-2 rotate-45 bg-[#88d8f8] border border-black" />
              <span>SHARDS: {collectedCount}/{totalShards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Notification Toast Banner */}
      {discoveryToast && (
        <div
          onClick={onOpenBestiary}
          className="pointer-events-auto self-center bg-[#0b0714] border-2 border-[#ecc25e] px-4 py-2 flex items-center gap-3 shadow-[4px_4px_0px_#000000] animate-bounce cursor-pointer hover:bg-[#1a102a] z-40 transition"
        >
          <div className="w-3 h-3 rotate-45 bg-[#ecc25e] border border-black shadow-[0_0_6px_#f8a020]" />
          <div className="flex flex-col text-left">
            <span className="text-[#ecc25e] text-[9px] font-bold tracking-widest uppercase">
              NEW BESTIARY ENTRY DISCOVERED
            </span>
            <span className="text-[#f8f870] text-xs font-extrabold uppercase">
              {discoveryToast.enemyName}
            </span>
          </div>
          <span className="text-[9px] bg-[#ecc25e] text-black font-extrabold px-2 py-0.5 uppercase tracking-wider ml-1">
            VIEW [B]
          </span>
        </div>
      )}

      {/* Boss Health Bar (When Final Boss is active) */}
      {bossEnemy && bossEnemy.state !== 'dead' && (
        <div className="self-center w-full max-w-md mb-3 flex flex-col items-center gap-1 bg-[#0b0714] border-2 border-[#f83800] p-2 shadow-[3px_3px_0px_#000000]">
          <div className="flex items-center justify-between w-full text-xs font-bold px-1">
            <span className="text-[#f8a020] uppercase tracking-wider">THE DYING KING</span>
            <span className="text-[#f0b0f8] text-[9px] uppercase">
              {bossEnemy.bossPhase === 3 ? 'PHASE 3: SHADOW FIEND' : bossEnemy.bossPhase === 2 ? 'PHASE 2: CORRUPTED' : 'PHASE 1: SOVEREIGN'}
            </span>
          </div>
          {/* Stepped 8-bit Health Blocks */}
          <div className="w-full h-3 bg-[#181818] border border-black flex gap-0.5 p-0.5">
            {Array.from({ length: 24 }).map((_, idx) => {
              const fillThreshold = (idx + 1) / 24;
              const isFilled = (bossEnemy.hp / bossEnemy.maxHp) >= fillThreshold;
              const barColor = bossEnemy.bossPhase === 3 ? 'bg-[#c868d8]' : 'bg-[#d82838]';
              return (
                <div
                  key={idx}
                  className={`flex-1 h-full ${isFilled ? barColor : 'bg-[#303030]'}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Retro Bottom Info */}
      <div className="text-[9px] text-[#909090] flex justify-between tracking-wide">
        <span className="hidden sm:inline">A/D:MOVE  SPACE:JUMP  SHIFT:DASH  J:SLASH  K:CLEAVE  L:BLOCK  E:ACTION  B:BESTIARY</span>
        <span className="ml-auto">ESC:PAUSE</span>
      </div>
    </div>
  );
};
