import Link from 'next/link';

export default function ToolCard({ name, description, href, badge, badgeType, gradient }) {
  return (
    <Link
      href={href}
      className="w-[200px] h-[220px] flex-shrink-0 bg-[#0D0D0D] rounded-2xl border border-white/[0.07] overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/20 hover:-translate-y-1 group"
    >
      <div className={`h-[70%] relative bg-gradient-to-br ${gradient || 'from-[#1a1a1a] to-[#222]'}`}>
        {badge && (
          <span
            className="absolute top-2 left-2 text-[8px] font-bold px-1.5 py-0.5 rounded z-10"
            style={{
              backgroundColor: badgeType === 'TOP' ? '#ec4899' : '#a3e635',
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
