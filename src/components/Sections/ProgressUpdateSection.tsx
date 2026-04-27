import React from "react";

interface Props {}

export const ProgressUpdateSection: React.FC<Props> = ({}) => {
  const progressData = {
    updated: { count: 59059, percentage: 95 },
    pending: { count: 634, percentage: 1.03 },
  };

  return (
    <section className="w-full pb-8">
      {/* Turunkan bg-white/60 menjadi bg-white/30 */}
      <div className="glass ring-2 !ring-white mt-4 rounded-[2rem] p-10 flex flex-col gap-4 relative z-10">
        <h3 className="text-xl font-bold text-slate-800 drop-shadow-sm">
          Progress Update Data Guru & Tenaga Pendidik
        </h3>

        <div className="w-full h-5 bg-slate-200/50  overflow-hidden flex">
          <div className="h-full bg-emerald-500" style={{ width: "85%" }}></div>
          <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-[2.5rem] p-8 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-slate-700">
                Sudah Update
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800">
                {progressData.updated.count.toLocaleString()}
              </span>
              <span className="font-bold text-slate-600">
                ({progressData.updated.percentage}%)
              </span>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-bold text-slate-700">
                Belum Update
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800">
                {progressData.pending.count.toLocaleString()}
              </span>
              <span className="font-bold text-slate-600">
                ({progressData.pending.percentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
