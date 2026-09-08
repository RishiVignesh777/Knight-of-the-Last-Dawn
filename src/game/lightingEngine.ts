import { LightSource } from '../types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';

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
    const ctx = this.lightCtx;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 1. Fill darkness/ambient color
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = ambientColor;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 2. Punch out light holes using destination-out
    ctx.globalCompositeOperation = 'destination-out';

    for (const light of lights) {
      const lx = Math.floor(light.x - camX);
      const ly = Math.floor(light.y - camY);
      
      // Calculate flicker
      const flickerRate = light.flickerSpeed || 3;
      const offset = light.flickerOffset || 0;
      const flicker = 1.0 + Math.sin(time * flickerRate + offset) * 0.08;
      const radius = light.radius * flicker;

      // Don't draw if outside viewport
      if (lx + radius < 0 || lx - radius > VIRTUAL_WIDTH || ly + radius < 0 || ly - radius > VIRTUAL_HEIGHT) {
        continue;
      }

      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius);
      grad.addColorStop(0, `rgba(0, 0, 0, ${light.intensity})`);
      grad.addColorStop(0.5, `rgba(0, 0, 0, ${light.intensity * 0.6})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Composite lighting layer onto the main canvas
    mainCtx.save();
    mainCtx.globalCompositeOperation = 'multiply';
    mainCtx.drawImage(this.lightCanvas, 0, 0);

    // 4. Add warm color bloom for light sources
    mainCtx.globalCompositeOperation = 'screen';
    for (const light of lights) {
      const lx = Math.floor(light.x - camX);
      const ly = Math.floor(light.y - camY);
      const radius = light.radius * 0.6;
      if (lx + radius < 0 || lx - radius > VIRTUAL_WIDTH || ly + radius < 0 || ly - radius > VIRTUAL_HEIGHT) {
        continue;
      }
      const bloomGrad = mainCtx.createRadialGradient(lx, ly, 0, lx, ly, radius);
      bloomGrad.addColorStop(0, light.color);
      bloomGrad.addColorStop(1, 'transparent');
      mainCtx.fillStyle = bloomGrad;
      mainCtx.globalAlpha = light.intensity * 0.35;
      mainCtx.beginPath();
      mainCtx.arc(lx, ly, radius, 0, Math.PI * 2);
      mainCtx.fill();
    }

    mainCtx.restore();
  }
}

export const lightingEngine = new LightingEngine();
