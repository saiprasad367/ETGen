import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const ChartWidget = ({ data, symbol }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current || chartContainerRef.current.clientWidth === 0) return;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a0a0ab',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ff4d4d',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ff4d4d',
    });

    if (data && Array.isArray(data) && data.length > 0) {
      try {
        const validData = data.filter(d => d.time && !isNaN(d.time)).sort((a,b) => a.time - b.time);
        if (validData.length > 0) {
            candleSeries.setData(validData);
            chart.timeScale().fitContent();
        }
      } catch (e) {
        console.error("Error setting chart data:", e);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center px-4">
        <h3 className="text-lg font-medium gradient-text">{symbol} Analysis</h3>
        <span className="text-xs text-secondary bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase tracking-widest">Live Pattern Engine</span>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px] border-t border-white/5 pt-4" />
    </div>
  );
};

export default ChartWidget;
