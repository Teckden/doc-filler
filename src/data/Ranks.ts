import type { Rank } from './Ranks.types'

export const Ranks: Rank[] = [
  {
    index: 0,
    name: { en: 'Civilian', uk: 'Цивільний' },
    shortName: { en: 'Civilian', uk: 'Цивільний' },
    rankGroup: null,
    requirements: {
      exports: 0,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 1,
    name: { en: 'Recruit', uk: 'Рекрут' },
    shortName: { en: 'Recruit', uk: 'Рекрут' },
    rankGroup: 'enlisted',
    requirements: {
      exports: 0,
      medals: {
        required: ['mobilization'],
        count: 0,
      },
    },
  },
  {
    index: 2,
    name: { en: 'Soldier', uk: 'Солдат' },
    shortName: { en: 'Soldier', uk: 'Солдат' },
    rankGroup: 'enlisted',
    requirements: {
      exports: 3,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 3,
    name: { en: 'Senior Soldier', uk: 'Старший солдат' },
    shortName: { en: 'Sr. Soldier', uk: 'Ст. солдат' },
    rankGroup: 'enlisted',
    requirements: {
      exports: 7,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 4,
    name: { en: 'Junior Sergeant', uk: 'Молодший сержант' },
    shortName: { en: 'Jr. Sergeant', uk: 'Мол. сержант' },
    rankGroup: 'sergeants',
    requirements: {
      exports: 12,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 5,
    name: { en: 'Sergeant', uk: 'Сержант' },
    shortName: { en: 'Sergeant', uk: 'Сержант' },
    rankGroup: 'sergeants',
    requirements: {
      exports: 20,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 6,
    name: { en: 'Senior Sergeant', uk: 'Старший сержант' },
    shortName: { en: 'Sr. Sergeant', uk: 'Ст. сержант' },
    rankGroup: 'sergeants',
    requirements: {
      exports: 30,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 7,
    name: { en: 'Chief Sergeant', uk: 'Головний сержант' },
    shortName: { en: 'Chief Sergeant', uk: 'Гол. сержант' },
    rankGroup: 'sergeants',
    requirements: {
      exports: 45,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 8,
    name: { en: 'Master Sergeant', uk: 'Майстер-сержант' },
    shortName: { en: 'Master Sergeant', uk: 'Майстер-сержант' },
    rankGroup: 'sergeants',
    requirements: {
      exports: 60,
      medals: {
        required: [],
        count: 0,
      },
    },
  },
  {
    index: 9,
    name: { en: 'Junior Lieutenant', uk: 'Молодший лейтенант' },
    shortName: { en: 'Jr. Lieutenant', uk: 'Мол. лейтенант' },
    rankGroup: 'officers',
    requirements: {
      exports: 80,
      medals: {
        required: ['direct-hit'],
        count: 0,
      },
    },
  },
  {
    index: 10,
    name: { en: 'Lieutenant', uk: 'Лейтенант' },
    shortName: { en: 'Lieutenant', uk: 'Лейтенант' },
    rankGroup: 'officers',
    requirements: {
      exports: 100,
      medals: {
        required: ['quartermaster'],
        count: 0,
      },
    },
  },
  {
    index: 11,
    name: { en: 'Captain', uk: 'Капітан' },
    shortName: { en: 'Captain', uk: 'Капітан' },
    rankGroup: 'officers',
    requirements: {
      exports: 130,
      medals: {
        required: ['marksman'],
        count: 0,
      },
    },
  },
  {
    index: 12,
    name: { en: 'Major', uk: 'Майор' },
    shortName: { en: 'Major', uk: 'Майор' },
    rankGroup: 'officers',
    requirements: {
      exports: 160,
      medals: {
        required: ['seasoned'],
        count: 0,
      },
    },
  },
  {
    index: 13,
    name: { en: 'Lieutenant Colonel', uk: 'Підполковник' },
    shortName: { en: 'Lt. Colonel', uk: 'Підполковник' },
    rankGroup: 'officers',
    requirements: {
      exports: 200,
      medals: {
        required: ['arsenal'],
        count: 0,
      },
    },
  },
  {
    index: 14,
    name: { en: 'Colonel', uk: 'Полковник' },
    shortName: { en: 'Colonel', uk: 'Полковник' },
    rankGroup: 'officers',
    requirements: {
      exports: 250,
      medals: {
        required: ['veteran'],
        count: 0,
      },
    },
  },
  {
    index: 15,
    name: { en: 'Brigadier General', uk: 'Бригадний генерал' },
    shortName: { en: 'Brig. General', uk: 'Бриг. генерал' },
    rankGroup: 'generals',
    requirements: {
      exports: 300,
      medals: {
        required: ['old-guard'],
        count: 10,
      },
    },
  },
  {
    index: 16,
    name: { en: 'General', uk: 'Генерал' },
    shortName: { en: 'General', uk: 'Генерал' },
    rankGroup: 'generals',
    requirements: {
      exports: 400,
      medals: {
        required: [],
        count: 14,
      },
    },
  },
]

export const MAX_RANK = Ranks.length - 1
