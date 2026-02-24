import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import { Key, Eye, EyeOff, Save, Shield, Database, Trash2, Info, Cpu, Check } from 'lucide-react';
import { motion } from 'motion/react';

const AVAILABLE_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Default - Tốc độ cao, tối ưu cho xử lý nhanh', speed: 'Cực nhanh', quality: 'Khá' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Thông minh vượt trội, xử lý đa bước tốt', speed: 'Nhanh', quality: 'Ưu việt' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Thế hệ ổn định, hiệu năng cân bằng', speed: 'Rất nhanh', quality: 'Tốt' },
];

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash']);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedModels = localStorage.getItem('gemini_models');
    if (storedModels) setSelectedModels(JSON.parse(storedModels));
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_models', JSON.stringify(selectedModels));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const clearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu cục bộ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== id));
      } else {
        alert("Bạn phải chọn ít nhất một model.");
      }
    } else {
      setSelectedModels([...selectedModels, id]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h2>
        <p className="text-slate-500">Quản lý API Key, AI Models và dữ liệu ứng dụng.</p>
      </header>

      <div className="space-y-6 pb-20">
        {/* API Key Section */}
        <section className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <Key className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Gemini AI API Key</h3>
              <p className="text-xs text-slate-400">Xác thực để sử dụng các tính năng AI</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                className="w-full pl-6 pr-14 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
                placeholder="Nhập API Key của bạn..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
            <div className="flex items-center gap-2 p-4 bg-blue-50/50 rounded-2xl text-blue-700 text-[11px] font-medium leading-relaxed border border-blue-100">
              <Info className="w-4 h-4 shrink-0" />
              <p>Key của bạn được lưu an toàn trong trình duyệt (LocalStorage). Hãy lấy key tại Google AI Studio.</p>
            </div>
          </div>
        </section>

        {/* Model Selection Section */}
        <section className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Thứ tự Model Fallback</h3>
              <p className="text-xs text-slate-400">Hệ thống tự động chuyển đổi nếu model lỗi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={cn(
                  "p-5 rounded-3xl border-2 text-left transition-all relative group",
                  selectedModels.includes(model.id)
                    ? "bg-emerald-50 border-emerald-500 shadow-md"
                    : "bg-slate-50 border-transparent hover:border-slate-300"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={cn("font-bold text-lg", selectedModels.includes(model.id) ? "text-emerald-700" : "text-slate-900")}>
                    {model.name}
                  </h4>
                  {selectedModels.includes(model.id) && (
                    <div className="bg-emerald-500 text-white p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-3">{model.desc}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white border rounded-full text-slate-600">S: {model.speed}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white border rounded-full text-slate-600">Q: {model.quality}</span>
                </div>
                {selectedModels.includes(model.id) && (
                  <div className="absolute top-4 right-10 text-[10px] font-black text-emerald-300 uppercase italic opacity-20">
                    Priority {selectedModels.indexOf(model.id) + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          className={cn(
            "w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all text-lg",
            saved ? "bg-emerald-500 text-white" : "gradient-bg text-white shadow-xl shadow-emerald-200"
          )}
        >
          {saved ? <Shield className="w-6 h-6" /> : <Save className="w-6 h-6" />}
          {saved ? "Cấu hình đã được lưu" : "Lưu tất cả thay đổi"}
        </button>

        {/* Data Management */}
        <section className="glass-card p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-2xl">
              <Database className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Dữ liệu di sản</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:border-emerald-500 transition-all group">
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-600">Sao lưu dữ liệu</h4>
              <p className="text-xs text-slate-400 mt-1">Xuất toàn bộ bản ghi ra file JSON.</p>
            </button>
            <button className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:border-emerald-500 transition-all group">
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-600">Khôi phục</h4>
              <p className="text-xs text-slate-400 mt-1">Nhập dữ liệu di sản từ file.</p>
            </button>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={clearData}
              className="flex items-center gap-2 text-red-400 text-xs font-bold hover:text-red-600 transition-colors uppercase tracking-tight"
            >
              <Trash2 className="w-4 h-4" />
              Xóa vĩnh viễn dữ liệu cục bộ
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

