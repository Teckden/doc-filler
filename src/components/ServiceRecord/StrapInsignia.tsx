import type { ReactNode } from 'react'
import { GOLD, INSIGNIA_WIDTHS, type StrapSize } from './helpers/art'

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

const star = (cy: number, r: number): ReactNode => (
  <path
    key={`s${cy}`}
    d={`M20 ${cy - r} L${20 + r * 0.26} ${cy - r * 0.26} L${20 + r} ${cy} L${20 + r * 0.26} ${cy + r * 0.26} L20 ${cy + r} L${20 - r * 0.26} ${cy + r * 0.26} L${20 - r} ${cy} L${20 - r * 0.26} ${cy - r * 0.26} Z`}
    fill={GOLD}
  />
)

export const StrapInsignia = ({ rank, size }: { rank: number; size: StrapSize }) => {
  if (rank <= 0) return null
  const width = INSIGNIA_WIDTHS[size]
  const parts: ReactNode[] = []
  if (rank === 1) {
    parts.push(
      <rect key="r" x={14} y={24} width={12} height={3.4} rx={1.6} fill={GOLD} opacity={0.9} />,
    )
  } else if (rank === 2) {
    parts.push(chevron(28, 3, 9))
  } else if (rank === 3) {
    parts.push(chevron(24, 3, 9), chevron(33, 3, 9))
  } else if (rank <= 8) {
    const count = Math.min(rank - 3, 3)
    for (let i = 0; i < count; i++) parts.push(chevron(20 + i * 9, 3.6, 10))
    if (rank === 7) {
      parts.push(<rect key="b" x={11} y={46} width={18} height={3.2} rx={1.5} fill={GOLD} />)
    }
    if (rank === 8) parts.push(star(11, 5))
  } else if (rank <= 11) {
    const count = rank - 8
    for (let i = 0; i < count; i++) parts.push(star(38 - i * 13, 4.6))
  } else if (rank <= 14) {
    const count = rank - 11
    parts.push(
      <rect key="l1" x={8.5} y={4} width={1.6} height={48} fill={GOLD} opacity={0.55} />,
      <rect key="l2" x={29.9} y={4} width={1.6} height={48} fill={GOLD} opacity={0.55} />,
    )
    for (let i = 0; i < count; i++) parts.push(star(40 - i * 15, 6))
  } else {
    const count = rank - 14
    for (let i = 0; i < count; i++) parts.push(star(34 - i * 16, 7.5))
    parts.push(chevron(48, 2.6, 9), chevron(53, 2.6, 9))
  }
  return (
    <svg width={width} height={Math.round(width * 1.4)} viewBox="0 0 40 56" aria-hidden="true">
      {parts}
    </svg>
  )
}
