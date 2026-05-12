'use client';

import { useState } from 'react';
import { Shirt } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const MODEL_TYPES = ['Male', 'Female', 'Non-binary', 'Child'];
const POSES = ['Standing', 'Walking', 'Sitting', 'Running', 'Editorial', 'Street Style', 'Runway', 'Casual'];
const BACKGROUNDS = ['Studio White', 'Runway', 'Street', 'Nature', 'Urban', 'Custom'];
const SEASONS = ['Spring-Summer', 'Fall-Winter'];
const MODELS = ['flux', 'dalle', 'midjourney'];

export default function FashionPage() {
  const [modelImage, setModelImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [promptMode, setPromptMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState('Female');
  const [pose, setPose] = useState('Standing');
  const [background, setBackground] = useState('Studio White');
  const [season, setSeason] = useState('Spring-Summer');
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleModelFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setModelImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setModelImage(null);
    }
  };

  const handleClothingFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setClothingImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setClothingImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!promptMode && !modelImage && !clothingImage) {
      toast.error('Please upload images or use prompt mode');
      return;
    }
    if (promptMode && !prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = promptMode
        ? prompt
        : `${modelType} model wearing clothing, ${pose} pose, ${background} background, ${season} collection`;
      if (apiKey) {
        const response = await muapi.generateImage(apiKey, {
          model,
          prompt: fullPrompt,
          aspect_ratio: '3:4',
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Fashion image generated!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/768/1024`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Fashion image generated!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="MODEL TYPE">
            {MODEL_TYPES.map(t => (
              <button key={t} onClick={() => setModelType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: modelType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: modelType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (modelType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (modelType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: modelType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="BACKGROUND" value={background} onChange={setBackground} options={BACKGROUNDS} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="SEASON" value={season} onChange={setSeason} options={SEASONS} />
              </div>
              <StudioDropdown label="MODEL" value={model} onChange={setModel} options={MODELS} />
            </div>
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', maxWidth: '70%', lineHeight: 1.2,
              padding: '0 24px', zIndex: 1,
            }}>
              Fashion Generator
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', gap: 12 }}>
              <div style={{ width: 150 }}>
                <UploadZone onFile={handleModelFile} preview={modelImage} accept="image/*" label="Model (opt)" />
              </div>
              <div style={{ width: 150 }}>
                <UploadZone onFile={handleClothingFile} preview={clothingImage} accept="image/*" label="Clothing (opt)" />
              </div>
            </div>
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ maxWidth: 500, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results} columns={2} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Fashion Controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <ControlButton onClick={() => setPromptMode(false)}
                style={{ background: !promptMode ? 'var(--accent-bg)' : 'var(--bg-input)', color: !promptMode ? 'var(--accent-text)' : 'var(--text-secondary)' }}>
                Image Mode
              </ControlButton>
              <ControlButton onClick={() => setPromptMode(true)}
                style={{ background: promptMode ? 'var(--accent-bg)' : 'var(--bg-input)', color: promptMode ? 'var(--accent-text)' : 'var(--text-secondary)' }}>
                Prompt Mode
              </ControlButton>
            </div>
            {promptMode ? (
              <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the outfit and scene..." />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {POSES.map(p => (
                  <ControlButton key={p} onClick={() => setPose(p)}
                    style={{
                      background: pose === p ? 'var(--accent-bg)' : 'var(--bg-input)',
                      color: pose === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                    }}>
                    {p}
                  </ControlButton>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
