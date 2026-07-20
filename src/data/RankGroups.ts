import type { RankGroup, RankGroupId } from './RankGroups.types'

export const RankGroups: RankGroup[] = [
  {
    id: 'enlisted',
    label: { en: 'Enlisted', uk: 'Рядовий склад' },
    promotionQuip: {
      en: 'The chancellery knows you by name now.',
      uk: 'Канцелярія вже знає вас на ім’я.',
    },
  },
  {
    id: 'sergeants',
    label: { en: 'Sergeants', uk: 'Сержантський склад' },
    promotionQuip: {
      en: 'They say the papers line up the moment you walk in.',
      uk: 'Кажуть, папери шикуються, щойно ви заходите.',
    },
  },
  {
    id: 'officers',
    label: { en: 'Officers', uk: 'Офіцерський склад' },
    promotionQuip: {
      en: 'Forms sign themselves now — out of respect.',
      uk: 'Бланки тепер підписуються самі — з поваги.',
    },
  },
  {
    id: 'generals',
    label: { en: 'Generals', uk: 'Генералітет' },
    promotionQuip: {
      en: 'HQ will be writing reports about you. Legendary ones.',
      uk: 'Про вас у штабі складатимуть звіти. Легендарні.',
    },
  },
]

export const RankGroupById: Record<RankGroupId, RankGroup> = Object.fromEntries(
  RankGroups.map((group) => [group.id, group]),
) as Record<RankGroupId, RankGroup>
