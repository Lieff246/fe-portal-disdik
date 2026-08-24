import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, GeoJSON, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  School as SchoolIcon,
  MapPin,
  Eye,
  Search,
  Building2,
  GraduationCap,
  Users,
  Filter,
} from "lucide-react";
import { PemetaanService } from "@/services/pemetaanService";
import type { SekolahMarker } from "@/types";

// ─── Konstanta Jenjang Provinsi ───────────────────────────────────────────────
const JENJANG_PROVINSI = ["SMA", "MA", "SMK", "SLB", "SMTK"];

const JENJANG_CONFIG: Record<string, { label: string; color: string; bg: string; text: string; iconBg: string; iconColor: string }> = {
  SMA:  { label: "SMA",  color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "#DCFCE7", iconColor: "#15803D" },
  MA:   { label: "MA",   color: "#6366f1", bg: "bg-indigo-50",  text: "text-indigo-700",  iconBg: "#E0E7FF", iconColor: "#4338CA" },
  SMK:  { label: "SMK",  color: "#3b82f6", bg: "bg-sky-50",     text: "text-sky-700",     iconBg: "#DBEAFE", iconColor: "#1D4ED8" },
  SLB:  { label: "SLB",  color: "#f59e0b", bg: "bg-amber-50",   text: "text-amber-700",   iconBg: "#FEF9C3", iconColor: "#A16207" },
  SMTK: { label: "SMTK", color: "#ec4899", bg: "bg-pink-50",    text: "text-pink-700",    iconBg: "#FCE7F3", iconColor: "#BE185D" },
};

const getJenjangColor = (j: string) => JENJANG_CONFIG[j]?.color ?? "#6b7280";

// ─── Mapping kode kabupaten → Cabang Dinas ────────────────────────────────────
const KODE_TO_CABDIS: Record<string, { id: number; nama: string; label: string; color: string }> = {
  "7271": { id: 1, nama: "Wilayah 1", label: "Palu & Sigi",                    color: "#2563eb" },
  "7210": { id: 1, nama: "Wilayah 1", label: "Palu & Sigi",                    color: "#2563eb" },
  "7203": { id: 2, nama: "Wilayah 2", label: "Donggala & Parigi Moutong",      color: "#7c3aed" },
  "7208": { id: 2, nama: "Wilayah 2", label: "Donggala & Parigi Moutong",      color: "#7c3aed" },
  "7202": { id: 3, nama: "Wilayah 3", label: "Poso & Tojo Una-Una",            color: "#0891b2" },
  "7209": { id: 3, nama: "Wilayah 3", label: "Poso & Tojo Una-Una",            color: "#0891b2" },
  "7206": { id: 4, nama: "Wilayah 4", label: "Morowali & Morowali Utara",      color: "#059669" },
  "7212": { id: 4, nama: "Wilayah 4", label: "Morowali & Morowali Utara",      color: "#059669" },
  "7201": { id: 5, nama: "Wilayah 5", label: "Banggai, Bangkep & Balut",       color: "#d97706" },
  "7207": { id: 5, nama: "Wilayah 5", label: "Banggai, Bangkep & Balut",       color: "#d97706" },
  "7211": { id: 5, nama: "Wilayah 5", label: "Banggai, Bangkep & Balut",       color: "#d97706" },
  "7204": { id: 6, nama: "Wilayah 6", label: "Tolitoli & Buol",                color: "#dc2626" },
  "7205": { id: 6, nama: "Wilayah 6", label: "Tolitoli & Buol",                color: "#dc2626" },
};

// ─── Sub-component: SetMapView ────────────────────────────────────────────────
const SetMapView = ({
  center,
  zoom,
  mapRef,
}: {
  center: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();
  const applied = useRef(false);
  useEffect(() => {
    if (!applied.current) {
      applied.current = true;
      map.setView(center, zoom);
    }
    mapRef.current = map;
  }, [center, zoom, map, mapRef]);
  return null;
};

// ─── Buat icon marker per jenjang ─────────────────────────────────────────────
const createMarkerIcon = (jenjang: string, dimmed = false) => {
  const color = getJenjangColor(jenjang);
  const size  = dimmed ? 7 : 10;
  const opacity = dimmed ? 0.25 : 1;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3);opacity:${opacity}"></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ─── Main Page Component ──────────────────────────────────────────────────────
export const ProvinsiDetail = () => {
  const navigate  = useNavigate();
  const mapRef    = useRef<L.Map | null>(null);

  // ── State Data ───────────────────────────────────────────────────────────
  const [allSekolah,    setAllSekolah]    = useState<SekolahMarker[]>([]);
  const [smaStats,      setSmaStats]      = useState<any[]>([]);
  const [kabStats,      setKabStats]      = useState<any[]>([]);
  const [sultengGeo,    setSultengGeo]    = useState<any>(null);
  const [loadingData,   setLoadingData]   = useState(true);
  const [loadingGeo,    setLoadingGeo]    = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  // ── State UI ─────────────────────────────────────────────────────────────
  const [selectedSchool,  setSelectedSchool]  = useState<SekolahMarker | null>(null);
  const [filterJenjang,   setFilterJenjang]   = useState<string>("semua");
  const [schoolSearch,    setSchoolSearch]     = useState("");
  const [hoveredJenjang,  setHoveredJenjang]   = useState<string | null>(null);

  // ── Fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      PemetaanService.getStatistikSmaProvinsi(),
      PemetaanService.getStatistikKabupaten(),
      // Fetch semua jenjang provinsi sekaligus
      PemetaanService.getSekolah({ jenjang: "" }),
    ])
      .then(([smaRes, kabRes, sekolahRes]) => {
        setSmaStats(smaRes?.data ?? []);
        setKabStats(kabRes?.data ?? []);
        // Filter hanya jenjang provinsi dari data sekolah
        const filtered = (sekolahRes?.data ?? []).filter((s: SekolahMarker) =>
          JENJANG_PROVINSI.includes(s.bentuk_pendidikan ?? "")
        );
        setAllSekolah(filtered);
      })
      .catch(() => setError("Gagal memuat data. Periksa koneksi ke server."))
      .finally(() => setLoadingData(false));
  }, []);

  // ── Fetch GeoJSON Sulteng ─────────────────────────────────────────────────
  useEffect(() => {
    setLoadingGeo(true);
    fetch("/geojson/sulteng-light.geojson")
      .then((r) => r.json())
      .then(setSultengGeo)
      .catch(() => setSultengGeo(null))
      .finally(() => setLoadingGeo(false));
  }, []);

  // ── Computed: Distribusi per Cabang Dinas ────────────────────────────────
  const cabdisDistribusi = useMemo(() => {
    const map: Record<number, { id: number; nama: string; label: string; color: string; total: number; per_jenjang: Record<string, number> }> = {};

    kabStats.forEach((kab: any) => {
      const cabdis = KODE_TO_CABDIS[String(kab.kode_kabupaten)];
      if (!cabdis) return;

      if (!map[cabdis.id]) {
        map[cabdis.id] = { ...cabdis, total: 0, per_jenjang: {} };
      }
      const total = Number(kab.total_sma_provinsi ?? 0);
      map[cabdis.id].total += total;
    });

    // Hitung per jenjang dari allSekolah
    allSekolah.forEach((s) => {
      const cabdis = KODE_TO_CABDIS[String(s.kode_kabupaten ?? "")];
      if (!cabdis || !map[cabdis.id]) return;
      const j = s.bentuk_pendidikan ?? "";
      map[cabdis.id].per_jenjang[j] = (map[cabdis.id].per_jenjang[j] ?? 0) + 1;
    });

    return Object.values(map).sort((a, b) => a.id - b.id);
  }, [kabStats, allSekolah]);

  // ── Computed: Total Stats ─────────────────────────────────────────────────
  const totalStats = useMemo(() => {
    const map: Record<string, any> = {};
    smaStats.forEach((s: any) => { map[s.bentuk_pendidikan] = s; });
    const total = smaStats.reduce((acc, s) => acc + Number(s.total ?? 0), 0);
    return { total, map };
  }, [smaStats]);

  // ── Computed: Filtered Sekolah ────────────────────────────────────────────
  const filteredSekolah = useMemo(() => {
    let list = selectedSchool
      ? allSekolah.filter((s) =>
          s.npsn === selectedSchool.npsn || (!s.npsn && s.nama === selectedSchool.nama)
        )
      : allSekolah.filter((s) =>
          s.nama?.toLowerCase().includes(schoolSearch.toLowerCase())
        );

    if (filterJenjang !== "semua") {
      list = list.filter((s) => s.bentuk_pendidikan === filterJenjang);
    }
    return list;
  }, [allSekolah, selectedSchool, schoolSearch, filterJenjang]);

  // ── GeoJSON style ─────────────────────────────────────────────────────────
  const sultengStyle = useCallback(() => ({
    color: "#94a3b8",
    weight: 1.2,
    fillColor: "#e2e8f0",
    fillOpacity: 0.5,
  }), []);

  const maxCabdisTotal = useMemo(
    () => Math.max(...cabdisDistribusi.map((c) => c.total), 1),
    [cabdisDistribusi]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 font-poppins text-slate-500">
        <p className="text-lg font-bold">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen font-poppins bg-slate-50 overflow-x-hidden">

      {/* ══ SECTION 1: HERO ══════════════════════════════════════════════════ */}
      <div className="relative w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden">
        {/* Blur blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-6">
            <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
              🏠 Home
            </button>
            <span>›</span>
            <span className="text-purple-300 font-semibold">Portal Provinsi</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="w-16 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center shrink-0 shadow-xl">
              <img
                src="/images/kabupaten_kota.png/Sulawesi Tengah.png"
                alt="Logo Sulteng"
                className="w-12 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-3">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Kewenangan Provinsi Sulawesi Tengah
              </div>
              <h1 className="text-2xl font-black text-white leading-tight mb-1">
                Portal Dinas Pendidikan Provinsi
              </h1>
              <p className="text-slate-300 text-sm font-medium">
                Pengelolaan SMA, MA, SMK, SLB & Sederajat — Seluruh Sulawesi Tengah
              </p>
            </div>

            {/* Tombol kembali */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl px-4 py-2.5 text-sm font-bold transition-all shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* ══ SECTION 2: STAT CARDS ════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-8 -mt-5 relative z-20">
        <div className="grid grid-cols-5 gap-4">

          {/* Total */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[1.5rem] p-5 text-white shadow-xl shadow-indigo-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total</span>
            </div>
            <p className="text-4xl font-black mb-0.5">
              {loadingData ? "..." : totalStats.total.toLocaleString("id-ID")}
            </p>
            <p className="text-xs opacity-75 font-medium">Sekolah Menengah</p>
          </div>

          {/* Per Jenjang */}
          {["SMA", "MA", "SMK", "SLB"].map((j) => {
            const cfg  = JENJANG_CONFIG[j];
            const stat = totalStats.map[j];
            return (
              <div key={j} className="bg-white rounded-[1.5rem] p-5 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: cfg.iconBg, color: cfg.iconColor }}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${cfg.text} ${cfg.bg} px-2 py-0.5 rounded-full`}>
                    {j}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">
                  {loadingData ? "..." : Number(stat?.total ?? 0).toLocaleString("id-ID")}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {Number(stat?.total_negeri ?? 0)}N · {Number(stat?.total_swasta ?? 0)}S
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ SECTION 3: PETA + PANEL KANAN ═══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-8 mt-6">
        <div className="grid grid-cols-3 gap-4" style={{ height: "480px" }}>

          {/* Peta Sulteng — 2/3 lebar */}
          <div className="col-span-2 relative rounded-[1.5rem] overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            {/* Background image */}
            <img
              src="/images/cmd/bc-cmdcenter-bg.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
            />

            {/* Leaflet Map */}
            <div className="absolute inset-0 z-0">
              <MapContainer
                key="map-provinsi"
                center={[-1.8, 121.8]}
                zoom={7.2}
                zoomSnap={0.1}
                minZoom={6}
                maxZoom={11}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                attributionControl={false}
                style={{ width: "100%", height: "100%", background: "transparent" }}
              >
                <SetMapView center={[-1.8, 121.8]} zoom={7.2} mapRef={mapRef} />

                {/* GeoJSON Sulteng */}
                {!loadingGeo && sultengGeo && (
                  <GeoJSON
                    key="sulteng-geo"
                    data={sultengGeo}
                    style={sultengStyle}
                    interactive={false}
                  />
                )}

                {/* Marker sekolah */}
                {!loadingData && allSekolah.map((school, idx) => {
                  const lat = parseFloat(String(school.lintang ?? ""));
                  const lng = parseFloat(String(school.bujur ?? ""));
                  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

                  const jenjang    = school.bentuk_pendidikan ?? "";
                  const isFiltered = filterJenjang !== "semua" && jenjang !== filterJenjang;
                  const icon       = createMarkerIcon(jenjang, isFiltered);
                  const key        = school.npsn ? `m-${school.npsn}-${idx}` : `m-${idx}`;

                  return (
                    <Marker
                      key={key}
                      position={[lat, lng]}
                      icon={icon}
                      eventHandlers={{
                        click: () => {
                          setSelectedSchool(school);
                          setSchoolSearch("");
                        },
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                        <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
                          {school.nama}
                        </span>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
              <button
                onClick={() => mapRef.current?.zoomIn()}
                className="w-8 h-8 bg-white/90 rounded-xl shadow border border-white/60 flex items-center justify-center text-slate-600 font-bold text-base hover:bg-white transition-all"
              >+</button>
              <button
                onClick={() => mapRef.current?.zoomOut()}
                className="w-8 h-8 bg-white/90 rounded-xl shadow border border-white/60 flex items-center justify-center text-slate-600 font-bold text-base hover:bg-white transition-all"
              >−</button>
              <button
                onClick={() => mapRef.current?.setView([-1.8, 121.8], 7.2, { animate: true })}
                className="w-8 h-8 bg-white/90 rounded-xl shadow border border-white/60 flex items-center justify-center text-slate-500 hover:text-blue-600 text-sm hover:bg-white transition-all"
                title="Reset tampilan"
              >⌂</button>
            </div>

            {/* Legend jenjang di peta */}
            <div className="absolute bottom-4 left-4 z-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2.5 shadow border border-white/60 flex flex-wrap gap-x-3 gap-y-1.5 max-w-xs">
                {JENJANG_PROVINSI.filter(j => allSekolah.some(s => s.bentuk_pendidikan === j)).map((j) => {
                  const cfg = JENJANG_CONFIG[j];
                  const isActive = filterJenjang === j;
                  return (
                    <button
                      key={j}
                      onClick={() => setFilterJenjang(filterJenjang === j ? "semua" : j)}
                      onMouseEnter={() => setHoveredJenjang(j)}
                      onMouseLeave={() => setHoveredJenjang(null)}
                      className={`flex items-center gap-1.5 transition-all ${isActive ? "opacity-100 scale-105" : "opacity-80 hover:opacity-100"}`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                        style={{ background: cfg.color }}
                      />
                      <span className="text-[10px] font-bold text-slate-700">{j}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading overlay peta */}
            {(loadingData || loadingGeo) && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl border border-slate-100">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-700">Memuat peta...</span>
                </div>
              </div>
            )}
          </div>

          {/* Panel Kanan — Filter + List sekolah */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Title */}
            <div className="border-l-4 pl-3 border-purple-600 shrink-0">
              <div className="font-bold text-sm text-slate-800">Daftar Sekolah</div>
              <div className="text-xs text-slate-400 font-medium">SMA Sederajat Sulawesi Tengah</div>
            </div>

            {/* Filter jenjang compact */}
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {["semua", ...JENJANG_PROVINSI].map((j) => {
                const cfg = j === "semua" ? null : JENJANG_CONFIG[j];
                const active = filterJenjang === j;
                return (
                  <button
                    key={j}
                    onClick={() => setFilterJenjang(j)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    {j === "semua" ? "Semua" : j}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input
                type="text"
                placeholder={selectedSchool ? "← Lihat Semua untuk cari..." : "Cari nama sekolah..."}
                value={selectedSchool ? "" : schoolSearch}
                disabled={!!selectedSchool}
                onChange={(e) => setSchoolSearch(e.target.value)}
                className={`w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-9 pr-4 text-xs font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm ${
                  selectedSchool ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>

            {/* Counter + reset */}
            <div className="flex items-center justify-between px-1 shrink-0">
              <span className="text-[11px] text-slate-400 font-semibold">
                {selectedSchool
                  ? <span className="text-purple-600 font-bold">1 sekolah dipilih</span>
                  : <span>{filteredSekolah.length} dari {allSekolah.length} sekolah</span>
                }
              </span>
              {selectedSchool && (
                <button
                  onClick={() => { setSelectedSchool(null); setSchoolSearch(""); }}
                  className="text-[10px] font-black text-purple-600 hover:text-purple-800 uppercase tracking-wider transition-colors"
                >
                  ← Lihat Semua
                </button>
              )}
            </div>

            {/* List sekolah */}
            <div className="overflow-y-auto flex flex-col gap-2 scrollbar-hide flex-1">
              {loadingData && (
                <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Memuat...
                </div>
              )}
              {!loadingData && filteredSekolah.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Tidak ada sekolah
                </div>
              )}
              {!loadingData && filteredSekolah.map((school, idx) => {
                const jenjang  = school.bentuk_pendidikan ?? "";
                const cfg      = JENJANG_CONFIG[jenjang];
                const isActive = selectedSchool?.npsn === school.npsn;
                const key      = school.npsn ? `${school.npsn}-${idx}` : `s-${idx}`;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedSchool(school)}
                    className={`bg-white rounded-2xl p-3 border shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] shrink-0 ${
                      isActive ? "border-purple-300 bg-purple-50/50" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: cfg?.iconBg ?? "#f1f5f9", color: cfg?.iconColor ?? "#64748b" }}
                      >
                        <SchoolIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                          {school.nama}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                          {jenjang} · {school.status_sekolah ?? "—"}
                        </p>
                      </div>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: cfg?.color ?? "#6b7280" }}
                      />
                    </div>

                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const lat = parseFloat(String(school.lintang ?? ""));
                          const lng = parseFloat(String(school.bujur ?? ""));
                          if (lat && lng && !isNaN(lat) && !isNaN(lng) && mapRef.current) {
                            mapRef.current.setView([lat, lng], 14, { animate: true });
                            setSelectedSchool(school);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider border border-slate-200 transition-all"
                      >
                        <MapPin className="w-3 h-3" />
                        Lokasi
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (school.npsn) navigate(`/sekolah/${school.npsn}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-wider border border-purple-100 transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SECTION 4: DISTRIBUSI PER CABANG DINAS ═══════════════════════════ */}
      <div className="max-w-7xl mx-auto px-8 mt-8">
        <div className="mb-4">
          <h2 className="text-base font-extrabold text-slate-900">Distribusi per Wilayah Cabang Dinas</h2>
          <p className="text-xs text-slate-500 font-medium">Sebaran SMA sederajat di 6 wilayah kerja</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {cabdisDistribusi.map((cabdis) => {
            const barWidth = Math.round((cabdis.total / maxCabdisTotal) * 100);
            return (
              <div
                key={cabdis.id}
                className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: cabdis.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{cabdis.nama}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{cabdis.label}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-slate-900">{cabdis.total.toLocaleString("id-ID")}</p>
                    <p className="text-[9px] text-slate-400 font-medium">sekolah</p>
                  </div>
                </div>

                {/* Progress bar total */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, background: cabdis.color }}
                  />
                </div>

                {/* Mini breakdown per jenjang */}
                <div className="flex flex-col gap-1.5">
                  {JENJANG_PROVINSI.filter((j) => (cabdis.per_jenjang[j] ?? 0) > 0).map((j) => {
                    const cfg   = JENJANG_CONFIG[j];
                    const count = cabdis.per_jenjang[j] ?? 0;
                    const pct   = Math.round((count / cabdis.total) * 100);
                    return (
                      <div key={j} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 w-8 font-bold">{j}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: cfg.color }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 w-7 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Loading skeleton cabdis */}
          {loadingData && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-md animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-1.5 bg-slate-200 rounded mb-3" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-1.5 bg-slate-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-8 mt-8 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </p>
      </footer>

      <style>{`
        .leaflet-container { background: transparent !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
