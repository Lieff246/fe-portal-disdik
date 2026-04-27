import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PortalService } from "@/services/portalService";

import { Skeleton } from "@/components/Elements/Skeleton/Skeleton";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kabupaten_kota: "",
    bidang_studi: "",
    cabdis: "",
    sekolah: "",
  });

  const [portalData, setPortalData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summary, projections, cards, gtkStats] = await Promise.all([
        PortalService.getSummary(),
        PortalService.getProjections(),
        PortalService.getPortalCards(),
        PortalService.getGtkStats(),
      ]);

      setPortalData({
        summary,
        projections,
        cards,
        gtkStats,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen p-10 bg-gray-50 flex flex-col gap-6">
        <Skeleton className="w-full h-[60vh] rounded-[40px]" />
        <div className="flex gap-6 h-[30vh]">
          <Skeleton className="w-1/3 h-full" />
          <Skeleton className="w-1/3 h-full" />
          <Skeleton className="w-1/3 h-full" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      portalData={portalData}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
};
