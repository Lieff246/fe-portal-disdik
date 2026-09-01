import React from "react";
import { School, LayoutGrid, Users, GraduationCap, UserCog, Briefcase } from "lucide-react";

interface Props {
  data: any;
}

const METRIC_CONFIG = [
  {
    label: "Total Sekolah",
    key: "total_sekolah",
    icon: School,
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/25",
    isHero: true,
  },
  {
    label: "Jumlah Rombel",
    key: "total_rombel",
    icon: LayoutGrid,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    isHero: false,
  },
  {
    label: "Total Siswa",
    key: "total_siswa",
    icon: Users,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    isHero: false,
  },
  {
    label: "Tenaga Pendidik",
    key: "total_guru",
    icon: GraduationCap,
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    isHero: false,
  },
  {
    label: "Tenaga Kependidikan",
    key: "total_tendik",
    icon: UserCog,
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-100",
    isHero: false,
  },
  {
    label: "Pegawai Dinas",
    key: "total_pegawai",
    icon: Briefcase,
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    isHero: false,
  },
];

export const GeneralDataSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="w-full">
      <div className="rounded-[2rem] bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)] px-6 py-5">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
            Data Umum Satuan Pendidikan
          </h2>
          {data?.semester_id && (
            <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Semester {data.semester_id}
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {METRIC_CONFIG.map((m) => {
            const value = data?.[m.key] ?? 0;
            const Icon = m.icon;
            const isZero = value === 0;

            // Card hero — gradient biru untuk Total Sekolah
            if (m.isHero) {
              return (
                <div
                  key={m.key}
                  className={`flex flex-col gap-3 rounded-[1.4rem] bg-gradient-to-br ${m.gradient} shadow-lg ${m.shadow} px-4 py-4`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100 leading-none mb-1">
                      {m.label}
                    </p>
                    <p className="text-2xl font-black text-white leading-tight">
                      {value.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            }

            // Card biasa
            return (
              <div
                key={m.key}
                className={`flex flex-col gap-3 rounded-[1.4rem] border ${m.border} ${m.bg} px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center ${m.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 leading-none mb-1">
                    {m.label}
                  </p>
                  <p className={`text-xl font-black leading-tight ${isZero ? "text-slate-300" : "text-slate-900"}`}>
                    {value.toLocaleString("id-ID")}
                  </p>
                  {isZero && (
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                      Belum tersedia
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Catatan GTK */}
        {(data?.total_guru === 0 || data?.total_tendik === 0) && (
          <p className="mt-4 text-[10px] text-slate-400 font-medium text-center">
            * Data Tenaga Pendidik, Kependidikan, dan Pegawai Dinas akan tersedia setelah integrasi dengan layanan GTK.
          </p>
        )}
      </div>
    </section>
  );
};
