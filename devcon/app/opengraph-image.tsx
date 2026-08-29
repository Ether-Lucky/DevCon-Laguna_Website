import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

/**
 * Generated Open Graph / social share image.
 *
 * Produced at build time with `ImageResponse` rather than shipped as a static
 * asset, so the preview card stays in sync with `siteConfig` and needs no
 * separate design export. Replace this file with an `opengraph-image.png` if a
 * designed card is provided later — the file convention picks either up.
 *
 * Rendered by Satori, which supports a flexbox subset of CSS: every container
 * needs an explicit `display: flex`, and there is no grid or float.
 */
export const alt = 'DevCon Laguna — a community of developers, students, and tech enthusiasts in Laguna, Philippines';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BLACK = '#0B0B0C';
const LIME = '#C0E00B';
const PURPLE = '#6A0DF2';
const ORANGE = '#E06B22';
const WHITE = '#FFFFFF';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${BLACK} 0%, #1A0733 55%, ${BLACK} 100%)`,
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', width: '22px', height: '22px', borderRadius: '11px', background: LIME }} />
          <div style={{ display: 'flex', width: '22px', height: '22px', borderRadius: '11px', background: PURPLE }} />
          <div style={{ display: 'flex', width: '22px', height: '22px', borderRadius: '11px', background: ORANGE }} />
          <div style={{ display: 'flex', fontSize: 30, letterSpacing: '0.32em', color: '#A9A9B2', marginLeft: '14px' }}>
            DEVCON LAGUNA
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '38px',
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.08,
            color: WHITE,
          }}
        >
          <div style={{ display: 'flex' }}>Building the</div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: LIME }}>Future of Tech,</span>
          </div>
          <div style={{ display: 'flex', color: ORANGE }}>Together.</div>
        </div>

        <div style={{ display: 'flex', marginTop: '44px', fontSize: 30, color: '#C9C9D1' }}>
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    size,
  );
}
