export interface WorkEntry {
  id: string
  slug: string
  title: string
  category: string
  ord: string
  tags: string[]
  description: string
  briefing: {
    problem: string
    approach: string[]
    impact: string
    quote: string
  }
  stack: { name: string; role: string }[]
}

export interface ProjectEntry {
  id: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
  startDate?: string
  endDate?: string
  highlights: string[]
  featured?: boolean
}

export interface TimelineEntry {
  id: string
  company: string
  role: string
  start: string
  end?: string | null
  summary?: string
  tags: string[]
  order?: number
}
