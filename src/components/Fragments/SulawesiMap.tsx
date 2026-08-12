import React, { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, Marker, Tooltip, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

import indonesiaGeoData from "@/assets/geojson/indonesia-provinces.json";

// ─── Props ────────────────────────────────────────────────────────────────────
interface MapProps {
  /** Array statistik per kabupaten dari /v1/statistik/kabupaten atau /v1/portal/landing */
  kabupatenStats?: KabupatenStat[];
  onSchoolClick?: (school: any) => void;
  onPopupClose?: () => void;
  layer?: "base" | "interactive";
  onlyShowId?: number | null;
  schools?: any[];
  customCenter?: [number, number] | null;
  customZoom?: number | null;
  selectedSchool?: any;
  /** @deprecated pakai kabupatenStats */
  markers?: any[];
  /** @deprecated */
  onViewDetail?: (marker: any) => void;
}

interface KabupatenStat {
  kabupaten: string;
  kode_kabupaten: string;
  total_sekolah: number;
  total_negeri?: number;
  total_swasta?: number;
  total_siswa?: number;
  total_3t?: number;
}

// ─── Koordinat sentroid per kabupaten (lat, lng) ──────────────────────────────
// Diverifikasi berdasarkan GeoJSON sulteng.geojson
const KABUPATEN_CENTROIDS: Record<string, { lat: number; lng: number; nama: string; slug: string }> = {
  "7271": { lat: -0.896,  lng: 119.870, nama: "Kota Palu",             slug: "cabdis-1" },
  "7210": { lat: -1.150,  lng: 119.950, nama: "Kab. Sigi",             slug: "cabdis-1" },
  "7203": { lat:  0.300,  lng: 119.750, nama: "Kab. Donggala",         slug: "cabdis-2" },
  "7208": { lat: -0.803917, lng: 120.168472, nama: "Kab. Parigi Moutong", slug: "cabdis-2" },
  "7202": { lat: -1.500,  lng: 120.450, nama: "Kab. Poso",             slug: "cabdis-3" },
  "7209": { lat: -1.300,  lng: 121.600, nama: "Kab. Tojo Una-Una",     slug: "cabdis-3" },
  "7206": { lat: -2.800,  lng: 121.750, nama: "Kab. Morowali",         slug: "cabdis-4" },
  "7212": { lat: -2.100,  lng: 121.150, nama: "Kab. Morowali Utara",   slug: "cabdis-4" },
  "7201": { lat: -1.100,  lng: 122.850, nama: "Kab. Banggai",          slug: "cabdis-5" },
  "7207": { lat: -1.750,  lng: 123.250, nama: "Kab. Banggai Kepulauan",slug: "cabdis-5" },
  "7211": { lat: -2.050,  lng: 123.480, nama: "Kab. Banggai Laut",     slug: "cabdis-5" },
  "7204": { lat:  1.050,  lng: 121.200, nama: "Kab. Tolitoli",         slug: "cabdis-6" },
  "7205": { lat:  0.950,  lng: 121.900, nama: "Kab. Buol",             slug: "cabdis-6" },
};

// ─── Warna per cabdis ─────────────────────────────────────────────────────────
const CABDIS_COLOR: Record<string, string> = {
  "cabdis-1": "#2563eb", // Biru - Palu & Sigi
  "cabdis-2": "#7c3aed", // Ungu - Donggala & Parimo
  "cabdis-3": "#0891b2", // Cyan - Poso & Tojo
  "cabdis-4": "#059669", // Hijau - Morowali
  "cabdis-5": "#d97706", // Amber - Banggai
  "cabdis-6": "#dc2626", // Merah - Tolitoli & Buol
};

// ─── Marker Icon per kabupaten ─────────────────────────────────────────────────
const createKabupatenIcon = (color: string, isActive = false) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        ${isActive ? `<div style="
          position:absolute;
          width:32px; height:32px;
          border-radius:50%;
          background:${color}33;
          animation:ping 1.4s cubic-bezier(0,0,.2,1) infinite;
        "></div>` : ""}
        <div style="
          width:18px; height:18px;
          border-radius:50%;
          background:${color};
          border:3px solid white;
          box-shadow:0 2px 8px ${color}88;
          position:relative;
          z-index:2;
          transition:transform .15s;
        "></div>
      </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });

const schoolNegeriIcon = L.divIcon({
  html: `<div style="background:#2563eb;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>`,
  className: "school-marker-icon",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const schoolSwastaIcon = L.divIcon({
  html: `<div style="background:#10b981;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>`,
  className: "school-marker-icon",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// ─── Sub-component: sinkronisasi center/zoom ──────────────────────────────────
const ChangeMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  const prev = useRef<string>("");
  useEffect(() => {
    const key = `${center[0]},${center[1]},${zoom}`;
    if (key !== prev.current) {
      prev.current = key;
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const SulawesiMap: React.FC<MapProps> = ({
  kabupatenStats = [],
  onSchoolClick,
  onPopupClose,
  layer = "base",
  onlyShowId = null,
  schools = [],
  customCenter = null,
  customZoom = null,
  selectedSchool,
}) => {
  const navigate = useNavigate();
  const [cabdisGeoData, setCabdisGeoData] = useState<Record<number, any>>({});
  const [sultengGeo, setSultengGeo] = useState<any>(null);
  const [activeKode, setActiveKode] = useState<string | null>(null);

  // Load geojson
  useEffect(() => {
    fetch("/geojson/sulteng.geojson")
      .then((r) => r.json())
      .then(setSultengGeo)
      .catch(console.error);

    const loadCabdis = async () => {
      const data: Record<number, any> = {};
      for (let i = 1; i <= 6; i++) {
        try {
          const res = await fetch(`/geojson/cabdis/cabdis${i}.geojson`);
          data[i] = await res.json();
        } catch {/* skip */}
      }
      setCabdisGeoData(data);
    };
    loadCabdis();
  }, []);

  // Build lookup: kode_kabupaten → stat data
  const statByKode = Object.fromEntries(
    kabupatenStats.map((s) => [s.kode_kabupaten, s])
  );

  // Default center Sulawesi Tengah
  const mapCenter: [number, number] = customCenter ?? [-1.4, 121.0];
  const mapZoom = customZoom ?? 7.2;
  const isInteractive = !!onlyShowId;

  // Style peta background Indonesia (abu-abu)
  const baseStyle = () => ({ color: "#fff", weight: 1, fillColor: "#e2e8f0", fillOpacity: 1 });

  // Style kabupaten (warna per cabdis)
  const sultengStyle = (feature: any) => {
    const kode = feature?.properties?.KODE_KAB ?? "";
    const centroid = KABUPATEN_CENTROIDS[kode];
    const color = centroid ? (CABDIS_COLOR[centroid.slug] ?? "#2563eb") : "#2563eb";
    return {
      color: "#fff",
      weight: 1.5,
      fillColor: color,
      fillOpacity: 1,
      className: "sulteng-region",
    };
  };

  // Style cabdis di halaman cabdis (hampir transparan)
  const cabdisStyle = () => ({
    color: "#3b82f6",
    weight: 1.5,
    fillColor: "#3b82f6",
    fillOpacity: 0.08,
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={isInteractive}
        dragging={isInteractive}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ChangeMapView center={mapCenter} zoom={mapZoom} />

        {/* ── BASE LAYER: Peta Indonesia abu-abu ── */}
        {layer === "base" && (
          <GeoJSON
            data={indonesiaGeoData as any}
            style={baseStyle}
            interactive={false}
          />
        )}

        {/* ── INTERACTIVE LAYER ── */}
        {layer === "interactive" && (
          <>
            {/* GeoJSON Indonesia (background) */}
            <GeoJSON
              data={indonesiaGeoData as any}
              style={baseStyle}
              interactive={false}
            />

            {/* GeoJSON Sulawesi Tengah per kabupaten (warna-warni) */}
            {sultengGeo && !onlyShowId && (
              <GeoJSON
                key="sulteng-colored"
                data={sultengGeo}
                style={sultengStyle}
                interactive={false}
              />
            )}

            {/* GeoJSON Cabdis tertentu (untuk halaman cabdis) */}
            {onlyShowId && Object.entries(cabdisGeoData).map(([num, geo]) => {
              if (parseInt(num) !== onlyShowId) return null;
              return (
                <GeoJSON
                  key={`cabdis-${num}`}
                  data={geo}
                  style={cabdisStyle}
                  interactive={false}
                />
              );
            })}

            {/* ── MARKER PER KABUPATEN/KOTA (Dashboard utama) ── */}
            {!onlyShowId && Object.entries(KABUPATEN_CENTROIDS).map(([kode, centroid]) => {
              const stat = statByKode[kode];
              const color = CABDIS_COLOR[centroid.slug] ?? "#2563eb";
              const isActive = activeKode === kode;
              return (
                <Marker
                  key={`kab-${kode}`}
                  position={[centroid.lat, centroid.lng]}
                  icon={createKabupatenIcon(color, isActive)}
                  eventHandlers={{
                    click: () => setActiveKode(kode === activeKode ? null : kode),
                  }}
                  zIndexOffset={isActive ? 1000 : 0}
                >
                  {/* Tooltip: muncul saat hover */}
                  <Tooltip
                    direction="top"
                    offset={[0, -12]}
                    opacity={1}
                    permanent={false}
                    className="kab-tooltip"
                  >
                    <span className="font-bold text-[11px] text-slate-800">
                      {centroid.nama}
                    </span>
                  </Tooltip>

                  {/* Popup: card kabupaten */}
                  <Popup
                    minWidth={220}
                    maxWidth={260}
                    className="kab-popup"
                    eventHandlers={{
                      remove: () => setActiveKode(null),
                    }}
                  >
                    <div className="font-poppins p-1 flex flex-col gap-3 min-w-[210px]">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-sm shadow-lg"
                          style={{ background: color }}
                        >
                          {centroid.nama.replace(/Kab\. |Kota /i, "").charAt(0)}
                        </div>
                        <div>
                          <div
                            className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                            style={{ color }}
                          >
                            Kabupaten / Kota
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs leading-snug">
                            Dinas Pendidikan {centroid.nama}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Total Sekolah
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {(stat?.total_sekolah ?? 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sky-50 border border-sky-100">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Negeri / Swasta
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {stat?.total_negeri ?? 0}
                            <span className="text-slate-400 font-normal"> / </span>
                            {stat?.total_swasta ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Total Siswa
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {(stat?.total_siswa ?? 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* Tombol navigasi */}
                      <button
                        onClick={() => {
                          navigate(
                            `/${centroid.slug}?name=${encodeURIComponent(centroid.nama)}`
                          );
                        }}
                        className="w-full py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                      >
                        Kunjungi Wilayah →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* ── SCHOOL MARKERS (halaman cabdis) ── */}
            {onlyShowId &&
              schools.map((school: any) => {
                const lat = parseFloat(school.latitude ?? school.lintang);
                const lng = parseFloat(school.longitude ?? school.bujur);
                if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
                const isSwasta = school.name?.toUpperCase().includes("SWASTA") ||
                  school.status_sekolah === "Swasta";
                return (
                  <Marker
                    key={school.id ?? school.npsn}
                    position={[lat, lng]}
                    icon={isSwasta ? schoolSwastaIcon : schoolNegeriIcon}
                    eventHandlers={{ click: () => onSchoolClick?.(school) }}
                  >
                    <Tooltip direction="top" offset={[0, -4]}>
                      <span className="font-bold text-[10px] text-slate-800">
                        {school.name ?? school.nama}
                      </span>
                    </Tooltip>
                  </Marker>
                );
              })}

            {/* Popup sekolah yang dipilih */}
            {onlyShowId && selectedSchool && (
              <Popup
                position={[
                  parseFloat(selectedSchool.latitude ?? selectedSchool.lintang),
                  parseFloat(selectedSchool.longitude ?? selectedSchool.bujur),
                ]}
                eventHandlers={{ remove: () => onPopupClose?.() }}
              >
                <div className="px-2 py-1.5 flex flex-col gap-0.5 text-slate-800 font-poppins">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-0.5">
                    Sekolah Aktif
                  </p>
                  <p className="text-xs font-bold uppercase leading-snug">
                    {selectedSchool.name ?? selectedSchool.nama}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                    NPSN: {selectedSchool.npsn ?? "-"}
                  </p>
                </div>
              </Popup>
            )}
          </>
        )}
      </MapContainer>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .leaflet-container {
          background: transparent !important;
          pointer-events: ${
            layer === "base"
              ? "none"
              : layer === "interactive" && !onlyShowId
              ? "auto"
              : "auto"
          } !important;
        }
        .leaflet-popup { pointer-events: auto !important; }
        .kab-tooltip {
          background: white !important;
          border: 1px solid #f1f5f9 !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          font-size: 11px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,.08) !important;
          white-space: nowrap !important;
        }
        .kab-tooltip::before { display: none !important; }
        .kab-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          border: 1px solid rgba(0,0,0,.06) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,.12) !important;
          padding: 0 !important;
        }
        .kab-popup .leaflet-popup-content {
          margin: 12px !important;
        }
        .kab-popup .leaflet-popup-tip-container { display: none !important; }
        .sulteng-region {
          transition: fill-opacity .2s !important;
        }
        .school-marker-icon {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
};
