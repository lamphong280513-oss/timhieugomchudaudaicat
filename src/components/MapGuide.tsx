import React, { useState } from 'react';
import { cn } from '../utils';
import { MapPin, Navigation, Phone, Clock, Globe, Info, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const LOCATIONS = [
  {
    id: 1,
    name: 'Làng gốm Chu Đậu',
    address: 'Thái Tân, Nam Sách, Hải Dương',
    type: 'Làng nghề',
    coords: { lat: 21.0123, lng: 106.3456 },
    phone: '0220 3754 103',
    hours: '08:00 - 17:00',
    image: 'https://picsum.photos/seed/village/600/400',
    desc: 'Cái nôi của dòng gốm Chu Đậu nổi tiếng, nơi lưu giữ quy trình chế tác thủ công truyền thống.'
  },
  {
    id: 2,
    name: 'Bảo tàng Lịch sử Quốc gia',
    address: '1 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    type: 'Bảo tàng',
    coords: { lat: 21.0245, lng: 105.8588 },
    phone: '024 3825 2853',
    hours: '08:00 - 17:00 (Trừ Thứ Hai)',
    image: 'https://picsum.photos/seed/museum1/600/400',
    desc: 'Nơi trưng bày bộ sưu tập gốm Chu Đậu phong phú nhất, bao gồm cả những hiện vật từ tàu đắm Cù Lao Chàm.'
  },
  {
    id: 3,
    name: 'Bảo tàng Hải Dương',
    address: '11 Hồng Quang, TP. Hải Dương',
    type: 'Bảo tàng',
    coords: { lat: 20.9400, lng: 106.3330 },
    phone: '0220 3852 441',
    hours: '07:30 - 16:30',
    image: 'https://picsum.photos/seed/museum2/600/400',
    desc: 'Trưng bày nhiều hiện vật gốm Chu Đậu được khai quật tại địa phương.'
  }
];

export default function MapGuide() {
  const [selected, setSelected] = useState(LOCATIONS[0]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Bản đồ di sản</h2>
        <p className="text-slate-500">Chỉ dẫn tham quan làng nghề và các bảo tàng trưng bày gốm Chu Đậu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar List */}
        <div className="space-y-4">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelected(loc)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all",
                selected.id === loc.id 
                  ? "bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100" 
                  : "bg-white border-transparent hover:border-slate-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  selected.id === loc.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={cn("font-bold", selected.id === loc.id ? "text-emerald-900" : "text-slate-900")}>
                    {loc.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                    {loc.type}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Map View / Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-200 shadow-xl border-4 border-white">
            {/* Mock Map Background */}
            <img 
              src={`https://picsum.photos/seed/map-${selected.id}/1200/800?blur=2`} 
              alt="Map" 
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                key={selected.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-xl whitespace-nowrap font-bold text-sm">
                  {selected.name}
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="p-3 bg-white rounded-xl shadow-lg text-slate-600 hover:text-emerald-600 transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white rounded-xl shadow-lg text-slate-600 hover:text-emerald-600 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selected.name}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">{selected.desc}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">{selected.hours}</span>
                </div>
              </div>
              <button className="w-full py-4 gradient-bg text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                <Navigation className="w-5 h-5" />
                Chỉ đường ngay
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto">
              <img 
                src={selected.image} 
                alt={selected.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <button className="text-white flex items-center gap-2 text-sm font-bold hover:underline">
                  Xem thêm hình ảnh <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

