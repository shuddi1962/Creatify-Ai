'use client';

import toast from 'react-hot-toast';

const PAGES = [
  { title: 'About', slug: 'about', status: 'Published', updated: '2026-05-10' },
  { title: 'Pricing', slug: 'pricing', status: 'Published', updated: '2026-05-08' },
  { title: 'Terms', slug: 'terms', status: 'Published', updated: '2026-04-20' },
  { title: 'Privacy', slug: 'privacy', status: 'Published', updated: '2026-04-20' },
  { title: 'FAQ', slug: 'faq', status: 'Draft', updated: '2026-05-12' },
  { title: 'Contact', slug: 'contact', status: 'Draft', updated: '2026-05-11' },
];

export default function AdminPages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Pages</h2>
          <p className="text-sm text-[#9CA3AF]">Manage CMS pages</p>
        </div>
        <button onClick={() => toast.success('Opening create page...')} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Create Page</button>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Updated</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PAGES.map(p => (
              <tr key={p.slug} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#F9FAFB] font-medium">{p.title}</td>
                <td className="px-4 py-3 text-[#9CA3AF] font-mono text-xs">/{p.slug}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{p.updated}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toast.success(`Editing ${p.title}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit</button>
                    <button onClick={() => toast.success(`${p.title} deleted`)} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
