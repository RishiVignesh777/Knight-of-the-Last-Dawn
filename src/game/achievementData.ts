export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconType: 'skull' | 'shard' | 'sword' | 'shield' | 'sun' | 'bell' | 'crown' | 'scroll' | 'flame' | 'chalice';
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'combat' | 'exploration' | 'lore' | 'mastery';
  badgeColor: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_BLOOD',
    title: 'First Strike',
    description: 'Slay your first corrupted creature in the ruins of Eldoria.',
    iconType: 'sword',
    tier: 'common',
    category: 'combat',
    badgeColor: '#f87070'
  },
  {
    id: 'DEFEAT_FIRST_BOSS',
    title: 'Fall of the Sovereign',
    description: 'Defeat the Dying King in the Sanctum of Dawn.',
    iconType: 'crown',
    tier: 'legendary',
    category: 'mastery',
    badgeColor: '#f8a020'
  },
  {
    id: 'COLLECT_FIRST_SHARD',
    title: 'Echo of the Past',
    description: 'Recover your first ancient Memory Shard.',
    iconType: 'shard',
    tier: 'common',
    category: 'lore',
    badgeColor: '#58a8f8'
  },
  {
    id: 'COLLECT_ALL_SHARDS',
    title: 'Memory Restored',
    description: 'Collect all 5 scattered Memory Shards of Eldoria.',
    iconType: 'scroll',
    tier: 'legendary',
    category: 'lore',
    badgeColor: '#c084fc'
  },
  {
    id: 'UNYIELDING_BULWARK',
    title: 'Iron Resolve',
    description: 'Successfully deflect an enemy blow using your shield.',
    iconType: 'shield',
    tier: 'common',
    category: 'combat',
    badgeColor: '#58c868'
  },
  {
    id: 'PILGRIM_OF_ELDORIA',
    title: 'Sanctuary Light',
    description: 'Kindle your first shrine checkpoint to restore hope.',
    iconType: 'flame',
    tier: 'common',
    category: 'exploration',
    badgeColor: '#f8f870'
  },
  {
    id: 'SANCTUM_WAYFARER',
    title: 'Cathedral Wayfarer',
    description: 'Reach the high halls of the Cathedral or Sunken Lake.',
    iconType: 'bell',
    tier: 'rare',
    category: 'exploration',
    badgeColor: '#88d8f8'
  },
  {
    id: 'BESTIARY_SCHOLAR',
    title: 'Chronicler of the Eclipse',
    description: 'Encounter and record 5 or more distinct fiends in the Bestiary.',
    iconType: 'skull',
    tier: 'rare',
    category: 'lore',
    badgeColor: '#e879f9'
  },
  {
    id: 'SOLAR_CONVERGENCE',
    title: 'Solar Convergence',
    description: 'Charge your Dawn Energy reservoir to maximum capacity.',
    iconType: 'sun',
    tier: 'rare',
    category: 'combat',
    badgeColor: '#facc15'
  },
  {
    id: 'THE_FINAL_DAWN',
    title: 'Knight of the Last Dawn',
    description: 'Confront the Heart of Dawn and decide the fate of Eldoria.',
    iconType: 'chalice',
    tier: 'legendary',
    category: 'mastery',
    badgeColor: '#f8f8f8'
  }
];

export const getAchievement = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id);
};
