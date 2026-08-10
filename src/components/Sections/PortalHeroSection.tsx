import React from "react";
import { SulawesiMap } from "../Fragments/SulawesiMap";
import { GeneralDataSection } from "./GeneralDataSection";
import { ProgressUpdateSection } from "./ProgressUpdateSection";
import { ProyeksiCard } from "./ProyeksiCardSection";
import { PortalDataCards } from "./PortalCardSection";

interface Props {
  portalData: any;
  onViewRegionDetail: (marker: any) => void;
  onOpenNeraca?: () => void;
  onOpenBantuan?: () => void;
  onProyeksiFilterChange?: (
    range: "monthly" | "yearly",
    month?: number,
  ) => void;
  onOpenProyeksiDetail?: (category: string) => void;
  onOpenJatuhTempoDetail?: (category: string) => void;
  onOpenSchoolReports?: () => void;
  proyeksiLoading?: boolean;
  currentMonth?: string;
}

export const PortalHeroSection: React.FC<Props> = ({
  portalData,
  onViewRegionDetail,
  onOpenNeraca,
  onOpenBantuan,
  onProyeksiFilterChange,
  onOpenProyeksiDetail,
  onOpenJatuhTempoDetail,
  onOpenSchoolReports,
  proyeksiLoading,
  currentMonth,
}) => {
  // console.log(portalData);


  const schoolSummary = portalData?.cards?.school_reports;

  const cards = portalData?.cards || {
    kepegawaian: { finished: 0, total: 1000, percentage: 0 },
  };

  const gtkStats = portalData?.gtkStats || {
    stats: { abk_recap: { recap: { kekurangan: 0, kelebihan: 0, ideal: 0 } } },
  };

  return (
    <section className="relative w-full py-10 px-4 md:px-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Center: Title & Hero Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-start z-10 pointer-events-none">
        <img src="/logo.png" className="w-[50%]" alt="Logo" />
      </div>

      {/* Map Background (BASE) - BEHIND EVERYTHING */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full scale-[1.1] flex items-center justify-center">
          <SulawesiMap layer="base" />
        </div>
      </div>

      {/* Map Background (INTERACTIVE) - ON TOP OF EVERYTHING */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <div className="w-full h-full scale-[1.1] flex items-center justify-center">
          <SulawesiMap
            layer="interactive"
            markers={portalData?.summary?.mapMarkers || []}
            onViewDetail={onViewRegionDetail}
          />
        </div>
      </div>

      {/* Main Flex Content - AT LOWER Z-INDEX */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-4 items-start px-10">
        {/* Left: Proyeksi */}
        <div className="flex-[3] flex flex-col gap-6">
          <div className="w-full lg:w-1/3">
            <ProyeksiCard
              projections={portalData?.projections}
              onFilterChange={onProyeksiFilterChange}
              onOpenDetail={onOpenProyeksiDetail}
              onOpenJatuhTempoDetail={onOpenJatuhTempoDetail}
              isLoading={proyeksiLoading}
            />
          </div>
          <GeneralDataSection data={portalData?.summary} />
        </div>
        {/* Right: Portal Data (Kabupaten & Kota Cards) */}
        <div className="flex-[1] flex flex-col w-full">
          <PortalDataCards
            cards={cards}
            gtkStats={gtkStats}
            onViewRegionDetail={onViewRegionDetail}
          />
        </div>
      </div>

      <div className="w-full flex justify-between items-start mt-10 relative z-10 px-10">
        {/* Combined Neraca & Bantuan Cards */}
        <div className="flex gap-4">
          <div
            className="w-64 p-6 rounded-[2.5rem] bg-gradient-to-br from-[#2588EB] via-[#3b82f6] to-[#10B981] text-white flex flex-col gap-4 cursor-pointer hover:scale-105 transition-transform shadow-xl shadow-blue-500/20"
            onClick={onOpenNeraca}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">
                Neraca Pendidikan
              </div>
              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Data Dapodik GTK & Kepegawaian Daerah
              </p>
            </div>
            <button
              className="w-full py-3 bg-blue-700/30 rounded-2xl text-xs font-semibold border border-white/10 hover:bg-white/20 transition-colors mt-auto"
              onClick={(e) => {
                e.stopPropagation();
                onOpenNeraca?.();
              }}
            >
              Lihat Neraca
            </button>
          </div>

          <div
            className="w-64 p-6 rounded-[2.5rem] bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] text-white flex flex-col gap-4 cursor-pointer hover:scale-105 transition-transform shadow-xl shadow-violet-500/20"
            onClick={onOpenBantuan}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">
                Customer Center / Bantuan
              </div>
              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Layanan Bantuan & SOP Pulpen
              </p>
            </div>
            <button
              className="w-full py-3 bg-violet-700/50 rounded-2xl text-xs font-semibold border border-white/10 hover:bg-violet-500 transition-colors mt-auto"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBantuan?.();
              }}
            >
              Lihat Bantuan
            </button>
          </div>
        </div>

        <div className="flex-1 ml-6">
          <ProgressUpdateSection
            summary={schoolSummary}
            currentMonth={currentMonth}
            onClick={onOpenSchoolReports}
          />
        </div>
      </div>

      <footer className="py-0 flex flex-col items-center gap-6 opacity-50 mt-10">
        <p className="text-center">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </p>
      </footer>
    </section>
  );
};
