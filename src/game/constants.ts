// Game internal resolution - authentic 8-bit 16:9 pixel resolution (320x180)
export const VIRTUAL_WIDTH = 320;
export const VIRTUAL_HEIGHT = 180;

// Physics constants tuned for crisp 8-bit platforming
export const GRAVITY = 640; // px/sec^2
export const MAX_FALL_SPEED = 360;
export const WALK_SPEED = 85;
export const RUN_SPEED = 125;
export const JUMP_FORCE = -240;
export const DASH_SPEED = 240;
export const DASH_DURATION = 0.20; // seconds
export const DASH_COOLDOWN = 0.55;
export const INVINCIBLE_TIME_AFTER_HIT = 1.0;
export const CLIMB_SPEED = 75;

// Player Combat stats
export const PLAYER_MAX_HP = 100;
export const PLAYER_MAX_STAMINA = 100;
export const PLAYER_MAX_DAWN = 100;
export const STAMINA_REGEN_RATE = 28; // per sec
export const LIGHT_ATTACK_STAMINA = 15;
export const HEAVY_ATTACK_STAMINA = 35;
export const DASH_STAMINA = 22;
export const BLOCK_STAMINA_DRAIN_RATE = 12; // per sec while holding

export const LIGHT_ATTACK_DAMAGE = 25;
export const HEAVY_ATTACK_DAMAGE = 65;

// Boss stats
export const BOSS_MAX_HP = 800;

// Area Dimensions (in virtual game pixels)
export const AREA_CONFIGS = {
  VILLAGE: { width: 1400, height: 360 },
  FOREST: { width: 1700, height: 420 },
  LAKE: { width: 1600, height: 380 },
  CAPITAL: { width: 1800, height: 440 },
  TOWER: { width: 1500, height: 680 } // vertical climb up the tower!
};
