export type Category = 'profile-pic' | 'anime-wallpaper' | 'natural-wallpaper';

export const CATEGORIES: Record<
  Category,
  { label: string; description: string; accent: 'sakura' | 'aurora' | 'amber' }
> = {
  'profile-pic': {
    label: 'Profile Pic',
    description: 'Sharp, expressive display pictures built for a small square frame.',
    accent: 'sakura'
  },
  'anime-wallpaper': {
    label: 'Anime Wallpaper',
    description: 'Cinematic anime scenes and characters, optimized for every screen.',
    accent: 'aurora'
  },
  'natural-wallpaper': {
    label: 'Natural Wallpaper',
    description: 'Calm, high-detail landscapes and nature scenes.',
    accent: 'amber'
  }
};

export const CATEGORY_LIST = Object.keys(CATEGORIES) as Category[];

export function isCategory(value: string): value is Category {
  return CATEGORY_LIST.includes(value as Category);
}

export const MAX_SELECTION = 100;
