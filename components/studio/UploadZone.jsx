'use client';

import { Upload, Image as ImageIcon } from 'lucide-react';

export default function UploadZone({ onFile, accept = "*", label = "Upload file", icon: Icon, preview }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  if (preview) {
    return (
      <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
        <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
        <button
          onClick={() => onFile(null)}
          className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all"
    >
      <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
        {Icon ? <Icon size={24} className="text-[#666]" /> : <Upload size={24} className="text-[#666]" />}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
      </div>
      <input type="file" accept={accept} onChange={handleChange} className="hidden" />
    </label>
  );
}
