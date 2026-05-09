'use client';

import { useState, useRef } from 'react';

const BULK_TABS = [
  { id: 'image', label: 'Bulk Image', desc: 'CSV upload, batch generate up to 500 images' },
  { id: 'video', label: 'Bulk Video', desc: 'CSV upload, batch generate videos' },
  { id: 'lipsync', label: 'Bulk Lip Sync', desc: 'One character + CSV of audio = 100 videos' },
  { id: 'voiceover', label: 'Bulk Voiceover', desc: 'CSV of scripts, batch audio generation' },
  { id: 'queue', label: 'Job Queue', desc: 'Live progress tracker, retry, download ZIP' },
  { id: 'download', label: 'Download ZIP', desc: 'Export all completed batch outputs as a ZIP' },
  { id: 'webhooks', label: 'Webhooks', desc: 'Get notified when batches complete' },
  { id: 'drive', label: 'Push to Drive', desc: 'Auto-send outputs to Google Drive' },
];

const MOCK_JOBS = [
  { id: '1', type: 'image', total: 50, completed: 50, failed: 0, status: 'completed', created: '2 hours ago' },
  { id: '2', type: 'video', total: 25, completed: 18, failed: 2, status: 'processing', created: '30 min ago' },
  { id: '3', type: 'lipsync', total: 100, completed: 0, failed: 0, status: 'queued', created: '5 min ago' },
];

export default function BulkGenerateStudio({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'image');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.type === 'text/csv')) {
      setFile(f);
    }
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  const renderCSVUploader = (type) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer hover:border-[#7C3AED]/30 transition-all"
    >
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      {file ? (
        <div>
          <p className="text-sm font-medium text-[#F9FAFB]">{file.name}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          {!uploaded && (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              disabled={uploading}
              className="mt-4 px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all"
            >
              {uploading ? 'Uploading...' : 'Upload & Start'}
            </button>
          )}
          {uploaded && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Uploaded — {type === 'image' ? '50 rows' : type === 'video' ? '25 rows' : type === 'lipsync' ? '100 rows' : '30 rows'} ready
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-[#F9FAFB]">Drop your CSV here or click to browse</p>
          <p className="text-xs text-[#9CA3AF] mt-1">CSV format: prompt, model, params (one per row)</p>
        </div>
      )}
    </div>
  );

  const renderDownloadZIP = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Export Completed Batches</h4>
          <p className="text-xs text-[#9CA3AF]">Select completed jobs and download all outputs as a single ZIP file</p>
        </div>
      </div>
      {MOCK_JOBS.filter(j => j.status === 'completed').length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">Available Downloads</h4>
          {MOCK_JOBS.filter(j => j.status === 'completed').map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB] capitalize">{job.type} Batch</p>
                  <p className="text-xs text-[#9CA3AF]">{job.total} files • {job.created}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download ZIP
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#9CA3AF]">No completed batches available for download yet</p>
        </div>
      )}
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M18 8a6 6 0 01-6 6"/><path d="M6 16a6 6 0 016-6"/><path d="M18 8a6 6 0 00-6-6"/><path d="M6 16a6 6 0 006 6"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Webhook Notifications</h4>
          <p className="text-xs text-[#9CA3AF]">Receive HTTP callbacks when your batch jobs complete, fail, or progress</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Webhook URL</label>
        <div className="flex gap-2">
          <input type="text" placeholder="https://your-server.com/webhook" className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
          <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all">Add</button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Trigger on</label>
        {['Job Completed', 'Job Failed', 'Progress Update'].map(evt => (
          <label key={evt} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
            <span className="text-sm text-[#F9FAFB]">{evt}</span>
          </label>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-3">Recent Events</h4>
        <div className="space-y-2">
          {[
            { event: 'job.completed', batch: 'Image Batch #3', time: '2 min ago', status: 'success' },
            { event: 'job.progress', batch: 'Video Batch #2', time: '15 min ago', status: 'info' },
          ].map((evt, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg text-xs">
              <div className={`w-2 h-2 rounded-full ${evt.status === 'success' ? 'bg-green-500' : 'bg-[#06B6D4]'}`} />
              <span className="text-[#F9FAFB] font-mono">{evt.event}</span>
              <span className="text-[#9CA3AF]">{evt.batch}</span>
              <span className="text-[#6B7280] ml-auto">{evt.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPushToDrive = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Google Drive Integration</h4>
          <p className="text-xs text-[#9CA3AF]">Auto-sync all batch outputs to your connected Google Drive folder</p>
        </div>
      </div>
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
        </div>
        <p className="text-sm font-medium text-[#F9FAFB] mb-1">Not Connected</p>
        <p className="text-xs text-[#9CA3AF] mb-4">Connect your Google Drive to auto-sync batch outputs</p>
        <button className="px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all">Connect Google Drive</button>
      </div>
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">Sync Settings</h4>
        {[
          { label: 'Auto-sync completed batches', desc: 'Upload all outputs to Drive when batch completes' },
          { label: 'Create folder per batch', desc: 'Organize outputs into separate folders by batch ID' },
          { label: 'Sync subfolders by type', desc: 'Separate images, videos, and audio into subfolders' },
        ].map((opt, i) => (
          <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
            <div className="flex-1">
              <span className="text-sm text-[#F9FAFB]">{opt.label}</span>
              <p className="text-xs text-[#9CA3AF]">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderJobQueue = () => (
    <div className="space-y-3">
      {MOCK_JOBS.map((job) => {
        const progress = job.total > 0 ? Math.round(((job.completed + job.failed) / job.total) * 100) : 0;
        const statusColors = {
          completed: 'bg-green-500',
          processing: 'bg-[#7C3AED]',
          queued: 'bg-yellow-500',
          failed: 'bg-red-500',
        };
        return (
          <div key={job.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[job.status]}`} />
                <span className="text-sm font-medium text-[#F9FAFB] capitalize">{job.type} Generation</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  job.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                  job.status === 'processing' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' :
                  job.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>{job.status}</span>
              </div>
              <span className="text-xs text-[#9CA3AF]">{job.created}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${job.status === 'completed' ? 'bg-green-500' : job.status === 'failed' ? 'bg-red-500' : 'bg-[#7C3AED]'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-[#9CA3AF] whitespace-nowrap">
                {job.completed + job.failed}/{job.total}
                {job.failed > 0 && <span className="text-red-400 ml-1">({job.failed} failed)</span>}
              </span>
              {job.status === 'completed' && (
                <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">
                  Download ZIP
                </button>
              )}
              {job.status === 'failed' && (
                <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9CA3AF] text-xs font-medium hover:bg-white/10 transition-all">
                  Retry Failed
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Bulk Generate</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Upload a CSV and generate hundreds of images, videos, or voiceovers at once
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {BULK_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">
          {activeTab === 'queue' ? (
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Job Queue</h3>
              {renderJobQueue()}
            </div>
          ) : activeTab === 'download' ? (
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Download ZIP</h3>
              {renderDownloadZIP()}
            </div>
          ) : activeTab === 'webhooks' ? (
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Webhooks</h3>
              {renderWebhooks()}
            </div>
          ) : activeTab === 'drive' ? (
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Push to Google Drive</h3>
              {renderPushToDrive()}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-1 capitalize">{activeTab} Generation</h3>
              <p className="text-xs text-[#9CA3AF] mb-6">{BULK_TABS.find(t => t.id === activeTab)?.desc}</p>
              {renderCSVUploader(activeTab)}

              {uploaded && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-3">Preview (first 3 rows)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-[#9CA3AF] border-b border-white/10">
                          <th className="text-left py-2 pr-4 font-medium">Prompt</th>
                          <th className="text-left py-2 pr-4 font-medium">Model</th>
                          <th className="text-left py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { prompt: 'A beautiful sunset over mountains', model: 'Flux Dev', status: 'completed' },
                          { prompt: 'Futuristic city skyline at night', model: 'Midjourney v7', status: 'processing' },
                          { prompt: 'Portrait of a cat wearing a hat', model: 'Flux Schnell', status: 'queued' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-white/5 text-[#F9FAFB]">
                            <td className="py-2 pr-4 truncate max-w-[300px]">{row.prompt}</td>
                            <td className="py-2 pr-4 text-[#9CA3AF]">{row.model}</td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                row.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                row.status === 'processing' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' :
                                'bg-yellow-500/10 text-yellow-400'
                              }`}>{row.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download All as ZIP
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-[#9CA3AF] text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      Push to Google Drive
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
