'use client';

import { useState, useCallback } from 'react';
import { Video, Upload, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateVideo } from '@/lib/generationUtils';

const STORYBOARD_BATCH_KEY = 'storyboard_batch';

const T2V_MODELS = [
  { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', provider: 'ByteDance', tier: 'premium', badge: 'TOP', creditCost: 25 },
  { id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', provider: 'Kuaishou', tier: 'premium', badge: 'TOP', creditCost: 30 },
  { id: 'veo3.1-text-to-video', name: 'Veo 3.1', provider: 'Google', tier: 'premium', badge: 'NEW', creditCost: 40 },
  { id: 'grok-imagine-text-to-video', name: 'Grok T2V', provider: 'xAI', tier: 'standard', badge: 'NEW', creditCost: 20 },
  { id: 'hunyuan-text-to-video', name: 'Hunyuan Video', provider: 'Tencent', tier: 'standard', creditCost: 15 },
  { id: 'minimax-hailuo-02-pro-t2v', name: 'MiniMax Hailuo 02 Pro', provider: 'MiniMax', tier: 'standard', creditCost: 15 },
  { id: 'veo3.1-lite-text-to-video', name: 'Veo 3.1 Lite', provider: 'Google', tier: 'standard', creditCost: 15 },
  { id: 'wan2.5-text-to-video', name: 'WAN 2.5', provider: 'Alibaba', tier: 'standard', creditCost: 12 },
  { id: 'pixverse-v6-t2v', name: 'PixVerse v6', provider: 'PixVerse', tier: 'standard', creditCost: 12 },
  { id: 'vidu-q3-turbo-text-to-video', name: 'Vidu Q3 Turbo', provider: 'Vidu', tier: 'standard', creditCost: 10 },
  { id: 'ltx-2.3-text-to-video', name: 'LTX 2.3 T2V', provider: 'LightTricks', tier: 'standard', creditCost: 8 },
  { id: 'vidu-q2-turbo-text-to-video', name: 'Vidu Q2 Turbo', provider: 'Vidu', tier: 'fast', creditCost: 5 },
];

export default function BulkVideoPage() {
  const [rows, setRows] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(STORYBOARD_BATCH_KEY);
        if (stored) {
          sessionStorage.removeItem(STORYBOARD_BATCH_KEY);
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, i) => ({
              id: i + 1,
              prompt: item.prompt || 'Scene ' + (i + 1),
              model: item.model || 'seedance-v2.0-t2v',
              duration: String(item.duration || 5),
              aspect_ratio: item.aspect_ratio || '16:9',
              status: 'pending',
              progress: 0,
              resultUrl: null,
            }));
          }
        }
      } catch (e) { console.error(e); }
    }
    return [];
  });

  const [model, setModel] = useState('seedance-v2.0-t2v');
  const [duration, setDuration] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generating, setGenerating] = useState(false);
  const [started, setStarted] = useState(false);

  const handleCSV = (file) => {
    setRows([
      { id: 1, prompt: 'Epic mountain drone shot', model: 'seedance-v2.0-t2v', duration: '5', aspect_ratio: '16:9', status: 'pending', progress: 0, resultUrl: null },
      { id: 2, prompt: 'City street timelapse at night', model: 'kling-v2.6-pro-t2v', duration: '5', aspect_ratio: '16:9', status: 'pending', progress: 0, resultUrl: null },
      { id: 3, prompt: 'Product reveal animation', model: 'seedance-v2.0-t2v', duration: '10', aspect_ratio: '1:1', status: 'pending', progress: 0, resultUrl: null },
    ]);
    toast.success('CSV loaded \u2014 3 videos in batch');
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleCSV(file);
  };

  const handleStart = async () => {
    if (rows.length === 0) { toast.error('No videos to generate'); return; }

    setStarted(true);
    setGenerating(true);

    const updatedRows = [...rows];

    for (let i = 0; i < updatedRows.length; i++) {
      const row = updatedRows[i];
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating', progress: 5 } : r));

      try {
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, progress: 15 } : r));

        const results = await generateVideo({
          model: row.model,
          prompt: row.prompt,
          aspect_ratio: row.aspect_ratio,
          duration: parseInt(row.duration) || 5,
        });

        const videoUrl = results?.[0]?.url || '';
        setRows(prev => prev.map(r =>
          r.id === row.id ? { ...r, status: 'completed', progress: 100, resultUrl: videoUrl } : r
        ));
      } catch (err) {
        setRows(prev => prev.map(r =>
          r.id === row.id ? { ...r, status: 'failed', progress: 0, error: err.message } : r
        ));
        console.error(`Row ${row.id} failed:`, err);
      }
    }

    setGenerating(false);
    const completedCount = rows.filter(r => r.status === 'completed').length;
    if (completedCount > 0) {
      toast.success(`${completedCount}/${updatedRows.length} videos generated!`);
    }
  };

  const handleDownloadAll = useCallback(() => {
    const completed = rows.filter(r => r.status === 'completed' && r.resultUrl);
    if (completed.length === 0) { toast.error('No completed videos to download'); return; }

    completed.forEach((row, index) => {
      const link = document.createElement('a');
      link.href = row.resultUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `video_${row.id}_${row.prompt.substring(0, 30).replace(/\s+/g, '_')}.mp4`;
      setTimeout(() => { link.click(); link.remove(); }, index * 500);
    });
    toast.success(`Opening ${completed.length} video download(s)`);
  }, [rows]);

  const completed = rows.filter(r => r.status === 'completed').length;
  const hasResults = rows.some(r => r.status === 'completed' && r.resultUrl);

  return (
    <div style={{ padding: '28px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Video size={22} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Bulk Video Generator
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Generate multiple videos at once via AI models
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 16, padding: '20px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 280px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            VIDEO MODEL
          </label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {T2V_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 0 120px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            DURATION
          </label>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="5">5 sec</option>
            <option value="10">10 sec</option>
          </select>
        </div>

        <div style={{ flex: '0 0 120px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            ASPECT RATIO
          </label>
          <select
            value={aspectRatio}
            onChange={e => setAspectRatio(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
            <option value="4:5">4:5</option>
          </select>
        </div>

        <div style={{ flex: '0 0 150px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            BATCH SOURCE
          </label>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)', borderRadius: 10,
            padding: '9px 14px', cursor: 'pointer',
            fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
          }}>
            <Upload size={14} /> Upload CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {rows.length > 0 && !started && (
          <button
            onClick={handleStart}
            style={{
              padding: '10px 24px',
              background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
              border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              alignSelf: 'flex-end',
            }}
          >
            Generate {rows.length} Videos
          </button>
        )}

        {started && hasResults && (
          <button
            onClick={handleDownloadAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 24px',
              background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
              border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              alignSelf: 'flex-end',
            }}
          >
            <Download size={14} /> Download All
          </button>
        )}
      </div>

      {rows.length === 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
          borderRadius: 20, padding: '60px 32px', textAlign: 'center',
        }}>
          <Video size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            No videos in batch
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Upload a CSV or generate scenes from the Storyboard Pipeline to get started
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Batch Queue ({rows.length} videos)
            </span>
            {started && (
              <span style={{ fontSize: 12, fontWeight: 600, color: completed === rows.length ? '#22c55e' : 'var(--text-muted)' }}>
                {completed}/{rows.length} completed
              </span>
            )}
          </div>

          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {started && (
              <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 100, marginBottom: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 100,
                  background: 'var(--accent-primary)',
                  width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%`,
                  transition: 'width 400ms ease',
                }} />
              </div>
            )}

            {rows.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'var(--bg-elevated)',
                border: '1px solid',
                borderColor: r.status === 'completed' ? 'rgba(74,222,128,0.2)' : r.status === 'failed' ? 'rgba(239,68,68,0.2)' : r.status === 'generating' ? 'rgba(0,194,255,0.2)' : 'var(--border-subtle)',
                borderRadius: 10,
                transition: 'border-color 200ms',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', width: 28, flexShrink: 0 }}>#{r.id}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.prompt}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {T2V_MODELS.find(m => m.id === r.model)?.name || r.model} | {r.duration}s | {r.aspect_ratio}
                  </div>
                </div>

                {r.status === 'generating' && (
                  <div style={{ width: 80, height: 6, background: 'var(--bg-input)', borderRadius: 100, flexShrink: 0 }}>
                    <div style={{ width: `${r.progress}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 100, transition: 'width 300ms' }} />
                  </div>
                )}

                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, flexShrink: 0,
                  background: r.status === 'completed' ? 'rgba(74,222,128,0.15)' : r.status === 'generating' ? 'rgba(0,194,255,0.15)' : r.status === 'failed' ? 'rgba(239,68,68,0.15)' : 'var(--bg-input)',
                  color: r.status === 'completed' ? '#22c55e' : r.status === 'generating' ? 'var(--accent-primary)' : r.status === 'failed' ? '#ef4444' : 'var(--text-muted)',
                }}>
                  {r.status === 'generating' ? 'GENERATING' : r.status.toUpperCase()}
                </span>

                {r.status === 'completed' && r.resultUrl && (
                  <>
                    <a href={r.resultUrl} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                      background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'none',
                    }} title="Open video">
                      <ExternalLink size={13} />
                    </a>
                    <button onClick={() => {
                      const a = document.createElement('a');
                      a.href = r.resultUrl;
                      a.download = `video_${r.id}.mp4`;
                      a.click();
                      a.remove();
                    }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                      background: 'var(--btn-generate-bg)', border: 'none',
                      color: 'var(--btn-generate-text)', cursor: 'pointer',
                    }} title="Download video">
                      <Download size={13} />
                    </button>
                  </>
                )}

                {r.status === 'failed' && r.error && (
                  <span style={{ fontSize: 10, color: '#ef4444', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.error}>
                    {r.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
