import { Particle } from '../types';
import { PALETTE, drawPixelRect } from './pixelArtHelper';

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly maxParticles = 400;
  private weatherOverride: string | null = null;
  private weatherIntensity: number = 1.0;
  private windTimer: number = 0;

  // Dynamic Weather Transition State
  private currentWeather: string = 'sunset_dust';
  private targetWeather: string = 'sunset_dust';
  private transitionTimer: number = 0;
  private transitionDuration: number = 3.0; // Smooth 3-second crossfade
  private transitionProgress: number = 1.0; // 0.0 -> 1.0
  private previousWeather: string = 'sunset_dust';
  private lightningTimer: number = 0;
  private lightningFlash: boolean = false;

  public setWeatherOverride(weather: string | null) {
    this.weatherOverride = weather;
  }

  public getWeatherOverride(): string | null {
    return this.weatherOverride;
  }

  public getCurrentWeather(): string {
    return this.weatherOverride || this.currentWeather;
  }

  public getTargetWeather(): string {
    return this.weatherOverride || this.targetWeather;
  }

  public getTransitionProgress(): number {
    return this.transitionProgress;
  }

  public setWeatherIntensity(intensity: number) {
    this.weatherIntensity = Math.max(0.2, Math.min(2.5, intensity));
  }

  public getWeatherIntensity(): number {
    return this.weatherIntensity;
  }

  // Smoothly crossfades to a new weather type over transitionDuration seconds
  public transitionToWeather(newWeather: string, duration: number = 3.0) {
    if (this.targetWeather === newWeather && this.currentWeather === newWeather) {
      return;
    }
    if (this.targetWeather === newWeather && this.transitionProgress < 1.0) {
      return; // Already transitioning to this weather
    }

    this.previousWeather = this.currentWeather;
    this.targetWeather = newWeather;
    this.transitionDuration = Math.max(0.5, duration);
    this.transitionTimer = 0;
    this.transitionProgress = 0.0;
  }

  public update(dt: number) {
    this.windTimer += dt;
    const globalWind = Math.sin(this.windTimer * 0.7) * 22;

    // Advance weather transition
    if (this.transitionProgress < 1.0) {
      this.transitionTimer += dt;
      this.transitionProgress = Math.min(1.0, this.transitionTimer / this.transitionDuration);
      if (this.transitionProgress >= 1.0) {
        this.currentWeather = this.targetWeather;
      }
    }

    // Heavy storm periodic lightning timer
    const active = this.getCurrentWeather();
    if (active === 'heavy_storm') {
      this.lightningTimer += dt;
      if (this.lightningTimer > 4.5 + Math.random() * 3.5) {
        this.lightningTimer = 0;
        this.lightningFlash = true;
        setTimeout(() => {
          this.lightningFlash = false;
        }, 80);
      }
    } else {
      this.lightningFlash = false;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // 8-bit stepped physics with varied atmospheric motion
      if (p.type === 'dust' || p.type === 'blood') {
        p.vy += 320 * dt;
      } else if (p.type === 'rain') {
        p.vy = 420;
        p.vx = -60 + globalWind * 0.6;
      } else if (p.type === 'hail') {
        // Fast, heavy hail pellets with ground bounces
        p.vy = 480;
        p.vx = -70 + globalWind * 0.4;
      } else if (p.type === 'mist') {
        // Thick billowing low-velocity fog bank drifting across screen
        p.vx = (Math.sin(p.life * 1.5 + p.y * 0.04) * 12 + globalWind * 0.3);
        p.vy = Math.cos(p.life * 1.2) * 4;
      } else if (p.type === 'leaf') {
        p.vx = Math.sin(p.life * 4) * 20 + globalWind * 0.4;
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
      } else if (p.type === 'ember' || p.type === 'cinder') {
        // Floating/drifting embers: gentle swirling updrafts with glowing deceleration
        p.vx += (Math.sin(p.life * 4.5 + p.y * 0.05) * 28 + globalWind * 0.6) * dt;
        p.vy += (Math.cos(p.life * 3.0) * 10 - 24) * dt; // Gentle upward drift
      } else if (p.type === 'snow') {
        // Soft swaying snowfall: fluttering horizontal sway with gentle descent
        p.vx = Math.sin(p.life * 2.8 + p.x * 0.08) * 18 + globalWind * 0.7;
        p.vy = 28 + Math.cos(p.life * 3.2) * 8;
      } else if (p.type === 'ash') {
        // Dark cathedral / capital falling ash flakes
        p.vx = Math.sin(p.life * 3.4) * 14 + globalWind * 0.5;
        p.vy = 36 + Math.sin(p.life * 2.0) * 6;
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

  // Dynamic Atmospheric Weather Particles with smooth crossfading transitions
  public spawnWeatherParticles(
    areaWeather: string,
    camX: number,
    camY: number,
    screenW: number,
    screenH: number
  ) {
    const activeOverride = this.weatherOverride;

    if (activeOverride) {
      this.spawnWeatherForType(activeOverride, this.weatherIntensity, camX, camY, screenW, screenH);
      return;
    }

    // Auto location-based transition check
    if (this.targetWeather !== areaWeather) {
      this.transitionToWeather(areaWeather, 2.8);
    }

    if (this.transitionProgress >= 1.0) {
      // Steady-state single weather
      this.spawnWeatherForType(this.currentWeather, this.weatherIntensity, camX, camY, screenW, screenH);
    } else {
      // Dynamic crossfade: blend between outgoing previous weather and incoming target weather
      const p = this.transitionProgress;
      const outgoingIntensity = this.weatherIntensity * (1.0 - p);
      const incomingIntensity = this.weatherIntensity * p;

      if (outgoingIntensity > 0.05) {
        this.spawnWeatherForType(this.previousWeather, outgoingIntensity, camX, camY, screenW, screenH);
      }
      if (incomingIntensity > 0.05) {
        this.spawnWeatherForType(this.targetWeather, incomingIntensity, camX, camY, screenW, screenH);
      }
    }
  }

  // Individual weather type particle emitter
  private spawnWeatherForType(
    weather: string,
    intensity: number,
    camX: number,
    camY: number,
    screenW: number,
    screenH: number
  ) {
    if (weather === 'heavy_storm') {
      // HEAVY STORM: Torrential diagonal sheets of rain + stinging hail + ambient mist + lightning
      const stormRainCount = Math.floor(6 * intensity);
      for (let i = 0; i < stormRainCount; i++) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 100) - 20),
          y: Math.floor(camY - 14),
          vx: -70 - Math.random() * 30,
          vy: 420 + Math.random() * 80,
          life: 0.55,
          maxLife: 0.55,
          color: Math.random() < 0.3 ? PALETTE.WHITE : PALETTE.ICE_WHITE,
          size: 1,
          type: 'rain'
        });
      }

      // Hard white ice hail pellets
      const hailCount = Math.floor(2 * intensity);
      for (let i = 0; i < hailCount; i++) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 80)),
          y: Math.floor(camY - 10),
          vx: -80 - Math.random() * 25,
          vy: 480 + Math.random() * 60,
          life: 0.45,
          maxLife: 0.45,
          color: PALETTE.WHITE,
          size: 2,
          type: 'hail'
        });
      }

      // Wind-blown spray mist
      if (Math.random() < 0.4 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: -60 - Math.random() * 20,
          vy: 20 + Math.random() * 40,
          life: 1.2,
          maxLife: 1.2,
          color: PALETTE.PALE_STONE,
          size: 2,
          type: 'dust'
        });
      }
    } else if (weather === 'thick_fog') {
      // THICK FOG: Multi-tiered dense cloudbanks, creeping ground mist, floating spores
      const fogPuffCount = Math.floor(3 * intensity);
      for (let i = 0; i < fogPuffCount; i++) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 60) - 30),
          y: Math.floor(camY + Math.random() * screenH),
          vx: -12 + Math.random() * 24,
          vy: -4 + Math.random() * 8,
          life: 3.5 + Math.random() * 2.5,
          maxLife: 6.0,
          color: Math.random() < 0.4 ? PALETTE.PALE_STONE : (Math.random() < 0.7 ? PALETTE.BRIGHT_GRAY : PALETTE.LIGHT_GRAY),
          size: Math.random() < 0.4 ? 4 : (Math.random() < 0.8 ? 3 : 2),
          type: 'mist'
        });
      }

      // Occasional swamp/forest firefly piercing through the dense shroud
      if (Math.random() < 0.25 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 2.5,
          maxLife: 2.5,
          color: PALETTE.MINT_GREEN,
          size: 2,
          type: 'firefly'
        });
      }
    } else if (weather === 'ashen_embers' || weather === 'cathedral_haze') {
      // Falling embers and floating incense sparks (warm gold, arterial red, blazing amber)
      const spawnCount = Math.floor(2.2 * intensity);
      for (let i = 0; i < spawnCount; i++) {
        const isSpur = Math.random() < 0.4;
        const emberColor = isSpur
          ? (Math.random() < 0.5 ? PALETTE.GOLD : PALETTE.SUN_YELLOW)
          : (Math.random() < 0.5 ? PALETTE.AMBER : PALETTE.ARTERIAL_RED);

        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 80) - 40),
          y: Math.floor(camY - 10 + Math.random() * (screenH + 20)),
          vx: (Math.random() - 0.5) * 16,
          vy: 14 + Math.random() * 24,
          life: 2.2 + Math.random() * 1.8,
          maxLife: 4.0,
          color: emberColor,
          size: Math.random() < 0.3 ? 3 : (Math.random() < 0.7 ? 2 : 1),
          type: Math.random() < 0.3 ? 'cinder' : 'ember'
        });
      }

      // Occasional gentle floating grey ash flake
      if (Math.random() < 0.35 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 40)),
          y: Math.floor(camY - 8),
          vx: (Math.random() - 0.5) * 12,
          vy: 24 + Math.random() * 14,
          life: 3.5,
          maxLife: 3.5,
          color: Math.random() < 0.5 ? PALETTE.MID_GRAY : PALETTE.BONE_BASE,
          size: Math.random() < 0.4 ? 2 : 1,
          type: 'ash'
        });
      }
    } else if (weather === 'snowfall') {
      // Serene light snowfall (crystal ice white, pale alabaster, soft fluttering movement)
      const snowCount = Math.floor(3 * intensity);
      for (let i = 0; i < snowCount; i++) {
        const isBigFlake = Math.random() < 0.25;
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 60) - 30),
          y: Math.floor(camY - 8),
          vx: -15 + Math.random() * 30,
          vy: 20 + Math.random() * 28,
          life: 3.2 + Math.random() * 2.0,
          maxLife: 5.2,
          color: isBigFlake ? PALETTE.WHITE : (Math.random() < 0.5 ? PALETTE.ICE_WHITE : PALETTE.BONE_SPECULAR),
          size: isBigFlake ? 3 : (Math.random() < 0.6 ? 2 : 1),
          type: 'snow'
        });
      }
    } else if (weather === 'storm_embers') {
      // Fierce burning embers swept by violent winds
      const stormEmberCount = Math.floor(4 * intensity);
      for (let i = 0; i < stormEmberCount; i++) {
        this.emit({
          x: Math.floor(camX + Math.random() * (screenW + 80) - 40),
          y: Math.floor(camY - 10 + Math.random() * (screenH + 20)),
          vx: -75 - Math.random() * 45,
          vy: 30 + Math.random() * 35,
          life: 1.2 + Math.random() * 1.0,
          maxLife: 2.2,
          color: Math.random() < 0.4 ? PALETTE.GOLD : (Math.random() < 0.7 ? PALETTE.AMBER : PALETTE.BRIGHT_RED),
          size: Math.random() < 0.4 ? 3 : 2,
          type: 'cinder'
        });
      }
    } else if (weather === 'storm_rain') {
      // Regular stormy rain
      const rainCount = Math.floor(4 * intensity);
      for (let i = 0; i < rainCount; i++) {
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
      if (Math.random() < 0.25 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: -35,
          vy: 80,
          life: 0.8,
          maxLife: 0.8,
          color: PALETTE.BONE_HIGHLIGHT,
          size: 1,
          type: 'dust'
        });
      }
    } else if (weather === 'sunset_dust') {
      // Golden twilight leaves & glowing dusk motes
      if (Math.random() < 0.28 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY - 6),
          vx: 12 + Math.random() * 8,
          vy: 25 + Math.random() * 10,
          life: 2.8,
          maxLife: 2.8,
          color: Math.random() < 0.6 ? PALETTE.GOLD : PALETTE.AMBER,
          size: 2,
          type: 'leaf'
        });
      }
      if (Math.random() < 0.3 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 10,
          vy: -6 - Math.random() * 8,
          life: 2.2,
          maxLife: 2.2,
          color: PALETTE.PALE_GOLD,
          size: 1,
          type: 'ember'
        });
      }
    } else if (weather === 'forest_fog' || weather === 'lake_mist') {
      // Luminous fireflies and soft lake mist motes
      if (Math.random() < 0.32 * intensity) {
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
      if (Math.random() < 0.25 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 10,
          vy: -2 + Math.random() * 4,
          life: 3.2,
          maxLife: 3.2,
          color: PALETTE.PALE_STONE,
          size: 3,
          type: 'mist'
        });
      }
    } else if (weather === 'dawn_rays') {
      // Golden dawn motes and radiant sun particles
      if (Math.random() < 0.35 * intensity) {
        this.emit({
          x: Math.floor(camX + Math.random() * screenW),
          y: Math.floor(camY + Math.random() * screenH),
          vx: (Math.random() - 0.5) * 10,
          vy: -14 - Math.random() * 12,
          life: 1.8 + Math.random() * 1.2,
          maxLife: 3.0,
          color: Math.random() < 0.6 ? PALETTE.SUN_YELLOW : PALETTE.GOLD,
          size: Math.random() < 0.4 ? 3 : 2,
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
        // 8-bit Rain: 1x4 pixel streak
        drawPixelRect(ctx, p.color, rx, ry, 1, 4);
      } else if (p.type === 'ember') {
        // Glowing ember with pulse flicker and hot center
        const lifeRatio = p.life / p.maxLife;
        const pulse = Math.floor(p.life * 10) % 3 === 0;
        const s = pulse ? p.size : Math.max(1, p.size - 1);
        
        // Outer warm glow halo
        drawPixelRect(ctx, p.color, rx - Math.floor(s / 2), ry - Math.floor(s / 2), s, s);
        // Bright core spark for embers with remaining life
        if (s >= 2 && lifeRatio > 0.3) {
          drawPixelRect(ctx, PALETTE.CANDLE_WHITE, rx, ry, 1, 1);
        }
      } else if (p.type === 'cinder') {
        // High-velocity burning cinder: elongated 2-pixel fire streak with trailing spark
        const dirX = p.vx < 0 ? -1 : 1;
        drawPixelRect(ctx, p.color, rx, ry, 2, 2);
        drawPixelRect(ctx, PALETTE.AMBER_DARK, rx - dirX, ry - 1, 1, 1);
        if (p.life > 0.5) {
          drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx, ry, 1, 1);
        }
      } else if (p.type === 'snow') {
        // Soft fluttering snow flake: crisp crystalline shape
        const s = Math.floor(p.size);
        if (s >= 3) {
          // Plus-shaped cross snowflake
          drawPixelRect(ctx, p.color, rx, ry - 1, 1, 3);
          drawPixelRect(ctx, p.color, rx - 1, ry, 3, 1);
          drawPixelRect(ctx, PALETTE.WHITE, rx, ry, 1, 1);
        } else if (s === 2) {
          drawPixelRect(ctx, p.color, rx, ry, 2, 2);
        } else {
          drawPixelRect(ctx, p.color, rx, ry, 1, 1);
        }
      } else if (p.type === 'ash') {
        // Drifting charred ash flake: subtle muted shape with gentle tumble
        const tumble = Math.floor(p.life * 4) % 2 === 0;
        if (tumble) {
          drawPixelRect(ctx, p.color, rx, ry, 2, 1);
        } else {
          drawPixelRect(ctx, p.color, rx, ry, 1, 2);
        }
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
      } else if (p.type === 'hail') {
        // High-velocity solid ice hail pellets
        const s = Math.floor(p.size);
        drawPixelRect(ctx, PALETTE.WHITE, rx, ry, s, s);
        drawPixelRect(ctx, PALETTE.ICE_WHITE, rx + 1, ry + 1, 1, 1);
      } else if (p.type === 'mist') {
        // Soft pixelated fog puff: rounded stepped cross cloud bank
        const s = Math.floor(p.size);
        const half = Math.floor(s / 2);
        drawPixelRect(ctx, p.color, rx - half, ry, s, s);
        drawPixelRect(ctx, p.color, rx, ry - half, s, s);
        drawPixelRect(ctx, PALETTE.WHITE, rx, ry, Math.max(1, s - 2), Math.max(1, s - 2));
      } else if (p.type === 'leaf') {
        // Drifting dusk leaf with fluttering 2x2 / 3x2 angle
        const flutter = Math.floor(p.life * 5) % 2 === 0;
        drawPixelRect(ctx, p.color, rx, ry, flutter ? 3 : 2, flutter ? 2 : 3);
      } else {
        const s = Math.floor(p.size);
        drawPixelRect(ctx, p.color, rx, ry, s, s);
      }
    }

    // Heavy Storm sudden lightning strobe illumination
    if (this.lightningFlash) {
      ctx.fillStyle = 'rgba(238, 242, 255, 0.28)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    ctx.restore();
  }

  // Render front-layer atmospheric weather overlay (e.g., drifting foreground embers, snowflakes, and thick fog banks)
  public renderWeatherForeground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    ctx.save();

    for (const p of this.particles) {
      // Only render overlay particles marked as weather that have larger depth
      if (p.type !== 'ember' && p.type !== 'snow' && p.type !== 'cinder' && p.type !== 'leaf' && p.type !== 'mist' && p.type !== 'hail') {
        continue;
      }
      // Alternate flakes/embers for foreground layer based on size
      if (p.size < 2) continue;

      const rx = Math.floor(p.x - camX);
      const ry = Math.floor(p.y - camY);

      if (p.type === 'ember') {
        const pulse = Math.floor(p.life * 8) % 2 === 0;
        const s = pulse ? p.size + 1 : p.size;
        drawPixelRect(ctx, p.color, rx - 1, ry - 1, s, s);
        drawPixelRect(ctx, PALETTE.CANDLE_WHITE, rx, ry, 1, 1);
      } else if (p.type === 'snow') {
        if (p.size >= 3) {
          drawPixelRect(ctx, p.color, rx, ry - 1, 1, 3);
          drawPixelRect(ctx, p.color, rx - 1, ry, 3, 1);
          drawPixelRect(ctx, PALETTE.WHITE, rx, ry, 1, 1);
        } else {
          drawPixelRect(ctx, p.color, rx, ry, 2, 2);
        }
      } else if (p.type === 'cinder') {
        drawPixelRect(ctx, p.color, rx, ry, 2, 2);
        drawPixelRect(ctx, PALETTE.GOLD, rx, ry, 1, 1);
      } else if (p.type === 'leaf') {
        drawPixelRect(ctx, p.color, rx, ry, 3, 2);
      } else if (p.type === 'hail') {
        drawPixelRect(ctx, PALETTE.WHITE, rx, ry, 2, 2);
      } else if (p.type === 'mist' && p.size >= 3) {
        // Floating foreground cloud wisps
        drawPixelRect(ctx, p.color, rx - 1, ry, p.size, p.size);
      }
    }
    ctx.restore();
  }

  public clear() {
    this.particles = [];
  }
}

export const particleEngine = new ParticleSystem();
