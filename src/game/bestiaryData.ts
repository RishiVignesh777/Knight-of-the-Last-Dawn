import { EnemyType } from '../types';
import { PALETTE, drawPixelRect, drawPixelCircle, drawPixelCrystal } from './pixelArtHelper';

export interface BestiaryEntry {
  id: EnemyType;
  aliases: EnemyType[];
  name: string;
  subtitle: string;
  category: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Very High' | 'Calamity';
  threatColor: string;
  hpEstimate: string;
  habitat: string;
  loreDescription: string;
  tacticalNotes: string;
  drawPortrait: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
}

export const BESTIARY_ENTRIES: BestiaryEntry[] = [
  {
    id: EnemyType.PENITENT_GUARD,
    aliases: [EnemyType.PENITENT_GUARD, EnemyType.CORRUPTED_KNIGHT],
    name: 'Penitent Guard',
    subtitle: 'The Ashen Inquisitors of Eldoria',
    category: 'Corrupted Templar',
    threatLevel: 'Medium',
    threatColor: '#ecc25e',
    hpEstimate: '60 HP',
    habitat: "The Forgotten Village, Sorrow's Mere, Cathedral of Silence",
    loreDescription:
      "Once sworn champions of the Sunfire Order, the Penitent Guards fused their fluted steel plates to their own flesh in a desperate covenant to ward off the Eclipse. When the sun died, their sacred oaths corrupted into an agonizing, eternal vigil. Half-blinded behind their pointed barbutes, they now strike blindly at any living soul that disturbs the suffocating silence of the realm.",
    tacticalNotes:
      "Attacks with a deliberate two-stage overhead cleave. Block with your shield [L] or execute a dash evade [Shift] to slip behind their flank while their flamberge strikes the ground.",
    drawPortrait: (ctx, w, h, time) => {
      // Dark gothic portrait background with subtle stone cross
      ctx.fillStyle = '#0b0714';
      ctx.fillRect(0, 0, w, h);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, Math.floor(w / 2) - 4, 12, 8, h - 24);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, 14, Math.floor(h * 0.38), w - 28, 8);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 3) * 1.5);

      // Steel Barbute Helmet with 5-tone iron shading
      drawPixelRect(ctx, PALETTE.IRON_DEEP_SHADOW, cx - 18, cy - 26 + bob, 36, 32);
      drawPixelRect(ctx, PALETTE.IRON_SHADOW, cx - 15, cy - 24 + bob, 30, 28);
      drawPixelRect(ctx, PALETTE.IRON_BASE, cx - 12, cy - 20 + bob, 24, 22);
      drawPixelRect(ctx, PALETTE.IRON_HIGHLIGHT, cx - 8, cy - 22 + bob, 6, 16);
      drawPixelRect(ctx, PALETTE.IRON_SPECULAR, cx - 6, cy - 20 + bob, 2, 8);

      // Helmet crest ridge
      drawPixelRect(ctx, PALETTE.GOLD, cx - 3, cy - 32 + bob, 6, 8);
      drawPixelRect(ctx, PALETTE.BRASS, cx - 2, cy - 30 + bob, 4, 6);

      // Visor eye-slit with crimson-violet malevolent glow
      drawPixelRect(ctx, PALETTE.BLACK, cx - 11, cy - 8 + bob, 22, 4);
      const eyePulse = (Math.sin(time * 6) + 1) * 0.5;
      const eyeColor = eyePulse > 0.4 ? PALETTE.ARTERIAL_RED : PALETTE.CRIMSON;
      drawPixelRect(ctx, eyeColor, cx - 8, cy - 7 + bob, 7, 2);
      drawPixelRect(ctx, eyeColor, cx + 1, cy - 7 + bob, 7, 2);
      drawPixelRect(ctx, PALETTE.WHITE, cx - 6, cy - 7 + bob, 2, 1);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 3, cy - 7 + bob, 2, 1);

      // Steel Cuirass with dried blood stains and broken sun medallion
      drawPixelRect(ctx, PALETTE.IRON_DEEP_SHADOW, cx - 24, cy + 6 + bob, 48, 28);
      drawPixelRect(ctx, PALETTE.IRON_BASE, cx - 20, cy + 8 + bob, 40, 24);
      drawPixelRect(ctx, PALETTE.BURGUNDY, cx - 10, cy + 12 + bob, 20, 20);
      drawPixelRect(ctx, PALETTE.GOLD, cx - 4, cy + 16 + bob, 8, 8);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, cx - 2, cy + 18 + bob, 4, 4);
    }
  },
  {
    id: EnemyType.HOLLOW_ARCHER,
    aliases: [EnemyType.HOLLOW_ARCHER],
    name: 'Hollow Archer',
    subtitle: 'The Blinded Sentinels of the Wall',
    category: 'Penitent Marksman',
    threatLevel: 'Medium',
    threatColor: '#88d8f8',
    hpEstimate: '40 HP',
    habitat: "The Forgotten Village, Sorrow's Mere, Eldoria Capital",
    loreDescription:
      "Former royal rangers whose eyes were ritually put out with sacred ash to awaken an eerie supernatural hearing. Stationed high upon ruined ramparts and rotting rooftops, they draw bows strung with sinew to unleash black-fletched bolts long before travelers draw near.",
    tacticalNotes:
      "Fires direct high-velocity arrows in predictable intervals. Raise your shield [L] or use aerial jump slashes to take down their frail health before they can loose another volley.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#0b0714';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 2.5) * 1.5);

      // Shrouded leather & ash hood
      drawPixelRect(ctx, PALETTE.DARK_GRAY, cx - 16, cy - 24 + bob, 32, 30);
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx - 13, cy - 22 + bob, 26, 26);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 9, cy - 12 + bob, 18, 16);

      // Ash-marked blindfold band
      drawPixelRect(ctx, PALETTE.BONE_SHADOW, cx - 11, cy - 8 + bob, 22, 6);
      drawPixelRect(ctx, PALETTE.BURGUNDY, cx - 11, cy - 6 + bob, 22, 2); // Ritual blood stripe

      // Heavy Recurve Yew Bow slung behind shoulder
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, cx + 14, cy - 30 + bob, 6, 56);
      drawPixelRect(ctx, PALETTE.RUST, cx + 15, cy - 26 + bob, 4, 48);
      drawPixelRect(ctx, PALETTE.BRIGHT_GRAY, cx + 18, cy - 30 + bob, 1, 56); // Bowstring

      // Leather quiver with black-fletched arrows
      drawPixelRect(ctx, PALETTE.BLACK, cx - 22, cy - 26 + bob, 8, 20);
      drawPixelRect(ctx, PALETTE.WHITE, cx - 20, cy - 32 + bob, 4, 8); // White raven fletching

      // Tattered scout tunic
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, cx - 20, cy + 6 + bob, 40, 26);
      drawPixelRect(ctx, PALETTE.RUST, cx - 14, cy + 10 + bob, 28, 20);
    }
  },
  {
    id: EnemyType.BELL_WRAITH,
    aliases: [EnemyType.BELL_WRAITH, EnemyType.FOREST_WRAITH],
    name: 'Bell Wraith',
    subtitle: 'The Weeping Veil of Sorrow',
    category: 'Mourning Specter',
    threatLevel: 'High',
    threatColor: '#58c868',
    hpEstimate: '50 HP',
    habitat: "The Weeping Forest, Cathedral of Silence",
    loreDescription:
      "The restless souls of the Sisters of the Veil who perished in the cloisters during the first winter of the Eclipse. Floating silently within voluminous funerary shrouds, they chime tarnished brass bells that herald the departure of mortal souls and swing censers leaking necrotic soulfire.",
    tacticalNotes:
      "Hovering aerial enemy that launches tracking dark soul orbs. Time an aerial jump attack with your light slash [J] or intercept with a heavy cleave [K] as they bob downward.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#06050c';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 3.5) * 3);

      // Deep void shroud draped over head
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx - 18, cy - 28 + bob, 36, 42);
      drawPixelRect(ctx, PALETTE.DEEP_MAROON, cx - 14, cy - 24 + bob, 28, 36);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 10, cy - 14 + bob, 20, 22);

      // Twin weeping ghostly eyes with spectral mint-green glow
      const glow = Math.sin(time * 5) * 2;
      drawPixelRect(ctx, PALETTE.DARK_PINE, cx - 8, cy - 6 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.DARK_PINE, cx + 2, cy - 6 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, cx - 7, cy - 5 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.BRIGHT_GREEN, cx + 3, cy - 5 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.WHITE, cx - 6, cy - 4 + bob, 2, 1);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 4, cy - 4 + bob, 2, 1);

      // Hanging Brass Sanctuary Censer with chain
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx - 18, cy - 10 + bob, 2, 22);
      drawPixelRect(ctx, PALETTE.BRASS, cx - 22, cy + 12 + bob, 10, 10);
      drawPixelRect(ctx, PALETTE.GOLD, cx - 20, cy + 14 + bob, 6, 6);
      drawPixelCrystal(ctx, cx - 19, cy + 6 + bob, 6, 8, PALETTE.BRIGHT_GREEN, PALETTE.MINT_GREEN, PALETTE.DARK_PINE);

      // Tattered shroud hems dissolving into mist
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx - 22, cy + 14 + bob, 44, 18);
      drawPixelRect(ctx, PALETTE.MIDNIGHT_BLUE, cx - 16, cy + 22 + bob, 32, 10);
    }
  },
  {
    id: EnemyType.CATHEDRAL_BEAST,
    aliases: [EnemyType.CATHEDRAL_BEAST, EnemyType.SHADOW_BEAST],
    name: 'Cathedral Beast',
    subtitle: 'Awakened Gargoyle of the Parapets',
    category: 'Gargoyle Fiend',
    threatLevel: 'High',
    threatColor: '#f83800',
    hpEstimate: '70 HP',
    habitat: "The Weeping Forest, Sorrow's Mere, Cathedral of Silence",
    loreDescription:
      "Granite gargoyles originally carved to channel rainwater away from holy spires, animated by the dense necrotic miasma of the Eclipse. Their petrified sinews grant impossible quadrupedal speed, allowing them to sprint across battlements and pounce upon unsuspecting travelers with razor talons.",
    tacticalNotes:
      "Fast patrol pace and sudden leaping lunges. Do not retreat in a straight line; dodge roll through their leap and punish their post-landing recovery frame.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 5) * 1.5);

      // Weathered Granite Skull & Snout
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cx - 18, cy - 20 + bob, 36, 32);
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx - 14, cy - 16 + bob, 28, 24);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, cx - 10, cy - 12 + bob, 20, 16);

      // Jagged Gargoyle Horns
      drawPixelRect(ctx, PALETTE.BLACK, cx - 16, cy - 32 + bob, 6, 14);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 10, cy - 32 + bob, 6, 14);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, cx - 14, cy - 30 + bob, 3, 10);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, cx + 11, cy - 30 + bob, 3, 10);

      // Piercing Amber Feline Eyes
      drawPixelRect(ctx, PALETTE.BLACK, cx - 10, cy - 6 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 4, cy - 6 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.AMBER, cx - 9, cy - 5 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.AMBER, cx + 5, cy - 5 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.WHITE, cx - 8, cy - 5 + bob, 1, 1);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 6, cy - 5 + bob, 1, 1);

      // Exposed Stone Fangs & Open Maw
      drawPixelRect(ctx, PALETTE.BLACK, cx - 12, cy + 4 + bob, 24, 8);
      drawPixelRect(ctx, PALETTE.WHITE, cx - 10, cy + 4 + bob, 3, 5);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 7, cy + 4 + bob, 3, 5);
      drawPixelRect(ctx, PALETTE.BONE_BASE, cx - 5, cy + 4 + bob, 2, 3);
      drawPixelRect(ctx, PALETTE.BONE_BASE, cx + 3, cy + 4 + bob, 2, 3);

      // Spiked stone shoulders
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx - 24, cy + 12 + bob, 12, 18);
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx + 12, cy + 12 + bob, 12, 18);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, cx - 22, cy + 8 + bob, 4, 6);
      drawPixelRect(ctx, PALETTE.LIGHT_GRAY, cx + 18, cy + 8 + bob, 4, 6);
    }
  },
  {
    id: EnemyType.ASHEN_MONK,
    aliases: [EnemyType.ASHEN_MONK],
    name: 'Ashen Monk',
    subtitle: 'Ascetic Heretics of the Black Flame',
    category: 'Occult Cleric',
    threatLevel: 'High',
    threatColor: '#f87050',
    hpEstimate: '80 HP',
    habitat: 'Cathedral of Silence',
    loreDescription:
      "Ascetic monks who welcomed the Eclipse as righteous purgation. Wearing robes smeared in the sacred ashes of martyrs and winding wooden prayer beads around their wrists, they channel corrupted crimson hexes capable of withering the soul of any who trespass in the holy nave.",
    tacticalNotes:
      "Stands at range and chants to project seeking crimson hex spheres. Close in quickly to stagger them before the incantation completes.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#0a060a';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 3) * 1.5);

      // Coarse hemp hood & cowl
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, cx - 16, cy - 26 + bob, 32, 36);
      drawPixelRect(ctx, PALETTE.DARKEST_GRAY, cx - 12, cy - 22 + bob, 24, 30);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 8, cy - 12 + bob, 16, 18);

      // Ash-smeared gaunt visage & crimson ritual markings
      drawPixelRect(ctx, PALETTE.BONE_BASE, cx - 6, cy - 8 + bob, 12, 12);
      drawPixelRect(ctx, PALETTE.CRIMSON, cx - 6, cy - 5 + bob, 12, 2); // Painted eye mark
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, cx - 2, cy - 12 + bob, 4, 14); // Cross streak

      // Rosary prayer beads
      drawPixelRect(ctx, PALETTE.AMBER_DARK, cx - 14, cy + 10 + bob, 28, 4);
      drawPixelRect(ctx, PALETTE.GOLD, cx - 2, cy + 14 + bob, 4, 8); // Brass cruciform

      // Channeling Hex Sphere with fiery crimson particles
      const pulse = (Math.sin(time * 8) + 1) * 2;
      drawPixelCircle(ctx, PALETTE.ARTERIAL_RED, cx + 18, cy + 4 + bob, 6 + Math.floor(pulse));
      drawPixelCircle(ctx, PALETTE.MAGENTA, cx + 18, cy + 4 + bob, 4);
      drawPixelCircle(ctx, PALETTE.WHITE, cx + 18, cy + 4 + bob, 2);
    }
  },
  {
    id: EnemyType.BLOODBOUND_KNIGHT,
    aliases: [EnemyType.BLOODBOUND_KNIGHT],
    name: 'Bloodbound Knight',
    subtitle: 'Grand Executioner of the Holy Synod',
    category: 'Grand Executioner',
    threatLevel: 'Very High',
    threatColor: '#d82838',
    hpEstimate: '110 HP',
    habitat: 'Cathedral of Silence, Eldoria Capital',
    loreDescription:
      "The personal headsmen of the High Inquisitor, clad in massive brass and iron great-plates drenched in sacrificial blood. They wield heavy, serrated executioner cleavers designed to sever plate armor and bone alike.",
    tacticalNotes:
      "Unflinching poise and devastating cleave damage. Do NOT try to shield block their full downward executioner swing; dodge roll behind them and strike during their blade recovery.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#0e0408';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 2) * 1.5);

      // Heavy Fluted Great Helm with Brass Trim
      drawPixelRect(ctx, PALETTE.BLACK, cx - 18, cy - 28 + bob, 36, 34);
      drawPixelRect(ctx, PALETTE.IRON_SHADOW, cx - 15, cy - 25 + bob, 30, 28);
      drawPixelRect(ctx, PALETTE.IRON_BASE, cx - 12, cy - 22 + bob, 24, 22);
      drawPixelRect(ctx, PALETTE.BRASS, cx - 14, cy - 26 + bob, 28, 3); // Brass crown trim

      // Narrow crucifix eye-slit glowing arterial red
      drawPixelRect(ctx, PALETTE.BLACK, cx - 10, cy - 8 + bob, 20, 3);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 2, cy - 14 + bob, 4, 12);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, cx - 8, cy - 8 + bob, 16, 2);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, cx - 1, cy - 12 + bob, 2, 8);

      // Massive Blood-Stained Executioner Cleaver resting on shoulder
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx + 12, cy - 36 + bob, 12, 42);
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, cx + 14, cy - 32 + bob, 4, 34); // Blood fuller groove
      drawPixelRect(ctx, PALETTE.DEEP_BROWN, cx + 16, cy + 6 + bob, 4, 20); // Grip handle

      // Heavy Pauldrons with spiked brass studs
      drawPixelRect(ctx, PALETTE.BRASS, cx - 26, cy + 6 + bob, 14, 24);
      drawPixelRect(ctx, PALETTE.BRASS, cx + 12, cy + 6 + bob, 14, 24);
      drawPixelRect(ctx, PALETTE.CRIMSON, cx - 22, cy + 12 + bob, 8, 14); // Splattered blood
    }
  },
  {
    id: EnemyType.HOLLOW_SAINT,
    aliases: [EnemyType.HOLLOW_SAINT],
    name: 'Hollow Saint',
    subtitle: 'Weeping Colossus of the High Altar',
    category: 'Weeping Colossus',
    threatLevel: 'Very High',
    threatColor: '#f0b0f8',
    hpEstimate: '160 HP',
    habitat: 'Cathedral of Silence',
    loreDescription:
      "Towering marble statues of ancient saintly benefactors, possessed by the anguished wails of thousands who died begging for sunlight. Their carved stone faces bleed thick black ichor as they swing colossal reliquary staves in earth-shattering sweeps.",
    tacticalNotes:
      "Generates wide-radius shockwaves with each staff slam. Jump over the ground tremor and strike while the colossus resets its stance.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#08060d';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 1.8) * 1.5);

      // Golden Halo Ring radiating behind head
      drawPixelCircle(ctx, PALETTE.PALE_GOLD, cx, cy - 14 + bob, 24);
      drawPixelCircle(ctx, PALETTE.BLACK, cx, cy - 14 + bob, 20);
      drawPixelCircle(ctx, PALETTE.GOLD, cx, cy - 14 + bob, 18);
      drawPixelCircle(ctx, PALETTE.BLACK, cx, cy - 14 + bob, 16);

      // Carved Alabaster Head & Veiled Cowl
      drawPixelRect(ctx, PALETTE.BONE_DEEP_SHADOW, cx - 14, cy - 24 + bob, 28, 30);
      drawPixelRect(ctx, PALETTE.BONE_SHADOW, cx - 12, cy - 22 + bob, 24, 26);
      drawPixelRect(ctx, PALETTE.BONE_BASE, cx - 10, cy - 20 + bob, 20, 22);
      drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, cx - 8, cy - 18 + bob, 16, 18);

      // Weeping black ichor tracks streaming from closed stone eyes
      drawPixelRect(ctx, PALETTE.BLACK, cx - 6, cy - 10 + bob, 3, 14);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 3, cy - 10 + bob, 3, 14);
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx - 5, cy + 2 + bob, 2, 6);
      drawPixelRect(ctx, PALETTE.VOID_PURPLE, cx + 4, cy + 2 + bob, 2, 6);

      // Ornate Reliquary Sunburst Staff Head
      drawPixelRect(ctx, PALETTE.GOLD, cx + 18, cy - 32 + bob, 14, 14);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, cx + 21, cy - 29 + bob, 8, 8);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 23, cy - 27 + bob, 4, 4);
      drawPixelRect(ctx, PALETTE.DARK_GRAY, cx + 23, cy - 18 + bob, 4, 44); // Shaft

      // Carved marble drapery folds
      drawPixelRect(ctx, PALETTE.BONE_SHADOW, cx - 22, cy + 8 + bob, 44, 24);
      drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, cx - 16, cy + 12 + bob, 8, 18);
      drawPixelRect(ctx, PALETTE.BONE_HIGHLIGHT, cx + 8, cy + 12 + bob, 8, 18);
    }
  },
  {
    id: EnemyType.ANCIENT_GUARDIAN,
    aliases: [EnemyType.ANCIENT_GUARDIAN],
    name: 'Ancient Guardian',
    subtitle: 'Solar Automaton of the First Age',
    category: 'Solar Automaton',
    threatLevel: 'Very High',
    threatColor: '#f8a020',
    hpEstimate: '180 HP',
    habitat: 'Eldoria Capital, Sanctum of Dawn',
    loreDescription:
      "A monumental automaton forged by the First Sunwrights in the kingdom's golden dawn. Fueled by an immortal solar core, this bronze titan has guarded the passage to the Sanctum for a thousand years without faltering.",
    tacticalNotes:
      "Virtually impervious from the front. Wait for its sweeping bronze halberd thrust, then roll behind to exploit the exposed gear assembly on its back.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 2) * 1);

      // Heavy Bronze & Brass Automaton Head
      drawPixelRect(ctx, PALETTE.BLACK, cx - 18, cy - 26 + bob, 36, 32);
      drawPixelRect(ctx, PALETTE.AMBER_DARK, cx - 15, cy - 23 + bob, 30, 26);
      drawPixelRect(ctx, PALETTE.BRASS, cx - 12, cy - 20 + bob, 24, 20);
      drawPixelRect(ctx, PALETTE.GOLD, cx - 9, cy - 18 + bob, 18, 14);

      // Central Solar Core Optic Eye pulsing warm sun gold
      const eyePulse = Math.sin(time * 6) * 2;
      drawPixelCircle(ctx, PALETTE.RUST, cx, cy - 10 + bob, 8);
      drawPixelCircle(ctx, PALETTE.SUN_YELLOW, cx, cy - 10 + bob, 5 + Math.floor(eyePulse * 0.5));
      drawPixelCircle(ctx, PALETTE.WHITE, cx, cy - 10 + bob, 2);

      // Bronze crown spires resembling sun rays
      drawPixelRect(ctx, PALETTE.GOLD, cx - 16, cy - 32 + bob, 4, 8);
      drawPixelRect(ctx, PALETTE.GOLD, cx - 6, cy - 34 + bob, 4, 10);
      drawPixelRect(ctx, PALETTE.GOLD, cx + 2, cy - 34 + bob, 4, 10);
      drawPixelRect(ctx, PALETTE.GOLD, cx + 12, cy - 32 + bob, 4, 8);

      // Riveted bronze chestplate with exposed brass gears
      drawPixelRect(ctx, PALETTE.AMBER_DARK, cx - 24, cy + 6 + bob, 48, 28);
      drawPixelRect(ctx, PALETTE.BRASS, cx - 20, cy + 8 + bob, 40, 24);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 8, cy + 14 + bob, 16, 16);
      drawPixelCircle(ctx, PALETTE.PALE_GOLD, cx, cy + 22 + bob, 6);
    }
  },
  {
    id: EnemyType.DYING_KING,
    aliases: [EnemyType.DYING_KING],
    name: 'The Dying King',
    subtitle: 'Ronald IV, Vessel of the Eclipse',
    category: 'Fallen Sovereign (Final Boss)',
    threatLevel: 'Calamity',
    threatColor: '#f8f870',
    hpEstimate: '350 HP',
    habitat: 'Tower of Dawn (Sanctum of the First Dawn)',
    loreDescription:
      "Ronald IV, the last sovereign monarch of Eldoria. Driven mad with sorrow after the loss of his beloved queen, he plunged his sacred greatsword into the sleeping Void heart in a futile bid to conquer mortality. The calamity devoured the sun and cursed every soul in Eldoria. Seated upon his crumbling throne above the clouds, he awaits the arrival of a champion worthy to deliver him from his endless, weeping torment.",
    tacticalNotes:
      "A monumental three-phase battle: Phase 1 features heavy royal sword sweeps; Phase 2 introduces shadow warp slashes; Phase 3 triggers his full void corruption with cascading dark energy blasts. Preserve Dawn Energy for vital healing and burst attacks.",
    drawPortrait: (ctx, w, h, time) => {
      ctx.fillStyle = '#060209';
      ctx.fillRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const bob = Math.floor(Math.sin(time * 2.2) * 2);

      // Broken Royal Golden Crown with corrupted black spikes
      drawPixelRect(ctx, PALETTE.GOLD, cx - 18, cy - 32 + bob, 36, 12);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, cx - 16, cy - 34 + bob, 6, 10);
      drawPixelRect(ctx, PALETTE.SUN_YELLOW, cx + 10, cy - 34 + bob, 6, 10);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 4, cy - 38 + bob, 8, 16); // Corrupted void spike
      drawPixelRect(ctx, PALETTE.ARTERIAL_RED, cx - 10, cy - 28 + bob, 4, 4); // Ruby jewel
      drawPixelRect(ctx, PALETTE.CYAN_HIGHLIGHT, cx + 6, cy - 28 + bob, 4, 4); // Sapphire jewel

      // Weary gaunt king's visage & ragged silver-white hair
      drawPixelRect(ctx, PALETTE.WHITE, cx - 22, cy - 24 + bob, 8, 28);
      drawPixelRect(ctx, PALETTE.WHITE, cx + 14, cy - 24 + bob, 8, 28);
      drawPixelRect(ctx, PALETTE.BONE_BASE, cx - 14, cy - 22 + bob, 28, 22);
      drawPixelRect(ctx, PALETTE.BONE_SHADOW, cx - 10, cy - 18 + bob, 20, 16);

      // Sunken royal eyes weeping twilight tears
      drawPixelRect(ctx, PALETTE.BLACK, cx - 9, cy - 14 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 3, cy - 14 + bob, 6, 5);
      drawPixelRect(ctx, PALETTE.CRIMSON, cx - 8, cy - 13 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.CRIMSON, cx + 4, cy - 13 + bob, 4, 3);
      drawPixelRect(ctx, PALETTE.MAGENTA, cx - 7, cy - 9 + bob, 2, 7); // Void tear
      drawPixelRect(ctx, PALETTE.MAGENTA, cx + 5, cy - 9 + bob, 2, 7);

      // Royal Ermine & Velvet Mantle drenched in shadow
      drawPixelRect(ctx, PALETTE.BURGUNDY, cx - 26, cy + 2 + bob, 52, 28);
      drawPixelRect(ctx, PALETTE.PALE_STONE, cx - 24, cy + 2 + bob, 48, 6); // Ermine fur collar
      drawPixelRect(ctx, PALETTE.BLACK, cx - 18, cy + 4 + bob, 3, 3);
      drawPixelRect(ctx, PALETTE.BLACK, cx - 4, cy + 4 + bob, 3, 3);
      drawPixelRect(ctx, PALETTE.BLACK, cx + 10, cy + 4 + bob, 3, 3);

      // Broken Sunfire King Greatsword hilt
      drawPixelRect(ctx, PALETTE.GOLD, cx - 4, cy + 12 + bob, 8, 8);
      drawPixelRect(ctx, PALETTE.MID_GRAY, cx - 2, cy + 20 + bob, 4, 18);
    }
  }
];

export function getBestiaryEntry(type: EnemyType | string): BestiaryEntry | undefined {
  return BESTIARY_ENTRIES.find(entry => entry.id === type || entry.aliases.includes(type as EnemyType));
}
