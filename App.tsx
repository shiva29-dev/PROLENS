import React, { useState, useCallback, useRef } from 'react';
import { UploadZone } from './components/UploadZone';
import { StyleCard } from './components/StyleCard';
import { fileToBase64, generateHeadshot } from './services/geminiService';
import { STYLE_OPTIONS } from './constants';
import { AppState, GeneratedImage } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(STYLE_OPTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<GeneratedImage | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setAppState(AppState.IDLE);
    setResultImage(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setAppState(AppState.PROCESSING);
    try {
      const base64Data = await fileToBase64(selectedFile);
      const selectedStyle = STYLE_OPTIONS.find(s => s.id === selectedStyleId);
      
      if (!selectedStyle) throw new Error("Style not found");

      const generatedBase64 = await generateHeadshot(
        base64Data,
        selectedFile.type,
        selectedStyle.promptContext,
        customPrompt
      );

      setResultImage({
        url: generatedBase64,
        timestamp: Date.now()
      });
      setAppState(AppState.SUCCESS);
      
      // Scroll to result on mobile
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultImage(null);
    setCustomPrompt('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-100">
        {/* Background Accents */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-4">
                    ProLens <span className="text-amber-400">AI</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Transform your casual selfies into executive-grade headshots in seconds using <span className="text-amber-400 font-medium">Gemini 2.5 Flash</span> technology.
                </p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left Column: Input Controls */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    
                    {/* 1. Upload Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">1</span>
                            <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold">Upload Source</h2>
                        </div>
                        
                        {!previewUrl ? (
                            <UploadZone onFileSelected={handleFileSelect} />
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img src={previewUrl} alt="Original" className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                <button 
                                    onClick={handleReset}
                                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500/80 text-white transition-colors border border-white/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                                    <p className="text-xs font-mono text-amber-400">SOURCE_IMAGE_LOADED</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 2. Style Selection */}
                    <section className={`transition-opacity duration-500 ${!previewUrl ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                         <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">2</span>
                            <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold">Select Style</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {STYLE_OPTIONS.map((style) => (
                                <StyleCard 
                                    key={style.id}
                                    styleOption={style}
                                    isSelected={selectedStyleId === style.id}
                                    onSelect={setSelectedStyleId}
                                />
                            ))}
                        </div>
                    </section>

                    {/* 3. Custom Prompt & Action */}
                    <section className={`transition-opacity duration-500 ${!previewUrl ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                         <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">3</span>
                            <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold">Fine Tune</h2>
                        </div>
                        
                        <div className="bg-slate-900/40 rounded-xl p-1 border border-white/5 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/50 transition-all duration-300 mb-6">
                            <textarea 
                                className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 text-sm p-4 focus:ring-0 resize-none min-h-[80px]"
                                placeholder="Example: 'Add a retro filter' or 'Remove background person'..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={appState === AppState.PROCESSING}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg tracking-wide
                                flex items-center justify-center gap-2
                                transition-all duration-300 shadow-xl
                                ${appState === AppState.PROCESSING 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 hover:shadow-amber-500/25'
                                }
                            `}
                        >
                            {appState === AppState.PROCESSING ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Studio Magic...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                    </svg>
                                    Generate Headshot
                                </>
                            )}
                        </button>
                        {appState === AppState.ERROR && (
                             <p className="mt-4 text-red-400 text-center text-sm bg-red-400/10 py-2 rounded border border-red-400/20">
                                Generation failed. Please try a different photo or prompt.
                             </p>
                        )}
                    </section>

                </div>

                {/* Right Column: Output */}
                <div className="lg:col-span-7" ref={resultRef}>
                    <div className="sticky top-8">
                         <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">4</span>
                                <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold">Result</h2>
                            </div>
                            {resultImage && (
                                <span className="text-xs font-mono text-slate-500">
                                    GENERATED_ID: {resultImage.timestamp}
                                </span>
                            )}
                        </div>

                        <div className={`
                            relative w-full aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden
                            bg-slate-900 border border-white/5 shadow-2xl
                            flex items-center justify-center
                            ${appState === AppState.IDLE && !resultImage ? 'border-dashed border-slate-800' : ''}
                        `}>
                             {/* Empty State */}
                            {appState === AppState.IDLE && !resultImage && (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-500 text-lg">Your masterpiece awaits</p>
                                    <p className="text-slate-600 text-sm mt-2">Upload an image and select a style to begin.</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {appState === AppState.PROCESSING && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                                    <div className="relative w-24 h-24">
                                         <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-slate-800"></div>
                                         <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="mt-6 text-amber-400 font-medium animate-pulse tracking-wider">AI IS THINKING...</p>
                                </div>
                            )}

                            {/* Result Image */}
                            {resultImage && (
                                <img 
                                    src={resultImage.url} 
                                    alt="Generated Headshot" 
                                    className="w-full h-full object-cover animate-fadeIn transition-all duration-700" 
                                />
                            )}

                            {/* Overlay for download */}
                            {resultImage && appState !== AppState.PROCESSING && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                                    <a 
                                        href={resultImage.url} 
                                        download={`headshot-${resultImage.timestamp}.png`}
                                        className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg transform hover:scale-105 duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l0 .008v.008H12v-.008Zm0-9v9m0 0-3-3m3 3 3-3" />
                                        </svg>
                                        Download High-Res
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.98); filter: blur(10px); }
                to { opacity: 1; transform: scale(1); filter: blur(0); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
        `}</style>
    </div>
  );
}
