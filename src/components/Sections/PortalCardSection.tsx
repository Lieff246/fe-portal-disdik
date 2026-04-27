import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";

interface PortalDataCardsProps {
  cards: any;
  gtkStats: any;
}

// Reusable component untuk Card PTK, SMA, dan SMK
const GtkStatCard = ({
  title,
  stats,
  url,
}: {
  title: string;
  stats: any;
  url: string;
}) => (
  <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
    <div className="flex items-center gap-4">
      <div className="aspect-square h-11 rounded-full bg-[#DBEAFE] text-blue-600 flex items-center justify-center">
        <Icon icon="streamline-plump:web" className="text-xl" />
      </div>
      <div>
        <h4 className="text-sm flex items-start font-bold text-[#1E293B]">
          {title}
          <div className="text-[11px]">+</div>
        </h4>
        <p className="text-xs font-medium mt-0.5">
          Dinas Pendidikan Prov Sulteng
        </p>
      </div>
    </div>

    <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-200/50">
      <div className="h-full bg-emerald-500" style={{ width: "60%" }}></div>
      <div className="h-full bg-amber-500" style={{ width: "30%" }}></div>
      <div className="h-full bg-rose-500" style={{ width: "10%" }}></div>
    </div>

    <div className="space-y-2">
      {[
        {
          label: title === "PTK" ? "Kekurangan Guru" : "Total Sekolah",
          value: stats.kekurangan,
          color: "rose",
        },
        {
          label: title === "PTK" ? "Kelebihan Guru" : "Tenaga Pendidik",
          value: stats.kelebihan,
          color: "amber",
        },
        {
          label: title === "PTK" ? "Ideal" : "Tenaga Kependidikan",
          value: stats.kelebihan,
          color: "amber",
        },
        {
          label: title === "PTK" ? "Ideal" : "Total Siswa",
          value: stats.ideal,
          color: "emerald",
        },
      ].map((item, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
            <span className="text-xs">{item.label}</span>
          </div>
          <span className="text-xs font-bold text-slate-800">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>

    <button
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all group cursor-pointer"
    >
      <FileText className="w-3.5 h-3.5" />
      <span>Kunjungi</span>
      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export const PortalDataCards: React.FC<PortalDataCardsProps> = ({
  cards,
  gtkStats,
}) => {
  const statsData = gtkStats?.stats?.abk_recap?.recap || {
    kekurangan: 0,
    kelebihan: 0,
    ideal: 0,
  };

  return (
    <>
      {/* Kepegawaian Card (Berbeda strukturnya dengan GTK) */}
      <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="aspect-square h-11 rounded-full bg-[#DBEAFE] text-blue-600 flex items-center justify-center">
            <Icon icon="streamline-plump:web" className="text-xl" />
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
          <div className="w-full h-3 bg-gray-300/40 rounded-full overflow-hidden">
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

      {/* GTK Cards */}
      <GtkStatCard
        title="PTK"
        stats={statsData}
        url="https://gtk-disdik.sekolahkukeren.id"
      />
      <GtkStatCard
        title="SMA"
        stats={statsData}
        url="https://gtk-disdik.sekolahkukeren.id"
      />
      <GtkStatCard
        title="SMK"
        stats={statsData}
        url="https://gtk-disdik.sekolahkukeren.id"
      />
    </>
  );
};
