import React from "react";
import { useNavigate } from "react-router-dom";
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
  onProyeksiFilterChange?: (range: "monthly" | "yearly", month?: number) => void;
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
  const navigate = useNavigate();

  const handleViewRegionDetail = (region: any) => {
    if (onViewRegionDetail) {
      onViewRegionDetail(region);
    } else {
      const slug = region.slug ?? "cabdis-1";
      navigate(`/${slug}?name=${encodeURIComponent(region.name ?? region.kabupaten ?? "")}`);
    }
  };

  const schoolSummary = portalData?.school_reports;

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

      {/* ── LAYER 1: Peta background Indonesia (abu-abu, paling bawah) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SulawesiMap layer="base" />
      </div>

      {/* ── LAYER 2: Peta interaktif Sulawesi Tengah (TENGAH, hanya area peta yg klik) ── */}
      {/*
        Peta diletakkan di TENGAH layar secara absolut.
        pointer-events dibatasi hanya pada area peta itu sendiri
        agar card kiri & kanan tetap bisa diklik.
        Ukuran diperkecil agar tidak overlap dengan cards samping.
      */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(400px, 45vw, 700px)",
          height: "clamp(350px, 65vh, 600px)",
        }}
      >
        <div className="pointer-events-auto w-full h-full">
          <SulawesiMap
            layer="interactive"
            kabupatenStats={portalData?.kabupatenStats ?? []}
          />
        </div>
      </div>

      {/* ── LAYER 3: Logo di tengah atas ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <img src="/logo.png" className="h-12 object-contain" alt="Logo Portal" />
      </div>

      {/* ── LAYER 4: Konten utama (card kiri + card kanan) — z-30, DI ATAS peta ── */}
      <div className="relative z-30 w-full min-h-screen flex flex-col">

        {/* Row utama */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between w-full px-6 lg:px-10 pt-24 pb-6">

          {/* ── KIRI: ProyeksiCard + GeneralData ── */}
          <div className="flex-none w-full lg:w-[300px] xl:w-[320px] flex flex-col gap-5 pointer-events-auto">
            <ProyeksiCard
              projections={portalData?.projections}
              onFilterChange={onProyeksiFilterChange}
              onOpenDetail={onOpenProyeksiDetail}
              onOpenJatuhTempoDetail={onOpenJatuhTempoDetail}
              isLoading={proyeksiLoading}
            />
            <GeneralDataSection data={portalData?.summary} />
          </div>

          {/* ── TENGAH: kosong (area peta) ── */}
          <div className="flex-1 hidden lg:block min-w-[400px]" aria-hidden="true" />

          {/* ── KANAN: Daftar kabupaten/kota cards ── */}
          <div className="flex-none w-full lg:w-[300px] xl:w-[320px] pointer-events-auto">
            <PortalDataCards
              cards={portalData?.cards ?? []}
              onViewRegionDetail={handleViewRegionDetail}
            />
          </div>
        </div>

        {/* ── Baris bawah: Neraca + Bantuan + Progress ── */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-5 px-6 lg:px-10 pb-8 pointer-events-auto">

          {/* Neraca & Bantuan */}
          <div className="flex flex-wrap gap-4 shrink-0">
            {/* Neraca */}
            <div
              className="w-60 p-5 rounded-[2rem] bg-gradient-to-br from-[#2588EB] via-[#3b82f6] to-[#10B981] text-white flex flex-col gap-3 cursor-pointer hover:scale-[1.03] transition-transform shadow-xl shadow-blue-500/20"
              onClick={onOpenNeraca}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm">Neraca Pendidikan</div>
                <p className="text-xs text-white/80 font-medium leading-relaxed mt-0.5">
                  Data Dapodik GTK & Kepegawaian Daerah
                </p>
              </div>
              <button
                className="w-full py-2.5 bg-blue-700/30 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/20 transition-colors mt-auto cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onOpenNeraca?.(); }}
              >
                Lihat Neraca
              </button>
            </div>

            {/* Bantuan */}
            <div
              className="w-60 p-5 rounded-[2rem] bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] text-white flex flex-col gap-3 cursor-pointer hover:scale-[1.03] transition-transform shadow-xl shadow-violet-500/20"
              onClick={onOpenBantuan}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm">Customer Center / Bantuan</div>
                <p className="text-xs text-white/80 font-medium leading-relaxed mt-0.5">
                  Layanan Bantuan & SOP Pulpen
                </p>
              </div>
              <button
                className="w-full py-2.5 bg-violet-700/50 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/20 transition-colors mt-auto cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onOpenBantuan?.(); }}
              >
                Lihat Bantuan
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-1">
            <ProgressUpdateSection
              summary={schoolSummary}
              currentMonth={currentMonth}
              onClick={onOpenSchoolReports}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-4 text-center text-xs opacity-40 shrink-0 pointer-events-none">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </footer>
      </div>
    </section>
  );
};
