import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const SEED_POOLS = {
  'Image Showcase': ['community-img1', 'community-img2', 'community-img3', 'community-img4', 'community-img5', 'community-img6', 'community-img7', 'community-img8'],
  'Video Showcase': ['community-vid1', 'community-vid2', 'community-vid3', 'community-vid4', 'community-vid5', 'community-vid6', 'community-vid7', 'community-vid8'],
  'Marketing Ads Showcase': ['community-ad1', 'community-ad2', 'community-ad3', 'community-ad4', 'community-ad5', 'community-ad6', 'community-ad7', 'community-ad8'],
};

const WIDTHS = ['130', '110', '140', '120', '150', '130', '110', '140'];
const HEIGHTS = ['170', '150', '120', '160', '110', '140', '170', '130'];

export default function CommunityStrip({ title, subtitle, viewAllHref, items }) {
  const seeds = SEED_POOLS[title] || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
      <div className="w-full lg:w-[30%] flex-shrink-0">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-[13px] text-[#888] mt-2">{subtitle}</p>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-[#00C896] text-[12px] font-semibold mt-3 hover:underline"
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="w-full lg:w-[70%] overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2">
          {(items || []).map((item, i) => {
            const w = WIDTHS[i % WIDTHS.length];
            const h = HEIGHTS[i % HEIGHTS.length];
            const seed = seeds[i] || `community-${title}-${i}`;
            return (
              <Link
                key={i}
                href={viewAllHref}
                className={`flex-shrink-0 rounded-xl border border-white/[0.05] overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                style={{ width: `${w}px`, height: `${h}px` }}
              >
                <img
                  src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
