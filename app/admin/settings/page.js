'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const TABS = ['General', 'Features', 'Security'];
const FEATURES_LIST = ['Bulk Generate', 'Content Ideas', 'Schedule & Publish', 'Audio Studio', 'Characters & Worlds', 'Media Library', 'Lip Sync Studio', 'Explore Apps'];

export default function AdminSettings() {
  const [tab, setTab] = useState('General');
  const [platformName, setPlatformName] = useState('Creatify AI');
  const [features, setFeatures] = useState(Object.fromEntries(FEATURES_LIST.map(f => [f, true])));
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState('creatify.ai, app.creatify.ai');

  const toggleFeature = (name) => {
    setFeatures(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Settings</h2>

      <div className="flex gap-1 border-b border-white/10 pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${tab === t ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>{t}</button>
        ))}
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
        {tab === 'General' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm text-[#F9FAFB] mb-1">Platform Name</label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#F9FAFB] mb-1">Logo</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#7C3AED]/20 border border-white/10 flex items-center justify-center text-[#7C3AED] text-sm font-bold">CA</div>
                <button onClick={() => toast.success('Opening logo upload...')} className="px-3 py-1.5 rounded text-xs bg-white/10 text-[#F9FAFB] hover:bg-white/20 transition-all">Upload Logo</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#F9FAFB] mb-1">Favicon</label>
              <button onClick={() => toast.success('Opening favicon upload...')} className="px-3 py-1.5 rounded text-xs bg-white/10 text-[#F9FAFB] hover:bg-white/20 transition-all">Upload Favicon</button>
            </div>
            <button onClick={() => toast.success('Settings saved')} className="px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Save</button>
          </div>
        )}

        {tab === 'Features' && (
          <div className="space-y-3 max-w-md">
            {FEATURES_LIST.map(f => (
              <div key={f} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-[#F9FAFB]">{f}</span>
                <button
                  onClick={() => toggleFeature(f)}
                  className={`w-10 h-5 rounded-full transition-all ${features[f] ? 'bg-[#7C3AED]' : 'bg-white/20'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${features[f] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <button onClick={() => toast.success('Settings saved')} className="mt-4 px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Save</button>
          </div>
        )}

        {tab === 'Security' && (
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F9FAFB]">Maintenance Mode</span>
              <button
                onClick={() => { setMaintenanceMode(!maintenanceMode); toast.success(`Maintenance mode ${maintenanceMode ? 'disabled' : 'enabled'}`); }}
                className={`w-10 h-5 rounded-full transition-all ${maintenanceMode ? 'bg-[#7C3AED]' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm text-[#F9FAFB] mb-1">Allowed Domains</label>
              <input
                type="text"
                value={allowedDomains}
                onChange={e => setAllowedDomains(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]"
              />
              <p className="text-xs text-[#6B7280] mt-1">Comma-separated list of allowed CORS domains</p>
            </div>
            <button onClick={() => toast.success('Settings saved')} className="px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
