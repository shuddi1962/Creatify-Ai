'use client';

import { Heart, Download, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AppCard({ app, isFavorite, onToggleFavorite }) {
  const handleUse = () => {
    toast.success(`Opening ${app.name || app.title}...`);
  };

  const handleCopyShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied!');
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    toast.success('Downloading...');
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
      className="group cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: '#0D0D0D',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'border-color 200ms, transform 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
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
          <span
            style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              color: '#9CA3AF', fontSize: 10, fontWeight: 500,
              padding: '3px 8px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
          >
            {category}
          </span>
        )}
        {type === 'Template' && (
          <span
            style={{
              position: 'absolute', top: 10, right: 10,
              background: '#CCFF00', color: '#000',
              fontSize: 9, fontWeight: 700,
              padding: '2px 6px', borderRadius: 4,
            }}
          >
            TEMPLATE
          </span>
        )}
        {app.badge && !type && (
          <span
            style={{
              position: 'absolute', top: 10, right: 10,
              background: app.badge === 'TOP' ? '#CCFF00' : '#00C896',
              color: app.badge === 'TOP' ? '#000' : '#fff',
              fontSize: 9, fontWeight: 700,
              padding: '2px 6px', borderRadius: 4,
            }}
          >
            {app.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(app.id || app.name); }}
          style={{
            position: 'absolute', top: 10, right: 10,
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
        <h3 style={{
          fontSize: 14, fontWeight: 600, color: '#fff',
          marginBottom: 6, lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 12, color: '#6B7280', lineHeight: 1.5,
          marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {description}
        </p>

        {(githubUrl || demoUrl) ? (
          <div style={{ display: 'flex', gap: 8 }}>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center',
                  padding: '8px 0',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, fontSize: 12,
                  color: '#9CA3AF', textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  Github
                </div>
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center',
                  padding: '8px 0',
                  background: '#CCFF00',
                  border: 'none',
                  borderRadius: 8, fontSize: 12,
                  color: '#000', fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'opacity 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  Demo
                </div>
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {app.credits != null && (
              <span style={{ fontSize: 10, color: '#444' }}>{app.credits} credits</span>
            )}
            {!app.credits && <span />}
            <button
              onClick={(e) => { e.stopPropagation(); handleUse(); }}
              style={{
                padding: '8px 16px',
                background: '#CCFF00',
                border: 'none',
                borderRadius: 8,
                color: '#000',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 150ms',
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
