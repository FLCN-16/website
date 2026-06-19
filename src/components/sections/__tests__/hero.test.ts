import { describe, it, expect } from 'vitest'
import { parseAccentLine } from '@/lib/parse-accent-line'

describe('parseAccentLine', () => {
  it('returns a single plain segment when there are no markers', () => {
    expect(parseAccentLine('Hello world')).toEqual([
      { text: 'Hello world', accent: false },
    ])
  })

  it('returns a single accent segment for a fully-marked string', () => {
    expect(parseAccentLine('**bold**')).toEqual([
      { text: 'bold', accent: true },
    ])
  })

  it('splits mixed text into plain and accent segments', () => {
    expect(parseAccentLine('I build **fast**, **reliable** software')).toEqual([
      { text: 'I build ', accent: false },
      { text: 'fast', accent: true },
      { text: ', ', accent: false },
      { text: 'reliable', accent: true },
      { text: ' software', accent: false },
    ])
  })

  it('returns an empty array for an empty string', () => {
    expect(parseAccentLine('')).toEqual([])
  })
})
