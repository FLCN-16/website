export interface AccentSegment {
  text: string
  accent: boolean
}

export function parseAccentLine(text: string): AccentSegment[] {
  const parts: AccentSegment[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), accent: false })
    }
    parts.push({ text: match[1], accent: true })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), accent: false })
  }
  return parts
}
