import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";

interface ProyeksiCardProps {
  projections?: any;
  schoolData?: any;
  onFilterChange?: (range: "monthly" | "yearly", month?: number) => void;
  onMonthNav?: (newMonth: string) => void;
  onOpenDetail?: (category: string) => void;
  onOpenJatuhTempoDetail?: (category: string) => void;
  onOpenSchoolReports?: () => void;
  isLoading?: boolean;
}

// Crisp SVG Icon for School/Building
const SchoolBuildingIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L2 9V11H4V20H10V14H14V20H20V11H22V9L12 3ZM12 5.5L18 9.1V10H6V9.1L12 5.5ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 16H10V18H8V16ZM14 16H16V18H14V16Z" />
  </svg>
);

// Coat of Arms / Shield Logo for Sulawesi Tengah
const SultengCrestLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-14" }) => (
  <img
    src="/images/kabupaten_kota.png/Sulawesi Tengah.png"
    alt="Logo Provinsi Sulawesi Tengah"
    className={`${className} object-contain`}
  />
);

export const ProyeksiCard: React.FC<ProyeksiCardProps> = ({
  onOpenSchoolReports,
  isLoading,
}) => {
  // Chart distribution data (SMA, SMK, SLB)
  const chartData = [
    { name: "SMA", value: 145, color: "#10B981" },
    { name: "SMK", value: 145, color: "#3B82F6" },
    { name: "SLB", value: 146, color: "#F59E0B" },
  ];

  return (
    <div className="relative flex h-full min-h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.35)] sm:p-7 font-poppins">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_38%)]" />
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-50 flex items-center justify-center rounded-[2.5rem] animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Memuat...
            </span>
          </div>
        </div>
      )}

      {/* Outer Header Section */}
      <div className="mb-5 flex items-center gap-3.5 rounded-[1.5rem] border border-white/80 bg-white/80 p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-100 shadow-sm">
          <SultengCrestLogo className="h-14 w-14 drop-shadow-sm object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
            Provinsi
          </span>
          <h3 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-xl">
            Portal Dinas Pendidikan
          </h3>
          <p className="mt-0.5 text-sm font-medium leading-tight text-slate-700 sm:text-base">
            Provinsi Sulawesi Tengah
          </p>
        </div>
      </div>

      {/* Inner White Box Card */}
      <div className="flex flex-1 flex-col items-center justify-between gap-5 rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)]">
        {/* Section Title */}
        <div className="text-center">
          <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
            Ringkasan
          </div>
          <h4 className="text-lg font-extrabold leading-tight text-slate-900">
            Pengelolaan Provinsi
          </h4>
          <p className="mt-0.5 text-base font-bold leading-tight text-slate-700">
            (SMA, SMK, SLB)
          </p>
        </div>

        {/* Level List Items */}
        <div className="w-full flex flex-col gap-3.5">
          {/* SMA */}
          <div className="flex items-center justify-between rounded-[1.25rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D]">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold tracking-wide text-slate-800">
                SMA
              </span>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-sm font-extrabold text-slate-900 shadow-sm">
              145.000
            </span>
          </div>

          {/* SMK */}
          <div className="flex items-center justify-between rounded-[1.25rem] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1D4ED8]">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold tracking-wide text-slate-800">
                SMK
              </span>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-sm font-extrabold text-slate-900 shadow-sm">
              145.000
            </span>
          </div>

          {/* SLB */}
          <div className="flex items-center justify-between rounded-[1.25rem] border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FEF9C3] text-[#A16207]">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold tracking-wide text-slate-800">
                SLB
              </span>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-sm font-extrabold text-slate-900 shadow-sm">
              145.000
            </span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative -my-1 flex w-full flex-col items-center justify-center">
          <div className="relative flex h-[210px] w-[210px] items-center justify-center rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-50 p-3 shadow-[inset_0_10px_20px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <div className="absolute inset-4 rounded-full bg-white/90 shadow-sm" />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={92}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white px-4 py-3 text-center shadow-md ring-1 ring-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Total
                </p>
                <p className="text-lg font-black text-slate-900">436</p>
                <p className="text-[10px] font-medium text-slate-500">Sekolah</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              SMA
            </div>
            <div className="flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-semibold text-sky-700">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              SMK
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              SLB
            </div>
          </div>

          <p className="mt-3 text-center text-sm font-semibold text-slate-500">
            Distribusi sekolah berdasarkan jenjang
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenSchoolReports}
          className="mt-1 flex w-full max-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
        >
          <span>Kunjungi</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

