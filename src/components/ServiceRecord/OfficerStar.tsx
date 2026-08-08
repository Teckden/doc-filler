const STAR_OUTLINE =
  'm 1206.0763,169.55086 19.575,33.5951 38.8817,0.1549 -19.3067,33.75 19.3067,33.75 -38.8817,0.15489 -19.575,33.59511 -19.575,-33.59511 -38.8817,-0.15489 19.3067,-33.75 -19.3067,-33.75 38.8817,-0.1549 z'

const STAR_FACETS = [
  'm 1206.0763,304.55085 v -67.5 l 19.575,33.9049 z',
  'm 1147.6196,270.80085 38.8817,0.1549 19.575,-33.9049 z',
  'm 1147.6196,203.30085 19.3067,33.75 h 39.15 z',
  'm 1206.0763,169.55086 v 67.49999 l -19.575,-33.90489 z',
  'm 1264.533,203.30086 -58.4567,33.74999 19.575,-33.90489 z',
  'm 1264.533,270.80086 -19.3067,-33.75 -39.15,-1e-5 z',
]

const STAR_RAYS = [
  'm 1186.5013,270.95575 39.15,-67.80979',
  'm 1186.5013,203.14596 39.15,67.80979',
  'm 1166.9263,237.05085 78.3,1e-5',
]

const RATIO = 118.41 / 136.5

export const OfficerStar = ({ cx, cy, size }: { cx: number; cy: number; size: number }) => (
  <svg
    x={cx - (size * RATIO) / 2}
    y={cy - size / 2}
    width={size * RATIO}
    height={size}
    viewBox="1146.87 168.8 118.41 136.5"
  >
    <path d={STAR_OUTLINE} fill="#d4aa00" />
    {STAR_FACETS.map((d) => (
      <path key={d} d={d} fill="#aa8800" />
    ))}
    {STAR_RAYS.map((d) => (
      <path key={d} d={d} fill="none" stroke="#806600" strokeWidth={3.75} />
    ))}
    <path d={STAR_OUTLINE} fill="none" stroke="#806600" strokeWidth={1.5} strokeLinecap="square" />
    <circle
      cx={1206.0763}
      cy={237.05086}
      r={7.5}
      fill="#d4aa00"
      stroke="#806600"
      strokeWidth={1.5}
      strokeLinecap="square"
    />
  </svg>
)
