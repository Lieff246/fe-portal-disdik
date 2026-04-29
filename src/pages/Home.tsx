import { useEffect, useState, useCallback } from "react";
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
  const [initialProjections, setInitialProjections] = useState<any>(null);
  console.log(initialProjections);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [summary, projections, cards, gtkStats, neraca] = await Promise.all(
        [
          PortalService.getSummary(),
          PortalService.getProjections(), // Initial request for projections (Yearly/Current)
          PortalService.getPortalCards(),
          PortalService.getGtkStats(),
          PortalService.getNeraca(),
        ],
      );

      setPortalData({
        summary,
        projections,
        cards,
        gtkStats,
        neraca,
      });
      setInitialProjections(projections);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [proyeksiLoading, setProyeksiLoading] = useState(false);

  const handleProyeksiFilterChange = useCallback(
    async (range: "monthly" | "yearly", month?: number) => {
      setProyeksiLoading(true);
      try {
        const year = 2026;
        let params: any = { range };

        if (range === "monthly") {
          const monthStr = month && month < 10 ? `0${month}` : `${month}`;
          params.month = `${year}-${monthStr}`;
        } else {
          params.month = `${year}-01`;
        }

        const res = await PortalService.getProjections(params);

        setPortalData((prev: any) => ({
          ...prev,
          projections: {
            ...prev.projections,
            [range]: res,
          },
        }));
      } catch (error) {
        console.error("Failed to fetch projections:", error);
      } finally {
        setProyeksiLoading(false);
      }
    },
    [],
  );

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
      onProyeksiFilterChange={handleProyeksiFilterChange}
      proyeksiLoading={proyeksiLoading}
    />
  );
};
