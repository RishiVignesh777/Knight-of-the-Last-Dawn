import { PlayerStats, PlayerAction, Direction, Enemy, EnemyType, Projectile, Platform, Landmark, MemoryShard } from '../types';
import { PALETTE, drawPixelRect, drawPixelCrystal, drawGothicArch, drawOrnateCross, drawRoseWindow } from './pixelArtHelper';

export class SpriteRenderer {
  // ================= SIR CAEL (DARK GOTHIC KNIGHT) =================
  public renderPlayer(ctx: CanvasRenderingContext2D, p: PlayerStats, camX: number, camY: number, time: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    // Center-point scaling for horizontal sprite flipping
    ctx.translate(rx + Math.floor(p.width / 2), ry + Math.floor(p.height / 2));
    ctx.scale(p.facing === Direction.RIGHT ? 1 : -1, 1);

    // Hit flicker
    if (p.invincibleTimer > 0 && Math.floor(time * 30) % 2 === 0) {
      ctx.restore();
      return;
    }

    const halfW = -Math.floor(p.width / 2);
    const halfH = -Math.floor(p.height / 2);

    // Stepped discrete frame calculations
    const walkFrame = Math.floor(p.animTimer * 10) % 4;
    const idleFrame = Math.floor(time * 2) % 2;
    const climbFrame = Math.floor(p.animTimer * 8) % 2;

    // Body Y bob
    let bodyBob = 0;
    if (p.action === PlayerAction.IDLE) {
      bodyBob = idleFrame === 1 ? 1 : 0;
    } else if (p.action === PlayerAction.WALK || p.action === PlayerAction.RUN) {
      bodyBob = (walkFrame === 1 || walkFrame === 3) ? 1 : 0;
    }

    const bodyY = halfH + 7 + bodyBob;

    // --- 1. TATTERED PENITENT CLOAK (Deep dried burgundy / dark maroon with jagged fray) ---
    if (p.action !== PlayerAction.CLIMB && p.action !== PlayerAction.DEATH) {
      const capeFrame = Math.floor((time * 5) + (p.vx !== 0 ? walkFrame * 1.5 : 0)) % 3;
      const capeDark = PALETTE.DEEP_MAROON;
      const capeMid = PALETTE.BURGUNDY;
      const capeTrim = PALETTE.CRIMSON;

      if (p.action === PlayerAction.JUMP) {
        // Jumping mantle billowing backwards
        drawPixelRect(ctx, capeDark, halfW - 4, bodyY + 3, 4, 11);
        drawPixelRect(ctx, capeMid, halfW - 7, bodyY + 6, 4, 9);
        drawPixelRect(ctx, capeTrim, halfW - 9, bodyY + 11, 3, 4);
      } else if (p.action === PlayerAction.DASH) {
        // Dashing mantle streaming straight back
        drawPixelRect(ctx, capeDark, halfW - 10, bodyY + 2, 10, 5);
        drawPixelRect(ctx, capeMid, halfW - 14, bodyY + 3, 5, 4);
        drawPixelRect(ctx, capeTrim, halfW - 16, bodyY + 4, 3, 2);
      } else {
        // Stepped idle/walking mantle flutter
        if (capeFrame === 0) {
          drawPixelRect(ctx, capeDark, halfW + 1, bodyY + 2, 4, 11);
          drawPixelRect(ctx, capeMid, halfW - 3, bodyY + 4, 4, 9);
          drawPixelRect(ctx, capeTrim, halfW - 5, bodyY + 9, 3, 5);
          // Tattered fray notches
          drawPixelRect(ctx, PALETTE.BLACK, halfW - 4, bodyY + 13, 2, 2);
        } else if (capeFrame === 1) {
          drawPixelRect(ctx, capeDark, halfW + 1, bodyY + 2, 4, 12);
          drawPixelRect(ctx, capeMid, halfW - 4, bodyY + 5, 5, 9);
          drawPixelRect(ctx, capeTrim, halfW - 7, bodyY + 8, 4, 5);
          drawPixelRect(ctx, PALETTE.BLACK, halfW - 6, bodyY + 13, 2, 2);
        } else {
          drawPixelRect(ctx, capeDark, halfW + 1, bodyY + 2, 4, 10);
          drawPixelRect(ctx, capeMid, halfW - 3, bodyY + 3, 4, 9);
          drawPixelRect(ctx, capeTrim, halfW - 5, bodyY + 7, 3, 6);
          drawPixelRect(ctx, PALETTE.BLACK, halfW - 4, bodyY + 12, 2, 2);
        }
      }
    }

    // --- 2. LEGS & FLUTED GREAVES (Dark steel with brass trim) ---
    const steelDark = PALETTE.DARKEST_GRAY;
    const steelMid = PALETTE.DARK_GRAY;
    const steelLight = PALETTE.MID_GRAY;
    const brassTrim = PALETTE.BRASS;

    if (p.action === PlayerAction.CLIMB) {
      if (climbFrame === 0) {
        drawPixelRect(ctx, steelDark, halfW + 3, halfH + 16, 4, 7);
        drawPixelRect(ctx, steelMid, halfW + 11, halfH + 14, 4, 9);
      } else {
        drawPixelRect(ctx, steelMid, halfW + 3, halfH + 14, 4, 9);
        drawPixelRect(ctx, steelDark, halfW + 11, halfH + 16, 4, 7);
      }
    } else if (p.action === PlayerAction.WALK || p.action === PlayerAction.RUN) {
      if (walkFrame === 0) {
        drawPixelRect(ctx, steelMid, halfW + 8, halfH + 16, 4, 8);
        drawPixelRect(ctx, steelDark, halfW + 9, halfH + 22, 5, 2);
        drawPixelRect(ctx, steelDark, halfW + 2, halfH + 16, 4, 7);
        drawPixelRect(ctx, steelMid, halfW + 1, halfH + 21, 4, 2);
      } else if (walkFrame === 1) {
        drawPixelRect(ctx, steelMid, halfW + 5, halfH + 16, 4, 8);
        drawPixelRect(ctx, steelDark, halfW + 5, halfH + 22, 5, 2);
        drawPixelRect(ctx, steelDark, halfW + 8, halfH + 15, 3, 6);
      } else if (walkFrame === 2) {
        drawPixelRect(ctx, steelMid, halfW + 2, halfH + 16, 4, 8);
        drawPixelRect(ctx, steelDark, halfW + 1, halfH + 22, 5, 2);
        drawPixelRect(ctx, steelDark, halfW + 9, halfH + 16, 4, 7);
        drawPixelRect(ctx, steelMid, halfW + 9, halfH + 21, 4, 2);
      } else {
        drawPixelRect(ctx, steelMid, halfW + 6, halfH + 16, 4, 8);
        drawPixelRect(ctx, steelDark, halfW + 6, halfH + 22, 5, 2);
        drawPixelRect(ctx, steelDark, halfW + 4, halfH + 15, 3, 6);
      }
    } else if (p.action === PlayerAction.JUMP) {
      drawPixelRect(ctx, steelMid, halfW + 4, halfH + 15, 4, 6);
      drawPixelRect(ctx, steelDark, halfW + 3, halfH + 19, 5, 2);
      drawPixelRect(ctx, steelDark, halfW + 9, halfH + 14, 4, 5);
      drawPixelRect(ctx, steelMid, halfW + 9, halfH + 18, 5, 2);
    } else if (p.action === PlayerAction.DEATH) {
      // Penitent collapsed kneeling
      drawPixelRect(ctx, steelDark, halfW + 1, halfH + 18, 12, 5);
      drawPixelRect(ctx, steelMid, halfW + 10, halfH + 20, 5, 3);
    } else {
      // Standing idle
      drawPixelRect(ctx, steelDark, halfW + 4, halfH + 16 + bodyBob, 3, 8 - bodyBob);
      drawPixelRect(ctx, steelMid, halfW + 3, halfH + 22, 4, 2);
      drawPixelRect(ctx, steelMid, halfW + 9, halfH + 16 + bodyBob, 4, 8 - bodyBob);
      drawPixelRect(ctx, steelDark, halfW + 9, halfH + 22, 5, 2);
      // Knee cop brass trim
      drawPixelRect(ctx, brassTrim, halfW + 10, halfH + 18 + bodyBob, 2, 2);
    }

    // --- 3. FLUTED CUIRASS & RELIC PECTORAL ---
    if (p.action === PlayerAction.DEATH) {
      drawPixelRect(ctx, steelDark, halfW + 2, halfH + 12, 10, 8);
      drawPixelRect(ctx, steelMid, halfW + 4, halfH + 12, 7, 2);
    } else {
      // Dark fluted plate cuirass
      drawPixelRect(ctx, steelDark, halfW + 3, bodyY, 11, 10);
      drawPixelRect(ctx, steelMid, halfW + 4, bodyY + 1, 9, 3);
      drawPixelRect(ctx, steelLight, halfW + 5, bodyY + 3, 7, 1);
      drawPixelRect(ctx, steelDark, halfW + 4, bodyY + 5, 9, 1);

      // Holy Dawn Sunburst Cross embossed on Sir Cael's breastplate
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 8, bodyY + 2, 2, 4);
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 7, bodyY + 3, 4, 2);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 8, bodyY + 3, 2, 2);

      // Cingulum / Penitent rope belt with brass buckle
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 3, bodyY + 9, 11, 2);
      drawPixelRect(ctx, brassTrim, halfW + 7, bodyY + 9, 2, 2);
    }

    // --- 4. GOTHIC HELMET (Pointed crest, halo spikes, cold glowing visor slit) ---
    const helmY = p.action === PlayerAction.DEATH ? halfH + 6 : bodyY - 7;
    const helmX = halfW + (p.action === PlayerAction.DEATH ? 4 : 4);

    // Helmet dome & barbute neck guard
    drawPixelRect(ctx, PALETTE.BLACK, helmX, helmY, 9, 7);
    drawPixelRect(ctx, steelMid, helmX + 1, helmY, 7, 2);
    // Pointed Gothic crest ridge
    drawPixelRect(ctx, steelLight, helmX + 3, helmY - 2, 3, 3);
    drawPixelRect(ctx, brassTrim, helmX + 4, helmY - 3, 1, 2);

    // Piercing Visor (Cold pale moonlight & sacred dawn spark)
    if (p.action !== PlayerAction.DEATH) {
      drawPixelRect(ctx, PALETTE.STEEL_BLUE, helmX + 4, helmY + 3, 5, 1);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, helmX + 5, helmY + 3, 4, 1);
      drawPixelRect(ctx, PALETTE.ICE_WHITE, helmX + 6, helmY + 3, 2, 1);
    }

    // --- 5. ORNATE SACRED GREATSWORD & COMBAT MOTIONS ---
    const hiltColor = PALETTE.DEEP_BROWN;
    const guardColor = PALETTE.BRASS;
    const pommelColor = PALETTE.GOLD;
    const bladeSteel = PALETTE.PALE_STONE;
    const bladeFuller = PALETTE.CYAN_HIGHLIGHT;
    const bladeEdge = PALETTE.WHITE;

    if (p.action === PlayerAction.ATTACK_LIGHT) {
      const slashStep = Math.min(2, Math.floor(p.attackTimer / 0.08));

      if (slashStep === 0) {
        // Frame 0: High angled windup
        drawPixelRect(ctx, steelMid, halfW + 1, bodyY + 1, 3, 4);
        drawPixelRect(ctx, hiltColor, halfW - 1, bodyY - 1, 2, 3);
        drawPixelRect(ctx, guardColor, halfW - 4, bodyY - 2, 8, 2);
        drawPixelRect(ctx, pommelColor, halfW - 1, bodyY + 2, 2, 2);
        // Upward blade with glowing sacred rune line
        drawPixelRect(ctx, bladeSteel, halfW - 2, bodyY - 15, 4, 13);
        drawPixelRect(ctx, bladeFuller, halfW - 1, bodyY - 14, 2, 10);
        drawPixelRect(ctx, bladeEdge, halfW - 2, bodyY - 15, 1, 13);
      } else if (slashStep === 1) {
        // Frame 1: Full horizontal execution slash with arterial crimson & holy light arc
        drawPixelRect(ctx, steelMid, halfW + 11, bodyY + 3, 4, 3);
        drawPixelRect(ctx, hiltColor, halfW + 14, bodyY + 3, 3, 2);
        drawPixelRect(ctx, guardColor, halfW + 16, bodyY + 1, 2, 7);
        drawPixelRect(ctx, pommelColor, halfW + 13, bodyY + 3, 2, 2);
        // Extended blade
        drawPixelRect(ctx, bladeSteel, halfW + 18, bodyY + 2, 15, 3);
        drawPixelRect(ctx, bladeFuller, halfW + 18, bodyY + 3, 13, 1);
        drawPixelRect(ctx, bladeEdge, halfW + 18, bodyY + 2, 15, 1);

        // Gothic slash trail (crimson blood mist & cyan holy spark)
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 8, bodyY - 7, 5, 4);
        drawPixelRect(ctx, PALETTE.BRIGHT_RED, halfW + 12, bodyY - 4, 6, 4);
        drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 18, bodyY - 1, 7, 3);
        drawPixelRect(ctx, PALETTE.ICE_WHITE, halfW + 25, bodyY + 2, 7, 2);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 30, bodyY + 3, 4, 2);
      } else {
        // Frame 2: Recovery thrust
        drawPixelRect(ctx, steelMid, halfW + 10, bodyY + 4, 3, 3);
        drawPixelRect(ctx, bladeSteel, halfW + 13, bodyY + 5, 11, 2);
        drawPixelRect(ctx, bladeEdge, halfW + 13, bodyY + 5, 11, 1);
      }
    } else if (p.action === PlayerAction.ATTACK_HEAVY) {
      const heavyStep = Math.min(3, Math.floor(p.attackTimer / 0.11));

      if (heavyStep === 0) {
        // Frame 0: Two-handed overhead raise
        drawPixelRect(ctx, steelMid, halfW + 5, bodyY - 3, 4, 4);
        drawPixelRect(ctx, hiltColor, halfW + 6, bodyY - 6, 2, 4);
        drawPixelRect(ctx, guardColor, halfW + 2, bodyY - 7, 10, 2);
        drawPixelRect(ctx, bladeSteel, halfW + 5, bodyY - 24, 4, 17);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 6, bodyY - 23, 2, 15);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 6, bodyY - 20, 2, 4);
      } else if (heavyStep === 1) {
        // Frame 1: Mid cleave descent
        drawPixelRect(ctx, steelMid, halfW + 9, bodyY + 1, 4, 4);
        drawPixelRect(ctx, bladeSteel, halfW + 12, bodyY - 12, 11, 9);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 14, bodyY - 10, 8, 5);
        // Golden sacred halo burst
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 18, bodyY - 16, 5, 7);
        drawPixelRect(ctx, PALETTE.AMBER, halfW + 23, halfH, 5, 7);
      } else if (heavyStep === 2) {
        // Frame 2: Impact into stone! Greatsword buried with ground fissure
        drawPixelRect(ctx, steelMid, halfW + 10, bodyY + 6, 4, 4);
        drawPixelRect(ctx, guardColor, halfW + 10, halfH + 15, 8, 2);
        drawPixelRect(ctx, bladeSteel, halfW + 13, halfH + 17, 3, 7);
        // Sacred golden & arterial crimson ground fissure
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 17, halfH + 19, 7, 5);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 23, halfH + 20, 6, 4);
        drawPixelRect(ctx, PALETTE.AMBER, halfW + 29, halfH + 21, 5, 3);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 16, halfH + 22, 10, 2);
      } else {
        // Frame 3: Blade wrench recovery
        drawPixelRect(ctx, steelMid, halfW + 8, bodyY + 4, 4, 4);
        drawPixelRect(ctx, bladeSteel, halfW + 12, bodyY + 5, 9, 3);
      }
    } else if (p.action === PlayerAction.BLOCK) {
      // Gothic Cross Parry Stance: Sword held vertically like a holy cruciform barrier
      drawPixelRect(ctx, steelMid, halfW + 9, bodyY + 3, 3, 4);
      drawPixelRect(ctx, hiltColor, halfW + 11, bodyY + 5, 2, 3);
      drawPixelRect(ctx, guardColor, halfW + 7, bodyY + 3, 9, 2);
      drawPixelRect(ctx, bladeSteel, halfW + 10, bodyY - 10, 3, 13);
      drawPixelRect(ctx, bladeEdge, halfW + 11, bodyY - 10, 1, 13);

      // Reliquary shield spark (golden cruciform starburst)
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 10, bodyY - 3, 3, 3);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 11, bodyY - 6, 1, 9);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 7, bodyY - 2, 9, 1);
      drawPixelRect(ctx, PALETTE.WHITE, halfW + 11, bodyY - 2, 1, 1);
    } else if (p.action === PlayerAction.DASH) {
      // Dashing phantom lunge
      drawPixelRect(ctx, steelMid, halfW + 10, bodyY + 4, 4, 3);
      drawPixelRect(ctx, bladeSteel, halfW + 14, bodyY + 5, 13, 2);
      drawPixelRect(ctx, bladeFuller, halfW + 14, bodyY + 5, 10, 1);
    } else if (p.action === PlayerAction.DEATH) {
      // Penitent greatsword planted in the earth like a grave marker
      drawPixelRect(ctx, pommelColor, halfW + 13, halfH + 9, 2, 2);
      drawPixelRect(ctx, hiltColor, halfW + 13, halfH + 11, 2, 3);
      drawPixelRect(ctx, guardColor, halfW + 9, halfH + 14, 9, 2);
      drawPixelRect(ctx, bladeSteel, halfW + 12, halfH + 16, 3, 8);
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 13, halfH + 17, 1, 4);
    } else {
      // Idle / Running: Greatsword sheathed at hip
      drawPixelRect(ctx, steelMid, halfW + 2, bodyY + 3, 3, 4);
      drawPixelRect(ctx, pommelColor, halfW - 1, bodyY, 2, 2);
      drawPixelRect(ctx, hiltColor, halfW - 1, bodyY + 2, 2, 3);
      drawPixelRect(ctx, guardColor, halfW - 3, bodyY + 5, 6, 2);
      drawPixelRect(ctx, bladeSteel, halfW - 1, bodyY + 7, 3, 11);
      drawPixelRect(ctx, bladeEdge, halfW, bodyY + 7, 1, 11);
    }

    ctx.restore();
  }

  // ================= GROTESQUE GOTHIC ENEMIES =================
  public renderEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number, camY: number, time: number) {
    if (e.state === 'dead') return;

    const rx = Math.floor(e.x - camX);
    const ry = Math.floor(e.y - camY);

    ctx.save();
    ctx.translate(rx + Math.floor(e.width / 2), ry + Math.floor(e.height / 2));
    ctx.scale(e.facing === Direction.RIGHT ? 1 : -1, 1);

    const halfW = -Math.floor(e.width / 2);
    const halfH = -Math.floor(e.height / 2);

    // --- 1. CORRUPTED KNIGHT: ASHEN INQUISITOR / FALLEN TEMPLAR (18x24) ---
    if (e.type === EnemyType.CORRUPTED_KNIGHT) {
      const walkFrame = Math.floor(time * 6) % 2;
      const isAttacking = e.state === 'attack';

      // Heavy blackened greaves
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 4, halfH + 16, 3, walkFrame === 0 ? 8 : 6);
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 10, halfH + 16, 3, walkFrame === 1 ? 8 : 6);

      // Fluted blackened steel plate cuirass
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 3, halfH + 7, 11, 10);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 4, halfH + 8, 9, 2);

      // Tattered ecclesiastical vestment in deep dried burgundy
      drawPixelRect(ctx, PALETTE.BURGUNDY, halfW + 5, halfH + 10, 7, 6);
      // Inverted broken sunburst relic in tarnished brass
      drawPixelRect(ctx, PALETTE.AMBER_DARK, halfW + 7, halfH + 11, 3, 3);
      drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 8, halfH + 12, 1, 1);

      // Pointed inquisitor barbute helm
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 4, halfH, 9, 7);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 5, halfH + 1, 7, 2);
      // Sinister narrow crimson-violet eye slit
      drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 7, halfH + 3, 4, 1);
      drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 8, halfH + 3, 2, 1);

      // Serrated Ashen Flamberge / Executioner Blade
      if (isAttacking) {
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 13, halfH + 8, 12, 3);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 15, halfH + 7, 10, 1);
        drawPixelRect(ctx, PALETTE.ARTERIAL_RED, halfW + 17, halfH + 9, 4, 1);
      } else {
        drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 12, halfH + 2, 3, 15);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 13, halfH + 1, 1, 15);
        drawPixelRect(ctx, PALETTE.BRASS, halfW + 10, halfH + 13, 7, 2);
      }
    }
    // --- 2. SHADOW BEAST: GARGOYLE HOUND / GHOUL FIEND (22x14) ---
    else if (e.type === EnemyType.SHADOW_BEAST) {
      const prowlFrame = Math.floor(time * 8) % 2;

      // Sinewy petrified stone flesh body
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 3, halfH + 3, 16, 7);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 5, halfH + 4, 12, 5);

      // Jagged gargoyle spine ridges & shoulder spires
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 6, halfH + 1, 3, 3);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 11, halfH + 1, 3, 3);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 7, halfH, 1, 2);

      // Grotesque skull with fanged maw and glowing hollow eye
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 16, halfH + 2, 6, 6);
      drawPixelRect(ctx, PALETTE.WHITE, halfW + 20, halfH + 6, 2, 2); // Fangs
      drawPixelRect(ctx, PALETTE.AMBER, halfW + 18, halfH + 3, 2, 2); // Eye

      // 4 Prowling stone taloned legs
      if (prowlFrame === 0) {
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 4, halfH + 10, 3, 4);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 14, halfH + 10, 3, 4);
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 3, halfH + 13, 2, 1);
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 13, halfH + 13, 2, 1);
      } else {
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 2, halfH + 9, 3, 5);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 16, halfH + 9, 3, 5);
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 1, halfH + 13, 2, 1);
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 15, halfH + 13, 2, 1);
      }
    }
    // --- 3. FOREST WRAITH: SHROUDED WEEPING NUN / BELL WRAITH (18x24) ---
    else if (e.type === EnemyType.FOREST_WRAITH) {
      const hoverBob = Math.floor(time * 4) % 2;
      const tatterFrame = Math.floor(time * 6) % 3;

      // Heavy mourning veil & funeral shroud in void violet and deep burgundy
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 3, halfH + 2 + hoverBob, 12, 14);
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW + 4, halfH + 4 + hoverBob, 10, 11);

      // Sunken hood cavity with veil lace
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 5, halfH + 3 + hoverBob, 8, 6);
      // Twin weeping spectral eyes (pale eerie crypt green)
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, halfW + 7, halfH + 5 + hoverBob, 2, 2);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, halfW + 10, halfH + 5 + hoverBob, 2, 2);

      // Tattered funeral shroud hems
      if (tatterFrame === 0) {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 4, halfH + 16 + hoverBob, 3, 5);
        drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW + 9, halfH + 16 + hoverBob, 4, 7);
      } else if (tatterFrame === 1) {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 5, halfH + 16 + hoverBob, 4, 6);
        drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW + 11, halfH + 16 + hoverBob, 3, 5);
      } else {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 3, halfH + 16 + hoverBob, 4, 7);
        drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW + 8, halfH + 16 + hoverBob, 4, 5);
      }

      // Ornate Brass Censer hanging from iron chain, emitting eerie crypt flame
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 16, halfH + 6 + hoverBob, 1, 5); // Chain
      drawPixelRect(ctx, PALETTE.BRASS, halfW + 15, halfH + 11 + hoverBob, 4, 4); // Censer body
      // Spectral soul-flame crystal rising from censer
      drawPixelCrystal(ctx, halfW + 17, halfH + 9 + hoverBob, 5, 6, PALETTE.BRIGHT_GREEN, PALETTE.MINT_GREEN, PALETTE.DARK_PINE);
    }
    // --- 4. HOLLOW ARCHER: PENITENT CROSSBOWMAN (16x24) ---
    else if (e.type === EnemyType.HOLLOW_ARCHER) {
      // Weathered bone ribcage wrapped in prayer ropes
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 4, halfH + 7, 8, 9);
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 4, halfH + 10, 8, 2); // Ropes

      // Skeletal skull in weathered penitent hood
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 4, halfH, 9, 8);
      drawPixelRect(ctx, PALETTE.PALE_STONE, halfW + 6, halfH + 2, 6, 5);
      // Single burning hollow eye socket
      drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 8, halfH + 3, 2, 2);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, halfW + 9, halfH + 3, 1, 1);

      // Skeletal legs
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 5, halfH + 16, 2, 8);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 9, halfH + 16, 2, 8);

      // Heavy Gothic Iron Arbalest / Crossbow
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 11, halfH + 8, 8, 3); // Stock
      drawPixelRect(ctx, PALETTE.BRASS, halfW + 16, halfH + 2, 2, 15); // Iron prod / bow limb
      drawPixelRect(ctx, PALETTE.PALE_STONE, halfW + 8, halfH + 7, 7, 1); // Loaded bolt
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, halfW + 15, halfH + 6, 2, 3); // Blood-dipped tip
    }
    // --- 5. ANCIENT GUARDIAN: CATACOMB RELIQUARY SENTRY (32x40) ---
    else if (e.type === EnemyType.ANCIENT_GUARDIAN) {
      const stepFrame = Math.floor(time * 3) % 2;

      // Heavy carved stone sarcophagus pillars (legs)
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 5, halfH + 26, 8, stepFrame === 0 ? 14 : 12);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 19, halfH + 26, 8, stepFrame === 1 ? 14 : 12);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 6, halfH + 27, 6, 2);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 20, halfH + 27, 6, 2);

      // Colossal basalt cathedral torso with carved gothic niches
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 3, halfH + 10, 26, 17);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 5, halfH + 11, 22, 3);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 4, halfH + 14, 2, 12);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 26, halfH + 14, 2, 12);

      // Carved holy relic niches with glowing cyan scripture
      drawPixelRect(ctx, PALETTE.STEEL_BLUE, halfW + 8, halfH + 16, 16, 2);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 15, halfH + 13, 2, 8);
      drawPixelRect(ctx, PALETTE.ICE_WHITE, halfW + 15, halfH + 16, 2, 2);

      // Weeping Sarcophagus Knight Visage
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 9, halfH + 2, 14, 9);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 10, halfH + 3, 12, 7);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 12, halfH + 5, 8, 2);

      // Colossal Gothic Tombstone Pillar Hammer (weathered stone with carved cross)
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 28, halfH + 4, 5, 34);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 24, halfH + 1, 14, 11);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 25, halfH + 2, 12, 2);
      // Embossed cross on tombstone head
      drawPixelRect(ctx, PALETTE.PALE_STONE, halfW + 30, halfH + 4, 2, 6);
      drawPixelRect(ctx, PALETTE.PALE_STONE, halfW + 28, halfH + 6, 6, 2);
    }
    // --- 6. FINAL BOSS: THE DYING KING (44x54) ---
    else if (e.type === EnemyType.DYING_KING) {
      const phase = e.bossPhase || 1;
      const kingBob = Math.floor(time * 3) % 2;

      if (phase === 3) {
        // PHASE 3: THE SHADOW FIEND / VOID MONSTROSITY
        // Jagged membranous demonic wings of pure shadow
        const wingColor = PALETTE.BLACK;
        const wingDetail = PALETTE.VOID_PURPLE;

        // Left wing
        drawPixelRect(ctx, wingColor, halfW - 24, halfH - 12, 26, 7);
        drawPixelRect(ctx, wingColor, halfW - 20, halfH - 5, 22, 15);
        drawPixelRect(ctx, wingDetail, halfW - 14, halfH + 10, 16, 11);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW - 18, halfH - 2, 2, 10);

        // Right wing
        drawPixelRect(ctx, wingColor, halfW + 38, halfH - 12, 26, 7);
        drawPixelRect(ctx, wingColor, halfW + 38, halfH - 5, 22, 15);
        drawPixelRect(ctx, wingDetail, halfW + 38, halfH + 10, 16, 11);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 48, halfH - 2, 2, 10);

        // Obsidian demonic torso
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 8, halfH + 8, 26, 42);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 10, halfH + 12, 22, 30);

        // Sprawling Horned Crown of Thorns
        drawPixelRect(ctx, PALETTE.DARK_VIOLET, halfW + 11, halfH - 2, 20, 12);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 7, halfH - 16, 6, 16);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 29, halfH - 16, 6, 16);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 8, halfH - 14, 2, 10);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 32, halfH - 14, 2, 10);

        // Triple weeping crimson eyes
        drawPixelRect(ctx, PALETTE.ARTERIAL_RED, halfW + 14, halfH + 2, 3, 2);
        drawPixelRect(ctx, PALETTE.ARTERIAL_RED, halfW + 25, halfH + 2, 3, 2);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 19, halfH - 1, 4, 2);

        // Pulsing Void Core (Corrupted Heart of Dawn)
        const corePulse = Math.floor(time * 6) % 3;
        const coreColor = corePulse === 0 ? PALETTE.MAGENTA : corePulse === 1 ? PALETTE.PURPLE : PALETTE.ARTERIAL_RED;
        drawPixelRect(ctx, coreColor, halfW + 17, halfH + 22, 8, 8);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 19, halfH + 24, 4, 4);

        // Colossal Jagged Shadow Scythe Claw
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 34, halfH + 8, 6, 40);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 28, halfH + 4, 18, 6);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 36, halfH - 1, 8, 5);
      } else {
        // PHASE 1 & 2: THE FRACTURED SOVEREIGN (Ceremonial plate fused with weeping corruption)
        // Colossal Royal Mantle in dark blood burgundy
        drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW - 7, halfH + 10, 11, 40);
        drawPixelRect(ctx, PALETTE.BURGUNDY, halfW - 5, halfH + 14, 7, 34);
        drawPixelRect(ctx, PALETTE.BRASS, halfW - 6, halfH + 42, 8, 2); // Gold hem

        // Heavy Fluted Royal Greaves
        drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 8, halfH + 38, 9, 14);
        drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 24, halfH + 38, 9, 14);
        drawPixelRect(ctx, PALETTE.BRASS, halfW + 10, halfH + 44, 5, 2);
        drawPixelRect(ctx, PALETTE.BRASS, halfW + 26, halfH + 44, 5, 2);

        // Golden Reliquary Cuirass with bleeding corruption veins
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 6, halfH + 12 + kingBob, 29, 27);
        drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 8, halfH + 13 + kingBob, 25, 3);
        // Corruption cracks bleeding through the royal plate
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 12, halfH + 17 + kingBob, 5, 18);
        drawPixelRect(ctx, PALETTE.CRIMSON, halfW + 21, halfH + 23 + kingBob, 9, 4);

        // The Corrupted Heart of Dawn embedded in chest (reliquary crystal)
        const heartPulse = Math.floor(time * 5) % 2;
        drawPixelRect(ctx, heartPulse === 0 ? PALETTE.ARTERIAL_RED : PALETTE.BURGUNDY, halfW + 18, halfH + 20 + kingBob, 6, 6);
        drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 19, halfH + 21 + kingBob, 4, 4);

        // Spired Imperial Crown & Shadow Visor
        drawPixelRect(ctx, PALETTE.BRASS, halfW + 10, halfH + 2 + kingBob, 21, 11);
        // Pointed Gothic crown spires
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 10, halfH - 5 + kingBob, 4, 8);
        drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 19, halfH - 8 + kingBob, 4, 11);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 27, halfH - 5 + kingBob, 4, 8);

        // Visor cavity with weeping pale gold light
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 13, halfH + 7 + kingBob, 15, 4);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 15, halfH + 8 + kingBob, 4, 2);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 23, halfH + 8 + kingBob, 4, 2);

        // Colossal Royal Sun Cleaver (Greatsword)
        drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 36, halfH + 8 + kingBob, 6, 8);
        drawPixelRect(ctx, PALETTE.BRASS, halfW + 32, halfH + 14 + kingBob, 14, 4);
        drawPixelRect(ctx, PALETTE.PALE_STONE, halfW + 37, halfH - 26 + kingBob, 5, 72);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 38, halfH - 24 + kingBob, 3, 68);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 39, halfH - 24 + kingBob, 1, 68);
      }
    }

    // Health bar above enemy
    if (e.hp < e.maxHp && !e.isBoss) {
      const barW = Math.max(16, e.width + 4);
      const barX = halfW - 2;
      const barY = halfH - 8;
      drawPixelRect(ctx, PALETTE.BLACK, barX, barY, barW, 4);
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, barX + 1, barY + 1, barW - 2, 2);
      const fillW = Math.max(0, Math.floor((barW - 2) * (e.hp / e.maxHp)));
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, barX + 1, barY + 1, fillW, 2);
    }

    ctx.restore();
  }

  // ================= GOTHIC PROJECTILES =================
  public renderProjectile(ctx: CanvasRenderingContext2D, p: Projectile, camX: number, camY: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    if (p.type === 'arrow') {
      // Gothic iron crossbow bolt with blood-dipped quarrel head
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx - 6, ry - 1, 12, 2);
      drawPixelRect(ctx, PALETTE.PALE_STONE, rx + 4, ry - 2, 3, 4);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, rx + 6, ry - 1, 2, 2);
      drawPixelRect(ctx, PALETTE.BURGUNDY, rx - 7, ry - 2, 3, 4);
    } else if (p.type === 'dark_orb') {
      // Eerie crypt soul-fire orb (spectral green & void purple)
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, rx - 4, ry - 4, 8, 8);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, rx - 3, ry - 3, 6, 6);
      drawPixelRect(ctx, PALETTE.MINT_GREEN, rx - 1, ry - 1, 2, 2);
    } else if (p.type === 'shockwave') {
      // Holy reliquary dawn shockwave pillar
      drawPixelRect(ctx, PALETTE.AMBER_DARK, rx - 6, ry - 10, 12, 20);
      drawPixelRect(ctx, PALETTE.GOLD, rx - 4, ry - 9, 8, 18);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx - 2, ry - 8, 4, 16);
      drawPixelRect(ctx, PALETTE.WHITE, rx - 1, ry - 6, 2, 12);
    }
    ctx.restore();
  }

  // ================= GOTHIC TILES & ARCHITECTURE PLATFORMS =================
  public renderPlatform(ctx: CanvasRenderingContext2D, plat: Platform, camX: number, camY: number) {
    const rx = Math.floor(plat.x - camX);
    const ry = Math.floor(plat.y - camY);
    const w = Math.floor(plat.width);
    const h = Math.floor(plat.height);

    ctx.save();

    if (plat.type === 'ladder') {
      // Wrought Iron Gothic Ladder with arched rungs
      drawPixelRect(ctx, PALETTE.BLACK, rx, ry, 3, h);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + 1, ry, 1, h);
      drawPixelRect(ctx, PALETTE.BLACK, rx + w - 3, ry, 3, h);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + w - 2, ry, 1, h);
      for (let y = 2; y < h; y += 8) {
        drawPixelRect(ctx, PALETTE.MID_GRAY, rx + 3, ry + y, w - 6, 2);
        drawPixelRect(ctx, PALETTE.LIGHT_GRAY, rx + 3, ry + y, w - 6, 1);
      }
      ctx.restore();
      return;
    }

    if (plat.type === 'hazard') {
      if (plat.theme === 'fire') {
        // Burning funeral pyre / witch-fire hazard
        for (let x = 0; x < w; x += 6) {
          drawPixelRect(ctx, PALETTE.DEEP_MAROON, rx + x, ry, 6, h);
          drawPixelRect(ctx, PALETTE.CRIMSON, rx + x + 1, ry + 1, 4, h - 2);
          drawPixelRect(ctx, PALETTE.ARTERIAL_RED, rx + x + 1, ry + 3, 4, h - 4);
          drawPixelRect(ctx, PALETTE.GOLD, rx + x + 2, ry + 4, 2, h - 5);
        }
      } else {
        // Sharp blackened iron spikes
        for (let x = 0; x < w; x += 8) {
          drawPixelRect(ctx, PALETTE.BLACK, rx + x + 1, ry + 6, 6, h - 6);
          drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x + 2, ry + 3, 4, 4);
          drawPixelRect(ctx, PALETTE.LIGHT_GRAY, rx + x + 3, ry, 2, 4);
          drawPixelRect(ctx, PALETTE.WHITE, rx + x + 3, ry, 1, 2);
        }
      }
      ctx.restore();
      return;
    }

    // Weathered Gothic Stone Platforms & Masonry
    if (plat.theme === 'village_ground') {
      // Weathered cemetery flagstones & dark earth
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx, ry, w, 2);
      for (let x = 4; x < w - 8; x += 16) {
        drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x, ry + 4, 8, 4);
        drawPixelRect(ctx, PALETTE.PALE_STONE, rx + x + 1, ry + 4, 6, 1);
      }
    } else if (plat.theme === 'moss_ground' || plat.theme === 'branch') {
      // Mossy crypt masonry / overgrown stone arches
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.DARK_PINE, rx, ry, w, 2);
      drawPixelRect(ctx, PALETTE.MOSS_GREEN, rx, ry + 2, w, 2);
      for (let x = 6; x < w - 6; x += 18) {
        drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x, ry + 4, 6, 4);
      }
    } else if (plat.theme === 'cliff') {
      // Blackened slate crags
      drawPixelRect(ctx, PALETTE.BLACK, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.DARK_NAVY, rx, ry, w, 2);
      drawPixelRect(ctx, PALETTE.STEEL_BLUE, rx, ry, w, 1);
    } else if (plat.theme === 'capital_paving' || plat.theme === 'marble') {
      // Polished dark cathedral paving with brass inlays
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx, ry, w, 2);
      for (let x = 8; x < w - 8; x += 20) {
        drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x, ry + 3, 12, 3);
        drawPixelRect(ctx, PALETTE.BRASS, rx + x + 2, ry + 4, 8, 1);
      }
    } else if (plat.theme === 'crystal_gold' || plat.theme === 'celestial_stone' || plat.theme === 'apex_dais') {
      // Sanctum Reliquary Dais (Aged brass, golden filigree, pale marble)
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.BRASS, rx, ry, w, 3);
      drawPixelRect(ctx, PALETTE.PALE_GOLD, rx, ry, w, 1);
      for (let x = 6; x < w - 6; x += 16) {
        drawPixelRect(ctx, PALETTE.GOLD, rx + x, ry + 4, 4, 4);
      }
    } else {
      // Generic gothic ashlar stone
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx, ry, w, 2);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, rx, ry, w, 1);
    }

    ctx.restore();
  }

  // ================= ORNATE GOTHIC SHRINES & LANDMARKS =================
  public renderLandmark(ctx: CanvasRenderingContext2D, lm: Landmark, camX: number, camY: number, time: number) {
    const rx = Math.floor(lm.x - camX);
    const ry = Math.floor(lm.y - camY);

    ctx.save();
    if (lm.type === 'shrine') {
      // Ornate Gothic Reliquary Altar:
      // Carved stone pedestal, stone crucifix, melted beeswax candles, and holy brass brazier
      drawPixelRect(ctx, PALETTE.BLACK, rx + 2, ry + 16, 28, 16);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx, ry + 12, 32, 4);
      drawPixelRect(ctx, PALETTE.BRASS, rx + 4, ry + 10, 24, 2);

      // Stone crucifix at center back
      drawOrnateCross(ctx, rx + 14, ry - 6, 18, PALETTE.MID_GRAY, PALETTE.LIGHT_GRAY);

      // Tall melted wax candles on flanks
      drawPixelRect(ctx, PALETTE.PALE_STONE, rx + 4, ry + 2, 2, 8);
      drawPixelRect(ctx, PALETTE.PALE_STONE, rx + 26, ry + 4, 2, 6);
      // Candle flames
      const cFlicker = Math.floor(time * 8) % 2;
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 4, ry + (cFlicker === 0 ? 0 : 1), 2, 2);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 26, ry + (cFlicker === 0 ? 3 : 2), 2, 2);

      // Sacred Dawn Brazier Flame (animated 3 frames)
      const flameFrame = Math.floor(time * 6) % 3;
      const flameH = flameFrame === 0 ? 10 : flameFrame === 1 ? 13 : 9;
      drawPixelRect(ctx, PALETTE.BURGUNDY, rx + 10, ry + 9 - flameH, 12, flameH);
      drawPixelRect(ctx, PALETTE.GOLD, rx + 12, ry + 10 - flameH, 8, flameH - 2);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 14, ry + 11 - flameH, 4, flameH - 4);
      drawPixelRect(ctx, PALETTE.WHITE, rx + 15, ry + 12 - flameH, 2, flameH - 6);
    } else if (lm.type === 'mural') {
      // Ornate Gothic Stone Reredos / Mural with pointed arch & scripture
      drawGothicArch(ctx, rx, ry, lm.width, lm.height, PALETTE.DARKEST_GRAY, PALETTE.BLACK, 4);
      // Carved stone interior with glowing reliquary runes
      for (let y = 10; y < lm.height - 8; y += 6) {
        drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, rx + 8, ry + y, lm.width - 16, 2);
        drawPixelRect(ctx, PALETTE.ICE_WHITE, rx + 12, ry + y, lm.width - 24, 1);
      }
      // Top small rose window
      drawRoseWindow(ctx, rx + Math.floor(lm.width / 2), ry + 14, 6, PALETTE.DARKEST_GRAY, PALETTE.BURGUNDY, PALETTE.GOLD);
    } else if (lm.type === 'door') {
      // Monumental Pointed Gothic Archway with wrought iron portcullis and celestial mist
      drawGothicArch(ctx, rx, ry, lm.width, lm.height, PALETTE.BRASS, PALETTE.BLACK, 5);
      // Wrought iron portcullis bars
      for (let x = rx + 6; x < rx + lm.width - 6; x += 6) {
        drawPixelRect(ctx, PALETTE.DARKEST_GRAY, x, ry + 8, 2, lm.height - 8);
      }
      // Portal interior cycling celestial dawn light
      const pColor = Math.floor(time * 4) % 2 === 0 ? PALETTE.GOLD : PALETTE.SUN_YELLOW;
      drawPixelRect(ctx, pColor, rx + 6, ry + Math.floor(lm.height * 0.4), lm.width - 12, lm.height - Math.floor(lm.height * 0.4));
    }
    ctx.restore();
  }

  // ================= SACRED MEMORY SHARD (GOTHIC RELIQUARY) =================
  public renderMemoryShard(ctx: CanvasRenderingContext2D, shard: MemoryShard, camX: number, camY: number, time: number) {
    const rx = Math.floor(shard.x - camX);
    const bob = Math.floor(Math.sin(time * 3) * 3);
    const ry = Math.floor(shard.y - camY + bob);

    ctx.save();
    // Sacred reliquary halo ring behind shard
    const haloFrame = Math.floor(time * 4) % 2;
    drawPixelRect(ctx, PALETTE.GOLD, rx + 4, ry + 4, 20, 20);
    drawPixelRect(ctx, PALETTE.BLACK, rx + 6, ry + 6, 16, 16);

    // Glowing holy diamond reliquary crystal
    drawPixelCrystal(ctx, rx + 14, ry + 14, 12, 16, PALETTE.CYAN_HIGHLIGHT, PALETTE.ICE_WHITE, PALETTE.STEEL_BLUE);

    // 4 cruciform holy embers rotating around the shard
    const sFrame = Math.floor(time * 4) % 4;
    const offsets = [
      [-6, 0],
      [0, -6],
      [6, 0],
      [0, 6]
    ];
    const [sx, sy] = offsets[sFrame];
    drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 14 + sx, ry + 14 + sy, 2, 2);
    drawPixelRect(ctx, PALETTE.PALE_GOLD, rx + 14 - sx, ry + 14 - sy, 2, 2);

    ctx.restore();
  }
}

export const spriteRenderer = new SpriteRenderer();

