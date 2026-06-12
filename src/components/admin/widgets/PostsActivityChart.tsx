'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { MonthData } from './PostsActivity'

export function PostsActivityChart({ data }: { data: MonthData[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--theme-elevation-600').trim() || '#888'
    const barColor = cs.getPropertyValue('--theme-elevation-400').trim() || '#999'
    const gridColor = cs.getPropertyValue('--theme-elevation-100').trim() || '#eee'

    const margin = { top: 10, right: 12, bottom: 36, left: 28 }
    const W = Math.max(ref.current.clientWidth, 320) - margin.left - margin.right
    const H = 180 - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, W]).padding(0.3)
    const maxCount = d3.max(data, d => d.count) ?? 1
    const y = d3.scaleLinear().domain([0, maxCount]).nice().range([H, 0])

    // Dashed grid lines
    g.append('g')
      .call(d3.axisLeft(y).tickSize(-W).tickFormat(() => '').ticks(4))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick line')
          .attr('stroke', gridColor)
          .attr('stroke-dasharray', '2,3'),
      )

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.month)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => H - y(d.count))
      .attr('fill', barColor)
      .attr('rx', 2)

    // X axis — abbreviated month name
    g.append('g')
      .attr('transform', `translate(0,${H})`)
      .call(
        d3.axisBottom(x).tickFormat(raw => {
          const [yr, mo] = (raw as string).split('-')
          return new Date(+yr, +mo - 1).toLocaleString('default', { month: 'short' })
        }),
      )
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('text').attr('fill', textColor).style('font-size', '11px'))

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(Math.min(4, maxCount)).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('text').attr('fill', textColor).style('font-size', '11px'))
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 180 }} />
}
