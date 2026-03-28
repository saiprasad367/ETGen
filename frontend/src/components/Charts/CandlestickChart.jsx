import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export default function CandlestickChart({ data, pattern, target, stop, entry }) {
  const chartContainerRef = useRef()
  const chartRef = useRef()

  useEffect(() => {
    if (!data || !data.dates) return
    if (!chartContainerRef.current) return

    // Clean up old chart
    if (chartRef.current) {
      chartRef.current.remove()
    }

    const { dates, open, high, low, close, volume } = data
    
    // Format data for lightweight-charts
    const candleData = dates.map((d, i) => ({
      time: d, // 'YYYY-MM-DD'
      open: open[i],
      high: high[i],
      low: low[i],
      close: close[i]
    }))

    const volData = dates.map((d, i) => ({
      time: d,
      value: volume[i],
      color: close[i] >= open[i] ? 'rgba(0, 229, 160, 0.4)' : 'rgba(255, 61, 90, 0.4)'
    }))

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'var(--text-secondary)',
      },
      grid: {
        vertLines: { color: 'var(--grid-line)' },
        horzLines: { color: 'var(--grid-line)' },
      },
      timeScale: {
        borderColor: 'var(--border)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'var(--border)',
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: { color: 'var(--accent)', labelBackgroundColor: 'var(--accent)' },
        horzLine: { color: 'var(--accent)', labelBackgroundColor: 'var(--accent)' },
      }
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'var(--bull)',
      downColor: 'var(--bear)',
      borderVisible: false,
      wickUpColor: 'var(--bull)',
      wickDownColor: 'var(--bear)'
    })
    
    candlestickSeries.setData(candleData)

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Set as overlay
      scaleMargins: { top: 0.8, bottom: 0 }
    })
    
    volumeSeries.setData(volData)

    // Add Target / Stop / Entry Price Lines
    if (target) {
        candlestickSeries.createPriceLine({
            price: target,
            color: 'var(--bull)',
            lineWidth: 2,
            lineStyle: 2, // Dashed
            axisLabelVisible: true,
            title: 'Target'
        })
    }
    
    if (stop) {
        candlestickSeries.createPriceLine({
            price: stop,
            color: 'var(--bear)',
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: true,
            title: 'Stop Loss'
        })
    }
    
    if (entry) {
        candlestickSeries.createPriceLine({
            price: entry,
            color: 'var(--accent)',
            lineWidth: 1,
            lineStyle: 1, // Solid
            axisLabelVisible: true,
            title: 'Entry'
        })
    }

    chart.timeScale().fitContent()
    chartRef.current = chart

    const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
}
