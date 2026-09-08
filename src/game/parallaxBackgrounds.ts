import { AreaId } from '../types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';

export class ParallaxRenderer {
  private birdTimer: number = 0;
  private cloudOffset: number = 0;
  private waterAnimTimer: number = 0;
  private lightningTimer: number = 0;
  private lightningFlash: number = 0;

  public update(dt: number) {
    this.birdTimer += dt;
    this.cloudOffset += dt * 8;
    this.waterAnimTimer += dt * 3.5;
    
    // Capital lightning flash timer
    this.lightningTimer += dt;
    if (this.lightningTimer > 4.5 + Math.random() * 4) {
      this.lightningTimer = 0;
      this.lightningFlash = 0.25;
    }
    if (this.lightningFlash > 0) {
      this.lightningFlash = Math.max(0, this.lightningFlash - dt * 2.5);
    }
  }

  public renderBackground(
    ctx: CanvasRenderingContext2D,
    areaId: AreaId,
    cameraX: number,
    cameraY: number
  ) {
    switch (areaId) {
      case AreaId.VILLAGE:
        this.renderVillageBackground(ctx, cameraX, cameraY);
        break;
      case AreaId.FOREST:
        this.renderForestBackground(ctx, cameraX, cameraY);
        break;
      case AreaId.LAKE:
        this.renderLakeBackground(ctx, cameraX, cameraY);
        break;
      case AreaId.CAPITAL:
        this.renderCapitalBackground(ctx, cameraX, cameraY);
        break;
      case AreaId.TOWER:
        this.renderTowerBackground(ctx, cameraX, cameraY);
        break;
    }
  }

  public renderForeground(
    ctx: CanvasRenderingContext2D,
    areaId: AreaId,
    cameraX: number,
    cameraY: number
  ) {
    // Layer 1: Foreground elements moving faster than gameplay (parallax ratio 1.25)
    const fgOffsetX = -(cameraX * 1.25) % VIRTUAL_WIDTH;

    ctx.save();
    if (areaId === AreaId.VILLAGE) {
      // Swaying dark foreground grass tufts and ruined fence posts
      ctx.fillStyle = '#1c1917';
      for (let x = -40; x < VIRTUAL_WIDTH + 80; x += 48) {
        const drawX = Math.floor(x + fgOffsetX);
        const sway = Math.sin(this.birdTimer * 2 + x) * 3;
        // Grass blades
        ctx.fillRect(drawX, VIRTUAL_HEIGHT - 18, 3, 18);
        ctx.fillRect(drawX + 4 + sway, VIRTUAL_HEIGHT - 24, 2, 24);
        ctx.fillRect(drawX + 8, VIRTUAL_HEIGHT - 14, 3, 14);
        if (x % 96 === 0) {
          // Weathered fence post
          ctx.fillRect(drawX + 16, VIRTUAL_HEIGHT - 32, 6, 32);
          ctx.fillRect(drawX + 14, VIRTUAL_HEIGHT - 26, 10, 4);
        }
      }
    } else if (areaId === AreaId.FOREST) {
      // Hanging ancient roots & giant mossy ferns
      ctx.fillStyle = '#064e3b';
      for (let x = -20; x < VIRTUAL_WIDTH + 60; x += 64) {
        const drawX = Math.floor(x + fgOffsetX);
        const vineLength = 28 + ((x * 13) % 40);
        const sway = Math.sin(this.birdTimer * 1.5 + x) * 4;
        ctx.fillRect(drawX + sway, 0, 3, vineLength);
        // Hanging leaves
        ctx.fillRect(drawX - 3 + sway, vineLength - 8, 8, 4);
        ctx.fillRect(drawX - 1 + sway, vineLength - 2, 5, 5);
      }
      // Foreground bottom giant ferns
      ctx.fillStyle = '#022c22';
      for (let x = -30; x < VIRTUAL_WIDTH + 60; x += 55) {
        const drawX = Math.floor(x + fgOffsetX);
        ctx.fillRect(drawX, VIRTUAL_HEIGHT - 20, 6, 20);
        ctx.fillRect(drawX - 8, VIRTUAL_HEIGHT - 16, 22, 6);
      }
    } else if (areaId === AreaId.LAKE) {
      // Foreground damp reeds and rocky cliff corner
      ctx.fillStyle = '#091326';
      for (let x = -30; x < VIRTUAL_WIDTH + 60; x += 40) {
        const drawX = Math.floor(x + fgOffsetX);
        const reedSway = Math.sin(this.waterAnimTimer + x * 0.1) * 2;
        ctx.fillRect(drawX + reedSway, VIRTUAL_HEIGHT - 22, 2, 22);
        ctx.fillRect(drawX + 5, VIRTUAL_HEIGHT - 16, 2, 16);
      }
    } else if (areaId === AreaId.CAPITAL) {
      // Foreground cracked balustrade & burning ember brazier silhouette
      ctx.fillStyle = '#0a050f';
      for (let x = -20; x < VIRTUAL_WIDTH + 60; x += 80) {
        const drawX = Math.floor(x + fgOffsetX);
        ctx.fillRect(drawX, VIRTUAL_HEIGHT - 28, 8, 28);
        ctx.fillRect(drawX - 6, VIRTUAL_HEIGHT - 26, 20, 5);
      }
    } else if (areaId === AreaId.TOWER) {
      // Foreground floating crystalline shards and golden light motes
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      for (let i = 0; i < 8; i++) {
        const px = Math.floor((i * 65 + fgOffsetX * 0.8 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
        const py = Math.floor(40 + (i * 28) + Math.sin(this.birdTimer + i) * 12);
        ctx.fillRect(px, py, 3, 3);
        ctx.fillRect(px + 1, py - 1, 1, 5);
      }
    }
    ctx.restore();
  }

  // ================= AREA 1: VILLAGE (Sunset / Castle in Distance / Ruins) =================
  private renderVillageBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // Layer 7: Golden Sunset Gradient Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
    skyGrad.addColorStop(0, '#2e1065');   // Deep twilight violet
    skyGrad.addColorStop(0.35, '#7c2d12'); // Amber crimson
    skyGrad.addColorStop(0.7, '#d97706');  // Golden dusk
    skyGrad.addColorStop(1.0, '#fef08a');  // Warm horizon glow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Distant setting sun
    const sunX = VIRTUAL_WIDTH * 0.72 - (camX * 0.02);
    const sunY = 70 - (camY * 0.02);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
    ctx.fill();
    // Sun rays
    ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 44, 0, Math.PI * 2);
    ctx.fill();

    // Layer 6: Drifting sunset clouds (parallax 0.06)
    ctx.fillStyle = 'rgba(124, 45, 18, 0.45)';
    const cloudShift = (this.cloudOffset * 0.3 - camX * 0.05) % (VIRTUAL_WIDTH + 100);
    for (let c = -100; c < VIRTUAL_WIDTH + 150; c += 140) {
      const cx = c + cloudShift;
      ctx.fillRect(cx, 35, 75, 14);
      ctx.fillRect(cx + 12, 28, 48, 12);
      ctx.fillRect(cx + 25, 22, 24, 8);
    }

    // Distant birds flying in V-formation
    ctx.fillStyle = '#451a03';
    const birdBaseX = ((this.birdTimer * 14 - camX * 0.04) % (VIRTUAL_WIDTH + 80)) - 40;
    const birdY = 48 + Math.sin(this.birdTimer) * 4;
    for (let b = 0; b < 4; b++) {
      const bx = Math.floor(birdBaseX + b * 9);
      const by = Math.floor(birdY + Math.abs(b - 2) * 5);
      const wing = Math.sin(this.birdTimer * 8 + b) > 0 ? -1 : 1;
      ctx.fillRect(bx, by, 2, 2);
      ctx.fillRect(bx - 2, by + wing, 2, 1);
      ctx.fillRect(bx + 2, by + wing, 2, 1);
    }

    // Layer 5: Distant jagged mountain ranges (parallax 0.12)
    const mtnOffsetX = -(camX * 0.12) % 360;
    ctx.fillStyle = '#431407';
    for (let i = -360; i < VIRTUAL_WIDTH + 360; i += 180) {
      const mx = Math.floor(i + mtnOffsetX);
      ctx.beginPath();
      ctx.moveTo(mx, VIRTUAL_HEIGHT - 60);
      ctx.lineTo(mx + 90, 85);
      ctx.lineTo(mx + 180, VIRTUAL_HEIGHT - 60);
      ctx.fill();
    }

    // Layer 4: Distant Ruined Castle & Rising Smoke on the horizon (parallax 0.22)
    const castleX = Math.floor(280 - (camX * 0.22));
    const castleY = VIRTUAL_HEIGHT - 150;
    ctx.fillStyle = '#292524';
    // Colossal ruined keep & spires
    ctx.fillRect(castleX, castleY + 30, 90, 80);
    ctx.fillRect(castleX - 25, castleY + 45, 30, 65);
    ctx.fillRect(castleX + 85, castleY + 40, 35, 70);
    // Broken battlements
    ctx.fillRect(castleX + 10, castleY + 12, 18, 22);
    ctx.fillRect(castleX + 45, castleY + 18, 14, 16);
    ctx.fillRect(castleX + 68, castleY + 10, 16, 24);
    // Smoke rising from the ruins into the sky
    ctx.fillStyle = 'rgba(68, 64, 60, 0.4)';
    for (let s = 0; s < 6; s++) {
      const smokeOffset = (this.birdTimer * 10 + s * 16) % 90;
      const sx = castleX + 35 + Math.sin(this.birdTimer + s) * 8;
      const sy = castleY + 20 - smokeOffset;
      const sSize = 4 + s * 2;
      ctx.fillRect(sx, sy, sSize, sSize);
    }

    // Layer 3: Ruined village cottages and silhouetted windmills (parallax 0.42)
    const midX = -(camX * 0.42) % 320;
    ctx.fillStyle = '#1c1917';
    for (let x = -320; x < VIRTUAL_WIDTH + 320; x += 160) {
      const bx = Math.floor(x + midX);
      // Ruined cottage roof
      ctx.beginPath();
      ctx.moveTo(bx, VIRTUAL_HEIGHT - 55);
      ctx.lineTo(bx + 35, VIRTUAL_HEIGHT - 95);
      ctx.lineTo(bx + 70, VIRTUAL_HEIGHT - 55);
      ctx.fill();
      ctx.fillRect(bx + 10, VIRTUAL_HEIGHT - 55, 50, 45);
      // Broken chimney
      ctx.fillRect(bx + 48, VIRTUAL_HEIGHT - 105, 8, 16);
    }
  }

  // ================= AREA 2: FOREST (Ancient trees / Moss / Statues) =================
  private renderForestBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // Layer 7: Emerald twilight canopy
    const grad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
    grad.addColorStop(0, '#022c22');
    grad.addColorStop(0.5, '#064e3b');
    grad.addColorStop(1, '#065f46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Layer 6: Rolling volumetric pixel fog
    ctx.fillStyle = 'rgba(6, 78, 59, 0.35)';
    const fogShift = (this.cloudOffset * 0.4 - camX * 0.08) % (VIRTUAL_WIDTH + 120);
    for (let f = -120; f < VIRTUAL_WIDTH + 140; f += 130) {
      const fx = f + fogShift;
      ctx.fillRect(fx, 110, 90, 30);
      ctx.fillRect(fx + 20, 95, 60, 20);
    }

    // Layer 5: Distant mountain ridges & ancient tree silhouettes (parallax 0.15)
    ctx.fillStyle = '#022c22';
    const mtnX = -(camX * 0.15) % 300;
    for (let i = -300; i < VIRTUAL_WIDTH + 300; i += 150) {
      const mx = Math.floor(i + mtnX);
      ctx.beginPath();
      ctx.moveTo(mx, VIRTUAL_HEIGHT - 60);
      ctx.lineTo(mx + 75, 100);
      ctx.lineTo(mx + 150, VIRTUAL_HEIGHT - 60);
      ctx.fill();
    }

    // Layer 4: Colossal Ancient Trees (parallax 0.3)
    ctx.fillStyle = '#031a14';
    const treeX = -(camX * 0.3) % 220;
    for (let t = -220; t < VIRTUAL_WIDTH + 220; t += 110) {
      const tx = Math.floor(t + treeX);
      // Gigantic tree trunks
      ctx.fillRect(tx, 0, 36, VIRTUAL_HEIGHT);
      // Large branches
      ctx.fillRect(tx - 30, 70, 32, 12);
      ctx.fillRect(tx + 34, 110, 36, 14);
      // Canopy crown
      ctx.fillRect(tx - 45, 15, 130, 45);
    }

    // Layer 3: Mossy ancient statues & small waterfalls (parallax 0.52)
    const midX = -(camX * 0.52) % 380;
    for (let s = -380; s < VIRTUAL_WIDTH + 380; s += 260) {
      const sx = Math.floor(s + midX);
      // Broken statue of knight
      ctx.fillStyle = '#042f24';
      ctx.fillRect(sx, VIRTUAL_HEIGHT - 130, 24, 55);
      ctx.fillRect(sx - 8, VIRTUAL_HEIGHT - 110, 40, 10);
      ctx.fillRect(sx + 4, VIRTUAL_HEIGHT - 145, 16, 16);
      // Small cascading waterfall in distance
      ctx.fillStyle = '#34d399';
      const waterY = (this.waterAnimTimer * 20) % 25;
      ctx.fillRect(sx + 120, 130, 8, 90);
      ctx.fillStyle = 'rgba(167, 243, 208, 0.6)';
      ctx.fillRect(sx + 122, 130 + waterY, 4, 15);
    }
  }

  // ================= AREA 3: THE MOONLIT LAKE (Celestial Moon / Reflections) =================
  private renderLakeBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // Layer 7: Nocturnal Deep Indigo Cosmos
    const sky = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT * 0.65);
    sky.addColorStop(0, '#030712'); // Pitch black-blue
    sky.addColorStop(0.5, '#0f172a');
    sky.addColorStop(1, '#1e293b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Stars
    ctx.fillStyle = '#e2e8f0';
    for (let s = 0; s < 35; s++) {
      const starX = ((s * 47) - camX * 0.01 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH;
      const starY = (s * 29) % (VIRTUAL_HEIGHT * 0.5);
      const twinkle = Math.sin(this.birdTimer * 3 + s) > 0.3 ? 1 : 0.4;
      ctx.globalAlpha = twinkle;
      ctx.fillRect(Math.floor(starX), Math.floor(starY), 1, 1);
    }
    ctx.globalAlpha = 1.0;

    // Enormous Celestial Moon
    const moonX = VIRTUAL_WIDTH * 0.45 - (camX * 0.02);
    const moonY = 55 - (camY * 0.02);
    // Outer halo
    ctx.fillStyle = 'rgba(219, 234, 254, 0.12)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 48, 0, Math.PI * 2);
    ctx.fill();
    // Moon disc
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
    ctx.fill();
    // Moon craters
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(moonX - 10, moonY - 6, 7, 7);
    ctx.fillRect(moonX + 4, moonY + 4, 9, 6);
    ctx.fillRect(moonX - 5, moonY + 11, 6, 5);

    // Layer 5: Gigantic moonlit cliff silhouettes (parallax 0.12)
    ctx.fillStyle = '#090d16';
    const cliffX = -(camX * 0.12) % 320;
    for (let c = -320; c < VIRTUAL_WIDTH + 320; c += 220) {
      const cx = Math.floor(c + cliffX);
      ctx.fillRect(cx, 80, 75, VIRTUAL_HEIGHT);
      ctx.fillRect(cx + 65, 110, 95, VIRTUAL_HEIGHT);
    }

    // The Vast Lake Water Horizon (at y = VIRTUAL_HEIGHT * 0.62)
    const waterY = Math.floor(VIRTUAL_HEIGHT * 0.62 - camY * 0.1);
    const lakeGrad = ctx.createLinearGradient(0, waterY, 0, VIRTUAL_HEIGHT);
    lakeGrad.addColorStop(0, '#0c1a30');
    lakeGrad.addColorStop(0.4, '#081220');
    lakeGrad.addColorStop(1, '#030712');
    ctx.fillStyle = lakeGrad;
    ctx.fillRect(0, waterY, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - waterY);

    // Dynamic Shimmering Moon Reflection across the lake water!
    const reflX = moonX;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
    for (let y = waterY; y < VIRTUAL_HEIGHT; y += 4) {
      const dist = y - waterY;
      const spread = dist * 0.35;
      const ripple = Math.sin(this.waterAnimTimer + y * 0.2) * 5;
      const rw = Math.max(4, 18 + spread + ripple);
      ctx.fillRect(Math.floor(reflX - rw / 2 + ripple), y, Math.floor(rw), 2);
    }

    // Layer 4: Ruined drowned watchtowers across the lake (parallax 0.28)
    ctx.fillStyle = '#060a12';
    const towerX = Math.floor(340 - (camX * 0.28));
    ctx.fillRect(towerX, waterY - 55, 34, 60);
    ctx.fillRect(towerX - 6, waterY - 52, 46, 8);
    // Tower reflection in water
    ctx.fillStyle = 'rgba(6, 10, 18, 0.4)';
    ctx.fillRect(towerX, waterY + 2, 34, 35);
  }

  // ================= AREA 4: THE FALLEN KINGDOM (Capital Ruins / Rain / Fire) =================
  private renderCapitalBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // Layer 7: Dark Storm Sky with Periodic Lightning Flash
    const sky = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
    if (this.lightningFlash > 0) {
      sky.addColorStop(0, `rgba(224, 231, 255, ${this.lightningFlash * 2.5})`);
      sky.addColorStop(1, `rgba(147, 197, 253, ${this.lightningFlash * 1.5})`);
    } else {
      sky.addColorStop(0, '#110c1d');
      sky.addColorStop(0.6, '#1f1635');
      sky.addColorStop(1, '#2e1065');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Layer 6: Rolling ominous storm clouds
    ctx.fillStyle = 'rgba(15, 10, 25, 0.65)';
    const cloudShift = (this.cloudOffset * 0.6 - camX * 0.08) % (VIRTUAL_WIDTH + 140);
    for (let c = -140; c < VIRTUAL_WIDTH + 160; c += 120) {
      const cx = c + cloudShift;
      ctx.fillRect(cx, 20, 80, 32);
      ctx.fillRect(cx + 25, 10, 50, 24);
    }

    // Layer 5: Colossal Cathedral Spires & Capital Ramparts (parallax 0.15)
    ctx.fillStyle = '#181126';
    const spireX = -(camX * 0.15) % 280;
    for (let s = -280; s < VIRTUAL_WIDTH + 280; s += 140) {
      const sx = Math.floor(s + spireX);
      // High gothic pointed arches
      ctx.beginPath();
      ctx.moveTo(sx, VIRTUAL_HEIGHT);
      ctx.lineTo(sx + 30, 45);
      ctx.lineTo(sx + 60, VIRTUAL_HEIGHT);
      ctx.fill();
    }

    // Layer 4: Burning Watchtowers & Shattered Colonnades (parallax 0.32)
    ctx.fillStyle = '#120b1c';
    const ruinsX = -(camX * 0.32) % 360;
    for (let r = -360; r < VIRTUAL_WIDTH + 360; r += 180) {
      const rx = Math.floor(r + ruinsX);
      ctx.fillRect(rx, 90, 48, VIRTUAL_HEIGHT);
      // Broken archways
      ctx.fillRect(rx + 48, 130, 60, 16);
      // Burning fire glow on the ruined parapet
      ctx.fillStyle = '#f97316';
      const flameSway = Math.sin(this.birdTimer * 12 + rx) * 3;
      ctx.fillRect(rx + 14 + flameSway, 78, 12, 14);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(rx + 17 + flameSway, 82, 6, 8);
      ctx.fillStyle = '#120b1c';
    }

    // Layer 3: Torn royal flags fluttering in storm (parallax 0.55)
    ctx.fillStyle = '#831843'; // Royal burgundy torn flag
    const flagX = Math.floor(250 - (camX * 0.55));
    ctx.fillRect(flagX, 160, 4, 60); // Flag pole
    const wave = Math.sin(this.birdTimer * 8) * 6;
    ctx.fillRect(flagX + 4, 165, 34 + wave, 18);
    ctx.fillRect(flagX + 4, 183, 26 + wave, 12);
  }

  // ================= AREA 5: THE TOWER OF DAWN (Above Clouds / Sacred Sunrise) =================
  private renderTowerBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // Layer 7: Radiant Sunrise Horizon transitioning into golden dawn
    const dawn = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
    dawn.addColorStop(0, '#311042');   // Cosmic purple
    dawn.addColorStop(0.35, '#581c87'); // Royal amethyst
    dawn.addColorStop(0.65, '#b45309'); // Radiant gold amber
    dawn.addColorStop(0.85, '#f59e0b'); // Golden sunlight
    dawn.addColorStop(1.0, '#fef08a');  // Incandescent dawn rays
    ctx.fillStyle = dawn;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Radiant Rising Sun at Summit
    const sunX = VIRTUAL_WIDTH * 0.65 - (camX * 0.02);
    const sunY = 90 - (camY * 0.02);
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
    ctx.fill();
    // Divine god-rays bursting outward
    ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
    for (let a = 0; a < 8; a++) {
      const angle = a * (Math.PI / 4) + this.birdTimer * 0.05;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle - 0.18) * 350, sunY + Math.sin(angle - 0.18) * 350);
      ctx.lineTo(sunX + Math.cos(angle + 0.18) * 350, sunY + Math.sin(angle + 0.18) * 350);
      ctx.fill();
    }

    // Layer 6: Endless Sea of Clouds rolling below the tower
    const seaY = Math.floor(VIRTUAL_HEIGHT * 0.58 - camY * 0.05);
    ctx.fillStyle = '#fef3c7';
    for (let c = -100; c < VIRTUAL_WIDTH + 100; c += 40) {
      const cx = c + ((this.cloudOffset * 0.2 - camX * 0.04) % 40);
      const bob = Math.sin(this.birdTimer * 1.5 + c * 0.1) * 6;
      ctx.beginPath();
      ctx.arc(cx, seaY + bob, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    // Deep cloud underlayer
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(0, seaY + 12, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - (seaY + 12));

    // Layer 5: Floating shattered crystal monoliths (parallax 0.15)
    ctx.fillStyle = '#d97706';
    for (let i = 0; i < 5; i++) {
      const mx = Math.floor((i * 110 - camX * 0.15 + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 100));
      const my = 80 + i * 22 + Math.sin(this.birdTimer + i) * 6;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + 12, my - 24);
      ctx.lineTo(mx + 24, my);
      ctx.lineTo(mx + 12, my + 14);
      ctx.fill();
    }

    // Layer 4: The Gigantic Ancient Tower of Dawn exterior spire piercing the heavens (parallax 0.28)
    const towerX = Math.floor(VIRTUAL_WIDTH * 0.42 - (camX * 0.28));
    ctx.fillStyle = '#78350f';
    ctx.fillRect(towerX, 0, 75, VIRTUAL_HEIGHT);
    // Flying buttresses & high arched windows
    ctx.fillRect(towerX - 45, 120, 48, 14);
    ctx.fillRect(towerX + 72, 160, 48, 14);
    // Glowing stained glass lancet windows
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(towerX + 24, 70, 12, 34);
    ctx.fillRect(towerX + 42, 70, 12, 34);
    ctx.fillRect(towerX + 33, 130, 14, 40);
  }
}

export const parallaxEngine = new ParallaxRenderer();
