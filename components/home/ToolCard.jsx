import Link from 'next/link';

const IMAGE_SEEDS = {
  'Create Image': 'ai-image-gen',
  'Create Video': 'ai-video-gen',
  'Lip Sync': 'ai-lipsync',
  'Bulk Generate': 'ai-bulk',
  'Content Ideas': 'ai-ideas',
  'Voice Cloning': 'ai-voice',
  'Smart Shot': 'ai-smartshot',
  'Characters': 'ai-character',
  'Marketing Ads': 'ai-marketing',
  'Edit Image': 'ai-edit',
  'Nano Banana Pro': 'ai-nano-pro',
  'Bulk Lip Sync': 'ai-bulk-lipsync',
  'Face Swap': 'ai-face-swap',
  'Viral Effects Pack': 'ai-effects',
  'Marketing Studio': 'ai-marketing-studio',
};

export default function ToolCard({ name, description, href, badge, badgeType, gradient, image }) {
  const seed = IMAGE_SEEDS[name] || name.toLowerCase().replace(/\s+/g, '-');
  const imgSrc = image || `https://picsum.photos/seed/${seed}/400/300`;

  return (
    <Link
      href={href}
      className="w-[200px] h-[220px] flex-shrink-0 bg-[#0D0D0D] rounded-2xl border border-white/[0.07] overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/20 hover:-translate-y-1 group"
    >
      <div className="h-[70%] relative overflow-hidden">
        <img src={imgSrc} alt={name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {badge && (
          <span
            className="absolute top-2 left-2 text-[8px] font-bold px-1.5 py-0.5 rounded z-10"
            style={{
              backgroundColor: badgeType === 'TOP' ? '#00C896' : '#CCFF00',
              color: badgeType === 'TOP' ? '#fff' : '#000',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[13px] font-semibold text-white">{name}</p>
        <p className="text-[11px] text-[#888] line-clamp-2 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
