import { AreaId, AreaData, EnemyType } from '../types';

export const WORLD_AREAS: Record<AreaId, AreaData> = {
  [AreaId.VILLAGE]: {
    id: AreaId.VILLAGE,
    name: 'The Forgotten Village',
    subtitle: 'Ruins of Oakhaven at Twilight',
    width: 1400,
    height: 360,
    spawnX: 70,
    spawnY: 260,
    ambientLight: 'rgba(255, 140, 60, 0.18)',
    weather: 'sunset_dust',
    platforms: [
      // Ground floor
      { x: 0, y: 310, width: 620, height: 50, type: 'solid', theme: 'village_ground' },
      { x: 670, y: 310, width: 730, height: 50, type: 'solid', theme: 'village_ground' },
      // Ruined cottage 1
      { x: 180, y: 250, width: 90, height: 12, type: 'one_way', theme: 'wood' },
      { x: 230, y: 195, width: 80, height: 12, type: 'one_way', theme: 'wood' },
      // Broken well gap ladder
      { x: 620, y: 340, width: 50, height: 20, type: 'hazard', theme: 'spikes' },
      // Ruined cottage 2 & tower
      { x: 740, y: 240, width: 110, height: 12, type: 'one_way', theme: 'wood' },
      { x: 890, y: 200, width: 100, height: 14, type: 'solid', theme: 'stone' },
      { x: 1030, y: 230, width: 85, height: 12, type: 'one_way', theme: 'wood' },
      { x: 920, y: 200, width: 24, height: 110, type: 'ladder', theme: 'ladder' },
      // Eastern gate wall
      { x: 1180, y: 220, width: 220, height: 14, type: 'solid', theme: 'stone_gate' },
      { x: 1370, y: 120, width: 30, height: 190, type: 'solid', theme: 'stone_wall' }
    ],
    enemies: [
      {
        id: 'v_knight_1',
        type: EnemyType.CORRUPTED_KNIGHT,
        x: 360,
        y: 280,
        width: 22,
        height: 32,
        facing: 1,
        hp: 60,
        maxHp: 60,
        state: 'patrol',
        attackCooldown: 0,
        patrolMinX: 300,
        patrolMaxX: 520
      },
      {
        id: 'v_archer_1',
        type: EnemyType.HOLLOW_ARCHER,
        x: 800,
        y: 210,
        width: 20,
        height: 30,
        facing: -1,
        hp: 40,
        maxHp: 40,
        state: 'idle',
        attackCooldown: 1.2,
        patrolMinX: 750,
        patrolMaxX: 840
      },
      {
        id: 'v_knight_2',
        type: EnemyType.CORRUPTED_KNIGHT,
        x: 1080,
        y: 280,
        width: 22,
        height: 32,
        facing: -1,
        hp: 60,
        maxHp: 60,
        state: 'patrol',
        attackCooldown: 0,
        patrolMinX: 980,
        patrolMaxX: 1170
      }
    ],
    npcs: [
      {
        id: 'npc_bell_keeper',
        name: 'The Little Bell Keeper',
        title: 'Survivor of Oakhaven',
        areaId: AreaId.VILLAGE,
        x: 140,
        y: 280,
        dialogue: [
          "Sir Cael... is that truly you? Or another specter wearing the Royal Guard's mantle?",
          "The bell in the chapel fell silent the night the sky turned purple. Everyone fled toward the Capital, but none returned.",
          "They say the Heart of Dawn in the High Tower shattered into pieces. Please, Sir Knight... if there is any light left, take it to the Tower of Dawn."
        ]
      }
    ],
    landmarks: [
      {
        id: 'shrine_village',
        type: 'shrine',
        x: 80,
        y: 280,
        width: 32,
        height: 32,
        prompt: 'Rest at Village Shrine (E)',
        text: 'The embers of the Hearth Shrine flicker warmly. Your spirit and stamina are restored.'
      },
      {
        id: 'mural_village',
        type: 'mural',
        x: 480,
        y: 275,
        width: 30,
        height: 36,
        prompt: 'Examine Ruined Memorial (E)',
        text: '"To the Royal Vanguard who swore their lives to defend the Heart of Dawn. May their blade never dull."'
      },
      {
        id: 'door_to_forest',
        type: 'door',
        x: 1330,
        y: 270,
        width: 40,
        height: 42,
        prompt: 'Enter Whispering Forest (E)',
        targetArea: AreaId.FOREST,
        targetX: 60,
        targetY: 300
      }
    ],
    memoryShards: [
      {
        id: 'shard_village',
        title: 'The Knightly Oath',
        areaId: AreaId.VILLAGE,
        areaName: 'The Forgotten Village',
        x: 255,
        y: 165,
        memoryText: 'In the grand hall, young Cael knelled before the High King: "I swear by the light of Eldoria to shield the Heart of Dawn from any shadow, even unto death."',
        timestampHint: 'Before the Fall — The Anointing of Cael'
      }
    ],
    lights: [
      { x: 80, y: 290, radius: 95, color: '#f59e0b', intensity: 0.9, flickerSpeed: 4, flickerOffset: 0.2 },
      { x: 740, y: 235, radius: 65, color: '#fbbf24', intensity: 0.7, flickerSpeed: 3, flickerOffset: 1.1 }
    ]
  },

  [AreaId.FOREST]: {
    id: AreaId.FOREST,
    name: 'The Whispering Forest',
    subtitle: 'The Sunken Canopy of Elders',
    width: 1700,
    height: 420,
    spawnX: 60,
    spawnY: 330,
    ambientLight: 'rgba(10, 30, 20, 0.42)',
    weather: 'forest_fog',
    platforms: [
      // Ground with uneven roots
      { x: 0, y: 370, width: 480, height: 50, type: 'solid', theme: 'moss_ground' },
      { x: 530, y: 370, width: 550, height: 50, type: 'solid', theme: 'moss_ground' },
      { x: 1140, y: 370, width: 560, height: 50, type: 'solid', theme: 'moss_ground' },
      // Hazards between gaps
      { x: 480, y: 400, width: 50, height: 20, type: 'hazard', theme: 'brambles' },
      { x: 1080, y: 400, width: 60, height: 20, type: 'hazard', theme: 'brambles' },
      // Massive ancient branch platforms
      { x: 200, y: 295, width: 110, height: 16, type: 'one_way', theme: 'branch' },
      { x: 340, y: 220, width: 130, height: 16, type: 'one_way', theme: 'branch' },
      { x: 580, y: 260, width: 140, height: 16, type: 'one_way', theme: 'branch' },
      { x: 780, y: 200, width: 120, height: 16, type: 'one_way', theme: 'branch' },
      // Climbable thick hanging vines
      { x: 380, y: 220, width: 20, height: 150, type: 'ladder', theme: 'vine' },
      { x: 820, y: 200, width: 20, height: 170, type: 'ladder', theme: 'vine' },
      // Stone statue bridge
      { x: 940, y: 280, width: 150, height: 16, type: 'solid', theme: 'stone' },
      { x: 1280, y: 290, width: 120, height: 16, type: 'one_way', theme: 'branch' },
      { x: 1460, y: 225, width: 130, height: 16, type: 'one_way', theme: 'branch' }
    ],
    enemies: [
      {
        id: 'f_beast_1',
        type: EnemyType.SHADOW_BEAST,
        x: 320,
        y: 340,
        width: 28,
        height: 22,
        facing: 1,
        hp: 55,
        maxHp: 55,
        state: 'patrol',
        attackCooldown: 0.5,
        patrolMinX: 180,
        patrolMaxX: 450
      },
      {
        id: 'f_wraith_1',
        type: EnemyType.FOREST_WRAITH,
        x: 640,
        y: 200,
        width: 24,
        height: 32,
        facing: -1,
        hp: 45,
        maxHp: 45,
        state: 'patrol',
        attackCooldown: 1.8,
        patrolMinX: 580,
        patrolMaxX: 740
      },
      {
        id: 'f_knight_1',
        type: EnemyType.CORRUPTED_KNIGHT,
        x: 880,
        y: 340,
        width: 22,
        height: 32,
        facing: -1,
        hp: 70,
        maxHp: 70,
        state: 'patrol',
        attackCooldown: 0,
        patrolMinX: 700,
        patrolMaxX: 950
      },
      {
        id: 'f_beast_2',
        type: EnemyType.SHADOW_BEAST,
        x: 1350,
        y: 340,
        width: 28,
        height: 22,
        facing: -1,
        hp: 55,
        maxHp: 55,
        state: 'patrol',
        attackCooldown: 0.8,
        patrolMinX: 1200,
        patrolMaxX: 1550
      }
    ],
    npcs: [
      {
        id: 'npc_cartographer',
        name: 'The Old Cartographer',
        title: 'Chronicler of Eldoria',
        areaId: AreaId.FOREST,
        x: 620,
        y: 340,
        dialogue: [
          "Ah... a wanderer with steel upon his shoulder. I thought all who bore that insignia were swallowed by the gloom.",
          "Beyond these branches lies the Moonlit Lake. In the old days, the reflection of the Heart of Dawn turned the water into liquid gold.",
          "Now the waters are silent, guarded by grief. Tread softly along the cliff edges, Knight."
        ]
      }
    ],
    landmarks: [
      {
        id: 'shrine_forest',
        type: 'shrine',
        x: 140,
        y: 340,
        width: 32,
        height: 32,
        prompt: 'Rest at Sylvan Shrine (E)',
        text: 'Luminescent spores float from the ancient shrine. Wounds heal and the weight of your armor feels lighter.'
      },
      {
        id: 'door_to_village',
        type: 'door',
        x: 20,
        y: 330,
        width: 30,
        height: 42,
        prompt: 'Return to Forgotten Village (E)',
        targetArea: AreaId.VILLAGE,
        targetX: 1300,
        targetY: 270
      },
      {
        id: 'door_to_lake',
        type: 'door',
        x: 1640,
        y: 330,
        width: 40,
        height: 42,
        prompt: 'Enter The Moonlit Lake (E)',
        targetArea: AreaId.LAKE,
        targetX: 60,
        targetY: 290
      }
    ],
    memoryShards: [
      {
        id: 'shard_forest',
        title: 'The Creeping Rot',
        areaId: AreaId.FOREST,
        areaName: 'The Whispering Forest',
        x: 820,
        y: 160,
        memoryText: 'Long before the crystal shattered, black ichor bled from the roots. The court scholars warned of the darkness, but the King ordered silence, trusting Cael alone to hold the ward.',
        timestampHint: 'One Month Before the Shattering'
      }
    ],
    lights: [
      { x: 140, y: 350, radius: 100, color: '#34d399', intensity: 0.85, flickerSpeed: 2, flickerOffset: 0.5 },
      { x: 620, y: 340, radius: 75, color: '#6ee7b7', intensity: 0.7, flickerSpeed: 3, flickerOffset: 0.8 },
      { x: 820, y: 160, radius: 80, color: '#67e8f9', intensity: 0.9, flickerSpeed: 5, flickerOffset: 0.1 }
    ]
  },

  [AreaId.LAKE]: {
    id: AreaId.LAKE,
    name: 'The Moonlit Lake',
    subtitle: 'The Mirror of Forgotten Tears',
    width: 1600,
    height: 380,
    spawnX: 60,
    spawnY: 290,
    ambientLight: 'rgba(10, 15, 45, 0.45)',
    weather: 'lake_mist',
    platforms: [
      // Cliffside ledges overlooking the vast mirror lake
      { x: 0, y: 330, width: 420, height: 50, type: 'solid', theme: 'cliff' },
      { x: 500, y: 330, width: 320, height: 50, type: 'solid', theme: 'cliff' },
      { x: 920, y: 330, width: 680, height: 50, type: 'solid', theme: 'cliff' },
      // Lake water hazard below
      { x: 420, y: 360, width: 80, height: 20, type: 'hazard', theme: 'abyss' },
      { x: 820, y: 360, width: 100, height: 20, type: 'hazard', theme: 'abyss' },
      // Stepping stone platforms & ruined watchtower
      { x: 380, y: 260, width: 70, height: 14, type: 'solid', theme: 'stone' },
      { x: 470, y: 210, width: 70, height: 14, type: 'solid', theme: 'stone' },
      { x: 620, y: 230, width: 130, height: 14, type: 'one_way', theme: 'stone' },
      { x: 790, y: 250, width: 60, height: 14, type: 'solid', theme: 'stone' },
      // Ruined lakeside sanctuary
      { x: 1040, y: 240, width: 120, height: 14, type: 'one_way', theme: 'stone' },
      { x: 1220, y: 190, width: 140, height: 14, type: 'one_way', theme: 'stone' },
      { x: 1250, y: 190, width: 22, height: 140, type: 'ladder', theme: 'ladder' }
    ],
    enemies: [
      {
        id: 'l_archer_1',
        type: EnemyType.HOLLOW_ARCHER,
        x: 660,
        y: 200,
        width: 20,
        height: 30,
        facing: -1,
        hp: 45,
        maxHp: 45,
        state: 'idle',
        attackCooldown: 1.5,
        patrolMinX: 630,
        patrolMaxX: 710
      },
      {
        id: 'l_wraith_1',
        type: EnemyType.FOREST_WRAITH,
        x: 780,
        y: 180,
        width: 24,
        height: 32,
        facing: -1,
        hp: 50,
        maxHp: 50,
        state: 'patrol',
        attackCooldown: 2.0,
        patrolMinX: 740,
        patrolMaxX: 860
      },
      {
        id: 'l_beast_1',
        type: EnemyType.SHADOW_BEAST,
        x: 1100,
        y: 300,
        width: 28,
        height: 22,
        facing: -1,
        hp: 65,
        maxHp: 65,
        state: 'patrol',
        attackCooldown: 0.6,
        patrolMinX: 960,
        patrolMaxX: 1300
      },
      {
        id: 'l_knight_1',
        type: EnemyType.CORRUPTED_KNIGHT,
        x: 1420,
        y: 300,
        width: 22,
        height: 32,
        facing: -1,
        hp: 75,
        maxHp: 75,
        state: 'patrol',
        attackCooldown: 0,
        patrolMinX: 1320,
        patrolMaxX: 1540
      }
    ],
    npcs: [
      {
        id: 'npc_blind_knight',
        name: 'The Blind Knight',
        title: 'Veteran of the Vanguard',
        areaId: AreaId.LAKE,
        x: 280,
        y: 300,
        dialogue: [
          "I hear your footsteps, Sir Cael. The heavy, remorseful stride of a knight who carries the ghost of an empire.",
          "You were there when the chamber doors breached. You drew your sword against the darkness, but fear gripped you when the crystal sang its dying note.",
          "Do not seek forgiveness from the stones, Cael. Reach the Tower of Dawn and finish the oath you abandoned."
        ]
      }
    ],
    landmarks: [
      {
        id: 'shrine_lake',
        type: 'shrine',
        x: 100,
        y: 300,
        width: 32,
        height: 32,
        prompt: 'Rest at Lunar Shrine (E)',
        text: 'The moonbeams bathe the shrine in tranquil luminescence. Your heart steadies.'
      },
      {
        id: 'door_to_forest',
        type: 'door',
        x: 10,
        y: 290,
        width: 30,
        height: 42,
        prompt: 'Return to Whispering Forest (E)',
        targetArea: AreaId.FOREST,
        targetX: 1600,
        targetY: 330
      },
      {
        id: 'door_to_capital',
        type: 'door',
        x: 1540,
        y: 290,
        width: 40,
        height: 42,
        prompt: 'Ascend to The Fallen Kingdom (E)',
        targetArea: AreaId.CAPITAL,
        targetX: 60,
        targetY: 340
      }
    ],
    memoryShards: [
      {
        id: 'shard_lake',
        title: 'The Hesitation',
        areaId: AreaId.LAKE,
        areaName: 'The Moonlit Lake',
        x: 1290,
        y: 150,
        memoryText: 'The beast struck at the crystal pedestal. In that split second, Cael dodged to save his own life instead of throwing himself before the strike. The blade cleaved the Heart of Dawn into shards.',
        timestampHint: 'The Night of the Shattering'
      }
    ],
    lights: [
      { x: 100, y: 310, radius: 90, color: '#93c5fd', intensity: 0.8, flickerSpeed: 2, flickerOffset: 0.3 },
      { x: 1290, y: 150, radius: 85, color: '#bfdbfe', intensity: 0.95, flickerSpeed: 3, flickerOffset: 0.6 }
    ]
  },

  [AreaId.CAPITAL]: {
    id: AreaId.CAPITAL,
    name: 'The Fallen Kingdom',
    subtitle: 'The Citadel of Ashen Regalia',
    width: 1800,
    height: 440,
    spawnX: 60,
    spawnY: 340,
    ambientLight: 'rgba(25, 10, 25, 0.52)',
    weather: 'storm_rain',
    platforms: [
      // Street stones & ruined castle walls
      { x: 0, y: 380, width: 500, height: 60, type: 'solid', theme: 'capital_paving' },
      { x: 570, y: 380, width: 480, height: 60, type: 'solid', theme: 'capital_paving' },
      { x: 1120, y: 380, width: 680, height: 60, type: 'solid', theme: 'capital_paving' },
      // Burning rubble gaps
      { x: 500, y: 410, width: 70, height: 30, type: 'hazard', theme: 'fire' },
      { x: 1050, y: 410, width: 70, height: 30, type: 'hazard', theme: 'fire' },
      // Royal balcony platforms & grand arches
      { x: 220, y: 300, width: 120, height: 16, type: 'one_way', theme: 'marble' },
      { x: 380, y: 230, width: 140, height: 16, type: 'one_way', theme: 'marble' },
      { x: 680, y: 280, width: 130, height: 16, type: 'solid', theme: 'marble' },
      { x: 870, y: 220, width: 150, height: 16, type: 'one_way', theme: 'marble' },
      { x: 910, y: 220, width: 22, height: 160, type: 'ladder', theme: 'ladder' },
      // Colonnade bastion
      { x: 1240, y: 290, width: 130, height: 16, type: 'one_way', theme: 'marble' },
      { x: 1430, y: 230, width: 160, height: 16, type: 'solid', theme: 'marble' }
    ],
    enemies: [
      {
        id: 'c_guardian_1',
        type: EnemyType.ANCIENT_GUARDIAN,
        x: 350,
        y: 330,
        width: 32,
        height: 48,
        facing: 1,
        hp: 130,
        maxHp: 130,
        state: 'patrol',
        attackCooldown: 1.0,
        patrolMinX: 200,
        patrolMaxX: 460
      },
      {
        id: 'c_archer_1',
        type: EnemyType.HOLLOW_ARCHER,
        x: 430,
        y: 195,
        width: 20,
        height: 30,
        facing: 1,
        hp: 50,
        maxHp: 50,
        state: 'idle',
        attackCooldown: 1.2,
        patrolMinX: 390,
        patrolMaxX: 500
      },
      {
        id: 'c_knight_1',
        type: EnemyType.CORRUPTED_KNIGHT,
        x: 750,
        y: 345,
        width: 22,
        height: 32,
        facing: -1,
        hp: 85,
        maxHp: 85,
        state: 'patrol',
        attackCooldown: 0,
        patrolMinX: 620,
        patrolMaxX: 980
      },
      {
        id: 'c_guardian_2',
        type: EnemyType.ANCIENT_GUARDIAN,
        x: 1350,
        y: 330,
        width: 32,
        height: 48,
        facing: -1,
        hp: 140,
        maxHp: 140,
        state: 'patrol',
        attackCooldown: 0.8,
        patrolMinX: 1180,
        patrolMaxX: 1520
      }
    ],
    npcs: [],
    landmarks: [
      {
        id: 'shrine_capital',
        type: 'shrine',
        x: 90,
        y: 350,
        width: 32,
        height: 32,
        prompt: 'Rest at Royal Citadel Shrine (E)',
        text: 'The sacred brazier braves the pouring rain. Dawn flame shields you against the tempest.'
      },
      {
        id: 'mural_capital',
        type: 'mural',
        x: 690,
        y: 245,
        width: 36,
        height: 40,
        prompt: 'Inspect Royal Inscription (E)',
        text: '"When the sky weeps blood and the throne shatters, only the bearer of the oath may rekindle the sacred flame atop the Tower."'
      },
      {
        id: 'door_to_lake',
        type: 'door',
        x: 10,
        y: 340,
        width: 30,
        height: 42,
        prompt: 'Return to Moonlit Lake (E)',
        targetArea: AreaId.LAKE,
        targetX: 1500,
        targetY: 290
      },
      {
        id: 'door_to_tower',
        type: 'door',
        x: 1720,
        y: 340,
        width: 44,
        height: 48,
        prompt: 'Ascend to The Tower of Dawn (E)',
        targetArea: AreaId.TOWER,
        targetX: 70,
        targetY: 590
      }
    ],
    memoryShards: [
      {
        id: 'shard_capital',
        title: "The King's Madness",
        areaId: AreaId.CAPITAL,
        areaName: 'The Fallen Kingdom',
        x: 1490,
        y: 190,
        memoryText: 'The King, bleeding on his throne, scooped up the dark corrupted core of the crystal and jammed it into his own chest armor, crying: "I shall become the eternal sun!" Darkness twisted his flesh into a monster.',
        timestampHint: 'The Day Eldoria Vanished'
      }
    ],
    lights: [
      { x: 90, y: 355, radius: 95, color: '#f97316', intensity: 0.9, flickerSpeed: 4, flickerOffset: 0.2 },
      { x: 535, y: 400, radius: 80, color: '#ef4444', intensity: 0.8, flickerSpeed: 6, flickerOffset: 0.4 },
      { x: 1085, y: 400, radius: 80, color: '#ef4444', intensity: 0.8, flickerSpeed: 5, flickerOffset: 0.9 },
      { x: 1490, y: 190, radius: 85, color: '#fbbf24', intensity: 0.9, flickerSpeed: 3, flickerOffset: 0.3 }
    ]
  },

  [AreaId.TOWER]: {
    id: AreaId.TOWER,
    name: 'The Tower of Dawn',
    subtitle: 'Above the Sea of Clouds',
    width: 1500,
    height: 680,
    spawnX: 70,
    spawnY: 610,
    ambientLight: 'rgba(30, 20, 50, 0.35)',
    weather: 'dawn_rays',
    platforms: [
      // Base sanctuary floor
      { x: 0, y: 640, width: 480, height: 40, type: 'solid', theme: 'celestial_stone' },
      // Ascending staircases & floating celestial platforms
      { x: 180, y: 560, width: 110, height: 16, type: 'one_way', theme: 'crystal_gold' },
      { x: 60, y: 490, width: 120, height: 16, type: 'one_way', theme: 'crystal_gold' },
      { x: 220, y: 430, width: 140, height: 16, type: 'one_way', theme: 'crystal_gold' },
      { x: 400, y: 380, width: 130, height: 16, type: 'solid', theme: 'celestial_stone' },
      { x: 410, y: 380, width: 22, height: 260, type: 'ladder', theme: 'ladder' },
      // Mid-tower floating ruins above clouds
      { x: 580, y: 330, width: 120, height: 16, type: 'one_way', theme: 'crystal_gold' },
      { x: 740, y: 280, width: 130, height: 16, type: 'one_way', theme: 'crystal_gold' },
      { x: 900, y: 240, width: 140, height: 16, type: 'solid', theme: 'celestial_stone' },
      // The Summit Sanctuary Arena (Boss arena)
      { x: 1040, y: 200, width: 440, height: 40, type: 'solid', theme: 'apex_dais' },
      { x: 1120, y: 135, width: 100, height: 14, type: 'one_way', theme: 'crystal_gold' },
      { x: 1320, y: 135, width: 100, height: 14, type: 'one_way', theme: 'crystal_gold' }
    ],
    enemies: [
      {
        id: 't_guardian_1',
        type: EnemyType.ANCIENT_GUARDIAN,
        x: 260,
        y: 390,
        width: 32,
        height: 48,
        facing: 1,
        hp: 150,
        maxHp: 150,
        state: 'patrol',
        attackCooldown: 1.0,
        patrolMinX: 230,
        patrolMaxX: 350
      },
      {
        id: 't_wraith_1',
        type: EnemyType.FOREST_WRAITH,
        x: 640,
        y: 280,
        width: 24,
        height: 32,
        facing: -1,
        hp: 60,
        maxHp: 60,
        state: 'patrol',
        attackCooldown: 1.6,
        patrolMinX: 590,
        patrolMaxX: 720
      },
      // The Final Boss: The Dying King
      {
        id: 'boss_dying_king',
        type: EnemyType.DYING_KING,
        x: 1300,
        y: 130,
        width: 44,
        height: 68,
        facing: -1,
        hp: 800,
        maxHp: 800,
        state: 'idle',
        attackCooldown: 1.5,
        patrolMinX: 1060,
        patrolMaxX: 1440,
        isBoss: true,
        bossPhase: 1
      }
    ],
    npcs: [],
    landmarks: [
      {
        id: 'shrine_tower',
        type: 'shrine',
        x: 80,
        y: 610,
        width: 32,
        height: 32,
        prompt: 'Rest at Apex Shrine (E)',
        text: 'The air smells of ozone and morning light. The final dawn awaits above.'
      },
      {
        id: 'door_to_capital',
        type: 'door',
        x: 10,
        y: 600,
        width: 30,
        height: 42,
        prompt: 'Descend to The Fallen Kingdom (E)',
        targetArea: AreaId.CAPITAL,
        targetX: 1660,
        targetY: 340
      }
    ],
    memoryShards: [
      {
        id: 'shard_tower',
        title: 'The Final Promise',
        areaId: AreaId.TOWER,
        areaName: 'The Tower of Dawn',
        x: 930,
        y: 200,
        memoryText: '"When the final light reaches the tower, remember what you promised." It was the dying Queen who spoke those words into Cael\'s mind as she perished. The light can be transferred into a living knight... but at the cost of his mortal soul.',
        timestampHint: 'The Tower Pinnacle'
      }
    ],
    lights: [
      { x: 80, y: 615, radius: 100, color: '#fef08a', intensity: 0.9, flickerSpeed: 2, flickerOffset: 0.1 },
      { x: 930, y: 200, radius: 90, color: '#facc15', intensity: 0.95, flickerSpeed: 3, flickerOffset: 0.5 },
      { x: 1260, y: 140, radius: 150, color: '#fbbf24', intensity: 0.9, flickerSpeed: 4, flickerOffset: 0.7 }
    ]
  }
};
