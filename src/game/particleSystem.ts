import { Particle } from '../types';

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly maxParticles = 350;

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

      // Type-specific physics
      if (p.type === 'dust' || p.type === 'blood') {
        p.vy += 300 * dt; // gravity
      } else if (p.type === 'rain') {
        // rain falls fast diagonally
        p.vy = 420;
        p.vx = -60;
      } else if (p.type === 'leaf') {
        p.vx += Math.sin(p.life * 4) * 20 * dt;
        p.vy = 45;
      } else if (p.type === 'firefly') {
        p.vx = Math.sin(p.life * 3) * 15;
        p.vy = Math.cos(p.life * 2) * 12;
      } else if (p.type === 'shockwave') {
        p.size += 80 * dt;
      }
    }
  }

  public emit(particle: Omit<Particle, 'alpha'>) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(particle);
  }

  // Helper generators
  public spawnSwordSlashSparks(x: number, y: number, dir: number, heavy: boolean) {
    const count = heavy ? 16 : 8;
    for (let i = 0; i < count; i++) {
      const angle = (dir > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.8;
      const speed = 70 + Math.random() * (heavy ? 220 : 130);
      this.emit({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.15 + Math.random() * 0.18,
        maxLife: 0.35,
        color: heavy ? '#f59e0b' : '#fef08a',
        size: heavy ? 3 : 2,
        type: 'spark'
      });
    }
  }

  public spawnBloodSplatter(x: number, y: number, dir: number) {
    for (let i = 0; i < 7; i++) {
      this.emit({
        x,
        y,
        vx: dir * (40 + Math.random() * 90),
        vy: -40 - Math.random() * 80,
        life: 0.25 + Math.random() * 0.2,
        maxLife: 0.45,
        color: '#7f1d1d',
        size: 2,
        type: 'blood'
      });
    }
  }

  public spawnDashTrail(x: number, y: number, dir: number) {
    for (let i = 0; i < 5; i++) {
      this.emit({
        x: x - dir * (i * 6),
        y: y + Math.random() * 24 - 12,
        vx: -dir * 20,
        vy: (Math.random() - 0.5) * 10,
        life: 0.18,
        maxLife: 0.18,
        color: 'rgba(96, 165, 250, 0.6)',
        size: 3,
        type: 'slash_trail'
      });
    }
  }

  public spawnShockwave(x: number, y: number) {
    this.emit({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.25,
      maxLife: 0.25,
      color: '#f59e0b',
      size: 4,
      type: 'shockwave'
    });
  }

  public spawnDustPuff(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      this.emit({
        x: x + (Math.random() - 0.5) * 12,
        y: y + Math.random() * 4,
        vx: (Math.random() - 0.5) * 40,
        vy: -15 - Math.random() * 20,
        life: 0.25 + Math.random() * 0.15,
        maxLife: 0.4,
        color: '#78716c',
        size: 2,
        type: 'dust'
      });
    }
  }

  public spawnWeatherParticles(weather: string, camX: number, camY: number, screenW: number, screenH: number) {
    if (weather === 'storm_rain') {
      // Spawn rain drops
      for (let i = 0; i < 6; i++) {
        this.emit({
          x: camX + Math.random() * (screenW + 100),
          y: camY - 20,
          vx: -60,
          vy: 420,
          life: 0.65,
          maxLife: 0.65,
          color: 'rgba(191, 219, 254, 0.75)',
          size: 1,
          type: 'rain'
        });
      }
    } else if (weather === 'sunset_dust') {
      if (Math.random() < 0.25) {
        this.emit({
          x: camX + Math.random() * screenW,
          y: camY - 10,
          vx: 15 + Math.random() * 10,
          vy: 35 + Math.random() * 15,
          life: 3.5,
          maxLife: 3.5,
          color: '#d97706',
          size: 2,
          type: 'leaf'
        });
      }
    } else if (weather === 'forest_fog' || weather === 'lake_mist') {
      if (Math.random() < 0.35) {
        this.emit({
          x: camX + Math.random() * screenW,
          y: camY + Math.random() * screenH,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 2.5 + Math.random() * 2.0,
          maxLife: 4.5,
          color: weather === 'forest_fog' ? '#34d399' : '#67e8f9',
          size: 2,
          type: 'firefly'
        });
      }
    } else if (weather === 'dawn_rays') {
      if (Math.random() < 0.35) {
        this.emit({
          x: camX + Math.random() * screenW,
          y: camY + Math.random() * screenH,
          vx: (Math.random() - 0.5) * 12,
          vy: -15 - Math.random() * 15,
          life: 2.0 + Math.random() * 1.5,
          maxLife: 3.5,
          color: '#fef08a',
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
      const alpha = Math.max(0, p.life / p.maxLife);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'rain') {
        // Pixel rain streak
        ctx.fillRect(rx, ry, 1, 6);
      } else if (p.type === 'shockwave') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(rx, ry, p.size * 1.6, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'firefly') {
        ctx.fillRect(rx, ry, 2, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(rx - 1, ry - 1, 4, 4);
      } else {
        ctx.fillRect(rx, ry, Math.floor(p.size), Math.floor(p.size));
      }
    }
    ctx.restore();
  }

  public clear() {
    this.particles = [];
  }
}

export const particleEngine = new ParticleSystem();
