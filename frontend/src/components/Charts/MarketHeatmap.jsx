import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function MarketHeatmap() {
  const containerRef = useRef()
  const [data, setData] = useState([])

  useEffect(() => {
    // Generate dummy heatmap data for demo if backend isn't ready
    axios.get(`${API}/api/heatmap`).then(res => {
        if(res.data) setData(res.data)
    }).catch(() => {
        // Fallback demo data
        const demo = [
            { sector: "IT", stocks: [
                { ticker: "TCS", name: "Tata Consultancy", market_cap: 1400000, change_pct: 1.2 },
                { ticker: "INFY", name: "Infosys", market_cap: 600000, change_pct: -0.5 },
                { ticker: "WIPRO", name: "Wipro", market_cap: 250000, change_pct: -1.2 },
                { ticker: "HCLTECH", name: "HCL Tech", market_cap: 350000, change_pct: 2.1 }
            ]},
            { sector: "Banking", stocks: [
                { ticker: "HDFCBANK", name: "HDFC Bank", market_cap: 1100000, change_pct: 0.8 },
                { ticker: "ICICIBANK", name: "ICICI Bank", market_cap: 680000, change_pct: 1.5 },
                { ticker: "SBIN", name: "State Bank", market_cap: 550000, change_pct: -0.2 }
            ]},
            { sector: "Energy", stocks: [
                { ticker: "RELIANCE", name: "Reliance", market_cap: 1800000, change_pct: -0.8 },
                { ticker: "TATAPWR", name: "Tata Power", market_cap: 150000, change_pct: 3.2, active_signal: true },
                { ticker: "ONGC", name: "ONGC", market_cap: 350000, change_pct: 0.5 }
            ]}
        ]
        setData(demo)
    })
  }, [])

  useEffect(() => {
    if (!data.length || !containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = 400

    d3.select(containerRef.current).selectAll("*").remove()

    // Create hierarchy
    const root = d3.hierarchy({ name: "market", children: data })
      .sum(d => Math.sqrt(d.market_cap || 0)) // root scale
      .sort((a, b) => b.value - a.value)

    const treemap = d3.treemap()
      .size([width, height])
      .paddingTop(24)
      .paddingRight(2)
      .paddingInner(2)

    treemap(root)

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // Color scale for change_pct (Red to Green)
    const colorScale = d3.scaleLinear()
      .domain([-3, 0, 3])
      .range(['#ff3d5a', '#3d6480', '#00e5a0'])
      .clamp(true)

    const cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    cell.append("rect")
      .attr("id", d => d.data.ticker)
      .attr("width", d => Math.max(0, d.x1 - d.x0))
      .attr("height", d => Math.max(0, d.y1 - d.y0))
      .attr("fill", d => colorScale(d.data.change_pct || 0))
      .attr("stroke", d => d.data.active_signal ? "var(--accent)" : "none")
      .attr("stroke-width", d => d.data.active_signal ? 3 : 0)
      .style("opacity", 0.85)

    // Glowing animation for active signals 
    cell.filter(d => d.data.active_signal)
        .select("rect")
        .style("animation", "card-flash 2s infinite ease-in-out")

    // Labels
    cell.append("text")
      .attr("x", 4)
      .attr("y", 16)
      .attr("fill", "white")
      .style("font-size", "11px")
      .style("font-family", "var(--font-mono)")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)")
      .text(d => {
          const w = d.x1 - d.x0
          return w > 50 ? d.data.ticker : ""
      })

    cell.append("text")
      .attr("x", 4)
      .attr("y", 32)
      .attr("fill", "white")
      .style("font-size", "10px")
      .style("font-family", "var(--font-body)")
      .text(d => {
          const w = d.x1 - d.x0
          const h = d.y1 - d.y0
          if (w > 50 && h > 40) {
              const pct = d.data.change_pct
              return `${pct >= 0 ? '+' : ''}${pct}%`
          }
          return ""
      })

    // Sector Headers
    const sectors = svg.selectAll(".sector")
      .data(root.children)
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    sectors.append("text")
      .attr("x", 4)
      .attr("y", 16)
      .attr("fill", "var(--text-muted)")
      .style("font-size", "12px")
      .style("font-family", "var(--font-display)")
      .style("text-transform", "uppercase")
      .text(d => d.data.sector)

  }, [data])

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
}
