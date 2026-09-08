// ============================================================================
// 8-BIT STRICT COLOR PALETTE & ANTI-ALIASING CONSTRAINT HELPER
// ============================================================================
// Enforces an authentic 8-bit aesthetic across rendered sprites and canvas buffers:
// 1. Snaps all rendered colors strictly to the master 8-bit PALETTE.
// 2. Eliminates anti-aliasing, color-blending, and smooth gradient transitions.
// 3. Imposes hard binary alpha thresholding (no semi-transparent edge fringes).
// 4. Disables canvas image smoothing across all rendering contexts.

import { PALETTE, RGB, hexToRgb } from './palette';

export interface PaletteEntry {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
}

// Pre-parse the master palette into RGB entries for high-speed color quantization
export const PALETTE_ENTRIES: PaletteEntry[] = Object.entries(PALETTE).map(([name, hex]) => {
  const rgb = hexToRgb(hex);
  return {
    name,
    hex,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b
  };
});

// Fast lookup cache for 24-bit RGB colors: (r << 16) | (g << 8) | b -> PaletteEntry
const colorLookupCache = new Map<number, PaletteEntry>();

// Populate cache with exact palette colors (distance 0)
for (const entry of PALETTE_ENTRIES) {
  const key = (entry.r << 16) | (entry.g << 8) | entry.b;
  colorLookupCache.set(key, entry);
}

/**
 * Finds the closest color in the master 8-bit PALETTE using perceptually-weighted Euclidean distance.
 */
export function getClosestPaletteColor(r: number, g: number, b: number): PaletteEntry {
  const key = (r << 16) | (g << 8) | b;
  const cached = colorLookupCache.get(key);
  if (cached) return cached;

  let bestDist = Infinity;
  let bestEntry = PALETTE_ENTRIES[0];

  for (let i = 0; i < PALETTE_ENTRIES.length; i++) {
    const entry = PALETTE_ENTRIES[i];
    const dr = r - entry.r;
    const dg = g - entry.g;
    const db = b - entry.b;

    // Perceptually weighted color difference formula:
    // Human vision is most sensitive to green, then red, then blue
    const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;

    if (dist < bestDist) {
      bestDist = dist;
      bestEntry = entry;
      if (dist === 0) break;
    }
  }

  // Memoize result
  colorLookupCache.set(key, bestEntry);
  return bestEntry;
}

/**
 * Parses any color string (hex, rgb, rgba) or RGB object into RGB channels.
 */
export function parseColor(color: string | RGB): RGB {
  if (typeof color === 'object' && color !== null && 'r' in color) {
    return {
      r: Math.max(0, Math.min(255, Math.round(color.r))),
      g: Math.max(0, Math.min(255, Math.round(color.g))),
      b: Math.max(0, Math.min(255, Math.round(color.b)))
    };
  }

  const str = String(color).trim().toLowerCase();
  if (str.startsWith('#')) {
    let clean = str.replace('#', '');
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    return hexToRgb('#' + clean);
  }

  const rgbMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10))),
      g: Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10))),
      b: Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)))
    };
  }

  return hexToRgb(str);
}

/**
 * Snaps any given color strictly to the nearest color in the 8-bit PALETTE.
 */
export function snapColorToPalette(color: string | RGB): string {
  const rgb = parseColor(color);
  return getClosestPaletteColor(rgb.r, rgb.g, rgb.b).hex;
}

/**
 * Disables all image smoothing and anti-aliasing flags on a 2D rendering context.
 */
export function disableImageSmoothing(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = false;
  const anyCtx = ctx as any;
  if ('mozImageSmoothingEnabled' in anyCtx) anyCtx.mozImageSmoothingEnabled = false;
  if ('webkitImageSmoothingEnabled' in anyCtx) anyCtx.webkitImageSmoothingEnabled = false;
  if ('msImageSmoothingEnabled' in anyCtx) anyCtx.msImageSmoothingEnabled = false;
}

/**
 * Quantizes an ImageData pixel buffer directly to the 8-bit PALETTE:
 * - Binary alpha thresholding: Alpha values below threshold become 0 (transparent).
 * - Visible pixels (alpha >= threshold) become fully opaque (255) and snap to the closest palette color.
 * - Eradicates anti-aliasing fringes and smooth transitions.
 */
export function quantizeImageDataToPalette(
  imageData: ImageData,
  alphaThreshold: number = 128
): ImageData {
  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const a = data[i + 3];
    if (a < alphaThreshold) {
      // Eliminate anti-aliasing edge halos
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else {
      // Snap RGB strictly to authentic 8-bit palette and make completely opaque
      const entry = getClosestPaletteColor(data[i], data[i + 1], data[i + 2]);
      data[i] = entry.r;
      data[i + 1] = entry.g;
      data[i + 2] = entry.b;
      data[i + 3] = 255;
    }
  }

  return imageData;
}

/**
 * Helper function to enforce a strict color palette constraint across a sprite's bounding box
 * or an entire canvas. Ensures no anti-aliasing or smooth transitions remain.
 *
 * @param ctx The CanvasRenderingContext2D to enforce constraints upon.
 * @param x Optional left coordinate of the sprite bounding box (defaults to 0).
 * @param y Optional top coordinate of the sprite bounding box (defaults to 0).
 * @param width Optional width of the sprite bounding box (defaults to canvas width).
 * @param height Optional height of the sprite bounding box (defaults to canvas height).
 * @param alphaThreshold Threshold above which pixels become opaque palette colors (default: 128).
 */
export function enforcePaletteConstraint(
  ctx: CanvasRenderingContext2D,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  alphaThreshold: number = 128
): void {
  disableImageSmoothing(ctx);

  const canvasW = ctx.canvas.width;
  const canvasH = ctx.canvas.height;

  const targetX = x !== undefined ? Math.floor(x) : 0;
  const targetY = y !== undefined ? Math.floor(y) : 0;
  const targetW = width !== undefined ? Math.ceil(width) : canvasW;
  const targetH = height !== undefined ? Math.ceil(height) : canvasH;

  // Clamp bounding box to valid canvas bounds
  const ix = Math.max(0, Math.min(canvasW, targetX));
  const iy = Math.max(0, Math.min(canvasH, targetY));
  const iw = Math.min(canvasW - ix, Math.max(0, targetW - (ix - targetX)));
  const ih = Math.min(canvasH - iy, Math.max(0, targetH - (iy - targetY)));

  if (iw <= 0 || ih <= 0) return;

  const imgData = ctx.getImageData(ix, iy, iw, ih);
  quantizeImageDataToPalette(imgData, alphaThreshold);
  ctx.putImageData(imgData, ix, iy);
}

/**
 * Convenience helper specifically for individual sprite rendering passes.
 * Clamps coordinates to integer pixels and enforces the strict 8-bit palette.
 */
export function enforceSpritePalette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  alphaThreshold: number = 128
): void {
  enforcePaletteConstraint(ctx, x, y, width, height, alphaThreshold);
}

/**
 * Higher-order helper function: Disables anti-aliasing, executes the sprite rendering callback,
 * and then enforces the strict palette constraint across the sprite bounding box.
 */
export function renderConstrainedSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  renderFn: () => void,
  alphaThreshold: number = 128
): void {
  disableImageSmoothing(ctx);
  renderFn();
  enforceSpritePalette(ctx, x, y, width, height, alphaThreshold);
}
