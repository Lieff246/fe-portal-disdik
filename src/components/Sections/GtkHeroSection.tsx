import React from "react";
import { Icon } from "@iconify/react";
import { SulawesiMap } from "../Fragments/SulawesiMap";
import { Header } from "../Fragments/Header";
import { SubjectNeeds } from "../Analytics/SubjectNeeds";
import { GtkSummaryPanel } from "../Analytics/GtkSummaryPanel";
import type { GtkLandingData } from "@/types";

interface GtkHeroProps {
  landingData?: GtkLandingData;
  onViewRegionDetail?: (marker: any) => void;
  onViewSubjectDetail?: (subject: any) => void;
}

export const GtkHeroSection: React.FC<GtkHeroProps> = ({
  landingData,
  onViewRegionDetail,
  onViewSubjectDetail,
}) => {
  if (!landingData) return null;

  return (
    <section className="relative w-full overflow-hidden flex flex-col min-h-[950px] lg:min-h-screen pb-12">
      {/* MAP FULL BACKGROUND - Berada di layer paling bawah */}
      <div className="absolute inset-0 z-0 bg-white">
        <SulawesiMap
          markers={landingData.regions || []}
          onViewDetail={onViewRegionDetail}
        />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* KONTEN MELAYANG (FLOATING) */}
      <div className="relative z-10 flex-1 flex flex-col pt-28 pb-20 px-8 lg:px-12 gap-16 pointer-events-none container mx-auto">
        {/* TOP SECTION: Analytics Panel Kiri & Kanan */}
        <div className="flex justify-between items-start">
          {/* Left: Global Summary */}
          <div className="w-80 lg:w-96 pointer-events-auto">
            <GtkSummaryPanel stats={landingData.stats} />
          </div>

          {/* Right: Subject Needs */}
          <div className="pointer-events-auto">
            <SubjectNeeds
              data={landingData.subjects}
              onViewDetail={onViewSubjectDetail}
            />
          </div>
        </div>

        {/* BOTTOM SECTION: Stats & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-auto pointer-events-auto">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Cabang Dinas",
                value: "13 Kab/Kota",
                icon: "mdi:map-marker-radius",
                color: "text-emerald-500",
                bg: "bg-green-50",
              },
              {
                label: "Total Sekolah",
                value: landingData.stats.total_sekolah.toLocaleString(),
                icon: "mdi:school",
                color: "text-blue-500",
                bg: "bg-blue-50/50",
              },
              {
                label: "Total Guru",
                value: landingData.stats.total_guru.toLocaleString(),
                icon: "mdi:account-group",
                color: "text-amber-500",
                bg: "bg-amber-50/50",
              },
              {
                label: "Total Tendik",
                value: "200",
                icon: "mdi:account-tie",
                color: "text-purple-500",
                bg: "bg-purple-50/50",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-[#F8FCFF] backdrop-blur-md px-6 py-4 rounded-[2.5rem] flex items-center gap-6 group transition-all`}
              >
                <div
                  className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl ${card.bg} ${card.color} `}
                >
                  <Icon icon={card.icon} />
                </div>
                <div>
                  <p className="text-sm mb-1">
                    {card.label}
                  </p>
                  <div className="text-2xl font-bold">
                    {card.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-[#6966F5] to-[#8483FF] p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden h-full flex flex-col gap-8 group">
              <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#6966F5] to-[#8483FF] rounded-2xl flex items-center justify-center text-3xl">
                <Icon icon="mdi:book-open-page-variant" />
              </div>
              <div className="relative z-10">
                <div className="text-gray-50">Jumlah Kebutuhan Guru</div>
                <div className="text-2xl font-bold">
                  {landingData.stats.abk_recap?.total_abk.toLocaleString() ||
                    "0"}
                </div>
              </div>
              <Icon
                icon="mdi:school-outline"
                className="absolute -bottom-6 -right-6 text-9xl text-white/10 group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
