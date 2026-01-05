
import React, { useState, useCallback } from 'react';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeLeafImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDashboard from './components/ResultDashboard';
import { Leaf, Info, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const analysis = await analyzeLeafImage(file);
      setResult(analysis);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
      setStatus(AnalysisStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leaf Bio-Analyzer</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Scientific Precision Toolkit</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1"><Info size={14} /> 10cm Calibrator Required</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all">
            {status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR ? (
              <ImageUploader onImageSelect={handleImageSelect} />
            ) : (
              <div className="relative aspect-[3/4] md:aspect-video bg-slate-100 flex items-center justify-center group">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Leaf Analysis" 
                    className="w-full h-full object-contain"
                  />
                )}
                
                {status === AnalysisStatus.ANALYZING && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative">
                       <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Leaf className="w-6 h-6 text-emerald-400 animate-pulse" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Morphology...</h3>
                    <p className="text-slate-500 max-w-xs">Identifying calibration markers and calculating leaf pixels.</p>
                  </div>
                )}

                {status === AnalysisStatus.SUCCESS && result && (
                   <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg flex justify-between items-center animate-in fade-in slide-in-from-bottom-4">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Markers Detected</div>
                     <button 
                        onClick={reset}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
                      >
                        New Scan
                      </button>
                   </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
              <AlertCircle className="text-red-500 mt-1 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-800 uppercase">Analysis Failed</h4>
                <p className="text-sm text-red-600 font-medium">{error}</p>
                <button 
                  onClick={reset}
                  className="mt-3 text-sm font-bold text-red-700 hover:underline"
                >
                  Try again with a clearer image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results & Analytics */}
        <div className="lg:col-span-5 space-y-6">
          <ResultDashboard 
            result={result} 
            status={status} 
          />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pb-8 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
        <p>© 2024 Leaf Bio-Analyzer Pro. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-emerald-600 transition-colors">Documentation</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Research Support</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
