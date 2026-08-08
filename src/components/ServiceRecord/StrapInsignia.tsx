import type { ReactNode } from 'react'
import { GOLD, INSIGNIA_WIDTHS, type StrapSize } from './helpers/art'
import { OfficerStar } from './OfficerStar'
import { OfficerBraid } from './OfficerBraid'
import { OfficerMaces } from './OfficerMaces'

const chevron = (y: number, strokeWidth: number, halfWidth: number): ReactNode => (
  <path
    key={`c${y}`}
    d={`M${20 - halfWidth} ${y} L20 ${y - halfWidth * 0.7} L${20 + halfWidth} ${y}`}
    stroke={GOLD}
    strokeWidth={strokeWidth}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

const rocker = (y: number, halfWidth: number): ReactNode => (
  <path
    key={`a${y}`}
    d={`M${20 - halfWidth} ${y} Q20 ${y + 6} ${20 + halfWidth} ${y}`}
    stroke={GOLD}
    strokeWidth={3.2}
    fill="none"
    strokeLinecap="round"
  />
)

const star = (cy: number, r: number): ReactNode => (
  <OfficerStar key={`s${cy}`} cx={20} cy={cy} size={r * 2} />
)

const braid = (): ReactNode => <OfficerBraid key="p" x={4} y={44} width={32} />

const maces = (): ReactNode => <OfficerMaces key="m" x={9} y={35.4} width={22} />

export const StrapInsignia = ({ rank, size }: { rank: number; size: StrapSize }) => {
  if (rank <= 0) return null
  const width = INSIGNIA_WIDTHS[size]
  const parts: ReactNode[] = []
  if (rank === 2) {
    parts.push(<rect key="r" x={11} y={26.4} width={18} height={3.2} rx={1.5} fill={GOLD} />)
  } else if (rank >= 3 && rank <= 6) {
    const count = rank - 2
    const bottom = 28 + (count - 1) * 4
    for (let i = 0; i < count; i++) parts.push(chevron(bottom - i * 8, 3.2, 9))
  } else if (rank === 7) {
    for (let i = 0; i < 4; i++) parts.push(chevron(40 - i * 8, 3.2, 9))
    parts.push(rocker(46, 9))
  } else if (rank === 8) {
    parts.push(chevron(14, 3, 9), chevron(33, 6, 13), rocker(45, 11))
  } else if (rank >= 9 && rank <= 11) {
    const count = rank === 11 ? 4 : rank - 8
    const top = 26 - ((count - 1) * 11) / 2
    for (let i = 0; i < count; i++) parts.push(star(top + i * 11, 5.2))
  } else if (rank >= 12 && rank <= 14) {
    const count = rank - 11
    for (let i = 0; i < count; i++) parts.push(star(36 - i * 14, 7))
    parts.push(braid())
  } else if (rank >= 15) {
    const count = rank === 16 ? 4 : 1
    for (let i = 0; i < count; i++) parts.push(star(29.8 - i * 8.2, 4.8))
    parts.push(maces())
  }
  return (
    <svg width={width} height={Math.round(width * 1.4)} viewBox="0 0 40 56" aria-hidden="true">
      {parts}
    </svg>
  )
}
