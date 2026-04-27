import React from "react";
import { SulawesiMap } from "../Fragments/SulawesiMap";
import { GeneralDataSection } from "./GeneralDataSection";
import { ProgressUpdateSection } from "./ProgressUpdateSection";
import { ProyeksiCard } from "./ProyeksiCardSection";
import { PortalDataCards } from "./PortalCardSection";

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

  return (
    <section className="relative w-full py-10 px-4 md:px-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Center: Title & Hero Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-start z-10 pointer-events-none">
        <img src="/logo.png" className="w-[50%]" alt="Logo" />
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 z-0 scale-[1.1] w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-full h-full pointer-events-auto flex items-center justify-center">
          <SulawesiMap
            markers={portalData?.summary?.mapMarkers || []}
            onViewDetail={onViewRegionDetail}
          />
        </div>
      </div>

      {/* Main Flex Content: Ubah dari grid menjadi flex lg:flex-row */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Left: Proyeksi (flex-[3] = mengambil porsi 3/4 alias 75%) */}
        <div className="flex-[3] flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-right lg:text-left border-l-3 pl-4 border-[#2563EB]">
            <div className="font-bold">Proyeksi</div>
            <div className="text-sm font-medium">
              Dinas Pendidikan Prov. Sulawesi Tengah
            </div>
          </div>

          <ProyeksiCard projections={projections} />

          <GeneralDataSection data={portalData?.summary} />
        </div>
        {/* Right: Portal Data (flex-[1] = mengambil porsi 1/4 alias 25%) */}
        {/* Right: Portal Data */}
        <div className="flex-[1] relative">
          {/* Wrapper absolut untuk mengunci tinggi mengikuti parent (kolom kiri).
            Dibuat flex-col agar isinya bisa dibagi: atas untuk label, bawah untuk scroll.
          */}
          <div className="lg:absolute lg:inset-0 flex flex-col gap-6">
            {/* Label "Portal Data" (Tetap diam, shrink-0 agar tidak terkompres) */}
            <div className="flex flex-col gap-1 text-right lg:text-left border-l-3 pl-4 border-[#2563EB] shrink-0">
              <div className="font-bold">Portal Data</div>
              <div className="text-sm font-medium">
                Dinas Pendidikan Prov. Sulawesi Tengah
              </div>
            </div>

            {/* Container Kartu (Hanya area ini yang akan muncul scrollbar) */}
            <div className="flex-1 lg:overflow-y-auto lg:pr-2 scrollbar-hide hover:scrollbar-thumb-gray-400 flex flex-col gap-6">
              <PortalDataCards cards={cards} gtkStats={gtkStats} />
            </div>
          </div>
        </div>{" "}
      </div>

      <ProgressUpdateSection />

      <footer className="py-0 flex flex-col items-center gap-6 opacity-50 mt-10">
        <p className="text-center">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </p>
      </footer>
    </section>
  );
};
