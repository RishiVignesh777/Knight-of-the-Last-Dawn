// Authentic Dark Gothic 2D Pixel Art Helper & Color Palettes
// Provides stepped dither patterns, pixel-perfect rasterization, and ornate gothic primitives.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Master Dark Gothic Color Palette & 16-Bit 5-Tone Shading Ramps
export const PALETTE = {
  // Charcoal Blacks & Deep Shadows
  BLACK: '#040406',
  DARKEST_GRAY: '#0a0a0f',
  DARK_GRAY: '#181620',
  MID_GRAY: '#2e2b38',
  LIGHT_GRAY: '#524e62',
  BRIGHT_GRAY: '#827e94',
  PALE_STONE: '#b8b5c8',
  WHITE: '#edeef4',

  // Bone White & Weathered Alabaster
  BONE_DEEP_SHADOW: '#222026',
  BONE_SHADOW: '#484452',
  BONE_BASE: '#8a8596',
  BONE_HIGHLIGHT: '#c6c2d4',
  BONE_SPECULAR: '#f4f2fa',

  // 16-Bit Steel & Plate Armor Ramp (5-tone)
  IRON_DEEP_SHADOW: '#0e1018',
  IRON_SHADOW: '#1c202d',
  IRON_BASE: '#323a4e',
  IRON_HIGHLIGHT: '#586584',
  IRON_SPECULAR: '#9eb0d4',

  // Deep Blood & Dried Burgundy Ramp (5-tone)
  DEEP_MAROON: '#180408',
  DARK_RED: '#320a13',
  BURGUNDY: '#520e1e',
  CRIMSON: '#821628',
  BRIGHT_RED: '#b81e35',
  ARTERIAL_RED: '#e42c46',
  SALMON: '#f57a8a',

  // Aged Brass & Tarnished Reliquary Gold Ramp (5-tone)
  DEEP_BROWN: '#1e1108',
  RUST: '#3c1d0c',
  AMBER_DARK: '#5c2f0f',
  AMBER: '#884816',
  BRASS: '#af6e1e',
  GOLD: '#d2962e',
  PALE_GOLD: '#ecc25e',
  SUN_YELLOW: '#f8e68e',
  CANDLE_WHITE: '#fffde2',

  // Crypt Moss & Petrified Forest Green Ramp (5-tone)
  NIGHT_GREEN: '#050f09',
  DARK_PINE: '#0c1d13',
  MOSS_GREEN: '#163321',
  FOREST_GREEN: '#244c32',
  BRIGHT_GREEN: '#3d724c',
  MINT_GREEN: '#6ea880',
  PALE_MOSS: '#a8d2b5',

  // Cold Pale Moonlight & Starlight Indigo Ramp (5-tone)
  MIDNIGHT_BLUE: '#060910',
  DARK_NAVY: '#0a101b',
  ROYAL_BLUE: '#121d30',
  STEEL_BLUE: '#22344f',
  SKY_BLUE: '#3d5c87',
  CYAN_HIGHLIGHT: '#6d95c4',
  ICE_WHITE: '#c2d9f2',

  // Mourning Shroud & Void Violet Ramp (5-tone)
  VOID_PURPLE: '#0e0514',
  DARK_VIOLET: '#1c0c28',
  PURPLE: '#34144b',
  MAGENTA: '#582176',
  LAVENDER: '#823aa8',
  PALE_LILAC: '#bfa0dc'
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

// Helper: draw 16-bit hand-crafted animated water reflection
export function draw16BitWaterReflection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  time: number,
  reflectionColor: string = PALETTE.ICE_WHITE,
  waterColor: string = PALETTE.DARK_NAVY
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.floor(w);
  const ih = Math.floor(h);

  // Base deep water
  drawPixelRect(ctx, waterColor, ix, iy, iw, ih);

  // Animated shimmering horizontal reflection ribbons with sinusoidal offset
  for (let dy = 0; dy < ih; dy += 2) {
    const depthFactor = dy / ih;
    const waveOffset = Math.sin(time * 2.5 + dy * 0.4) * (4 + depthFactor * 8);
    const lineSpan = Math.floor((1 - depthFactor * 0.6) * (iw * 0.45));
    const centerX = ix + Math.floor(iw / 2) + Math.floor(waveOffset);

    // Staggered dither line
    const alphaStep = (Math.floor(dy / 2) + Math.floor(time * 3)) % 2 === 0;
    if (alphaStep) {
      drawPixelRect(ctx, reflectionColor, centerX - lineSpan, iy + dy, lineSpan * 2, 1);
      // Fading flanks
      drawPixelRect(ctx, PALETTE.SKY_BLUE, centerX - lineSpan - 3, iy + dy, 2, 1);
      drawPixelRect(ctx, PALETTE.SKY_BLUE, centerX + lineSpan + 1, iy + dy, 2, 1);
    }
  }
}

// Helper: draw 16-bit monumental ribbed cathedral pier/pillar
export function draw16BitPillar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iw = Math.max(14, Math.floor(w));
  const ih = Math.floor(h);

  // Pillar Capital at top
  drawPixelRect(ctx, PALETTE.BLACK, ix - 3, iy, iw + 6, 4);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix - 2, iy + 1, iw + 4, 2);
  drawPixelRect(ctx, PALETTE.BONE_BASE, ix - 1, iy + 2, iw + 2, 2);
  drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, ix, iy + 1, Math.floor(iw * 0.4), 1);

  // Ribbed column shaft with 5-tone vertical shading
  drawPixelRect(ctx, PALETTE.BONE_DEEP_SHADOW, ix, iy + 4, 2, ih - 8);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix + 2, iy + 4, 3, ih - 8);
  drawPixelRect(ctx, PALETTE.BONE_BASE, ix + 5, iy + 4, iw - 10, ih - 8);
  drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, ix + iw - 5, iy + 4, 3, ih - 8);
  drawPixelRect(ctx, PALETTE.BONE_SPECULAR, ix + iw - 2, iy + 4, 2, ih - 8);

  // Stone joint lines every 24px
  for (let dy = 20; dy < ih - 12; dy += 24) {
    drawPixelRect(ctx, PALETTE.BLACK, ix, iy + dy, iw, 1);
    drawPixelRect(ctx, PALETTE.BONE_SPECULAR, ix + 2, iy + dy + 1, iw - 4, 1);
  }

  // Base plinth at bottom
  drawPixelRect(ctx, PALETTE.BLACK, ix - 4, iy + ih - 4, iw + 8, 4);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix - 3, iy + ih - 3, iw + 6, 2);
  drawPixelRect(ctx, PALETTE.BONE_BASE, ix - 2, iy + ih - 2, iw + 4, 2);
}

// Helper: draw 16-bit hanging iron chains
export function draw16BitChain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const ih = Math.floor(h);

  for (let dy = 0; dy < ih; dy += 6) {
    // Alternating link orientation
    const isVertical = (Math.floor(dy / 6) % 2) === 0;
    if (isVertical) {
      drawPixelRect(ctx, PALETTE.BLACK, ix, iy + dy, 3, 5);
      drawPixelRect(ctx, PALETTE.IRON_HIGHLIGHT, ix + 1, iy + dy + 1, 1, 3);
      drawPixelRect(ctx, PALETTE.BLACK, ix + 1, iy + dy + 2, 1, 1); // center hole
    } else {
      drawPixelRect(ctx, PALETTE.BLACK, ix - 1, iy + dy, 5, 3);
      drawPixelRect(ctx, PALETTE.IRON_SPECULAR, ix, iy + dy + 1, 3, 1);
    }
  }
}

// Helper: draw 16-bit cluster of gothic beeswax candles
export function draw16BitCandleCluster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  // Three tiered candles: Tall (left), Medium (center), Short with heavy wax pools (right)
  const candles = [
    { ox: 0, h: 14, waxW: 4 },
    { ox: 5, h: 18, waxW: 4 },
    { ox: 10, h: 9, waxW: 5 }
  ];

  // Wax pool base
  drawPixelRect(ctx, PALETTE.DEEP_BROWN, ix - 2, iy, 18, 3);
  drawPixelRect(ctx, PALETTE.PALE_GOLD, ix - 1, iy + 1, 16, 1);

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const cx = ix + c.ox;
    const cy = iy - c.h;

    // Wax body with shadow & highlight
    drawPixelRect(ctx, PALETTE.DEEP_BROWN, cx, cy, c.waxW, c.h);
    drawPixelRect(ctx, PALETTE.PALE_GOLD, cx + 1, cy, c.waxW - 2, c.h);
    drawPixelRect(ctx, PALETTE.CANDLE_WHITE, cx + 1, cy + 1, 1, c.h - 2);

    // Black wick
    drawPixelRect(ctx, PALETTE.BLACK, cx + Math.floor(c.waxW / 2), cy - 2, 1, 2);

    // Flickering pixel flame
    const flicker = Math.floor(time * 8 + i * 2) % 3;
    const flameH = flicker === 0 ? 5 : flicker === 1 ? 4 : 6;
    const flameColor = flicker === 2 ? PALETTE.CANDLE_WHITE : PALETTE.SUN_YELLOW;
    drawPixelRect(ctx, PALETTE.BRIGHT_RED, cx + Math.floor(c.waxW / 2) - 1, cy - 2 - flameH, 3, flameH);
    drawPixelRect(ctx, flameColor, cx + Math.floor(c.waxW / 2), cy - 1 - flameH, 1, flameH - 1);
  }
}

// Helper: draw 16-bit weeping hooded saint statue
export function draw16BitStatue(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number = 64
) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  // Stone plinth
  drawPixelRect(ctx, PALETTE.BLACK, ix - 8, iy + h - 6, 26, 6);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix - 7, iy + h - 5, 24, 4);
  drawPixelRect(ctx, PALETTE.BONE_BASE, ix - 5, iy + h - 3, 20, 2);

  // Flowing stone robe folds
  drawPixelRect(ctx, PALETTE.BLACK, ix - 4, iy + 22, 18, h - 28);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix - 3, iy + 23, 16, h - 30);
  drawPixelRect(ctx, PALETTE.BONE_BASE, ix - 1, iy + 24, 12, h - 32);
  drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, ix + 2, iy + 26, 3, h - 35);

  // Hooded head bent in weeping mourning
  drawPixelRect(ctx, PALETTE.BLACK, ix, iy + 6, 10, 14);
  drawPixelRect(ctx, PALETTE.BONE_SHADOW, ix + 1, iy + 7, 8, 12);
  drawPixelRect(ctx, PALETTE.BLACK, ix + 3, iy + 10, 4, 6); // shadow inside cowl

  // Stone halo ring behind head
  drawPixelCircle(ctx, PALETTE.BONE_HIGHLIGHT, ix + 5, iy + 10, 9);
  drawPixelCircle(ctx, PALETTE.BLACK, ix + 5, iy + 10, 7);

  // Clasped praying stone hands holding fictional reliquary
  drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, ix + 3, iy + 24, 4, 5);
  drawPixelRect(ctx, PALETTE.GOLD, ix + 4, iy + 23, 2, 3);
}

// Helper: draw original fictional religious symbol of Eldoria (Heart of Dawn Emblem)
export function drawHeartOfDawnEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1
) {
  const r = Math.floor(7 * scale);
  // Outer spiked halo sunburst rays
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    const rayX = Math.floor(cx + Math.cos(ang) * (r + 4));
    const rayY = Math.floor(cy + Math.sin(ang) * (r + 4));
    drawPixelRect(ctx, PALETTE.GOLD, rayX, rayY, 2, 2);
  }
  // Golden circular halo
  drawPixelCircle(ctx, PALETTE.PALE_GOLD, cx, cy, r);
  drawPixelCircle(ctx, PALETTE.BLACK, cx, cy, Math.max(1, r - 2));

  // Sacred heart / eye center
  drawPixelRect(ctx, PALETTE.SUN_YELLOW, cx - 1, cy - 1, 3, 3);
  drawPixelRect(ctx, PALETTE.WHITE, cx, cy, 1, 1);
}


