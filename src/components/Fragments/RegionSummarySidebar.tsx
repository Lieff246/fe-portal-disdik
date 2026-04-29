import React from "react";
import { Icon } from "@iconify/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { X, School, Users, UserCheck, Info } from "lucide-react";

interface RegionSummarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onViewDetail: (data: any) => void;
}

export const RegionSummarySidebar: React.FC<RegionSummarySidebarProps> = ({
  isOpen,
  onClose,
  data,
  onViewDetail,
}) => {
  if (!data) return null;

  const { stats, name } = data;
  const recap = {
    ideal: stats.ideal || 0,
    kekurangan: stats.kekurangan || 0,
    kelebihan: stats.kelebihan || 0,
  };

  const chartData = [
    { name: "Ideal", value: recap.ideal, color: "#84CC16" },
    { name: "Kurang", value: recap.kekurangan, color: "#ef4444" },
    { name: "Lebih", value: recap.kelebihan, color: "#f59e0b" },
  ];

  const total = recap.ideal + recap.kekurangan + recap.kelebihan;

  return (
    <div className={`fixed inset-y-0 right-0 w-[450px] bg-white/95 backdrop-blur-xl shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out border-l border-slate-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detail Wilayah Kerja</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm mb-4">
                        <School className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">T. Sekolah</p>
                    <p className="text-2xl font-black text-slate-800">{stats.schools || 0}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm mb-4">
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">T. Guru</p>
                    <p className="text-2xl font-black text-slate-800">{(stats.teachers || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm mb-4">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">J. Rombel</p>
                    <p className="text-2xl font-black text-slate-800">300</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm mb-4">
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">T. Siswa</p>
                    <p className="text-2xl font-black text-slate-800">300.000</p>
                </div>
            </div>

            {/* Gauge Chart for Pemenuhan Kebutuhan Guru */}
            <div className="relative">
                <h4 className="text-center font-black text-slate-700 uppercase tracking-wider text-sm mb-8">Pemenuhan Kebutuhan Guru</h4>
                <div className="w-full flex justify-center relative aspect-square -mt-10 scale-110">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={chartData}
                            cx="50%"
                            cy="60%"
                            startAngle={200}
                            endAngle={-20}
                            innerRadius="65%"
                            outerRadius="100%"
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                            >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total</p>
                        <p className="text-slate-800 text-5xl font-black">{total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 -mt-10">
                    {[
                        { label: "Kekurangan", value: recap.kekurangan, color: "text-red-500", bg: "bg-red-50" },
                        { label: "Ideal", value: recap.ideal, color: "text-lime-500", bg: "bg-lime-50" },
                        { label: "Kelebihan", value: recap.kelebihan, color: "text-amber-500", bg: "bg-amber-50" },
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.bg} rounded-[1.5rem] p-4 flex flex-col items-center shadow-sm border border-black/5`}>
                            <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${item.color}`}>{item.label}</span>
                            <span className={`text-xl font-black ${item.color}`}>{item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-[2.5rem] flex gap-4 border border-blue-100/50">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-blue-800/70 leading-relaxed">
                    Informasi: Saat ini terdapat kekurangan <span className="text-blue-900 font-black">{recap.kekurangan.toLocaleString()}</span> guru dan kelebihan <span className="text-blue-900 font-black">{recap.kelebihan.toLocaleString()}</span> guru yang perlu segera ditangani.
                </p>
            </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => onViewDetail(data)}
              className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              Lihat Detail Analisis
              <Icon icon="mdi:arrow-right" className="text-xl" />
            </button>
        </div>
      </div>
    </div>
  );
};
