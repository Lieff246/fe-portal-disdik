import { useState } from "react";
import { TrackingSidebar } from "@/components/Fragments/TrackingSidebar";
import { DetailSidebar } from "@/components/Fragments/DetailSidebar";
import { ServiceDetailModal } from "@/components/Fragments/ServiceDetailModal";
import { GtkDrilldownSidebar } from "@/components/Fragments/GtkDrilldownSidebar";
import type { DetailData, GtkLandingData } from "@/types";
import { PortalHeroSection } from "@/components/Sections/PortalHeroSection";
import { GtkDetailSidebar } from "@/components/Analytics/GtkDetailSidebar";
import { NeracaSidebar } from "@/components/Fragments/NeracaSidebar";
import { CategoryProjectionSidebar } from "@/components/Fragments/CategoryProjectionSidebar";
import { RegionProjectionSidebar } from "@/components/Fragments/RegionProjectionSidebar";
import { SchoolReportSidebar } from "@/components/Fragments/SchoolReportSidebar";

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
  onProyeksiFilterChange?: (
    range: "monthly" | "yearly",
    month?: number,
  ) => void;
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
  console.log(portalData);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
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
  const [isNeracaRekapOpen, setIsNeracaRekapOpen] = useState(false);
  const [isSchoolReportsOpen, setIsSchoolReportsOpen] = useState(false);

  // Projection Sidebars State
  const [selectedCabdisForSummary, setSelectedCabdisForSummary] =
    useState<any>(null);
  const [activeCategoryDetail, setActiveCategoryDetail] = useState<
    string | null
  >(null);

  const initialServiceTab = "guru_sma";

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    const monthNum = parseInt(newMonth.split("-")[1]);
    onProyeksiFilterChange?.("monthly", monthNum);
  };

  const handleOpenRegionDetail = (marker: any) => {
    setSelectedCabdisForSummary(marker);
  };

  const handleOpenCategoryDetail = (category: string) => {
    setActiveCategoryDetail(category);
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
        onFilterChange={onFilterChange || (() => { })}
      />

      {/* Projection Sidebars */}
      <CategoryProjectionSidebar
        isOpen={!!activeCategoryDetail}
        onClose={() => setActiveCategoryDetail(null)}
        data={portalData?.projections?.monthly || portalData?.projections} // Fallback to root if monthly not explicitly wrapped
        initialCategory={activeCategoryDetail || "berkala"}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        isLoading={proyeksiLoading}
      />

      <RegionProjectionSidebar
        isOpen={!!selectedCabdisForSummary}
        onClose={() => setSelectedCabdisForSummary(null)}
        regionId={selectedCabdisForSummary?.id}
        regionName={selectedCabdisForSummary?.name}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />

      <SchoolReportSidebar
        isOpen={isSchoolReportsOpen}
        onClose={() => setIsSchoolReportsOpen(false)}
        currentMonth={currentMonth}
      />

      <NeracaSidebar
        isOpen={isNeracaOpen}
        onClose={() => setIsNeracaOpen(false)}
        initialNeracaData={portalData?.neraca}
      />

      <NeracaSidebar
        isOpen={isNeracaRekapOpen}
        onClose={() => setIsNeracaRekapOpen(false)}
        initialNeracaData={portalData?.neracaRekap}
      />

      {/* 2. Main content fix: Tambahkan 'z-10' agar semua komponen di dalamnya ditarik ke atas background */}
      <main className="w-full bg-transparent min-h-screen relative z-10 overflow-hidden">
        <PortalHeroSection
          portalData={portalData}
          onViewRegionDetail={handleOpenRegionDetail}
          onOpenNeraca={() => setIsNeracaOpen(true)}
          onOpenNeracaRekap={() => setIsNeracaRekapOpen(true)}
          onProyeksiFilterChange={onProyeksiFilterChange}
          onOpenProyeksiDetail={handleOpenCategoryDetail}
          onOpenSchoolReports={() => setIsSchoolReportsOpen(true)}
          proyeksiLoading={proyeksiLoading}
          currentMonth={currentMonth}
        />
      </main>
    </div>
  );
};
