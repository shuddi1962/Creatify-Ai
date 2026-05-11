import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const IMAGE_POOLS = {
  'Image Showcase': [
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/4467687/pexels-photo-4467687.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300',
  ],
  'Video Showcase': [
    'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=300',
  ],
  'Marketing Ads Showcase': [
    'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg?auto=compress&cs=tinysrgb&w=300',
  ],
};

const WIDTHS = ['130', '110', '140', '120', '150', '130', '110', '140'];
const HEIGHTS = ['170', '150', '120', '160', '110', '140', '170', '130'];

export default function CommunityStrip({ title, subtitle, viewAllHref, items }) {
  const images = IMAGE_POOLS[title] || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
      <div className="w-full lg:w-[30%] flex-shrink-0">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-[13px] mt-2" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
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
            const src = images[i] || images[0];
            return (
              <Link
                key={i}
                href={viewAllHref}
                className={`flex-shrink-0 rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                style={{ width: `${w}px`, height: `${h}px`, borderColor: 'var(--border-subtle)' }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
