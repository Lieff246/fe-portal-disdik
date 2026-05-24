import React, { useState, useEffect } from "react";
import { X, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface JatuhTempoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Projections data (e.g., kurang_dari_90)
  initialCategory: string;
  isLoading?: boolean;
}

export const JatuhTempoSidebar: React.FC<JatuhTempoSidebarProps> = ({
  isOpen,
  onClose,
  data,
  initialCategory,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState(initialCategory || "semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCabdis, setSelectedCabdis] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when tab/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedCabdis]);

  // Sync active tab when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory === "pns" || initialCategory === "pensiun") {
        setActiveTab("pensiun");
      } else {
        setActiveTab(initialCategory);
      }
    }
  }, [initialCategory]);

  // Reset filters when switching tabs for premium UX
  useEffect(() => {
    setSelectedCabdis("all");
  }, [activeTab]);

  if (!data) return null;



  const ensureArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return Object.values(val);
  };

  // Compile overdue items ('detail')
  const getOverdueItems = (catKey: string, categoryLabel: string) => {
    const list = data?.detail?.[catKey] || data?.[catKey]?.terlewat || [];
    return ensureArray(list).map((item: any) => ({
      ...item,
      category: categoryLabel,
      name: item.name || "Unknown",
      school: item.sekolah || item.school || "Dinas Pendidikan",
      status: "overdue",
      last_date: item.tmt_terakhir || "-",
      deadline_at: item.jatuh_tempo || "-",
      days_until: item.jatuh_tempo
        ? Math.ceil((new Date(item.jatuh_tempo).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        : -1,
    }));
  };

  const allItems: any[] = [];

  // Gather overdue items for all categories
  const pansiunKey = data?.detail?.pansiun ? "pansiun" : "pensiun";
  const berkalaList = getOverdueItems("berkala", "Berkala");
  const pangkatList = getOverdueItems("pangkat", "Pangkat");
  const pensiunList = getOverdueItems(pansiunKey, "Pensiun");
  const pppkList = getOverdueItems("pppk", "PPPK");

  if (activeTab === "semua") {
    allItems.push(...berkalaList, ...pangkatList, ...pensiunList, ...pppkList);
  } else if (activeTab === "berkala") {
    allItems.push(...berkalaList);
  } else if (activeTab === "pangkat") {
    allItems.push(...pangkatList);
  } else if (activeTab === "pensiun") {
    allItems.push(...pensiunList);
  } else if (activeTab === "pppk") {
    allItems.push(...pppkList);
  }

  // Extract unique Cabdis values dynamically
  const cabdisList = Array.from(
    new Set(allItems.map((item) => item.cabdis).filter(Boolean))
  ) as string[];
  cabdisList.sort();

  // Filter list by Cabdis and Search query
  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCabdis = selectedCabdis === "all" || item.cabdis === selectedCabdis;
    return matchesSearch && matchesCabdis;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const count_berkala = data?.rekap?.berkala ?? berkalaList.length;
  const count_pangkat = data?.rekap?.pangkat ?? pangkatList.length;
  const count_pensiun = data?.rekap?.pensiun ?? pensiunList.length;
  const count_pppk = data?.rekap?.pppk ?? pppkList.length;
  const total_count = data?.rekap?.total ?? (count_berkala + count_pangkat + count_pensiun + count_pppk);

  const chartData = [
    { name: "Berkala", value: count_berkala, color: "#F59E0B" },
    { name: "Pangkat", value: count_pangkat, color: "#A855F7" },
    { name: "Pensiun", value: count_pensiun, color: "#2563EB" },
    { name: "PPPK", value: count_pppk, color: "#EF4444" },
  ].filter(item => item.value > 0);

  return (
    <div
      className={`fixed inset-y-0 left-0 w-[95%] bg-white shadow-2xl z-[150] transform transition-transform duration-500 ease-in-out border-r border-slate-100 flex ${isOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
    >
      <div className="h-full flex w-full relative font-poppins">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[200] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Left Side: Donut Summary & Interactive Legend Filters */}
        <div className="w-[350px] border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-8 flex items-center justify-between bg-white">
            <div>
              <div className="text-xl font-bold text-slate-800">Detail Jatuh Tempo</div>
            </div>
            <button
              onClick={onClose}
              className="p-2  hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-8 overflow-y-auto scrollbar-hide">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
              <div className="relative aspect-square mb-6 flex items-center justify-center">
                {total_count > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.length > 0 ? chartData : [{ name: "Empty", value: 1, color: "#e2e8f0" }]}
                          innerRadius="70%"
                          outerRadius="100%"
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={40}
                          startAngle={225}
                          endAngle={-45}
                        >
                          {chartData.length > 0 ? (
                            chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                          ) : (
                            <Cell fill="#e2e8f0" />
                          )}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pt-4">
                      <span className="text-3xl font-bold text-slate-800">
                        {total_count}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1">
                        Ptk
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-300 py-10">Tidak ada data</div>
                )}
              </div>

              {/* Clickable Legend Cards that sync with top tabs */}
              <div className="space-y-3">
                {/* Pensiun Toggle Button */}
                <button
                  onClick={() => setActiveTab(activeTab === "pensiun" ? "semua" : "pensiun")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${activeTab === "pensiun"
                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-100 scale-[1.02]"
                    : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTab === "pensiun" ? "bg-white" : "bg-blue-500"
                        }`}
                    />
                    <span className="text-sm font-semibold">Pensiun</span>
                  </div>
                  <span className="font-bold text-sm">{count_pensiun}</span>
                </button>

                {/* Pangkat Toggle Button */}
                <button
                  onClick={() => setActiveTab(activeTab === "pangkat" ? "semua" : "pangkat")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${activeTab === "pangkat"
                    ? "bg-purple-600 text-white border-purple-600 font-bold shadow-md shadow-purple-100 scale-[1.02]"
                    : "bg-purple-50 text-purple-500 border-purple-100 hover:bg-purple-100/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTab === "pangkat" ? "bg-white" : "bg-purple-500"
                        }`}
                    />
                    <span className="text-sm font-semibold">Kenaikan Pangkat</span>
                  </div>
                  <span className="font-bold text-sm">{count_pangkat}</span>
                </button>

                {/* Berkala Toggle Button */}
                <button
                  onClick={() => setActiveTab(activeTab === "berkala" ? "semua" : "berkala")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${activeTab === "berkala"
                    ? "bg-amber-600 text-white border-amber-600 font-bold shadow-md shadow-amber-100 scale-[1.02]"
                    : "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-100/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTab === "berkala" ? "bg-white" : "bg-amber-500"
                        }`}
                    />
                    <span className="text-sm font-semibold">Gaji Berkala</span>
                  </div>
                  <span className="font-bold text-sm">{count_berkala}</span>
                </button>

                {/* PPPK Toggle Button */}
                <button
                  onClick={() => setActiveTab(activeTab === "pppk" ? "semua" : "pppk")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${activeTab === "pppk"
                    ? "bg-rose-600 text-white border-rose-600 font-bold shadow-md shadow-rose-100 scale-[1.02]"
                    : "bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTab === "pppk" ? "bg-white" : "bg-rose-500"
                        }`}
                    />
                    <span className="text-sm font-semibold">PPPK</span>
                  </div>
                  <span className="font-bold text-sm">{count_pppk}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Selection, Filters, and Overdue List */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-8 space-y-4 pb-6">
            {/* Header Title */}
            {/* Dropdown Filters and Search Bar */}
            <div className="flex items-center justify-between gap-6">
              {/* Dynamic Cabdis Selection Option */}
              <div className="relative group max-w-xs w-full">
                <select
                  value={selectedCabdis}
                  onChange={(e) => setSelectedCabdis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm cursor-pointer appearance-none pr-10 font-semibold text-slate-600"
                >
                  <option value="all">Semua Cabang Dinas</option>
                  {cabdisList.map((cabdis) => (
                    <option key={cabdis} value={cabdis}>
                      {cabdis}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Dynamic Keyword search */}
              <div className="relative flex-1 max-w-md group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-rose-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama atau unit kerja..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* HTML Table of Overdue Teachers */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-white">
            {filteredItems.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100">
                        <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">
                          No
                        </th>
                        {activeTab === "semua" && (
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Kategori
                          </th>
                        )}
                        <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Unit Kerja
                        </th>
                        <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Jatuh Tempo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginatedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 px-6 text-sm text-slate-400 font-medium text-center">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          {activeTab === "semua" && (
                            <td className="py-4 px-6 text-sm">
                              <div
                                className={`px-3 py-1 rounded-xl text-xs font-bold border inline-block ${item.category === "Berkala"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : item.category === "Pangkat"
                                    ? "bg-purple-50 text-purple-600 border-purple-100"
                                    : item.category === "Pensiun"
                                      ? "bg-blue-50 text-blue-600 border-blue-100"
                                      : "bg-rose-50 text-rose-600 border-rose-100"
                                  }`}
                              >
                                {item.category}
                              </div>

                            </td>
                          )}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all shrink-0">
                                <User className="w-5 h-5" />
                              </div>
                              <div className="">
                                <div className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-sm">

                                  {item.last_date || "-"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-500 font-medium">{item.school}</td>
                          <td className="py-4 px-6 text-sm">
                            <div className="font-bold text-rose-500  whitespace-nowrap">
                              {item.days_until < 0
                                ? `Terlewat ${Math.abs(item.days_until)} Hari`
                                : "Jatuh Tempo Hari Ini"}
                            </div>
                            {item.deadline_at}

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-4 pt-8 border-t border-slate-100 flex items-center justify-between bg-white">
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
                        className="w-14 h-14 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-[1.5rem] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="w-14 h-14 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-[1.5rem] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-slate-300 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-semibold text-slate-400">Data tidak ditemukan</p>
                <p className="text-sm text-slate-300 mt-1">Coba sesuaikan pencarian atau filter Anda</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}

        </div>
      </div>
    </div>
  );
};
