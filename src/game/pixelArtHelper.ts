// Authentic Dark Gothic 2D Pixel Art Helper & Color Palettes
// Provides stepped dither patterns, pixel-perfect rasterization, and ornate gothic primitives.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Master Dark Gothic Color Palette:
// Charcoal blacks, deep stone grays, cold slate, dried blood & deep burgundy,
// aged brass / reliquary gold, arterial crimson, cold pale moonlight cyan, and eerie crypt green.
export const PALETTE = {
  // Charcoal Blacks & Deep Shadows
  BLACK: '#060608',
  DARKEST_GRAY: '#0f0e13',
  DARK_GRAY: '#1e1c24',
  MID_GRAY: '#363440',
  LIGHT_GRAY: '#5e5a6c',
  BRIGHT_GRAY: '#8e8a9f',
  PALE_STONE: '#c2c0cf',
  WHITE: '#edeef4',

  // Deep Blood & Dried Burgundy
  DEEP_MAROON: '#1f060b',
  DARK_RED: '#3d0c15',
  BURGUNDY: '#5e101f',
  CRIMSON: '#8f172a',
  BRIGHT_RED: '#c41e35',
  ARTERIAL_RED: '#eb2d47',
  SALMON: '#f57a8a',

  // Aged Brass, Tarnished Reliquary Gold & Candle Light
  DEEP_BROWN: '#23150c',
  RUST: '#442310',
  AMBER_DARK: '#683713',
  AMBER: '#96551b',
  BRASS: '#ba7725',
  GOLD: '#dca33c',
  PALE_GOLD: '#f2cc6b',
  SUN_YELLOW: '#faea9a',
  CANDLE_WHITE: '#fffde6',

  // Crypt Moss & Eerie Swamp Green
  NIGHT_GREEN: '#07120c',
  DARK_PINE: '#0f2418',
  MOSS_GREEN: '#1c3e29',
  FOREST_GREEN: '#2d5c3d',
  BRIGHT_GREEN: '#47855b',
  MINT_GREEN: '#7bbd8f',

  // Cold Pale Moonlight, Iron & Relic Indigo
  MIDNIGHT_BLUE: '#080c14',
  DARK_NAVY: '#0e1624',
  ROYAL_BLUE: '#182740',
  STEEL_BLUE: '#2b4164',
  SKY_BLUE: '#496d9e',
  CYAN_HIGHLIGHT: '#7da4cf',
  ICE_WHITE: '#c8def5',

  // Mourning Shroud & Void Violet
  VOID_PURPLE: '#12081a',
  DARK_VIOLET: '#231032',
  PURPLE: '#411c5b',
  MAGENTA: '#692b8d',
  LAVENDER: '#9549be',
  PALE_LILAC: '#caa0e8'
};

// 4x4 Bayer Dither Matrix for authentic stepped retro gradient dithering
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

// Helper: draw dithered sky band between two colors
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

// Helper: draw pixel circle with integer coordinates and crisp edges
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

// Helper: draw gothic ornate pointed arch
export function drawGothicArch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  outerColor: string = PALETTE.DARKEST_GRAY,
  innerColor: string = PALETTE.BLACK,
  archThickness: number = 3
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.floor(w);
  const ih = Math.floor(h);

  // Vertical jamb pillars
  drawPixelRect(ctx, outerColor, ix, iy + Math.floor(ih * 0.35), archThickness, Math.floor(ih * 0.65));
  drawPixelRect(ctx, outerColor, ix + iw - archThickness, iy + Math.floor(ih * 0.35), archThickness, Math.floor(ih * 0.65));

  // Interior fill
  drawPixelRect(ctx, innerColor, ix + archThickness, iy + Math.floor(ih * 0.35), iw - archThickness * 2, Math.floor(ih * 0.65));

  // Stepped pointed gothic apex
  const archHeight = Math.floor(ih * 0.35);
  for (let dy = 0; dy < archHeight; dy++) {
    const step = dy / archHeight;
    const halfSpan = Math.floor((step) * (iw / 2));
    const py = iy + dy;

    // Fill inner cavity
    drawPixelRect(ctx, innerColor, ix + (iw / 2) - halfSpan, py, halfSpan * 2, 1);

    // Left & right outer pointed stone voussoirs
    drawPixelRect(ctx, outerColor, ix + (iw / 2) - halfSpan - archThickness, py, archThickness, 1);
    drawPixelRect(ctx, outerColor, ix + (iw / 2) + halfSpan, py, archThickness, 1);
  }

  // Apex finial
  drawPixelRect(ctx, outerColor, ix + Math.floor(iw / 2) - 1, iy - 2, 2, 3);
}

// Helper: draw gothic stained glass rose window
export function drawRoseWindow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  frameColor: string = PALETTE.DARKEST_GRAY,
  accentColor: string = PALETTE.CRIMSON,
  glowColor: string = PALETTE.PALE_GOLD
) {
  const r = Math.floor(radius);
  // Outer stone ring
  drawPixelCircle(ctx, frameColor, cx, cy, r);
  // Colored glass interior
  drawPixelCircle(ctx, accentColor, cx, cy, r - 2);

  // Center golden rosette
  drawPixelCircle(ctx, glowColor, cx, cy, Math.floor(r * 0.35));

  // Stone tracery cross mullions
  drawPixelRect(ctx, frameColor, cx - r + 2, cy, (r - 2) * 2, 1);
  drawPixelRect(ctx, frameColor, cx, cy - r + 2, 1, (r - 2) * 2);
  drawPixelRect(ctx, frameColor, cx - 1, cy - 1, 3, 3);
}

// Helper: draw ornate stone crucifix / wayside cross
export function drawOrnateCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number = 24,
  stoneColor: string = PALETTE.MID_GRAY,
  accentColor: string = PALETTE.BRIGHT_GRAY
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const beamW = 3;
  const crossbarY = iy + Math.floor(h * 0.3);
  const crossbarW = Math.floor(h * 0.6);

  // Vertical shaft
  drawPixelRect(ctx, stoneColor, ix, iy, beamW, h);
  drawPixelRect(ctx, accentColor, ix + 1, iy, 1, h);

  // Horizontal bar
  drawPixelRect(ctx, stoneColor, ix - Math.floor(crossbarW / 2) + 1, crossbarY, crossbarW, beamW);
  drawPixelRect(ctx, accentColor, ix - Math.floor(crossbarW / 2) + 1, crossbarY + 1, crossbarW, 1);

  // Base stepped pedestal
  drawPixelRect(ctx, stoneColor, ix - 3, iy + h - 2, beamW + 6, 2);
  drawPixelRect(ctx, stoneColor, ix - 5, iy + h, beamW + 10, 3);
}

// Helper: draw gothic ornate stone box (UI frame) with corner filigree
export function drawGothicBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string = PALETTE.BLACK,
  borderColor: string = PALETTE.LIGHT_GRAY,
  filigreeColor: string = PALETTE.BRASS
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.floor(w);
  const ih = Math.floor(h);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(ix, iy, iw, ih);

  // Outer 1px frame
  ctx.fillStyle = borderColor;
  ctx.fillRect(ix, iy, iw, 1);
  ctx.fillRect(ix, iy + ih - 1, iw, 1);
  ctx.fillRect(ix, iy, 1, ih);
  ctx.fillRect(ix + iw - 1, iy, 1, ih);

  // Inner margin 1px frame
  ctx.fillStyle = filigreeColor;
  ctx.fillRect(ix + 2, iy + 2, iw - 4, 1);
  ctx.fillRect(ix + 2, iy + ih - 3, iw - 4, 1);
  ctx.fillRect(ix + 2, iy + 2, 1, ih - 4);
  ctx.fillRect(ix + iw - 3, iy + 2, 1, ih - 4);

  // Ornate 3x3 corner crosses
  const corners = [
    [ix, iy],
    [ix + iw - 3, iy],
    [ix, iy + ih - 3],
    [ix + iw - 3, iy + ih - 3]
  ];
  for (const [cx, cy] of corners) {
    drawPixelRect(ctx, filigreeColor, cx, cy, 3, 3);
    drawPixelRect(ctx, PALETTE.PALE_GOLD, cx + 1, cy + 1, 1, 1);
  }
}

// Helper: draw 8-bit classic box (for backwards compatibility)
export function drawPixelBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string = PALETTE.BLACK,
  borderColor: string = PALETTE.PALE_STONE,
  cornerColor: string = PALETTE.BRASS
) {
  drawGothicBox(ctx, x, y, w, h, bgColor, borderColor, cornerColor);
}

// Helper: draw gothic reliquary crystal (Dawn Energy / Memory Shard)
export function drawPixelCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 10,
  h: number = 14,
  mainColor: string = PALETTE.CYAN_HIGHLIGHT,
  highlightColor: string = PALETTE.ICE_WHITE,
  shadowColor: string = PALETTE.STEEL_BLUE
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const halfW = Math.floor(w / 2);
  const halfH = Math.floor(h / 2);

  for (let dy = -halfH; dy <= halfH; dy++) {
    const span = Math.floor((1 - Math.abs(dy) / halfH) * halfW);
    if (span < 1) continue;
    // Left facet highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(ix - span, iy + dy, Math.max(1, Math.floor(span * 0.35)), 1);
    // Center facet
    ctx.fillStyle = mainColor;
    ctx.fillRect(ix - span + Math.floor(span * 0.35), iy + dy, Math.max(1, Math.floor(span * 0.8)), 1);
    // Right shadow facet
    ctx.fillStyle = shadowColor;
    ctx.fillRect(ix + Math.floor(span * 0.15), iy + dy, Math.max(1, span - Math.floor(span * 0.15)), 1);
  }

  // Holy reliquary core gleam
  drawPixelRect(ctx, PALETTE.WHITE, ix - 1, iy - 1, 2, 2);
}

