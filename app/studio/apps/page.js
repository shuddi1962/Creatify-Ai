'use client';

import { useState } from 'react';
import { Search, Sparkles, Rocket, CreditCard, Wallet, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import AppCard from '@/components/studio/AppCard';

const ALL_APPS = [
  { id: 1, name: 'AI Headshot Studio', desc: 'Studio-quality professional headshots in seconds', category: 'Face & Character', url: 'https://picsum.photos/seed/aiheadshot/600/400', type: 'Template' },
  { id: 2, name: 'Nano Banana Studio', desc: 'Advanced AI image generation playground', category: 'Creative', url: 'https://picsum.photos/seed/nanobanana/600/400', type: 'Template' },
  { id: 3, name: 'Seedance V2 Studio', desc: 'Next-gen video generation from text prompts', category: 'VFX', url: 'https://picsum.photos/seed/seedance/600/400', type: 'Template' },
  { id: 4, name: 'AI Clipping Studio', desc: 'Professional AI background removal', category: 'Product', url: 'https://picsum.photos/seed/clipping/600/400', type: 'Template' },
  { id: 5, name: 'EasyVeo Studio', desc: 'Simplified AI video creation for everyone', category: 'Creative', url: 'https://picsum.photos/seed/easyveo/600/400', type: 'Template' },
  { id: 6, name: 'Pet Product Studio', desc: 'Generate stunning pet product photos', category: 'Product', url: 'https://picsum.photos/seed/petstudio/600/400' },
  { id: 7, name: 'Resale Photo Enhancer', desc: 'Boost resale listing photos with AI', category: 'Business', url: 'https://picsum.photos/seed/resale/600/400' },
  { id: 8, name: 'AI Recruiter', desc: 'Automated recruitment content generator', category: 'Business', url: 'https://picsum.photos/seed/recruiter/600/400' },
  { id: 9, name: 'Talk to PDF', desc: 'Chat with any PDF document using AI', category: 'Business', url: 'https://picsum.photos/seed/pdfchat/600/400' },
  { id: 10, name: 'Blogger CMS', desc: 'AI-powered blog content management system', category: 'Business', url: 'https://picsum.photos/seed/blogger/600/400' },
  { id: 11, name: 'Amazon Product Studio', desc: 'Create Amazon-ready product images', category: 'Product', url: 'https://picsum.photos/seed/amazon/600/400' },
  { id: 12, name: 'AI Business Card', desc: 'Design professional AI business cards', category: 'Business', url: 'https://picsum.photos/seed/bizcard/600/400' },
  { id: 13, name: 'MailWise', desc: 'Smart email composition and management', category: 'Business', url: 'https://picsum.photos/seed/mailwise/600/400' },
  { id: 14, name: 'My Podcast', desc: 'AI podcast creation and editing studio', category: 'Creative', url: 'https://picsum.photos/seed/podcast/600/400' },
  { id: 15, name: 'EZScribe', desc: 'AI transcription and note-taking assistant', category: 'Business', url: 'https://picsum.photos/seed/ezscribe/600/400' },
  { id: 16, name: 'AI Knowledge Base', desc: 'Build intelligent knowledge bases with AI', category: 'Business', url: 'https://picsum.photos/seed/knowledge/600/400' },
  { id: 17, name: 'AI Outbound', desc: 'Automated outbound sales content generator', category: 'Business', url: 'https://picsum.photos/seed/outbound/600/400' },
  { id: 18, name: 'AI Royal Portrait', desc: 'Generate regal portrait artwork with AI', category: 'Face & Character', url: 'https://picsum.photos/seed/portrait/600/400' },
  { id: 19, name: 'AI MEME', desc: 'Viral meme generator powered by AI', category: 'Meme & Social', url: 'https://picsum.photos/seed/aimeme/600/400' },
  { id: 20, name: 'AI Real Estate Stager', desc: 'Virtually stage properties with AI', category: 'Real Estate', url: 'https://picsum.photos/seed/realestate/600/400' },
  { id: 21, name: 'AI Logo', desc: 'Professional AI logo design maker', category: 'Creative', url: 'https://picsum.photos/seed/ailogo/600/400' },
  { id: 22, name: 'OldPhoto', desc: 'Restore and colorize old photographs', category: 'Style', url: 'https://picsum.photos/seed/oldphoto/600/400' },
  { id: 23, name: 'AITryOn', desc: 'Virtual try-on for clothing and accessories', category: 'Face & Character', url: 'https://picsum.photos/seed/aitryon/600/400' },
  { id: 24, name: 'AI Age Transformation', desc: 'See yourself younger or older with AI', category: 'Face & Character', url: 'https://picsum.photos/seed/age/600/400' },
  { id: 25, name: 'AI Professional Makeup', desc: 'AI-powered virtual makeup application', category: 'Face & Character', url: 'https://picsum.photos/seed/makeup/600/400' },
  { id: 26, name: 'AI Flash Cards', desc: 'Generate study flashcards from any content', category: 'Business', url: 'https://picsum.photos/seed/flashcards/600/400' },
  { id: 27, name: 'AI Group Photo', desc: 'Add anyone to any group photo with AI', category: 'Face & Character', url: 'https://picsum.photos/seed/groupphoto/600/400' },
  { id: 28, name: 'AI Tattoo Try-On', desc: 'Preview tattoo designs on your body', category: 'Face & Character', url: 'https://picsum.photos/seed/tattoo/600/400' },
  { id: 29, name: 'AI Hair Style Simulator', desc: 'Try different hairstyles with AI', category: 'Face & Character', url: 'https://picsum.photos/seed/hairstyle/600/400' },
  { id: 30, name: 'AI Kids-to-Adult', desc: 'See how kids will look as adults', category: 'Face & Character', url: 'https://picsum.photos/seed/kidstoadult/600/400' },
  { id: 31, name: 'AI Room Declutter', desc: 'Remove clutter from room photos with AI', category: 'Style', url: 'https://picsum.photos/seed/declutter/600/400' },
  { id: 32, name: 'AI Fitness Simulator', desc: 'Visualize fitness body transformations', category: 'Face & Character', url: 'https://picsum.photos/seed/fitness/600/400' },
  { id: 33, name: 'AI Pet Portrait', desc: 'Turn your pet into artistic portraits', category: 'Creative', url: 'https://picsum.photos/seed/petportrait/600/400' },
  { id: 34, name: 'AI Kissing Video', desc: 'Generate romantic kissing videos with AI', category: 'Meme & Social', url: 'https://picsum.photos/seed/kissing/600/400' },
  { id: 35, name: 'Chat with PDF', desc: 'Interactive PDF chat and analysis tool', category: 'Business', url: 'https://picsum.photos/seed/chatpdf/600/400' },
  { id: 36, name: 'AI Travel Studio', desc: 'Generate stunning travel destination photos', category: 'Creative', url: 'https://picsum.photos/seed/travel/600/400' },
  { id: 37, name: 'Prompt Architect', desc: 'Advanced prompt engineering assistant', category: 'Creative', url: 'https://picsum.photos/seed/prompt/600/400' },
  { id: 38, name: 'ClearMark AI', desc: 'Remove watermarks from images with AI', category: 'Style', url: 'https://picsum.photos/seed/clearmark/600/400' },
  { id: 39, name: 'PlantVision AI', desc: 'Identify and analyze plants with AI', category: 'Creative', url: 'https://picsum.photos/seed/plantvision/600/400' },
  { id: 40, name: 'AI Wedding Photo', desc: 'Generate beautiful AI wedding photos', category: 'Creative', url: 'https://picsum.photos/seed/wedding/600/400' },
  { id: 41, name: 'Social Post', desc: 'Create engaging social media posts with AI', category: 'Meme & Social', url: 'https://picsum.photos/seed/socialpost/600/400' },
  { id: 42, name: 'MagicSelf AI', desc: 'Enhance selfies with AI magic touch', category: 'Face & Character', url: 'https://picsum.photos/seed/magicself/600/400' },
  { id: 43, name: 'AI Resume Builder', desc: 'Professional AI-powered resume creator', category: 'Business', url: 'https://picsum.photos/seed/resume/600/400' },
  { id: 44, name: 'GEO Checker', desc: 'Geographic content optimization tool', category: 'Business', url: 'https://picsum.photos/seed/geo/600/400' },
  { id: 45, name: 'AI Character Studio', desc: 'Create and manage AI character profiles', category: 'Face & Character', url: 'https://picsum.photos/seed/character/600/400' },
  { id: 46, name: 'Luxury Hair Studio', desc: 'AI hairstyling and hair color simulation', category: 'Face & Character', url: 'https://picsum.photos/seed/hairstudio/600/400' },
  { id: 47, name: 'Face Swap', desc: 'Swap faces in any image or video', category: 'Face & Character', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/faceswap/600/400' },
  { id: 48, name: 'Match Cut', desc: 'Seamless transition between clips', category: 'VFX', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/matchcut/600/400' },
  { id: 49, name: 'Neon Glow', desc: 'Add vibrant neon lighting effects', category: 'Style', credits: 3, url: 'https://picsum.photos/seed/neonglow/600/400' },
  { id: 50, name: 'Style Transfer', desc: 'Apply artistic styles to photos', category: 'Style', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/styletransfer/600/400' },
  { id: 51, name: 'Sticker Generator', desc: 'Create custom stickers from photos', category: 'Meme & Social', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/stickers/600/400' },
  { id: 52, name: 'Product Placement', desc: 'Place products in scenes naturally', category: 'Product', credits: 8, url: 'https://picsum.photos/seed/productplace/600/400' },
  { id: 53, name: 'Meme Generator', desc: 'Trending meme templates with text', category: 'Meme & Social', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/memegen/600/400' },
  { id: 54, name: 'Skin Enhancer', desc: 'AI-powered skin retouching', category: 'Face & Character', credits: 4, url: 'https://picsum.photos/seed/skin/600/400' },
  { id: 55, name: 'Camera Angles', desc: 'Generate multiple camera angles', category: 'VFX', credits: 6, url: 'https://picsum.photos/seed/cameraangles/600/400' },
  { id: 56, name: 'Effects Pack', desc: '100+ VFX effects in one app', category: 'VFX', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/effects/600/400' },
  { id: 57, name: 'ProFlow Plumbing', desc: 'Plumbing service AI marketing kit', category: 'Business', url: 'https://picsum.photos/seed/proflow/600/400' },
  { id: 58, name: 'Solace AI', desc: 'AI wellness and mental health companion', category: 'Creative', url: 'https://picsum.photos/seed/solace/600/400' },
  { id: 59, name: 'ReLive AI', desc: 'Memory preservation and photo revival', category: 'Style', url: 'https://picsum.photos/seed/relive/600/400' },
  { id: 60, name: 'Dental ReserveAI', desc: 'Dental practice AI marketing suite', category: 'Business', url: 'https://picsum.photos/seed/dental/600/400' },
  { id: 61, name: 'CounselMate', desc: 'AI counseling and therapy content tool', category: 'Business', url: 'https://picsum.photos/seed/counsel/600/400' },
  { id: 62, name: 'Fixera', desc: 'Auto repair shop AI marketing kit', category: 'Business', url: 'https://picsum.photos/seed/fixera/600/400' },
  { id: 63, name: 'Nova Care Clinic', desc: 'Healthcare clinic AI content generator', category: 'Business', url: 'https://picsum.photos/seed/novacare/600/400' },
  { id: 64, name: 'Vertex Tax Strategy', desc: 'Tax professional AI marketing tools', category: 'Business', url: 'https://picsum.photos/seed/vertex/600/400' },
  { id: 65, name: 'Nova AssuranceAI', desc: 'Insurance agency AI content suite', category: 'Business', url: 'https://picsum.photos/seed/novaassure/600/400' },
  { id: 66, name: 'Opulent Drive', desc: 'Car dealership AI marketing platform', category: 'Business', url: 'https://picsum.photos/seed/opulent/600/400' },
  { id: 67, name: 'TowMate', desc: 'Towing service AI marketing tools', category: 'Business', url: 'https://picsum.photos/seed/towmate/600/400' },
  { id: 68, name: 'SwiftLink Logistics', desc: 'Logistics company AI marketing suite', category: 'Business', url: 'https://picsum.photos/seed/swiftlink/600/400' },
  { id: 69, name: 'Lumea Residence', desc: 'Real estate AI property marketing', category: 'Real Estate', url: 'https://picsum.photos/seed/lumea/600/400' },
  { id: 70, name: 'Paws & Pals', desc: 'Pet care business AI marketing', category: 'Business', url: 'https://picsum.photos/seed/pawspals/600/400' },
  { id: 71, name: 'Intelligent RE Agent', desc: 'Real estate agent AI content generator', category: 'Real Estate', url: 'https://picsum.photos/seed/intellire/600/400' },
  { id: 72, name: 'Tabla - ReserveAI', desc: 'Restaurant reservation AI assistant', category: 'Business', url: 'https://picsum.photos/seed/tabla/600/400' },
  { id: 73, name: 'TurboGlow Auto Spa', desc: 'Auto detailing AI marketing toolkit', category: 'Business', url: 'https://picsum.photos/seed/turboglow/600/400' },
  { id: 74, name: 'ProFix Auto', desc: 'Auto repair AI customer engagement', category: 'Business', url: 'https://picsum.photos/seed/profix/600/400' },
  { id: 75, name: 'LedgerSync', desc: 'Accounting AI content and marketing', category: 'Business', url: 'https://picsum.photos/seed/ledger/600/400' },
  { id: 76, name: 'Velora - Yoga AI', desc: 'Yoga studio AI marketing platform', category: 'Business', url: 'https://picsum.photos/seed/velora/600/400' },
];

const CATEGORIES = ['All', 'VFX & Effects', 'Face & Character', 'Style & Color', 'Product & Fashion', 'Meme & Social'];

const STEPS = [
  { icon: Rocket, title: 'Deploy in Minutes', desc: 'One-click deployment on Vercel with full Supabase backend included' },
  { icon: CreditCard, title: 'Collect Payments', desc: 'Built-in Stripe checkout for one-time or subscription billing' },
  { icon: Wallet, title: 'Keep the Revenue', desc: 'You keep 100% of customer payments — zero platform fees' },
];

export default function AppsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredApps = ALL_APPS.filter((app) => {
    const catMatch = category === 'All' || app.category === category;
    const searchMatch =
      !search ||
      (app.name || app.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.desc || app.description || '').toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="text-center py-16 px-4">
        <div className="inline-flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
            <Sparkles size={28} style={{ color: 'var(--text-primary)' }} />
          </div>
        </div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold mt-6" style={{ color: 'var(--text-primary)' }}>Explore Apps</h1>
        <p className="mt-3 text-sm max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
          60+ AI apps across VFX, face & character, product, style, and social — deploy your own and keep 100% of revenue.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#00C896', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Build Your Own AI App
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Turn your idea into a revenue-generating AI app</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            Deploy on Vercel, collect Stripe payments, keep 100% of revenue. No platform fees.
          </p>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          flexWrap: 'wrap', maxWidth: 800, margin: '0 auto',
        }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              flex: '1 1 200px', minWidth: 200,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12, padding: 24, textAlign: 'center',
            }}>
              <step.icon size={28} style={{ color: 'var(--btn-generate-bg)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps..."
              style={{
                width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 10, padding: '10px 14px 10px 38px',
                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
          </div>

          <div style={{
            display: 'flex', gap: 4, flexWrap: 'wrap',
            background: 'var(--bg-input)', borderRadius: 100,
            padding: 4, width: 'fit-content',
          }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px', fontSize: 13,
                  borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: category === cat ? 'var(--btn-generate-bg)' : 'transparent',
                  color: category === cat ? '#000' : 'var(--text-secondary)',
                  fontWeight: category === cat ? 700 : 400,
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => {
                  if (category !== cat) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (category !== cat) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          paddingBottom: 40,
        }}>
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              isFavorite={favorites.includes(app.id)}
              onToggleFavorite={toggleFav}
            />
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 14 }}>No apps found matching your search.</p>
          </div>
        )}

        <div style={{
          textAlign: 'center', padding: '32px 0 16px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Muapi Ecosystem — More templates coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
