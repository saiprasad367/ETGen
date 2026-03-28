import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function PortfolioImpact() {
  const data = [
    { date: 'Mon', impact: 4500, stock: 'TATAPWR' },
    { date: 'Tue', impact: 1200, stock: 'INFY' },
    { date: 'Wed', impact: -800, stock: 'RELIANCE' },
    { date: 'Thu', impact: 3200, stock: 'TITAN' },
    { date: 'Fri', impact: 8500, stock: 'HDFCBANK', label: 'Bias Block Saved' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '12px', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{data.stock} • {label}</p>
          <p style={{ margin: '4px 0 0', fontSize: '16px', fontFamily: 'var(--font-mono)', color: data.impact >= 0 ? 'var(--bull)' : 'var(--bear)' }}>
            {data.impact >= 0 ? '+' : ''}₹{data.impact}
          </p>
          {data.label && <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--accent)' }}>{data.label}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" stroke="var(--border)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <YAxis stroke="var(--border)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'var(--bg-elevated)' }} content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="var(--border-active)" />
          <Bar
            dataKey="impact"
            fill="var(--bull)"
            radius={[4, 4, 4, 4]}
            shape={(props) => {
              const { fill, x, y, width, height } = props
              const val = data[props.index].impact
              const finalFill = val >= 0 ? 'var(--bull)' : 'var(--bear)'
              return <rect x={x} y={val >= 0 ? y : y + height} width={width} height={Math.abs(height)} fill={finalFill} opacity={0.8} rx="4" ry="4" />
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
