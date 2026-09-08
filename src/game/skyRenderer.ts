// ============================================================================
// 8-BIT PIXEL-DITHERED SKY RENDERING SYSTEM
// ============================================================================
// Replaces smooth canvas gradients with an authentic ordered-dither pattern system.
// Utilizes strictly restricted retro palettes for sunset, twilight, night, and dawn phases.

import { PALETTE } from './palette';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';
import { AreaId } from '../types';

export type DitherPatternType = 'bayer4x4' | 'bayer8x8' | 'bayer2x2' | 'scanline' | 'checkerboard';
export type SkyPhase = 'sunset' | 'twilight' | 'auto';

// Check hardware endianness for ultra-fast direct Uint32 buffer rasterization
const isLittleEndian = (() => {
  const buf = new ArrayBuffer(4);
  new Uint32Array(buf)[0] = 0x11223344;
  return new Uint8Array(buf)[0] === 0x44;
})();

export function hexToU32(hex: string, alpha: number = 255): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const a = Math.floor(Math.max(0, Math.min(255, alpha)));

  if (isLittleEndian) {
    return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
  } else {
    return ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
  }
}

// ----------------------------------------------------------------------------
// DITHER MATRICES
// ----------------------------------------------------------------------------

export const DITHER_MATRICES = {
  bayer2x2: [
    [0 / 4, 2 / 4],
    [3 / 4, 1 / 4]
  ],
  bayer4x4: [
    [0 / 16, 8 / 16, 2 / 16, 10 / 16],
    [12 / 16, 4 / 16, 14 / 16, 6 / 16],
    [3 / 16, 11 / 16, 1 / 16, 9 / 16],
    [15 / 16, 7 / 16, 13 / 16, 5 / 16]
  ],
  bayer8x8: [
    [0 / 64, 32 / 64, 8 / 64, 40 / 64, 2 / 64, 34 / 64, 10 / 64, 42 / 64],
    [48 / 64, 16 / 64, 56 / 64, 24 / 64, 50 / 64, 18 / 64, 58 / 64, 26 / 64],
    [12 / 64, 44 / 64, 4 / 64, 36 / 64, 14 / 64, 46 / 64, 6 / 64, 38 / 64],
    [60 / 64, 28 / 64, 52 / 64, 20 / 64, 62 / 64, 30 / 64, 54 / 64, 22 / 64],
    [3 / 64, 35 / 64, 11 / 64, 43 / 64, 1 / 64, 33 / 64, 9 / 64, 41 / 64],
    [51 / 64, 19 / 64, 59 / 64, 27 / 64, 49 / 64, 17 / 64, 57 / 64, 25 / 64],
    [15 / 64, 47 / 64, 7 / 64, 39 / 64, 13 / 64, 45 / 64, 5 / 64, 37 / 64],
    [63 / 64, 31 / 64, 55 / 64, 23 / 64, 61 / 64, 29 / 64, 53 / 64, 21 / 64]
  ],
  scanline: [
    [0 / 8, 4 / 8, 1 / 8, 5 / 8],
    [6 / 8, 2 / 8, 7 / 8, 3 / 8]
  ],
  checkerboard: [
    [0.25, 0.75],
    [0.75, 0.25]
  ]
};

// ----------------------------------------------------------------------------
// RESTRICTED 8-BIT SKY PALETTES
// ----------------------------------------------------------------------------

export interface SkyColorStop {
  position: number; // 0.0 (top/zenith) to 1.0 (horizon)
  hex: string;
  u32: number;
}

// 1. RESTRICTED SUNSET PALETTE:
// Radiant, dramatic dusk shifting from deep violet space down through crimson, rust, and amber to golden horizon.
export const RESTRICTED_SUNSET_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.VOID_PURPLE, u32: hexToU32(PALETTE.VOID_PURPLE) },
  { position: 0.18, hex: PALETTE.DARK_VIOLET, u32: hexToU32(PALETTE.DARK_VIOLET) },
  { position: 0.36, hex: PALETTE.DEEP_MAROON, u32: hexToU32(PALETTE.DEEP_MAROON) },
  { position: 0.52, hex: PALETTE.CRIMSON, u32: hexToU32(PALETTE.CRIMSON) },
  { position: 0.68, hex: PALETTE.RUST, u32: hexToU32(PALETTE.RUST) },
  { position: 0.82, hex: PALETTE.AMBER_DARK, u32: hexToU32(PALETTE.AMBER_DARK) },
  { position: 0.92, hex: PALETTE.GOLD, u32: hexToU32(PALETTE.GOLD) },
  { position: 1.0, hex: PALETTE.SUN_YELLOW, u32: hexToU32(PALETTE.SUN_YELLOW) }
];

// 2. RESTRICTED TWILIGHT PALETTE:
// The mysterious dusk-to-nightfall transition where cold indigo cosmos overtakes dying embers.
export const RESTRICTED_TWILIGHT_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.BLACK, u32: hexToU32(PALETTE.BLACK) },
  { position: 0.22, hex: PALETTE.MIDNIGHT_BLUE, u32: hexToU32(PALETTE.MIDNIGHT_BLUE) },
  { position: 0.42, hex: PALETTE.DARK_NAVY, u32: hexToU32(PALETTE.DARK_NAVY) },
  { position: 0.60, hex: PALETTE.ROYAL_BLUE, u32: hexToU32(PALETTE.ROYAL_BLUE) },
  { position: 0.74, hex: PALETTE.VOID_PURPLE, u32: hexToU32(PALETTE.VOID_PURPLE) },
  { position: 0.86, hex: PALETTE.DARK_VIOLET, u32: hexToU32(PALETTE.DARK_VIOLET) },
  { position: 0.94, hex: PALETTE.DEEP_MAROON, u32: hexToU32(PALETTE.DEEP_MAROON) },
  { position: 1.0, hex: PALETTE.DARK_RED, u32: hexToU32(PALETTE.DARK_RED) }
];

// 3. OTHER RESTRICTED AREA SKY PALETTES:
export const RESTRICTED_CANOPY_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.NIGHT_GREEN, u32: hexToU32(PALETTE.NIGHT_GREEN) },
  { position: 0.4, hex: PALETTE.DARK_PINE, u32: hexToU32(PALETTE.DARK_PINE) },
  { position: 0.75, hex: PALETTE.MOSS_GREEN, u32: hexToU32(PALETTE.MOSS_GREEN) },
  { position: 1.0, hex: PALETTE.FOREST_GREEN, u32: hexToU32(PALETTE.FOREST_GREEN) }
];

export const RESTRICTED_MOONLIT_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.BLACK, u32: hexToU32(PALETTE.BLACK) },
  { position: 0.35, hex: PALETTE.MIDNIGHT_BLUE, u32: hexToU32(PALETTE.MIDNIGHT_BLUE) },
  { position: 0.7, hex: PALETTE.DARK_NAVY, u32: hexToU32(PALETTE.DARK_NAVY) },
  { position: 1.0, hex: PALETTE.STEEL_BLUE, u32: hexToU32(PALETTE.STEEL_BLUE) }
];

export const RESTRICTED_STORM_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.BLACK, u32: hexToU32(PALETTE.BLACK) },
  { position: 0.35, hex: PALETTE.VOID_PURPLE, u32: hexToU32(PALETTE.VOID_PURPLE) },
  { position: 0.7, hex: PALETTE.DARK_VIOLET, u32: hexToU32(PALETTE.DARK_VIOLET) },
  { position: 1.0, hex: PALETTE.PURPLE, u32: hexToU32(PALETTE.PURPLE) }
];

export const RESTRICTED_DAWN_STOPS: SkyColorStop[] = [
  { position: 0.0, hex: PALETTE.DARK_VIOLET, u32: hexToU32(PALETTE.DARK_VIOLET) },
  { position: 0.28, hex: PALETTE.PURPLE, u32: hexToU32(PALETTE.PURPLE) },
  { position: 0.55, hex: PALETTE.AMBER_DARK, u32: hexToU32(PALETTE.AMBER_DARK) },
  { position: 0.8, hex: PALETTE.GOLD, u32: hexToU32(PALETTE.GOLD) },
  { position: 1.0, hex: PALETTE.SUN_YELLOW, u32: hexToU32(PALETTE.SUN_YELLOW) }
];

// ----------------------------------------------------------------------------
// SKY RENDERER CLASS
// ----------------------------------------------------------------------------

export class SkyRenderer {
  private skyCanvas: HTMLCanvasElement;
  private skyCtx: CanvasRenderingContext2D;
  private skyImageData: ImageData;
  private skyU32: Uint32Array;

  // Active Phase Configuration
  public activePhase: SkyPhase = 'auto';
  public ditherPattern: DitherPatternType = 'bayer4x4';
  public pixelSize: number = 2; // 2 for chunky 8-bit retro aesthetic, 1 for fine pixel precision

  constructor() {
    this.skyCanvas = document.createElement('canvas');
    this.skyCanvas.width = VIRTUAL_WIDTH;
    this.skyCanvas.height = VIRTUAL_HEIGHT;
    this.skyCtx = this.skyCanvas.getContext('2d', { willReadFrequently: true })!;
    this.skyImageData = this.skyCtx.createImageData(VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    this.skyU32 = new Uint32Array(this.skyImageData.data.buffer);
  }

  /**
   * Evaluates the phase blend factor between Sunset (0.0) and Twilight (1.0).
   * In 'auto' mode, smoothly oscillates on a slow atmospheric cycle.
   */
  public getPhaseBlend(time: number): number {
    if (this.activePhase === 'sunset') return 0.0;
    if (this.activePhase === 'twilight') return 1.0;

    // Auto cycle: 90 second cycle: 40s Sunset -> 10s Transition -> 30s Twilight -> 10s Transition
    const cyclePeriod = 80;
    const t = (time % cyclePeriod) / cyclePeriod; // 0.0 to 1.0
    if (t < 0.45) {
      return 0.0; // Pure sunset
    } else if (t < 0.55) {
      return (t - 0.45) / 0.10; // Sunset -> Twilight transition
    } else if (t < 0.90) {
      return 1.0; // Pure twilight
    } else {
      return 1.0 - ((t - 0.90) / 0.10); // Twilight -> Sunset transition
    }
  }

  /**
   * Renders a fully pixel-dithered sky gradient using the specified color stops and pattern matrix.
   * Every single pixel is strictly a color from the restricted palette.
   */
  public renderDitheredGradientBuffer(
    stops: SkyColorStop[],
    pattern: DitherPatternType = this.ditherPattern,
    pixelSize: number = this.pixelSize,
    startY: number = 0,
    endY: number = VIRTUAL_HEIGHT
  ) {
    const matrix = DITHER_MATRICES[pattern] || DITHER_MATRICES.bayer4x4;
    const matrixH = matrix.length;
    const matrixW = matrix[0].length;
    const u32 = this.skyU32;

    const totalHeight = Math.max(1, endY - startY);

    for (let py = startY; py < endY; py++) {
      const normalizedY = (py - startY) / totalHeight;
      const matrixY = Math.floor(py / pixelSize) % matrixH;

      // Find surrounding color stops
      let topStop = stops[0];
      let bottomStop = stops[stops.length - 1];

      for (let i = 0; i < stops.length - 1; i++) {
        if (normalizedY >= stops[i].position && normalizedY <= stops[i + 1].position) {
          topStop = stops[i];
          bottomStop = stops[i + 1];
          break;
        }
      }

      const segmentSpan = Math.max(0.0001, bottomStop.position - topStop.position);
      const factor = Math.max(0, Math.min(1, (normalizedY - topStop.position) / segmentSpan));

      const rowOffset = py * VIRTUAL_WIDTH;

      for (let px = 0; px < VIRTUAL_WIDTH; px++) {
        const matrixX = Math.floor(px / pixelSize) % matrixW;
        const threshold = matrix[matrixY][matrixX];

        // Strict 8-bit palette selection via Bayer threshold
        const chosenU32 = factor > threshold ? bottomStop.u32 : topStop.u32;
        u32[rowOffset + px] = chosenU32;
      }
    }

    this.skyCtx.putImageData(this.skyImageData, 0, 0);
  }

  /**
   * Blends between two restricted palettes (Sunset and Twilight) using spatial Bayer dithering.
   */
  public renderBlendedDitheredGradientBuffer(
    stopsA: SkyColorStop[],
    stopsB: SkyColorStop[],
    blendFactor: number,
    pattern: DitherPatternType = this.ditherPattern,
    pixelSize: number = this.pixelSize,
    startY: number = 0,
    endY: number = VIRTUAL_HEIGHT
  ) {
    if (blendFactor <= 0.01) {
      this.renderDitheredGradientBuffer(stopsA, pattern, pixelSize, startY, endY);
      return;
    }
    if (blendFactor >= 0.99) {
      this.renderDitheredGradientBuffer(stopsB, pattern, pixelSize, startY, endY);
      return;
    }

    const matrix = DITHER_MATRICES[pattern] || DITHER_MATRICES.bayer4x4;
    const matrixH = matrix.length;
    const matrixW = matrix[0].length;
    const u32 = this.skyU32;
    const totalHeight = Math.max(1, endY - startY);

    for (let py = startY; py < endY; py++) {
      const normalizedY = (py - startY) / totalHeight;
      const matrixY = Math.floor(py / pixelSize) % matrixH;

      // Find stops in Palette A
      let topA = stopsA[0];
      let botA = stopsA[stopsA.length - 1];
      for (let i = 0; i < stopsA.length - 1; i++) {
        if (normalizedY >= stopsA[i].position && normalizedY <= stopsA[i + 1].position) {
          topA = stopsA[i];
          botA = stopsA[i + 1];
          break;
        }
      }
      const spanA = Math.max(0.0001, botA.position - topA.position);
      const factorA = Math.max(0, Math.min(1, (normalizedY - topA.position) / spanA));

      // Find stops in Palette B
      let topB = stopsB[0];
      let botB = stopsB[stopsB.length - 1];
      for (let i = 0; i < stopsB.length - 1; i++) {
        if (normalizedY >= stopsB[i].position && normalizedY <= stopsB[i + 1].position) {
          topB = stopsB[i];
          botB = stopsB[i + 1];
          break;
        }
      }
      const spanB = Math.max(0.0001, botB.position - topB.position);
      const factorB = Math.max(0, Math.min(1, (normalizedY - topB.position) / spanB));

      const rowOffset = py * VIRTUAL_WIDTH;

      for (let px = 0; px < VIRTUAL_WIDTH; px++) {
        const matrixX = Math.floor(px / pixelSize) % matrixW;
        const threshold = matrix[matrixY][matrixX];

        // Interleaved phase dither test
        const isPhaseB = blendFactor > matrix[(matrixY + 2) % matrixH][(matrixX + 2) % matrixW];

        let chosenU32: number;
        if (isPhaseB) {
          chosenU32 = factorB > threshold ? botB.u32 : topB.u32;
        } else {
          chosenU32 = factorA > threshold ? botA.u32 : topA.u32;
        }

        u32[rowOffset + px] = chosenU32;
      }
    }

    this.skyCtx.putImageData(this.skyImageData, 0, 0);
  }

  /**
   * Renders the sunset or twilight sky into the target context, including celestial bodies and halo dithering.
   */
  public renderSunsetTwilightSky(
    targetCtx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    time: number,
    forcePhase?: SkyPhase
  ) {
    const phase = forcePhase || this.activePhase;
    let blend = 0.0;
    if (phase === 'twilight') {
      blend = 1.0;
    } else if (phase === 'sunset') {
      blend = 0.0;
    } else {
      blend = this.getPhaseBlend(time);
    }

    // 1. Render pixel-dithered sky buffer using restricted palettes
    this.renderBlendedDitheredGradientBuffer(
      RESTRICTED_SUNSET_STOPS,
      RESTRICTED_TWILIGHT_STOPS,
      blend,
      this.ditherPattern,
      this.pixelSize
    );

    // 2. Blit pixel-dithered sky buffer to canvas with slight vertical parallax
    const skyOffsetY = Math.floor(-camY * 0.02);
    targetCtx.drawImage(this.skyCanvas, 0, skyOffsetY);

    // 3. Render Pixel-Dithered Setting Sun or Twilight Moon/Stars
    if (blend < 0.85) {
      // Setting Sun: Descends lower and becomes redder as twilight approaches
      const sunBaseY = 58 + blend * 22;
      const sunX = Math.floor(VIRTUAL_WIDTH * 0.72 - (camX * 0.02));
      const sunY = Math.floor(sunBaseY - (camY * 0.02));
      const sunRadius = 16 - Math.floor(blend * 3);

      this.renderDitheredSun(targetCtx, sunX, sunY, sunRadius, blend);
    }

    // 4. In Twilight phase, render early twinkling stars
    if (blend > 0.35) {
      const starAlpha = Math.min(1.0, (blend - 0.35) / 0.5);
      this.renderTwilightStars(targetCtx, camX, time, starAlpha);
    }
  }

  /**
   * Renders a celestial sun disc with stepped concentric pixel rings and Bayer-dithered corona halos.
   * NO smooth canvas gradients! Pure pixel art.
   */
  public renderDitheredSun(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    coreRadius: number,
    twilightBlend: number
  ) {
    const matrix = DITHER_MATRICES.bayer4x4;
    const rOuter = coreRadius + 12;

    // Palette choices based on twilight depth
    const colorCore = twilightBlend > 0.4 ? PALETTE.GOLD : PALETTE.WHITE;
    const colorInnerRing = twilightBlend > 0.4 ? PALETTE.AMBER : PALETTE.SUN_YELLOW;
    const colorHalo = twilightBlend > 0.4 ? PALETTE.RUST : PALETTE.GOLD;
    const colorCorona = twilightBlend > 0.4 ? PALETTE.DEEP_MAROON : PALETTE.AMBER_DARK;

    // 1. Dithered outer corona & halo
    for (let dy = -rOuter; dy <= rOuter; dy += 2) {
      for (let dx = -rOuter; dx <= rOuter; dx += 2) {
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > rOuter) continue;

        const px = cx + dx;
        const py = cy + dy;
        const mx = Math.floor(px / 2) % 4;
        const my = Math.floor(py / 2) % 4;
        const threshold = matrix[my][mx];

        if (dist <= coreRadius * 0.5) {
          // Solid sun center
          ctx.fillStyle = colorCore;
          ctx.fillRect(px, py, 2, 2);
        } else if (dist <= coreRadius) {
          // Inner core boundary: dither between core and inner ring
          const t = (dist - coreRadius * 0.5) / (coreRadius * 0.5);
          ctx.fillStyle = t > threshold ? colorInnerRing : colorCore;
          ctx.fillRect(px, py, 2, 2);
        } else if (dist <= coreRadius + 6) {
          // Middle halo ring: dither between inner ring and halo
          const t = (dist - coreRadius) / 6;
          ctx.fillStyle = t > threshold ? colorHalo : colorInnerRing;
          ctx.fillRect(px, py, 2, 2);
        } else {
          // Outer corona: dither between halo and corona
          const t = (dist - (coreRadius + 6)) / 6;
          if (threshold > t * 0.8) {
            ctx.fillStyle = colorCorona;
            ctx.fillRect(px, py, 2, 2);
          }
        }
      }
    }
  }

  /**
   * Renders 8-bit twinkling starlight dots for the Twilight phase.
   */
  public renderTwilightStars(
    ctx: CanvasRenderingContext2D,
    camX: number,
    time: number,
    intensity: number
  ) {
    if (intensity <= 0) return;

    // Seeded pseudo-random fixed star field
    const starCount = Math.floor(28 * intensity);
    for (let s = 0; s < starCount; s++) {
      const sx = Math.floor((s * 47 - camX * 0.01 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
      const sy = Math.floor((s * 19 + 7) % 85); // Confined to upper sky
      const twinkle = (Math.floor(time * 3 + s) % 3 === 0);

      if (twinkle) {
        ctx.fillStyle = (s % 3 === 0) ? PALETTE.CYAN_HIGHLIGHT : (s % 3 === 1) ? PALETTE.ICE_WHITE : PALETTE.WHITE;
        ctx.fillRect(sx, sy, 1, 1);
        if (s % 7 === 0) {
          // Occasional 4-pixel cross sparkle
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        }
      } else {
        ctx.fillStyle = PALETTE.MID_GRAY;
        ctx.fillRect(sx, sy, 1, 1);
      }
    }
  }

  /**
   * Helper: draw 8-bit dithered transition band between any two colors.
   * Drop-in replacement for the old drawDitheredSky.
   */
  public drawDitheredBand(
    ctx: CanvasRenderingContext2D,
    colorTop: string,
    colorBottom: string,
    x: number,
    y: number,
    width: number,
    height: number,
    ditherBandHeight: number = 16,
    pattern: DitherPatternType = 'bayer4x4'
  ) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iw = Math.floor(width);
    const ih = Math.floor(height);

    const transitionY = iy + ih - ditherBandHeight;
    const matrix = DITHER_MATRICES[pattern] || DITHER_MATRICES.bayer4x4;
    const matrixH = matrix.length;
    const matrixW = matrix[0].length;

    // Solid top
    ctx.fillStyle = colorTop;
    ctx.fillRect(ix, iy, iw, Math.max(0, transitionY - iy));

    // Dithered transition
    for (let py = transitionY; py < iy + ih; py += 2) {
      const factor = (py - transitionY) / ditherBandHeight;
      const my = Math.floor(py / 2) % matrixH;
      for (let px = ix; px < ix + iw; px += 2) {
        const mx = Math.floor(px / 2) % matrixW;
        ctx.fillStyle = factor > matrix[my][mx] ? colorBottom : colorTop;
        ctx.fillRect(px, py, 2, 2);
      }
    }
  }

  /**
   * Title Screen Vista Sky: Uses full Sunset/Twilight restricted palette dither system.
   */
  public renderTitleScreenSky(ctx: CanvasRenderingContext2D, time: number) {
    // Determine title screen phase: subtle sunset/twilight breathing
    const titlePhaseBlend = (Math.sin(time * 0.1) + 1) * 0.35; // 0.0 (sunset) to 0.7 (deep dusk)
    this.renderBlendedDitheredGradientBuffer(
      RESTRICTED_SUNSET_STOPS,
      RESTRICTED_TWILIGHT_STOPS,
      titlePhaseBlend,
      'bayer4x4',
      2
    );
    ctx.drawImage(this.skyCanvas, 0, 0);

    // Title Sun
    const sunY = Math.floor(66 + Math.sin(time * 0.15) * 4);
    this.renderDitheredSun(ctx, 225, sunY, 18, titlePhaseBlend);

    // Twinkling stars in upper title sky
    if (titlePhaseBlend > 0.2) {
      this.renderTwilightStars(ctx, 0, time, titlePhaseBlend);
    }
  }

  /**
   * Cycles the active sky phase between Sunset, Twilight, and Auto.
   */
  public toggleSkyPhase(): SkyPhase {
    if (this.activePhase === 'auto') {
      this.activePhase = 'sunset';
    } else if (this.activePhase === 'sunset') {
      this.activePhase = 'twilight';
    } else {
      this.activePhase = 'auto';
    }
    return this.activePhase;
  }

  /**
   * Sets the active sky phase directly.
   */
  public setSkyPhase(phase: SkyPhase) {
    this.activePhase = phase;
  }

  /**
   * Renders the pixel-dithered sky for any world area.
   */
  public renderAreaSky(
    ctx: CanvasRenderingContext2D,
    areaId: AreaId,
    camX: number,
    camY: number,
    time: number
  ) {
    const skyOffsetY = Math.floor(-camY * 0.02);

    switch (areaId) {
      case AreaId.VILLAGE:
        // Village uses the full Sunset & Twilight restricted palette dither system
        this.renderSunsetTwilightSky(ctx, camX, camY, time);
        break;

      case AreaId.FOREST:
        this.renderDitheredGradientBuffer(RESTRICTED_CANOPY_STOPS, this.ditherPattern, this.pixelSize);
        ctx.drawImage(this.skyCanvas, 0, skyOffsetY);
        break;

      case AreaId.LAKE:
        this.renderDitheredGradientBuffer(RESTRICTED_MOONLIT_STOPS, this.ditherPattern, this.pixelSize);
        ctx.drawImage(this.skyCanvas, 0, skyOffsetY);
        break;

      case AreaId.CAPITAL:
        this.renderDitheredGradientBuffer(RESTRICTED_STORM_STOPS, this.ditherPattern, this.pixelSize);
        ctx.drawImage(this.skyCanvas, 0, skyOffsetY);
        break;

      case AreaId.TOWER:
        this.renderDitheredGradientBuffer(RESTRICTED_DAWN_STOPS, this.ditherPattern, this.pixelSize);
        ctx.drawImage(this.skyCanvas, 0, skyOffsetY);
        break;
    }
  }
}

export const skySystem = new SkyRenderer();
