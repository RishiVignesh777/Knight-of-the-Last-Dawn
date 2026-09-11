import { Particle } from '../types';
import { PALETTE, drawPixelRect } from './pixelArtHelper';

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly maxParticles = 200;

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // 8-bit stepped physics
      if (p.type === 'dust' || p.type === 'blood') {
        p.vy += 320 * dt;
      } else if (p.type === 'rain') {
        p.vy = 400;
        p.vx = -50;
      } else if (p.type === 'leaf') {
        p.vx = Math.sin(p.life * 4) * 20;
        p.vy = 35;
      } else if (p.type === 'firefly') {
        p.vx = Math.sin(p.life * 3) * 12;
        p.vy = Math.cos(p.life * 2) * 10;
      } else if (p.type === 'shockwave') {
        p.size += 60 * dt;
      } else if (p.type === 'checkpoint_mote') {
        p.vx = Math.sin(p.life * 4) * 12;
        p.vy -= 10 * dt;
      } else if (p.type === 'checkpoint_ring') {
        p.size += 55 * dt;
      }
    }
  }

  public emit(particle: Omit<Particle, 'alpha'>) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(particle);
  }

  // 8-bit Sword slash sparks
  public spawnSwordSlashSparks(x: number, y: number, dir: number, heavy: boolean) {
    const count = heavy ? 10 : 5;
    for (let i = 0; i < count; i++) {
      const angle = (dir > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.6;
      const speed = 60 + Math.random() * (heavy ? 160 : 100);
      this.emit({
        x: Math.floor(x),
        y: Math.floor(y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        life: 0.15 + Math.random() * 0.15,
        maxLife: 0.3,
        color: heavy ? PALETTE.GOLD : PALETTE.SUN_YELLOW,
        size: heavy ? 3 : 2,
        type: 'spark'
      });
    }
  }

  public spawnBloodSplatter(x: number, y: number, dir: number) {
    for (let i = 0; i < 5; i++) {
      this.emit({
        x: Math.floor(x),
        y: Math.floor(y),
        vx: dir * (30 + Math.random() * 60),
        vy: -30 - Math.random() * 50,
        life: 0.2 + Math.random() * 0.15,
        maxLife: 0.35,
        color: PALETTE.CRIMSON,
        size: 2,
        type: 'blood'
      });
    }
  }

  // 8-bit Dash Trail (stepped pixel afterimage blocks)
  public spawnDashTrail(x: number, y: number, dir: number) {
    for (let i = 0; i < 4; i++) {
      this.emit({
        x: Math.floor(x - dir * (i * 6)),
        y: Math.floor(y + (i % 2 === 0 ? -4 : 4)),
        vx: -dir * 15,
        vy: 0,
        life: 0.16,
        maxLife: 0.16,
        color: i % 2 === 0 ? PALETTE.CYAN_HIGHLIGHT : PALETTE.STEEL_BLUE,
        size: 3,
        type: 'slash_trail'
      });
    }
  }

  // 8-bit Shockwave (expanding stepped diamond)
  public spawnShockwave(x: number, y: number) {
    this.emit({
      x: Math.floor(x),
      y: Math.floor(y),
      vx: 0,
      vy: 0,
      life: 0.22,
      maxLife: 0.22,
      color: PALETTE.GOLD,
      size: 4,
      type: 'shockwave'
    });
  }

  // Continuous ambient holy motes drifting upward from shrine
  public spawnCheckpointAura(x: number, y: number, isCurrent: boolean) {
    const colors = isCurrent 
      ? [PALETTE.SUN_YELLOW, PALETTE.PALE_GOLD, PALETTE.WHITE, PALETTE.GOLD]
      : [PALETTE.GOLD, PALETTE.AMBER, PALETTE.SUN_YELLOW, PALETTE.CYAN_HIGHLIGHT];
    const color = colors[Math.floor(Math.random() * colors.length)];
    this.emit({
      x: Math.floor(x + (Math.random() - 0.5) * 22),
      y: Math.floor(y + (Math.random() - 0.5) * 6),
      vx: (Math.random() - 0.5) * 14,
      vy: -14 - Math.random() * 18,
      life: 1.4 + Math.random() * 0.8,
      maxLife: 2.2,
      color,
      size: Math.random() < 0.35 ? 3 : 2,
      type: 'checkpoint_mote'
    });
  }

  // Dramatic consecration burst when resting at a shrine
  public spawnCheckpointActivation(x: number, y: number) {
    // 1. Expanding sacred shockwave rings
    for (let i = 0; i < 2; i++) {
      this.emit({
        x: Math.floor(x),
        y: Math.floor(y),
        vx: 0,
        vy: 0,
        life: 0.35 + i * 0.15,
        maxLife: 0.5,
        color: i === 0 ? PALETTE.WHITE : PALETTE.SUN_YELLOW,
        size: 6 + i * 4,
        type: 'checkpoint_ring'
      });
    }

    // 2. High-speed radiant holy sparks in 360 degrees
    const sparkCount = 26;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 45 + Math.random() * 105;
      this.emit({
        x: Math.floor(x),
        y: Math.floor(y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 16,
        life: 0.3 + Math.random() * 0.3,
        maxLife: 0.6,
        color: i % 3 === 0 ? PALETTE.WHITE : i % 3 === 1 ? PALETTE.SUN_YELLOW : PALETTE.GOLD,
        size: Math.random() < 0.4 ? 3 : 2,
        type: 'checkpoint_mote'
      });
    }

    // 3. Ascending column motes soaring skyward
    for (let i = 0; i < 12; i++) {
      this.emit({
        x: Math.floor(x + (Math.random() - 0.5) * 16),
        y: Math.floor(y - Math.random() * 8),
        vx: (Math.random() - 0.5) * 18,
        vy: -35 - Math.random() * 55,
        life: 1.0 + Math.random() * 0.8,
        maxLife: 1.8,
        color: PALETTE.CANDLE_WHITE,
        size: 3,
        type: 'checkpoint_mote'
      });
    }
  }

  // 8-bit Dust puff
  public spawnDustPuff(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      this.emit({
        x: Math.floor(x + (Math.random() - 0.5) * 8),
        y: Math.floor(y),
        vx: (Math.random() - 0.5) * 30,
        vy: -15 - Math.random() * 15,
        life: 0.2 + Math.random() * 0.1,
        maxLife: 0.3,
        color: PALETTE.MID_GRAY,
        size: 2,
        type: 'dust'
      });
    }
  }

  // 8-bit Weather particles
  public spawnWeatherParticles(weather: string, camX: number, camY: number, screenW: number, screenH: number) {
    if (weather === 'storm_rain') {
      for (let i = 0; i < 4; i++) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 60)),
          y: Math.floor(camY - 10),
          vx: -50,
          vy: 400,
          life: 0.5,
          maxLife: 0.5,
          color: PALETTE.ICE_WHITE,
          size: 1,
          type: 'rain'
        });
      }
    } else if (weather === 'sunset_dust') {
      if (Math.random() < 0.2) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY - 6),
          vx: 12 + Math.random() * 8,
          vy: 25 + Math.random() * 10,
          life: 2.8,
          maxLife: 2.8,
          color: PALETTE.GOLD,
          size: 2,
          type: 'leaf'
        });
      }
    } else if (weather === 'forest_fog' || weather === 'lake_mist') {
      if (Math.random() < 0.25) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 2.0 + Math.random() * 1.5,
          maxLife: 3.5,
          color: weather === 'forest_fog' ? PALETTE.MINT_GREEN : PALETTE.CYAN_HIGHLIGHT,
          size: 2,
          type: 'firefly'
        });
      }
    } else if (weather === 'dawn_rays') {
      if (Math.random() < 0.25) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 10,
          vy: -12 - Math.random() * 10,
          life: 1.8 + Math.random() * 1.2,
          maxLife: 3.0,
          color: PALETTE.SUN_YELLOW,
          size: 2,
          type: 'dawn'
        });
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    ctx.save();
    for (const p of this.particles) {
      const rx = Math.floor(p.x - camX);
      const ry = Math.floor(p.y - camY);

      if (p.type === 'rain') {
        // 8-bit Rain: 1x4 pixel line
        drawPixelRect(ctx, p.color, rx, ry, 1, 4);
      } else if (p.type === 'shockwave') {
        // 8-bit Expanding stepped diamond ring
        const s = Math.floor(p.size);
        drawPixelRect(ctx, p.color, rx - s, ry, 2, 2);
        drawPixelRect(ctx, p.color, rx + s, ry, 2, 2);
        drawPixelRect(ctx, p.color, rx, ry - s, 2, 2);
        drawPixelRect(ctx, p.color, rx, ry + s, 2, 2);
        const half = Math.floor(s * 0.7);
        drawPixelRect(ctx, p.color, rx - half, ry - half, 2, 2);
        drawPixelRect(ctx, p.color, rx + half, ry - half, 2, 2);
        drawPixelRect(ctx, p.color, rx - half, ry + half, 2, 2);
        drawPixelRect(ctx, p.color, rx + half, ry + half, 2, 2);
      } else if (p.type === 'firefly') {
        // 8-bit blinking 2x2 firefly
        const blink = Math.floor(p.life * 6) % 2 === 0;
        if (blink) {
          drawPixelRect(ctx, p.color, rx, ry, 2, 2);
        }
      } else if (p.type === 'checkpoint_mote') {
        // Glowing celestial mote: sparkling 2x2 with center bright core
        const sparkle = Math.floor(p.life * 8) % 2 === 0;
        const s = sparkle ? p.size : Math.max(1, p.size - 1);
        drawPixelRect(ctx, p.color, rx - Math.floor(s / 2), ry - Math.floor(s / 2), s, s);
        if (s >= 2) {
          drawPixelRect(ctx, PALETTE.WHITE, rx, ry, 1, 1);
        }
      } else if (p.type === 'checkpoint_ring') {
        // Expanding holy diamond ring
        const s = Math.floor(p.size);
        drawPixelRect(ctx, p.color, rx - s, ry, 2, 2);
        drawPixelRect(ctx, p.color, rx + s, ry, 2, 2);
        drawPixelRect(ctx, p.color, rx, ry - s, 2, 2);
        drawPixelRect(ctx, p.color, rx, ry + s, 2, 2);
        const half = Math.floor(s * 0.7);
        drawPixelRect(ctx, PALETTE.WHITE, rx - half, ry - half, 1, 1);
        drawPixelRect(ctx, PALETTE.WHITE, rx + half, ry - half, 1, 1);
        drawPixelRect(ctx, PALETTE.WHITE, rx - half, ry + half, 1, 1);
        drawPixelRect(ctx, PALETTE.WHITE, rx + half, ry + half, 1, 1);
      } else {
        const s = Math.floor(p.size);
        drawPixelRect(ctx, p.color, rx, ry, s, s);
      }
    }
    ctx.restore();
  }

  public clear() {
    this.particles = [];
  }
}

export const particleEngine = new ParticleSystem();
