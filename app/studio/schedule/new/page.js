'use client';

import { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Pinterest'];
const CHARACTER_LIMITS = { TikTok: 150, Instagram: 2200, YouTube: 5000, LinkedIn: 3000, Twitter: 280, Pinterest: 500 };

export default function NewPostPage() {
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok', 'Instagram']);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [date, setDate] = useState('2026-05-12');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  const togglePlatform = (p) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generateHashtags = () => {
    const sample = '#ai #creativity #content #socialmedia #trending #fyp #viral';
    setHashtags(sample);
  };

  const handleSubmit = () => {
    if (selectedPlatforms.length === 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); }, 2000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORMS">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => togglePlatform(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedPlatforms.includes(p) ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedPlatforms.includes(p) ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              SCHEDULE NEW POST
            </h1>
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Upload Asset</label>
                    <label style={{
                      width: '100%', height: 120, borderRadius: 12,
                      border: '2px dashed var(--border-default)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: 'var(--bg-input)',
                    }}>
                      {assetPreview ? (
                        <img src={assetPreview} alt="" style={{ height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                      ) : (
                        <><Upload size={20} style={{ color: 'var(--text-muted)', marginBottom: 4 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Upload image or video</span></>
                      )}
                      <input type="file" accept="image/*,video/*" onChange={e => e.target.files[0] && (setAsset(e.target.files[0]), setAssetPreview(URL.createObjectURL(e.target.files[0])))} style={{ display: 'none' }} />
                    </label>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Caption</label>
                    <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..."
                      style={{ width: '100%', height: 100, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: 12, color: 'var(--text-primary)', fontSize: 13, resize: 'none', outline: 'none' }}
                    />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'block', textAlign: 'right' }}>{caption.length}/{CHARACTER_LIMITS[selectedPlatforms[0]] || 2200}</span>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Hashtags</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#hashtag1 #hashtag2"
                        style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      />
                      <button onClick={generateHashtags} style={{ padding: '8px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, color: 'var(--accent-text)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>Generate</button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Date</label>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Time</label>
                      <input type="time" value={time} onChange={e => setTime(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                    <button onClick={() => toast.success('Draft saved!')} style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>Save as Draft</button>
                    <button onClick={handleSubmit} disabled={loading}
                      style={{
                        flex: 1, padding: '10px', background: '#CCFF00', border: 'none', borderRadius: 10,
                        color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {loading ? <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Send size={14} />}
                      Schedule Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="New Post">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {selectedPlatforms.join(', ') || 'No platforms selected'}
          </span>
        </DirectorBar>
      }
    />
  );
}
