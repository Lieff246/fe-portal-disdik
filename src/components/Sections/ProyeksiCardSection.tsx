import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { User, Calendar, Award, Clock } from "lucide-react";

interface ProyeksiCardProps {
  projections: any;
  onFilterChange?: (range: "monthly" | "yearly", month?: number) => void;
  onMonthNav?: (newMonth: string) => void;
  onOpenDetail?: (category: string) => void;
  onOpenJatuhTempoDetail?: (category: string) => void;
  isLoading?: boolean;
}

export const ProyeksiCard: React.FC<ProyeksiCardProps> = ({
  projections,
  onOpenDetail,
  onOpenJatuhTempoDetail,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<"layanan" | "jatuh_tempo">("layanan");

  // Safeguard: support both legacy projections array and full projections payload
  const rekapCategory = projections?.rekap_category || projections || {
    berkala: { target: 0, upload: 0, terlewat: 0 },
    pangkat: { target: 0, upload: 0, terlewat: 0 },
    pensiun: { target: 0, upload: 0, terlewat: 0 },
  };

  const rekapJatuhTempo = projections?.jatuh_tempo?.rekap || projections?.rekap_jatuh_tempo || {
    berkala: 0,
    pangkat: 0,
    pensiun: 0,
    pppk: 0,
    total: 0,
  };

  // Tab 1: Proyeksi Layanan Data
  const totalReal = Object.values(rekapCategory).reduce(
    (acc: number, curr: any) => acc + (curr.upload || 0),
    0
  ) as number;
  const totalPending = Object.values(rekapCategory).reduce(
    (acc: number, curr: any) => acc + (curr.target || 0),
    0
  ) as number;
  const totalOverdue = Object.values(rekapCategory).reduce(
    (acc: number, curr: any) => acc + (curr.terlewat || 0),
    0
  ) as number;

  const totalTarget = totalReal + totalPending + totalOverdue;
  const totalBelumSubmit = totalPending + totalOverdue;

  const chartDataLayanan = [
    { name: "Sudah Submit", value: totalReal, color: "url(#greenGradient)" },
    { name: "Belum Submit", value: totalBelumSubmit, color: "#e2e8f0" },
  ];

  // Tab 2: Jatuh Tempo Data
  const chartDataJatuhTempo = [
    { name: "Pensiun", value: rekapJatuhTempo.pensiun || 0, color: "#2563EB" }, // Blue-600
    { name: "Pangkat", value: rekapJatuhTempo.pangkat || 0, color: "#A855F7" }, // Purple-500
    { name: "Berkala", value: rekapJatuhTempo.berkala || 0, color: "#F59E0B" }, // Amber-500
    { name: "PPPK", value: rekapJatuhTempo.pppk || 0, color: "#EF4444" }, // Red-500
  ];

  const categoriesLayanan = [
    {
      label: "Pensiun",
      id: "pensiun",
      icon: <User className="w-5 h-5" />,
      color: "bg-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Kenaikan Pangkat",
      id: "pangkat",
      icon: <Award className="w-5 h-5" />,
      color: "bg-purple-600",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "Gaji Berkala",
      id: "berkala",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-amber-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
  ];

  const categoriesJatuhTempo = [
    {
      label: "Pensiun",
      id: "pensiun",
      icon: <User className="w-5 h-5" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Kenaikan Pangkat",
      id: "pangkat",
      icon: <Award className="w-5 h-5" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "Gaji Berkala",
      id: "berkala",
      icon: <Calendar className="w-5 h-5" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "PPPK",
      id: "pppk",
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <div className="glass !bg-white/50 rounded-[3rem] p-8 flex flex-col h-full min-h-[550px] relative overflow-hidden font-poppins">
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-50 flex items-center justify-center rounded-[3rem] animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Memuat...
            </span>
          </div>
        </div>
      )}

      {/* Header & Tab Switcher */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between hidden">
          <div>
            <h3 className="text-lg font-bold">Proyeksi</h3>
            <p className="text-xs text-blue-600 font-bold uppercase mt-1 tracking-wider">
              {activeTab === "layanan" ? "Akumulasi 90 Hari" : "Lewat Jatuh Tempo"}
            </p>
          </div>
        </div>

        {/* Premium Glassmorphic Segmented Control Tab */}
        <div className="flex p-1 bg-slate-100/70 rounded-2xl border border-slate-200/40 relative">
          <button
            onClick={() => setActiveTab("jatuh_tempo")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === "jatuh_tempo"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Jatuh Tempo
          </button>

          <button
            onClick={() => setActiveTab("layanan")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === "layanan"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Proyeksi Layanan
          </button>
        </div>
      </div>

      {/* Gauge Chart (Small) */}
      <div className="flex justify-center -mb-4">
        <div className="flex items-center justify-center w-[260px] h-[260px] relative">
          <ResponsiveContainer width="100%">
            <PieChart>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#28BA00" />
                  <stop offset="100%" stopColor="#C0EB25" />
                </linearGradient>
              </defs>
              {activeTab === "layanan" ? (
                <Pie
                  data={chartDataLayanan}
                  cx="50%"
                  cy="50%"
                  startAngle={225}
                  endAngle={-45}
                  innerRadius="61%"
                  outerRadius="100%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={40}
                >
                  {chartDataLayanan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              ) : (
                <Pie
                  data={chartDataJatuhTempo}
                  cx="50%"
                  cy="50%"
                  startAngle={225}
                  endAngle={-45}
                  innerRadius="61%"
                  outerRadius="100%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={40}
                >
                  {chartDataJatuhTempo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              )}
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
            <span className="mb-1 text-sm text-[#64748B]">Total</span>
            {activeTab === "layanan" ? (
              <div className="flex items-end">
                <span className="text-3xl font-bold text-slate-800">
                  {totalReal}
                </span>
                <span className="text-[#1E293B] text-lg">/{totalTarget}</span>
              </div>
            ) : (
              <div className="flex items-end">
                <span className="text-3xl font-bold text-slate-800">
                  {rekapJatuhTempo.total}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic List Section */}
      <div className="flex-1 flex flex-col gap-6 justify-center">
        {activeTab === "layanan" ? (
          <>
            {/* <h4 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Daftar Kategori
            </h4> */}
            <div className="flex flex-col gap-4">
              {categoriesLayanan.map((cat, idx) => {
                const data = rekapCategory[cat.id] || {
                  upload: 0,
                  target: 0,
                  terlewat: 0,
                };
                const catTotalTarget = (data.upload || 0) + (data.target || 0) + (data.terlewat || 0);
                const percentage =
                  catTotalTarget > 0 ? (data.upload / catTotalTarget) * 100 : 0;

                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 cursor-pointer group"
                    onClick={() => onOpenDetail?.(cat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full ${cat.iconBg} ${cat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          {cat.icon}
                        </div>
                      </div>
                      <div className="w-full pl-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold mb-1 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                            {cat.label}
                          </div>
                          <div className="flex items-baseline gap-1 text-sm mb-1">
                            <div className="font-bold text-slate-800">{data.upload}</div>
                            <div className="text-slate-400">/{catTotalTarget}</div>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-lime-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* <h4 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Daftar Jatuh Tempo
            </h4> */}
            <div className="flex flex-col gap-2.5">
              {categoriesJatuhTempo.map((cat, idx) => {
                const val = rekapJatuhTempo[cat.id] || 0;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between cursor-pointer group rounded-2xl transition-all border border-transparent"
                    onClick={() => onOpenJatuhTempoDetail?.(cat.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full ${cat.iconBg} ${cat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-semibold ${val > 0 ? "text-rose-500" : "text-slate-400"}`}>
                        {val}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
