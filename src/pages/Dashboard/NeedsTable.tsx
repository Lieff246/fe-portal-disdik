import React from "react";
import { Icon } from "@iconify/react";
import type { GtkLandingData } from "@/types";

interface NeedsTableProps {
  data?: GtkLandingData["list"];
  options: GtkLandingData["options"];
  filters: { kabupaten_kota: string; bidang_studi: string; cabdis: string; sekolah: string };
  onFilterChange: (filters: any) => void;
  onOpenDrilldown: () => void;
}

export const NeedsTable: React.FC<NeedsTableProps> = ({ 
  data, 
  options, 
  filters, 
  onFilterChange,
  onOpenDrilldown
}) => {
  return (
    <section className="px-6 lg:px-10 py-12 bg-white">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">List Beban Mengajar Guru</h2>
          <p className="text-slate-500 mt-1 font-medium">Data detail beban jam mengajar per sekolah dan mata pelajaran</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <select
              value={filters.bidang_studi}
              onChange={(e) => onFilterChange({ ...filters, bidang_studi: e.target.value })}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 outline-none text-sm font-bold text-slate-600 appearance-none shadow-sm transition-all"
            >
              <option value="">Semua Mata Pelajaran</option>
              {options.bidang_studi.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <Icon icon="mdi:book-open-variant" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none" />
          </div>

          <div className="relative group">
            <select
              value={filters.kabupaten_kota}
              onChange={(e) => onFilterChange({ ...filters, kabupaten_kota: e.target.value })}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 outline-none text-sm font-bold text-slate-600 appearance-none shadow-sm transition-all"
            >
              <option value="">Semua Kabupaten / Kota</option>
              {options.kabupaten_kota.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <Icon icon="mdi:map-marker" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sekolah</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Jabatan / Mapel</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Beban Mengajar</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Kab / Kota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.data.map((item, idx) => {
                  const avgHours = item.jumlah_guru > 0 ? item.total_jam / item.jumlah_guru : 0;
                  const isOverload = avgHours > 24;
                  const isUnderload = avgHours < 18;

                  return (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => {
                        onFilterChange({ ...filters, sekolah: item.sekolah });
                        onOpenDrilldown();
                      }}
                    >
                      <td className="px-8 py-6">
                        <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{item.sekolah}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-600">{item.mapel}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{item.jumlah_guru} Guru Terdaftar</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1">
                           <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${
                             isOverload ? 'bg-rose-50 text-rose-500' : isUnderload ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                           }`}>
                             <Icon icon={isOverload ? "mdi:alert-circle" : isUnderload ? "mdi:information" : "mdi:check-circle"} />
                             {Math.round(avgHours)} Jam / Guru
                           </div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase">
                             Total: {item.total_jam} Jam
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-bold text-slate-500">{item.kabupaten_kota}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
