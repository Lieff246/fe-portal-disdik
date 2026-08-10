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
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield Base Shape */}
    <path
      d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 Z"
      fill="#F59E0B"
      stroke="#B45309"
      strokeWidth="3"
    />
    {/* Inner Shield Field */}
    <path
      d="M50 10 L84 23 V63 C84 84 50 106 50 106 C50 106 16 84 16 63 V23 Z"
      fill="#2563EB"
    />
    {/* Green Base / Ground */}
    <path
      d="M20 70 Q50 60 80 70 V63 C80 84 50 106 50 106 C50 106 20 84 20 63 Z"
      fill="#16A34A"
    />
    {/* Palm Tree Trunk & Fronds */}
    <path d="M48 45 L52 45 L53 72 L47 72 Z" fill="#78350F" />
    <path d="M50 45 Q35 35 25 42 Q38 48 50 45 Z" fill="#22C55E" />
    <path d="M50 45 Q65 35 75 42 Q62 48 50 45 Z" fill="#22C55E" />
    <path d="M50 45 Q30 45 22 55 Q36 55 50 45 Z" fill="#15803D" />
    <path d="M50 45 Q70 45 78 55 Q64 55 50 45 Z" fill="#15803D" />
    {/* Yellow Star at top */}
    <polygon
      points="50,20 52.5,27.5 60,27.5 54,32 56,39.5 50,35 44,39.5 46,32 40,27.5 47.5,27.5"
      fill="#FACC15"
    />
    {/* Red Top Banner */}
    <path d="M22 14 Q50 18 78 14 L80 8 Q50 12 20 8 Z" fill="#DC2626" />
    <text
      x="50"
      y="13"
      fill="#FFFFFF"
      fontSize="5"
      fontWeight="900"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      SULAWESI TENGAH
    </text>
  </svg>
);

export const ProyeksiCard: React.FC<ProyeksiCardProps> = ({
  onOpenSchoolReports,
  isLoading,
}) => {
  // Chart distribution data (SMA, SMK, SLB)
  const chartData = [
    { name: "SMA", value: 145, color: "#4ADE80" },  // Vibrant Green
    { name: "SMK", value: 145, color: "#FACC15" },  // Bright Yellow
    { name: "SLB", value: 146, color: "#DDD6FE" },  // Soft Lavender/Light Purple
  ];

  return (
    <div className="glass !bg-[#F1F5F9]/90 rounded-[2.5rem] p-6 sm:p-7 flex flex-col h-full min-h-[580px] relative overflow-hidden font-poppins shadow-xl border border-white/80">
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
      <div className="flex items-center gap-3.5 mb-5 px-1">
        <SultengCrestLogo className="w-11 h-13 shrink-0 drop-shadow-sm" />
        <div className="flex flex-col">
          <h3 className="text-slate-900 font-extrabold text-lg sm:text-xl leading-tight tracking-tight">
            Portal Dinas Pendidikan
          </h3>
          <p className="text-slate-700 font-medium text-sm sm:text-base leading-tight mt-0.5">
            Provinsi Sulawesi Tengah
          </p>
        </div>
      </div>

      {/* Inner White Box Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center gap-5 flex-1 justify-between">
        {/* Section Title */}
        <div className="text-center">
          <h4 className="font-extrabold text-slate-900 text-lg leading-tight">
            Pengelolaan Provinsi
          </h4>
          <p className="font-bold text-slate-800 text-base leading-tight mt-0.5">
            (SMA, SMK, SLB)
          </p>
        </div>

        {/* Level List Items */}
        <div className="w-full flex flex-col gap-3.5">
          {/* SMA */}
          <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 tracking-wide">
                SMA
              </span>
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              145.000
            </span>
          </div>

          {/* SMK */}
          <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 tracking-wide">
                SMK
              </span>
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              145.000
            </span>
          </div>

          {/* SLB */}
          <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] text-[#A16207] flex items-center justify-center shrink-0">
                <SchoolBuildingIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 tracking-wide">
                SLB
              </span>
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              145.000
            </span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="w-full flex flex-col items-center justify-center relative -my-1">
          <div className="w-[190px] h-[190px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
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

          {/* Total Text */}
          <p className="text-center font-extrabold text-slate-900 text-base mt-2">
            Total Sekolah Provinsi: 436
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenSchoolReports}
          className="w-full max-w-[240px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25 text-sm cursor-pointer mt-1"
        >
          <span>Kunjungi</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

