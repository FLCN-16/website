export const CACHE_TAGS = {
  posts: 'posts',
  post: (slug: string) => `post-${slug}`,
  work: 'work',
  projects: 'projects',
  home: 'home',
  pages: 'pages',
  page: (slug: string) => `page-${slug}`,
  timeline: 'timeline',
  education: 'education',
  certifications: 'certifications',
  siteSettings: 'site-settings',
} as const
