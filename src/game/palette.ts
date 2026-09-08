// ============================================================================
// MASTER 8-BIT COLOR PALETTE
// ============================================================================
// Authentic retro palette inspired by classic late-generation 8-bit fantasy cartridges.
// Pure leaf module with zero dependencies to prevent circular initialization issues.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const PALETTE = {
  BLACK: '#080808',
  DARKEST_GRAY: '#181818',
  DARK_GRAY: '#303030',
  MID_GRAY: '#585858',
  LIGHT_GRAY: '#909090',
  BRIGHT_GRAY: '#c0c0c0',
  WHITE: '#f8f8f8',

  // Reds & Pinks
  DEEP_MAROON: '#400010',
  DARK_RED: '#701018',
  CRIMSON: '#a81828',
  BRIGHT_RED: '#d82838',
  SALMON: '#f86878',

  // Oranges & Ambers
  DEEP_BROWN: '#381808',
  RUST: '#682808',
  AMBER_DARK: '#984008',
  AMBER: '#c86810',
  GOLD: '#f8a020',
  PALE_GOLD: '#f8c858',
  SUN_YELLOW: '#f8f870',

  // Greens
  NIGHT_GREEN: '#082010',
  DARK_PINE: '#104020',
  MOSS_GREEN: '#206830',
  FOREST_GREEN: '#389848',
  BRIGHT_GREEN: '#58c868',
  MINT_GREEN: '#88f898',

  // Blues & Indigos
  MIDNIGHT_BLUE: '#080828',
  DARK_NAVY: '#101848',
  ROYAL_BLUE: '#183888',
  STEEL_BLUE: '#3868b8',
  SKY_BLUE: '#58a8f8',
  CYAN_HIGHLIGHT: '#88d8f8',
  ICE_WHITE: '#d8f0f8',

  // Purples & Violets
  VOID_PURPLE: '#180828',
  DARK_VIOLET: '#381050',
  PURPLE: '#682088',
  MAGENTA: '#9830b0',
  LAVENDER: '#c868d8',
  PALE_LILAC: '#f0b0f8'
} as const;

export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16)
  };
}
