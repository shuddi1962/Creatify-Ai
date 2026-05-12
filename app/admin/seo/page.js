'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const TABS = ['Meta Tags', 'Robots.txt', 'Redirects', 'Sitemap'];
const PAGES = [
  { title: 'Home', slug: '/' },
  { title: 'About', slug: '/about' },
  { title: 'Pricing', slug: '/pricing' },
  { title: 'Terms', slug: '/terms' },
  { title: 'Privacy', slug: '/privacy' },
  { title: 'FAQ', slug: '/faq' },
];

const REDIRECTS_DATA = [
  { from: '/old-pricing', to: '/pricing', type: 301 },
  { from: '/old-blog', to: '/blog', type: 301 },
  { from: '/promo', to: '/pricing', type: 302 },
];

export default function AdminSeo() {
  const [tab, setTab] = useState('Meta Tags');
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nAllow: /\n\nSitemap: https://creatify.ai/sitemap.xml');
  const [redirects, setRedirects] = useState(REDIRECTS_DATA);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">SEO</h2>

      <div className="flex gap-1 border-b border-white/10 pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${tab === t ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>{t}</button>
        ))}
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
        {tab === 'Meta Tags' && (
          <div className="space-y-4">
            <p className="text-sm text-[#9CA3AF] mb-4">Edit meta tags for each page</p>
            {PAGES.map(p => (
              <div key={p.slug} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="text-sm text-[#F9FAFB] font-medium">{p.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{p.slug}</p>
                </div>
                <button onClick={() => toast.success(`Editing meta for ${p.title}...`)} className="px-3 py-1.5 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit Meta</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'Robots.txt' && (
          <div className="space-y-4">
            <textarea
              value={robotsTxt}
              onChange={e => setRobotsTxt(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm font-mono focus:outline-none focus:border-[#7C3AED]"
            />
            <button onClick={() => toast.success('Robots.txt saved')} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Save</button>
          </div>
        )}

        {tab === 'Redirects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9CA3AF]">Manage URL redirects</p>
              <button onClick={() => toast.success('Opening add redirect...')} className="px-3 py-1.5 rounded text-xs bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all">Add Redirect</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="text-left px-3 py-2 font-medium">From</th>
                  <th className="text-left px-3 py-2 font-medium">To</th>
                  <th className="text-left px-3 py-2 font-medium">Type</th>
                  <th className="text-right px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((r, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-3 py-2 text-[#F9FAFB] font-mono text-xs">{r.from}</td>
                    <td className="px-3 py-2 text-[#F9FAFB] font-mono text-xs">{r.to}</td>
                    <td className="px-3 py-2 text-[#9CA3AF]">{r.type}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => toast.success('Redirect deleted')} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Sitemap' && (
          <div className="space-y-4">
            <p className="text-sm text-[#9CA3AF]">Sitemap URL:</p>
            <code className="block px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#06B6D4] text-sm font-mono">https://creatify.ai/sitemap.xml</code>
            <button onClick={() => toast.success('Sitemap regenerated')} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Regenerate Sitemap</button>
          </div>
        )}
      </div>
    </div>
  );
}
