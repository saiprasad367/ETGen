// Since the lightweight-chart setup is a bit verbose for a small icon chart,
// we will just render a simplified SVG representation of a candlestick here for the list view
export default function MiniCandle({ isBullish }) {
  const color = isBullish ? 'var(--bull)' : 'var(--bear)'
  
  return (
    <svg width="60" height="40" viewBox="0 0 60 40">
      {/* Volume bars bg */}
      <rect x="5" y="30" width="8" height="10" fill="var(--grid-line-strong)" />
      <rect x="17" y="25" width="8" height="15" fill="var(--grid-line-strong)" />
      <rect x="29" y="15" width="8" height="25" fill={color} opacity="0.3" />
      <rect x="41" y="20" width="8" height="20" fill="var(--grid-line-strong)" />

      {/* Candlesticks */}
      <line x1="9" y1="10" x2="9" y2="25" stroke="var(--bear)" strokeWidth="1" />
      <rect x="7" y="14" width="4" height="8" fill="var(--bear)" />

      <line x1="21" y1="15" x2="21" y2="28" stroke="var(--bear)" strokeWidth="1" />
      <rect x="19" y="18" width="4" height="6" fill="var(--bear)" />

      <line x1="33" y1="4" x2="33" y2="22" stroke={color} strokeWidth="1" />
      <rect x="31" y="10" width="4" height="10" fill={color} />

      <line x1="45" y1="2" x2="45" y2="15" stroke={color} strokeWidth="1" />
      <rect x="43" y="4" width="4" height="8" fill={color} />
      
      {/* Pattern highlight area */}
      <rect x="25" y="0" width="26" height="40" fill={color} opacity="0.05" />
    </svg>
  )
}
