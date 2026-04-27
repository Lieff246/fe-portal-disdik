import React, { useState } from "react";
import { Icon } from "@iconify/react";
import type { GtkLandingData } from "@/types";

interface SubjectNeedsProps {
  data: GtkLandingData["subjects"];
  onViewDetail?: (subject: any) => void;
}

export const SubjectNeeds: React.FC<SubjectNeedsProps> = ({
  data,
  onViewDetail,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Jika sedang mencari, tampilkan semua hasil (agar pencarian menyeluruh)
  // Jika tidak sedang mencari, tampilkan sesuai visibleCount
  const displayData = searchTerm ? filteredData : filteredData.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (searchTerm) return; // Nonaktifkan infinite scroll saat searching
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setVisibleCount((prev) => Math.min(prev + 10, filteredData.length));
    }
  };

  return (
    <div className="flex flex-col h-full w-[350px] lg:w-[450px]">
      {/* Legend */}
      <div className="flex flex-col gap-3 mb-8 bg-[#F8FCFF]  px-6 py-4 rounded-4xl">
        <h5 className="font-bold">Legenda</h5>
        <div className="flex items-center gap-4">
          {[
            { label: "Kekurangan", color: "#ef4444", border: "#F87171" },
            { label: "Ideal", color: "#84cc16", border: "#A3E635" }, // Saya sesuaikan sedikit warna bordernya agar serasi
            { label: "Kelebihan", color: "#F59E0B", border: "#FBBF24" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                // Tambahkan class 'border' (atau 'border-2' jika ingin lebih tebal) di sini
                className="w-3.5 aspect-square rounded-full border-3"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.border,
                }}
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Search & List */}
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg">Kebutuhan Guru Mata Pelajaran</h4>
          <div className="relative group">
            <input
              type="text"
              placeholder="Pencarian..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(10); // Reset visible count when search changes
              }}
              className="w-full pl-6 pr-14 py-4 bg-slate-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none text-sm text-slate-600 transition-all"
            />
            <button className="absolute right-2 top-2 w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Icon icon="mdi:magnify" className="text-xl" />
            </button>
          </div>
        </div>

        <div 
          onScroll={handleScroll}
          className="grid grid-cols-1 gap-y-2 max-h-[500px] overflow-y-auto scrollbar-hide pb-10"
        >
          {displayData.map((subject: any, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveIndex(idx); // Update state saat diklik
                  onViewDetail?.(subject);
                }}
                className={`px-4 py-2 transition-all group cursor-pointer  relative overflow-hidden ${
                  isActive ? "bg-indigo-100" : "bg-white/80 hover:bg-indigo-100"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${
                    isActive
                      ? "bg-yellow-500"
                      : "bg-white-200 group-hover:bg-yellow-500"
                  }`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 w-full">
                    <div>
                      <div className="p-2.5 rounded-xl bg-purple-50 flex items-center justify-center  transition-all">
                        <Icon
                          icon="material-symbols:book-outline"
                          className="text-xl text-purple-600"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between w-full capitalize mb-1">
                        <div className="font-bold text-slate-700 truncate max-w-[200px]">{subject.name.toLowerCase()}</div>
                        <div className="text-right">
                          <p className="font-black text-slate-800">{subject.total_guru}</p>
                        </div>
                      </div>
                      {/* Status Bar */}
                      <div className="w-full flex gap-1 h-2.5">
                        {(() => {
                          const total =
                            subject.ideal +
                            subject.kekurangan +
                            subject.kelebihan;
                          if (total === 0) return null;
                          return (
                            <>
                              {/* Setiap bar sekarang memiliki rounded-full sendiri */}
                              <div
                                className="bg-[#84cc16] h-full rounded-sm"
                                style={{
                                  width: `${(subject.ideal / total) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-[#ef4444] h-full rounded-sm"
                                style={{
                                  width: `${(subject.kekurangan / total) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-[#f59e0b] h-full rounded-sm"
                                style={{
                                  width: `${(subject.kelebihan / total) * 100}%`,
                                }}
                              />
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Stats */}
                <div className="grid grid-cols-3 gap-x-2">
                  {[
                    {
                      label: "Ideal",
                      val: subject.ideal,
                      bg: "bg-lime-50",
                      text: "text-lime-600",
                    },
                    {
                      label: "Kurang",
                      val: subject.kekurangan,
                      bg: "bg-red-50",
                      text: "text-red-600",
                    },
                    {
                      label: "Kelebihan",
                      val: subject.kelebihan,
                      bg: "bg-amber-50",
                      text: "text-amber-600",
                    },
                  ].map((stat, sIdx) => (
                    <div
                      key={sIdx}
                      className={`${stat.bg} p-3 rounded-2xl flex flex-col items-center justify-center`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-wider ${stat.text}`}>
                        {stat.label}
                      </span>
                      <span className={`font-black ${stat.text}`}>
                        {stat.val.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {!searchTerm && visibleCount < filteredData.length && (
            <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse">
              Scroll untuk memuat lebih banyak...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
