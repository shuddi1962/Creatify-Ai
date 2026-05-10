'use client';

import { useState } from 'react';
import { Palette, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import UploadZone from '@/components/studio/UploadZone';

const TONES = ['Professional', 'Casual', 'Playful', 'Luxury', 'Bold', 'Friendly', 'Minimal'];
const INDUSTRIES = ['Technology', 'Fashion', 'Beauty', 'Food & Beverage', 'Health & Fitness', 'Finance', 'Real Estate', 'Education', 'Entertainment', 'Retail', 'Travel', 'Automotive'];

export default function MarketingBrandKitPage() {
  const [logo, setLogo] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primary, setPrimary] = useState('#7C3AED');
  const [secondary, setSecondary] = useState('#7C3AED');
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

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Palette} title="YOUR BRAND KIT" subtitle="Upload your brand assets once — automatically applied to all outputs" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Brand Identity</SectionLabel>
            <div>
              <label className="text-xs text-[#888] mb-2 block">Logo</label>
              <UploadZone onFile={setLogo} accept="image/*" label="Upload logo" icon={Upload} preview={logo ? URL.createObjectURL(logo) : null} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Brand Name</SectionLabel>
                <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your brand name" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
              </div>
              <div>
                <SectionLabel>Tagline</SectionLabel>
                <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Your brand tagline" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
              </div>
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Color Palette</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Primary', value: primary, set: setPrimary },
                { label: 'Secondary', value: secondary, set: setSecondary },
                { label: 'Accent', value: accent, set: setAccent },
                { label: 'Background', value: background, set: setBackground },
              ].map(c => (
                <div key={c.label}>
                  <label className="text-[10px] text-[#444] uppercase tracking-widest">{c.label}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={c.value} onChange={e => c.set(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <input type="text" value={c.value} onChange={e => c.set(e.target.value)} className="flex-1 bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white font-mono" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Typography</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#888]">Primary Font</label>
                <select value={primaryFont} onChange={e => setPrimaryFont(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white mt-1">
                  {['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Playfair Display', 'Lato', 'Oswald'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888]">Secondary Font</label>
                <select value={secondaryFont} onChange={e => setSecondaryFont(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white mt-1">
                  {['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Source Sans Pro'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <SectionLabel>Upload Custom Font</SectionLabel>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-xs text-[#888] cursor-pointer hover:bg-[#222] transition-all">
                <Upload size={14} />
                <span>Upload .ttf or .otf font file</span>
                <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" />
              </label>
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Brand Voice</SectionLabel>
            <div>
              <SectionLabel>Tone of Voice</SectionLabel>
              <PillSelector options={TONES} value={tone} onChange={setTone} />
            </div>
            <div>
              <label className="text-xs text-[#888]">Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white mt-1">
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <SectionLabel>Target Audience</SectionLabel>
              <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g., Young professionals 25-35, urban, fitness-focused" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Social Handles</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(social).map(([platform, value]) => (
                <div key={platform}>
                  <label className="text-[10px] text-[#444] uppercase tracking-widest">{platform}</label>
                  <input value={value} onChange={e => handleSocialChange(platform, e.target.value)} placeholder={`@yourbrand`} className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-[#444] mt-1" />
                </div>
              ))}
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Brand Kit Preview</SectionLabel>
            <div className="bg-[#0a0a0a] rounded-xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-4 mb-4">
                {logo && <img src={URL.createObjectURL(logo)} alt="Logo" className="w-12 h-12 rounded-lg object-contain" />}
                <div>
                  <p className="text-lg font-bold" style={{ color: primary }}>{brandName || 'Your Brand'}</p>
                  {tagline && <p className="text-xs text-[#888]">{tagline}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {['Primary', 'Secondary', 'Accent'].map((name, i) => (
                  <div key={name} className="flex-1 text-center">
                    <div className="h-8 rounded-lg mb-1" style={{ backgroundColor: [primary, secondary, accent][i] }} />
                    <p className="text-[10px] text-[#555]">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center gap-2">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Brand Kit'}
          </button>
        </div>
      </div>
    </div>
  );
}