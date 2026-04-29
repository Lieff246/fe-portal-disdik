import React, { useState, useMemo } from "react";
import { X, Search, Award, Calendar, User, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
  currentMonth,
  onMonthChange,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState(initialCategory || "berkala");
  const [listFilter, setListFilter] = useState<
    "all" | "realized" | "pending" | "overdue"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const date = new Date(y, m - 2, 1);
    const nextY = date.getFullYear();
    const nextM = date.getMonth() + 1;
    onMonthChange(`${nextY}-${nextM < 10 ? "0" + nextM : nextM}`);
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const date = new Date(y, m, 1);
    const nextY = date.getFullYear();
    const nextM = date.getMonth() + 1;
    onMonthChange(`${nextY}-${nextM < 10 ? "0" + nextM : nextM}`);
  };

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

  if (!data) return null;

  const tabs = [
    { id: "berkala", label: "Berkala", icon: <Calendar className="w-4 h-4" /> },
    { id: "pangkat", label: "Pangkat", icon: <Award className="w-4 h-4" /> },
    { id: "pns", label: "Pensiun", icon: <User className="w-4 h-4" /> },
  ];

  const ensureArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return Object.values(val);
  };

  const currentCategoryData = data[activeTab] || {
    target_count: 0,
    real_count: 0,
    overdue_count: 0,
    target_list: [],
    real_list: [],
  };

  // Prepare full list for filtering
  const allItems = [
    ...ensureArray(currentCategoryData.target_list).map((item: any) => ({
      ...item,
      status: item.days_until < 0 ? "overdue" : "pending",
    })),
    ...ensureArray(currentCategoryData.real_list).map((item: any) => ({
      ...item,
      status: "realized",
    })),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = listFilter === "all" || item.status === listFilter;
    return matchesSearch && matchesFilter;
  });

  const chartData = [
    { name: "Sudah", value: currentCategoryData.real_count, color: "#84CC16" },
    {
      name: "Belum",
      value: Math.max(
        0,
        currentCategoryData.target_count -
          currentCategoryData.real_count -
          currentCategoryData.overdue_count,
      ),
      color: "#F59E0B",
    },
    {
      name: "Terlewat",
      value: currentCategoryData.overdue_count,
      color: "#EF4444",
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 w-[95%] bg-white shadow-2xl z-[150] transform transition-transform duration-500 ease-in-out border-r border-slate-100 flex ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Sidebar Content */}
      <div className="h-full flex w-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[200] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Left Side: Summary & Chart */}
        <div className="w-[350px] border-r border-slate-100 flex flex-col ">
          <div className="p-8  flex items-center justify-between bg-white">
            <div>
              <div className="text-xl font-bold">Analisis Proyeksi</div>
              <div>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600"
                  >
                    <Clock className="w-4 h-4 rotate-180" />
                  </button>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                    {monthLabel}
                  </p>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 lg:hidden hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-8">
              <h4 className="text-center text-sm font-semibold mb-6">
                Progres {activeTab}
              </h4>
              <div className="relative aspect-square mb-6">
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
                  <p className="text-3xl font-bold">
                    {currentCategoryData.real_count}
                  </p>
                  <p className="text-2xl">
                    /{currentCategoryData.target_count}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold">Telah submit</span>
                  </div>
                  <span className="font-bold text-sm">
                    {currentCategoryData.real_count}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 text-[#EF4444]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-sm font-semibold">Telah lewat</span>
                  </div>
                  <span className="font-bold text-sm">
                    {currentCategoryData.overdue_count}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 text-amber-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-semibold">Belum upload</span>
                  </div>
                  <span className="font-bold text-sm">
                    {currentCategoryData.target_count -
                      currentCategoryData.real_count -
                      currentCategoryData.overdue_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tabs & Teacher List */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-8 border-b border-slate-100 space-y-4 pb-6">
            {/* Category Tabs (Berkala, Pangkat, Pensiun) - MOVED HERE */}
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-4 rounded-2xl flex items-center gap-4 transition-all border ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-100 border-blue-600 scale-[1.02]"
                        : "bg-white text-slate-600 hover:bg-slate-50 border-slate-100"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-bold text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="p-4 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex items-center justify-between gap-6 pt-4 ">
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setListFilter("all")}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${listFilter === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Semua ({allItems.length})
                </button>
                <button
                  onClick={() => setListFilter("realized")}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${listFilter === "realized" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Selesai ({currentCategoryData.real_count})
                </button>
                <button
                  onClick={() => setListFilter("pending")}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${listFilter === "pending" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Belum (
                  {currentCategoryData.target_count -
                    currentCategoryData.real_count -
                    currentCategoryData.overdue_count}
                  )
                </button>
                <button
                  onClick={() => setListFilter("overdue")}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${listFilter === "overdue" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Terlewat ({currentCategoryData.overdue_count})
                </button>
              </div>

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

          <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-3xl  p-6 hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden"
              >
                {item.status === "overdue" && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
                )}
                {item.status === "realized" && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-bold">{item.name}</h5>
                      <p className="text-xs text-slate-600">{item.school}</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-sm mb-3 ${
                      item.status === "realized"
                        ? "bg-emerald-50 text-emerald-600"
                        : item.status === "overdue"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status === "realized"
                      ? "Telah Submit"
                      : item.status === "overdue"
                        ? "Terlewat"
                        : "Belum Submit"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6  border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs  mb-1 flex items-center gap-1">
                      TMT Terakhir
                    </p>
                    <p className="text-sm font-semibold">
                      {item.last_date || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs  mb-1 flex items-center gap-1">
                      Deadline Proyeksi
                    </p>
                    <p className="text-sm font-semibold">{item.deadline_at}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs  mb-1 gap-1">Countdown</p>
                    <p
                      className={`text-sm font-bold ${item.days_until < 0 ? "text-rose-500" : "text-blue-600"}`}
                    >
                      {item.status === "realized"
                        ? "Selesai"
                        : item.days_until < 0
                          ? `Terlewat ${Math.abs(item.days_until)} Hari`
                          : `${item.days_until} Hari Lagi`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">Data tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
