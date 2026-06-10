import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { site } from '@/content/site'

export const dynamic = 'force-dynamic'

const GREEN = '#2ecc8e'

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.join(process.cwd(), 'public', 'fonts', filename)
  const buf = await readFile(fontPath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

/** Falcon logo as a data URI, recolored — the source SVG paints via a <style> block */
async function loadLogo(color: string): Promise<string> {
  const svgPath = path.join(process.cwd(), 'public', 'logo.svg')
  const raw = await readFile(svgPath, 'utf-8')
  const svg = raw
    .replace(/<style[\s\S]*?<\/style>/, '')
    .replace(/class="st1"/g, `fill="${color}"`)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function titleFontSize(title: string): number {
  if (title.length < 40) return 76
  if (title.length < 70) return 60
  if (title.length < 100) return 50
  return 42
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title')
  const kind = searchParams.get('kind') ?? ''
  const desc = searchParams.get('desc') ?? ''

  if (!title) {
    return new Response('title param is required', { status: 400 })
  }

  let interRegular: ArrayBuffer,
    interBold: ArrayBuffer,
    jetbrainsMono: ArrayBuffer,
    watermark: string,
    mark: string
  try {
    ;[interRegular, interBold, jetbrainsMono, watermark, mark] = await Promise.all([
      loadFont('Inter-Regular.woff'),
      loadFont('Inter-Bold.woff'),
      loadFont('JetBrainsMono-Regular.woff'),
      loadLogo(GREEN),
      loadLogo('#fafafa'),
    ])
  } catch (err) {
    console.error('[og] asset load failed:', err)
    return new Response('asset load error', { status: 500 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
          fontFamily: '"Inter"',
        }}
      >
        {/* Blueprint grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px)',
          }}
        />
        {/* Green atmosphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 15% -20%, rgba(46,204,142,0.22), transparent 55%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 100% 120%, rgba(46,204,142,0.10), transparent 45%)`,
          }}
        />
        {/* Falcon watermark bleeding off the right edge */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={watermark}
          width={620}
          height={804}
          style={{ position: 'absolute', right: '-150px', bottom: '-170px', opacity: 0.09 }}
          alt=""
        />
        {/* Top edge accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '5px',
            backgroundImage: `linear-gradient(to right, ${GREEN}, rgba(46,204,142,0.25) 45%, transparent 80%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '56px 72px 48px',
          }}
        >
          {/* Header: terminal prompt chip + domain */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                borderRadius: '6px',
                border: '1px solid rgba(46,204,142,0.35)',
                backgroundColor: 'rgba(46,204,142,0.08)',
              }}
            >
              <div style={{ display: 'flex', color: GREEN, fontSize: '17px', fontFamily: '"JetBrains Mono"' }}>
                {'>'}
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#d9d9d6',
                  fontSize: '16px',
                  fontFamily: '"JetBrains Mono"',
                  letterSpacing: '0.18em',
                }}
              >
                {kind || '~'}
              </div>
              <div style={{ display: 'flex', width: '9px', height: '19px', backgroundColor: GREEN }} />
            </div>
            <div
              style={{
                display: 'flex',
                color: '#6b6b68',
                fontSize: '16px',
                fontFamily: '"JetBrains Mono"',
                letterSpacing: '0.05em',
              }}
            >
              {site.url.replace('https://', '')}
            </div>
          </div>

          {/* Title + description */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '980px' }}>
            <div
              style={{
                color: '#f7f7f4',
                fontSize: `${titleFontSize(title)}px`,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
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
                  color: '#9a9a96',
                  fontSize: '23px',
                  marginTop: '28px',
                  lineHeight: 1.55,
                  maxWidth: '860px',
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                height: '1px',
                width: '100%',
                backgroundImage: `linear-gradient(to right, rgba(46,204,142,0.6), rgba(255,255,255,0.12) 45%, transparent 90%)`,
                marginBottom: '26px',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mark} width={26} height={34} alt="" />
                <div style={{ display: 'flex', color: '#e8e8e5', fontSize: '19px', fontWeight: 700 }}>
                  {site.name}
                </div>
                <div style={{ display: 'flex', color: '#5c5c59', fontSize: '19px' }}>·</div>
                <div style={{ display: 'flex', color: '#9a9a96', fontSize: '17px' }}>{site.role}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  color: GREEN,
                  fontSize: '16px',
                  fontFamily: '"JetBrains Mono"',
                }}
              >
                @{site.handle}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: jetbrainsMono, weight: 400, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
    }
  )
}
