'use client';

import { useState } from 'react';
import { Webhook, Plus, Trash2, Edit, TestTube, CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const EVENTS = ['generation.complete', 'bulk.complete', 'agent.run', 'credits.low', 'error.occurred'];

const SAMPLE_WEBHOOKS = [
  { id: 1, url: 'https://api.example.com/creatify', events: ['generation.complete', 'agent.run'], status: 'active', lastTriggered: '2 hours ago' },
  { id: 2, url: 'https://hooks.slack.com/services/...', events: ['error.occurred', 'credits.low'], status: 'active', lastTriggered: '1 day ago' },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState(SAMPLE_WEBHOOKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(['generation.complete']);
  const [secret, setSecret] = useState('');

  const toggleEvent = (e) => setSelectedEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const addWebhook = () => {
    if (!newUrl) { toast.error('Enter a URL'); return; }
    setWebhooks([...webhooks, { id: Date.now(), url: newUrl, events: [...selectedEvents], status: 'active', lastTriggered: 'Never' }]);
    setShowAdd(false);
    setNewUrl('');
    setSecret('');
    toast.success('Webhook added!');
  };

  const deleteWebhook = (id) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast.success('Webhook deleted');
  };

  const testWebhook = (url) => toast.success(`Test payload sent to ${url}`);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Webhook} title="WEBHOOKS" subtitle="Trigger generation runs and receive notifications from any system" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <Plus size={16} /> Add Webhook
          </button>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">URL</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Events</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Status</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Last Triggered</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map(wh => (
                <tr key={wh.id} className="border-b border-white/[0.04]">
                  <td className="p-4 text-[#ccc] text-xs font-mono max-w-[200px] truncate">{wh.url}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map(e => <span key={e} className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{e}</span>)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${wh.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-red-500/20 text-red-500'}`}>{wh.status}</span>
                  </td>
                  <td className="p-4 text-[#555] text-xs">{wh.lastTriggered}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => testWebhook(wh.url)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><TestTube size={14} /></button>
                      <button onClick={() => toast.success('Opening editor...')} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Edit size={14} /></button>
                      <button onClick={() => deleteWebhook(wh.id)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
            <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-bold mb-4">Add Webhook</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Endpoint URL</label>
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://your-api.com/webhook" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Events</label>
                  <div className="flex flex-wrap gap-2">
                    {EVENTS.map(e => (
                      <button key={e} onClick={() => toggleEvent(e)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedEvents.includes(e) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Secret Key (Optional)</label>
                  <input value={secret} onChange={e => setSecret(e.target.value)} placeholder="Your webhook secret" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white">Cancel</button>
                <button onClick={addWebhook} className="flex-1 px-4 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] flex items-center justify-center gap-2"><TestTube size={14} /> Test & Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}