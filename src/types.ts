export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  DIALOGUE = 'DIALOGUE',
  CINEMATIC = 'CINEMATIC',
  MEMORY_VIEW = 'MEMORY_VIEW',
  BESTIARY = 'BESTIARY',
  BOSS_INTRO = 'BOSS_INTRO',
  ENDING_CHOICE = 'ENDING_CHOICE',
  ENDING_CUTSCENE = 'ENDING_CUTSCENE',
  GAME_OVER = 'GAME_OVER'
}

export enum AreaId {
  VILLAGE = 'VILLAGE',
  FOREST = 'FOREST',
  LAKE = 'LAKE',
  CAPITAL = 'CAPITAL',
  CATHEDRAL = 'CATHEDRAL',
  TOWER = 'TOWER'
}

export enum PlayerAction {
  IDLE = 'IDLE',
  WALK = 'WALK',
  RUN = 'RUN',
  JUMP = 'JUMP',
  FALL = 'FALL',
  ATTACK_LIGHT = 'ATTACK_LIGHT',
  ATTACK_HEAVY = 'ATTACK_HEAVY',
  BLOCK = 'BLOCK',
  DASH = 'DASH',
  HURT = 'HURT',
  CLIMB = 'CLIMB',
  DEATH = 'DEATH',
  INTERACT = 'INTERACT'
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1
}

export enum EnemyType {
  PENITENT_GUARD = 'PENITENT_GUARD',
  BELL_WRAITH = 'BELL_WRAITH',
  ASHEN_MONK = 'ASHEN_MONK',
  CATHEDRAL_BEAST = 'CATHEDRAL_BEAST',
  HOLLOW_SAINT = 'HOLLOW_SAINT',
  BLOODBOUND_KNIGHT = 'BLOODBOUND_KNIGHT',
  // Backward-compatible aliases
  CORRUPTED_KNIGHT = 'CORRUPTED_KNIGHT',
  SHADOW_BEAST = 'SHADOW_BEAST',
  FOREST_WRAITH = 'FOREST_WRAITH',
  HOLLOW_ARCHER = 'HOLLOW_ARCHER',
  ANCIENT_GUARDIAN = 'ANCIENT_GUARDIAN',
  DYING_KING = 'DYING_KING'
}

export enum EndingType {
  SACRIFICE = 'SACRIFICE',
  NEW_DAWN = 'NEW_DAWN'
}

export interface PlayerStats {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: Direction;
  action: PlayerAction;
  frame: number;
  animTimer: number;
  
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  dawnEnergy: number;
  maxDawnEnergy: number;
  
  isGrounded: boolean;
  isClimbing: boolean;
  isDashing: boolean;
  dashTimer: number;
  dashCooldown: number;
  invincibleTimer: number;
  
  comboStep: number;
  attackTimer: number;
  attackCooldown: number;
  blockTimer: number;
  isBlocking: boolean;
  
  capeAngle: number;
  capeVel: number;
  
  memoryShards: string[];
  collectedShardsInArea: Record<string, boolean>;
  unlockedCheckpoints: string[];
  currentCheckpoint: { areaId: AreaId; x: number; y: number } | null;
  discoveredEnemies: string[];
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: Direction;
  hp: number;
  maxHp: number;
  state: 'idle' | 'patrol' | 'chase' | 'windup' | 'attack' | 'hurt' | 'dead';
  animTimer: number;
  actionTimer: number;
  attackCooldown: number;
  invincibleTimer: number;
  isGrounded: boolean;
  patrolMinX: number;
  patrolMaxX: number;
  isBoss?: boolean;
  bossPhase?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isEnemy: boolean;
  damage: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'arrow' | 'dark_orb' | 'shockwave' | 'dawn_beam';
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'one_way' | 'ladder' | 'hazard' | 'breakable';
  theme?: string;
  destroyed?: boolean;
}

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  color: string;
  intensity: number;
  flickerSpeed?: number;
  flickerOffset?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'dust' | 'leaf' | 'rain' | 'firefly' | 'blood' | 'dawn' | 'slash_trail' | 'smoke' | 'shockwave';
  alpha?: number;
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  areaId: AreaId;
  x: number;
  y: number;
  dialogue: string[];
  revealsLoreId?: string;
}

export interface MemoryShard {
  id: string;
  title: string;
  areaId: AreaId;
  areaName: string;
  x: number;
  y: number;
  memoryText: string;
  timestampHint: string;
}

export interface Landmark {
  id: string;
  type: 'shrine' | 'mural' | 'vista' | 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  prompt: string;
  text?: string;
  targetArea?: AreaId;
  targetX?: number;
  targetY?: number;
}

export interface AreaData {
  id: AreaId;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  spawnX: number;
  spawnY: number;
  ambientLight: string; // e.g., 'rgba(20, 10, 30, 0.4)'
  weather: 'sunset_dust' | 'forest_fog' | 'lake_mist' | 'storm_rain' | 'cathedral_haze' | 'dawn_rays';
  platforms: Platform[];
  enemies: Omit<Enemy, 'vx' | 'vy' | 'animTimer' | 'actionTimer' | 'invincibleTimer' | 'isGrounded'>[];
  npcs: NPCData[];
  landmarks: Landmark[];
  memoryShards: MemoryShard[];
  lights: LightSource[];
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}
