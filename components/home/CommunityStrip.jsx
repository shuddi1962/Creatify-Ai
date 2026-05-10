import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CommunityStrip({ title, subtitle, viewAllHref, items }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
      <div className="w-full lg:w-[30%] flex-shrink-0">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-[13px] text-[#888] mt-2">{subtitle}</p>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-[#CCFF00] text-[12px] font-semibold mt-3 hover:underline"
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="w-full lg:w-[70%] overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 bg-[#1a1a1a] rounded-xl border border-white/[0.05] overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                item.className || 'w-[140px] h-[160px]'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded border border-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
