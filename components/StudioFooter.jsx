'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudioFooter() {
  const pathname = usePathname();
  const segments = pathname?.split('/').filter(Boolean).length || 0;
  const isSubPage = segments > 2;

  if (isSubPage) {
    return (
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        padding: '10px 16px',
        width: '100%', maxWidth: '100vw',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            &copy; 2025 Creatify AI. Free and open-source.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              ['Twitter/X', 'https://x.com'],
              ['GitHub', 'https://github.com'],
              ['Discord', 'https://discord.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{
      borderTop: '1px solid var(--border-medium)',
      background: 'var(--bg-card)',
      padding: '32px 16px 20px',
      marginTop: 'auto',
      width: '100%', maxWidth: '100vw',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 24,
          marginBottom: 32,
        }}>
          
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, flexShrink: 0,
              }}>✨</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                Creatify AI
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Free open-source AI studio. 200+ models.
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
              Powered by Muapi.ai
            </p>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', 
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Create
            </div>
            {[
              ['Image Studio', '/studio/image/text-to-image'],
              ['Video Studio', '/studio/video/text-to-video'],
              ['Lip Sync', '/studio/lipsync/portrait'],
              ['Audio Studio', '/studio/audio/voiceover'],
              ['Cinema Studio', '/studio/cinema/generate'],
              ['Marketing Studio', '/studio/marketing/ugc'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 12,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 6,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Tools
            </div>
            {[
              ['Bulk Generate', '/studio/bulk/image'],
              ['Content Ideas', '/studio/ideas'],
              ['Characters', '/studio/characters/create'],
              ['Workflows', '/studio/workflows/canvas'],
              ['AI Agents', '/studio/agents/mine'],
              ['Explore Apps', '/studio/apps'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 12,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 6,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Manage
            </div>
            {[
              ['Media Library', '/studio/media/all'],
              ['Schedule & Publish', '/studio/schedule/calendar'],
              ['Settings', '/studio/settings'],
              ['API Access', '/studio/agents/api'],
              ['CLI Tool', '/studio/agents/cli'],
              ['MCP Server', '/studio/agents/mcp'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 12,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 6,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Company
            </div>
            {[
              ['About', '/about'],
              ['Blog', '/blog'],
              ['Pricing', '/pricing'],
              ['Changelog', '/changelog'],
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 12,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 6,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid var(--border-medium)',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            &copy; 2025 Creatify AI. Free and open-source.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              ['Twitter/X', 'https://x.com'],
              ['GitHub', 'https://github.com'],
              ['Discord', 'https://discord.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
