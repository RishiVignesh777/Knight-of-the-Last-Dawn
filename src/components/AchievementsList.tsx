import React, { useState } from 'react';
import { ACHIEVEMENTS, Achievement } from '../game/achievementData';
import { soundEngine } from '../audio/soundManager';

interface AchievementsListProps {
  unlockedIds: string[];
}

const renderIcon = (type: Achievement['iconType'], color: string) => {
  switch (type) {
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19.7 4.3c-.4-.4-1-.4-1.4 0l-7.3 7.3-1.6-1.6 1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.4 1.4-2.6-2.6-1.4 1.4 2.6 2.6-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4 1.6 1.6-7.3 7.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l7.3-7.3 2.1 2.1c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-2.1-2.1 7.3-7.3c.4-.4.4-1 0-1.4z" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M2 19h20v2H2zM2 5l5 7 5-8 5 8 5-7v12H2z" />
        </svg>
      );
    case 'shard':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2L4 9l4 13h8l4-13-8-7zm0 3.2L17.5 9 14 19h-4L6.5 9 12 5.2z" />
        </svg>
      );
    case 'scroll':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19 3H7a4 4 0 00-4 4v10a4 4 0 004 4h12a3 3 0 003-3V6a3 3 0 00-3-3zm1 14a1 1 0 01-1 1H7a2 2 0 01-2-2V7a2 2 0 012-2h12a1 1 0 011 1v11zM7 9h10v2H7zm0 4h7v2H7z" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78z" />
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2a4 4 0 00-4 4v1.17A7.001 7.001 0 004 14v4l-2 2v1h20v-1l-2-2v-4a7.001 7.001 0 00-4-6.83V6a4 4 0 00-4-4zm-2 20a2 2 0 004 0h-4z" />
        </svg>
      );
    case 'skull':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2a9 9 0 00-9 9c0 2.88 1.36 5.44 3.47 7.08L6 20h3v2h2v-2h2v2h2v-2h3l-.47-1.92A8.99 8.99 0 0021 11a9 9 0 00-9-9zm-3.5 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm0-10.96l-1.29 1.29c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.29-1.29c.39-.39.39-1.02 0-1.41a.996.996 0 00-1.41 0zM7.28 17.95l-1.29 1.29c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.29-1.29c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z" />
        </svg>
      );
    case 'chalice':
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19 3H5v6c0 3.87 3.13 7 7 7s7-3.13 7-7V3zm-2 6c0 2.76-2.24 5-5 5s-5-2.24-5-5V5h10v4zM11 17.93c-2.83-.48-5-2.94-5-5.93H4c0 3.89 2.79 7.14 6.5 7.85V21H7v2h10v-2h-3.5v-1.15C17.21 19.07 20 15.82 20 12h-2c0 2.99-2.17 5.45-5 5.93z" />
        </svg>
      );
  }
};

export const AchievementsList: React.FC<AchievementsListProps> = ({ unlockedIds }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const total = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const percentage = Math.round((unlockedCount / total) * 100);

  const filtered = ACHIEVEMENTS.filter(a => {
    const isUnlocked = unlockedIds.includes(a.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1 font-mono select-none">
      {/* Progress Header */}
      <div className="bg-[#120c1f] border border-[#3e3052] p-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rotate-45 bg-[#ecc25e] border border-black shadow-[0_0_6px_#f8a020]" />
          <span className="text-[10px] text-[#ecc25e] font-bold tracking-wider uppercase">
            CHRONICLES UNLOCKED: {unlockedCount} / {total} [{percentage}%]
          </span>
        </div>

        {/* Segmented bar */}
        <div className="w-32 h-2.5 bg-[#181818] border border-black flex gap-0.5 p-0.5">
          {ACHIEVEMENTS.map((a, idx) => {
            const isUnlocked = unlockedIds.includes(a.id);
            return (
              <div
                key={idx}
                className={`flex-1 h-full ${isUnlocked ? 'bg-[#ecc25e]' : 'bg-[#262626]'}`}
              />
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 pb-1">
        <button
          onClick={() => {
            soundEngine.playMenuBeep(true);
            setFilter('all');
          }}
          className={`px-2.5 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
            filter === 'all'
              ? 'bg-[#f8a020] text-black border-[#f8f8f8]'
              : 'bg-[#181818] text-[#909090] border-[#303030]'
          }`}
        >
          ALL ({total})
        </button>
        <button
          onClick={() => {
            soundEngine.playMenuBeep(true);
            setFilter('unlocked');
          }}
          className={`px-2.5 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
            filter === 'unlocked'
              ? 'bg-[#ecc25e] text-black border-[#f8f8f8]'
              : 'bg-[#181818] text-[#909090] border-[#303030]'
          }`}
        >
          EARNED ({unlockedCount})
        </button>
        <button
          onClick={() => {
            soundEngine.playMenuBeep(true);
            setFilter('locked');
          }}
          className={`px-2.5 py-1 text-[9px] uppercase font-bold border-2 transition cursor-pointer ${
            filter === 'locked'
              ? 'bg-[#821628] text-[#f8f8f8] border-[#f8f8f8]'
              : 'bg-[#181818] text-[#909090] border-[#303030]'
          }`}
        >
          LOCKED ({total - unlockedCount})
        </button>
      </div>

      {/* List of achievements */}
      <div className="flex flex-col gap-2">
        {filtered.map(ach => {
          const isUnlocked = unlockedIds.includes(ach.id);

          if (!isUnlocked) {
            return (
              <div
                key={ach.id}
                className="bg-[#0b0714] border-2 border-[#262033] p-2.5 flex items-center gap-3 opacity-55 text-left"
              >
                <div className="w-10 h-10 bg-[#14101e] border-2 border-[#332a45] flex items-center justify-center shrink-0 text-[#54466d]">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[#64567e] text-xs font-bold uppercase tracking-wide">
                      {ach.title}
                    </span>
                    <span className="text-[8px] text-[#4d3f66] uppercase border border-[#3b3050] px-1.5 py-0.2">
                      {ach.category}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#55476d] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={ach.id}
              className="bg-[#140e24] hover:bg-[#1f1636] border-2 border-[#ecc25e] p-2.5 flex items-center gap-3 text-left transition shadow-[2px_2px_0px_#000000]"
            >
              <div
                className="w-10 h-10 border-2 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000000]"
                style={{
                  borderColor: ach.badgeColor,
                  backgroundColor: '#1b132e',
                  color: ach.badgeColor
                }}
              >
                {renderIcon(ach.iconType, ach.badgeColor)}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[#f8f870] text-xs font-extrabold uppercase tracking-wide truncate">
                    {ach.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.2 border uppercase"
                      style={{
                        borderColor: ach.badgeColor,
                        color: ach.badgeColor
                      }}
                    >
                      {ach.tier}
                    </span>
                    <span className="text-[9px] text-[#ecc25e] font-bold">
                      ✓ UNLOCKED
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-[#c0c0c0] leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
