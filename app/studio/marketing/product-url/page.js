'use client';

import { useState } from 'react';
import { Link, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn'];
const FORMATS = ['Short Video', 'Image Ad', 'Carousel', 'Story'];
const STYLES = ['Casual', 'Professional', 'High-Energy', 'Emotional', 'Educational', 'Humorous'];

export default function MarketingProductUrlPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [platform, setPlatform] = useState('TikTok');
  const [format, setFormat] = useState('Short Video');
  const [style, setStyle] = useState('Casual');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleScan = async () => {
    if (!url.trim()) {
      toast.error('Please enter a product URL');
      return;
    }
    setScanning(true);
    toast.loading('Scanning product page...', { id: 'scan' });
    try {
      await new Promise(r => setTimeout(r, 2000));
      setProduct({
        name: 'Product from URL',
        price: '$49.99',
        description: 'This product is designed to help you achieve your goals with premium quality and innovative features. Perfect for everyday use.',
        features: ['Premium quality', 'Easy to use', 'Fast shipping', 'Satisfaction guaranteed'],
        image: 'https://picsum.photos/seed/product/400/400',
      });
      toast.success('Product info extracted!', { id: 'scan' });
    } catch (e) {
      toast.error('Failed to scan URL', { id: 'scan' });
    } finally {
      setScanning(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.success('Generating product ads...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/productad/720/1280', prompt: `Product: ${product?.name}` }]);
      toast.success('Product ads generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Link} badge="NEW" title="PRODUCT URL TO AD" subtitle="Paste any product URL — AI scrapes it and generates video ads automatically" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Product URL</SectionLabel>
              <div className="flex gap-2">
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]"
                />
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#5558E3] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {scanning ? <Loader2 size={16} className="animate-spin" /> : null}
                  Scan Product
                </button>
              </div>
            </div>
            {product && (
              <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4 flex gap-4">
                <img src={product.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{product.name}</h3>
                  <p className="text-lg font-bold text-[#CCFF00] mt-1">{product.price}</p>
                  <p className="text-xs text-[#888] mt-2 line-clamp-2">{product.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[10px] text-[#888]">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </GenerationPanel>
        {product && (
          <GenerationPanel>
            <div className="space-y-4">
              <div>
                <SectionLabel>Platform</SectionLabel>
                <StudioDropdown label="Platform" options={PLATFORMS} value={platform} onChange={setPlatform} />
              </div>
              <div>
                <SectionLabel>Ad Format</SectionLabel>
                <StudioDropdown label="Ad Format" options={FORMATS} value={format} onChange={setFormat} />
              </div>
              <div>
                <SectionLabel>Style</SectionLabel>
                <StudioDropdown label="Style" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </div>
          </GenerationPanel>
        )}
        {product && (
          <div className="flex justify-end">
            <GenerateButton onClick={handleGenerate} loading={loading}>
              Generate Product Ads
            </GenerateButton>
          </div>
        )}
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}