'use client';

import { useState } from 'react';
import { FileText, RefreshCw, Copy, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import PillSelector from '@/components/studio/PillSelector';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn'];
const DURATIONS = ['15s', '30s', '60s', '3min', '5min', '10min'];
const STYLES = ['Talking Head', 'Voiceover', 'Interview', 'Tutorial', 'Story', 'Listicle'];
const TONES = ['Casual', 'Professional', 'Humorous', 'Educational', 'Inspirational', 'Dramatic'];
const HOOK_TYPES = ['Question', 'Bold Statement', 'Relatable Problem', 'Shocking Stat', 'Story Hook', 'Teaser'];

export default function ScriptsPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [duration, setDuration] = useState('30s');
  const [style, setStyle] = useState('Talking Head');
  const [tone, setTone] = useState('Casual');
  const [hookType, setHookType] = useState('Question');
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateScript = () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return; }
    setLoading(true);
    setTimeout(() => {
      setScript({
        hook: `Hey! Ever wondered ${topic}? Let me break it down for you.`,
        intro: `Welcome back! Today we're diving into ${topic}. If you're new here, hit that subscribe button.`,
        main: [
          `First, let's talk about why ${topic} matters in today's world.`,
          `Here are 3 key things you need to know about ${topic}.`,
          `The second point is where most people get confused, but here's the truth.`,
        ],
        cta: cta || 'Follow for more content like this!',
        outro: `That's a wrap! If you found this helpful, like and share. See you in the next one!`,
      });
      setLoading(false);
      toast.success('Script generated!');
    }, 2500);
  };

  const handleCopy = () => {
    if (!script) return;
    const text = `HOOK\n${script.hook}\n\nINTRO\n${script.intro}\n\nMAIN CONTENT\n${script.main.join('\n')}\n\nCTA\n${script.cta}\n\nOUTRO\n${script.outro}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Script copied!');
  };

  const handleSendToStoryboard = () => toast.success('Sent to storyboard!');

  const SCRIPT_SECTIONS = [
    { key: 'hook', label: 'HOOK', color: '#CCFF00' },
    { key: 'intro', label: 'INTRO', color: '#7C3AED' },
    { key: 'main', label: 'MAIN CONTENT', color: '#06B6D4' },
    { key: 'cta', label: 'CTA', color: '#F59E0B' },
    { key: 'outro', label: 'OUTRO', color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={FileText} badge="NEW" title="SCRIPT GENERATOR" subtitle="AI writes a complete video script from any content idea" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Video Topic</SectionLabel>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Morning routine that changed my life" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
            </div>
            <div>
              <SectionLabel>Platform</SectionLabel>
              <PillSelector options={PLATFORMS} value={platform} onChange={setPlatform} />
            </div>
            <div>
              <SectionLabel>Duration</SectionLabel>
              <PillSelector options={DURATIONS} value={duration} onChange={setDuration} />
            </div>
            <div>
              <SectionLabel>Script Style</SectionLabel>
              <PillSelector options={STYLES} value={style} onChange={setStyle} />
            </div>
            <div>
              <SectionLabel>Tone</SectionLabel>
              <PillSelector options={TONES} value={tone} onChange={setTone} />
            </div>
            <div>
              <SectionLabel>Hook Type</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {HOOK_TYPES.map(h => (
                  <button key={h} onClick={() => setHookType(h)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${hookType === h ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{h}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Call to Action (Optional)</SectionLabel>
              <input value={cta} onChange={e => setCta(e.target.value)} placeholder="e.g. Follow for more tips" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generateScript} loading={loading}>Generate Script</GenerateButton>
        </div>

        {script && (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold">Generated Script</h3>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center gap-2 transition-all">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}</button>
                <button onClick={() => { setLoading(true); setTimeout(() => { generateScript(); }, 100); }} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center gap-2 transition-all"><RefreshCw size={14} /> Regenerate</button>
              </div>
            </div>
            <div className="space-y-4">
              {SCRIPT_SECTIONS.map(sec => (
                <div key={sec.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sec.color }} />
                    <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">{sec.label}</span>
                  </div>
                  {sec.key === 'main' ? (
                    <div className="space-y-2 pl-4 border-l-2 border-[#1a1a1a]">
                      {script.main.map((m, i) => (
                        <div key={i} className="text-[#ccc] text-sm leading-relaxed">{i + 1}. {m}</div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={script[sec.key]}
                      onChange={e => setScript({ ...script, [sec.key]: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-3 text-[#ccc] text-sm leading-relaxed resize-none focus:outline-none"
                      rows={sec.key === 'hook' || sec.key === 'cta' ? 2 : 3}
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSendToStoryboard} className="mt-6 w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all">Send to Storyboard</button>
          </div>
        )}
      </div>
    </div>
  );
}