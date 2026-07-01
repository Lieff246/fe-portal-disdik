import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  summary?: any;
  currentMonth?: string;
  onClick?: () => void;
}

export const ProgressUpdateSection: React.FC<Props> = ({
  summary,
  currentMonth,
  onClick,
}) => {
  const monthLabel = useMemo(() => {
    if (!currentMonth) return "";
    const [y, m] = currentMonth.split("-");
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
    return `${months[parseInt(m) - 1]} ${y}`;
  }, [currentMonth]);

  const percentage = summary?.percentage || 0;

  return (
    <section className="w-full pb-8">
      <div
        onClick={onClick}
        className="glass ring-2 !ring-white rounded-[1.5rem] p-6 flex flex-col gap-4 relative z-10 cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/10 transition-all border border-transparent hover:border-blue-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Progress Laporan Bulanan Sekolah
            </h3>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 mt-1 mr-2 group-hover:text-blue-600">
              {/* <Clock className="w-3 h-3 text-blue-500" /> */}
              <span className="text-sm font-bold">{monthLabel}</span>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        <div className="w-full mb-2 h-5 bg-slate-200/50  overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-1000"
            style={{ width: `${100 - percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-slate-700">
                Sudah Update
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800">
                {(summary?.finished || 0).toLocaleString()}
              </span>
              <span className="font-bold text-slate-600">({percentage}%)</span>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-bold text-slate-700">
                Belum Update
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800">
                {(summary?.pending || 0).toLocaleString()}
              </span>
              <span className="font-bold text-slate-600">
                ({(100 - percentage).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
