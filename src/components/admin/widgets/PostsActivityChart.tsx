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
    const textColor = cs.getPropertyValue('--theme-elevation-500').trim() || '#888'
    const gridColor = cs.getPropertyValue('--theme-elevation-100').trim() || '#eee'

    const margin = { top: 12, right: 12, bottom: 36, left: 28 }
    const W = Math.max(ref.current.clientWidth, 320) - margin.left - margin.right
    const H = 160 - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const today = new Date()
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, W]).padding(0.35)
    const maxCount = Math.max(d3.max(data, d => d.count) ?? 1, 1)
    const y = d3.scaleLinear().domain([0, maxCount]).nice().range([H, 0])

    // Grid lines
    g.append('g')
      .call(d3.axisLeft(y).tickSize(-W).tickFormat(() => '').ticks(4))
      .call(grp => grp.select('.domain').remove())
      .call(grp =>
        grp.selectAll('.tick line')
          .attr('stroke', gridColor)
          .attr('stroke-dasharray', '3,3'),
      )

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.month)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => Math.max(H - y(d.count), d.count > 0 ? 2 : 0))
      .attr('fill', d => d.month === currentMonth ? '#818cf8' : '#6366f1')
      .attr('opacity', d => d.month === currentMonth ? 1 : 0.7)
      .attr('rx', 3)

    // X axis — show year suffix on January ticks
    g.append('g')
      .attr('transform', `translate(0,${H})`)
      .call(
        d3.axisBottom(x).tickFormat(raw => {
          const [yr, mo] = (raw as string).split('-')
          const d = new Date(+yr, +mo - 1)
          const label = d.toLocaleString('default', { month: 'short' })
          return +mo === 1 ? `${label} '${yr.slice(2)}` : label
        }),
      )
      .call(grp => grp.select('.domain').remove())
      .call(grp => grp.selectAll('.tick line').remove())
      .call(grp =>
        grp.selectAll('text')
          .attr('fill', (_, i) => {
            const m = data[i]?.month
            return m === currentMonth ? '#818cf8' : textColor
          })
          .style('font-size', '11px'),
      )

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(Math.min(4, maxCount)).tickFormat(d3.format('d')))
      .call(grp => grp.select('.domain').remove())
      .call(grp => grp.selectAll('.tick line').remove())
      .call(grp => grp.selectAll('text').attr('fill', textColor).style('font-size', '11px'))
  }, [data])

  return <svg ref={ref} className="flcn-chart" style={{ width: '100%', height: 160 }} />
}
