'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { TagData } from './TagFrequency'

export function TagFrequencyChart({ data }: { data: TagData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const trackColor = cs.getPropertyValue('--theme-elevation-100').trim() || '#eee'

    const labelWidth = 108
    const margin = { top: 4, right: 36, bottom: 4, left: labelWidth }
    const W = Math.max(ref.current.clientWidth, 180) - margin.left - margin.right
    const rowH = 26
    const H = data.length * rowH

    svg.attr('height', H + margin.top + margin.bottom)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand().domain(data.map(d => d.tag)).range([0, H]).padding(0.28)
    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.count) ?? 1]).nice().range([0, W])

    // Labels
    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('x', -10)
      .attr('y', d => (y(d.tag) ?? 0) + y.bandwidth() / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', textColor)
      .text(d => d.tag)

    // Background track
    g.selectAll('.track')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.tag) ?? 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', W)
      .attr('fill', trackColor)
      .attr('rx', 3)

    // Value bars — rank-faded: top tag full opacity, descending
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.tag) ?? 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => Math.max(x(d.count), 4))
      .attr('fill', '#6366f1')
      .attr('opacity', (_, i) => 1 - (i / Math.max(data.length - 1, 1)) * 0.5)
      .attr('rx', 3)

    // Value labels
    g.selectAll('.val')
      .data(data)
      .join('text')
      .attr('x', d => x(d.count) + 7)
      .attr('y', d => (y(d.tag) ?? 0) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', textColor)
      .text(d => d.count)
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', minHeight: 32 }} />
}
