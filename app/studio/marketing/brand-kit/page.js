'use client';

import { useState } from 'react';
import { Palette, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const TONES = ['Professional', 'Casual', 'Playful', 'Luxury', 'Bold', 'Friendly', 'Minimal'];
const INDUSTRIES = ['Technology', 'Fashion', 'Beauty', 'Food & Beverage', 'Health & Fitness', 'Finance', 'Real Estate', 'Education', 'Entertainment', 'Retail', 'Travel', 'Automotive'];
const SECTIONS = ['Identity', 'Colors', 'Typography', 'Voice', 'Social', 'Preview'];

export default function MarketingBrandKitPage() {
  const [activeSection, setActiveSection] = useState('Identity');
  const [logo, setLogo] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primary, setPrimary] = useState('#6366f1');
  const [secondary, setSecondary] = useState('#6366f1');
  const [accent, setAccent] = useState('#CCFF00');
  const [background, setBackground] = useState('#000000');
  const [primaryFont, setPrimaryFont] = useState('Inter');
  const [secondaryFont, setSecondaryFont] = useState('Inter');
  const [tone, setTone] = useState('Professional');
  const [industry, setIndustry] = useState('Technology');
  const [targetAudience, setTargetAudience] = useState('');
  const [social, setSocial] = useState({ tiktok: '', instagram: '', youtube: '', twitter: '', facebook: '', linkedin: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    toast.loading('Saving brand kit...', { id: 'save' });
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Brand kit saved!', { id: 'save' });
    setSaving(false);
  };

  const handleSocialChange = (platform, value) => setSocial(prev => ({ ...prev, [platform]: value }));

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Identity':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Brand Identity</h3>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Logo</label>
            <UploadZone onFile={setLogo} accept="image/*" label="Upload logo" icon={Upload} preview={logo ? URL.createObjectURL(logo) : null} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Brand Name</label>
                <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your brand name" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Tagline</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Your brand tagline" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>
        );
      case 'Colors':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Color Palette</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Primary', value: primary, set: setPrimary },
                { label: 'Secondary', value: secondary, set: setSecondary },
                { label: 'Accent', value: accent, set: setAccent },
                { label: 'Background', value: background, set: setBackground },
              ].map(c => (
                <div key={c.label}>
                  <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <input type="color" value={c.value} onChange={e => c.set(e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, cursor: 'pointer', border: 'none', background: 'transparent' }} />
                    <input type="text" value={c.value} onChange={e => c.set(e.target.value)} style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Typography':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Typography</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Primary Font</label>
                <select value={primaryFont} onChange={e => setPrimaryFont(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }}>
                  {['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Playfair Display', 'Lato', 'Oswald'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Secondary Font</label>
                <select value={secondaryFont} onChange={e => setSecondaryFont(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }}>
                  {['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Source Sans Pro'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Upload size={14} /> Upload .ttf or .otf font file
                <input type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        );
      case 'Voice':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Brand Voice</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Tone of Voice</label>
              <StudioDropdown label="Tone" options={TONES} value={tone} onChange={setTone} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }}>
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Target Audience</label>
              <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g., Young professionals 25-35" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }} />
            </div>
          </div>
        );
      case 'Social':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Social Handles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Object.entries(social).map(([platform, value]) => (
                <div key={platform}>
                  <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{platform}</label>
                  <input value={value} onChange={e => handleSocialChange(platform, e.target.value)} placeholder={`@yourbrand`} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)', marginTop: 4 }} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Preview':
        return (
          <div style={{ zIndex: 1, width: '100%', maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Brand Kit Preview</h3>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 24, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                {logo && <img src={URL.createObjectURL(logo)} alt="Logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'contain' }} />}
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: primary }}>{brandName || 'Your Brand'}</p>
                  {tagline && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tagline}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Primary', 'Secondary', 'Accent'].map((name, i) => (
                  <div key={name} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: 32, borderRadius: 8, marginBottom: 4, backgroundColor: [primary, secondary, accent][i] }} />
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="SECTIONS">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: activeSection === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: activeSection === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{s}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            BRAND KIT
          </h1>
          {renderSectionContent()}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Brand Kit">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
            <ControlButton onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Brand Kit'}
            </ControlButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
