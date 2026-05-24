import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  School,
  CheckCircle2,
  Clock,
  MapPin,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { PortalService } from "@/services/portalService";

interface SchoolReportSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  cabdisSlug?: string;
  departmentId?: string;
}

export const SchoolReportSidebar: React.FC<SchoolReportSidebarProps> = ({
  isOpen,
  onClose,
  currentMonth,
  cabdisSlug,
  departmentId,
}) => {
  const [rawReports, setRawReports] = useState<any[]>([]);
  const [cachedMonth, setCachedMonth] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCabdis, setSelectedCabdis] = useState("");
  const [cabdisList, setCabdisList] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await PortalService.getSchoolReports({
        month: currentMonth,
      });
      setRawReports(res.data || []);
      setSummary(res.summary);
      setCachedMonth(currentMonth);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCabdis = async () => {
    try {
      const res = await PortalService.getDepartments();
      setCabdisList(res);
    } catch (error) {
      console.error("Failed to fetch cabdis list", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (rawReports.length === 0 || cachedMonth !== currentMonth) {
        fetchReports();
      }
      if (cabdisList.length === 0) {
        fetchCabdis();
      }
    }
  }, [isOpen, currentMonth]);

  // Automatically select active Cabdis based on slug or department ID
  useEffect(() => {
    if (isOpen && cabdisList.length > 0 && (cabdisSlug || departmentId)) {
      const match = cabdisList.find((c: any) => 
        (cabdisSlug && c.slug === cabdisSlug) || 
        (departmentId && c.id === departmentId)
      );
      if (match) {
        setSelectedCabdis(match.id);
      }
    }
  }, [isOpen, cabdisList, cabdisSlug, departmentId]);

  const filteredReports = useMemo(() => {
    return rawReports.filter((item: any) => {
      if (selectedCabdis && item.id_cabdis !== selectedCabdis) {
        return false;
      }
      if (search && !item.school_name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [rawReports, selectedCabdis, search]);

  const filteredSummary = useMemo(() => {
    if (!summary) return null;
    if (!selectedCabdis && !search) {
      return summary;
    }
    const total = filteredReports.length;
    const finished = filteredReports.filter((item: any) => item.status === "finished").length;
    const pending = total - finished;
    const percentage = total > 0 ? parseFloat(((finished / total) * 100).toFixed(2)) : 0;
    return {
      total,
      finished,
      pending,
      percentage,
      month: summary.month,
    };
  }, [summary, filteredReports, selectedCabdis, search]);

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

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[95%] bg-white shadow-2xl z-[150] transform transition-transform duration-500 ease-in-out border-l border-slate-100 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-[110%]"}`}
    >
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div>
          <div className="text-xl font-bold">Laporan Bulanan</div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" /> Periode {monthLabel}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-3 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-8">
        {/* Mini Progress */}
        {filteredSummary && (
          <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-600">
                  Progress Laporan Bulanan Sekolah
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600">
                  {monthLabel}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="w-full h-5 bg-slate-200/50 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${filteredSummary.percentage}%` }}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${100 - filteredSummary.percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] p-6 flex flex-col gap-2 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sudah Update
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800">
                    {(filteredSummary.finished || 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    ({filteredSummary.percentage}%)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 flex flex-col gap-2 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Belum Update
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-800">
                    {(filteredSummary.pending || 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    ({(100 - filteredSummary.percentage).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama sekolah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
            />
          </div>

          {!(cabdisSlug || departmentId) && (
            <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCabdis("")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCabdis === "" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
              >
                Semua Wilayah
              </button>
              {cabdisList.map((cab, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCabdis(cab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCabdis === cab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                >
                  {cab.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-50 animate-pulse rounded-3xl"
                />
              ))
          ) : filteredReports.length > 0 ? (
            filteredReports.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-5 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-100 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.status === "finished" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
                    >
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold leading-tight">
                        {item.school_name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.sub_department}
                      </p>
                    </div>
                  </div>
                  <div className=" border-t border-slate-50 flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-semibold ${item.status === "finished" ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50 "}`}
                    >
                      {item.status === "finished" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      {item.status_label}
                    </div>
                    {item.updated_at && (
                      <span className="text-[9px] font-bold text-slate-300 uppercase">
                        Update: {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <School className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-black uppercase tracking-widest">
                Sekolah tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
