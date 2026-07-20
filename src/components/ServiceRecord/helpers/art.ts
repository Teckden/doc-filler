import type { CSSProperties } from 'react'
import { MedalBranchById } from '../../../data/MedalBranches'
import type { MedalBranchId } from '../../../data/MedalBranches.types'

export type StrapSize = 'sm' | 'lg' | 'xl' | 'desk'

export const GOLD = '#e6c453'

const STRAP_DIMS: Record<StrapSize, [number, number]> = {
  sm: [22, 29],
  lg: [46, 62],
  xl: [78, 104],
  desk: [58, 78],
}

export const INSIGNIA_WIDTHS: Record<StrapSize, number> = { sm: 14, lg: 30, xl: 50, desk: 38 }

export const strapStyle = (rank: number, size: StrapSize): CSSProperties => {
  const [width, height] = STRAP_DIMS[size]
  const base: CSSProperties = {
    width,
    height,
    display: 'inline-grid',
    placeItems: 'center',
    flex: 'none',
    clipPath: 'polygon(50% 0,100% 11%,100% 100%,0 100%,0 11%)',
    borderRadius: '0 0 3px 3px',
  }
  if (rank <= 0) {
    return {
      ...base,
      background: 'color-mix(in oklab,currentColor 10%,transparent)',
      boxShadow: 'inset 0 0 0 1.5px color-mix(in oklab,currentColor 35%,transparent)',
      opacity: 0.75,
    }
  }
  const background =
    rank >= 15
      ? 'repeating-linear-gradient(45deg,rgba(230,196,83,.14) 0 2px,transparent 2px 6px),repeating-linear-gradient(-45deg,#5f6849 0 3px,#525a3f 3px 6px)'
      : 'repeating-linear-gradient(45deg,#5d654a 0 3px,#535b42 3px 6px)'
  const boxShadow =
    rank <= 3
      ? 'inset 0 0 0 1px rgba(0,0,0,.3)'
      : rank <= 8
        ? 'inset 0 0 0 1px rgba(0,0,0,.38)'
        : rank <= 11
          ? 'inset 0 0 0 1px rgba(0,0,0,.3),inset 0 0 0 2.5px rgba(212,175,55,.5)'
          : rank <= 14
            ? 'inset 0 0 0 2px rgba(212,175,55,.75)'
            : 'inset 0 0 0 2.5px rgba(230,196,83,.9),inset 0 0 0 5px rgba(212,175,55,.35)'
  return { ...base, background, boxShadow }
}

export type MedalArtSize = 'sm' | 'xl'

export const medalRibbonStyle = (
  branch: MedalBranchId,
  earned: boolean,
  size: MedalArtSize,
): CSSProperties => {
  const { primary, secondary } = MedalBranchById[branch].ribbon
  const scale = size === 'xl' ? 1.7 : 1
  const width = Math.round(30 * scale)
  const height = Math.round(11 * scale)
  const stripe = Math.round(5 * scale)
  const base: CSSProperties = { width, height, borderRadius: '2px 2px 1px 1px' }
  if (earned) {
    return {
      ...base,
      background: `repeating-linear-gradient(90deg,${primary} 0 ${stripe}px,${secondary} ${stripe}px ${stripe * 2}px)`,
      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.25)',
    }
  }
  return {
    ...base,
    background: `repeating-linear-gradient(90deg,color-mix(in oklab,currentColor 22%,transparent) 0 ${stripe}px,color-mix(in oklab,currentColor 10%,transparent) ${stripe}px ${stripe * 2}px)`,
  }
}

export const medalDiscStyle = (earned: boolean, size: MedalArtSize): CSSProperties => {
  const scale = size === 'xl' ? 1.7 : 1
  const diameter = Math.round(34 * scale)
  const base: CSSProperties = {
    width: diameter,
    height: diameter,
    borderRadius: '50%',
    marginTop: -1,
    display: 'grid',
    placeItems: 'center',
  }
  if (earned) {
    return {
      ...base,
      background: 'radial-gradient(circle at 35% 30%,#ecd06b,#b8912b 72%)',
      boxShadow: '0 1px 2px rgba(0,0,0,.3),inset 0 0 0 2px rgba(120,90,20,.45)',
      color: '#5b4708',
    }
  }
  return {
    ...base,
    border: '1.5px dashed color-mix(in oklab,currentColor 45%,transparent)',
    color: 'color-mix(in oklab,currentColor 55%,transparent)',
    opacity: 0.8,
  }
}

export const kraftTagStyle = (rotate: number): CSSProperties => ({
  background: '#e9dfc6',
  color: '#4a3f28',
  fontSize: 11,
  fontWeight: 600,
  padding: '3px 9px',
  borderRadius: 2,
  boxShadow: '0 2px 6px rgba(0,0,0,.25)',
  transform: `rotate(${rotate}deg)`,
})

export type LadderDotState = 'earned' | 'current' | 'next' | 'future' | 'anonymous'

export const ladderDotStyle = (state: LadderDotState): CSSProperties => {
  if (state === 'earned') {
    return {
      width: 10,
      height: 10,
      background: '#d4af37',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.22)',
    }
  }
  if (state === 'current') {
    return {
      width: 15,
      height: 15,
      background: 'repeating-linear-gradient(45deg,#5d654a 0 2px,#535b42 2px 4px)',
      boxShadow: '0 0 0 2px var(--color-primary),inset 0 0 0 1px rgba(212,175,55,.7)',
    }
  }
  if (state === 'next') {
    return { width: 10, height: 10, border: '1.5px solid currentColor', opacity: 0.55 }
  }
  if (state === 'future') {
    return { width: 7, height: 7, background: 'currentColor', opacity: 0.12, filter: 'blur(0.5px)' }
  }
  return { width: 7, height: 7, background: 'currentColor', opacity: 0.08, filter: 'blur(1px)' }
}
