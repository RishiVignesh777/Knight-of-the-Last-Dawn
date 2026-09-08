import { PlayerStats, PlayerAction, Direction, Enemy, EnemyType, Projectile, Platform, Landmark, MemoryShard } from '../types';

export class SpriteRenderer {
  public renderPlayer(ctx: CanvasRenderingContext2D, p: PlayerStats, camX: number, camY: number, time: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    ctx.translate(rx + p.width / 2, ry + p.height / 2);
    ctx.scale(p.facing === Direction.RIGHT ? 1 : -1, 1);

    // Hit flash
    if (p.invincibleTimer > 0 && Math.floor(time * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const w = p.width;
    const h = p.height;
    const halfW = -w / 2;
    const halfH = -h / 2;

    // Cape physics calculations
    const capeOffset = p.capeAngle;
    const capeWind = Math.sin(time * 6) * 3;

    // 1. Cape (Behind the knight)
    if (p.action !== PlayerAction.CLIMB) {
      ctx.fillStyle = '#991b1b'; // Deep royal crimson
      ctx.beginPath();
      ctx.moveTo(halfW + 4, halfH + 8);
      ctx.lineTo(halfW - 8 + capeOffset + capeWind, halfH + h + 2);
      ctx.lineTo(halfW - 2 + capeOffset * 0.7, halfH + h);
      ctx.lineTo(halfW + 10, halfH + 12);
      ctx.fill();

      // Cape shadow edge
      ctx.fillStyle = '#581c1c';
      ctx.beginPath();
      ctx.moveTo(halfW + 4, halfH + 8);
      ctx.lineTo(halfW - 8 + capeOffset + capeWind, halfH + h + 2);
      ctx.lineTo(halfW - 4 + capeOffset + capeWind, halfH + h + 2);
      ctx.lineTo(halfW + 7, halfH + 10);
      ctx.fill();
    }

    // 2. Legs & Armor Greaves
    ctx.fillStyle = '#1e293b'; // Dark steel
    const legBob = (p.action === PlayerAction.RUN || p.action === PlayerAction.WALK) ? Math.sin(p.animTimer * 14) * 3 : 0;
    
    if (p.action === PlayerAction.RUN || p.action === PlayerAction.WALK) {
      // Striding legs
      const leg1 = Math.sin(p.animTimer * 14) * 6;
      const leg2 = -leg1;
      ctx.fillRect(halfW + 5 + leg1, halfH + h - 11, 4, 11);
      ctx.fillRect(halfW + 11 + leg2, halfH + h - 11, 4, 11);
      // Steel sabatons (feet)
      ctx.fillStyle = '#475569';
      ctx.fillRect(halfW + 5 + leg1, halfH + h - 2, 6, 2);
      ctx.fillRect(halfW + 11 + leg2, halfH + h - 2, 6, 2);
    } else if (p.action === PlayerAction.JUMP) {
      // Tucked legs
      ctx.fillRect(halfW + 5, halfH + h - 13, 4, 9);
      ctx.fillRect(halfW + 10, halfH + h - 10, 4, 7);
      ctx.fillStyle = '#475569';
      ctx.fillRect(halfW + 5, halfH + h - 4, 5, 2);
      ctx.fillRect(halfW + 10, halfH + h - 3, 5, 2);
    } else if (p.action === PlayerAction.DEATH) {
      // Fallen kneeling
      ctx.fillRect(halfW + 3, halfH + h - 6, 12, 6);
    } else {
      // Standing legs
      ctx.fillRect(halfW + 5, halfH + h - 11, 4, 11);
      ctx.fillRect(halfW + 11, halfH + h - 11, 4, 11);
      ctx.fillStyle = '#475569';
      ctx.fillRect(halfW + 5, halfH + h - 2, 5, 2);
      ctx.fillRect(halfW + 11, halfH + h - 2, 5, 2);
    }

    // 3. Torso Armor & Breastplate
    const breathBob = p.action === PlayerAction.IDLE ? Math.sin(time * 3) * 1 : 0;
    const bodyY = halfH + 8 + (p.action === PlayerAction.DEATH ? 12 : breathBob + legBob * 0.2);

    ctx.fillStyle = '#334155'; // Dark steel plate
    ctx.fillRect(halfW + 4, bodyY, 13, 14);

    // Armor highlights and segmented plate lines
    ctx.fillStyle = '#64748b';
    ctx.fillRect(halfW + 5, bodyY + 1, 10, 2);
    ctx.fillRect(halfW + 4, bodyY + 6, 12, 1);
    ctx.fillRect(halfW + 5, bodyY + 10, 10, 1);

    // Small glowing Dawn Crest on Cael's chest
    ctx.fillStyle = '#38bdf8'; // Glowing cyan symbol
    ctx.fillRect(halfW + 9, bodyY + 4, 3, 3);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(halfW + 10, bodyY + 3, 1, 5);
    ctx.fillRect(halfW + 8, bodyY + 5, 5, 1);

    // Belt and fauld
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(halfW + 4, bodyY + 12, 13, 2);
    ctx.fillStyle = '#d97706'; // Golden belt buckle
    ctx.fillRect(halfW + 9, bodyY + 12, 3, 2);

    // 4. Helmet & Head
    const headY = bodyY - 10;
    ctx.fillStyle = '#1e293b'; // Steel helm
    ctx.fillRect(halfW + 5, headY, 11, 10);
    // Helmet crest
    ctx.fillStyle = '#475569';
    ctx.fillRect(halfW + 7, headY - 2, 5, 3);

    // Glowing Visor (Cael's signature narrow eye slit)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(halfW + 9, headY + 4, 6, 2);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(halfW + 11, headY + 4, 3, 1);

    // 5. Arms & Sword
    ctx.fillStyle = '#475569'; // Pauldron
    ctx.fillRect(halfW + 3, bodyY, 4, 5);
    ctx.fillRect(halfW + 13, bodyY, 4, 5);

    // Draw Sword & Arm based on action
    if (p.action === PlayerAction.ATTACK_LIGHT) {
      // Slashing forward
      const progress = p.attackTimer / 0.25;
      const slashAngle = -0.6 + progress * 2.2;
      ctx.save();
      ctx.translate(halfW + 13, bodyY + 5);
      ctx.rotate(slashAngle);
      // Sword handle & guard
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-2, 0, 3, 6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-5, -2, 9, 2);
      // Blade
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-2, -26, 3, 24);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-1, -26, 1, 24);
      ctx.restore();

      // Sword slash arc effect
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(halfW + 12, bodyY + 5, 28, -1.0, 1.0);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

    } else if (p.action === PlayerAction.ATTACK_HEAVY) {
      // Heavy downward cleave with golden energy
      const progress = p.attackTimer / 0.45;
      const slashAngle = -1.6 + progress * 3.2;
      ctx.save();
      ctx.translate(halfW + 14, bodyY + 4);
      ctx.rotate(slashAngle);
      // Giant blade
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-3, 0, 4, 8);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-7, -2, 13, 3);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-3, -34, 5, 32);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-1, -34, 2, 32);
      ctx.restore();

      // Heavy golden shock trail
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(halfW + 14, bodyY + 4, 34, -1.6, 1.4);
      ctx.stroke();

    } else if (p.action === PlayerAction.BLOCK) {
      // Defensive stance: sword held vertically across body
      ctx.fillStyle = '#b45309';
      ctx.fillRect(halfW + 14, bodyY + 3, 3, 4);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(halfW + 11, bodyY + 1, 9, 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(halfW + 14, bodyY - 14, 3, 20);
      // Metallic guard gleam
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(halfW + 13, bodyY - 4, 5, 5);

    } else if (p.action === PlayerAction.DASH) {
      // Thrusting blade behind or forward in dash lunge
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(halfW + 14, bodyY + 6, 22, 3);

    } else if (p.action === PlayerAction.DEATH) {
      // Sword planted in ground
      ctx.fillStyle = '#b45309';
      ctx.fillRect(halfW + 14, halfH + h - 18, 3, 6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(halfW + 11, halfH + h - 14, 9, 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(halfW + 14, halfH + h - 12, 3, 14);

    } else {
      // Idle / Running sword resting at side / hip
      ctx.save();
      ctx.translate(halfW + 4, bodyY + 4);
      ctx.rotate(0.35 + (p.action === PlayerAction.RUN ? legBob * 0.1 : 0));
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-1, 0, 3, 4);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-3, 4, 7, 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-1, 6, 3, 18);
      ctx.restore();
    }

    ctx.restore();
  }

  // ================= ENEMIES =================
  public renderEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number, camY: number, time: number) {
    if (e.state === 'dead') return;

    const rx = Math.floor(e.x - camX);
    const ry = Math.floor(e.y - camY);

    ctx.save();
    ctx.translate(rx + e.width / 2, ry + e.height / 2);
    ctx.scale(e.facing === Direction.RIGHT ? 1 : -1, 1);

    const halfW = -e.width / 2;
    const halfH = -e.height / 2;

    if (e.type === EnemyType.CORRUPTED_KNIGHT) {
      // Corrupted Knight: dark rusted armor, jagged broadsword, glowing purple eyes
      const walkBob = Math.sin(time * 8) * 2;
      // Legs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(halfW + 4, halfH + e.height - 10, 4, 10);
      ctx.fillRect(halfW + 12, halfH + e.height - 10, 4, 10);
      // Torso
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(halfW + 3, halfH + 8 + walkBob, 15, 14);
      // Corrupted purple veins
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(halfW + 8, halfH + 11 + walkBob, 4, 2);
      ctx.fillRect(halfW + 6, halfH + 15 + walkBob, 3, 2);
      // Helmet
      ctx.fillStyle = '#020617';
      ctx.fillRect(halfW + 4, halfH + walkBob, 12, 9);
      // Glowing purple visor eyes
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(halfW + 9, halfH + 3 + walkBob, 5, 2);
      // Jagged sword
      ctx.fillStyle = '#475569';
      ctx.fillRect(halfW + 16, halfH + 2 + walkBob, 4, 22);
      ctx.fillStyle = '#a855f7'; // Corrupted blade aura
      ctx.fillRect(halfW + 17, halfH + 6 + walkBob, 2, 14);

    } else if (e.type === EnemyType.SHADOW_BEAST) {
      // Quadruped beast: low profile, glowing amber eyes, clawed pounces
      const prowl = Math.sin(time * 12) * 2;
      ctx.fillStyle = '#09090b';
      // Body
      ctx.fillRect(halfW + 4, halfH + 6 + prowl, 20, 10);
      // Head
      ctx.fillRect(halfW + 18, halfH + 2 + prowl, 9, 8);
      // Glowing amber eye
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(halfW + 23, halfH + 4 + prowl, 3, 2);
      // Legs
      ctx.fillStyle = '#18181b';
      ctx.fillRect(halfW + 4, halfH + 14, 4, 8);
      ctx.fillRect(halfW + 18, halfH + 14, 4, 8);
      // Spikes on spine
      ctx.fillStyle = '#451a03';
      ctx.fillRect(halfW + 8, halfH + 3 + prowl, 3, 4);
      ctx.fillRect(halfW + 13, halfH + 3 + prowl, 3, 4);

    } else if (e.type === EnemyType.FOREST_WRAITH) {
      // Flying specter: hovering, tattered cowl, dark orb
      const hover = Math.sin(time * 4) * 4;
      ctx.fillStyle = '#1e1b4b';
      // Tattered floating shroud
      ctx.fillRect(halfW + 4, halfH + 6 + hover, 16, 20);
      // Wispy bottom tails
      ctx.fillRect(halfW + 5, halfH + 24 + hover, 3, 5);
      ctx.fillRect(halfW + 11, halfH + 25 + hover, 4, 7);
      ctx.fillRect(halfW + 16, halfH + 23 + hover, 3, 4);
      // Hooded void
      ctx.fillStyle = '#020617';
      ctx.fillRect(halfW + 6, halfH + hover, 12, 10);
      // Glowing green/cyan twin eyes
      ctx.fillStyle = '#34d399';
      ctx.fillRect(halfW + 9, halfH + 4 + hover, 2, 2);
      ctx.fillRect(halfW + 13, halfH + 4 + hover, 2, 2);
      // Casting dark orb in skeletal hand
      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.arc(halfW + 22, halfH + 14 + hover, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (e.type === EnemyType.HOLLOW_ARCHER) {
      // Archer on platforms: decayed royal archer
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(halfW + 4, halfH + 8, 12, 14);
      // Skull / cowl
      ctx.fillStyle = '#e4e4e7';
      ctx.fillRect(halfW + 5, halfH + 1, 10, 8);
      // Eye glow
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(halfW + 9, halfH + 4, 2, 2);
      // Bow
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(halfW + 17, halfH + 12, 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // Arrow notched
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(halfW + 10, halfH + 11, 12, 2);

    } else if (e.type === EnemyType.ANCIENT_GUARDIAN) {
      // Large heavy stone & iron golem
      const march = Math.sin(time * 5) * 2;
      // Stone legs
      ctx.fillStyle = '#334155';
      ctx.fillRect(halfW + 5, halfH + e.height - 16, 8, 16);
      ctx.fillRect(halfW + 19, halfH + e.height - 16, 8, 16);
      // Colossal stone torso
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(halfW + 3, halfH + 12 + march, 26, 22);
      // Glowing ancient runes on chest
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(halfW + 10, halfH + 18 + march, 12, 2);
      ctx.fillRect(halfW + 15, halfH + 15 + march, 2, 8);
      // Armored head
      ctx.fillStyle = '#475569';
      ctx.fillRect(halfW + 8, halfH + 2 + march, 16, 12);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(halfW + 12, halfH + 6 + march, 8, 2);
      // Massive Stone Slab Hammer
      ctx.fillStyle = '#64748b';
      ctx.fillRect(halfW + 28, halfH + 4 + march, 8, 38);
      ctx.fillRect(halfW + 24, halfH + 2 + march, 16, 12);

    } else if (e.type === EnemyType.DYING_KING) {
      // ================= THE DYING KING (FINAL BOSS) =================
      const p = e.bossPhase || 1;
      const breathe = Math.sin(time * 3) * 3;

      if (p === 3) {
        // Phase 3: Shadow Fiend! Horned monstrosity with colossal spectral wings!
        // Spectral Wings
        ctx.fillStyle = 'rgba(76, 29, 149, 0.7)';
        ctx.beginPath();
        ctx.moveTo(halfW + 20, halfH + 20);
        ctx.lineTo(halfW - 35, halfH - 25);
        ctx.lineTo(halfW - 45, halfH + 15);
        ctx.lineTo(halfW - 20, halfH + 35);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(halfW + 24, halfH + 20);
        ctx.lineTo(halfW + 55, halfH - 25);
        ctx.lineTo(halfW + 65, halfH + 15);
        ctx.lineTo(halfW + 40, halfH + 35);
        ctx.fill();

        // Shadow core body
        ctx.fillStyle = '#090514';
        ctx.fillRect(halfW + 6, halfH + 10, 32, 54);

        // Pulsing corrupted void core
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(halfW + 22, halfH + 28, 9 + Math.sin(time * 8) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Horned crown / skull
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(halfW + 10, halfH - 4, 24, 16);
        // Horns
        ctx.fillRect(halfW + 8, halfH - 18, 4, 16);
        ctx.fillRect(halfW + 30, halfH - 18, 4, 16);

        // Blazing red/crimson triple eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(halfW + 15, halfH + 2, 3, 2);
        ctx.fillRect(halfW + 26, halfH + 2, 3, 2);
        ctx.fillRect(halfW + 20, halfH - 2, 4, 3);

        // Giant Dark Scythe / Claw
        ctx.fillStyle = '#581c87';
        ctx.fillRect(halfW + 38, halfH + 15, 6, 45);
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(halfW + 41, halfH + 15, 18, -Math.PI / 2, 0.4);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#c084fc';
        ctx.stroke();

      } else {
        // Phase 1 & Phase 2: Fractured Golden Sovereign in cracked armor
        // Royal Cape
        ctx.fillStyle = '#4c0519';
        ctx.fillRect(halfW - 8, halfH + 12, 12, e.height - 14);

        // Heavy Plate Legs
        ctx.fillStyle = '#78350f';
        ctx.fillRect(halfW + 8, halfH + e.height - 20, 10, 20);
        ctx.fillRect(halfW + 26, halfH + e.height - 20, 10, 20);

        // Massive Torso in Fractured Golden Armor
        ctx.fillStyle = '#d97706';
        ctx.fillRect(halfW + 6, halfH + 14 + breathe, 32, 34);
        // Dark corruption bleeding through armor cracks
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(halfW + 12, halfH + 20 + breathe, 6, 24);
        ctx.fillRect(halfW + 22, halfH + 28 + breathe, 12, 4);

        // The Corrupted Heart of Dawn embedded in the King's chest!
        ctx.fillStyle = '#a855f7'; // Corrupted purple/amethyst glow
        ctx.beginPath();
        ctx.arc(halfW + 22, halfH + 26 + breathe, 6 + Math.sin(time * 6) * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(halfW + 20, halfH + 24 + breathe, 4, 4);

        // Golden Imperial Crown & Visor
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(halfW + 10, halfH + breathe, 24, 15);
        // Crown spikes
        ctx.fillRect(halfW + 10, halfH - 6 + breathe, 4, 8);
        ctx.fillRect(halfW + 20, halfH - 9 + breathe, 4, 11);
        ctx.fillRect(halfW + 30, halfH - 6 + breathe, 4, 8);

        // Eyes beneath crown
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(halfW + 16, halfH + 6 + breathe, 12, 3);

        // Giant Royal Broadsword
        ctx.fillStyle = '#d97706';
        ctx.fillRect(halfW + 38, halfH + 10 + breathe, 8, 12);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(halfW + 40, halfH - 24 + breathe, 5, 80);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(halfW + 42, halfH - 24 + breathe, 2, 80);
      }
    }

    // Health bar above enemy if damaged
    if (e.hp < e.maxHp && !e.isBoss) {
      const barW = e.width + 10;
      const barX = halfW - 5;
      const barY = halfH - 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(barX, barY, barW, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(barX + 1, barY + 1, Math.max(0, (barW - 2) * (e.hp / e.maxHp)), 2);
    }

    ctx.restore();
  }

  // ================= PROJECTILES =================
  public renderProjectile(ctx: CanvasRenderingContext2D, p: Projectile, camX: number, camY: number) {
    const rx = Math.floor(p.x - camX);
    const ry = Math.floor(p.y - camY);

    ctx.save();
    if (p.type === 'arrow') {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(rx - 6, ry - 1, 12, 2);
      ctx.fillStyle = '#991b1b'; // Red fletching
      ctx.fillRect(rx - 8, ry - 2, 3, 4);
    } else if (p.type === 'dark_orb') {
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(rx, ry, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(rx, ry, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'shockwave') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx - 8, ry - 12, 16, 24);
    }
    ctx.restore();
  }

  // ================= PLATFORMS & TILES =================
  public renderPlatform(ctx: CanvasRenderingContext2D, plat: Platform, camX: number, camY: number) {
    const rx = Math.floor(plat.x - camX);
    const ry = Math.floor(plat.y - camY);

    ctx.save();

    if (plat.type === 'ladder') {
      // Wood or vine ladder
      ctx.fillStyle = plat.theme === 'vine' ? '#047857' : '#78350f';
      ctx.fillRect(rx, ry, 3, plat.height);
      ctx.fillRect(rx + plat.width - 3, ry, 3, plat.height);
      // Rungs
      for (let y = 0; y < plat.height; y += 10) {
        ctx.fillRect(rx + 3, ry + y, plat.width - 6, 2);
      }
      ctx.restore();
      return;
    }

    if (plat.type === 'hazard') {
      // Spikes / Brambles / Fire / Abyss
      if (plat.theme === 'fire') {
        ctx.fillStyle = '#ef4444';
        for (let x = 0; x < plat.width; x += 8) {
          ctx.fillRect(rx + x, ry, 8, plat.height);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(rx + x + 2, ry + 2, 4, plat.height - 4);
          ctx.fillStyle = '#ef4444';
        }
      } else {
        // Spikes
        ctx.fillStyle = '#64748b';
        for (let x = 0; x < plat.width; x += 10) {
          ctx.beginPath();
          ctx.moveTo(rx + x, ry + plat.height);
          ctx.lineTo(rx + x + 5, ry);
          ctx.lineTo(rx + x + 10, ry + plat.height);
          ctx.fill();
        }
      }
      ctx.restore();
      return;
    }

    // Solid or one-way platforms
    if (plat.theme === 'village_ground') {
      ctx.fillStyle = '#44403c'; // Cobblestone dirt
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#78716c';
      ctx.fillRect(rx, ry, plat.width, 3); // Grass / top edge
      // Cobble texture
      ctx.fillStyle = '#292524';
      for (let x = 8; x < plat.width; x += 24) {
        ctx.fillRect(rx + x, ry + 6, 12, 5);
      }
    } else if (plat.theme === 'moss_ground' || plat.theme === 'branch') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#10b981'; // Vivid moss top
      ctx.fillRect(rx, ry, plat.width, 3);
      // Hanging roots
      ctx.fillStyle = '#022c22';
      for (let x = 12; x < plat.width; x += 32) {
        ctx.fillRect(rx + x, ry + plat.height, 2, 6);
      }
    } else if (plat.theme === 'cliff') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#334155';
      ctx.fillRect(rx, ry, plat.width, 3);
    } else if (plat.theme === 'capital_paving' || plat.theme === 'marble') {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(rx, ry, plat.width, 3);
      // Carved tile accents
      ctx.fillStyle = '#312e81';
      for (let x = 16; x < plat.width; x += 32) {
        ctx.fillRect(rx + x, ry + 5, 14, 4);
      }
    } else if (plat.theme === 'crystal_gold' || plat.theme === 'celestial_stone' || plat.theme === 'apex_dais') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#fbbf24'; // Radiant gold edge
      ctx.fillRect(rx, ry, plat.width, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(rx, ry, plat.width, 1);
    } else {
      // Generic stone/wood
      ctx.fillStyle = '#334155';
      ctx.fillRect(rx, ry, plat.width, plat.height);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(rx, ry, plat.width, 2);
    }

    ctx.restore();
  }

  // ================= LANDMARKS & OBJECTS =================
  public renderLandmark(ctx: CanvasRenderingContext2D, lm: Landmark, camX: number, camY: number, time: number) {
    const rx = Math.floor(lm.x - camX);
    const ry = Math.floor(lm.y - camY);

    ctx.save();
    if (lm.type === 'shrine') {
      // Sacred Dawn Shrine: Stone altar with animated golden flame
      ctx.fillStyle = '#1e293b'; // Pedestal
      ctx.fillRect(rx + 4, ry + 16, 24, 16);
      ctx.fillStyle = '#475569';
      ctx.fillRect(rx + 2, ry + 12, 28, 4);
      // Shrine basin
      ctx.fillStyle = '#d97706';
      ctx.fillRect(rx + 8, ry + 8, 16, 4);
      // Animated sacred flame
      const flameH = 8 + Math.sin(time * 8) * 3;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx + 11, ry + 8 - flameH, 10, flameH);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(rx + 13, ry + 8 - flameH + 2, 6, flameH - 2);

    } else if (lm.type === 'mural') {
      // Ancient runic stone mural
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(rx, ry, lm.width, lm.height);
      ctx.fillStyle = '#475569';
      ctx.fillRect(rx + 2, ry + 2, lm.width - 4, lm.height - 4);
      // Glowing carved runes
      ctx.fillStyle = '#38bdf8';
      for (let y = 6; y < lm.height - 6; y += 7) {
        ctx.fillRect(rx + 6, ry + y, lm.width - 12, 2);
      }

    } else if (lm.type === 'door') {
      // Glowing archway to next area
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx + 4, ry + 4, lm.width - 8, lm.height - 4);
      // Arch frame
      ctx.fillStyle = '#d97706';
      ctx.fillRect(rx, ry, 4, lm.height);
      ctx.fillRect(rx + lm.width - 4, ry, 4, lm.height);
      ctx.fillRect(rx, ry, lm.width, 4);
      // Radiant dawn doorway portal glow
      const portalGlow = Math.sin(time * 4) * 0.2 + 0.5;
      ctx.fillStyle = `rgba(254, 240, 138, ${portalGlow})`;
      ctx.fillRect(rx + 6, ry + 6, lm.width - 12, lm.height - 6);
    }
    ctx.restore();
  }

  // ================= MEMORY SHARDS =================
  public renderMemoryShard(ctx: CanvasRenderingContext2D, shard: MemoryShard, camX: number, camY: number, time: number) {
    const rx = Math.floor(shard.x - camX);
    const bob = Math.sin(time * 3 + shard.x) * 4;
    const ry = Math.floor(shard.y - camY + bob);

    ctx.save();
    // Shimmering crystal diamond
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(rx + 8, ry);
    ctx.lineTo(rx + 16, ry + 12);
    ctx.lineTo(rx + 8, ry + 24);
    ctx.lineTo(rx, ry + 12);
    ctx.fill();

    // Inner bright facet
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(rx + 8, ry + 3);
    ctx.lineTo(rx + 13, ry + 12);
    ctx.lineTo(rx + 8, ry + 21);
    ctx.lineTo(rx + 3, ry + 12);
    ctx.fill();

    // Floating orbit rings
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(rx + 8, ry + 12, 14, 5, time * 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

export const spriteRenderer = new SpriteRenderer();
