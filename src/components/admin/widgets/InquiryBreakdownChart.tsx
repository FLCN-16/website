'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { InquiryData } from './InquiryBreakdown'

export function InquiryBreakdownChart({ data }: { data: InquiryData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const barColor = cs.getPropertyValue('--theme-elevation-400').trim() || '#999'

    const labelWidth = 96
    const margin = { top: 4, right: 36, bottom: 4, left: labelWidth }
    const W = Math.max(ref.current.clientWidth, 180) - margin.left - margin.right
    const rowH = 28
    const H = data.length * rowH

    svg.attr('height', H + margin.top + margin.bottom)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand().domain(data.map(d => d.type)).range([0, H]).padding(0.25)
    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.count) ?? 1]).nice().range([0, W])

    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('x', -8)
      .attr('y', d => (y(d.type) ?? 0) + y.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.type)

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.type) ?? 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.count))
      .attr('fill', barColor)
      .attr('rx', 2)

    g.selectAll('.val')
      .data(data)
      .join('text')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => (y(d.type) ?? 0) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.count)
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', minHeight: 32 }} />
}
