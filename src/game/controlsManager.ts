export type KeyAction =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'jump'
  | 'dash'
  | 'attackLight'
  | 'attackHeavy'
  | 'block'
  | 'interact';

export interface ActionMeta {
  id: KeyAction;
  name: string;
  category: 'movement' | 'agility' | 'combat' | 'interaction';
  description: string;
  defaultKeys: string[];
}

export const ACTION_METADATA: ActionMeta[] = [
  {
    id: 'left',
    name: 'Move Left',
    category: 'movement',
    description: 'Travel westward across Eldoria',
    defaultKeys: ['KeyA', 'ArrowLeft']
  },
  {
    id: 'right',
    name: 'Move Right',
    category: 'movement',
    description: 'Travel eastward into the ruins',
    defaultKeys: ['KeyD', 'ArrowRight']
  },
  {
    id: 'up',
    name: 'Climb Up',
    category: 'movement',
    description: 'Ascend ruined ladders and stone scaffolding',
    defaultKeys: ['KeyW', 'ArrowUp']
  },
  {
    id: 'down',
    name: 'Climb Down',
    category: 'movement',
    description: 'Descend ladders into lower vaults',
    defaultKeys: ['KeyS', 'ArrowDown']
  },
  {
    id: 'jump',
    name: 'Jump / Leap',
    category: 'agility',
    description: 'Leap across chasms and jump off walls',
    defaultKeys: ['Space']
  },
  {
    id: 'dash',
    name: 'Dash Evade',
    category: 'agility',
    description: 'Swift invulnerable forward roll / burst',
    defaultKeys: ['ShiftLeft', 'ShiftRight']
  },
  {
    id: 'attackLight',
    name: 'Light Slash',
    category: 'combat',
    description: 'Rapid 3-strike silver blade combo',
    defaultKeys: ['KeyJ']
  },
  {
    id: 'attackHeavy',
    name: 'Heavy Cleave',
    category: 'combat',
    description: 'Crushing overhead swing consuming Dawn Energy',
    defaultKeys: ['KeyK']
  },
  {
    id: 'block',
    name: 'Shield Block',
    category: 'combat',
    description: 'Raise bulwark shield to negate corrupted attacks',
    defaultKeys: ['KeyL']
  },
  {
    id: 'interact',
    name: 'Interact / Rest',
    category: 'interaction',
    description: 'Consecrate shrines, open doors, examine murals, talk',
    defaultKeys: ['KeyE']
  }
];

export const DEFAULT_KEYBINDINGS: Record<KeyAction, string[]> = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  up: ['KeyW', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
  jump: ['Space'],
  dash: ['ShiftLeft', 'ShiftRight'],
  attackLight: ['KeyJ'],
  attackHeavy: ['KeyK'],
  block: ['KeyL'],
  interact: ['KeyE']
};

export const PRESET_RETRO_ARROWS: Record<KeyAction, string[]> = {
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  jump: ['KeyZ', 'Space'],
  dash: ['KeyC', 'ShiftLeft'],
  attackLight: ['KeyX'],
  attackHeavy: ['KeyV'],
  block: ['KeyB'],
  interact: ['KeyE', 'Enter']
};

const STORAGE_KEY = 'knight_last_dawn_keybindings';

export function formatKeyName(code: string): string {
  if (!code) return 'NONE';
  if (code.startsWith('Key')) return code.slice(3).toUpperCase();
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return 'NUM ' + code.slice(6);
  
  switch (code) {
    case 'Space': return 'SPACE';
    case 'ShiftLeft': return 'L-SHIFT';
    case 'ShiftRight': return 'R-SHIFT';
    case 'ControlLeft': return 'L-CTRL';
    case 'ControlRight': return 'R-CTRL';
    case 'AltLeft': return 'L-ALT';
    case 'AltRight': return 'R-ALT';
    case 'ArrowLeft': return '← LEFT';
    case 'ArrowRight': return '→ RIGHT';
    case 'ArrowUp': return '↑ UP';
    case 'ArrowDown': return '↓ DOWN';
    case 'Enter': return 'ENTER';
    case 'Tab': return 'TAB';
    case 'Backspace': return 'BKSP';
    case 'Slash': return '/';
    case 'Backslash': return '\\';
    case 'Period': return '.';
    case 'Comma': return ',';
    case 'Semicolon': return ';';
    case 'Quote': return "'";
    case 'BracketLeft': return '[';
    case 'BracketRight': return ']';
    case 'Minus': return '-';
    case 'Equal': return '=';
    default: return code.toUpperCase();
  }
}

class ControlsManager {
  private bindings: Record<KeyAction, string[]>;
  private listeners: Array<(bindings: Record<KeyAction, string[]>) => void> = [];

  constructor() {
    this.bindings = this.loadFromStorage();
  }

  private loadFromStorage(): Record<KeyAction, string[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all actions are present
        const merged: Record<KeyAction, string[]> = { ...DEFAULT_KEYBINDINGS };
        for (const meta of ACTION_METADATA) {
          if (Array.isArray(parsed[meta.id]) && parsed[meta.id].length > 0) {
            merged[meta.id] = parsed[meta.id];
          }
        }
        return merged;
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_KEYBINDINGS };
  }

  public getBindings(): Record<KeyAction, string[]> {
    return { ...this.bindings };
  }

  public setBinding(action: KeyAction, slotIndex: number, keyCode: string) {
    const current = [...(this.bindings[action] || [])];
    
    // Check if key is already bound to another action and remove it to avoid unexpected duplicates
    for (const act of Object.keys(this.bindings) as KeyAction[]) {
      this.bindings[act] = this.bindings[act].filter(k => k !== keyCode);
    }

    if (slotIndex === 0) {
      current[0] = keyCode;
    } else {
      current[1] = keyCode;
    }

    // Clean up empty/undefined
    this.bindings[action] = current.filter(Boolean);
    this.persist();
  }

  public removeBinding(action: KeyAction, slotIndex: number) {
    const current = [...(this.bindings[action] || [])];
    current.splice(slotIndex, 1);
    this.bindings[action] = current.length > 0 ? current : [...DEFAULT_KEYBINDINGS[action]];
    this.persist();
  }

  public resetToDefaults() {
    this.bindings = { ...DEFAULT_KEYBINDINGS };
    this.persist();
  }

  public applyPreset(preset: 'default' | 'retro_arrows') {
    if (preset === 'retro_arrows') {
      this.bindings = { ...PRESET_RETRO_ARROWS };
    } else {
      this.bindings = { ...DEFAULT_KEYBINDINGS };
    }
    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bindings));
    } catch {
      // ignore storage failure
    }
    for (const listener of this.listeners) {
      listener(this.bindings);
    }
  }

  public subscribe(cb: (bindings: Record<KeyAction, string[]>) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public getActionsForCode(code: string): KeyAction[] {
    const matches: KeyAction[] = [];
    for (const [action, keys] of Object.entries(this.bindings)) {
      if (keys.includes(code)) {
        matches.push(action as KeyAction);
      }
    }
    return matches;
  }

  public isActionKey(action: KeyAction, code: string): boolean {
    const keys = this.bindings[action];
    return keys ? keys.includes(code) : false;
  }

  public getKeyLabelForAction(action: KeyAction, slot: number = 0): string {
    const keys = this.bindings[action];
    if (!keys || !keys[slot]) return '---';
    return formatKeyName(keys[slot]);
  }
}

export const controlsManager = new ControlsManager();
