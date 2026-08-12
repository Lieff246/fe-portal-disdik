import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PemetaanService } from "@/services/pemetaanService";
import { Skeleton } from "@/components/Elements/Skeleton/Skeleton";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [portalData, setPortalData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil dari backend pemetaan (disdik-pemetaan Laravel)
      const res = await PemetaanService.getLanding();

      const summary    = res?.data?.summary;
      const cards      = res?.data?.cards;
      const neracaRekap = res?.data?.neracaRekap;

      setPortalData({
        // summary untuk GeneralDataSection
        summary: {
          total_sekolah  : summary?.total_sekolah  ?? 0,
          total_siswa    : summary?.total_siswa    ?? 0,
          // Field berikut belum ada di backend (data GTK) — tampilkan 0 dulu
          total_rombel   : 0,
          total_guru     : 0,
          total_tendik   : 0,
          total_pegawai  : 0,
          semester_id    : summary?.semester_id,
          // mapMarkers dibuat dari cards kabupaten untuk peta
          mapMarkers: (cards ?? []).map((c: any, idx: number) => ({
            id   : idx + 1,
            name : c.kabupaten,
            lat  : 0,   // koordinat belum ada di endpoint landing — kosong dulu
            lng  : 0,
            stats: {
              schools  : c.total_sekolah  ?? 0,
              students : c.total_siswa    ?? 0,
              teachers : 0,
            },
          })),
        },

        // cards untuk PortalDataCards — merge dengan data kabupaten dari API
        cards: cards ?? [],

        // neracaRekap — dipakai oleh NeracaSidebar
        neracaRekap: neracaRekap ?? [],

        // projections — belum ada endpoint, kirim null agar ProyeksiCard tidak crash
        projections: null,
      });
    } catch (error) {
      console.error("Gagal fetch data landing:", error);
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
      onFilterChange={() => {}}
      onProyeksiFilterChange={() => {}}
      proyeksiLoading={false}
    />
  );
};
