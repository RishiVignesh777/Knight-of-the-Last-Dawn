import { AreaId } from '../types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';
import { PALETTE, drawPixelRect, drawDitheredSky, drawPixelCircle, drawPixelCrystal } from './pixelArtHelper';
import { skySystem } from './skyRenderer';

export class ParallaxRenderer {
  private birdTimer: number = 0;
  private cloudOffset: number = 0;
  private waterAnimTimer: number = 0;
  private lightningTimer: number = 0;
  private lightningFlash: boolean = false;

  public update(dt: number) {
    this.birdTimer += dt;
    this.cloudOffset += dt * 6;
    this.waterAnimTimer += dt * 4;

    // Capital lightning flash timer
    this.lightningTimer += dt;
    if (this.lightningTimer > 5.0 + Math.random() * 4) {
      this.lightningTimer = 0;
      this.lightningFlash = true;
      setTimeout(() => {
        this.lightningFlash = false;
      }, 100);
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
    const fgOffsetX = Math.floor(-(cameraX * 1.25)) % VIRTUAL_WIDTH;

    ctx.save();
    if (areaId === AreaId.VILLAGE) {
      // 8-bit foreground fence posts & dark silhouette grass tufts
      for (let x = -30; x < VIRTUAL_WIDTH + 60; x += 36) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 12, 2, 12);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 3, VIRTUAL_HEIGHT - 16, 2, 16);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 6, VIRTUAL_HEIGHT - 10, 2, 10);
        if (x % 72 === 0) {
          drawPixelRect(ctx, PALETTE.DARKEST_GRAY, drawX + 12, VIRTUAL_HEIGHT - 22, 4, 22);
          drawPixelRect(ctx, PALETTE.DARKEST_GRAY, drawX + 10, VIRTUAL_HEIGHT - 18, 8, 3);
        }
      }
    } else if (areaId === AreaId.FOREST) {
      // 8-bit Hanging ancient vines from top
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 48) {
        const drawX = Math.floor(x + fgOffsetX);
        const vineLen = 18 + ((x * 7) % 24);
        drawPixelRect(ctx, PALETTE.NIGHT_GREEN, drawX, 0, 2, vineLen);
        drawPixelRect(ctx, PALETTE.DARK_PINE, drawX - 2, vineLen - 4, 6, 3);
      }
    } else if (areaId === AreaId.LAKE) {
      // 8-bit water reeds
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 28) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.MIDNIGHT_BLUE, drawX, VIRTUAL_HEIGHT - 16, 2, 16);
        drawPixelRect(ctx, PALETTE.MIDNIGHT_BLUE, drawX + 4, VIRTUAL_HEIGHT - 12, 2, 12);
      }
    } else if (areaId === AreaId.CAPITAL) {
      // 8-bit cracked stone battlements
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 64) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 20, 6, 20);
        drawPixelRect(ctx, PALETTE.BLACK, drawX - 4, VIRTUAL_HEIGHT - 18, 14, 4);
      }
    } else if (areaId === AreaId.TOWER) {
      // 8-bit golden crystal sparkles floating
      for (let i = 0; i < 6; i++) {
        const px = Math.floor((i * 55 + fgOffsetX * 0.8 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
        const py = Math.floor(20 + i * 25 + Math.sin(this.birdTimer + i) * 8);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, px, py, 2, 2);
      }
    }
    ctx.restore();
  }

  // ================= AREA 1: THE FORGOTTEN VILLAGE =================
  private renderVillageBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Pixel-Dithered Sky using restricted Sunset & Twilight palettes + Bayer pattern matrix
    skySystem.renderSunsetTwilightSky(ctx, camX, camY, this.birdTimer);

    // 2. Blocky 8-bit drifting clouds (parallax 0.05)
    const blend = skySystem.getPhaseBlend(this.birdTimer);
    const cloudColor = blend > 0.5 ? PALETTE.DARK_VIOLET : PALETTE.DEEP_MAROON;
    const cloudShift = Math.floor(this.cloudOffset * 0.3 - camX * 0.04) % (VIRTUAL_WIDTH + 80);
    for (let c = -80; c < VIRTUAL_WIDTH + 100; c += 110) {
      const cx = c + cloudShift;
      drawPixelRect(ctx, cloudColor, cx, 28, 55, 8);
      drawPixelRect(ctx, cloudColor, cx + 8, 22, 36, 8);
      drawPixelRect(ctx, cloudColor, cx + 16, 18, 18, 6);
    }

    // 4. Distant 8-bit birds flying in V-formation
    const birdBaseX = Math.floor(((this.birdTimer * 12 - camX * 0.03) % (VIRTUAL_WIDTH + 60)) - 30);
    const birdY = Math.floor(38 + Math.sin(this.birdTimer * 0.8) * 3);
    for (let b = 0; b < 4; b++) {
      const bx = birdBaseX + b * 7;
      const by = birdY + Math.abs(b - 2) * 4;
      const flap = Math.floor(this.birdTimer * 6 + b) % 2 === 0 ? 0 : 1;
      drawPixelRect(ctx, PALETTE.BLACK, bx, by, 2, 1);
      drawPixelRect(ctx, PALETTE.BLACK, bx - 1, by - flap, 1, 1);
      drawPixelRect(ctx, PALETTE.BLACK, bx + 2, by - flap, 1, 1);
    }

    // 5. Distant jagged mountain ridges (parallax 0.12)
    const mtnX = Math.floor(-(camX * 0.12)) % 240;
    for (let i = -240; i < VIRTUAL_WIDTH + 240; i += 120) {
      const mx = i + mtnX;
      // Stepped mountain slopes
      for (let s = 0; s < 60; s += 4) {
        const span = s * 2;
        drawPixelRect(ctx, PALETTE.DEEP_BROWN, mx + 60 - s, 70 + s, span, 4);
      }
    }

    // 6. Colossal Ruined Castle on Horizon (parallax 0.22)
    const castleX = Math.floor(190 - (camX * 0.22));
    const castleY = VIRTUAL_HEIGHT - 105;
    // Central Keep & Spire
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX, castleY + 20, 60, 60);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX - 18, castleY + 32, 20, 48);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 58, castleY + 28, 24, 52);
    // Crenellated battlements
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 8, castleY + 6, 12, 16);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 30, castleY + 10, 10, 12);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 46, castleY + 4, 12, 18);

    // Stepped 8-bit smoke puffs rising from the ruined castle
    for (let s = 0; s < 5; s++) {
      const smokeY = Math.floor((this.birdTimer * 8 + s * 14) % 65);
      const sx = Math.floor(castleX + 24 + Math.sin(this.birdTimer + s) * 5);
      const sy = castleY + 15 - smokeY;
      const sSize = 2 + Math.floor(s * 1.2);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, sx, sy, sSize, sSize);
    }

    // 7. Silhouetted village cottages & broken windmills (parallax 0.42)
    const midX = Math.floor(-(camX * 0.42)) % 220;
    for (let x = -220; x < VIRTUAL_WIDTH + 220; x += 110) {
      const bx = x + midX;
      // Stepped cottage roof
      for (let r = 0; r < 20; r += 2) {
        drawPixelRect(ctx, PALETTE.BLACK, bx + 24 - r, VIRTUAL_HEIGHT - 65 - (20 - r), r * 2, 2);
      }
      drawPixelRect(ctx, PALETTE.BLACK, bx + 4, VIRTUAL_HEIGHT - 65, 40, 35);
      drawPixelRect(ctx, PALETTE.BLACK, bx + 32, VIRTUAL_HEIGHT - 92, 6, 14); // Chimney
    }
  }

  // ================= AREA 2: THE WHISPERING FOREST =================
  private renderForestBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Deep Emerald-to-Navy Dithered Canopy Sky
    skySystem.renderAreaSky(ctx, AreaId.FOREST, camX, camY, this.birdTimer);

    // 2. Layered Pixel Fog Bands scrolling horizontally
    const fogShift = Math.floor(this.cloudOffset * 0.4 - camX * 0.08) % (VIRTUAL_WIDTH + 80);
    for (let f = -80; f < VIRTUAL_WIDTH + 100; f += 90) {
      const fx = f + fogShift;
      drawPixelRect(ctx, PALETTE.DARK_PINE, fx, 80, 65, 18);
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, fx + 14, 70, 42, 14);
    }

    // 3. Colossal Ancient Trees & Stepped Branches (parallax 0.3)
    const treeX = Math.floor(-(camX * 0.3)) % 160;
    for (let t = -160; t < VIRTUAL_WIDTH + 160; t += 80) {
      const tx = t + treeX;
      // Massive trunk
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, tx, 0, 24, VIRTUAL_HEIGHT);
      drawPixelRect(ctx, PALETTE.BLACK, tx + 4, 0, 16, VIRTUAL_HEIGHT);
      // Large stepped branches
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, tx - 20, 50, 22, 8);
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, tx + 22, 80, 24, 9);
      // Foliage clusters
      drawPixelRect(ctx, PALETTE.DARK_PINE, tx - 30, 10, 85, 30);
    }

    // 4. Mossy Knight Statues & Pixel Waterfall (parallax 0.52)
    const midX = Math.floor(-(camX * 0.52)) % 260;
    for (let s = -260; s < VIRTUAL_WIDTH + 260; s += 180) {
      const sx = s + midX;
      // Statue of fallen knight
      drawPixelRect(ctx, PALETTE.BLACK, sx, VIRTUAL_HEIGHT - 90, 16, 40);
      drawPixelRect(ctx, PALETTE.BLACK, sx - 6, VIRTUAL_HEIGHT - 75, 28, 6);
      drawPixelRect(ctx, PALETTE.BLACK, sx + 3, VIRTUAL_HEIGHT - 100, 10, 12);

      // Pixel Waterfall Cascade
      const waterStep = Math.floor(this.waterAnimTimer * 6) % 3;
      drawPixelRect(ctx, PALETTE.MINT_GREEN, sx + 85, 90, 6, 60);
      drawPixelRect(ctx, PALETTE.WHITE, sx + 86, 90 + waterStep * 16, 4, 10);
    }
  }

  // ================= AREA 3: THE MOONLIT LAKE =================
  private renderLakeBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Nocturnal Deep Indigo Cosmos Sky
    skySystem.renderAreaSky(ctx, AreaId.LAKE, camX, camY, this.birdTimer);

    // 2. 1-Pixel Twinkling Stars
    for (let s = 0; s < 30; s++) {
      const starX = Math.floor((s * 39 - camX * 0.01 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
      const starY = Math.floor((s * 23) % 90);
      const twinkle = Math.floor(this.birdTimer * 3 + s) % 2 === 0;
      if (twinkle) {
        drawPixelRect(ctx, PALETTE.WHITE, starX, starY, 1, 1);
      }
    }

    // 3. Giant Pixel Moon with Dithered Crater Details
    const moonX = Math.floor(VIRTUAL_WIDTH * 0.48 - (camX * 0.02));
    const moonY = Math.floor(45 - (camY * 0.02));
    // Moon disc
    drawPixelCircle(ctx, PALETTE.WHITE, moonX, moonY, 18);
    // Craters
    drawPixelRect(ctx, PALETTE.ICE_WHITE, moonX - 7, moonY - 4, 5, 5);
    drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, moonX + 3, moonY + 3, 6, 4);
    drawPixelRect(ctx, PALETTE.ICE_WHITE, moonX - 4, moonY + 8, 4, 4);

    // 4. Gigantic Moonlit Cliff Silhouettes (parallax 0.12)
    const cliffX = Math.floor(-(camX * 0.12)) % 220;
    for (let c = -220; c < VIRTUAL_WIDTH + 220; c += 150) {
      const cx = c + cliffX;
      drawPixelRect(ctx, PALETTE.BLACK, cx, 55, 50, VIRTUAL_HEIGHT);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 45, 75, 65, VIRTUAL_HEIGHT);
    }

    // 5. The Vast Lake Water Horizon (at y = 110)
    const waterY = Math.floor(110 - camY * 0.08);
    drawDitheredSky(ctx, PALETTE.DARK_NAVY, PALETTE.MIDNIGHT_BLUE, 0, waterY, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - waterY, 16);

    // 6. Dynamic Shimmering 8-Bit Moon Reflection across water!
    const reflX = moonX;
    for (let y = waterY; y < VIRTUAL_HEIGHT; y += 3) {
      const dist = y - waterY;
      const spread = Math.floor(dist * 0.3);
      const ripple = Math.floor(Math.sin(this.waterAnimTimer + y * 0.3) * 4);
      const rw = Math.max(4, 12 + spread + ripple);
      const reflColor = (y % 6 === 0) ? PALETTE.ICE_WHITE : PALETTE.CYAN_HIGHLIGHT;
      drawPixelRect(ctx, reflColor, Math.floor(reflX - rw / 2 + ripple), y, rw, 1);
    }

    // 7. Drowned Watchtowers in the Lake (parallax 0.28)
    const towerX = Math.floor(230 - (camX * 0.28));
    drawPixelRect(ctx, PALETTE.BLACK, towerX, waterY - 38, 24, 42);
    drawPixelRect(ctx, PALETTE.BLACK, towerX - 4, waterY - 36, 32, 6);
    // Water reflection of tower
    drawPixelRect(ctx, PALETTE.BLACK, towerX, waterY + 2, 24, 25);
  }

  // ================= AREA 4: THE FALLEN KINGDOM =================
  private renderCapitalBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Dark Storm Sky with Periodic Full-Screen Palette Flash
    if (this.lightningFlash) {
      // Full screen white flash
      drawPixelRect(ctx, PALETTE.WHITE, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      return;
    }

    skySystem.renderAreaSky(ctx, AreaId.CAPITAL, camX, camY, this.birdTimer);

    // 2. Rolling Ominous Storm Clouds
    const cloudShift = Math.floor(this.cloudOffset * 0.5 - camX * 0.08) % (VIRTUAL_WIDTH + 100);
    for (let c = -100; c < VIRTUAL_WIDTH + 120; c += 90) {
      const cx = c + cloudShift;
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx, 15, 60, 22);
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx + 18, 8, 38, 16);
    }

    // 3. Colossal Gothic Cathedral Spires (parallax 0.15)
    const spireX = Math.floor(-(camX * 0.15)) % 200;
    for (let s = -200; s < VIRTUAL_WIDTH + 200; s += 100) {
      const sx = s + spireX;
      // High pointed gothic spire
      for (let h = 0; h < 70; h += 3) {
        const sw = Math.floor(h * 0.6);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, sx + 20 - Math.floor(sw / 2), 30 + h, sw, 3);
      }
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, sx + 5, 100, 30, VIRTUAL_HEIGHT - 100);
    }

    // 4. Burning Watchtowers & Flickering Fire Pixels (parallax 0.32)
    const ruinsX = Math.floor(-(camX * 0.32)) % 260;
    for (let r = -260; r < VIRTUAL_WIDTH + 260; r += 130) {
      const rx = r + ruinsX;
      drawPixelRect(ctx, PALETTE.BLACK, rx, 65, 34, VIRTUAL_HEIGHT);
      // Broken archways
      drawPixelRect(ctx, PALETTE.BLACK, rx + 34, 95, 42, 12);

      // Flickering 8-bit Fire Pixels on parapet
      const flameSway = Math.floor(Math.sin(this.birdTimer * 10 + rx) * 2);
      drawPixelRect(ctx, PALETTE.BRIGHT_RED, rx + 10 + flameSway, 55, 9, 11);
      drawPixelRect(ctx, PALETTE.GOLD, rx + 12 + flameSway, 58, 5, 6);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 14 + flameSway, 60, 2, 3);
    }

    // 5. Torn Royal Banners Fluttering (parallax 0.55)
    const flagX = Math.floor(180 - (camX * 0.55));
    drawPixelRect(ctx, PALETTE.BLACK, flagX, 110, 3, 45); // Pole
    const wave = Math.floor(Math.sin(this.birdTimer * 8) * 4);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, flagX + 3, 114, 24 + wave, 12);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, flagX + 3, 126, 18 + wave, 8);
  }

  // ================= AREA 5: THE TOWER OF DAWN =================
  private renderTowerBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Radiant Gold-to-Violet Dawn Dithered Sky
    skySystem.renderAreaSky(ctx, AreaId.TOWER, camX, camY, this.birdTimer);

    // 2. Radiant Rising Sun at Summit
    const sunX = Math.floor(VIRTUAL_WIDTH * 0.65 - (camX * 0.02));
    const sunY = Math.floor(65 - (camY * 0.02));
    drawPixelCircle(ctx, PALETTE.WHITE, sunX, sunY, 22);
    drawPixelCircle(ctx, PALETTE.SUN_YELLOW, sunX, sunY, 14);

    // 8-bit Stepped God Rays
    for (let r = 0; r < 4; r++) {
      const rx = sunX + Math.floor(Math.cos(r * 1.5 + this.birdTimer * 0.1) * 60);
      const ry = sunY + Math.floor(Math.sin(r * 1.5 + this.birdTimer * 0.1) * 60);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx, ry, 6, 2);
    }

    // 3. Endless Sea of Blocky 8-Bit Clouds Rolling Below
    const seaY = Math.floor(125 - camY * 0.05);
    for (let c = -60; c < VIRTUAL_WIDTH + 60; c += 30) {
      const cx = c + (Math.floor(this.cloudOffset * 0.2 - camX * 0.04) % 30);
      const bob = Math.floor(Math.sin(this.birdTimer + c) * 3);
      drawPixelCircle(ctx, PALETTE.WHITE, cx, seaY + bob, 16);
      drawPixelCircle(ctx, PALETTE.PALE_GOLD, cx, seaY + 8 + bob, 14);
    }
    drawPixelRect(ctx, PALETTE.GOLD, 0, seaY + 12, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - (seaY + 12));

    // 4. Floating Shattered Crystal Monoliths (parallax 0.15)
    for (let i = 0; i < 4; i++) {
      const mx = Math.floor((i * 85 - camX * 0.15 + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 80));
      const my = Math.floor(60 + i * 18 + Math.sin(this.birdTimer + i) * 4);
      drawPixelCrystal(ctx, mx, my, 10, 16, PALETTE.PALE_GOLD, PALETTE.WHITE, PALETTE.AMBER_DARK);
    }

    // 5. The Gigantic Ancient Tower of Dawn Spire (parallax 0.28)
    const towerX = Math.floor(VIRTUAL_WIDTH * 0.42 - (camX * 0.28));
    drawPixelRect(ctx, PALETTE.DEEP_BROWN, towerX, 0, 55, VIRTUAL_HEIGHT);
    drawPixelRect(ctx, PALETTE.RUST, towerX + 4, 0, 47, VIRTUAL_HEIGHT);
    // Glowing Stained Glass Lancet Windows
    drawPixelRect(ctx, PALETTE.SUN_YELLOW, towerX + 16, 50, 8, 24);
    drawPixelRect(ctx, PALETTE.WHITE, towerX + 18, 52, 4, 20);
    drawPixelRect(ctx, PALETTE.SUN_YELLOW, towerX + 31, 50, 8, 24);
    drawPixelRect(ctx, PALETTE.WHITE, towerX + 33, 52, 4, 20);
  }

  // ================= TITLE SCREEN VISTA (Section 2 & 26) =================
  public renderTitleScreenVista(ctx: CanvasRenderingContext2D, time: number) {
    // Dramatic composition:
    // Pixel-dithered sunset/twilight sky, setting sun with dithered halo, castle on distant mountain horizon,
    // and Sir Cael standing as a tiny 8-bit knight on a rocky cliff edge in the foreground!

    // 1. Sky & Sun (Pixel-dithered pattern system with restricted sunset/twilight palette)
    skySystem.renderTitleScreenSky(ctx, time);

    // 2. Clouds
    const cloudShift = Math.floor(time * 3) % (VIRTUAL_WIDTH + 80);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, 40 + cloudShift, 25, 60, 8);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, 50 + cloudShift, 20, 40, 7);

    // 4. Distant Mountains
    for (let s = 0; s < 70; s += 4) {
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, 220 - s, 75 + s, s * 2, 4);
    }
    for (let s = 0; s < 55; s += 4) {
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, 130 - s, 90 + s, s * 2, 4);
    }

    // 5. Distant Ruined Castle Spires on Horizon
    const castleX = 185;
    const castleY = 82;
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX, castleY + 12, 50, 45);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 8, castleY, 10, 15);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 24, castleY - 6, 8, 20);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 38, castleY + 2, 10, 14);

    // 6. Flying Birds
    const birdX = Math.floor((time * 10) % (VIRTUAL_WIDTH + 40)) - 20;
    drawPixelRect(ctx, PALETTE.BLACK, birdX, 35, 2, 1);
    drawPixelRect(ctx, PALETTE.BLACK, birdX + 7, 39, 2, 1);
    drawPixelRect(ctx, PALETTE.BLACK, birdX + 14, 34, 2, 1);

    // 7. High Rocky Cliff Promontory (Foreground Left)
    drawPixelRect(ctx, PALETTE.BLACK, 0, 115, 95, 65);
    drawPixelRect(ctx, PALETTE.BLACK, 0, 125, 115, 55);
    drawPixelRect(ctx, PALETTE.BLACK, 0, 138, 140, 42);
    // Grass top on cliff
    drawPixelRect(ctx, PALETTE.MOSS_GREEN, 0, 115, 95, 2);

    // 8. Tiny Sir Cael standing on the cliff edge looking toward the distant castle
    const knightX = 72;
    const knightY = 95;
    // Boots & legs
    drawPixelRect(ctx, PALETTE.MID_GRAY, knightX + 2, knightY + 14, 3, 6);
    drawPixelRect(ctx, PALETTE.MID_GRAY, knightX + 7, knightY + 14, 3, 6);
    // Torso & armor
    drawPixelRect(ctx, PALETTE.DARK_GRAY, knightX + 2, knightY + 6, 8, 8);
    drawPixelRect(ctx, PALETTE.GOLD, knightX + 5, knightY + 8, 2, 2);
    // Helmet & visor
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, knightX + 3, knightY, 7, 6);
    drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, knightX + 7, knightY + 2, 3, 1);
    // Crimson cape fluttering in wind (3-frame animation)
    const capeFrame = Math.floor(time * 4) % 3;
    const capeW = capeFrame === 0 ? 5 : capeFrame === 1 ? 7 : 6;
    drawPixelRect(ctx, PALETTE.CRIMSON, knightX - capeW, knightY + 6, capeW, 9);
    // Sheathed sword
    drawPixelRect(ctx, PALETTE.AMBER, knightX + 1, knightY + 7, 2, 3);
    drawPixelRect(ctx, PALETTE.BRIGHT_GRAY, knightX - 1, knightY + 10, 2, 8);
  }
}

export const parallaxEngine = new ParallaxRenderer();
