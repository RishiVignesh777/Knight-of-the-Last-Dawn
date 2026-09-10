// Game internal resolution - premium 16-bit 16:9 widescreen pixel resolution (384x216)
export const VIRTUAL_WIDTH = 384;
export const VIRTUAL_HEIGHT = 216;

// Physics constants tuned for responsive 16-bit gothic platforming
export const GRAVITY = 720; // px/sec^2
export const MAX_FALL_SPEED = 400;
export const WALK_SPEED = 95;
export const RUN_SPEED = 145;
export const JUMP_FORCE = -265;
export const DASH_SPEED = 280;
export const DASH_DURATION = 0.22; // seconds
export const DASH_COOLDOWN = 0.50;
export const INVINCIBLE_TIME_AFTER_HIT = 1.0;
export const CLIMB_SPEED = 85;

// Player Combat stats
export const PLAYER_MAX_HP = 100;
export const PLAYER_MAX_STAMINA = 100;
export const PLAYER_MAX_DAWN = 100;
export const STAMINA_REGEN_RATE = 30; // per sec
export const LIGHT_ATTACK_STAMINA = 14;
export const HEAVY_ATTACK_STAMINA = 32;
export const DASH_STAMINA = 20;
export const BLOCK_STAMINA_DRAIN_RATE = 10; // per sec while holding

export const LIGHT_ATTACK_DAMAGE = 28;
export const HEAVY_ATTACK_DAMAGE = 72;

// Boss stats
export const BOSS_MAX_HP = 900;

// Area Dimensions (in virtual game pixels)
export const AREA_CONFIGS = {
  VILLAGE: { width: 1600, height: 420 },
  FOREST: { width: 1800, height: 480 },
  LAKE: { width: 1800, height: 440 },
  CAPITAL: { width: 2000, height: 500 },
  CATHEDRAL: { width: 1800, height: 560 }, // Colossal interior with high vaulted ceiling!
  TOWER: { width: 1600, height: 780 } // vertical climb up the tower!
};
