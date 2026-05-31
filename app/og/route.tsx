import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { site } from '@/content/site'

export const dynamic = 'force-dynamic'

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.join(process.cwd(), 'public', 'fonts', filename)
  const buf = await readFile(fontPath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

function titleFontSize(title: string): number {
  if (title.length < 50) return 64
  if (title.length < 80) return 48
  return 38
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title')
  const kind = searchParams.get('kind') ?? ''
  const desc = searchParams.get('desc') ?? ''

  if (!title) {
    return new Response('title param is required', { status: 400 })
  }

  let interRegular: ArrayBuffer, interSemiBold: ArrayBuffer, jetbrainsMono: ArrayBuffer
  try {
    ;[interRegular, interSemiBold, jetbrainsMono] = await Promise.all([
      loadFont('Inter-Regular.woff'),
      loadFont('Inter-SemiBold.woff'),
      loadFont('JetBrainsMono-Regular.woff'),
    ])
  } catch (err) {
    console.error('[og] font load failed:', err)
    return new Response('font load error', { status: 500 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          padding: '60px 72px',
        }}
      >
        {/* Kind label */}
        {kind ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', color: '#2ecc8e', fontSize: '14px', fontFamily: '"JetBrains Mono"' }}>{'>'}</div>
            <div
              style={{
                display: 'flex',
                color: '#a3a3a3',
                fontSize: '13px',
                fontFamily: '"JetBrains Mono"',
                letterSpacing: '0.15em',
              }}
            >
              {kind}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '40px', height: '21px', display: 'flex' }} />
        )}

        {/* Title + description */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              color: '#fafafa',
              fontSize: `${titleFontSize(title)}px`,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              fontFamily: '"Inter"',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {desc ? (
            <div
              style={{
                color: '#737373',
                fontSize: '20px',
                marginTop: '24px',
                lineHeight: 1.5,
                fontFamily: '"Inter"',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {desc}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '28px',
            marginTop: '32px',
          }}
        >
          <div style={{ display: 'flex', color: '#a3a3a3', fontSize: '16px', fontFamily: '"Inter"' }}>
            {site.name} · {site.url.replace('https://', '')}
          </div>
          <div style={{ display: 'flex', color: '#525252', fontSize: '14px', fontFamily: '"JetBrains Mono"' }}>
            @{site.handle}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: jetbrainsMono, weight: 400, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
    }
  )
}
