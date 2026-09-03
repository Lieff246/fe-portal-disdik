import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { CABANG_DATA } from "@/types";
import type { CabangDinasItem } from "@/types";
import { School as SchoolIcon, Search, MapPin, ArrowRight, ChevronLeft } from "lucide-react";
import { PemetaanService } from "@/services/pemetaanService";
import { SulawesiMap } from "@/components/Fragments/SulawesiMap";
import { GeneralDataSection } from "@/components/Sections/GeneralDataSection";
import { Skeleton } from "@/components/Elements/Skeleton/Skeleton";

export const CabangDinas = ({ slug: propSlug }: { slug?: string }) => {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // =========================================================================
  // KUSTOMISASI KOORDINAT CENTER & ZOOM PER ID CABDIS (MANUAL ID MAPPING)
  // -------------------------------------------------------------------------
  // Anda dapat memasukkan kustom koordinat [latitude, longitude] dan zoom level
  // secara manual berdasarkan Angka Wilayah Cabang Dinas Anda di bawah ini.
  // Set nilai center atau zoom ke null jika ingin memakai koordinat default.
  // =========================================================================
  const CUSTOM_REGIONAL_CONFIGS: Record<number, { center: [number, number] | null; zoom: number | null }> = {
    1: { center: [-1.44849, 119.909619], zoom: 10 }, // Wilayah 1 (Kota Palu, Sigi)
    2: { center: [-2.14849, 120.309619], zoom: 8 }, // Wilayah 2 (Parigi Moutong, Donggala)
    3: { center: [-3.04849, 121.209619], zoom: 8 }, // Wilayah 3 (Poso, Ampana)
    4: { center: [-4.252631, 121.758189], zoom: 8.4 }, // Wilayah 4 (Morowali, Morowali Utara)
    5: { center: [-1.046066, 122.844154], zoom: null }, // Wilayah 5 (Banggai area)
    6: { center: [-0.029523, 121.074295], zoom: 9 }, // Wilayah 6 (Tolitoli, Buol)
  };

  // Ekstraksi instan nomor wilayah (1-6) dari slug Cabdis (misal cabdis-2 -> 2)
  const numericId = slug ? parseInt(slug.replace("cabdis-", ""), 10) : null;

  // State untuk data cabang dinas dari API, dengan fallback ke CABANG_DATA statis
  const [cabangApiData, setCabangApiData] = useState<CabangDinasItem | null>(null);
  const cabangFallback = numericId ? CABANG_DATA.find((c) => c.id === numericId) : undefined;

  // Gunakan data API jika tersedia, fallback ke CABANG_DATA statis
  const cabangConfig = cabangApiData
    ? {
        id: cabangApiData.id,
        name: cabangApiData.nama,
        kabKotas: cabangApiData.kabupaten_kota ?? cabangFallback?.kabKotas ?? [],
      }
    : cabangFallback
      ? { id: cabangFallback.id, name: cabangFallback.name, kabKotas: cabangFallback.kabKotas }
      : undefined;

  const regionName = queryParams.get("name") || cabangConfig?.name || `Wilayah ${numericId || ""}`;

  // Koordinat dari API jika tersedia, otherwise fallback ke CUSTOM_REGIONAL_CONFIGS
  const CUSTOM_MAP_CENTER: [number, number] | null =
    (cabangApiData?.map_lat && cabangApiData?.map_lng)
      ? [cabangApiData.map_lat, cabangApiData.map_lng]
      : (numericId && CUSTOM_REGIONAL_CONFIGS[numericId]?.center) || null;

  const CUSTOM_MAP_ZOOM: number | null =
    cabangApiData?.map_zoom
      ?? (numericId && CUSTOM_REGIONAL_CONFIGS[numericId]?.zoom)
      ?? null;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchoolForMap, setSelectedSchoolForMap] = useState<any>(null);


  // 1. Fetch detailed data when slug changes
  useEffect(() => {
    if (slug) {
      fetchDetail(false);
    }
  }, [slug]);

  // 2. Fetch overall landing page context on mount
  useEffect(() => {
    fetchCabangDinas();
  }, []);

  /** Ambil data cabang dinas dari API pemetaan untuk koordinat & nama akurat */
  const fetchCabangDinas = async () => {
    try {
      const res = await PemetaanService.getCabangDinas();
      if (res?.data && numericId) {
        const found = res.data.find((c) => c.id === numericId);
        if (found) setCabangApiData(found);
      }
    } catch (error) {
      // Fallback ke CABANG_DATA statis sudah ditangani di cabangConfig
      console.warn("Gagal fetch cabang dinas dari API, menggunakan data lokal:", error);
    }
  };

  const fetchDetail = async (_includeDetails = false) => {
    setLoading(true);
    try {
      // ✅ Pakai PemetaanService.getRegionDetail — bukan PortalService
      const res = await PemetaanService.getRegionDetail(slug!);
      if (res?.data) setData(res.data);
    } catch (error) {
      console.error("Failed to fetch region detail", error);
    } finally {
      setLoading(false);
    }
  };


  // Redirect to home jika ID Cabdis tidak dikenal atau gagal terurai
  // Cek numericId valid (1-6); cabangConfig bisa null sementara API sedang loading
  if (!numericId || isNaN(numericId) || numericId < 1 || numericId > 6) {
    return <Navigate to="/" replace />;
  }

  if (loading && !data) {
    return (
      <div className="w-screen h-screen p-10 bg-gray-50 flex flex-col gap-6">
        <Skeleton className="w-full h-[60vh] rounded-[40px] animate-pulse" />
        <div className="flex gap-6 h-[30vh] animate-pulse">
          <Skeleton className="w-1/3 h-full" />
          <Skeleton className="w-1/3 h-full" />
          <Skeleton className="w-1/3 h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-y-auto font-poppins bg-slate-50/20 scrollbar-hide scroll-smooth">

      {/* Background */}
      <img
        src="/images/cmd/bc-cmdcenter-bg.webp"
        alt=""
        className="fixed inset-0 object-cover w-full h-full opacity-15 pointer-events-none select-none z-0"
      />

      {/* Main */}
      <main className="w-full min-h-screen relative z-10 overflow-x-hidden flex flex-col items-center">

        {/* Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <img src="/logo.png" className="w-[50%]" alt="Logo" />
        </div>

        {/* Tombol Kembali */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/80 hover:bg-white border border-white/80 shadow-md rounded-2xl px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Peta Interaktif */}
        <div className="absolute inset-0 z-5 overflow-hidden">
          <div className="w-full h-full scale-[1.1] flex items-center justify-center">
            <SulawesiMap
              layer="interactive"
              onlyShowId={numericId}
              markers={[]}
              schools={data?.schools || []}
              customCenter={CUSTOM_MAP_CENTER}
              customZoom={CUSTOM_MAP_ZOOM}
              onSchoolClick={(school) => {
                setSchoolSearch(school.name);
                setSelectedSchoolForMap(school);
              }}
              selectedSchool={selectedSchoolForMap}
              onPopupClose={() => {
                setSchoolSearch("");
                setSelectedSchoolForMap(null);
              }}
            />
          </div>
        </div>

        {/* Layout: Peta (kiri transparan) + Panel Sekolah (kanan) */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row py-10 px-6 lg:px-10 gap-6 pointer-events-none" style={{ height: "100vh" }}>

          {/* Kiri: kosong, peta terlihat */}
          <div className="flex-[3] pointer-events-none" />

          {/* Kanan: Panel daftar sekolah */}
          <div className="flex-[1] pointer-events-auto flex flex-col gap-4 min-h-0">

              {/* Panel Header */}
              <div className="bg-white/80 backdrop-blur-md border border-white/80 shadow-lg rounded-[1.8rem] px-5 py-4 shrink-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1 h-5 rounded-full bg-blue-600 shrink-0" />
                  <div>
                    <p className="font-black text-sm text-slate-800">Sekolah</p>
                    <p className="text-xs text-slate-400 font-medium">Daftar Sekolah {regionName}</p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mt-3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Cari sekolah..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                  />
                </div>

                {/* Counter */}
                <p className="text-[10px] text-slate-400 font-semibold mt-2 px-1">
                  {data?.schools?.filter((s: any) =>
                    s.name?.toLowerCase().includes(schoolSearch.toLowerCase())
                  ).length ?? 0} sekolah ditemukan
                </p>
              </div>

              {/* Daftar Sekolah — flex-1 + overflow-y-auto = scroll dalam panel */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 scrollbar-hide min-h-0">

                {(data?.schools?.filter((s: any) =>
                  s.name?.toLowerCase().includes(schoolSearch.toLowerCase())
                ) ?? []).length === 0 && !loading && (
                  <div className="py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/60 backdrop-blur-sm rounded-[1.5rem] border border-white/60">
                    Tidak ada sekolah ditemukan
                  </div>
                )}

                {(data?.schools ?? [])
                  .filter((s: any) =>
                    s.name?.toLowerCase().includes(schoolSearch.toLowerCase())
                  )
                  .map((school: any) => {
                    const jenjang = school.grade ?? "";
                    const isSelected = selectedSchoolForMap?.id === school.id;

                    const JENJANG_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
                      SMA:  { bg: "bg-purple-50",  text: "text-purple-700",  dot: "#8b5cf6" },
                      SMK:  { bg: "bg-pink-50",    text: "text-pink-700",    dot: "#ec4899" },
                      SLB:  { bg: "bg-red-50",     text: "text-red-700",     dot: "#ef4444" },
                      MA:   { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "#6366f1" },
                      SMTK: { bg: "bg-teal-50",    text: "text-teal-700",    dot: "#14b8a6" },
                    };
                    const jCfg = JENJANG_COLOR[jenjang];
                    const dotColor = jCfg?.dot ?? "#64748b";

                    return (
                      <div
                        key={school.id}
                        className={`bg-white/90 backdrop-blur-sm rounded-[1.5rem] p-3.5 border shadow-sm transition-all ${
                          isSelected
                            ? "border-blue-300 shadow-blue-100"
                            : "border-white/80 hover:border-slate-200 hover:shadow-md"
                        }`}
                      >
                        {/* Nama + jenjang */}
                        <div className="flex items-start gap-2.5 mb-3">
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: dotColor + "20", color: dotColor }}
                          >
                            <SchoolIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                              {school.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-lg ${jCfg?.bg ?? "bg-slate-100"} ${jCfg?.text ?? "text-slate-600"}`}>
                                {jenjang || "—"}
                              </span>
                              <span className="text-[9px] font-semibold text-slate-400 uppercase">
                                {school.status}
                              </span>
                            </div>
                          </div>
                          <div
                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                            style={{ background: dotColor }}
                          />
                        </div>

                        {/* Kecamatan */}
                        {school.kecamatan && (
                          <div className="flex items-center gap-1.5 mb-3 px-0.5">
                            <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                            <span className="text-[10px] text-slate-400 font-semibold truncate">
                              {school.kecamatan}
                            </span>
                          </div>
                        )}

                        {/* Tombol aksi */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              if (school.latitude && school.longitude) {
                                setSchoolSearch(school.name);
                                setSelectedSchoolForMap(school);
                              }
                            }}
                            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                              school.latitude && school.longitude
                                ? "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100"
                                : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            }`}
                            disabled={!school.latitude || !school.longitude}
                            title={!school.latitude || !school.longitude ? "Koordinat belum tersedia" : ""}
                          >
                            <MapPin className="w-3 h-3" />
                            Lokasi
                          </button>

                          <button
                            onClick={() => {
                              if (school.npsn) navigate(`/sekolah/${school.npsn}`);
                            }}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-wider border border-slate-700 transition-all"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Detail
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
          </div>
        </div>

        {/* Section Data Umum */}
        <div className="relative z-10 w-full px-6 lg:px-10 pb-10 pointer-events-auto">
          <GeneralDataSection data={data?.summary} />

          <footer className="mt-6 text-center opacity-50">
            <p className="text-xs text-slate-500">
              &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
            </p>
          </footer>
        </div>

      </main>
    </div>
  );
};
