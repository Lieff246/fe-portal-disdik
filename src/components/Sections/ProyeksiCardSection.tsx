import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { User, Calendar, Award, ChevronLeft, ChevronRight } from "lucide-react";

interface ProyeksiCardProps {
  projections: any;
  onFilterChange?: (range: "monthly" | "yearly", month?: number) => void;
  // Support string format for chevron navigation too
  onMonthNav?: (newMonth: string) => void;
  isLoading?: boolean;
}

export const ProyeksiCard: React.FC<ProyeksiCardProps> = ({
  projections,
  onFilterChange,
  onMonthNav,
  isLoading,
}) => {
  const [activeRange, setActiveRange] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const currentYear = 2026;

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentData = projections[activeRange] || projections;

  const totalTarget = Object.values(currentData).reduce(
    (acc: number, curr: any) => acc + (curr.target_count || 0),
    0,
  ) as number;
  const totalReal = Object.values(currentData).reduce(
    (acc: number, curr: any) => acc + (curr.real_count || 0),
    0,
  ) as number;
  const totalOverdue = Object.values(currentData).reduce(
    (acc: number, curr: any) => acc + (curr.overdue_count || 0),
    0,
  ) as number;

  const totalBelumSubmit = Math.max(0, totalTarget - totalReal - totalOverdue);

  const chartData = [
    { name: "Sudah Submit", value: totalReal },
    { name: "Belum Submit", value: totalBelumSubmit },
    { name: "Terlewat", value: totalOverdue },
  ];

  const categories = [
    {
      label: "Pensiun",
      id: "pns",
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

  const handleRangeChange = (range: "monthly" | "yearly") => {
    setActiveRange(range);
    onFilterChange?.(range, range === "monthly" ? selectedMonth : undefined);
  };

  const handleMonthNav = (direction: number) => {
    let newMonth = selectedMonth + direction;
    if (newMonth < 1) newMonth = 12;
    if (newMonth > 12) newMonth = 1;
    setSelectedMonth(newMonth);
    onFilterChange?.("monthly", newMonth);
  };

  return (
    <div className="glass !bg-white/50 rounded-[3rem] p-8   flex flex-col h-full min-h-[550px] relative overflow-hidden font-poppins">
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

      {/* Header Section */}
      <div className="flex items-center justify-between mb-0">
        <h3 className="text-lg font-bold">Proyeksi</h3>

        {activeRange === "monthly" && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full p-2">
            <button
              onClick={() => handleMonthNav(-1)}
              className="p-1 hover:bg-white rounded-full transition-all text-slate-400 hover:text-blue-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-600 w-[60px] text-center">
              {months[selectedMonth - 1]}
            </span>
            <button
              onClick={() => handleMonthNav(1)}
              className="p-1 hover:bg-white rounded-full transition-all text-slate-400 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Range Toggle Labels */}
      <div className="flex items-center gap-6 mb-8">
        <div
          onClick={() => handleRangeChange("monthly")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${activeRange === "monthly" ? "border-blue-500 bg-white" : "border-slate-300"}`}
          >
            {activeRange === "monthly" && (
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <span
            className={`text-xs font-bold transition-colors ${activeRange === "monthly" ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}
          >
            Bulan
          </span>
        </div>
        <div
          onClick={() => handleRangeChange("yearly")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${activeRange === "yearly" ? "border-blue-500 bg-white" : "border-slate-300"}`}
          >
            {activeRange === "yearly" && (
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <span
            className={`text-xs font-bold transition-colors ${activeRange === "yearly" ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}
          >
            Tahun
          </span>
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
              <Pie
                data={chartData}
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
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "url(#greenGradient)"
                        : index === 2
                          ? "#f43f5e"
                          : "#e2e8f0"
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
            <span className="mb-1 text-sm text-[#64748B]">Total</span>
            <div className="flex items-end">
              <span className="text-3xl  font-bold text-slate-800">
                {totalReal}
              </span>
              <span className="text-[#1E293B] text-lg">/{totalTarget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List (Detail Style) */}
      <div className="flex-1 flex flex-col gap-6">
        <h4 className="text-center text-lg font-bold">List Katagori</h4>

        {categories.map((cat, idx) => {
          const data = currentData[cat.id] || {
            real_count: 0,
            target_count: 0,
            overdue_count: 0,
          };
          const percentage =
            data.target_count > 0
              ? (data.real_count / data.target_count) * 100
              : 0;

          return (
            <div key={idx} className="flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center`}
                  >
                    {cat.icon}
                  </div>
                </div>

                <div className="w-full ml-4">
                  <div className="flex w-full justify-between">
                    <span className="font-medium text-sm mb-2">{cat.label}</span>
                    <div className="flex items-baseline gap-1 text-sm">
                      <span className="font-bold">{data.real_count}</span>
                      <span className="text-sm">/{data.target_count}</span>
                      {data.overdue_count > 0 && (
                        <span className=" text-rose-500 ml-0.5">
                          ({data.overdue_count}!)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-2 bg-[#CBD5E1] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[#84cc16] transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
