// Authentic 8-Bit Pixel Art Helper & Color Palettes
// Provides stepped dither patterns, pixel-perfect rasterization, and authentic retro palettes.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Authentic master 8-bit color palette (inspired by classic late-generation 8-bit fantasy games)
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
};

// 4x4 Bayer Dither Matrix for authentic 8-bit gradient dithering
export const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16]
];

// Helper: draw an integer-aligned pixel rectangle
export function drawPixelRect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Helper: draw dithered 8-bit sky band between two colors
export function drawDitheredSky(
  ctx: CanvasRenderingContext2D,
  colorTop: string,
  colorBottom: string,
  x: number,
  y: number,
  width: number,
  height: number,
  ditherBandHeight: number = 16
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.floor(width);
  const ih = Math.floor(height);

  const transitionY = iy + ih - ditherBandHeight;

  // Solid top color
  ctx.fillStyle = colorTop;
  ctx.fillRect(ix, iy, iw, Math.max(0, transitionY - iy));

  // Dithered transition band
  for (let py = transitionY; py < iy + ih; py += 2) {
    const factor = (py - transitionY) / ditherBandHeight;
    for (let px = ix; px < ix + iw; px += 2) {
      const ditherThreshold = BAYER_4X4[Math.floor((py / 2) % 4)][Math.floor((px / 2) % 4)];
      ctx.fillStyle = factor > ditherThreshold ? colorBottom : colorTop;
      ctx.fillRect(px, py, 2, 2);
    }
  }
}

// Helper: draw 8-bit pixel circle with integer coordinates and hard edges
export function drawPixelCircle(
  ctx: CanvasRenderingContext2D,
  color: string,
  centerX: number,
  centerY: number,
  radius: number
) {
  ctx.fillStyle = color;
  const cx = Math.floor(centerX);
  const cy = Math.floor(centerY);
  const r = Math.floor(radius);

  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy));
    ctx.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
  }
}

// Helper: draw an 8-bit box with classic 2px double border
export function drawPixelBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string = '#080808',
  borderColor: string = '#f8f8f8',
  cornerColor: string = '#f8a020'
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.floor(w);
  const ih = Math.floor(h);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(ix, iy, iw, ih);

  // Outer border
  ctx.fillStyle = borderColor;
  ctx.fillRect(ix, iy, iw, 2);
  ctx.fillRect(ix, iy + ih - 2, iw, 2);
  ctx.fillRect(ix, iy, 2, ih);
  ctx.fillRect(ix + iw - 2, iy, 2, ih);

  // Inner margin 2px border
  ctx.fillStyle = borderColor;
  ctx.fillRect(ix + 3, iy + 3, iw - 6, 1);
  ctx.fillRect(ix + 3, iy + ih - 4, iw - 6, 1);
  ctx.fillRect(ix + 3, iy + 3, 1, ih - 6);
  ctx.fillRect(ix + iw - 4, iy + 3, 1, ih - 6);

  // Corner highlights
  ctx.fillStyle = cornerColor;
  ctx.fillRect(ix, iy, 3, 3);
  ctx.fillRect(ix + iw - 3, iy, 3, 3);
  ctx.fillRect(ix, iy + ih - 3, 3, 3);
  ctx.fillRect(ix + iw - 3, iy + ih - 3, 3, 3);
}

// Helper: draw 8-bit classic heart (8x7 pixels)
export function drawPixelHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  filled: boolean = true,
  scale: number = 1
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const s = Math.floor(scale);

  const mainColor = filled ? '#d82838' : '#303030';
  const highlightColor = filled ? '#f86878' : '#585858';
  const outlineColor = '#080808';

  // 8-bit Heart bitmask (8 wide x 7 high)
  const pattern = [
    ' 11 11 ',
    '1111111',
    '1111111',
    ' 11111 ',
    '  111  ',
    '   1   '
  ];

  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c] === '1') {
        const isHighlight = (r === 1 && c === 1) || (r === 2 && c === 1);
        ctx.fillStyle = isHighlight ? highlightColor : mainColor;
        ctx.fillRect(ix + c * s, iy + r * s, s, s);
      }
    }
  }

  // Black outline top pixels
  ctx.fillStyle = outlineColor;
  ctx.fillRect(ix + 3 * s, iy, s, s);
}

// Helper: draw 8-bit diamond crystal (Dawn Energy / Memory Shard)
export function drawPixelCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 10,
  h: number = 14,
  mainColor: string = '#58a8f8',
  highlightColor: string = '#d8f0f8',
  shadowColor: string = '#183888'
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const halfW = Math.floor(w / 2);
  const halfH = Math.floor(h / 2);

  for (let dy = -halfH; dy <= halfH; dy++) {
    const span = Math.floor((1 - Math.abs(dy) / halfH) * halfW);
    if (span < 1) continue;
    // Left highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(ix - span, iy + dy, Math.max(1, Math.floor(span * 0.4)), 1);
    // Center main
    ctx.fillStyle = mainColor;
    ctx.fillRect(ix - span + Math.floor(span * 0.4), iy + dy, Math.max(1, Math.floor(span * 0.8)), 1);
    // Right shadow
    ctx.fillStyle = shadowColor;
    ctx.fillRect(ix + Math.floor(span * 0.2), iy + dy, Math.max(1, span - Math.floor(span * 0.2)), 1);
  }
}
