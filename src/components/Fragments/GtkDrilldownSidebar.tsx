import React from "react";
import {
  X,
  ChevronRight,
  ArrowLeft,
  MapPin,
  School,
  BookOpen,
} from "lucide-react";
import type { GtkLandingData } from "@/types";

interface GtkDrilldownSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data?: GtkLandingData;
  filters: { cabdis: string; kabupaten_kota: string; sekolah: string };
  onFilterChange: (filters: any) => void;
}

export const GtkDrilldownSidebar: React.FC<GtkDrilldownSidebarProps> = ({
  isOpen,
  onClose,
  data,
  filters,
  onFilterChange,
}) => {
  if (!isOpen) return null;

  const currentLevel = filters.sekolah
    ? "sekolah"
    : filters.kabupaten_kota
      ? "kab_kota"
      : filters.cabdis
        ? "cabdis"
        : "provinsi";

  const handleBack = () => {
    if (currentLevel === "sekolah") {
      onFilterChange({ ...filters, sekolah: "" });
    } else if (currentLevel === "kab_kota") {
      onFilterChange({ ...filters, kabupaten_kota: "" });
    } else if (currentLevel === "cabdis") {
      onFilterChange({ ...filters, cabdis: "" });
    }
  };

  const stats = data?.stats.abk_recap;
  const recap = stats?.recap || { ideal: 0, kelebihan: 0, kekurangan: 0 };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentLevel !== "provinsi" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                {currentLevel === "provinsi"
                  ? "Provinsi Sulawesi Tengah"
                  : currentLevel === "cabdis"
                    ? filters.cabdis
                    : currentLevel === "kab_kota"
                      ? filters.kabupaten_kota
                      : filters.sekolah}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                {currentLevel === "provinsi"
                  ? "Analisis Tingkat Provinsi"
                  : currentLevel === "cabdis"
                    ? "Analisis Wilayah Kerja"
                    : currentLevel === "kab_kota"
                      ? "Analisis Kabupaten / Kota"
                      : "Detail Satuan Pendidikan"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {/* Main Stats Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white mb-8 relative overflow-hidden shadow-xl shadow-slate-200">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Total Kebutuhan (ABK)
                  </p>
                  <h3 className="text-5xl font-black">
                    {stats?.total_abk.toLocaleString()}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Terpenuhi
                  </p>
                  <h4 className="text-2xl font-black text-emerald-400">
                    {stats?.percentage}%
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Ideal
                  </p>
                  <p className="text-lg font-black">{recap.ideal}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-3xl border border-white/10 text-amber-400">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Kurang
                  </p>
                  <p className="text-lg font-black">{recap.kekurangan}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-3xl border border-white/10 text-blue-400">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Lebih
                  </p>
                  <p className="text-lg font-black">{recap.kelebihan}</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>

          {/* List of sub-items */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {currentLevel === "provinsi"
                ? "Pilih Cabang Dinas"
                : currentLevel === "cabdis"
                  ? "Pilih Kabupaten / Kota"
                  : currentLevel === "kab_kota"
                    ? "Pilih Sekolah"
                    : "Kebutuhan Per Mapel"}
            </h5>

            <div className="grid grid-cols-1 gap-4">
              {data?.drilldown?.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (currentLevel === "provinsi")
                      onFilterChange({ ...filters, cabdis: item.id });
                    else if (currentLevel === "cabdis")
                      onFilterChange({ ...filters, kabupaten_kota: item.id });
                    else if (currentLevel === "kab_kota")
                      onFilterChange({ ...filters, sekolah: item.id });
                  }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                        {currentLevel === "kab_kota" ? (
                          <School className="w-5 h-5" />
                        ) : currentLevel === "sekolah" ? (
                          <BookOpen className="w-5 h-5" />
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-bold text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    {currentLevel !== "sekolah" && (
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all" />
                    )}
                  </div>

                  {item.stats ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{
                            width: `${(item.stats.recap.ideal / item.stats.total_abk) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-amber-500 h-full"
                          style={{
                            width: `${(item.stats.recap.kekurangan / item.stats.total_abk) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">
                        {item.stats.percentage}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          ABK / Existing
                        </span>
                        <span className="text-sm font-black text-slate-700">
                          {item.abk} / {item.existing}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          item.status === "Ideal"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "Kelebihan"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
