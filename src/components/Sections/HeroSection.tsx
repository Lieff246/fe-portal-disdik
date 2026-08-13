import React from "react";
// HAPUS import Chart dari react-apexcharts jika tidak dipakai di tempat lain
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SulawesiMap } from "../Fragments/SulawesiMap";
import { Header } from "../Fragments/Header";
import { Clock, Users } from "lucide-react";
import { type CabangConfig } from "@/types";
import { timeAgo } from "@/utils/timeFormat";

interface HeroProps {
  cabangConfig?: CabangConfig;
  onOpenTracking?: () => void;
  onOpenServiceDetail?: (tab: string) => void;
  landingData?: any;
}

export const HeroSection: React.FC<HeroProps> = ({
  cabangConfig,
  onOpenTracking,
  onOpenServiceDetail,
  landingData,
}) => {
  // Extract the inner data from the response structure
  const content = landingData;
  // console.log(content);
  const activityLog = content?.activityLog || [];
  const summary = content?.summary;
  const rekapStatus = content?.rekapStatus;
  const serviceTimes = content?.serviceTimes;

  const totalSubmitted = rekapStatus?.sk_terbit || 0;
  const totalTarget = rekapStatus?.total || 0;

  // Data untuk Recharts: Indeks 0 (Hijau), Indeks 1 (Abu-abu sisa)
  const chartData = [
    { name: "Selesai", value: totalSubmitted },
    { name: "Sisa", value: Math.max(0, totalTarget - totalSubmitted) },
  ];

  return (
    <>
      <section className="relative w-full bg-surface overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-50">
          <Header cabangConfig={cabangConfig} onOpenTracking={onOpenTracking} />
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 pt-24 mt-2 bg-white/90 gap-x-8 px-6 lg:px-10 py-6">
          <div className="rounded-[2.5rem] flex flex-col items-center ">
            <div className="flex flex-col sm:flex-row w-full items-center gap-6 relative">
              {/* ================= GAUGE CHART (RECHARTS) ================= */}
              <div className="absolute -top-2">
                <div className="flex items-center justify-center w-[250px] h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="greenGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#28BA00" />
                          <stop offset="100%" stopColor="#C0EB25" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        startAngle={225}
                        endAngle={-45}
                        innerRadius="75%"
                        outerRadius="100%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={40}
                      >
                        {chartData.map((entry, index) => {
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0 ? "url(#greenGradient)" : "#e2e8f0"
                              }
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Custom Text Label Absolute (Posisi Tengah) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                    <span className="font-medium  uppercase mb-1 text-[10px]">
                      SK TERBIT
                    </span>
                    <div className="text-3xl font-bold text-slate-800 tracking-tight flex items-baseline leading-none">
                      {totalSubmitted}
                      <span className="text-lg font-bold text-slate-300 ml-1">
                        /{totalTarget}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Info */}
              <div className="ml-[280px] flex flex-col gap-3 w-full sm:w-auto">
                <div className="font-bold text-lg mb-2">
                  Penyelesaian Berkas
                </div>
                <div
                  className="bg-[rgb(37,99,235)] border-l-8 border-[#F59E0B] text-white px-4 py-2 flex justify-between items-center min-w-[280px] cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onOpenServiceDetail?.("guru_sma")}
                >
                  <div className="flex items-center gap-3 w-64">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="">Tenaga Pendidik</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xl leading-none">
                      {summary?.pendidikSkTerbit || 0}
                    </span>
                    <span className="text-xs font-bold opacity-40">
                      / {summary?.pendidikTotal || 0}
                    </span>
                  </div>
                </div>
                <div
                  className="bg-white px-4 py-2 flex justify-between items-center min-w-[280px] cursor-pointer hover:scale-105 transition-transform shadow-sm"
                  onClick={() => onOpenServiceDetail?.("tenaga_kependidikan")}
                >
                  <div className="flex items-center gap-3 w-64">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="">Tenaga Kependidikan</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xl leading-none">
                      {summary?.kependidikanSkTerbit || 0}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      / {summary?.kependidikanTotal || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] px-8 py-6 shadow-blue-100 pointer-events-auto w-full max-h-[190px] flex flex-col shadow-[0_12px_50px_-12px_#DBE8FF] relative overflow-hidden">
            {/* CONTENT */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Aktivitas Terkini</h3>
                </div>
              </div>

              <div className="space-y-5 overflow-y-auto pr-2 scrollbar-hide flex-1">
                {activityLog.map((item: any, idx: any) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-[2px] shrink-0 bg-[#F59E0B] rounded-full" />

                    <div className="flex flex-col gap-2 ml-2">
                      <p className="font-normal">{item.name}</p>

                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{timeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BACKGROUND IMAGE */}
            <img
              src="/bg_blue.png"
              className="absolute -top-20 -right-40 w-96 opacity-70 pointer-events-none z-0 select-none"
            />
          </div>
        </div>
      </section>

      {/* Bagian Bawah (Peta & Estimasi) */}
      <section className="relative w-full h-[43rem] overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
          <div className="w-full h-full">
            <div className="absolute inset-0 top-0 border border-red-600 flex items-center justify-center scale-[1.3] origin-center -translate-x-[10%]">
              <SulawesiMap markers={content?.mapMarkers} />
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[480px] z-40 pt-8 pb-8 px-6 lg:px-10 pointer-events-none flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-6 pointer-events-auto overflow-y-auto scrollbar-hide h-full">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl shadow-primary/5 border border-white/60 flex flex-col relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-1 bg-primary rounded-full"></div>
                  <h3 className="text-[10px] font-bold text-primary uppercase">
                    SERVICE ESTIMATION
                  </h3>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
                  Waktu Pelayanan
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
                  Rata-rata durasi penyelesaian di setiap tahapan verifikasi
                  berkas hingga SK diterbitkan.
                </p>
                <div className="space-y-8">
                  {[
                    {
                      label: "Verifikasi",
                      sub: "Akses & Unggah Mandiri",
                      time: serviceTimes?.submit_to_review || "2 Jam",
                      status: "completed",
                    },
                    {
                      label: "Validasi",
                      sub: "Cabang Dinas Provinsi",
                      time: serviceTimes?.review_to_dinas || "5 Jam",
                      status: "completed",
                    },
                    {
                      label: "Penerbitan SK",
                      sub: "BKD Sulawesi Tengah",
                      time: serviceTimes?.dinas_to_bkd || "3 Hari",
                      status: "active",
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 relative"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-5 aspect-square rounded-full border-4 ${step.status === "completed" ? "bg-emerald-500 border-emerald-100" : "bg-primary border-blue-100 animate-pulse"}`}
                        />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm leading-none mb-0.5">
                            {step.label}
                          </h4>
                          <span className="text-sm">{step.sub}</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        {step.time}
                      </span>
                    </div>
                  ))}

                  <div className="px-4 py-2 bg-[#EFF6FF] font-bold text-sm rounded-xl flex justify-between items-center">
                    <span>Estimasi Rata-rata</span>
                    <span>{serviceTimes?.total_avg || 0} Hari</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
