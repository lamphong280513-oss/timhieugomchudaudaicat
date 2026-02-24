import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import { Search, Filter, Grid, List as ListIcon, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_LIBRARY = [
  { id: 1, title: 'Bình Tỳ Bà Hoa Lam', period: 'Thế kỷ 15', category: 'Bình gốm', image: 'https://picsum.photos/seed/pot1/400/300', desc: 'Họa tiết hoa cúc dây mềm mại, biểu tượng cho sự thanh cao.' },
  { id: 2, title: 'Đĩa Cổ Vẽ Thiên Nga', period: 'Thế kỷ 16', category: 'Đĩa cổ', image: 'https://picsum.photos/seed/pot2/400/300', desc: 'Hình ảnh thiên nga đang bơi, tượng trưng cho tình yêu và lòng trung thành.' },
  { id: 3, title: 'Lư Hương Men Ngọc', period: 'Thế kỷ 15', category: 'Đồ thờ', image: 'https://picsum.photos/seed/pot3/400/300', desc: 'Men ngọc đặc trưng, họa tiết rồng phượng tinh xảo.' },
  { id: 4, title: 'Thố Gốm Hoa Sen', period: 'Thế kỷ 14', category: 'Thố gốm', image: 'https://picsum.photos/seed/pot4/400/300', desc: 'Họa tiết hoa sen cách điệu, mang ý nghĩa tâm linh sâu sắc.' },
  { id: 5, title: 'Bình Vôi Cổ', period: 'Thế kỷ 17', category: 'Đồ dùng', image: 'https://picsum.photos/seed/pot5/400/300', desc: 'Vật dụng quen thuộc trong đời sống người Việt xưa.' },
  { id: 6, title: 'Chân Đèn Gốm', period: 'Thế kỷ 16', category: 'Đồ thờ', image: 'https://picsum.photos/seed/pot6/400/300', desc: 'Kỹ thuật đắp nổi hoa văn cực kỳ tinh vi.' },
];

export default function DigitalLibrary() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Thư viện số Chu Đậu</h2>
          <p className="text-slate-500">Khám phá kho tàng di sản gốm sứ qua các thời kỳ.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 border rounded-xl">
          <button 
            onClick={() => setView('grid')}
            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-emerald-50 text-emerald-600" : "text-slate-400")}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-emerald-50 text-emerald-600" : "text-slate-400")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm kiếm hiện vật, thời kỳ, họa tiết..." 
            className="w-full pl-12 pr-4 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-white border rounded-2xl text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>

      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {MOCK_LIBRARY.filter(item => item.title.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "glass-card rounded-3xl overflow-hidden group cursor-pointer",
              view === 'list' && "flex flex-col md:flex-row"
            )}
          >
            <div className={cn(
              "relative overflow-hidden",
              view === 'grid' ? "aspect-[4/3]" : "md:w-64 aspect-square"
            )}>
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-bold rounded-full shadow-sm">
                  {item.period}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.category}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">{item.desc}</p>
              <div className="mt-auto flex items-center justify-between">
                <button className="flex items-center gap-1 text-emerald-600 font-semibold text-sm hover:gap-2 transition-all">
                  Chi tiết hiện vật <ChevronRight className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

