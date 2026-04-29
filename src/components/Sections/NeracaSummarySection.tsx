import React from "react";
import { Filter, Users, UserCheck, ShieldCheck, MapPin } from "lucide-react";

interface NeracaSummarySectionProps {
  data: any;
  onFilterChange: (filters: any) => void;
  isLoading?: boolean;
}

export const NeracaSummarySection: React.FC<NeracaSummarySectionProps> = ({
  data,
  onFilterChange,
  isLoading
}) => {
  const kabupatenOptions = data?.kabupaten_kota ? Object.keys(data.kabupaten_kota) : [];

  return (
    <div className="w-[90%] mx-auto mb-12 bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/60 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-[3rem]">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Neraca</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Data Analitik Kepegawaian</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-slate-100/50 p-3 rounded-[2.5rem] border border-slate-200/50">
          <div className="flex items-center gap-3 px-4">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select 
              onChange={(e) => onFilterChange({ kabupaten_kota: e.target.value })}
              className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer min-w-[150px]"
            >
              <option value="">Seluruh Wilayah</option>
              {kabupatenOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-3 px-4">
            <Users className="w-4 h-4 text-slate-400" />
            <select 
              onChange={(e) => onFilterChange({ tempat_tugas: e.target.value })}
              className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer min-w-[150px]"
            >
              <option value="">Semua Jenjang</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
              <option value="SLB">SLB</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Total Personel", value: data?.lp ? Object.values(data.lp).reduce((a: any, b: any) => a + b, 0) : 0, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "ASN Aktif", value: data?.status_kepegawaian ? (data.status_kepegawaian['PNS'] || 0) + (data.status_kepegawaian['PPPK'] || 0) : 0, icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Laki-Laki", value: data?.lp?.L || 0, icon: <UserCheck />, color: "text-sky-600", bg: "bg-sky-50" },
           { label: "Perempuan", value: data?.lp?.P || 0, icon: <UserCheck />, color: "text-rose-600", bg: "bg-rose-50" },
         ].map((stat, i) => (
           <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white/50 flex items-center gap-5 transition-transform hover:scale-[1.02]`}>
             <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${stat.color} shadow-sm`}>
                {/* {React.cloneElement(stat.icon as React.ReactElement, { className: "w-7 h-7" })} */}
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{(stat.value as number).toLocaleString()}</p>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};
