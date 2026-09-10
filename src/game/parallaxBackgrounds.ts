import { AreaId } from '../types';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from './constants';
import { PALETTE, drawPixelRect, drawDitheredSky, drawPixelCircle, drawPixelCrystal, drawGothicArch, drawRoseWindow, drawOrnateCross, draw16BitWaterReflection, draw16BitPillar, draw16BitChain, draw16BitCandleCluster, draw16BitStatue } from './pixelArtHelper';

export class ParallaxRenderer {
  private birdTimer: number = 0;
  private cloudOffset: number = 0;
  private waterAnimTimer: number = 0;
  private lightningTimer: number = 0;
  private lightningFlash: boolean = false;

  public update(dt: number) {
    this.birdTimer += dt;
    this.cloudOffset += dt * 5;
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
      case AreaId.CATHEDRAL:
        this.renderCathedralBackground(ctx, cameraX, cameraY);
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
      // Wrought iron cemetery railings & weather-beaten stone crosses
      for (let x = -30; x < VIRTUAL_WIDTH + 60; x += 36) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 16, 2, 16);
        drawPixelRect(ctx, PALETTE.BLACK, drawX - 1, VIRTUAL_HEIGHT - 18, 4, 3); // Spear tip
        drawPixelRect(ctx, PALETTE.BLACK, drawX - 8, VIRTUAL_HEIGHT - 10, 18, 2); // Cross rail
        if (x % 72 === 0) {
          drawOrnateCross(ctx, drawX + 12, VIRTUAL_HEIGHT - 22, 20, PALETTE.BLACK, PALETTE.DARKEST_GRAY);
        }
      }
    } else if (areaId === AreaId.FOREST) {
      // Hanging petrified brambles & twisted thorns
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 48) {
        const drawX = Math.floor(x + fgOffsetX);
        const vineLen = 22 + ((x * 7) % 26);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, 0, 3, vineLen);
        drawPixelRect(ctx, PALETTE.DARK_PINE, drawX + 1, 0, 1, vineLen);
        // Thorn spikes
        drawPixelRect(ctx, PALETTE.BLACK, drawX - 3, vineLen - 8, 3, 2);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 3, vineLen - 14, 3, 2);
      }
    } else if (areaId === AreaId.LAKE) {
      // Dark water reeds and drowned cemetery headstones
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 28) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 18, 2, 18);
        drawPixelRect(ctx, PALETTE.MIDNIGHT_BLUE, drawX + 4, VIRTUAL_HEIGHT - 14, 2, 14);
        if (x % 56 === 0) {
          drawPixelRect(ctx, PALETTE.BLACK, drawX + 10, VIRTUAL_HEIGHT - 16, 8, 14);
          drawPixelRect(ctx, PALETTE.BLACK, drawX + 12, VIRTUAL_HEIGHT - 18, 4, 3);
        }
      }
    } else if (areaId === AreaId.CAPITAL) {
      // Carved gargoyle parapets and gothic battlements
      for (let x = -20; x < VIRTUAL_WIDTH + 40; x += 64) {
        const drawX = Math.floor(x + fgOffsetX);
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 22, 8, 22);
        drawPixelRect(ctx, PALETTE.BLACK, drawX - 4, VIRTUAL_HEIGHT - 20, 16, 4);
        // Small stone gargoyle silhouette
        if (x % 128 === 0) {
          drawPixelRect(ctx, PALETTE.BLACK, drawX - 6, VIRTUAL_HEIGHT - 28, 6, 8);
          drawPixelRect(ctx, PALETTE.BLACK, drawX - 9, VIRTUAL_HEIGHT - 26, 4, 3);
        }
      }
    } else if (areaId === AreaId.CATHEDRAL) {
      // Ornate wrought-iron chancel railings & hanging chain links
      for (let x = -20; x < VIRTUAL_WIDTH + 60; x += 54) {
        const drawX = Math.floor(x + fgOffsetX);
        // Hanging chain
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 12, 0, 3, 38);
        drawPixelRect(ctx, PALETTE.IRON_HIGHLIGHT, drawX + 13, 0, 1, 38);
        // Foreground altar railing with cross tips
        drawPixelRect(ctx, PALETTE.BLACK, drawX, VIRTUAL_HEIGHT - 20, 50, 3);
        drawPixelRect(ctx, PALETTE.BRASS, drawX, VIRTUAL_HEIGHT - 19, 50, 1);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 4, VIRTUAL_HEIGHT - 24, 4, 24);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 25, VIRTUAL_HEIGHT - 24, 4, 24);
        drawPixelRect(ctx, PALETTE.BLACK, drawX + 46, VIRTUAL_HEIGHT - 24, 4, 24);
      }
    } else if (areaId === AreaId.TOWER) {
      // Sacred floating golden relic motes / prayer embers
      for (let i = 0; i < 7; i++) {
        const px = Math.floor((i * 48 + fgOffsetX * 0.8 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
        const py = Math.floor(18 + i * 24 + Math.sin(this.birdTimer + i) * 8);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, px, py, 2, 2);
        drawPixelRect(ctx, PALETTE.PALE_GOLD, px - 1, py + 1, 1, 1);
      }
    }
    ctx.restore();
  }

  // ================= AREA 1: THE FORGOTTEN VILLAGE (RUINS OF VALEN'S HOLLOW) =================
  private renderVillageBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Ominous Dithered Twilight Sky (Mourning Charcoal -> Deep Blood Burgundy -> Burnt Amber -> Dusky Gold)
    drawDitheredSky(ctx, PALETTE.DARKEST_GRAY, PALETTE.VOID_PURPLE, 0, 0, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.VOID_PURPLE, PALETTE.DEEP_MAROON, 0, 45, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.DEEP_MAROON, PALETTE.AMBER_DARK, 0, 90, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.AMBER_DARK, PALETTE.BRASS, 0, 135, VIRTUAL_WIDTH, 45, 14);

    // 2. Colossal Dying Blood Sun descending past gothic horizon
    const sunX = Math.floor(VIRTUAL_WIDTH * 0.74 - (camX * 0.02));
    const sunY = Math.floor(58 - (camY * 0.02));
    drawPixelCircle(ctx, PALETTE.CRIMSON, sunX, sunY, 18);
    drawPixelCircle(ctx, PALETTE.AMBER, sunX, sunY, 12);
    drawPixelCircle(ctx, PALETTE.SUN_YELLOW, sunX, sunY, 6);

    // 3. Heavy brooding storm clouds
    const cloudShift = Math.floor(this.cloudOffset * 0.3 - camX * 0.04) % (VIRTUAL_WIDTH + 80);
    for (let c = -80; c < VIRTUAL_WIDTH + 100; c += 110) {
      const cx = c + cloudShift;
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, cx, 26, 60, 8);
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, cx + 8, 20, 40, 8);
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx + 16, 16, 20, 6);
    }

    // 4. Distant Ravens / Carrion Crows flying in scattered formation
    const birdBaseX = Math.floor(((this.birdTimer * 10 - camX * 0.03) % (VIRTUAL_WIDTH + 60)) - 30);
    const birdY = Math.floor(36 + Math.sin(this.birdTimer * 0.7) * 3);
    for (let b = 0; b < 4; b++) {
      const bx = birdBaseX + b * 8;
      const by = birdY + Math.abs(b - 2) * 4;
      const flap = Math.floor(this.birdTimer * 6 + b) % 2 === 0 ? 0 : 1;
      drawPixelRect(ctx, PALETTE.BLACK, bx, by, 2, 1);
      drawPixelRect(ctx, PALETTE.BLACK, bx - 1, by - flap, 1, 1);
      drawPixelRect(ctx, PALETTE.BLACK, bx + 2, by - flap, 1, 1);
    }

    // 5. Jagged Distant Mountain Crags (parallax 0.12)
    const mtnX = Math.floor(-(camX * 0.12)) % 240;
    for (let i = -240; i < VIRTUAL_WIDTH + 240; i += 120) {
      const mx = i + mtnX;
      for (let s = 0; s < 60; s += 4) {
        const span = s * 2;
        drawPixelRect(ctx, PALETTE.DEEP_BROWN, mx + 60 - s, 70 + s, span, 4);
      }
    }

    // 6. Colossal Ruined Gothic Cathedral on the Horizon (parallax 0.22)
    const cathX = Math.floor(185 - (camX * 0.22));
    const cathY = VIRTUAL_HEIGHT - 110;
    // Central Cathedral Mass
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cathX, cathY + 22, 65, 60);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cathX - 18, cathY + 36, 22, 48);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cathX + 62, cathY + 30, 26, 54);

    // High pointed gothic spires with stone crockets
    for (let h = 0; h < 34; h += 2) {
      const sw = Math.floor(h * 0.4);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cathX + 12 - Math.floor(sw / 2), cathY - h + 22, sw, 2);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cathX + 48 - Math.floor(sw / 2), cathY - h + 20, sw, 2);
    }
    // Ruined central rose window in cathedral facade
    drawRoseWindow(ctx, cathX + 32, cathY + 42, 10, PALETTE.BLACK, PALETTE.BURGUNDY, PALETTE.AMBER);

    // Stepped smoke puffs rising from destroyed village fires
    for (let s = 0; s < 5; s++) {
      const smokeY = Math.floor((this.birdTimer * 8 + s * 14) % 65);
      const sx = Math.floor(cathX + 20 + Math.sin(this.birdTimer + s) * 5);
      const sy = cathY + 20 - smokeY;
      const sSize = 2 + Math.floor(s * 1.2);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, sx, sy, sSize, sSize);
    }

    // 7. Ruined gothic chapel roofs, crumbling archways & graveyard crosses (parallax 0.42)
    const midX = Math.floor(-(camX * 0.42)) % 220;
    for (let x = -220; x < VIRTUAL_WIDTH + 220; x += 110) {
      const bx = x + midX;
      // High pitch gothic steep roof
      for (let r = 0; r < 24; r += 2) {
        drawPixelRect(ctx, PALETTE.BLACK, bx + 24 - r, VIRTUAL_HEIGHT - 65 - (24 - r), r * 2, 2);
      }
      drawPixelRect(ctx, PALETTE.BLACK, bx + 2, VIRTUAL_HEIGHT - 65, 44, 35);
      // Bell tower spire
      drawPixelRect(ctx, PALETTE.BLACK, bx + 36, VIRTUAL_HEIGHT - 95, 8, 30);
      drawPixelRect(ctx, PALETTE.BLACK, bx + 38, VIRTUAL_HEIGHT - 105, 4, 10);
      // Cemetery headstones & crucifixes
      drawOrnateCross(ctx, bx - 14, VIRTUAL_HEIGHT - 48, 16, PALETTE.BLACK, PALETTE.DARKEST_GRAY);
      drawPixelRect(ctx, PALETTE.BLACK, bx - 26, VIRTUAL_HEIGHT - 42, 8, 12);
    }
  }

  // ================= AREA 2: THE WHISPERING FOREST (BLACKTHORN WEALD) =================
  private renderForestBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Petrified Dark Crypt Forest Sky (Deep Pine to Night Swamp Green)
    drawDitheredSky(ctx, PALETTE.BLACK, PALETTE.NIGHT_GREEN, 0, 0, VIRTUAL_WIDTH, 60, 16);
    drawDitheredSky(ctx, PALETTE.NIGHT_GREEN, PALETTE.DARK_PINE, 0, 60, VIRTUAL_WIDTH, 60, 16);
    drawDitheredSky(ctx, PALETTE.DARK_PINE, PALETTE.MOSS_GREEN, 0, 120, VIRTUAL_WIDTH, 60, 16);

    // 2. Chilly Spectral Fog Bands drifting across the petrified groves
    const fogShift = Math.floor(this.cloudOffset * 0.4 - camX * 0.08) % (VIRTUAL_WIDTH + 80);
    for (let f = -80; f < VIRTUAL_WIDTH + 100; f += 90) {
      const fx = f + fogShift;
      drawPixelRect(ctx, PALETTE.DARK_PINE, fx, 75, 70, 20);
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, fx + 16, 68, 46, 16);
      // Pale glowing spore motes
      drawPixelRect(ctx, PALETTE.MINT_GREEN, fx + 28, 82, 1, 1);
      drawPixelRect(ctx, PALETTE.MINT_GREEN, fx + 50, 76, 1, 1);
    }

    // 3. Colossal Gnarled Petrified Trees forming gothic ribbed vault arches (parallax 0.3)
    const treeX = Math.floor(-(camX * 0.3)) % 160;
    for (let t = -160; t < VIRTUAL_WIDTH + 160; t += 80) {
      const tx = t + treeX;
      // Massive ancient trunk
      drawPixelRect(ctx, PALETTE.BLACK, tx, 0, 26, VIRTUAL_HEIGHT);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, tx + 4, 0, 18, VIRTUAL_HEIGHT);
      // Pointed thorn branches interlocking overhead like gothic ribs
      drawPixelRect(ctx, PALETTE.BLACK, tx - 24, 45, 26, 8);
      drawPixelRect(ctx, PALETTE.BLACK, tx + 24, 75, 28, 9);
      // Dense dead foliage masses
      drawPixelRect(ctx, PALETTE.DARK_PINE, tx - 32, 10, 90, 32);
    }

    // 4. Overgrown Monastery Ruins & Weeping Saint Statues (parallax 0.52)
    const midX = Math.floor(-(camX * 0.52)) % 260;
    for (let s = -260; s < VIRTUAL_WIDTH + 260; s += 180) {
      const sx = s + midX;
      // Ruined Monastery Gothic Arches
      drawGothicArch(ctx, sx + 20, VIRTUAL_HEIGHT - 95, 34, 55, PALETTE.BLACK, PALETTE.DARKEST_GRAY, 4);

      // Weeping Saint Stone Statue on ornate plinth
      drawPixelRect(ctx, PALETTE.BLACK, sx - 20, VIRTUAL_HEIGHT - 65, 14, 25); // Plinth
      drawPixelRect(ctx, PALETTE.BLACK, sx - 18, VIRTUAL_HEIGHT - 85, 10, 20); // Robed saint body
      drawPixelRect(ctx, PALETTE.BLACK, sx - 16, VIRTUAL_HEIGHT - 93, 6, 8); // Head
      drawPixelRect(ctx, PALETTE.BLACK, sx - 23, VIRTUAL_HEIGHT - 80, 20, 3); // Cross arms

      // Whispering Crypt Waterfall Cascade
      const waterStep = Math.floor(this.waterAnimTimer * 6) % 3;
      drawPixelRect(ctx, PALETTE.STEEL_BLUE, sx + 95, 85, 7, 65);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, sx + 96, 85 + waterStep * 16, 5, 12);
      drawPixelRect(ctx, PALETTE.ICE_WHITE, sx + 97, 85 + waterStep * 16 + 2, 3, 6);
    }
  }

  // ================= AREA 3: THE MOONLIT LAKE (SORROW'S MERE) =================
  private renderLakeBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Deep Midnight Indigo Cosmos
    drawDitheredSky(ctx, PALETTE.BLACK, PALETTE.MIDNIGHT_BLUE, 0, 0, VIRTUAL_WIDTH, 55, 14);
    drawDitheredSky(ctx, PALETTE.MIDNIGHT_BLUE, PALETTE.DARK_NAVY, 0, 55, VIRTUAL_WIDTH, 55, 14);

    // 2. Cold Pale Starlight Twinkles
    for (let s = 0; s < 32; s++) {
      const starX = Math.floor((s * 37 - camX * 0.01 + VIRTUAL_WIDTH * 2) % VIRTUAL_WIDTH);
      const starY = Math.floor((s * 21) % 90);
      const twinkle = Math.floor(this.birdTimer * 3 + s) % 2 === 0;
      if (twinkle) {
        drawPixelRect(ctx, PALETTE.ICE_WHITE, starX, starY, 1, 1);
      }
    }

    // 3. Colossal Pale Moon with Dithered Lunar Craters
    const moonX = Math.floor(VIRTUAL_WIDTH * 0.48 - (camX * 0.02));
    const moonY = Math.floor(42 - (camY * 0.02));
    // Moon disc
    drawPixelCircle(ctx, PALETTE.ICE_WHITE, moonX, moonY, 19);
    drawPixelCircle(ctx, PALETTE.WHITE, moonX, moonY, 12);
    // Dark lunar craters
    drawPixelRect(ctx, PALETTE.STEEL_BLUE, moonX - 8, moonY - 4, 5, 5);
    drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, moonX + 3, moonY + 3, 6, 4);
    drawPixelRect(ctx, PALETTE.STEEL_BLUE, moonX - 4, moonY + 8, 4, 4);

    // 4. Foreboding Moonlit Crags & Mausoleums on the Horizon (parallax 0.12)
    const cliffX = Math.floor(-(camX * 0.12)) % 220;
    for (let c = -220; c < VIRTUAL_WIDTH + 220; c += 150) {
      const cx = c + cliffX;
      drawPixelRect(ctx, PALETTE.BLACK, cx, 55, 50, VIRTUAL_HEIGHT);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 45, 75, 65, VIRTUAL_HEIGHT);
    }

    // 5. Vast Dark Water Horizon (at y = 120) with 16-Bit Hand-Crafted Shimmering Reflection
    const waterY = Math.floor(120 - camY * 0.08);
    draw16BitWaterReflection(
      ctx,
      0,
      waterY,
      VIRTUAL_WIDTH,
      VIRTUAL_HEIGHT - waterY,
      this.waterAnimTimer,
      PALETTE.ICE_WHITE,
      PALETTE.MIDNIGHT_BLUE
    );

    // 6. Drowned Gothic Cathedral Spire rising from the black mere (parallax 0.28)
    const towerX = Math.floor(220 - (camX * 0.28));
    drawGothicArch(ctx, towerX - 6, waterY - 50, 36, 52, PALETTE.BLACK, PALETTE.DARKEST_GRAY, 4);
    // Cross finial at top of drowned spire
    drawOrnateCross(ctx, towerX + 11, waterY - 65, 16, PALETTE.BLACK, PALETTE.MID_GRAY);
    // Dark water reflection of drowned cathedral
    drawPixelRect(ctx, PALETTE.BLACK, towerX - 6, waterY + 2, 36, 28);
  }

  // ================= AREA 4: THE FALLEN KINGDOM (CITADEL OF AETHELGARD) =================
  private renderCapitalBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Violent Gothic Storm Sky with Periodic Lightning Flash
    if (this.lightningFlash) {
      drawPixelRect(ctx, PALETTE.WHITE, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      return;
    }

    drawDitheredSky(ctx, PALETTE.BLACK, PALETTE.VOID_PURPLE, 0, 0, VIRTUAL_WIDTH, 60, 16);
    drawDitheredSky(ctx, PALETTE.VOID_PURPLE, PALETTE.DEEP_MAROON, 0, 60, VIRTUAL_WIDTH, 60, 16);
    drawDitheredSky(ctx, PALETTE.DEEP_MAROON, PALETTE.BURGUNDY, 0, 120, VIRTUAL_WIDTH, 60, 16);

    // 2. Churning Black Storm Clouds
    const cloudShift = Math.floor(this.cloudOffset * 0.5 - camX * 0.08) % (VIRTUAL_WIDTH + 100);
    for (let c = -100; c < VIRTUAL_WIDTH + 120; c += 90) {
      const cx = c + cloudShift;
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx, 14, 65, 22);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 18, 8, 42, 16);
    }

    // 3. Towering Gothic Cathedral Spires & Flying Buttresses (parallax 0.15)
    const spireX = Math.floor(-(camX * 0.15)) % 200;
    for (let s = -200; s < VIRTUAL_WIDTH + 200; s += 100) {
      const sx = s + spireX;
      // Tall pointed gothic spire
      for (let h = 0; h < 75; h += 3) {
        const sw = Math.floor(h * 0.5);
        drawPixelRect(ctx, PALETTE.DARKEST_GRAY, sx + 20 - Math.floor(sw / 2), 25 + h, sw, 3);
      }
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, sx + 5, 100, 32, VIRTUAL_HEIGHT - 100);
      // Flying buttress arch
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, sx - 16, 75, 22, 4);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, sx - 12, 65, 4, 35);
    }

    // 4. Burning Watchtowers & Flickering Blood Pyres (parallax 0.32)
    const ruinsX = Math.floor(-(camX * 0.32)) % 260;
    for (let r = -260; r < VIRTUAL_WIDTH + 260; r += 130) {
      const rx = r + ruinsX;
      drawPixelRect(ctx, PALETTE.BLACK, rx, 65, 36, VIRTUAL_HEIGHT);
      drawPixelRect(ctx, PALETTE.BLACK, rx + 36, 95, 42, 12);

      // Flickering funeral pyre flames on parapet
      const flameSway = Math.floor(Math.sin(this.birdTimer * 10 + rx) * 2);
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, rx + 10 + flameSway, 53, 11, 13);
      drawPixelRect(ctx, PALETTE.CRIMSON, rx + 11 + flameSway, 55, 9, 11);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, rx + 13 + flameSway, 58, 5, 6);
      drawPixelRect(ctx, PALETTE.GOLD, rx + 14 + flameSway, 60, 3, 3);
    }

    // 5. Torn Imperial Royal Banners with Sunburst Crest (parallax 0.55)
    const flagX = Math.floor(180 - (camX * 0.55));
    drawPixelRect(ctx, PALETTE.BLACK, flagX, 105, 3, 50); // Iron pike pole
    const wave = Math.floor(Math.sin(this.birdTimer * 8) * 4);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, flagX + 3, 110, 26 + wave, 14);
    drawPixelRect(ctx, PALETTE.BURGUNDY, flagX + 3, 124, 20 + wave, 10);
    drawPixelRect(ctx, PALETTE.BRASS, flagX + 8, 114, 6, 6); // Broken sun crest
  }

  // ================= AREA 5: THE CATHEDRAL OF SILENCE (NAVE OF THE BROKEN SAINTS) =================
  private renderCathedralBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. High Vaulted Ceiling Cavity (Black -> Void Purple -> Darkest Gray)
    drawDitheredSky(ctx, PALETTE.BLACK, PALETTE.VOID_PURPLE, 0, 0, VIRTUAL_WIDTH, 50, 16);
    drawDitheredSky(ctx, PALETTE.VOID_PURPLE, PALETTE.DARKEST_GRAY, 0, 50, VIRTUAL_WIDTH, 60, 16);
    drawDitheredSky(ctx, PALETTE.DARKEST_GRAY, PALETTE.DARK_GRAY, 0, 110, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - 110, 16);

    // 2. High Ribbed Vault Spires (overhead stone groin vaulting)
    const ribStep = 72;
    for (let x = -ribStep; x < VIRTUAL_WIDTH + ribStep * 2; x += ribStep) {
      const rx = Math.floor(x - (camX * 0.12) % ribStep);
      // Gothic pointed vault arches
      drawPixelRect(ctx, PALETTE.BONE_DEEP_SHADOW, rx, 0, 4, 38);
      drawPixelRect(ctx, PALETTE.BONE_SHADOW, rx + 1, 0, 2, 38);
      // Diagonal groin vault ribs meeting at keystone
      drawPixelRect(ctx, PALETTE.BONE_DEEP_SHADOW, rx - 32, 0, 36, 4);
      drawPixelRect(ctx, PALETTE.BONE_DEEP_SHADOW, rx + 4, 0, 36, 4);
      // Keystone pendant
      drawPixelRect(ctx, PALETTE.GOLD, rx - 1, 38, 6, 6);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx, 40, 4, 2);
    }

    // 3. Colossal Stained-Glass Rose Window on the Nave High Wall (parallax 0.08)
    const roseX = Math.floor(VIRTUAL_WIDTH * 0.5 - (camX * 0.08));
    const roseY = Math.floor(62 - (camY * 0.05));
    drawRoseWindow(ctx, roseX, roseY, 26, PALETTE.BLACK, PALETTE.CRIMSON, PALETTE.SUN_YELLOW);
    // Holy stained glass illumination beams casting down into the nave
    const rayPulse = Math.sin(this.birdTimer * 2) * 0.15;
    ctx.save();
    ctx.fillStyle = `rgba(220, 160, 60, ${0.12 + rayPulse})`;
    ctx.beginPath();
    ctx.moveTo(roseX - 18, roseY + 16);
    ctx.lineTo(roseX + 18, roseY + 16);
    ctx.lineTo(roseX + 90, VIRTUAL_HEIGHT);
    ctx.lineTo(roseX - 90, VIRTUAL_HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Triforium Clerestory Arcade (Two tiers of gothic lancet arches on rear wall, parallax 0.22)
    const arcadeStep = 64;
    const arcX = Math.floor(-(camX * 0.22)) % arcadeStep;
    for (let x = -arcadeStep; x < VIRTUAL_WIDTH + arcadeStep * 2; x += arcadeStep) {
      const ax = x + arcX;
      // Upper clerestory lancet pair
      drawGothicArch(ctx, ax, 70, 12, 34, PALETTE.BLACK, PALETTE.BONE_SHADOW, 2);
      drawGothicArch(ctx, ax + 16, 70, 12, 34, PALETTE.BLACK, PALETTE.BONE_SHADOW, 2);
      // Lower triforium gallery arch
      drawGothicArch(ctx, ax - 4, 110, 36, 42, PALETTE.BLACK, PALETTE.BONE_DEEP_SHADOW, 3);
    }

    // 5. Hanging Heavy Iron Chains & Chandelier Candelabras (parallax 0.35)
    for (let c = 0; c < 4; c++) {
      const chX = Math.floor((c * 110 - camX * 0.35 + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 80));
      // Iron chain link down from ceiling
      draw16BitChain(ctx, chX, 0, 72);
      // Chandelier hoop ring
      drawPixelRect(ctx, PALETTE.BLACK, chX - 16, 72, 35, 3);
      drawPixelRect(ctx, PALETTE.BRASS, chX - 15, 73, 33, 1);
      // Candles on hoop
      draw16BitCandleCluster(ctx, chX - 14, 72, this.birdTimer + c);
      draw16BitCandleCluster(ctx, chX + 6, 72, this.birdTimer + c + 1);
    }

    // 6. Colossal Ribbed Cathedral Piers (Columns) in Midground (parallax 0.48)
    const pillarStep = 150;
    const pilX = Math.floor(-(camX * 0.48)) % pillarStep;
    for (let p = -pillarStep; p < VIRTUAL_WIDTH + pillarStep; p += pillarStep) {
      const px = p + pilX;
      draw16BitPillar(ctx, px, 35, 18, VIRTUAL_HEIGHT - 35);
      // Weeping Saint Statue placed in niche on pillar base
      draw16BitStatue(ctx, px + 22, VIRTUAL_HEIGHT - 74, 56);
    }

    // 7. Broken Wooden Pews & Candlestand Shrines along Nave Floor (parallax 0.65)
    const pewStep = 70;
    const pewX = Math.floor(-(camX * 0.65)) % pewStep;
    for (let b = -pewStep; b < VIRTUAL_WIDTH + pewStep; b += pewStep) {
      const bx = b + pewX;
      // Carved dark oak pew
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, bx, VIRTUAL_HEIGHT - 38, 38, 16);
      drawPixelRect(ctx, PALETTE.RUST, bx + 2, VIRTUAL_HEIGHT - 36, 34, 3);
      drawPixelRect(ctx, PALETTE.BLACK, bx, VIRTUAL_HEIGHT - 44, 4, 22); // Pew bench side end
      // Beeswax candle cluster resting on floor
      if (b % (pewStep * 2) === 0) {
        draw16BitCandleCluster(ctx, bx + 42, VIRTUAL_HEIGHT - 24, this.birdTimer + b);
      }
    }
  }

  // ================= AREA 6: THE TOWER OF DAWN (SANCTUM OF THE FIRST DAWN) =================
  private renderTowerBackground(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
    // 1. Radiant Dawn Dithered Sky (Mourning Violet -> Deep Burgundy -> Sacred Amber -> Holy Dawn Gold)
    drawDitheredSky(ctx, PALETTE.VOID_PURPLE, PALETTE.BURGUNDY, 0, 0, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.BURGUNDY, PALETTE.AMBER_DARK, 0, 45, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.AMBER_DARK, PALETTE.BRASS, 0, 90, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.BRASS, PALETTE.SUN_YELLOW, 0, 135, VIRTUAL_WIDTH, 45, 14);

    // 2. Colossal Celestial Sun Rising at Apex
    const sunX = Math.floor(VIRTUAL_WIDTH * 0.65 - (camX * 0.02));
    const sunY = Math.floor(62 - (camY * 0.02));
    drawPixelCircle(ctx, PALETTE.WHITE, sunX, sunY, 24);
    drawPixelCircle(ctx, PALETTE.SUN_YELLOW, sunX, sunY, 16);
    drawPixelCircle(ctx, PALETTE.GOLD, sunX, sunY, 8);

    // Sacred Stepped God Rays
    for (let r = 0; r < 6; r++) {
      const rx = sunX + Math.floor(Math.cos(r * 1.05 + this.birdTimer * 0.1) * 65);
      const ry = sunY + Math.floor(Math.sin(r * 1.05 + this.birdTimer * 0.1) * 65);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx, ry, 6, 2);
    }

    // 3. Endless Sea of Brooding Clouds Rolling Below the Mountain Peaks
    const seaY = Math.floor(122 - camY * 0.05);
    for (let c = -60; c < VIRTUAL_WIDTH + 60; c += 30) {
      const cx = c + (Math.floor(this.cloudOffset * 0.2 - camX * 0.04) % 30);
      const bob = Math.floor(Math.sin(this.birdTimer + c) * 3);
      drawPixelCircle(ctx, PALETTE.PALE_STONE, cx, seaY + bob, 16);
      drawPixelCircle(ctx, PALETTE.BRASS, cx, seaY + 8 + bob, 14);
    }
    drawPixelRect(ctx, PALETTE.DEEP_BROWN, 0, seaY + 12, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - (seaY + 12));

    // 4. Floating Shattered Reliquary Monoliths (parallax 0.15)
    for (let i = 0; i < 4; i++) {
      const mx = Math.floor((i * 85 - camX * 0.15 + VIRTUAL_WIDTH * 2) % (VIRTUAL_WIDTH + 80));
      const my = Math.floor(58 + i * 18 + Math.sin(this.birdTimer + i) * 4);
      drawPixelCrystal(ctx, mx, my, 12, 18, PALETTE.BRASS, PALETTE.PALE_GOLD, PALETTE.RUST);
    }

    // 5. The Monumental Cathedral Spire of Dawn (parallax 0.28)
    const towerX = Math.floor(VIRTUAL_WIDTH * 0.42 - (camX * 0.28));
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, towerX, 0, 58, VIRTUAL_HEIGHT);
    drawPixelRect(ctx, PALETTE.DEEP_BROWN, towerX + 4, 0, 50, VIRTUAL_HEIGHT);
    // Soaring Pointed Stained Glass Lancet Windows with Rose Windows above
    drawRoseWindow(ctx, towerX + 20, 38, 7, PALETTE.BLACK, PALETTE.CRIMSON, PALETTE.SUN_YELLOW);
    drawRoseWindow(ctx, towerX + 38, 38, 7, PALETTE.BLACK, PALETTE.CRIMSON, PALETTE.SUN_YELLOW);
    drawGothicArch(ctx, towerX + 16, 50, 9, 28, PALETTE.BLACK, PALETTE.SUN_YELLOW, 2);
    drawGothicArch(ctx, towerX + 34, 50, 9, 28, PALETTE.BLACK, PALETTE.SUN_YELLOW, 2);
  }

  // ================= TITLE SCREEN VISTA (DRAMATIC GOTHIC PROMONTORY) =================
  public renderTitleScreenVista(ctx: CanvasRenderingContext2D, time: number) {
    // 1. Brooding Gothic Twilight Sky (Charcoal -> Void Purple -> Blood Maroon -> Burnt Amber)
    drawDitheredSky(ctx, PALETTE.BLACK, PALETTE.VOID_PURPLE, 0, 0, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.VOID_PURPLE, PALETTE.DEEP_MAROON, 0, 45, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.DEEP_MAROON, PALETTE.AMBER_DARK, 0, 90, VIRTUAL_WIDTH, 45, 14);
    drawDitheredSky(ctx, PALETTE.AMBER_DARK, PALETTE.BRASS, 0, 135, VIRTUAL_WIDTH, 45, 14);

    // 2. Giant Blood Sun descending behind jagged horizon
    const sunY = Math.floor(68 + Math.sin(time * 0.2) * 5);
    drawPixelCircle(ctx, PALETTE.CRIMSON, 225, sunY, 22);
    drawPixelCircle(ctx, PALETTE.AMBER, 225, sunY, 15);
    drawPixelCircle(ctx, PALETTE.SUN_YELLOW, 225, sunY, 8);

    // 3. Brooding clouds
    const cloudShift = Math.floor(time * 3) % (VIRTUAL_WIDTH + 80);
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, 40 + cloudShift, 25, 60, 8);
    drawPixelRect(ctx, PALETTE.VOID_PURPLE, 50 + cloudShift, 20, 40, 7);

    // 4. Distant jagged crag ridges
    for (let s = 0; s < 70; s += 4) {
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, 220 - s, 75 + s, s * 2, 4);
    }
    for (let s = 0; s < 55; s += 4) {
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, 130 - s, 90 + s, s * 2, 4);
    }

    // 5. Distant Ruined Gothic Cathedral on Horizon
    const castleX = 182;
    const castleY = 78;
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX, castleY + 12, 54, 45);
    // 3 Spired lancet towers
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 6, castleY - 2, 10, 18);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 22, castleY - 10, 10, 26);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, castleX + 38, castleY - 2, 10, 18);
    // Rose window glow
    drawRoseWindow(ctx, castleX + 27, castleY + 22, 6, PALETTE.BLACK, PALETTE.BURGUNDY, PALETTE.GOLD);

    // 6. Scattered Ravens flying across the dying sky
    const birdX = Math.floor((time * 10) % (VIRTUAL_WIDTH + 40)) - 20;
    drawPixelRect(ctx, PALETTE.BLACK, birdX, 33, 2, 1);
    drawPixelRect(ctx, PALETTE.BLACK, birdX + 7, 37, 2, 1);
    drawPixelRect(ctx, PALETTE.BLACK, birdX + 15, 32, 2, 1);

    // 7. Gothic Ruined Balustrade / Promontory (Foreground Left)
    drawPixelRect(ctx, PALETTE.BLACK, 0, 115, 96, 65);
    drawPixelRect(ctx, PALETTE.BLACK, 0, 125, 116, 55);
    drawPixelRect(ctx, PALETTE.BLACK, 0, 138, 140, 42);
    // Weathered flagstone ledge
    drawPixelRect(ctx, PALETTE.DARK_GRAY, 0, 115, 96, 2);
    // Carved stone gargoyle on promontory edge
    drawPixelRect(ctx, PALETTE.BLACK, 86, 105, 8, 12);
    drawPixelRect(ctx, PALETTE.BLACK, 83, 103, 5, 4);

    // 8. Sir Cael standing solitary in dark gothic fluted plate atop the promontory
    const knightX = 66;
    const knightY = 93;
    // Dark steel boots & fluted greaves
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, knightX + 2, knightY + 14, 3, 8);
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, knightX + 8, knightY + 14, 3, 8);
    drawPixelRect(ctx, PALETTE.MID_GRAY, knightX + 3, knightY + 14, 1, 6);
    drawPixelRect(ctx, PALETTE.MID_GRAY, knightX + 9, knightY + 14, 1, 6);

    // Fluted dark steel cuirass with golden sunburst pectoral
    drawPixelRect(ctx, PALETTE.DARK_GRAY, knightX + 2, knightY + 5, 9, 9);
    drawPixelRect(ctx, PALETTE.GOLD, knightX + 6, knightY + 7, 2, 3);
    drawPixelRect(ctx, PALETTE.GOLD, knightX + 5, knightY + 8, 4, 1);

    // Pointed Gothic Barbute Helmet with intense cold pale visor slit
    drawPixelRect(ctx, PALETTE.BLACK, knightX + 3, knightY - 2, 7, 7);
    drawPixelRect(ctx, PALETTE.DARK_GRAY, knightX + 4, knightY - 3, 3, 2); // Crest
    drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, knightX + 7, knightY + 1, 3, 1); // Piercing eye slit
    drawPixelRect(ctx, PALETTE.ICE_WHITE, knightX + 8, knightY + 1, 1, 1);

    // Tattered penance mantle fluttering in the mountain wind
    const capeFrame = Math.floor(time * 5) % 3;
    const capeW = capeFrame === 0 ? 7 : capeFrame === 1 ? 9 : 8;
    drawPixelRect(ctx, PALETTE.DEEP_MAROON, knightX - capeW, knightY + 5, capeW, 11);
    drawPixelRect(ctx, PALETTE.BURGUNDY, knightX - capeW + 1, knightY + 7, capeW - 2, 8);

    // Greatsword planted in stone beside him
    drawPixelRect(ctx, PALETTE.GOLD, knightX + 13, knightY + 1, 2, 2); // Pommel
    drawPixelRect(ctx, PALETTE.DEEP_BROWN, knightX + 13, knightY + 3, 2, 3); // Grip
    drawPixelRect(ctx, PALETTE.BRASS, knightX + 10, knightY + 6, 8, 2); // Crossguard
    drawPixelRect(ctx, PALETTE.PALE_STONE, knightX + 12, knightY + 8, 4, 16); // Blade
    drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, knightX + 13, knightY + 9, 2, 12); // Glowing fuller
  }
}

export const parallaxEngine = new ParallaxRenderer();
