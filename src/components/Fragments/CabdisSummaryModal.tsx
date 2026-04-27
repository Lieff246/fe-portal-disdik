import React from "react";
import { Icon } from "@iconify/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";

interface CabdisSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onViewDetail: (data: any) => void;
}

export const CabdisSummaryModal: React.FC<CabdisSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
  onViewDetail,
}) => {
  if (!isOpen || !data) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3.5rem] p-8 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Summary Cabdis</span>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mt-1">{name}</h2>
          </div>

          <div className="w-full flex justify-center relative aspect-square -mt-10">
            <ResponsiveContainer width="70%">
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

            <div className="absolute top-36 left-1/2 -translate-x-1/2 text-center">
              <p className="text-slate-500 text-sm font-semibold">Total GTK</p>
              <p className="text-[#1E293B] text-4xl font-black">{total.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full -mt-12 mb-8">
            {[
              { label: "Ideal", value: recap.ideal, color: "text-lime-500", bg: "bg-lime-50" },
              { label: "Kurang", value: recap.kekurangan, color: "text-red-500", bg: "bg-red-50" },
              { label: "Lebih", value: recap.kelebihan, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((item, idx) => (
              <div key={idx} className={`${item.bg} rounded-[2rem] p-4 flex flex-col items-center shadow-sm`}>
                <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${item.color}`}>{item.label}</span>
                <span className={`text-lg font-black ${item.color}`}>{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="p-6 bg-blue-50/50 rounded-[2.5rem] flex gap-4 border border-blue-100/50">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <Icon icon="mdi:information-variant" className="text-sm" />
              </div>
              <p className="text-xs font-bold text-blue-800/70 leading-relaxed">
                Terdapat <span className="text-blue-900 font-black">{recap.kekurangan.toLocaleString()}</span> kekurangan guru dan <span className="text-blue-900 font-black">{recap.kelebihan.toLocaleString()}</span> kelebihan guru di wilayah ini.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onViewDetail(data);
              }}
              className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              Lihat Detail Analisis
              <Icon icon="mdi:arrow-right" className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
