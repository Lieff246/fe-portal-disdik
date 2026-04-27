import React from "react";
import { SulawesiMap } from "../Fragments/SulawesiMap";
import { Users, FileText, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { GeneralDataSection } from "./GeneralDataSection";
import { ProgressUpdateSection } from "./ProgressUpdateSection";

interface Props {
  portalData: any;
  onViewRegionDetail: (marker: any) => void;
}

export const PortalHeroSection: React.FC<Props> = ({
  portalData,
  onViewRegionDetail,
}) => {
  const projections = portalData?.projections || {
    berkala: { target_count: 0, real_count: 0, overdue_count: 0 },
    pangkat: { target_count: 0, real_count: 0, overdue_count: 0 },
    pns: { target_count: 0, real_count: 0, overdue_count: 0 },
    pppk: { target_count: 0, real_count: 0, overdue_count: 0 },
  };

  const cards = portalData?.cards || {
    kepegawaian: { finished: 0, total: 1000, percentage: 0 },
  };

  const gtkStats = portalData?.gtkStats || {
    stats: { abk_recap: { recap: { kekurangan: 0, kelebihan: 0, ideal: 0 } } },
  };

  const totalTarget = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.target_count || 0),
    0,
  );
  const totalReal = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.real_count || 0),
    0,
  );
  const totalOverdue = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.overdue_count || 0),
    0,
  );
  const totalRemaining = Math.max(0, totalTarget - totalReal - totalOverdue);

  const donutData = [
    { name: "Telah Submit", value: totalReal, color: "#10b981" },
    { name: "Belum Submit", value: totalRemaining, color: "#e2e8f0" },
    { name: "Terlewat", value: totalOverdue, color: "#f43f5e" },
  ];

  return (
    // 1. Ubah min-h-[65rem] lg:h-[55rem] menjadi min-h-screen agar responsif setinggi layar
    <section className="relative w-full py-10 px-4 md:px-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Center: Title & Hero Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-start z-10 pointer-events-none">
        <img src="/logo.png" className="w-[50%]" />
      </div>

      {/* 2. Pastikan pembungkus map pakai w-full h-full dan flex center supaya SVG map di dalamnya tidak error ukurannya */}
      <div className="absolute inset-0 z-0 scale-[1.1] w-full h-full flex items-center justify-center pointer-events-none">
        {/* Tambahkan pointer-events-auto ke SulawesiMap agar petanya tetap bisa di-klik */}
        <div className="w-full h-full pointer-events-auto flex items-center justify-center">
          <SulawesiMap
            markers={portalData?.summary?.mapMarkers || []}
            onViewDetail={onViewRegionDetail}
          />
        </div>
      </div>

      {/* Konten Grid - Tetap Sama */}
      <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Proyeksi */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-right lg:text-left">
            <h2 className="font-bold">Portal Data</h2>
            <p className="text-sm font-medium">
              Dinas Pendidikan Prov. Sulawesi Tengah
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-[1px] border border-white/40 rounded-[3rem] p-8 shadow-xl w-1/3 shadow-slate-200/10 flex flex-col gap-8 h-full">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Proyeksi Pelayanan
              </h3>
            </div> */}

            {/* Donut Chart */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="75%"
                      outerRadius="100%"
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Target
                  </span>
                  <span className="text-3xl font-black text-slate-800 leading-none">
                    {totalTarget}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-3 mt-6 w-full">
                {donutData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-none">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-6 pt-4 border-t border-slate-300/30">
              {[
                { label: "Berkala", data: projections.berkala },
                { label: "Pangkat", data: projections.pangkat },
                { label: "PNS", data: projections.pns },
                { label: "PPPK", data: projections.pppk },
              ].map((item, idx) => {
                const realized = item.data.real_count;
                const target = item.data.target_count;
                const overdue = item.data.overdue_count;
                const percent = target > 0 ? (realized / target) * 100 : 0;
                const overduePercent =
                  target > 0 ? (overdue / target) * 100 : 0;

                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.label} PROSES
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-slate-800">
                          {realized}
                        </span>
                        {overdue > 0 && (
                          <span className="text-xs font-bold text-rose-500">
                            ({overdue}!)
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400">
                          / {target}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-200/50 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-l-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      ></div>
                      <div
                        className="h-full bg-rose-500 transition-all duration-1000"
                        style={{ width: `${overduePercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <GeneralDataSection data={portalData?.summary} />
        </div>

        {/* Right: Portal Data */}
        <div className="lg:col-span-3 flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-1 text-right lg:text-left">
            <h2 className="font-bold">Portal Data</h2>
            <p className="text-sm font-medium">
              Dinas Pendidikan Prov. Sulawesi Tengah
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-[1px] border border-white/40 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/10 flex flex-col gap-4 group hover:bg-white/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm flex items-start font-bold text-[#1E293B]">
                  Kepegawaian<div className="text-[11px]">+</div>
                </h4>
                <p className="text-xs font-medium mt-0.5">
                  Dinas Pendidikan Prov Sulteng
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${cards.kepegawaian.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">
                  Penyelesaian Berkas
                </span>
                <span className="font-bold text-slate-900">
                  {cards.kepegawaian.finished}/{cards.kepegawaian.total}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                window.open(
                  "https://kepegawaian-disdik.sekolahkukeren.id",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all group cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kunjungi</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-[1px] border border-white/40 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/10 flex flex-col gap-4 group hover:bg-white/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm flex items-start font-bold text-[#1E293B]">
                  PTK<div className="text-[11px]">+</div>
                </h4>
                <p className="text-xs font-medium mt-0.5">
                  Dinas Pendidikan Prov Sulteng
                </p>
              </div>
            </div>

            <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-200/50">
              <div
                className="h-full bg-emerald-500"
                style={{ width: "60%" }}
              ></div>
              <div
                className="h-full bg-amber-500"
                style={{ width: "30%" }}
              ></div>
              <div
                className="h-full bg-rose-500"
                style={{ width: "10%" }}
              ></div>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Kekurangan Guru",
                  value: gtkStats.stats.abk_recap.recap.kekurangan,
                  color: "rose",
                },
                {
                  label: "Kelebihan Guru",
                  value: gtkStats.stats.abk_recap.recap.kelebihan,
                  color: "amber",
                },
                {
                  label: "Ideal",
                  value: gtkStats.stats.abk_recap.recap.ideal,
                  color: "emerald",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                    ></div>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                window.open(
                  "https://gtk-disdik.sekolahkukeren.id",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all group cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kunjungi</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-[1px] border border-white/40 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/10 flex flex-col gap-4 group hover:bg-white/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm flex items-start font-bold text-[#1E293B]">
                  SMA<div className="text-[11px]">+</div>
                </h4>
                <p className="text-xs font-medium mt-0.5">
                  Dinas Pendidikan Prov Sulteng
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Total Sekolah",
                  value: gtkStats.stats.abk_recap.recap.kekurangan,
                  color: "rose",
                },
                {
                  label: "Tenaga Pendidik",
                  value: gtkStats.stats.abk_recap.recap.kelebihan,
                  color: "amber",
                },
                {
                  label: "Tenaga Kependidikan",
                  value: gtkStats.stats.abk_recap.recap.kelebihan,
                  color: "amber",
                },
                {
                  label: "Total Siswa",
                  value: gtkStats.stats.abk_recap.recap.ideal,
                  color: "emerald",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                    ></div>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => (window.location.href = "http://localhost:7774")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all group cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kunjungi</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <ProgressUpdateSection />

      <footer className="py-0 flex flex-col items-center gap-6 opacity-50">
        <p className="text-center">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </p>
      </footer>
    </section>
  );
};
