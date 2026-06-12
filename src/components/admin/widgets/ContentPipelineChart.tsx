'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { PipelineItem } from './ContentPipeline'

const SLICE_COLORS = ['#22c55e', '#f59e0b']

export function ContentPipelineChart({ data }: { data: PipelineItem[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const W = Math.max(ref.current.clientWidth, 120)
    const H = 150
    const radius = Math.min(W, H) / 2 - 8
    const innerRadius = radius * 0.62
    const total = data.reduce((s, d) => s + d.count, 0)

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

    const pie = d3.pie<PipelineItem>().value(d => d.count || 0.001).sort(null)
    const arc = d3.arc<d3.PieArcDatum<PipelineItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)

    g.selectAll('.arc')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (_, i) => SLICE_COLORS[i] ?? '#ccc')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.15em')
      .style('font-size', '1.5rem')
      .style('font-weight', '700')
      .style('fill', 'var(--theme-text)')
      .text(total)

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .style('font-size', '0.72rem')
      .style('fill', 'var(--theme-elevation-500)')
      .text('items')
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 150 }} />
}
