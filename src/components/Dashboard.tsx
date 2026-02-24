import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  MoreVertical,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Record, Category } from '../types';
import { api } from '../services/api';

export default function Dashboard() {
  const [records, setRecords] = useState<Record[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsData, catsData] = await Promise.all([
          api.getRecords(),
          api.getCategories()
        ]);
        setRecords(recordsData);
        setCategories(catsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Tổng hiện vật', value: records.length + 124, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Mới nhận diện', value: 12, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Đã giải mã', value: records.length + 86, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cần xác thực', value: 8, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tổng quan di sản</h2>
          <p className="text-slate-500 font-medium">Hệ thống giải mã di sản gốm Chu Đậu thông minh.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold shadow-sm">
            <Download className="w-4 h-4" />
            <span>Xuất dữ liệu</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 gradient-bg text-white rounded-2xl shadow-xl shadow-emerald-200 hover:scale-105 transition-all font-bold">
            <Plus className="w-4 h-4" />
            <span>Thêm hiện vật</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] border-transparent hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Hoạt động gần đây</h3>
            <button className="text-sm text-emerald-600 font-bold hover:underline">Xem tất cả thư viện</button>
          </div>
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-transparent">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiện vật</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày phân tích</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(records.length > 0 ? records : [
                    { title: 'Bình Tỳ Bà Hoa Lam', category: 'Bình gốm', status: 'Đã giải mã', createdAt: '2026-02-22T10:00:00Z' },
                    { title: 'Đĩa Cổ Vẽ Thiên Nga', category: 'Đĩa cổ', status: 'Chờ xác thực', createdAt: '2026-02-21T15:30:00Z' },
                    { title: 'Lư Hương Men Ngọc', category: 'Đồ thờ', status: 'Đã giải mã', createdAt: '2026-02-20T08:45:00Z' },
                    { title: 'Thố Gốm Hoa Sen', category: 'Thố gốm', status: 'Đã giải mã', createdAt: '2026-02-19T22:15:00Z' },
                  ]).map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{'title' in item ? item.title : ''}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">{'category' in item ? item.category : ''}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                          item.status === 'Đã giải mã' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-400 text-xs font-medium">
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-white transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Gợi ý từ AI</h3>
          <div className="glass-card p-8 rounded-[2.5rem] space-y-8 border-transparent">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Xu hướng tìm kiếm</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Họa tiết "Cá chép hóa rồng" đang được quan tâm nhiều nhất tuần này.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Cần bổ sung dữ liệu</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Dòng gốm Chu Đậu thế kỷ 15 còn thiếu nhiều thông tin về quy trình nung.</p>
              </div>
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
              Xem báo cáo di sản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

