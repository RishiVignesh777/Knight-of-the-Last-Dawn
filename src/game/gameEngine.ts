import {
  GameState,
  AreaId,
  PlayerStats,
  PlayerAction,
  Direction,
  Enemy,
  EnemyType,
  Projectile,
  EndingType,
  MemoryShard
} from '../types';
import {
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT,
  GRAVITY,
  MAX_FALL_SPEED,
  WALK_SPEED,
  RUN_SPEED,
  JUMP_FORCE,
  DASH_SPEED,
  DASH_DURATION,
  DASH_COOLDOWN,
  INVINCIBLE_TIME_AFTER_HIT,
  CLIMB_SPEED,
  PLAYER_MAX_HP,
  PLAYER_MAX_STAMINA,
  PLAYER_MAX_DAWN,
  STAMINA_REGEN_RATE,
  LIGHT_ATTACK_STAMINA,
  HEAVY_ATTACK_STAMINA,
  DASH_STAMINA,
  BLOCK_STAMINA_DRAIN_RATE,
  LIGHT_ATTACK_DAMAGE,
  HEAVY_ATTACK_DAMAGE,
  BOSS_MAX_HP
} from './constants';
import { WORLD_AREAS } from './worldData';
import { soundEngine } from '../audio/soundManager';
import { particleEngine } from './particleSystem';
import { spriteRenderer } from './spriteRenderer';
import { parallaxEngine } from './parallaxBackgrounds';
import { lightingEngine } from './lightingEngine';
import { PALETTE, drawPixelRect } from './pixelArtHelper';
import { getBestiaryEntry } from './bestiaryData';
import { getAchievement, Achievement } from './achievementData';

export class GameEngine {
  public state: GameState = GameState.MENU;
  public currentAreaId: AreaId = AreaId.VILLAGE;
  
  public player: PlayerStats;
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  
  public camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    shake: 0,
    lookAhead: 0
  };

  public activeDialogue: {
    npcName: string;
    npcTitle: string;
    lines: string[];
    currentLine: number;
  } | null = null;

  public activeMemoryModal: MemoryShard | null = null;
  public activeLandmarkText: string | null = null;
  public activeEndingChoice: EndingType | null = null;
  public endingEpilogueText: string[] = [];
  public endingEpilogueStep: number = 0;

  public bossDefeated: boolean = false;
  public bossEncountered: boolean = false;

  public bestiaryDiscoveryToast: {
    enemyName: string;
    timer: number;
  } | null = null;

  public activeAchievementToast: {
    achievement: Achievement;
    timer: number;
  } | null = null;

  private gameTime: number = 0;
  private jumpBufferTimer: number = 0;
  private coyoteTimer: number = 0;

  // Keyboard input states
  public keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    attackLight: false,
    attackHeavy: false,
    block: false,
    interact: false
  };

  private prevKeys = { ...this.keys };

  constructor() {
    this.player = this.createDefaultPlayer();
    this.loadArea(AreaId.VILLAGE, false);
  }

  public unlockAchievement(id: string, silent: boolean = false) {
    if (!this.player.unlockedAchievements) {
      this.player.unlockedAchievements = [];
    }
    if (this.player.unlockedAchievements.includes(id)) {
      return;
    }
    this.player.unlockedAchievements.push(id);
    this.saveGame();

    if (!silent) {
      const ach = getAchievement(id);
      if (ach) {
        this.activeAchievementToast = {
          achievement: ach,
          timer: 5.0
        };
        soundEngine.playAchievementUnlocked();
      }
    }
  }

  private createDefaultPlayer(): PlayerStats {
    return {
      x: 70,
      y: 260,
      vx: 0,
      vy: 0,
      width: 22,
      height: 32,
      facing: Direction.RIGHT,
      action: PlayerAction.IDLE,
      frame: 0,
      animTimer: 0,
      hp: PLAYER_MAX_HP,
      maxHp: PLAYER_MAX_HP,
      stamina: PLAYER_MAX_STAMINA,
      maxStamina: PLAYER_MAX_STAMINA,
      dawnEnergy: 40,
      maxDawnEnergy: PLAYER_MAX_DAWN,
      isGrounded: true,
      isClimbing: false,
      isDashing: false,
      dashTimer: 0,
      dashCooldown: 0,
      invincibleTimer: 0,
      comboStep: 0,
      attackTimer: 0,
      attackCooldown: 0,
      blockTimer: 0,
      isBlocking: false,
      capeAngle: 0,
      capeVel: 0,
      memoryShards: [],
      collectedShardsInArea: {},
      unlockedCheckpoints: ['shrine_village'],
      currentCheckpoint: { areaId: AreaId.VILLAGE, x: 80, y: 280 },
      discoveredEnemies: [],
      unlockedAchievements: []
    };
  }

  public startNewGame() {
    soundEngine.enableAudio();
    this.player = this.createDefaultPlayer();
    this.bossDefeated = false;
    this.bossEncountered = false;
    this.loadArea(AreaId.VILLAGE, true);
    this.state = GameState.PLAYING;
    soundEngine.playMusicForArea(AreaId.VILLAGE);
    this.saveGame();
  }

  public continueGame(): boolean {
    soundEngine.enableAudio();
    const saved = localStorage.getItem('knight_last_dawn_save');
    if (!saved) return false;
    try {
      const data = JSON.parse(saved);
      this.player = {
        ...this.createDefaultPlayer(),
        hp: data.hp || PLAYER_MAX_HP,
        dawnEnergy: data.dawnEnergy || 40,
        memoryShards: data.memoryShards || [],
        collectedShardsInArea: data.collectedShardsInArea || {},
        unlockedCheckpoints: data.unlockedCheckpoints || ['shrine_village'],
        currentCheckpoint: data.currentCheckpoint || { areaId: AreaId.VILLAGE, x: 80, y: 280 },
        discoveredEnemies: data.discoveredEnemies || [],
        unlockedAchievements: data.unlockedAchievements || []
      };

      // Retroactive validation for saved progress milestones
      if (this.player.memoryShards.length >= 1) {
        this.unlockAchievement('COLLECT_FIRST_SHARD', true);
      }
      if (this.player.memoryShards.length >= 5) {
        this.unlockAchievement('COLLECT_ALL_SHARDS', true);
      }
      if (this.player.discoveredEnemies.length >= 5) {
        this.unlockAchievement('BESTIARY_SCHOLAR', true);
      }

      const cp = this.player.currentCheckpoint;
      if (cp) {
        this.loadArea(cp.areaId, false);
        this.player.x = cp.x;
        this.player.y = cp.y;
      } else {
        this.loadArea(AreaId.VILLAGE, false);
      }
      this.state = GameState.PLAYING;
      soundEngine.playMusicForArea(this.currentAreaId);
      return true;
    } catch {
      return false;
    }
  }

  public saveGame() {
    try {
      const data = {
        hp: this.player.hp,
        dawnEnergy: this.player.dawnEnergy,
        memoryShards: this.player.memoryShards,
        collectedShardsInArea: this.player.collectedShardsInArea,
        unlockedCheckpoints: this.player.unlockedCheckpoints,
        currentCheckpoint: this.player.currentCheckpoint,
        discoveredEnemies: this.player.discoveredEnemies,
        unlockedAchievements: this.player.unlockedAchievements,
        currentAreaId: this.currentAreaId
      };
      localStorage.setItem('knight_last_dawn_save', JSON.stringify(data));
    } catch {
      /* ignore storage quota error */
    }
  }

  public hasSave(): boolean {
    return !!localStorage.getItem('knight_last_dawn_save');
  }

  public loadArea(areaId: AreaId, setSpawnPos: boolean = true) {
    this.currentAreaId = areaId;
    const area = WORLD_AREAS[areaId];

    if (setSpawnPos) {
      this.player.x = area.spawnX;
      this.player.y = area.spawnY;
      this.player.vx = 0;
      this.player.vy = 0;
    }

    // Spawn enemies
    this.enemies = area.enemies.map(e => ({
      ...e,
      vx: 0,
      vy: 0,
      animTimer: 0,
      actionTimer: 0,
      invincibleTimer: 0,
      isGrounded: true
    }));

    this.projectiles = [];
    particleEngine.clear();

    // Center camera on player
    this.camera.x = Math.max(0, Math.min(this.player.x - VIRTUAL_WIDTH / 2, area.width - VIRTUAL_WIDTH));
    this.camera.y = Math.max(0, Math.min(this.player.y - VIRTUAL_HEIGHT / 2, area.height - VIRTUAL_HEIGHT));

    if (this.state === GameState.PLAYING) {
      soundEngine.playMusicForArea(areaId);
    }

    if (areaId === AreaId.CATHEDRAL || areaId === AreaId.LAKE || areaId === AreaId.CAPITAL) {
      this.unlockAchievement('SANCTUM_WAYFARER');
    }
  }

  // ================= MAIN UPDATE LOOP =================
  public update(dt: number) {
    // Clamp delta time to avoid physics tunneling on tab switch
    const clampedDt = Math.min(dt, 0.05);
    this.gameTime += clampedDt;

    // Check Gamepad
    this.pollGamepad();

    // Global background update
    parallaxEngine.update(clampedDt);
    particleEngine.update(clampedDt);

    // Weather particles
    const currentArea = WORLD_AREAS[this.currentAreaId];
    particleEngine.spawnWeatherParticles(
      currentArea.weather,
      this.camera.x,
      this.camera.y,
      VIRTUAL_WIDTH,
      VIRTUAL_HEIGHT
    );

    // Continuous ambient holy motes drifting from shrines / checkpoints in the current area
    for (const lm of currentArea.landmarks) {
      if (lm.type === 'shrine') {
        const isCurrent = this.player.currentCheckpoint?.x === lm.x && 
                          this.player.currentCheckpoint?.y === lm.y && 
                          this.player.currentCheckpoint?.areaId === this.currentAreaId;
        if (Math.random() < 0.35) {
          particleEngine.spawnCheckpointAura(lm.x + lm.width / 2, lm.y + 10, isCurrent);
        }
      }
    }

    if (this.state === GameState.PLAYING) {
      this.updatePlayer(clampedDt);
      this.updateEnemies(clampedDt);
      this.updateProjectiles(clampedDt);
      this.updateCamera(clampedDt);
      this.checkInteractables();
    }

    if (this.bestiaryDiscoveryToast) {
      this.bestiaryDiscoveryToast.timer -= clampedDt;
      if (this.bestiaryDiscoveryToast.timer <= 0) {
        this.bestiaryDiscoveryToast = null;
      }
    }

    if (this.activeAchievementToast) {
      this.activeAchievementToast.timer -= clampedDt;
      if (this.activeAchievementToast.timer <= 0) {
        this.activeAchievementToast = null;
      }
    }

    // Update previous keys for edge detection
    this.prevKeys = { ...this.keys };
  }

  private pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads || !gamepads[0]) return;
    const gp = gamepads[0];
    if (!gp) return;

    const stickX = gp.axes[0] || 0;
    const stickY = gp.axes[1] || 0;
    const deadzone = 0.25;

    this.keys.left = this.keys.left || stickX < -deadzone || gp.buttons[14]?.pressed;
    this.keys.right = this.keys.right || stickX > deadzone || gp.buttons[15]?.pressed;
    this.keys.up = this.keys.up || stickY < -deadzone || gp.buttons[12]?.pressed;
    this.keys.down = this.keys.down || stickY > deadzone || gp.buttons[13]?.pressed;

    // Buttons
    this.keys.jump = this.keys.jump || gp.buttons[0]?.pressed; // A button
    this.keys.dash = this.keys.dash || gp.buttons[1]?.pressed || gp.buttons[7]?.pressed; // B / RT
    this.keys.attackLight = this.keys.attackLight || gp.buttons[2]?.pressed; // X button
    this.keys.attackHeavy = this.keys.attackHeavy || gp.buttons[3]?.pressed; // Y button
    this.keys.block = this.keys.block || gp.buttons[4]?.pressed || gp.buttons[6]?.pressed; // LB / LT
    this.keys.interact = this.keys.interact || gp.buttons[0]?.pressed; // Interact also with A
  }

  // ================= PLAYER PHYSICS & COMBAT =================
  private updatePlayer(dt: number) {
    const p = this.player;
    const area = WORLD_AREAS[this.currentAreaId];

    // Timers
    if (p.invincibleTimer > 0) p.invincibleTimer -= dt;
    if (p.dashCooldown > 0) p.dashCooldown -= dt;
    if (p.attackCooldown > 0) p.attackCooldown -= dt;

    // Stamina regeneration
    if (!p.isBlocking && !p.isDashing && p.action !== PlayerAction.ATTACK_HEAVY) {
      p.stamina = Math.min(p.maxStamina, p.stamina + STAMINA_REGEN_RATE * dt);
    }

    // Cape physics lag
    const capeTargetAngle = (p.vx / RUN_SPEED) * -14 + (p.facing === Direction.RIGHT ? -3 : 3);
    p.capeVel += (capeTargetAngle - p.capeAngle) * 20 * dt;
    p.capeVel *= 0.82;
    p.capeAngle += p.capeVel;

    // Coyote time & jump buffer
    if (p.isGrounded) {
      this.coyoteTimer = 0.12;
    } else {
      this.coyoteTimer -= dt;
    }

    if (this.keys.jump && !this.prevKeys.jump) {
      this.jumpBufferTimer = 0.15;
    } else {
      this.jumpBufferTimer -= dt;
    }

    // Dash handling
    if (p.isDashing) {
      p.dashTimer -= dt;
      particleEngine.spawnDashTrail(p.x + p.width / 2, p.y + p.height / 2, p.facing);
      p.vx = p.facing * DASH_SPEED;
      p.vy = 0; // zero gravity during dash

      if (p.dashTimer <= 0) {
        p.isDashing = false;
        p.action = PlayerAction.IDLE;
      }
      this.applyPlayerMovement(dt);
      return;
    }

    // Ladder climbing check
    const ladderPlatform = area.platforms.find(
      plat => plat.type === 'ladder' &&
      p.x + p.width > plat.x && p.x < plat.x + plat.width &&
      p.y + p.height > plat.y && p.y < plat.y + plat.height
    );

    if (ladderPlatform && (this.keys.up || (p.isClimbing && this.keys.down))) {
      p.isClimbing = true;
      p.isGrounded = false;
      p.action = PlayerAction.CLIMB;
      p.vx = 0;
      p.vy = (this.keys.up ? -CLIMB_SPEED : (this.keys.down ? CLIMB_SPEED : 0));
      p.x = ladderPlatform.x + ladderPlatform.width / 2 - p.width / 2;
      p.y += p.vy * dt;
      return;
    } else {
      p.isClimbing = false;
    }

    // Defensive Block
    if (this.keys.block && p.stamina > 5) {
      p.isBlocking = true;
      p.action = PlayerAction.BLOCK;
      p.vx *= 0.7; // Slowed movement while blocking
      p.stamina = Math.max(0, p.stamina - BLOCK_STAMINA_DRAIN_RATE * dt);
      return;
    } else {
      p.isBlocking = false;
    }

    // Dash Trigger (Shift)
    if (this.keys.dash && !this.prevKeys.dash && p.dashCooldown <= 0 && p.stamina >= DASH_STAMINA) {
      p.isDashing = true;
      p.dashTimer = DASH_DURATION;
      p.dashCooldown = DASH_COOLDOWN;
      p.stamina -= DASH_STAMINA;
      p.invincibleTimer = DASH_DURATION + 0.05;
      p.action = PlayerAction.DASH;
      soundEngine.playDash();
      return;
    }

    // Attack Handling
    if (p.action === PlayerAction.ATTACK_LIGHT || p.action === PlayerAction.ATTACK_HEAVY) {
      p.attackTimer -= dt;
      p.vx *= 0.8; // Decelerate during swing
      if (p.attackTimer <= 0) {
        p.action = PlayerAction.IDLE;
      }
      this.applyPlayerMovement(dt);
      return;
    }

    // Light Attack (J)
    if (this.keys.attackLight && !this.prevKeys.attackLight && p.attackCooldown <= 0 && p.stamina >= LIGHT_ATTACK_STAMINA) {
      p.action = PlayerAction.ATTACK_LIGHT;
      p.attackTimer = 0.22;
      p.attackCooldown = 0.28;
      p.stamina -= LIGHT_ATTACK_STAMINA;
      soundEngine.playSwordSlash(false);
      this.executeAttack(false);
      return;
    }

    // Heavy Attack (K)
    if (this.keys.attackHeavy && !this.prevKeys.attackHeavy && p.attackCooldown <= 0 && p.stamina >= HEAVY_ATTACK_STAMINA) {
      p.action = PlayerAction.ATTACK_HEAVY;
      p.attackTimer = 0.42;
      p.attackCooldown = 0.52;
      p.stamina -= HEAVY_ATTACK_STAMINA;
      soundEngine.playSwordSlash(true);
      this.executeAttack(true);
      return;
    }

    // Horizontal Movement
    if (this.keys.left && !this.keys.right) {
      p.facing = Direction.LEFT;
      p.vx = -WALK_SPEED;
      p.action = p.isGrounded ? PlayerAction.RUN : p.action;
      p.animTimer += dt;
      if (p.isGrounded && Math.floor(p.animTimer * 6) % 2 === 0) {
        soundEngine.playFootstep();
      }
    } else if (this.keys.right && !this.keys.left) {
      p.facing = Direction.RIGHT;
      p.vx = WALK_SPEED;
      p.action = p.isGrounded ? PlayerAction.RUN : p.action;
      p.animTimer += dt;
      if (p.isGrounded && Math.floor(p.animTimer * 6) % 2 === 0) {
        soundEngine.playFootstep();
      }
    } else {
      p.vx *= 0.7; // Friction
      if (p.isGrounded) {
        p.action = PlayerAction.IDLE;
      }
    }

    // Jump execution
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      p.vy = JUMP_FORCE;
      p.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      p.action = PlayerAction.JUMP;
      soundEngine.playJump();
      particleEngine.spawnDustPuff(p.x + p.width / 2, p.y + p.height);
    }

    // Gravity
    if (!p.isGrounded) {
      p.vy = Math.min(p.vy + GRAVITY * dt, MAX_FALL_SPEED);
      if (p.vy > 0) {
        p.action = PlayerAction.FALL;
      }
    }

    this.applyPlayerMovement(dt);
  }

  private applyPlayerMovement(dt: number) {
    const p = this.player;
    const area = WORLD_AREAS[this.currentAreaId];

    // Horizontal test
    p.x += p.vx * dt;
    // World bounds horizontal
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > area.width) p.x = area.width - p.width;

    // Horizontal platform collision
    for (const plat of area.platforms) {
      if (plat.type !== 'solid') continue;
      if (
        p.x < plat.x + plat.width &&
        p.x + p.width > plat.x &&
        p.y < plat.y + plat.height &&
        p.y + p.height > plat.y
      ) {
        if (p.vx > 0) {
          p.x = plat.x - p.width;
        } else if (p.vx < 0) {
          p.x = plat.x + plat.width;
        }
        p.vx = 0;
      }
    }

    // Vertical test
    p.y += p.vy * dt;
    p.isGrounded = false;

    // Check hazards & platforms
    for (const plat of area.platforms) {
      if (plat.type === 'hazard') {
        if (
          p.x < plat.x + plat.width &&
          p.x + p.width > plat.x &&
          p.y < plat.y + plat.height &&
          p.y + p.height > plat.y
        ) {
          this.hitPlayer(25, 0);
          // Bounce back
          p.vy = -200;
          p.y -= 10;
        }
        continue;
      }

      if (plat.type === 'ladder') continue;

      // Solid or One-Way collision
      if (
        p.x + p.width * 0.8 > plat.x &&
        p.x + p.width * 0.2 < plat.x + plat.width
      ) {
        // Landing on top
        if (p.vy >= 0 && p.y + p.height >= plat.y && p.y + p.height - p.vy * dt <= plat.y + 12) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
          if (p.action === PlayerAction.FALL) {
            p.action = PlayerAction.IDLE;
            particleEngine.spawnDustPuff(p.x + p.width / 2, p.y + p.height);
          }
        } else if (plat.type === 'solid' && p.vy < 0 && p.y <= plat.y + plat.height && p.y - p.vy * dt >= plat.y + plat.height - 8) {
          // Bumping head on solid ceiling
          p.y = plat.y + plat.height;
          p.vy = 0;
        }
      }
    }

    // Pit death fallback
    if (p.y > area.height + 60) {
      this.hitPlayer(100, 0);
    }
  }

  // ================= COMBAT CALCULATIONS =================
  private executeAttack(isHeavy: boolean) {
    const p = this.player;
    const damage = isHeavy ? HEAVY_ATTACK_DAMAGE : LIGHT_ATTACK_DAMAGE;
    const reach = isHeavy ? 42 : 28;
    const attackBox = {
      x: p.facing === Direction.RIGHT ? p.x + p.width : p.x - reach,
      y: p.y - 6,
      width: reach,
      height: p.height + 12
    };

    let hitAny = false;

    // Check hit on enemies
    for (const e of this.enemies) {
      if (e.state === 'dead') continue;
      if (
        attackBox.x < e.x + e.width &&
        attackBox.x + attackBox.width > e.x &&
        attackBox.y < e.y + e.height &&
        attackBox.y + attackBox.height > e.y
      ) {
        hitAny = true;
        this.discoverEnemy(e.type);
        e.hp -= damage;
        e.invincibleTimer = 0.25;
        e.vx = p.facing * (isHeavy ? 180 : 90);
        e.state = 'hurt';

        // Camera shake
        this.camera.shake = isHeavy ? 6 : 3;

        // Particle sparks & blood
        particleEngine.spawnSwordSlashSparks(e.x + e.width / 2, e.y + e.height / 2, p.facing, isHeavy);
        particleEngine.spawnBloodSplatter(e.x + e.width / 2, e.y + e.height / 2, p.facing);

        // Sound
        soundEngine.playSwordHit(e.type === EnemyType.ANCIENT_GUARDIAN || e.type === EnemyType.DYING_KING);

        // Gain Dawn Energy on hit
        p.dawnEnergy = Math.min(p.maxDawnEnergy, p.dawnEnergy + (isHeavy ? 14 : 7));
        if (p.dawnEnergy >= p.maxDawnEnergy) {
          this.unlockAchievement('SOLAR_CONVERGENCE');
        }

        // Check enemy death
        if (e.hp <= 0) {
          e.state = 'dead';
          soundEngine.playEnemyDeath();
          this.unlockAchievement('FIRST_BLOOD');
          if (e.isBoss) {
            this.handleBossDefeat();
          }
        }
      }
    }

    if (isHeavy) {
      particleEngine.spawnShockwave(p.x + (p.facing === Direction.RIGHT ? p.width + 12 : -12), p.y + p.height);
    }

    if (hitAny) {
      p.comboStep = (p.comboStep + 1) % 3;
    }
  }

  public hitPlayer(damage: number, knockbackDir: number) {
    const p = this.player;
    if (p.invincibleTimer > 0 || p.action === PlayerAction.DEATH) return;

    if (p.isBlocking && p.stamina >= 10) {
      p.stamina -= 18;
      soundEngine.playBlockParry();
      particleEngine.spawnSwordSlashSparks(p.x + p.width / 2, p.y + p.height / 2, -knockbackDir, false);
      p.vx = knockbackDir * 40;
      this.camera.shake = 2;
      this.unlockAchievement('UNYIELDING_BULWARK');
      return;
    }

    p.hp -= damage;
    p.invincibleTimer = INVINCIBLE_TIME_AFTER_HIT;
    p.action = PlayerAction.HURT;
    p.vx = knockbackDir * 120;
    p.vy = -120;
    this.camera.shake = 8;
    soundEngine.playEnemyHurt();
    particleEngine.spawnBloodSplatter(p.x + p.width / 2, p.y + p.height / 2, knockbackDir);

    if (p.hp <= 0) {
      p.hp = 0;
      p.action = PlayerAction.DEATH;
      this.state = GameState.GAME_OVER;
      soundEngine.playEnemyDeath();
    }
  }

  public discoverEnemy(type: EnemyType | string) {
    let canonical = type;
    if (type === EnemyType.CORRUPTED_KNIGHT) canonical = EnemyType.PENITENT_GUARD;
    if (type === EnemyType.SHADOW_BEAST) canonical = EnemyType.CATHEDRAL_BEAST;
    if (type === EnemyType.FOREST_WRAITH) canonical = EnemyType.BELL_WRAITH;

    if (!this.player.discoveredEnemies) {
      this.player.discoveredEnemies = [];
    }

    if (!this.player.discoveredEnemies.includes(canonical)) {
      this.player.discoveredEnemies.push(canonical);
      this.saveGame();

      const entry = getBestiaryEntry(canonical);
      const name = entry ? entry.name : canonical;

      this.bestiaryDiscoveryToast = {
        enemyName: name,
        timer: 4.5
      };
      soundEngine.playMenuBeep(true);

      if (this.player.discoveredEnemies.length >= 5) {
        this.unlockAchievement('BESTIARY_SCHOLAR');
      }
    }
  }

  // ================= ENEMY AI =================
  private updateEnemies(dt: number) {
    const p = this.player;

    for (const e of this.enemies) {
      if (e.state === 'dead') continue;

      if (e.invincibleTimer > 0) e.invincibleTimer -= dt;
      if (e.attackCooldown > 0) e.attackCooldown -= dt;

      const distToPlayer = Math.hypot(p.x - e.x, p.y - e.y);
      const dirToPlayer = p.x > e.x ? 1 : -1;

      if (distToPlayer < 360) {
        this.discoverEnemy(e.type);
      }

      // Special Boss AI (The Dying King)
      if (e.isBoss) {
        this.discoverEnemy(EnemyType.DYING_KING);
        this.updateBoss(e, dt, distToPlayer, dirToPlayer);
        continue;
      }

      // Standard enemy types
      if (e.type === EnemyType.HOLLOW_ARCHER) {
        // Archer stays on platform, shoots arrows when player in sight
        e.facing = dirToPlayer;
        if (distToPlayer < 300 && e.attackCooldown <= 0) {
          e.attackCooldown = 2.2;
          this.shootProjectile({
            id: `arrow_${Math.random()}`,
            x: e.x + (e.facing === 1 ? e.width + 4 : -4),
            y: e.y + 12,
            vx: e.facing * 240,
            vy: -15,
            radius: 3,
            isEnemy: true,
            damage: 18,
            life: 2.0,
            maxLife: 2.0,
            color: '#cbd5e1',
            type: 'arrow'
          });
        }
      } else if (e.type === EnemyType.BELL_WRAITH || e.type === EnemyType.FOREST_WRAITH) {
        // Flying wraith: hovers, tracks player, casts dark soul orbs
        e.facing = dirToPlayer;
        e.vy = Math.sin(this.gameTime * 3) * 20;
        if (distToPlayer > 120 && distToPlayer < 280) {
          e.vx = dirToPlayer * 45;
        } else {
          e.vx = 0;
        }

        if (distToPlayer < 240 && e.attackCooldown <= 0) {
          e.attackCooldown = 2.8;
          const angle = Math.atan2(p.y - e.y, p.x - e.x);
          this.shootProjectile({
            id: `orb_${Math.random()}`,
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            vx: Math.cos(angle) * 110,
            vy: Math.sin(angle) * 110,
            radius: 6,
            isEnemy: true,
            damage: 22,
            life: 3.5,
            maxLife: 3.5,
            color: '#7c3aed',
            type: 'dark_orb'
          });
        }
      } else if (e.type === EnemyType.ASHEN_MONK) {
        // Ashen Monk: chants, summons crimson corrupted hex orbs
        e.facing = dirToPlayer;
        if (distToPlayer > 90 && distToPlayer < 240) {
          e.vx = dirToPlayer * 35;
        } else {
          e.vx = 0;
        }

        if (distToPlayer < 220 && e.attackCooldown <= 0) {
          e.attackCooldown = 2.5;
          const angle = Math.atan2(p.y - e.y, p.x - e.x);
          this.shootProjectile({
            id: `hex_${Math.random()}`,
            x: e.x + (e.facing === 1 ? e.width : 0),
            y: e.y + 10,
            vx: Math.cos(angle) * 130,
            vy: Math.sin(angle) * 130,
            radius: 5,
            isEnemy: true,
            damage: 24,
            life: 3.0,
            maxLife: 3.0,
            color: '#b91c1c',
            type: 'dark_orb'
          });
        }
      } else if (e.type === EnemyType.CATHEDRAL_BEAST || e.type === EnemyType.SHADOW_BEAST) {
        // Fast beast / gargoyle hound: patrols, lunges fast
        if (distToPlayer < 180) {
          e.facing = dirToPlayer;
          e.vx = dirToPlayer * 130;
          if (distToPlayer < 40 && e.attackCooldown <= 0) {
            e.attackCooldown = 1.0;
            this.hitPlayer(18, dirToPlayer);
          }
        } else {
          // Patrol
          e.vx = e.facing * 50;
          if (e.x < e.patrolMinX) { e.x = e.patrolMinX; e.facing = 1; }
          if (e.x > e.patrolMaxX) { e.x = e.patrolMaxX; e.facing = -1; }
        }
      } else if (e.type === EnemyType.HOLLOW_SAINT || e.type === EnemyType.ANCIENT_GUARDIAN) {
        // Colossal statue / ancient guardian: slow march, heavy reliquary sweep, shockwave
        if (distToPlayer < 200) {
          e.facing = dirToPlayer;
          e.vx = dirToPlayer * 35;
          if (distToPlayer < 55 && e.attackCooldown <= 0) {
            e.attackCooldown = 2.0;
            this.hitPlayer(36, dirToPlayer);
            soundEngine.playSwordHit(true);
            particleEngine.spawnShockwave(e.x + e.width / 2, e.y + e.height);
            this.camera.shake = 6;
          }
        } else {
          e.vx = e.facing * 25;
          if (e.x < e.patrolMinX) { e.x = e.patrolMinX; e.facing = 1; }
          if (e.x > e.patrolMaxX) { e.x = e.patrolMaxX; e.facing = -1; }
        }
      } else if (e.type === EnemyType.BLOODBOUND_KNIGHT) {
        // Heavy executioner: methodical march, devastating cleaver slam
        if (distToPlayer < 180) {
          e.facing = dirToPlayer;
          e.vx = dirToPlayer * 55;
          if (distToPlayer < 50 && e.attackCooldown <= 0) {
            e.attackCooldown = 1.5;
            this.hitPlayer(30, dirToPlayer);
            soundEngine.playSwordSlash(true);
            this.camera.shake = 5;
          }
        } else {
          e.vx = e.facing * 35;
          if (e.x < e.patrolMinX) { e.x = e.patrolMinX; e.facing = 1; }
          if (e.x > e.patrolMaxX) { e.x = e.patrolMaxX; e.facing = -1; }
        }
      } else {
        // Penitent Guard / Corrupted Knight
        if (distToPlayer < 160) {
          e.facing = dirToPlayer;
          e.vx = dirToPlayer * 70;
          if (distToPlayer < 45 && e.attackCooldown <= 0) {
            e.attackCooldown = 1.2;
            this.hitPlayer(20, dirToPlayer);
            soundEngine.playSwordSlash(false);
          }
        } else {
          e.vx = e.facing * 45;
          if (e.x < e.patrolMinX) { e.x = e.patrolMinX; e.facing = 1; }
          if (e.x > e.patrolMaxX) { e.x = e.patrolMaxX; e.facing = -1; }
        }
      }

      // Move enemy
      e.x += e.vx * dt;
    }
  }

  // ================= BOSS AI (THE DYING KING) =================
  private updateBoss(boss: Enemy, dt: number, distToPlayer: number, dirToPlayer: number) {
    boss.facing = dirToPlayer;

    if (!this.bossEncountered && distToPlayer < 350) {
      this.bossEncountered = true;
      soundEngine.playBossRoar();
      soundEngine.playMusicForArea('BOSS');
    }

    // Phase threshold check
    const hpRatio = boss.hp / boss.maxHp;
    if (hpRatio <= 0.35) {
      if (boss.bossPhase !== 3) {
        boss.bossPhase = 3;
        soundEngine.playBossRoar();
        this.camera.shake = 12;
        particleEngine.spawnShockwave(boss.x + boss.width / 2, boss.y + boss.height);
      }
    } else if (hpRatio <= 0.70) {
      if (boss.bossPhase !== 2) {
        boss.bossPhase = 2;
        soundEngine.playBossRoar();
        this.camera.shake = 8;
      }
    }

    const currentPhase = boss.bossPhase || 1;

    if (currentPhase === 3) {
      // Phase 3: Shadow Fiend! Rapid pounces & dark nova
      boss.vx = dirToPlayer * 95;
      if (distToPlayer < 65 && boss.attackCooldown <= 0) {
        boss.attackCooldown = 1.2;
        this.hitPlayer(30, dirToPlayer);
        soundEngine.playSwordSlash(true);
        this.camera.shake = 8;
      }
      // Shadow projectile barrage
      if (boss.attackCooldown <= 0.2 && Math.random() < 0.05) {
        for (let i = -1; i <= 1; i++) {
          this.shootProjectile({
            id: `shadow_nova_${Math.random()}`,
            x: boss.x + boss.width / 2,
            y: boss.y + 20,
            vx: dirToPlayer * 160,
            vy: i * 40,
            radius: 8,
            isEnemy: true,
            damage: 24,
            life: 2.2,
            maxLife: 2.2,
            color: '#c084fc',
            type: 'dark_orb'
          });
        }
      }
    } else if (currentPhase === 2) {
      // Phase 2: Corrupted crystals, ground shockwaves
      boss.vx = dirToPlayer * 60;
      if (distToPlayer < 55 && boss.attackCooldown <= 0) {
        boss.attackCooldown = 1.6;
        this.hitPlayer(28, dirToPlayer);
        soundEngine.playSwordSlash(true);
        particleEngine.spawnShockwave(boss.x + boss.width / 2, boss.y + boss.height);
        this.camera.shake = 7;
      }
    } else {
      // Phase 1: Heavy strikes & shockwave slam
      boss.vx = dirToPlayer * 45;
      if (distToPlayer < 50 && boss.attackCooldown <= 0) {
        boss.attackCooldown = 2.0;
        this.hitPlayer(24, dirToPlayer);
        soundEngine.playSwordSlash(true);
      }
    }

    boss.x += boss.vx * dt;
  }

  private handleBossDefeat() {
    this.bossDefeated = true;
    this.unlockAchievement('DEFEAT_FIRST_BOSS');
    soundEngine.playBossRoar();
    this.camera.shake = 16;
    this.state = GameState.ENDING_CHOICE;
    soundEngine.playMusicForArea('ENDING');
  }

  public chooseEnding(choice: EndingType) {
    this.activeEndingChoice = choice;
    this.state = GameState.ENDING_CUTSCENE;
    this.endingEpilogueStep = 0;
    this.unlockAchievement('THE_FINAL_DAWN');

    if (choice === EndingType.SACRIFICE) {
      this.endingEpilogueText = [
        "Cael steps onto the radiant dais where the Heart of Dawn pulses with its final dying spark.",
        '"When the final light reaches the tower, remember what you promised."',
        "Cael lays his hand upon the crystal core. A blinding golden radiance surges into his breastplate, dissolving the steel into pure liquid sun.",
        "His mortal form disperses into the morning breeze, carrying the restored light of Eldoria across every ruined village, withered forest, and darkened river.",
        "The kingdom awakens. Sir Cael is remembered not for the night he failed, but for the dawn he gave his life to bring."
      ];
    } else {
      this.endingEpilogueText = [
        "Cael draws his blade. He looks upon the shattered Heart of Dawn and remembers the centuries of bloodshed fought in its name.",
        '"No more false idols. No more golden cages."',
        "With a single mighty strike, Cael cleaves the corrupted crystal into dust. The sky turns clear, bathed in the natural warmth of an unmagical, honest sunrise.",
        "The kingdom will not heal in a single night. Broken houses will require mortal hands; silent bells must be rung by those who survived.",
        "Sir Cael sheathes his sword and begins the long walk down the mountain. For the first time in his life, he walks toward a new dawn."
      ];
    }
  }

  // ================= PROJECTILE SYSTEM =================
  private shootProjectile(p: Projectile) {
    this.projectiles.push(p);
  }

  private updateProjectiles(dt: number) {
    const pl = this.player;

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life -= dt;
      if (proj.life <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Check collision with player
      if (proj.isEnemy) {
        if (
          proj.x > pl.x &&
          proj.x < pl.x + pl.width &&
          proj.y > pl.y &&
          proj.y < pl.y + pl.height
        ) {
          this.hitPlayer(proj.damage, proj.vx > 0 ? 1 : -1);
          particleEngine.spawnSwordSlashSparks(proj.x, proj.y, proj.vx > 0 ? 1 : -1, false);
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  // ================= CAMERA =================
  private updateCamera(dt: number) {
    const p = this.player;
    const area = WORLD_AREAS[this.currentAreaId];

    // Look-ahead based on player movement direction
    const targetLookAhead = p.vx !== 0 ? p.facing * 45 : 0;
    this.camera.lookAhead += (targetLookAhead - this.camera.lookAhead) * 4 * dt;

    this.camera.targetX = p.x - VIRTUAL_WIDTH / 2 + this.camera.lookAhead;
    this.camera.targetY = p.y - VIRTUAL_HEIGHT / 2 - 15;

    // Smooth follow
    this.camera.x += (this.camera.targetX - this.camera.x) * 6 * dt;
    this.camera.y += (this.camera.targetY - this.camera.y) * 6 * dt;

    // Bounds clamp
    this.camera.x = Math.max(0, Math.min(this.camera.x, area.width - VIRTUAL_WIDTH));
    this.camera.y = Math.max(0, Math.min(this.camera.y, area.height - VIRTUAL_HEIGHT));

    // Shake dampening
    if (this.camera.shake > 0) {
      this.camera.shake = Math.max(0, this.camera.shake - 20 * dt);
    }
  }

  // ================= INTERACTABLES (E KEY) =================
  private checkInteractables() {
    if (!this.keys.interact || this.prevKeys.interact) return;

    const p = this.player;
    const area = WORLD_AREAS[this.currentAreaId];

    // 1. Check NPC interaction
    for (const npc of area.npcs) {
      const dist = Math.hypot(p.x - npc.x, p.y - npc.y);
      if (dist < 36) {
        soundEngine.playMenuBeep(true);
        this.activeDialogue = {
          npcName: npc.name,
          npcTitle: npc.title,
          lines: npc.dialogue,
          currentLine: 0
        };
        this.state = GameState.DIALOGUE;
        return;
      }
    }

    // 2. Check Memory Shards
    for (const shard of area.memoryShards) {
      if (p.collectedShardsInArea[shard.id]) continue;
      const dist = Math.hypot(p.x - shard.x, p.y - shard.y);
      if (dist < 36) {
        p.collectedShardsInArea[shard.id] = true;
        if (!p.memoryShards.includes(shard.id)) {
          p.memoryShards.push(shard.id);
        }
        soundEngine.playShardCollect();
        this.activeMemoryModal = shard;
        this.state = GameState.MEMORY_VIEW;
        this.saveGame();
        this.unlockAchievement('COLLECT_FIRST_SHARD');
        if (p.memoryShards.length >= 5) {
          this.unlockAchievement('COLLECT_ALL_SHARDS');
        }
        return;
      }
    }

    // 3. Check Landmarks (Shrines, Doors, Murals)
    for (const lm of area.landmarks) {
      const dist = Math.hypot(p.x - (lm.x + lm.width / 2), p.y - (lm.y + lm.height / 2));
      if (dist < 42) {
        if (lm.type === 'shrine') {
          p.hp = p.maxHp;
          p.stamina = p.maxStamina;
          p.dawnEnergy = p.maxDawnEnergy;
          p.currentCheckpoint = { areaId: this.currentAreaId, x: lm.x, y: lm.y };
          if (!p.unlockedCheckpoints.includes(lm.id)) {
            p.unlockedCheckpoints.push(lm.id);
          }
          // Holy consecration visual burst
          particleEngine.spawnCheckpointActivation(lm.x + lm.width / 2, lm.y + 12);
          this.camera.shake = Math.max(this.camera.shake, 4);

          soundEngine.playShrineRest();
          this.activeLandmarkText = `✦ SANCTUARY CONSECRATED ✦\n${lm.text || 'The light of Dawn preserves your soul. Vitality restored and checkpoint recorded.'}`;
          this.saveGame();
          this.unlockAchievement('PILGRIM_OF_ELDORIA');
          return;
        } else if (lm.type === 'door' && lm.targetArea) {
          soundEngine.playMenuBeep(true);
          this.loadArea(lm.targetArea, false);
          if (lm.targetX !== undefined && lm.targetY !== undefined) {
            p.x = lm.targetX;
            p.y = lm.targetY;
          }
          return;
        } else if (lm.type === 'mural') {
          soundEngine.playMenuBeep(true);
          this.activeLandmarkText = lm.text || null;
          return;
        }
      }
    }
  }

  // ================= MAIN CANVAS RENDER =================
  public render(ctx: CanvasRenderingContext2D) {
    // 0. If in main menu, render the cinematic 8-bit title screen vista!
    if (this.state === GameState.MENU) {
      parallaxEngine.renderTitleScreenVista(ctx, this.gameTime);
      return;
    }

    const area = WORLD_AREAS[this.currentAreaId];
    
    // Camera shake offset
    const shakeX = (Math.random() - 0.5) * this.camera.shake;
    const shakeY = (Math.random() - 0.5) * this.camera.shake;
    const camX = this.camera.x + shakeX;
    const camY = this.camera.y + shakeY;

    // 1. Render 7-Layer Parallax Background
    parallaxEngine.renderBackground(ctx, this.currentAreaId, camX, camY);

    // 2. Render Platforms
    for (const plat of area.platforms) {
      spriteRenderer.renderPlatform(ctx, plat, camX, camY);
    }

    // 3. Render Landmarks (Shrines, Doors, Murals)
    for (const lm of area.landmarks) {
      const isCurrent = this.player.currentCheckpoint?.x === lm.x &&
                        this.player.currentCheckpoint?.y === lm.y &&
                        this.player.currentCheckpoint?.areaId === this.currentAreaId;
      const isUnlocked = (this.player.unlockedCheckpoints || []).includes(lm.id);
      spriteRenderer.renderLandmark(ctx, lm, camX, camY, this.gameTime, isCurrent, isUnlocked);
    }

    // 4. Render Memory Shards (if uncollected)
    for (const shard of area.memoryShards) {
      if (!this.player.collectedShardsInArea[shard.id]) {
        spriteRenderer.renderMemoryShard(ctx, shard, camX, camY, this.gameTime);
      }
    }

    // 5. Render NPCs (Authentic 8-bit robed elder/pilgrim)
    for (const npc of area.npcs) {
      const rx = Math.floor(npc.x - camX);
      const ry = Math.floor(npc.y - camY);
      
      // Robe body
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, rx + 2, ry + 8, 14, 16);
      drawPixelRect(ctx, PALETTE.RUST, rx + 4, ry + 10, 10, 14);
      // Cowl hood
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, rx + 3, ry, 12, 9);
      drawPixelRect(ctx, PALETTE.MID_GRAY, rx + 5, ry + 3, 8, 5);
      // Wooden staff
      drawPixelRect(ctx, PALETTE.AMBER_DARK, rx, ry - 4, 2, 28);
      // Golden Pilgrim Lantern
      drawPixelRect(ctx, PALETTE.GOLD, rx + 15, ry + 12, 4, 6);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, rx + 16, ry + 13, 2, 4);

      // 8-bit interaction prompt indicator
      if (Math.hypot(this.player.x - npc.x, this.player.y - npc.y) < 40) {
        drawPixelRect(ctx, PALETTE.BLACK, rx - 12, ry - 14, 40, 10);
        drawPixelRect(ctx, PALETTE.GOLD, rx - 11, ry - 13, 38, 8);
        drawPixelRect(ctx, PALETTE.BLACK, rx - 10, ry - 12, 36, 6);
        ctx.fillStyle = PALETTE.SUN_YELLOW;
        ctx.font = '6px monospace';
        ctx.fillText('E: TALK', rx - 8, ry - 7);
      }
    }

    // 6. Render Enemies
    for (const e of this.enemies) {
      spriteRenderer.renderEnemy(ctx, e, camX, camY, this.gameTime);
    }

    // 7. Render Projectiles
    for (const p of this.projectiles) {
      spriteRenderer.renderProjectile(ctx, p, camX, camY);
    }

    // 8. Render Sir Cael (Player)
    spriteRenderer.renderPlayer(ctx, this.player, camX, camY, this.gameTime);

    // 9. Render Particles
    particleEngine.render(ctx, camX, camY);

    // 10. Dynamic 2D Lighting
    const allLights = [
      ...area.lights,
      // Player's glowing visor & dawn symbol light
      {
        x: this.player.x + this.player.width / 2,
        y: this.player.y + 12,
        radius: 65,
        color: '#38bdf8',
        intensity: 0.6,
        flickerSpeed: 3
      }
    ];

    // Add radiant glowing light indicators for checkpoints / shrines
    for (const lm of area.landmarks) {
      if (lm.type === 'shrine') {
        const isCurrent = this.player.currentCheckpoint?.x === lm.x &&
                          this.player.currentCheckpoint?.y === lm.y &&
                          this.player.currentCheckpoint?.areaId === this.currentAreaId;
        // Warm ground sanctuary illumination pool
        allLights.push({
          x: lm.x + lm.width / 2,
          y: lm.y + lm.height / 2,
          radius: isCurrent ? 140 : 110,
          color: isCurrent ? '#facc15' : '#f59e0b',
          intensity: isCurrent ? 0.95 : 0.82,
          flickerSpeed: 2.5,
          flickerOffset: 0.2
        });
        // Vertical celestial beacon light (casts illumination upwards through the darkness)
        allLights.push({
          x: lm.x + lm.width / 2,
          y: lm.y - 35,
          radius: isCurrent ? 100 : 75,
          color: isCurrent ? '#fef08a' : '#fbbf24',
          intensity: isCurrent ? 0.9 : 0.75,
          flickerSpeed: 3.5,
          flickerOffset: 0.6
        });
      }
    }
    lightingEngine.renderLights(ctx, area.ambientLight, allLights, camX, camY, this.gameTime);

    // 11. Render Foreground Parallax Elements (Layer 1)
    parallaxEngine.renderForeground(ctx, this.currentAreaId, camX, camY);
  }
}

export const game = new GameEngine();
