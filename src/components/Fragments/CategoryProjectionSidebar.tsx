import React, { useState, useEffect } from "react";
import { X, Search, Award, Calendar, User, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "../Elements/Skeleton/Skeleton";

interface CategoryProjectionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // All projections data
  initialCategory: string;
  currentMonth: string;
  onMonthChange: (newMonth: string) => void;
  isLoading?: boolean;
}

export const CategoryProjectionSidebar: React.FC<
  CategoryProjectionSidebarProps
> = ({
  isOpen,
  onClose,
  data,
  initialCategory,
  isLoading,
}) => {
    const [activeTab, setActiveTab] = useState(initialCategory || "berkala");
    const [listFilter, setListFilter] = useState<
      "all" | "realized" | "pending" | "overdue"
    >("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCabdis, setSelectedCabdis] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset pagination when filters, tab or search changes
    useEffect(() => {
      setCurrentPage(1);
    }, [activeTab, listFilter, searchQuery, selectedCabdis]);

    // Sync active tab when initialCategory changes (e.g. clicking different categories while sidebar is open or closed)
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
      setListFilter("all");
      setSelectedCabdis("all");
    }, [activeTab]);

    if (!data && !isLoading) return null;

    const tabs = [
      { id: "semua", label: "Semua", icon: <Layers className="w-4 h-4" /> },
      { id: "berkala", label: "Berkala", icon: <Calendar className="w-4 h-4" /> },
      { id: "pangkat", label: "Pangkat", icon: <Award className="w-4 h-4" /> },
      { id: "pensiun", label: "Pensiun", icon: <User className="w-4 h-4" /> },
    ];

    const ensureArray = (val: any) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return Object.values(val);
    };

    // Prepare full list for filtering based on active tab
    const allItems: any[] = [];

    const getCategoryItems = (catKey: string, categoryLabel: string) => {
      const catData = data?.[catKey] || { target: [], upload: [], terlewat: [] };
      return [
        ...ensureArray(catData.target).map((item: any) => ({
          ...item,
          category: categoryLabel,
          name: item.name || "Unknown",
          school: item.sekolah || item.school || "Dinas Pendidikan",
          status: "pending",
          last_date: item.tmt_terakhir || "-",
          deadline_at: item.jatuh_tempo || "-",
          days_until: item.jatuh_tempo ? Math.ceil((new Date(item.jatuh_tempo).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0
        })),
        ...ensureArray(catData.upload).map((item: any) => ({
          ...item,
          category: categoryLabel,
          name: item.name || "Unknown",
          school: item.sekolah || item.school || "Dinas Pendidikan",
          status: "realized",
          last_date: item.tmt_terakhir || "-",
          deadline_at: item.jatuh_tempo || "-",
          days_until: item.jatuh_tempo ? Math.ceil((new Date(item.jatuh_tempo).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0
        })),
        ...ensureArray(catData.terlewat).map((item: any) => ({
          ...item,
          category: categoryLabel,
          name: item.name || "Unknown",
          school: item.sekolah || item.school || "Dinas Pendidikan",
          status: "overdue",
          last_date: item.tmt_terakhir || "-",
          deadline_at: item.jatuh_tempo || "-",
          days_until: item.jatuh_tempo ? Math.ceil((new Date(item.jatuh_tempo).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : -1
        })),
      ];
    };

    if (activeTab === "semua") {
      allItems.push(...getCategoryItems("berkala", "Berkala"));
      allItems.push(...getCategoryItems("pangkat", "Pangkat"));
      const pansiunKey = data?.pansiun ? "pansiun" : "pensiun";
      allItems.push(...getCategoryItems(pansiunKey, "Pensiun"));
    } else {
      const label = activeTab === "berkala" ? "Berkala" : activeTab === "pangkat" ? "Pangkat" : "Pensiun";
      const key = activeTab === "pensiun" ? (data?.pansiun ? "pansiun" : "pensiun") : activeTab;
      allItems.push(...getCategoryItems(key, label));
    }

    // Extract dynamic unique list of Cabdis for the filter option
    const cabdisList = Array.from(
      new Set(allItems.map((item) => item.cabdis).filter(Boolean))
    ) as string[];
    cabdisList.sort();

    // Filter list
    const filteredItems = allItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.school.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = listFilter === "all" || item.status === listFilter;
      const matchesCabdis = selectedCabdis === "all" || item.cabdis === selectedCabdis;
      return matchesSearch && matchesFilter && matchesCabdis;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const real_count = allItems.filter(item => item.status === "realized").length;
    const pending_count = allItems.filter(item => item.status === "pending").length;
    const overdue_count = allItems.filter(item => item.status === "overdue").length;
    const target_count = allItems.length;

    const chartData = [
      { name: "Sudah", value: real_count, color: "#84CC16" },
      { name: "Belum", value: pending_count, color: "#F59E0B" },
      { name: "Terlewat", value: overdue_count, color: "#EF4444" },
    ];

    return (
      <div
        className={`fixed inset-y-0 left-0 w-[95%] bg-white shadow-2xl z-[150] transform transition-transform duration-500 ease-in-out border-r border-slate-100 flex ${isOpen ? "translate-x-0" : "-translate-x-[110%]"}`}
      >
        {/* Sidebar Content */}
        <div className="h-full flex w-full relative font-poppins">

          {/* Left Side: Summary & Chart */}
          <div className="w-[350px] border-r border-slate-100 flex flex-col shrink-0">
            <div className="p-8 flex items-center justify-between bg-white">
              <div>
                <div className="text-xl font-bold text-slate-800">Analisis Proyeksi</div>
              </div>
              <button
                onClick={onClose}
                className="p-2  hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-8 pb-8 overflow-y-auto scrollbar-hide">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
                <div className="relative aspect-square mb-6 flex items-center justify-center">
                  {isLoading ? (
                    <Skeleton className="w-[180px] h-[180px] rounded-full animate-pulse" />
                  ) : target_count > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            innerRadius="70%"
                            outerRadius="100%"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                            startAngle={225}
                            endAngle={-45}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pt-4">
                        <span className="text-3xl font-bold text-slate-800">
                          {real_count}
                        </span>
                        <span className="text-2xl text-slate-400">
                          /{target_count}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-300 py-10">
                      Tidak ada data
                    </div>
                  )}
                </div>

                {/* Clickable Legend Filters */}
                <div className="space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-full h-14 rounded-2xl animate-pulse" />
                      <Skeleton className="w-full h-14 rounded-2xl animate-pulse" />
                      <Skeleton className="w-full h-14 rounded-2xl animate-pulse" />
                    </>
                  ) : (
                    <>
                      {/* Telah Submit Button Card */}
                      <button
                        onClick={() => setListFilter(listFilter === "realized" ? "all" : "realized")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${listFilter === "realized"
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md shadow-emerald-100 scale-[1.02]"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/70"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${listFilter === "realized" ? "bg-white" : "bg-emerald-500"}`} />
                          <span className="text-sm font-semibold">Telah submit</span>
                        </div>
                        <span className="font-bold text-sm">
                          {real_count}
                        </span>
                      </button>

                      {/* Telah Lewat Button Card */}
                      <button
                        onClick={() => setListFilter(listFilter === "overdue" ? "all" : "overdue")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${listFilter === "overdue"
                          ? "bg-rose-600 text-white border-rose-600 font-bold shadow-md shadow-rose-100 scale-[1.02]"
                          : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/70"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${listFilter === "overdue" ? "bg-white" : "bg-rose-500"}`} />
                          <span className="text-sm font-semibold">Telah lewat</span>
                        </div>
                        <span className="font-bold text-sm">
                          {overdue_count}
                        </span>
                      </button>

                      {/* Belum Upload Button Card */}
                      <button
                        onClick={() => setListFilter(listFilter === "pending" ? "all" : "pending")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${listFilter === "pending"
                          ? "bg-amber-600 text-white border-amber-600 font-bold shadow-md shadow-amber-100 scale-[1.02]"
                          : "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-100/70"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${listFilter === "pending" ? "bg-white" : "bg-amber-500"}`} />
                          <span className="text-sm font-semibold">Belum upload</span>
                        </div>
                        <span className="font-bold text-sm">
                          {pending_count}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Tabs, Filters, & Table list of teachers */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-8 border-b border-slate-100 space-y-4 pb-6">
              {/* Tab Category bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-wrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all border ${activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-100 border-blue-600 scale-[1.02] font-bold"
                        : "bg-white text-slate-600 hover:bg-slate-50 border-slate-100"
                        }`}
                    >
                      {tab.icon}
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="p-4 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm shrink-0 border border-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex items-center justify-between gap-6 pt-4 ">
                {/* Dynamic Cabdis Selector */}
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

                {/* Search query input */}
                <div className="relative flex-1 max-w-md group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama atau unit kerja..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              {isLoading || filteredItems.length > 0 ? (
                <>
                  <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-100">
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">No</th>
                          {activeTab === "semua" && (
                            <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                          )}
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Kerja</th>
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline Proyeksi</th>
                          <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                          [...Array(5)].map((_, idx) => (
                            <tr key={idx} className="animate-pulse border-b border-slate-50">
                              <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
                              {activeTab === "semua" && (
                                <td className="py-4 px-6"><Skeleton className="h-6 w-16 rounded-xl" /></td>
                              )}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                                  <div className="flex flex-col gap-1.5 flex-1">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6"><Skeleton className="h-4 w-36" /></td>
                              <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                              <td className="py-4 px-6 text-center"><Skeleton className="h-6 w-24 rounded-full mx-auto" /></td>
                            </tr>
                          ))
                        ) : (
                          paginatedItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="py-4 px-6 text-sm text-slate-400 font-medium text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                              {activeTab === "semua" && (
                                <td className="py-4 px-6 text-sm">
                                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border inline-block ${item.category === "Berkala"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : item.category === "Pangkat"
                                      ? "bg-purple-50 text-purple-600 border-purple-100"
                                      : "bg-blue-50 text-blue-600 border-blue-100"
                                    }`}>
                                    {item.category}
                                  </span>
                                </td>
                              )}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shrink-0">
                                    <User className="w-5 h-5" />
                                  </div>
                                  <div className="text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                                    <div className="font-bold">{item.name}</div>
                                    <div>{item.last_date || "-"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-slate-500 font-medium">{item.school}</td>
                              <td className="py-4 px-6 text-sm">
                                <div className={`font-bold ${item.days_until < 0 ? "text-rose-500" : "text-blue-600"}`}>
                                  {item.status === "realized"
                                    ? "Selesai"
                                    : item.days_until < 0
                                      ? `Terlewat ${Math.abs(item.days_until)} Hari`
                                      : `${item.days_until} Hari Lagi`}
                                </div>
                                <div>{item.deadline_at}</div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${item.status === "realized"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : item.status === "overdue"
                                      ? "bg-rose-50 text-rose-600 border-rose-100"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}
                                >
                                  {item.status === "realized"
                                    ? "Telah Submit"
                                    : item.status === "overdue"
                                      ? "Terlewat"
                                      : "Belum Submit"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="p-8 pb-0border-t border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
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
          </div>
        </div>
      </div>
    );
  };
