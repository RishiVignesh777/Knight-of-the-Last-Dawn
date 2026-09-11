import React, { useState, useEffect } from 'react';
import {
  controlsManager,
  ACTION_METADATA,
  KeyAction,
  formatKeyName
} from '../game/controlsManager';
import { soundEngine } from '../audio/soundManager';

interface ControlsTabProps {
  onClose?: () => void;
}

export const ControlsTab: React.FC<ControlsTabProps> = () => {
  const [bindings, setBindings] = useState<Record<KeyAction, string[]>>(() =>
    controlsManager.getBindings()
  );
  const [rebindingTarget, setRebindingTarget] = useState<{
    action: KeyAction;
    slot: number;
    actionName: string;
  } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Subscribe to changes in controlsManager
  useEffect(() => {
    return controlsManager.subscribe(updated => {
      setBindings({ ...updated });
    });
  }, []);

  // Global keydown listener when rebinding
  useEffect(() => {
    if (!rebindingTarget) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Escape cancels rebinding
      if (e.code === 'Escape') {
        setRebindingTarget(null);
        soundEngine.playMenuBeep(false);
        setFeedbackMsg('Rebinding cancelled.');
        setTimeout(() => setFeedbackMsg(null), 2500);
        return;
      }

      // Backspace or Delete clears the secondary slot
      if ((e.code === 'Backspace' || e.code === 'Delete') && rebindingTarget.slot === 1) {
        controlsManager.removeBinding(rebindingTarget.action, 1);
        setRebindingTarget(null);
        soundEngine.playMenuBeep(false);
        setFeedbackMsg(`Cleared secondary binding for ${rebindingTarget.actionName}.`);
        setTimeout(() => setFeedbackMsg(null), 2500);
        return;
      }

      // Map key to the target
      controlsManager.setBinding(rebindingTarget.action, rebindingTarget.slot, e.code);
      soundEngine.playMenuBeep(true);
      const friendlyName = formatKeyName(e.code);
      setFeedbackMsg(`Bound [${friendlyName}] to ${rebindingTarget.actionName}`);
      setRebindingTarget(null);
      setTimeout(() => setFeedbackMsg(null), 2500);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [rebindingTarget]);

  const startRebind = (action: KeyAction, slot: number, actionName: string) => {
    soundEngine.playMenuBeep(true);
    setRebindingTarget({ action, slot, actionName });
  };

  const handleApplyPreset = (preset: 'default' | 'retro_arrows') => {
    soundEngine.playMenuBeep(true);
    controlsManager.applyPreset(preset);
    setFeedbackMsg(
      preset === 'default'
        ? 'Applied Default (WASD + JKL) Preset'
        : 'Applied Retro Arcade (Arrows + ZXC) Preset'
    );
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleReset = () => {
    soundEngine.playMenuBeep(false);
    controlsManager.resetToDefaults();
    setFeedbackMsg('Restored all canonical keybindings.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const categories: Array<{
    id: 'movement' | 'agility' | 'combat' | 'interaction';
    title: string;
    accentColor: string;
  }> = [
    { id: 'movement', title: 'TRAVERSAL & CLIMBING', accentColor: '#58a8f8' },
    { id: 'agility', title: 'AGILITY & EVASION', accentColor: '#ecc25e' },
    { id: 'combat', title: 'BLADE & SHIELD ARTS', accentColor: '#f87050' },
    { id: 'interaction', title: 'SANCTUM INTERACTIONS', accentColor: '#f8f870' }
  ];

  return (
    <div className="flex flex-col gap-3 py-1 text-xs select-none max-h-[62vh] overflow-y-auto pr-1">
      {/* Preset & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[#303030]">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => handleApplyPreset('default')}
            className="px-2 py-1 bg-[#181818] hover:bg-[#282828] text-[#f8a020] hover:text-[#f8f870] border border-[#585858] text-[9px] uppercase font-bold cursor-pointer"
          >
            PRESET: WASD+JKL
          </button>
          <button
            onClick={() => handleApplyPreset('retro_arrows')}
            className="px-2 py-1 bg-[#181818] hover:bg-[#282828] text-[#58a8f8] hover:text-[#88d8f8] border border-[#585858] text-[9px] uppercase font-bold cursor-pointer"
          >
            PRESET: ARROWS+ZXC
          </button>
        </div>

        <button
          onClick={handleReset}
          className="px-2 py-1 bg-[#181818] hover:bg-[#301818] text-[#d82838] hover:text-[#f85858] border border-[#d82838] text-[9px] uppercase font-bold cursor-pointer ml-auto"
        >
          RESET DEFAULTS
        </button>
      </div>

      {/* Active Rebinding Prompt Banner */}
      {rebindingTarget && (
        <div className="bg-[#1c1202] border-2 border-[#f8a020] p-2.5 text-center shadow-[0_0_12px_rgba(248,160,32,0.3)] animate-pulse">
          <div className="text-[#f8f870] font-extrabold text-[11px] uppercase tracking-wider">
            ✦ PRESS ANY KEY FOR: {rebindingTarget.actionName} ✦
          </div>
          <div className="text-[#c0c0c0] text-[9px] mt-0.5">
            Slot {rebindingTarget.slot + 1} • Press [ESC] to cancel
            {rebindingTarget.slot === 1 && ' • Press [BACKSPACE] to clear secondary slot'}
          </div>
        </div>
      )}

      {/* Temporary Feedback Notification */}
      {feedbackMsg && !rebindingTarget && (
        <div className="bg-[#0e1626] border border-[#58a8f8] px-2.5 py-1 text-center text-[#88d8f8] text-[9px] uppercase tracking-wider">
          ✦ {feedbackMsg}
        </div>
      )}

      {/* Categorized Keybinding Groups */}
      {categories.map(cat => {
        const actions = ACTION_METADATA.filter(a => a.category === cat.id);
        return (
          <div key={cat.id} className="flex flex-col gap-1.5">
            <div
              className="text-[9px] font-extrabold tracking-wider uppercase border-b border-[#282828] pb-0.5 flex items-center gap-1.5"
              style={{ color: cat.accentColor }}
            >
              <span className="w-1.5 h-1.5 bg-current inline-block" />
              {cat.title}
            </div>

            <div className="flex flex-col gap-1">
              {actions.map(action => {
                const keys = bindings[action.id] || [];
                const primaryKey = keys[0] || null;
                const secondaryKey = keys[1] || null;
                const isRebindingPrimary =
                  rebindingTarget?.action === action.id && rebindingTarget?.slot === 0;
                const isRebindingSecondary =
                  rebindingTarget?.action === action.id && rebindingTarget?.slot === 1;

                return (
                  <div
                    key={action.id}
                    className="flex items-center justify-between bg-[#120e1a] hover:bg-[#181422] border border-[#2d2538] px-2.5 py-1.5 transition"
                  >
                    <div className="flex flex-col text-left pr-2 max-w-[55%]">
                      <span className="text-[#f8f8f8] font-bold text-[10px] uppercase tracking-wide">
                        {action.name}
                      </span>
                      <span className="text-[#787878] text-[8px] leading-tight truncate">
                        {action.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Primary Key Slot */}
                      <button
                        onClick={() => startRebind(action.id, 0, action.name)}
                        className={`min-w-[52px] px-2 py-1 text-[9px] font-extrabold border uppercase tracking-wider transition cursor-pointer text-center ${
                          isRebindingPrimary
                            ? 'bg-[#f8a020] text-black border-[#f8f870] shadow-[0_0_8px_#f8a020]'
                            : primaryKey
                            ? 'bg-[#1c1826] hover:bg-[#282038] text-[#f8a020] hover:text-[#f8f870] border-[#584868]'
                            : 'bg-[#181818] text-[#585858] border-[#303030]'
                        }`}
                        title="Click to rebind primary key"
                      >
                        {isRebindingPrimary
                          ? '...'
                          : primaryKey
                          ? formatKeyName(primaryKey)
                          : '---'}
                      </button>

                      {/* Secondary Key Slot */}
                      <button
                        onClick={() => startRebind(action.id, 1, action.name)}
                        className={`min-w-[48px] px-1.5 py-1 text-[8px] font-bold border uppercase tracking-wider transition cursor-pointer text-center ${
                          isRebindingSecondary
                            ? 'bg-[#58a8f8] text-black border-[#88d8f8] shadow-[0_0_8px_#58a8f8]'
                            : secondaryKey
                            ? 'bg-[#181822] hover:bg-[#222232] text-[#88d8f8] hover:text-[#c0f0ff] border-[#384860]'
                            : 'bg-[#101014] hover:bg-[#18181c] text-[#505060] border-[#222228]'
                        }`}
                        title={secondaryKey ? 'Click to rebind secondary key (Backspace to clear)' : 'Click to add secondary key'}
                      >
                        {isRebindingSecondary
                          ? '...'
                          : secondaryKey
                          ? formatKeyName(secondaryKey)
                          : '+ ALT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Guide Footer */}
      <div className="mt-1 pt-2 border-t border-[#282828] text-[8px] text-[#808080] flex flex-col gap-0.5">
        <div className="flex justify-between">
          <span>• CLICK ANY KEY SLOT TO REBIND</span>
          <span>• [ESC] KEY REMAINS PAUSE / BACK</span>
        </div>
        <div className="text-[#585858]">
          Supports full QWERTY, Arrow Keys, Numpad, Modifiers (Shift, Ctrl, Space).
        </div>
      </div>
    </div>
  );
};
