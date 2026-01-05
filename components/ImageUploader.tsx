
import React, { useRef } from 'react';
import { Upload, Camera, ImageIcon } from 'lucide-react';

interface Props {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<Props> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 text-emerald-600 group hover:bg-emerald-600 hover:text-white transition-all duration-300">
        <Upload className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Sample</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        Place your leaf on the calibration board. Ensure the two 10cm marker dots are clearly visible.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <Camera size={20} />
          Capture Image
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-white border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-600 text-slate-700 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <ImageIcon size={20} />
          Browse Files
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="mt-12 grid grid-cols-3 gap-8 w-full border-t border-slate-100 pt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-tight">Accurate<br/>Scaling</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-tight">Color<br/>Profiling</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-tight">Scientific<br/>Insights</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
