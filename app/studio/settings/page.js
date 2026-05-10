'use client';

import { useState } from 'react';
import { Camera, User, Key, CreditCard, Bell, Share2, Shield, Gift, Receipt, Settings as SettingsIcon, X } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthProvider';
import toast from 'react-hot-toast';

const TABS = ['Profile', 'API Keys', 'Subscription', 'Notifications', 'Connected Accounts', 'Security', 'Referrals', 'Billing'];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-white/[0.08]">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-[#666]">Manage your account and preferences</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === tab ? 'bg-[#7C3AED] text-white' : 'text-[#888] hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <SectionLabel>Profile</SectionLabel>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-white/[0.1] flex items-center justify-center cursor-pointer hover:border-[#7C3AED] transition-all">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Profile Photo</p>
                    <p className="text-xs text-[#555]">Click to upload</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Display Name</label>
                    <input defaultValue={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Email</label>
                    <input defaultValue={user?.email || ''} readOnly className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#888]" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Bio</label>
                  <textarea rows={3} placeholder="Tell us about yourself..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white resize-none" />
                </div>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === 'API Keys' && (
              <div className="space-y-6">
                <SectionLabel>API Keys</SectionLabel>
                <div className="space-y-3">
                  {[{ name: 'Production Key', key: 'mk_prod_****...****f3a2', created: 'Jan 15, 2026' }, { name: 'Development Key', key: 'mk_dev_****...****7b1c', created: 'Feb 20, 2026' }].map((k, i) => (
                    <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{k.name}</p>
                        <p className="text-xs text-[#555] font-mono mt-1">{k.key}</p>
                        <p className="text-[10px] text-[#444] mt-1">Created {k.created}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#888] text-xs hover:bg-white/10">Copy</button>
                        <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30">Revoke</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2">Create New Key</p>
                  <div className="flex gap-3">
                    <input placeholder="Key name..." className="flex-1 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white" />
                    <button className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">Create</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Subscription' && (
              <div className="space-y-6">
                <SectionLabel>Subscription</SectionLabel>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">Pro Plan</p>
                      <p className="text-sm text-[#666]">$29/month, renews on Mar 10, 2026</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">2,450</p>
                      <p className="text-xs text-[#555]">Credits Remaining</p>
                      <div className="mt-2 h-1.5 bg-[#1a1a1a] rounded-full"><div className="h-full bg-[#7C3AED] rounded-full w-[61%]"/></div>
                    </div>
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">4.2 GB</p>
                      <p className="text-xs text-[#555]">Storage Used</p>
                    </div>
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">12,840</p>
                      <p className="text-xs text-[#555]">API Calls</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Upgrade Plan</button>
                    <button className="px-5 py-2 bg-white/5 text-[#888] text-sm font-semibold rounded-xl hover:bg-white/10 transition-all">Downgrade</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <SectionLabel>Notifications</SectionLabel>
                <div className="space-y-4">
                  {[
                    { label: 'Generation complete', desc: 'When any generation finishes', enabled: true },
                    { label: 'Bulk job done', desc: 'When a bulk batch completes', enabled: true },
                    { label: 'Credits low', desc: 'When credits fall below 10%', enabled: true },
                    { label: 'Weekly summary', desc: 'Your weekly activity report', enabled: false },
                    { label: 'Product updates', desc: 'New features and improvements', enabled: false },
                    { label: 'Marketing emails', desc: 'Promotions and offers', enabled: false },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                      <div>
                        <p className="text-sm font-medium text-white">{n.label}</p>
                        <p className="text-xs text-[#555]">{n.desc}</p>
                      </div>
                      <button
                        onClick={e => e.currentTarget.classList.toggle('bg-[#7C3AED]')}
                        className={`w-10 h-6 rounded-full transition-all relative ${n.enabled ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${n.enabled ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Connected Accounts' && (
              <div className="space-y-6">
                <SectionLabel>Connected Accounts</SectionLabel>
                <div className="space-y-3">
                  {[
                    { platform: 'TikTok', connected: true, user: '@creatifyai' },
                    { platform: 'Instagram', connected: true, user: 'creatify_official' },
                    { platform: 'YouTube', connected: false },
                    { platform: 'LinkedIn', connected: false },
                    { platform: 'Google Drive', connected: true, user: 'user@gmail.com' },
                    { platform: 'Dropbox', connected: false },
                  ].map((acc, i) => (
                    <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{acc.platform}</p>
                        {acc.connected && <p className="text-xs text-[#555]">{acc.user}</p>}
                      </div>
                      {acc.connected ? (
                        <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30">Disconnect</button>
                      ) : (
                        <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold hover:bg-[#6D28D9]">Connect</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-6">
                <SectionLabel>Security</SectionLabel>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-white mb-3">Change Password</p>
                    <div className="space-y-3">
                      <input type="password" placeholder="Current password" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white" />
                      <input type="password" placeholder="New password" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white" />
                      <input type="password" placeholder="Confirm new password" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white" />
                      <button className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">Update Password</button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/[0.08]">
                    <p className="text-sm font-medium text-white mb-3">Two-Factor Authentication</p>
                    <p className="text-xs text-[#555] mb-3">Add an extra layer of security to your account</p>
                    <button className="px-5 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Set Up 2FA</button>
                  </div>
                  <div className="pt-4 border-t border-white/[0.08]">
                    <p className="text-sm font-medium text-white mb-3">Active Sessions</p>
                    {[{ device: 'Chrome on MacOS', location: 'New York, US', last: '2 hours ago' }].map((s, i) => (
                      <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-3 flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-white">{s.device}</p>
                          <p className="text-xs text-[#555]">{s.location} · {s.last}</p>
                        </div>
                        <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-red-500/20">
                    <p className="text-sm font-bold text-red-400 mb-2">Danger Zone</p>
                    <p className="text-xs text-[#555] mb-3">Permanently delete your account and all data</p>
                    <button className="px-5 py-2 bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/30 transition-all">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Referrals' && (
              <div className="space-y-6">
                <SectionLabel>Referrals</SectionLabel>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-6">
                  <p className="text-sm text-[#888] mb-3">Share your unique referral link and earn credits</p>
                  <div className="flex gap-3 mb-6">
                    <input readOnly value={`https://creatify.ai/ref/${user?.id || 'user123'}`} className="flex-1 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono" />
                    <button onClick={() => { navigator.clipboard.writeText(`https://creatify.ai/ref/${user?.id || 'user123'}`); toast.success('Copied!'); }} className="px-5 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Copy Link</button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">47</p>
                      <p className="text-xs text-[#555]">Total Referred</p>
                    </div>
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[#CCFF00]">235</p>
                      <p className="text-xs text-[#555]">Credits Earned</p>
                    </div>
                    <div className="bg-[#111111] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-xs text-[#555]">Pending</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#555]">Earn 5 credits for every referral who upgrades to Pro</p>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-6">
                <SectionLabel>Billing</SectionLabel>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-6">
                  <p className="text-sm font-medium text-white mb-3">Payment Method</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs font-bold text-white border border-white/[0.1]">VISA</div>
                    <div>
                      <p className="text-sm text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-[#555]">Expires 12/2027</p>
                    </div>
                    <button className="ml-auto px-3 py-1.5 rounded-lg bg-white/5 text-[#888] text-xs hover:bg-white/10">Update</button>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-6">
                  <p className="text-sm font-medium text-white mb-4">Billing History</p>
                  <div className="space-y-2">
                    {[{ date: 'Mar 10, 2026', amount: '$29.00', plan: 'Pro Plan', invoice: true }, { date: 'Feb 10, 2026', amount: '$29.00', plan: 'Pro Plan', invoice: true }, { date: 'Jan 10, 2026', amount: '$29.00', plan: 'Pro Plan', invoice: true }].map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                        <div>
                          <p className="text-sm text-white">{b.date}</p>
                          <p className="text-xs text-[#555]">{b.plan}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-white">{b.amount}</p>
                          <button className="text-xs text-[#7C3AED] hover:text-[#6D28D9]">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{children}</p>;
}
