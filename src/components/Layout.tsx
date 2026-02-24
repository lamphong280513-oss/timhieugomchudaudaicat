import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Scan,
  Library,
  MapPin,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Key,
  Info,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

const navItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/scan', label: 'Nhận diện AI', icon: Scan },
  { path: '/library', label: 'Thư viện số', icon: Library },
  { path: '/map', label: 'Bản đồ di sản', icon: MapPin },
  { path: '/community', label: 'Cộng đồng', icon: Users },
  { path: '/settings', label: 'Cài đặt', icon: SettingsIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (!stored) {
      setHasKey(false);
      setShowApiKeyModal(true);
    } else {
      setHasKey(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      setHasKey(true);
      setShowApiKeyModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Library className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Chu Đậu AI</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasKey && (
            <Link to="/settings" className="text-[10px] text-red-500 font-bold animate-pulse flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Lấy API Key
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Sidebar / Drawer */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r z-[60] flex flex-col transition-transform duration-300",
              !isSidebarOpen && "hidden md:flex"
            )}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Library className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 leading-tight">Chu Đậu AI</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Di sản Việt</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600")} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t space-y-4">
              {!hasKey && (
                <Link to="/settings" className="block p-3 bg-red-50 border border-red-100 rounded-xl text-center group">
                  <p className="text-[11px] text-red-600 font-bold mb-1 group-hover:underline uppercase">Lấy API key để sử dụng app</p>
                  <p className="text-[9px] text-red-400 leading-tight">Vui lòng thiết lập để sử dụng chức năng AI</p>
                </Link>
              )}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-tighter">Trạng thái AI</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", hasKey ? "bg-emerald-500 animate-pulse" : "bg-red-400")} />
                  <span className="text-[11px] font-bold text-slate-700">
                    {hasKey ? "Hệ thống AI Sẵn sàng" : "Chờ nhập API Key"}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Chào mừng bạn đến với Chu Đậu AI</h3>
                <p className="text-slate-500 text-sm">Vui lòng nhập Google AI Studio API Key để bắt đầu trải nghiệm di sản.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Cấu hình API Key</label>
                  <input
                    type="password"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                    placeholder="Nhập API Key của bạn..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl space-y-2">
                  <a
                    href="https://aistudio.google.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lấy API key để sử dụng app tại đây</span>
                  </a>
                  <p className="text-[10px] text-blue-500 leading-relaxed">Truy cập Google AI Studio để tạo key miễn phí trước khi sử dụng ứng dụng.</p>
                </div>

                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim()}
                  className="w-full py-4 gradient-bg text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Bắt đầu ngay
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
                <Info className="w-3 h-3" />
                <span>Key của bạn được lưu an toàn tại LocalStorage</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl h-16 flex items-center justify-around px-2 z-40">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300",
                isActive ? "text-emerald-600 scale-110" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
