import React from 'react';
import { Achievement } from '../game/achievementData';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
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

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  return (
    <div className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none font-mono animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative bg-[#0d0918] border-2 border-[#f8a020] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(248,160,32,0.4)] p-3 sm:px-4 sm:py-3 flex items-center gap-3.5 max-w-md w-full">
        {/* Ornate Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#f8a020] border border-black" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f8a020] border border-black" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#f8a020] border border-black" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#f8a020] border border-black" />

        {/* Achievement Icon Box */}
        <div
          className="relative w-11 h-11 border-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000]"
          style={{
            borderColor: achievement.badgeColor,
            backgroundColor: '#171126',
            color: achievement.badgeColor
          }}
        >
          {renderIcon(achievement.iconType, achievement.badgeColor)}
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="text-[#ecc25e] text-[9px] font-extrabold tracking-widest uppercase drop-shadow-[1px_1px_0px_#000]">
              ✦ MILESTONE UNLOCKED
            </span>
            <span
              className="text-[8px] font-bold px-1.5 py-0.2 border uppercase"
              style={{
                borderColor: achievement.badgeColor,
                color: achievement.badgeColor
              }}
            >
              {achievement.tier}
            </span>
          </div>

          <span className="text-[#f8f870] text-xs sm:text-sm font-black uppercase tracking-wide truncate mt-0.5 drop-shadow-[1px_1px_0px_#000]">
            {achievement.title}
          </span>

          <p className="text-[10px] text-[#c0c0c0] leading-snug line-clamp-2 mt-0.5">
            {achievement.description}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#251838] text-[#909090] hover:text-[#f8f8f8] border border-[#403055] text-xs font-bold cursor-pointer"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
