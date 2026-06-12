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
    const H = 160
    const radius = Math.min(W, H) / 2 - 10
    const innerRadius = radius * 0.65
    const total = data.reduce((s, d) => s + d.count, 0)

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

    const pie = d3.pie<PipelineItem>().value(d => d.count || 0.001).sort(null).padAngle(0.04)
    const arc = d3.arc<d3.PieArcDatum<PipelineItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4)

    g.selectAll('.arc')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (_, i) => SLICE_COLORS[i] ?? '#ccc')

    // Centre: total
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .style('font-size', '1.75rem')
      .style('font-weight', '700')
      .style('fill', 'var(--theme-text)')
      .text(total)

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '0.68rem')
      .style('font-weight', '500')
      .style('fill', 'var(--theme-elevation-500)')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.06em')
      .text('total')
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 160 }} />
}
