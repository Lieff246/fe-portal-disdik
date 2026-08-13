import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  MapPin,
  School,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  BookOpen,
} from "lucide-react";
import { LandingService } from "@/services/landingService";
import { GtkGapVisualizer } from "@/components/Fragments/GtkGapVisualizer";

interface GtkAnalysisSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  type: "subject" | "region";
  id: string | number;
  title: string;
}

export const GtkAnalysisSidebar: React.FC<GtkAnalysisSidebarProps> = ({
  isOpen,
  onClose,
  type,
  id,
  title,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [maxVal, setMaxVal] = useState<{ kurang: number; lebih: number }>({
    kurang: 1,
    lebih: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city_id: "",
    search: "",
    page: 1,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = type === "subject"
        ? await LandingService.getSubjectDetail(id, filters)
        : await LandingService.getRegionDetail(id, filters);
      console.log("tes");
      console.log(res);
      setData(res.data.data);
      setPagination(res.data);
      setMaxVal(res.max_val);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, id, filters]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary">
              {type === "subject" ? <BookOpen className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Analisis Kebutuhan Guru
              </h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-3xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-8 pb-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
            <input
              type="text"
              placeholder="Cari Nama Sekolah..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>

          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
            <select
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
              value={filters.city_id}
              onChange={(e) => setFilters({ ...filters, city_id: e.target.value, page: 1 })}
            >
              <option value="">Semua Kab / Kota</option>
              {/* Note: city_id mapping should match the backend helper */}
              {[
                { id: 1, name: 'Palu' },
                { id: 2, name: 'Sigi' },
                { id: 3, name: 'Donggala' },
                { id: 4, name: 'Parigi Moutong' },
                { id: 5, name: 'Poso' },
                { id: 6, name: 'Tojo Una-Una' },
                { id: 7, name: 'Morowali' },
                { id: 8, name: 'Morowali Utara' },
                { id: 9, name: 'Banggai' },
                { id: 10, name: 'Banggai Kepulauan' },
                { id: 11, name: 'Banggai Laut' },
                { id: 12, name: 'Buol' },
                { id: 13, name: 'Toli-Toli' }
              ].map(city => (
                <option key={city.id} value={city.id}>{city.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" />
              {pagination?.total || 0} Hasil ditemukan
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-white">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Memuat Data Analisis...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-6 px-6 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-4">Satuan Pendidikan</div>
                <div className="col-span-3">Jabatan / Mapel</div>
                <div className="col-span-3 text-right">Visualisasi Kebutuhan</div>
                <div className="col-span-2 text-right">Wilayah</div>
              </div>

              {/* Table Body */}
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-6 px-6 py-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-all rounded-3xl"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <School className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 line-clamp-2 uppercase">
                      {item.school_name || item.name}
                    </span>
                  </div>
                  <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
                    {item.jabatan || (
                      <span className="text-primary">
                        {item.details?.length} Mapel Terkait
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <GtkGapVisualizer
                      kurang={item.kurang}
                      lebih={item.lebih}
                      ideal={item.status === 'Ideal' ? item.kebutuhan : 0}
                      kebutuhan={item.kebutuhan}
                      eksisting={item.eksisting}
                      maxVal={maxVal}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full">
                      {item.kabupaten_kota}
                    </span>
                  </div>
                </div>
              ))}

              {data.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Data tidak ditemukan untuk filter ini</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-white">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Halaman {pagination.current_page} dari {pagination.last_page}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => setFilters({ ...filters, page: pagination.current_page - 1 })}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-2xl transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setFilters({ ...filters, page: pagination.current_page + 1 })}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-2xl transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
