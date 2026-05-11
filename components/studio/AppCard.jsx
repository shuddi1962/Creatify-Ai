'use client';

import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AppCard({ app, isFavorite, onToggleFavorite }) {
  const handleUse = () => {
    toast.success(`Opening ${app.name || app.title}...`);
  };

  const title = app.title || app.name;
  const description = app.description || app.desc;
  const imageUrl = app.image || app.url;
  const category = app.category || null;
  const type = app.type || null;
  const githubUrl = app.githubUrl || null;
  const demoUrl = app.demoUrl || null;

  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden home-section-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', background: 'var(--bg-input)' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 300ms',
          }}
          className="group-hover:scale-105"
        />
        {category && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-secondary)', fontSize: 10, fontWeight: 500,
            padding: '3px 8px', borderRadius: 6,
            border: '1px solid var(--border-subtle)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {category}
          </span>
        )}
        {type === 'Template' && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          }}>
            TEMPLATE
          </span>
        )}
        {app.badge && !type && (
          <span className={app.badge === 'TOP' ? 'badge-top' : 'badge-new'} style={{
            position: 'absolute', top: 10, right: 10,
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          }}>
            {app.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(app.id || app.name); }}
          style={{
            position: 'absolute', top: 10, right: isFavorite ? 10 : 10,
            width: 28, height: 28,
            background: 'rgba(0,0,0,0.5)',
            border: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: isFavorite ? '#CCFF00' : '#fff',
            transition: 'color 150ms',
          }}
        >
          <Heart size={13} fill={isFavorite ? '#CCFF00' : 'none'} />
        </button>
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {description}
        </p>

        {(githubUrl || demoUrl) ? (
          <div style={{ display: 'flex', gap: 8 }}>
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center', padding: '8px 0',
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none',
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Github</div>
              </a>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center', padding: '8px 0',
                  background: 'var(--btn-generate-bg)', border: 'none',
                  borderRadius: 8, fontSize: 12, color: 'var(--btn-generate-text)', fontWeight: 700,
                  textDecoration: 'none', transition: 'opacity 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Demo</div>
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {app.credits != null && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{app.credits} credits</span>
            )}
            {!app.credits && <span />}
            <button onClick={(e) => { e.stopPropagation(); handleUse(); }}
              style={{
                padding: '8px 16px', background: 'var(--btn-generate-bg)', border: 'none',
                borderRadius: 8, color: 'var(--btn-generate-text)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'opacity 150ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Use App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
