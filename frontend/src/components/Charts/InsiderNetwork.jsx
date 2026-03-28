import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function InsiderNetwork() {
  const containerRef = useRef()

  useEffect(() => {
    // Demo network data for hackathon visualization
    const data = {
      nodes: [
        { id: "Tata Power", group: "company", size: 40 },
        { id: "NTPC", group: "company", size: 30 },
        { id: "Reliance", group: "company", size: 50 },
        { id: "Entity A (Inst)", group: "buyer", size: 15 },
        { id: "Entity B (Promoter)", group: "buyer", size: 20 },
        { id: "Entity C (FII)", group: "seller", size: 15 }
      ],
      links: [
        { source: "Entity A (Inst)", target: "Tata Power", value: 5, type: "buy" },
        { source: "Entity A (Inst)", target: "NTPC", value: 3, type: "buy" },
        { source: "Entity B (Promoter)", target: "Reliance", value: 8, type: "buy" },
        { source: "Entity C (FII)", target: "Tata Power", value: 4, type: "sell" }
      ]
    }

    const width = containerRef.current.clientWidth || 300
    const height = 400

    d3.select(containerRef.current).selectAll("*").remove()

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => d.value)
      .attr("stroke", d => d.type === "buy" ? "var(--bull)" : "var(--bear)")
      .attr("stroke-opacity", 0.6)

    // Nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => Math.max(10, d.size / 2))
      .attr("fill", d => d.group === "company" ? "var(--bg-elevated)" : (d.group === "buyer" ? "var(--bull)" : "var(--bear)"))
      .attr("stroke", d => d.group === "company" ? "var(--border-active)" : "none")
      .attr("stroke-width", 2)
      .call(drag(simulation))

    // Labels
    const label = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text(d => d.id)
      .style("font-size", "11px")
      .style("fill", "var(--text-primary)")
      .style("font-family", "var(--font-body)")

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      node
        .attr("cx", d => d.x = Math.max(20, Math.min(width - 20, d.x)))
        .attr("cy", d => d.y = Math.max(20, Math.min(height - 20, d.y)))
      label
        .attr("x", d => d.x)
        .attr("y", d => d.y)
    })

    function drag(simulation) {
      return d3.drag()
        .on("start", e => { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
        .on("drag", e => { e.subject.fx = e.x; e.subject.fy = e.y; })
        .on("end", e => { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; })
    }

  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
}
