import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RotateCcw,
  Search,
  ChevronRight,
  Volume2,
  Download,
  Share2,
  Brain,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
  RefreshCw,
  History,
  Scan
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '../utils';
import { analyzePattern, getAudioGuide } from '../services/gemini';
import { api } from '../services/api';

export default function AIPatternScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        handleAnalyze(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        handleAnalyze(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (dataUrl: string) => {
    setIsScanning(true);
    setAnalysisStatus('processing');
    setProgress(0);
    setError(null);
    setResult(null);
    setAudioUrl(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 400);

    try {
      const analysisResult = await analyzePattern(dataUrl);
      setResult(analysisResult);
      setProgress(100);
      setAnalysisStatus('success');

      // Save result to records
      await api.createRecord({
        title: "Khai thác di sản: " + analysisResult.split('\n')[0].replace(/[#*]/g, '').substring(0, 30),
        category: "Gốm Chu Đậu",
        status: "Đã giải mã",
        priority: "Medium",
        description: analysisResult
      });

      // Get audio guide automatically
      setIsGeneratingAudio(true);
      const audio = await getAudioGuide(analysisResult.substring(0, 500));
      setAudioUrl(audio);

    } catch (err: any) {
      console.error("Analysis error:", err);
      // Ensure the error message matches the requested format "Đã dừng do lỗi"
      const errorMessage = err.message || "Đã dừng do lỗi hệ thống.";
      setError(errorMessage);
      setAnalysisStatus('error');
      // Reset progress or stop it from showing completion
      setProgress(prev => prev > 95 ? 95 : prev);
    } finally {
      setIsScanning(false);
      setIsGeneratingAudio(false);
      clearInterval(interval);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <header className="text-center space-y-3">
        <div className="inline-flex p-3 bg-emerald-50 rounded-2xl mb-2">
          <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Giải Mã Hoa Văn</h2>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">Sử dụng trí tuệ nhân tạo để giải mã ý nghĩa tâm linh và lịch sử của gốm Chu Đậu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <section className="space-y-6">
          <div
            className={cn(
              "relative aspect-square rounded-[3rem] border-4 border-dashed transition-all overflow-hidden bg-white shadow-inner flex flex-col items-center justify-center group",
              image || cameraActive ? "border-emerald-200" : "border-slate-200 hover:border-emerald-400"
            )}
          >
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => { setImage(null); setResult(null); setError(null); }}
                    className="p-4 bg-white/90 text-red-500 rounded-2xl hover:bg-white transition-all shadow-xl"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-emerald-50 transition-colors">
                  <Camera className="w-10 h-10 text-slate-300 group-hover:text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-600">Chụp ảnh hoặc Tải lên</p>
                  <p className="text-xs text-slate-400 mt-1">Định dạng JPG, PNG hỗ trợ nhận diện tốt nhất</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-6 py-4 gradient-bg text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200"
                  >
                    Mở Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Tải ảnh
                  </button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-emerald-600/20 backdrop-blur-sm flex flex-col items-center justify-center text-white p-10 text-center">
                <Loader2 className="w-16 h-16 animate-spin mb-6" />
                <h3 className="text-2xl font-black animate-pulse uppercase tracking-widest">Đang giải mã di sản...</h3>
                <div className="w-full h-2 bg-white/20 rounded-full mt-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                </div>
                <p className="mt-4 text-sm font-bold opacity-80">{progress}% hoàn thành</p>
              </div>
            )}

            {cameraActive && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 gap-4">
                <button
                  onClick={captureImage}
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  Chụp ảnh ngay
                </button>
                <button
                  onClick={stopCamera}
                  className="p-4 bg-white/90 text-slate-500 rounded-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          {!cameraActive && image && !isScanning && (
            <button
              onClick={() => handleAnalyze(image)}
              className="w-full py-5 gradient-bg text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-200 hover:scale-[1.02]"
            >
              <Brain className="w-6 h-6" />
              Khởi động lại AI Scanner
            </button>
          )}
        </section>

        {/* Result Section */}
        <section className="space-y-4 min-h-[400px]">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-2 border-red-100 p-8 rounded-[3rem] space-y-4"
              >
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Đã dừng do lỗi</h3>
                </div>
                <div className="p-4 bg-white rounded-2xl text-red-400 font-mono text-xs border border-red-50">
                  {error}
                </div>
                <p className="text-sm text-red-500/60 leading-relaxed italic">
                  Gợi ý: Hãy kiểm tra API Key trong phần "Cài đặt" hoặc thử lại sau vài giây.
                </p>
                <button
                  onClick={() => image && handleAnalyze(image)}
                  className="flex items-center gap-2 text-red-700 font-bold hover:underline py-2"
                >
                  <RotateCcw className="w-4 h-4" /> Thử lại ngay
                </button>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 rounded-[3rem] border-transparent shadow-2xl relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                    KẾT QUẢ GIẢI MÃ
                  </span>
                  <div className="flex gap-2">
                    {audioUrl && (
                      <button
                        onClick={toggleAudio}
                        className={cn(
                          "p-3 rounded-2xl transition-all",
                          isPlaying ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600 shadow-sm"
                        )}
                      >
                        {isGeneratingAudio ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    )}
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="prose prose-slate prose-lg max-w-none">
                    <Markdown>{result}</Markdown>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t flex gap-4">
                  <button className="flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <History className="w-4 h-4" />
                    Lưu vào thư viện
                  </button>
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Tải PDF
                  </button>
                </div>
                {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] opacity-60">
                <Search className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Phòng phân tích trống</p>
                <p className="text-slate-300 text-sm mt-3">Dữ liệu di sản sẽ xuất hiện tại đây sau khi bạn khởi động AI.</p>
              </div>
            )
            }
          </AnimatePresence>
        </section>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
