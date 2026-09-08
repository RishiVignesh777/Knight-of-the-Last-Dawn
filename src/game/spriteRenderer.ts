import { PlayerStats, PlayerAction, Direction, Enemy, EnemyType, Projectile, Platform, Landmark, MemoryShard } from '../types';
import { PALETTE, drawPixelRect, drawPixelCrystal } from './pixelArtHelper';

export class SpriteRenderer {
  // ================= SIR CAEL (8-BIT PLAYER SPRITE) =================
  public renderPlayer(ctx: CanvasRenderingContext2D, p: PlayerStats, camX: number, camY: number, time: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    // Center-point scaling for horizontal sprite flipping
    ctx.translate(rx + Math.floor(p.width / 2), ry + Math.floor(p.height / 2));
    ctx.scale(p.facing === Direction.RIGHT ? 1 : -1, 1);

    // Authentic 8-bit hit flicker (alternating on/off every frame)
    if (p.invincibleTimer > 0 && Math.floor(time * 30) % 2 === 0) {
      ctx.restore();
      return;
    }

    const halfW = -Math.floor(p.width / 2);
    const halfH = -Math.floor(p.height / 2);

    // 8-bit frame calculations (discrete frames, no smooth floating point animation)
    const walkFrame = Math.floor(p.animTimer * 10) % 4;
    const idleFrame = Math.floor(time * 2) % 2; // 2-frame subtle idle breath
    const climbFrame = Math.floor(p.animTimer * 8) % 2;

    // Body Y bob (stepped integer pixels)
    let bodyBob = 0;
    if (p.action === PlayerAction.IDLE) {
      bodyBob = idleFrame === 1 ? 1 : 0;
    } else if (p.action === PlayerAction.WALK || p.action === PlayerAction.RUN) {
      bodyBob = (walkFrame === 1 || walkFrame === 3) ? 1 : 0;
    }

    const bodyY = halfH + 7 + bodyBob;

    // --- 1. CAPE (Discrete 8-bit blocky frames behind knight) ---
    if (p.action !== PlayerAction.CLIMB && p.action !== PlayerAction.DEATH) {
      const capeFrame = Math.floor((time * 4) + (p.vx !== 0 ? walkFrame : 0)) % 3;
      const capeColorDark = PALETTE.DEEP_MAROON;
      const capeColorMain = PALETTE.CRIMSON;

      if (p.action === PlayerAction.JUMP) {
        // Jumping cape streaming down/back
        drawPixelRect(ctx, capeColorDark, halfW - 3, bodyY + 4, 3, 10);
        drawPixelRect(ctx, capeColorMain, halfW - 5, bodyY + 7, 2, 8);
      } else if (p.action === PlayerAction.DASH) {
        // Dashing cape horizontal
        drawPixelRect(ctx, capeColorDark, halfW - 8, bodyY + 3, 8, 4);
        drawPixelRect(ctx, capeColorMain, halfW - 12, bodyY + 4, 4, 2);
      } else {
        // Standard flutter (3 discrete frames)
        if (capeFrame === 0) {
          drawPixelRect(ctx, capeColorDark, halfW + 1, bodyY + 3, 3, 10);
          drawPixelRect(ctx, capeColorMain, halfW - 2, bodyY + 5, 3, 8);
          drawPixelRect(ctx, capeColorMain, halfW - 4, bodyY + 9, 2, 5);
        } else if (capeFrame === 1) {
          drawPixelRect(ctx, capeColorDark, halfW + 1, bodyY + 3, 3, 11);
          drawPixelRect(ctx, capeColorMain, halfW - 3, bodyY + 6, 4, 8);
          drawPixelRect(ctx, capeColorMain, halfW - 6, bodyY + 8, 3, 4);
        } else {
          drawPixelRect(ctx, capeColorDark, halfW + 1, bodyY + 3, 3, 9);
          drawPixelRect(ctx, capeColorMain, halfW - 2, bodyY + 4, 3, 8);
          drawPixelRect(ctx, capeColorMain, halfW - 3, bodyY + 7, 2, 6);
        }
      }
    }

    // --- 2. LEGS & GREAVES (Stepped pixel frames) ---
    const legDark = PALETTE.DARK_GRAY;
    const legLight = PALETTE.MID_GRAY;
    const bootColor = PALETTE.DARKEST_GRAY;

    if (p.action === PlayerAction.CLIMB) {
      // Climbing ladder: alternating limbs
      if (climbFrame === 0) {
        drawPixelRect(ctx, legDark, halfW + 3, halfH + 16, 4, 7);
        drawPixelRect(ctx, legLight, halfW + 11, halfH + 14, 4, 9);
      } else {
        drawPixelRect(ctx, legLight, halfW + 3, halfH + 14, 4, 9);
        drawPixelRect(ctx, legDark, halfW + 11, halfH + 16, 4, 7);
      }
    } else if (p.action === PlayerAction.WALK || p.action === PlayerAction.RUN) {
      // 4-frame walk cycle
      if (walkFrame === 0) {
        // Forward stride
        drawPixelRect(ctx, legLight, halfW + 8, halfH + 16, 4, 8);
        drawPixelRect(ctx, bootColor, halfW + 9, halfH + 22, 5, 2);
        drawPixelRect(ctx, legDark, halfW + 2, halfH + 16, 4, 7);
        drawPixelRect(ctx, bootColor, halfW + 1, halfH + 21, 4, 2);
      } else if (walkFrame === 1) {
        // Passing frame
        drawPixelRect(ctx, legLight, halfW + 5, halfH + 16, 4, 8);
        drawPixelRect(ctx, bootColor, halfW + 5, halfH + 22, 5, 2);
        drawPixelRect(ctx, legDark, halfW + 8, halfH + 15, 3, 6);
      } else if (walkFrame === 2) {
        // Opposite stride
        drawPixelRect(ctx, legLight, halfW + 2, halfH + 16, 4, 8);
        drawPixelRect(ctx, bootColor, halfW + 1, halfH + 22, 5, 2);
        drawPixelRect(ctx, legDark, halfW + 9, halfH + 16, 4, 7);
        drawPixelRect(ctx, bootColor, halfW + 9, halfH + 21, 4, 2);
      } else {
        // Passing frame
        drawPixelRect(ctx, legLight, halfW + 6, halfH + 16, 4, 8);
        drawPixelRect(ctx, bootColor, halfW + 6, halfH + 22, 5, 2);
        drawPixelRect(ctx, legDark, halfW + 4, halfH + 15, 3, 6);
      }
    } else if (p.action === PlayerAction.JUMP) {
      // Tucked jump legs
      drawPixelRect(ctx, legLight, halfW + 4, halfH + 15, 4, 6);
      drawPixelRect(ctx, bootColor, halfW + 3, halfH + 19, 5, 2);
      drawPixelRect(ctx, legDark, halfW + 9, halfH + 14, 4, 5);
      drawPixelRect(ctx, bootColor, halfW + 9, halfH + 18, 5, 2);
    } else if (p.action === PlayerAction.DEATH) {
      // Collapsed kneeling
      drawPixelRect(ctx, legDark, halfW + 1, halfH + 18, 12, 5);
      drawPixelRect(ctx, bootColor, halfW + 10, halfH + 20, 5, 3);
    } else {
      // Standing idle
      drawPixelRect(ctx, legDark, halfW + 4, halfH + 16 + bodyBob, 3, 8 - bodyBob);
      drawPixelRect(ctx, bootColor, halfW + 3, halfH + 22, 4, 2);
      drawPixelRect(ctx, legLight, halfW + 9, halfH + 16 + bodyBob, 4, 8 - bodyBob);
      drawPixelRect(ctx, bootColor, halfW + 9, halfH + 22, 5, 2);
    }

    // --- 3. TORSO & BREASTPLATE ---
    const armorPlate = PALETTE.DARK_GRAY;
    const armorLight = PALETTE.MID_GRAY;
    const armorEdge = PALETTE.BRIGHT_GRAY;

    if (p.action === PlayerAction.DEATH) {
      // Slumped forward
      drawPixelRect(ctx, armorPlate, halfW + 2, halfH + 12, 10, 8);
      drawPixelRect(ctx, armorEdge, halfW + 4, halfH + 12, 7, 2);
    } else {
      drawPixelRect(ctx, armorPlate, halfW + 3, bodyY, 11, 10);
      drawPixelRect(ctx, armorLight, halfW + 5, bodyY + 1, 8, 2);
      drawPixelRect(ctx, armorEdge, halfW + 4, bodyY + 5, 9, 1);
      drawPixelRect(ctx, armorLight, halfW + 4, bodyY + 8, 9, 1);

      // Dawn Crest on Cael's chest (golden crystal motif)
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 8, bodyY + 3, 2, 2);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 8, bodyY + 2, 2, 1);

      // Belt
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 3, bodyY + 9, 11, 2);
      drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 7, bodyY + 9, 2, 2);
    }

    // --- 4. HELMET & GLOWING VISOR ---
    const helmY = p.action === PlayerAction.DEATH ? halfH + 6 : bodyY - 7;
    const helmX = halfW + (p.action === PlayerAction.DEATH ? 4 : 4);

    // Helmet dome & neck guard
    drawPixelRect(ctx, PALETTE.DARKEST_GRAY, helmX, helmY, 9, 7);
    drawPixelRect(ctx, armorLight, helmX + 1, helmY, 7, 2);
    // Helmet crest ridge
    drawPixelRect(ctx, armorEdge, helmX + 3, helmY - 1, 3, 2);

    // Glowing Visor (Cael's signature cyan 8-bit eye slit)
    if (p.action !== PlayerAction.DEATH) {
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, helmX + 5, helmY + 3, 4, 1);
      drawPixelRect(ctx, PALETTE.WHITE, helmX + 6, helmY + 3, 2, 1);
    }

    // --- 5. ARMS & 8-BIT BROADSWORD (Stepped Action Frames) ---
    const hiltColor = PALETTE.AMBER;
    const guardColor = PALETTE.PALE_GOLD;
    const bladeColor = PALETTE.BRIGHT_GRAY;
    const bladeEdge = PALETTE.WHITE;

    if (p.action === PlayerAction.ATTACK_LIGHT) {
      // 3-frame discrete Light Slash
      const slashStep = Math.min(2, Math.floor(p.attackTimer / 0.08));

      if (slashStep === 0) {
        // Frame 0: Windup (blade raised backward)
        drawPixelRect(ctx, armorLight, halfW + 1, bodyY + 1, 3, 4);
        drawPixelRect(ctx, hiltColor, halfW - 1, bodyY - 1, 2, 3);
        drawPixelRect(ctx, guardColor, halfW - 3, bodyY - 2, 6, 2);
        drawPixelRect(ctx, bladeColor, halfW - 2, bodyY - 14, 4, 12);
        drawPixelRect(ctx, bladeEdge, halfW - 1, bodyY - 14, 1, 12);
      } else if (slashStep === 1) {
        // Frame 1: Full horizontal slash arc with blocky 8-bit trail
        drawPixelRect(ctx, armorLight, halfW + 11, bodyY + 3, 4, 3);
        drawPixelRect(ctx, hiltColor, halfW + 14, bodyY + 3, 3, 2);
        drawPixelRect(ctx, guardColor, halfW + 16, bodyY + 1, 2, 6);
        drawPixelRect(ctx, bladeColor, halfW + 18, bodyY + 2, 14, 3);
        drawPixelRect(ctx, bladeEdge, halfW + 18, bodyY + 3, 14, 1);

        // Blocky 8-bit stepped sword slash trail
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 10, bodyY - 6, 4, 4);
        drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 14, bodyY - 3, 5, 4);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 20, bodyY, 6, 3);
        drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 26, bodyY + 3, 6, 3);
      } else {
        // Frame 2: Recovery forward thrust
        drawPixelRect(ctx, armorLight, halfW + 10, bodyY + 4, 3, 3);
        drawPixelRect(ctx, bladeColor, halfW + 13, bodyY + 5, 10, 2);
        drawPixelRect(ctx, bladeEdge, halfW + 13, bodyY + 5, 10, 1);
      }
    } else if (p.action === PlayerAction.ATTACK_HEAVY) {
      // 4-frame Heavy Cleave
      const heavyStep = Math.min(3, Math.floor(p.attackTimer / 0.11));

      if (heavyStep === 0) {
        // Frame 0: High two-handed overhead raise
        drawPixelRect(ctx, armorLight, halfW + 5, bodyY - 3, 4, 4);
        drawPixelRect(ctx, hiltColor, halfW + 6, bodyY - 6, 2, 4);
        drawPixelRect(ctx, guardColor, halfW + 3, bodyY - 7, 8, 2);
        drawPixelRect(ctx, bladeColor, halfW + 5, bodyY - 22, 4, 15);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 6, bodyY - 22, 2, 15);
      } else if (heavyStep === 1) {
        // Frame 1: Mid-downward cleave
        drawPixelRect(ctx, armorLight, halfW + 9, bodyY + 1, 4, 4);
        drawPixelRect(ctx, bladeColor, halfW + 12, bodyY - 10, 10, 8);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 14, bodyY - 8, 8, 4);
        // Golden shock arc blocks
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 18, bodyY - 14, 4, 6);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 22, bodyY - 8, 4, 6);
      } else if (heavyStep === 2) {
        // Frame 2: Heavy ground impact! (blade buried in floor, ground shock blocks)
        drawPixelRect(ctx, armorLight, halfW + 10, bodyY + 6, 4, 4);
        drawPixelRect(ctx, guardColor, halfW + 11, halfH + 16, 6, 2);
        drawPixelRect(ctx, bladeColor, halfW + 13, halfH + 18, 3, 6);
        // Golden impact shockwave blocks
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 17, halfH + 20, 6, 4);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 23, halfH + 21, 5, 3);
        drawPixelRect(ctx, PALETTE.AMBER, halfW + 28, halfH + 22, 4, 2);
      } else {
        // Frame 3: Recovery pulling blade
        drawPixelRect(ctx, armorLight, halfW + 8, bodyY + 4, 4, 4);
        drawPixelRect(ctx, bladeColor, halfW + 12, bodyY + 5, 8, 3);
      }
    } else if (p.action === PlayerAction.BLOCK) {
      // 8-bit Block: Sword held vertically like a shield
      drawPixelRect(ctx, armorLight, halfW + 9, bodyY + 3, 3, 4);
      drawPixelRect(ctx, hiltColor, halfW + 11, bodyY + 5, 2, 3);
      drawPixelRect(ctx, guardColor, halfW + 8, bodyY + 3, 7, 2);
      drawPixelRect(ctx, bladeColor, halfW + 10, bodyY - 9, 3, 12);
      drawPixelRect(ctx, bladeEdge, halfW + 11, bodyY - 9, 1, 12);

      // Block gleam spark (5x5 pixel star)
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 10, bodyY - 2, 3, 3);
      drawPixelRect(ctx, PALETTE.WHITE, halfW + 11, bodyY - 4, 1, 7);
      drawPixelRect(ctx, PALETTE.WHITE, halfW + 8, bodyY - 1, 7, 1);
    } else if (p.action === PlayerAction.DASH) {
      // Dashing forward thrust
      drawPixelRect(ctx, armorLight, halfW + 10, bodyY + 4, 4, 3);
      drawPixelRect(ctx, bladeColor, halfW + 14, bodyY + 5, 12, 2);
      drawPixelRect(ctx, bladeEdge, halfW + 14, bodyY + 5, 12, 1);
    } else if (p.action === PlayerAction.DEATH) {
      // Sword planted in the earth
      drawPixelRect(ctx, hiltColor, halfW + 13, halfH + 11, 2, 3);
      drawPixelRect(ctx, guardColor, halfW + 10, halfH + 14, 7, 2);
      drawPixelRect(ctx, bladeColor, halfW + 12, halfH + 16, 3, 8);
    } else {
      // Idle / Running: Sword resting at hip
      drawPixelRect(ctx, armorLight, halfW + 2, bodyY + 3, 3, 4);
      drawPixelRect(ctx, hiltColor, halfW - 1, bodyY + 2, 2, 3);
      drawPixelRect(ctx, guardColor, halfW - 2, bodyY + 5, 5, 2);
      drawPixelRect(ctx, bladeColor, halfW - 1, bodyY + 7, 3, 10);
      drawPixelRect(ctx, bladeEdge, halfW, bodyY + 7, 1, 10);
    }

    ctx.restore();
  }

  // ================= 8-BIT ENEMIES =================
  public renderEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number, camY: number, time: number) {
    if (e.state === 'dead') return;

    const rx = Math.floor(e.x - camX);
    const ry = Math.floor(e.y - camY);

    ctx.save();
    ctx.translate(rx + Math.floor(e.width / 2), ry + Math.floor(e.height / 2));
    ctx.scale(e.facing === Direction.RIGHT ? 1 : -1, 1);

    const halfW = -Math.floor(e.width / 2);
    const halfH = -Math.floor(e.height / 2);

    // --- 1. CORRUPTED KNIGHT (18x24) ---
    if (e.type === EnemyType.CORRUPTED_KNIGHT) {
      const walkFrame = Math.floor(time * 6) % 2;
      const isAttacking = e.state === 'attack';

      // Legs
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 4, halfH + 16, 3, walkFrame === 0 ? 8 : 6);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 10, halfH + 16, 3, walkFrame === 1 ? 8 : 6);

      // Torso in corrupted plate
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 3, halfH + 7, 11, 10);
      drawPixelRect(ctx, PALETTE.DARK_VIOLET, halfW + 4, halfH + 8, 9, 2);
      // Purple corruption veins
      drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 7, halfH + 11, 3, 2);
      drawPixelRect(ctx, PALETTE.LAVENDER, halfW + 8, halfH + 12, 1, 1);

      // Corrupted Helmet
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 4, halfH, 9, 7);
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 5, halfH + 1, 7, 2);
      // Glowing purple visor eyes
      drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 7, halfH + 3, 4, 1);
      drawPixelRect(ctx, PALETTE.PALE_LILAC, halfW + 8, halfH + 3, 2, 1);

      // Jagged 8-bit Broadsword
      if (isAttacking) {
        // Slashing forward
        drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 13, halfH + 8, 11, 3);
        drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 15, halfH + 7, 9, 1);
      } else {
        // Raised menacingly
        drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 12, halfH + 3, 3, 14);
        drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 13, halfH + 2, 1, 14);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 11, halfH + 14, 5, 2);
      }
    }
    // --- 2. SHADOW BEAST (22x14) ---
    else if (e.type === EnemyType.SHADOW_BEAST) {
      const prowlFrame = Math.floor(time * 8) % 2;

      // Beast body
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 3, halfH + 3, 16, 7);
      // Jagged spine ridges
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 6, halfH + 1, 3, 3);
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 11, halfH + 1, 3, 3);

      // Head & glowing amber eye
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 16, halfH + 2, 6, 6);
      drawPixelRect(ctx, PALETTE.GOLD, halfW + 19, halfH + 3, 2, 2);

      // 4 Prowling Legs (2-frame animation)
      if (prowlFrame === 0) {
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 4, halfH + 10, 3, 4);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 14, halfH + 10, 3, 4);
      } else {
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 2, halfH + 9, 3, 5);
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 16, halfH + 9, 3, 5);
      }
    }
    // --- 3. FOREST WRAITH (18x24) ---
    else if (e.type === EnemyType.FOREST_WRAITH) {
      const hoverBob = Math.floor(time * 4) % 2;
      const tatterFrame = Math.floor(time * 6) % 3;

      // Floating cowl
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 3, halfH + 2 + hoverBob, 12, 14);
      // Hood cavity
      drawPixelRect(ctx, PALETTE.BLACK, halfW + 5, halfH + 3 + hoverBob, 8, 6);
      // Twin glowing emerald eyes
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, halfW + 7, halfH + 5 + hoverBob, 2, 2);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, halfW + 10, halfH + 5 + hoverBob, 2, 2);

      // Tattered hem tails
      if (tatterFrame === 0) {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 4, halfH + 16 + hoverBob, 3, 5);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 9, halfH + 16 + hoverBob, 4, 7);
      } else if (tatterFrame === 1) {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 5, halfH + 16 + hoverBob, 4, 6);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 11, halfH + 16 + hoverBob, 3, 5);
      } else {
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 3, halfH + 16 + hoverBob, 4, 7);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 8, halfH + 16 + hoverBob, 4, 5);
      }

      // 8-bit dark energy diamond orb floating in front
      drawPixelCrystal(ctx, halfW + 18, halfH + 8 + hoverBob, 6, 8, PALETTE.PURPLE, PALETTE.PALE_LILAC, PALETTE.VOID_PURPLE);
    }
    // --- 4. HOLLOW ARCHER (16x24) ---
    else if (e.type === EnemyType.HOLLOW_ARCHER) {
      // Skeletal frame
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 4, halfH + 7, 8, 9);
      // Skull
      drawPixelRect(ctx, PALETTE.BRIGHT_GRAY, halfW + 5, halfH + 1, 7, 6);
      // Red glowing eye socket
      drawPixelRect(ctx, PALETTE.BRIGHT_RED, halfW + 8, halfH + 3, 2, 2);
      // Skeletal legs
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 5, halfH + 16, 2, 8);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 9, halfH + 16, 2, 8);

      // Stepped wooden bow
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 13, halfH + 2, 2, 18);
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 12, halfH, 2, 3);
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, halfW + 12, halfH + 19, 2, 3);
      // Notched pixel arrow
      drawPixelRect(ctx, PALETTE.WHITE, halfW + 7, halfH + 10, 8, 1);
      drawPixelRect(ctx, PALETTE.BRIGHT_RED, halfW + 6, halfH + 9, 2, 3);
    }
    // --- 5. ANCIENT GUARDIAN (32x40) ---
    else if (e.type === EnemyType.ANCIENT_GUARDIAN) {
      const stepFrame = Math.floor(time * 3) % 2;

      // Heavy stone block legs
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 5, halfH + 26, 8, stepFrame === 0 ? 14 : 12);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 19, halfH + 26, 8, stepFrame === 1 ? 14 : 12);

      // Massive stone torso
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, halfW + 3, halfH + 10, 26, 17);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 5, halfH + 11, 22, 3);

      // Glowing cyan ancient runes across chest blocks
      drawPixelRect(ctx, PALETTE.SKY_BLUE, halfW + 8, halfH + 16, 16, 2);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 15, halfH + 13, 2, 8);

      // Stone Golem Head
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 9, halfH + 2, 14, 9);
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, halfW + 12, halfH + 5, 8, 2);

      // Giant Stone Slab Hammer
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, halfW + 28, halfH + 4, 5, 34);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, halfW + 25, halfH + 1, 12, 10);
      drawPixelRect(ctx, PALETTE.MID_GRAY, halfW + 26, halfH + 2, 10, 2);
    }
    // --- 6. FINAL BOSS: THE DYING KING (44x54) ---
    else if (e.type === EnemyType.DYING_KING) {
      const phase = e.bossPhase || 1;
      const kingBob = Math.floor(time * 3) % 2;

      if (phase === 3) {
        // PHASE 3: SHADOW FIEND (Horned monstrosity with stepped bat-like wings & scythe)
        // Stepped pixel wings
        const wingColor = PALETTE.VOID_PURPLE;
        const wingDetail = PALETTE.DARK_VIOLET;

        // Left wing blocks
        drawPixelRect(ctx, wingColor, halfW - 24, halfH - 10, 26, 6);
        drawPixelRect(ctx, wingColor, halfW - 20, halfH - 4, 22, 14);
        drawPixelRect(ctx, wingDetail, halfW - 14, halfH + 10, 16, 10);

        // Right wing blocks
        drawPixelRect(ctx, wingColor, halfW + 38, halfH - 10, 26, 6);
        drawPixelRect(ctx, wingColor, halfW + 38, halfH - 4, 22, 14);
        drawPixelRect(ctx, wingDetail, halfW + 38, halfH + 10, 16, 10);

        // Obsidian body
        drawPixelRect(ctx, PALETTE.BLACK, halfW + 8, halfH + 8, 26, 42);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 10, halfH + 12, 22, 30);

        // Horned skull & blazing crimson triple eyes
        drawPixelRect(ctx, PALETTE.DARK_VIOLET, halfW + 11, halfH - 2, 20, 12);
        // Left & right horns
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 8, halfH - 14, 5, 14);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 29, halfH - 14, 5, 14);

        // Triple eyes
        drawPixelRect(ctx, PALETTE.BRIGHT_RED, halfW + 14, halfH + 2, 3, 2);
        drawPixelRect(ctx, PALETTE.BRIGHT_RED, halfW + 25, halfH + 2, 3, 2);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 19, halfH - 1, 4, 2);

        // Pulsing Corrupted Void Core
        const corePulse = Math.floor(time * 6) % 3;
        const coreColor = corePulse === 0 ? PALETTE.MAGENTA : corePulse === 1 ? PALETTE.PURPLE : PALETTE.PALE_LILAC;
        drawPixelRect(ctx, coreColor, halfW + 17, halfH + 22, 8, 8);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 19, halfH + 24, 4, 4);

        // Giant Dark Scythe Claw
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 34, halfH + 10, 5, 38);
        drawPixelRect(ctx, PALETTE.MAGENTA, halfW + 30, halfH + 6, 14, 5);
        drawPixelRect(ctx, PALETTE.PALE_LILAC, halfW + 36, halfH + 2, 6, 5);
      } else {
        // PHASE 1 & 2: FRACTURED GOLDEN SOVEREIGN (Cracked golden royal plate)
        // Royal Cape
        drawPixelRect(ctx, PALETTE.DEEP_MAROON, halfW - 6, halfH + 10, 10, 40);
        drawPixelRect(ctx, PALETTE.DARK_RED, halfW - 4, halfH + 14, 6, 34);

        // Heavy Plate Greaves
        drawPixelRect(ctx, PALETTE.RUST, halfW + 8, halfH + 38, 9, 14);
        drawPixelRect(ctx, PALETTE.RUST, halfW + 24, halfH + 38, 9, 14);

        // Golden Torso with dark corrupted cracks
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 6, halfH + 12 + kingBob, 29, 27);
        drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 8, halfH + 13 + kingBob, 25, 3);
        // Corruption cracks bleeding through armor
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 12, halfH + 17 + kingBob, 5, 18);
        drawPixelRect(ctx, PALETTE.VOID_PURPLE, halfW + 21, halfH + 23 + kingBob, 9, 4);

        // The Corrupted Heart of Dawn embedded in chest (cycling 8-bit crystal)
        const heartPulse = Math.floor(time * 5) % 2;
        drawPixelRect(ctx, heartPulse === 0 ? PALETTE.MAGENTA : PALETTE.PURPLE, halfW + 18, halfH + 20 + kingBob, 6, 6);
        drawPixelRect(ctx, PALETTE.PALE_LILAC, halfW + 19, halfH + 21 + kingBob, 4, 4);

        // Imperial Crown & Golden Visor
        drawPixelRect(ctx, PALETTE.PALE_GOLD, halfW + 10, halfH + 2 + kingBob, 21, 11);
        // Crown 3 stepped spikes
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 10, halfH - 4 + kingBob, 4, 7);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 19, halfH - 7 + kingBob, 4, 10);
        drawPixelRect(ctx, PALETTE.SUN_YELLOW, halfW + 27, halfH - 4 + kingBob, 4, 7);

        // Shadow beneath crown / visor
        drawPixelRect(ctx, PALETTE.PURPLE, halfW + 13, halfH + 7 + kingBob, 15, 3);

        // Giant Royal Broadsword
        drawPixelRect(ctx, PALETTE.AMBER, halfW + 36, halfH + 8 + kingBob, 6, 8);
        drawPixelRect(ctx, PALETTE.GOLD, halfW + 33, halfH + 14 + kingBob, 12, 3);
        drawPixelRect(ctx, PALETTE.BRIGHT_GRAY, halfW + 37, halfH - 24 + kingBob, 4, 70);
        drawPixelRect(ctx, PALETTE.WHITE, halfW + 38, halfH - 24 + kingBob, 2, 70);
      }
    }

    // Health bar above enemy (if damaged and not boss)
    if (e.hp < e.maxHp && !e.isBoss) {
      const barW = Math.max(16, e.width + 4);
      const barX = halfW - 2;
      const barY = halfH - 8;
      drawPixelRect(ctx, PALETTE.BLACK, barX, barY, barW, 4);
      drawPixelRect(ctx, PALETTE.DARK_RED, barX + 1, barY + 1, barW - 2, 2);
      const fillW = Math.max(0, Math.floor((barW - 2) * (e.hp / e.maxHp)));
      drawPixelRect(ctx, PALETTE.BRIGHT_RED, barX + 1, barY + 1, fillW, 2);
    }

    ctx.restore();
  }

  // ================= 8-BIT PROJECTILES =================
  public renderProjectile(ctx: CanvasRenderingContext2D, p: Projectile, camX: number, camY: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    if (p.type === 'arrow') {
      // 8-bit wooden arrow
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, rx - 6, ry - 1, 12, 2);
      drawPixelRect(ctx, PALETTE.WHITE, rx + 4, ry - 2, 3, 4);
      drawPixelRect(ctx, PALETTE.CRIMSON, rx - 7, ry - 2, 3, 4);
    } else if (p.type === 'dark_orb') {
      // 8-bit diamond cross orb
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, rx - 4, ry - 4, 8, 8);
      drawPixelRect(ctx, PALETTE.MAGENTA, rx - 3, ry - 3, 6, 6);
      drawPixelRect(ctx, PALETTE.PALE_LILAC, rx - 1, ry - 1, 2, 2);
    } else if (p.type === 'shockwave') {
      // 8-bit golden shock column
      drawPixelRect(ctx, PALETTE.AMBER, rx - 6, ry - 10, 12, 20);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx - 3, ry - 8, 6, 16);
    }
    ctx.restore();
  }

  // ================= 8-BIT TILES & PLATFORMS =================
  public renderPlatform(ctx: CanvasRenderingContext2D, plat: Platform, camX: number, camY: number) {
    const rx = Math.floor(plat.x - camX);
    const ry = Math.floor(plat.y - camY);
    const w = Math.floor(plat.width);
    const h = Math.floor(plat.height);

    ctx.save();

    if (plat.type === 'ladder') {
      // 8-bit Wooden Ladder
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, rx, ry, 3, h);
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, rx + w - 3, ry, 3, h);
      // Stepped rungs every 8 pixels
      for (let y = 2; y < h; y += 8) {
        drawPixelRect(ctx, PALETTE.RUST, rx + 3, ry + y, w - 6, 2);
      }
      ctx.restore();
      return;
    }

    if (plat.type === 'hazard') {
      if (plat.theme === 'fire') {
        // 8-bit animated flame hazard
        for (let x = 0; x < w; x += 6) {
          drawPixelRect(ctx, PALETTE.BRIGHT_RED, rx + x, ry, 6, h);
          drawPixelRect(ctx, PALETTE.GOLD, rx + x + 1, ry + 2, 4, h - 4);
          drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + x + 2, ry + 4, 2, h - 6);
        }
      } else {
        // 8-bit sharp iron spikes
        for (let x = 0; x < w; x += 8) {
          drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x + 1, ry + 6, 6, h - 6);
          drawPixelRect(ctx, PALETTE.LIGHT_GRAY, rx + x + 2, ry + 3, 4, 4);
          drawPixelRect(ctx, PALETTE.WHITE, rx + x + 3, ry, 2, 4);
        }
      }
      ctx.restore();
      return;
    }

    // Solid & One-Way platforms
    if (plat.theme === 'village_ground') {
      // 8-bit Cobblestone dirt
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.MOSS_GREEN, rx, ry, w, 2); // Grass top
      for (let x = 4; x < w - 8; x += 16) {
        drawPixelRect(ctx, PALETTE.DARK_GRAY, rx + x, ry + 4, 8, 4);
        drawPixelRect(ctx, PALETTE.MID_GRAY, rx + x + 1, ry + 5, 6, 2);
      }
    } else if (plat.theme === 'moss_ground' || plat.theme === 'branch') {
      // 8-bit Mossy forest stone
      drawPixelRect(ctx, PALETTE.NIGHT_GREEN, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, rx, ry, w, 2);
      drawPixelRect(ctx, PALETTE.FOREST_GREEN, rx, ry + 2, w, 2);
    } else if (plat.theme === 'cliff') {
      // 8-bit Slate cliff
      drawPixelRect(ctx, PALETTE.MIDNIGHT_BLUE, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.STEEL_BLUE, rx, ry, w, 2);
    } else if (plat.theme === 'capital_paving' || plat.theme === 'marble') {
      // 8-bit Royal paving
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.PURPLE, rx, ry, w, 2);
      for (let x = 8; x < w - 8; x += 20) {
        drawPixelRect(ctx, PALETTE.DARK_VIOLET, rx + x, ry + 4, 12, 3);
      }
    } else if (plat.theme === 'crystal_gold' || plat.theme === 'celestial_stone' || plat.theme === 'apex_dais') {
      // 8-bit Golden celestial masonry
      drawPixelRect(ctx, PALETTE.RUST, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx, ry, w, 2);
      drawPixelRect(ctx, PALETTE.GOLD, rx, ry + 2, w, 2);
    } else {
      // Generic 8-bit stone
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx, ry, w, h);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx, ry, w, 2);
    }

    ctx.restore();
  }

  // ================= 8-BIT LANDMARKS & SHRINES =================
  public renderLandmark(ctx: CanvasRenderingContext2D, lm: Landmark, camX: number, camY: number, time: number) {
    const rx = Math.floor(lm.x - camX);
    const ry = Math.floor(lm.y - camY);

    ctx.save();
    if (lm.type === 'shrine') {
      // Sacred 8-bit Dawn Shrine with 3-frame animated flame
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, rx + 2, ry + 16, 28, 16);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx, ry + 12, 32, 4);
      drawPixelRect(ctx, PALETTE.GOLD, rx + 6, ry + 8, 20, 4);

      // 3-frame 8-bit flame
      const flameFrame = Math.floor(time * 6) % 3;
      const flameH = flameFrame === 0 ? 10 : flameFrame === 1 ? 12 : 9;
      drawPixelRect(ctx, PALETTE.CRIMSON, rx + 10, ry + 8 - flameH, 12, flameH);
      drawPixelRect(ctx, PALETTE.GOLD, rx + 12, ry + 9 - flameH, 8, flameH - 2);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 14, ry + 10 - flameH, 4, flameH - 4);
    } else if (lm.type === 'mural') {
      // Ancient stone mural with glowing 8-bit runes
      drawPixelRect(ctx, PALETTE.DARK_GRAY, rx, ry, lm.width, lm.height);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx + 2, ry + 2, lm.width - 4, lm.height - 4);
      for (let y = 6; y < lm.height - 6; y += 6) {
        drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, rx + 6, ry + y, lm.width - 12, 2);
      }
    } else if (lm.type === 'door') {
      // 8-bit Golden portal archway
      drawPixelRect(ctx, PALETTE.GOLD, rx, ry, 4, lm.height);
      drawPixelRect(ctx, PALETTE.GOLD, rx + lm.width - 4, ry, 4, lm.height);
      drawPixelRect(ctx, PALETTE.PALE_GOLD, rx, ry, lm.width, 4);
      // Portal interior cycling 8-bit gold/yellow
      const pColor = Math.floor(time * 4) % 2 === 0 ? PALETTE.GOLD : PALETTE.SUN_YELLOW;
      drawPixelRect(ctx, pColor, rx + 4, ry + 4, lm.width - 8, lm.height - 4);
    }
    ctx.restore();
  }

  // ================= 8-BIT MEMORY SHARD =================
  public renderMemoryShard(ctx: CanvasRenderingContext2D, shard: MemoryShard, camX: number, camY: number, time: number) {
    const rx = Math.floor(shard.x - camX);
    // Integer stepped bob
    const bob = Math.floor(Math.sin(time * 3) * 3);
    const ry = Math.floor(shard.y - camY + bob);

    ctx.save();
    // 8-bit crystal diamond
    drawPixelCrystal(ctx, rx + 8, ry + 8, 12, 16, PALETTE.SKY_BLUE, PALETTE.ICE_WHITE, PALETTE.ROYAL_BLUE);

    // 4 rotating sparkle pixels (8-bit sparkle cross)
    const sFrame = Math.floor(time * 4) % 4;
    const offsets = [
      [-5, 0],
      [0, -5],
      [5, 0],
      [0, 5]
    ];
    const [sx, sy] = offsets[sFrame];
    drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 8 + sx, ry + 8 + sy, 2, 2);

    ctx.restore();
  }
}

export const spriteRenderer = new SpriteRenderer();
