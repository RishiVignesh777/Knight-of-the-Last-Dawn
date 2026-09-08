import { LightSource } from '../types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';
import { PALETTE, drawPixelRect } from './pixelArtHelper';

export class LightingEngine {
  private lightCanvas: HTMLCanvasElement;
  private lightCtx: CanvasRenderingContext2D;

  constructor() {
    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas.width = VIRTUAL_WIDTH;
    this.lightCanvas.height = VIRTUAL_HEIGHT;
    this.lightCtx = this.lightCanvas.getContext('2d')!;
  }

  public renderLights(
    mainCtx: CanvasRenderingContext2D,
    ambientColor: string,
    lights: LightSource[],
    camX: number,
    camY: number,
    time: number
  ) {
    // If daylight (e.g. Village or Tower), minimal or no dark mask
    if (ambientColor === 'rgba(0,0,0,0)' || ambientColor === 'transparent') {
      return;
    }

    const ctx = this.lightCtx;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 1. Fill 8-bit ambient darkness mask
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = ambientColor;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 2. Punch out stepped 8-bit light rings using destination-out
    ctx.globalCompositeOperation = 'destination-out';

    for (const light of lights) {
      const lx = Math.floor(light.x - camX);
      const ly = Math.floor(light.y - camY);

      // Flicker rate in discrete 8-bit steps
      const flickerRate = light.flickerSpeed || 3;
      const offset = light.flickerOffset || 0;
      const flicker = (Math.floor(time * flickerRate + offset) % 2 === 0) ? 1.0 : 0.92;
      const r = Math.floor(light.radius * flicker);

      if (lx + r < 0 || lx - r > VIRTUAL_WIDTH || ly + r < 0 || ly - r > VIRTUAL_HEIGHT) {
        continue;
      }

      // Authentic 8-bit stepped concentric rings:
      // Inner core: solid punch-out
      const innerR = Math.floor(r * 0.45);
      for (let y = -innerR; y <= innerR; y += 2) {
        const span = Math.floor(Math.sqrt(innerR * innerR - y * y));
        ctx.fillRect(lx - span, ly + y, span * 2, 2);
      }

      // Middle ring: 50% checkerboard dither punch-out
      const midR = Math.floor(r * 0.75);
      for (let y = -midR; y <= midR; y += 2) {
        const outerSpan = Math.floor(Math.sqrt(midR * midR - y * y));
        const innerSpan = y * y <= innerR * innerR ? Math.floor(Math.sqrt(innerR * innerR - y * y)) : 0;
        
        // Left side dither
        for (let x = lx - outerSpan; x < lx - innerSpan; x += 2) {
          if ((Math.floor(x / 2) + Math.floor((ly + y) / 2)) % 2 === 0) {
            ctx.fillRect(x, ly + y, 2, 2);
          }
        }
        // Right side dither
        for (let x = lx + innerSpan; x < lx + outerSpan; x += 2) {
          if ((Math.floor(x / 2) + Math.floor((ly + y) / 2)) % 2 === 0) {
            ctx.fillRect(x, ly + y, 2, 2);
          }
        }
      }

      // Outer perimeter: sparse 25% dither punch-out
      const outR = r;
      for (let y = -outR; y <= outR; y += 4) {
        const outerSpan = Math.floor(Math.sqrt(outR * outR - y * y));
        const midSpan = y * y <= midR * midR ? Math.floor(Math.sqrt(midR * midR - y * y)) : 0;

        for (let x = lx - outerSpan; x < lx - midSpan; x += 4) {
          if ((Math.floor(x / 4) + Math.floor((ly + y) / 4)) % 2 === 0) {
            ctx.fillRect(x, ly + y, 2, 2);
          }
        }
        for (let x = lx + midSpan; x < lx + outerSpan; x += 4) {
          if ((Math.floor(x / 4) + Math.floor((ly + y) / 4)) % 2 === 0) {
            ctx.fillRect(x, ly + y, 2, 2);
          }
        }
      }
    }

    // 3. Composite dark mask onto main canvas
    mainCtx.save();
    mainCtx.drawImage(this.lightCanvas, 0, 0);

    // 4. Draw 8-bit glowing center pixel sparkle for prominent light sources
    for (const light of lights) {
      const lx = Math.floor(light.x - camX);
      const ly = Math.floor(light.y - camY);
      if (lx >= -10 && lx <= VIRTUAL_WIDTH + 10 && ly >= -10 && ly <= VIRTUAL_HEIGHT + 10) {
        const sparkle = Math.floor(time * 6) % 2 === 0;
        if (sparkle) {
          drawPixelRect(mainCtx, PALETTE.SUN_YELLOW, lx - 1, ly - 1, 3, 3);
          drawPixelRect(mainCtx, PALETTE.WHITE, lx, ly, 1, 1);
        }
      }
    }

    mainCtx.restore();
  }
}

export const lightingEngine = new LightingEngine();
