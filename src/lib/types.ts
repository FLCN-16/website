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
  cover?: { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | null
  } | null
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

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  location?: string
  start?: string
  end?: string
  gpa?: string
  status?: "completed" | "ongoing" | "expected"
  order?: number
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  year: string
  credentialUrl?: string
  order?: number
}

export interface PostCover {
  url: string
  width: number
  height: number
  alt?: string | null
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  cover?: PostCover | null
  tags?: string[] | null
  publishedAt?: string | null
  readingTime?: number | null
  featured?: boolean
}
