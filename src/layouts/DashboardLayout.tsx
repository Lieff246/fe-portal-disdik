import { useState } from "react";
import { TrackingSidebar } from "@/components/Fragments/TrackingSidebar";
import { DetailSidebar } from "@/components/Fragments/DetailSidebar";
import { ServiceDetailModal } from "@/components/Fragments/ServiceDetailModal";
import { GtkDrilldownSidebar } from "@/components/Fragments/GtkDrilldownSidebar";
import type { DetailData, GtkLandingData } from "@/types";
import { PortalHeroSection } from "@/components/Sections/PortalHeroSection";
import { RegionSummarySidebar } from "@/components/Fragments/RegionSummarySidebar";
import { GtkDetailSidebar } from "@/components/Analytics/GtkDetailSidebar";
import { NeracaSidebar } from "@/components/Fragments/NeracaSidebar";

interface DashboardLayoutProps {
  landingData?: GtkLandingData;
  portalData?: any;
  filters?: {
    kabupaten_kota: string;
    bidang_studi: string;
    cabdis: string;
    sekolah: string;
  };
  onFilterChange?: (filters: any) => void;
  onProyeksiFilterChange?: (range: "monthly" | "yearly", month?: number) => void;
  proyeksiLoading?: boolean;
}

export const DashboardLayout = ({
  landingData,
  portalData,
  filters,
  onFilterChange,
  onProyeksiFilterChange,
  proyeksiLoading,
}: DashboardLayoutProps) => {
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [activeDetail, setActiveDetail] = useState<{
    type: "subject" | "region";
    id: string | number;
    title: string;
  } | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [isNeracaOpen, setIsNeracaOpen] = useState(false);
  const [selectedCabdisForSummary, setSelectedCabdisForSummary] =
    useState<any>(null);
  const initialServiceTab = "guru_sma";

  const handleOpenRegionDetail = (marker: any) => {
    setSelectedCabdisForSummary(marker);
  };

  const handleConfirmRegionDetail = (marker: any) => {
    setActiveDetail({
      type: "region",
      id: marker.id,
      title: marker.name,
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto text-content font-poppins selection:bg-primary selection:text-white scroll-smooth scrollbar-hide">
      {/* 1. Background fix: Gunakan z-0 agar posisinya di layar paling dasar */}
      <img
        src="/images/cmd/bc-cmdcenter-bg.webp"
        alt="Portal Background"
        className="fixed inset-0 object-cover object-center w-full h-full opacity-15 pointer-events-none select-none z-0"
      />

      <GtkDetailSidebar
        isOpen={!!activeDetail}
        onClose={() => setActiveDetail(null)}
        type={activeDetail?.type || "subject"}
        id={activeDetail?.id || ""}
        title={activeDetail?.title || ""}
      />

      <DetailSidebar
        isOpen={!!detailData}
        onClose={() => setDetailData(null)}
        detailData={detailData}
      />

      <TrackingSidebar
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <ServiceDetailModal
        isOpen={isServiceDetailOpen}
        onClose={() => setIsServiceDetailOpen(false)}
        initialTab={initialServiceTab}
      />

      <GtkDrilldownSidebar
        isOpen={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        data={landingData}
        filters={
          filters || {
            kabupaten_kota: "",
            bidang_studi: "",
            cabdis: "",
            sekolah: "",
          }
        }
        onFilterChange={onFilterChange || (() => {})}
      />

      <RegionSummarySidebar
        isOpen={!!selectedCabdisForSummary}
        onClose={() => setSelectedCabdisForSummary(null)}
        data={selectedCabdisForSummary}
        onViewDetail={handleConfirmRegionDetail}
      />

      <NeracaSidebar
        isOpen={isNeracaOpen}
        onClose={() => setIsNeracaOpen(false)}
        neracaData={portalData?.neraca}
      />

      {/* 2. Main content fix: Tambahkan 'z-10' agar semua komponen di dalamnya ditarik ke atas background */}
      <main className="w-full bg-transparent min-h-screen relative z-10 overflow-hidden">
        {/* <Header onOpenTracking={() => setIsTrackingOpen(true)} /> */}
        <PortalHeroSection
          portalData={portalData}
          onViewRegionDetail={handleOpenRegionDetail}
          onOpenNeraca={() => setIsNeracaOpen(true)}
          onProyeksiFilterChange={onProyeksiFilterChange}
          proyeksiLoading={proyeksiLoading}
        />
      </main>
    </div>
  );
};
