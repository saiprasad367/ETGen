import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function RadarChart({ signal }) {
  const isBull = signal.sentiment === 'bullish'
  const color = isBull ? '#00e5a0' : '#ff3d5a'

  // Generate radar data based on confidence and signal type
  const conf = signal.confidence
  
  const data = [
    { subject: 'Filing Strength', A: signal.filing_found ? 90 : 30 },
    { subject: 'Pattern Quality', A: conf > 80 ? 95 : conf },
    { subject: 'Bias Safety', A: signal.bias_ok ? 100 : 20 },
    { subject: 'Volume Confirm', A: Math.min(100, (signal.volume_ratio || 1) * 30) },
    { subject: 'Momentum', A: parseInt(signal.metrics?.RSI || 50) * 1.5 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="var(--grid-line-strong)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Signal"
          dataKey="A"
          stroke={color}
          fill={color}
          fillOpacity={0.3}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
