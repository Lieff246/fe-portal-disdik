import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  BookOpen,
} from "lucide-react";
import { LandingService } from "@/services/landingService";
import { GtkGapVisualizer } from "@/components/Fragments/GtkGapVisualizer";

interface GtkDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  type: "subject" | "region";
  id: string | number;
  title: string;
}

export const GtkDetailSidebar: React.FC<GtkDetailSidebarProps> = ({
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
  console.log(pagination);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [filters, setFilters] = useState({
    city_id: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const fetchData = useCallback(async () => {
    if (!id && id !== 0) return;
    setLoading(true);
    try {
      const res =
        type === "subject"
          ? await LandingService.getSubjectDetail(id) // Don't pass filters to backend
          : await LandingService.getRegionDetail(id);

      // The backend structure is { data: { data: [...], total: ... }, max_val: ... }
      // LandingService returns response.data, so res is the inner object.
      setData(res.data.data);
      setPagination({
        total: res.data.total,
      });
      setMaxVal(res.max_val);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  // Reset filters when opening for a different item
  useEffect(() => {
    if (isOpen) {
      setFilters({ city_id: "", search: "" });
      setCurrentPage(1);
    }
  }, [isOpen, id, type]);

  const filteredData = data.filter((item) => {
    const matchSearch = (item.school_name || item.name)
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchCity = filters.city_id ? item.city_id == filters.city_id : true;
    return matchSearch && matchCity;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000]"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-[2001] flex flex-col transform transition-transform duration-500 overflow-hidden animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary">
              {type === "subject" ? (
                <BookOpen className="w-8 h-8" />
              ) : (
                <MapPin className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Analisis Kebutuhan Guru</h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters Panel */}
        <div className="p-8 pb-6 bg-slate-50/30 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
            <input
              type="text"
              placeholder="Cari Nama Sekolah..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-4 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
            <select
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none shadow-sm cursor-pointer"
              value={filters.city_id}
              onChange={(e) => {
                setFilters({ ...filters, city_id: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Kab / Kota</option>
              {[
                { id: 1, name: "Palu" },
                { id: 2, name: "Sigi" },
                { id: 3, name: "Donggala" },
                { id: 4, name: "Parigi Moutong" },
                { id: 5, name: "Poso" },
                { id: 6, name: "Tojo Una-Una" },
                { id: 7, name: "Morowali" },
                { id: 8, name: "Morowali Utara" },
                { id: 9, name: "Banggai" },
                { id: 10, name: "Banggai Kepulauan" },
                { id: 11, name: "Banggai Laut" },
                { id: 12, name: "Buol" },
                { id: 13, name: "Toli-Toli" },
              ].map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-end">
            <div className="flex items-center gap-2 px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5 text-primary/40" />
              {filteredData.length} Data
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 scrollbar-hide bg-white">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
                <Loader2 className="w-16 h-16 animate-spin text-primary absolute inset-0 [animation-delay:-0.3s]" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] mt-8 text-slate-300">
                Sync Data Analisis...
              </span>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                {/* Table Header */}
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-8 py-5 font-normal w-4/12">Sekolah</th>
                    <th className="px-4 py-5 font-normal w-3/12">
                      Nama Jabatan
                    </th>
                    <th className="px-4 py-5 font-normal w-3/12">
                      Kebutuhan Guru
                    </th>
                    <th className="px-8 py-5 font-normal w-2/12">Kab / Kota</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((item, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-all group"
                      >
                        {/* Kolom Sekolah */}
                        <td className="px-8 py-4 align-middle">
                          <span className="text-sm line-clamp-2 uppercase leading-tight group-hover:text-primary transition-colors">
                            {item.school_name || item.name}
                          </span>
                        </td>

                        {/* Kolom Nama Jabatan */}
                        {/* {type != "subject" && ( */}
                        <td className="px-4 py-4 align-middle">
                          <div className="text-sm capitalize">
                            {item.jabatan?.toLowerCase() || (
                              <div
                                className="flex flex-col gap-1 cursor-pointer group/mapel w-fit"
                                onClick={() => setSelectedSchool(item)}
                              >
                                <span className="text-primary font-black group-hover/mapel:underline transition-all">
                                  {item.details?.length} Mapel Terkait
                                </span>
                                <div className="flex gap-1">
                                  {item.details
                                    ?.filter((d: any) => d.kurang > 0)
                                    .slice(0, 3)
                                    .map((i: number) => (
                                      <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-rose-500"
                                      />
                                    ))}
                                  {item.details
                                    ?.filter((d: any) => d.lebih > 0)
                                    .slice(0, 3)
                                    .map((i: number) => (
                                      <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                                      />
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        {/* )}   */}
                        {/* Kolom Kebutuhan Guru */}
                        <td className="px-4 py-4 align-middle">
                          <div className="flex justify-end">
                            <GtkGapVisualizer
                              kurang={item.kurang}
                              lebih={item.lebih}
                              ideal={
                                item.status === "Ideal" ? item.kebutuhan : 0
                              }
                              kebutuhan={item.kebutuhan}
                              eksisting={item.eksisting}
                              maxVal={maxVal}
                            />
                          </div>
                        </td>

                        {/* Kolom Kab/Kota */}
                        <td className="px-8 py-4 text-right align-middle">
                          <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:border-primary/20 transition-all whitespace-nowrap">
                            {item.kabupaten_kota}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Empty State */}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-200">
                            <Search className="w-12 h-12" />
                          </div>
                          <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest">
                            Tidak Ada Hasil
                          </h4>
                          <p className="text-sm font-bold text-slate-400 mt-2">
                            Coba sesuaikan filter pencarian Anda
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* School Detail Overlay */}
        {selectedSchool && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {selectedSchool.name}
                  </h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                    Detail Kebutuhan Per Mata Pelajaran
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {selectedSchool.details?.map((d: any, i: number) => {
                console.log(d);
                return (
                  <div
                    key={i}
                    className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800 uppercase block">
                          {d.mapel}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${d.kurang > 0 ? "text-rose-500" : d.lebih > 0 ? "text-amber-500" : "text-emerald-500"}`}
                        >
                          {d.kurang > 0
                            ? `Kurang ${d.kurang}`
                            : d.lebih > 0
                              ? `Lebih ${d.lebih}`
                              : "Ideal"}
                        </span>
                      </div>
                    </div>
                    <div className="w-40">
                      {/* <GtkGapVisualizer
                        kurang={d.kurang}
                        lebih={d.lebih}
                        ideal={d.kurang === 0 && d.lebih === 0 ? 1 : 0}
                        kebutuhan={d.kurang > 0 ? d.kurang : 1} // Simplified for sub-view
                        eksisting={d.lebih > 0 ? d.lebih : 1}
                        maxVal={
                          Math.max(
                            ...selectedSchool.details.map((x: any) =>
                              Math.max(x.kurang, x.lebih),
                            ),
                          ) || 1
                        }
                      /> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-white relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Halaman
              </span>
              <span className="text-sm font-black text-slate-800">
                {currentPage} <span className="text-slate-300 mx-1">/</span>{" "}
                {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-14 h-14 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-[1.5rem] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="w-14 h-14 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-[1.5rem] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
