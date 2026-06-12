// ─── Site Identity Types ───────────────────────────────────────────────────────
//
// These types describe the shape of site identity data.
// Runtime values come from the Payload admin panel under Site Settings → Identity.
//
// To update your name, socials, headline, stats, and philosophy:
//   1. Open /admin in your browser
//   2. Go to Globals → Site Settings
//   3. Fill in the Identity, Social Links, and Engineering Philosophy sections

export interface Social {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'youtube'
  url: string
  label: string
}

export interface StatusBadge {
  available: boolean
  label: string
}

export interface Stat {
  value: string
  label: string
}
