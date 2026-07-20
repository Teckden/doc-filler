import type { ReactNode } from 'react'
import type { MedalBranchId } from '../../data/MedalBranches.types'
import type { MedalArtSize } from './helpers/art'

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const GLYPHS: Record<MedalBranchId, ReactNode> = {
  marksmanship: (
    <>
      <circle cx={10} cy={10} r={5.5} {...strokeProps} />
      <path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" {...strokeProps} />
    </>
  ),
  logistics: <path d="M4 13h12v4H4zM6 8.5h8v4.5M8 4h4v4.5" {...strokeProps} />,
  supply: <path d="M3 10h11M10 5.5 15 10l-5 4.5" {...strokeProps} />,
  armory: (
    <>
      <rect x={4} y={6} width={12} height={9} rx={1.5} {...strokeProps} />
      <circle cx={10} cy={10.5} r={2.2} {...strokeProps} />
    </>
  ),
  service: (
    <path d="M5.5 3.5h9M5.5 16.5h9M6.5 3.5c0 6 7 7 7 13M13.5 3.5c0 6-7 7-7 13" {...strokeProps} />
  ),
  fieldcraft: <path d="M11.5 2 5.5 11h4l-1.5 7 6.5-9.5h-4z" fill="currentColor" />,
  mobilization: <path d="M6 18V3M6 3h9l-2.5 3L15 9H6" {...strokeProps} />,
}

export const MedalGlyph = ({ branch, size }: { branch: MedalBranchId; size: MedalArtSize }) => {
  const width = size === 'xl' ? 24 : 15
  return (
    <svg width={width} height={width} viewBox="0 0 20 20" aria-hidden="true">
      {GLYPHS[branch]}
    </svg>
  )
}
