import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, GeoJSON, Marker, Tooltip, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CABANG_DATA } from "@/types";

import indonesiaGeoData from "@/assets/geojson/indonesia-provinces.json";

// --- PROPS ---
interface MapProps {
  markers?: any[]; // Cabdis stats
  kabupatenStats?: any[];
  onViewDetail?: (marker: any) => void;
  onSchoolClick?: (school: any) => void;
  onPopupClose?: () => void;
  layer?: "base" | "interactive";
  onlyShowId?: number | null;
  interactive?: boolean;
  schools?: any[];
  customCenter?: [number, number] | null;
  customZoom?: number | null;
  selectedSchool?: any;
}

// --- ICONS ---
const yellowDotIcon = L.divIcon({
  className: "custom-marker-dot",
  html: `<div class="marker-container">
    <div class="marker-core bg-amber-400 border-2 border-amber-600"></div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const schoolNegeriIcon = L.divIcon({
  html: `<div class="school-marker-core negeri" style="background-color: #2563eb; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  className: "school-marker-icon",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const schoolSwastaIcon = L.divIcon({
  html: `<div class="school-marker-core swasta" style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  className: "school-marker-icon",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});


// --- COLOR SCALE ---
const RANK_COLORS = [
  "#2563eb",
  "#2563eb",
  "#2563eb",
  "#2563eb",
  "#2563eb",
  "#2563eb",
];

const thisToRoman = (num: any) => {
  const map: Record<string, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
  };
  return map[num] || num;
};

// Component to handle map bounds focusing dynamically when center or zoom changes
const ChangeMapView = ({
  center,
  zoom,
  selectedSchool,
}: {
  center: [number, number];
  zoom: number;
  selectedSchool?: any;
}) => {
  const map = useMap();
  useEffect(() => {
    if (selectedSchool && selectedSchool.latitude && selectedSchool.longitude) {
      map.panTo([parseFloat(selectedSchool.latitude), parseFloat(selectedSchool.longitude)], {
        animate: true,
        duration: 1.0,
      });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, selectedSchool, map]);
  return null;
};

export const SulawesiMap: React.FC<MapProps> = ({
  markers = [],
  onViewDetail,
  onSchoolClick,
  onPopupClose,
  layer = "base",
  onlyShowId = null,
  interactive = false,
  schools = [],
  customCenter = null,
  customZoom = null,
  selectedSchool,
}) => {
  const [cabdisGeoData, setCabdisGeoData] = useState<Record<number, any>>({});
  const [hoveredCabdis, setHoveredCabdis] = useState<string | null>(null);
  // const [setActiveMarkerId] = useState<string | number | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      const data: Record<number, any> = {};
      for (let i = 1; i <= 6; i++) {
        try {
          const res = await fetch(`/geojson/cabdis/cabdis${i}.geojson`);
          data[i] = await res.json();
        } catch (err) {
          console.error(`Failed to load cabdis${i}.geojson:`, err);
        }
      }
      setCabdisGeoData(data);
    };
    loadGeoData();
  }, []);

  const cabdisRanks = useMemo(() => {
    const sorted = [...(markers || [])].sort(
      (a, b) => (b.stats?.kekurangan || 0) - (a.stats?.kekurangan || 0),
    );
    const ranks: Record<string, number> = {};
    sorted.forEach((item, index) => {
      ranks[item.name?.toUpperCase()] = index;
    });
    return ranks;
  }, [markers]);

  const baseStyle = () => {

    return {
      color: "#ffffff",
      weight: 1.5,
      fillColor: "#e2e8f0",
      fillOpacity: 1,
    };
  };

  const getCabdisStyle = (cabdisName: string) => {
    const rank = cabdisRanks[cabdisName.toUpperCase()];
    const isHovered = hoveredCabdis === cabdisName;
    const baseColor =
      rank !== undefined
          ? RANK_COLORS[rank] || RANK_COLORS[RANK_COLORS.length - 1]
          : "#2563eb";

    return {
      color: onlyShowId ? "#3b82f6" : "#ffffff",
      weight: onlyShowId ? 1.5 : (isHovered ? 3 : 1.5),
      fillColor: onlyShowId ? "#3b82f6" : (isHovered ? "#1e40af" : baseColor),
      fillOpacity: onlyShowId ? 0.08 : (isHovered ? 0.9 : 1),
      className: "transition-all duration-300",
    };
  };

  const onEachFeature = (feature: any, layer: any, cabdisData: any) => {
    console.log(feature);
    if (!cabdisData) return;
    layer.on({
      mouseover: (e: any) => {
        setHoveredCabdis(cabdisData.name);
        const l = e.target;
        l.setStyle({
          weight: 3,
          fillOpacity: 0.8,
        });
      },
      mouseout: (e: any) => {
        setHoveredCabdis(null);
        const l = e.target;
        l.setStyle(getCabdisStyle(cabdisData.name));
      },
      click: () => {
        // setActiveMarkerId(cabdisData.id);
        onViewDetail?.(cabdisData);
      },
    });

    layer.bindTooltip(
      `
      <div class="px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100">
        <p class="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-0.5">Wilayah Kerja</p>
        <p class="text-sm font-bold text-slate-800">${cabdisData.name}</p>
        <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
           <div class="flex flex-col">
              <span class="text-[9px] text-slate-400 uppercase font-bold">Guru</span>
              <span class="text-xs font-black text-slate-700">${cabdisData.stats?.teachers || 0}</span>
           </div>
           <div class="flex flex-col text-right">
              <span class="text-[9px] text-slate-400 uppercase font-bold">Sekolah</span>
              <span class="text-xs font-black text-slate-700">${cabdisData.stats?.schools || 0}</span>
           </div>
        </div>
      </div>
    `,
      { sticky: true, className: "custom-map-tooltip" },
    );
  };

  const selectedConfig = onlyShowId ? CABANG_DATA.find((c) => c.id === onlyShowId) : null;
  const mapCenter = customCenter || (selectedConfig ? selectedConfig.mapCenter as [number, number] : [-4.1, 121.0] as [number, number]);
  const mapZoom = customZoom || (selectedConfig ? selectedConfig.mapZoom : 7.2);
  const isInteractive = !!onlyShowId || interactive;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={isInteractive}
        dragging={isInteractive}
        scrollWheelZoom={onlyShowId ? false : isInteractive}
        doubleClickZoom={isInteractive}
        boxZoom={isInteractive}
        attributionControl={false}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ChangeMapView center={mapCenter} zoom={mapZoom} selectedSchool={selectedSchool} />
        {layer === "base" && (
          <GeoJSON
            data={indonesiaGeoData as any}
            style={baseStyle}
            interactive={false}
          />
        )}

        {layer === "interactive" && (
          <>
            {Object.entries(cabdisGeoData).map(([num, geo]) => {
              const numericNum = parseInt(num, 10);
              if (onlyShowId && onlyShowId !== numericNum) {
                return null;
              }
              const cabdisName = `CABANG DINAS WILAYAH ${num}`;
              const cabdisData = (markers || []).find(
                (m) =>
                  m.name?.toUpperCase() === cabdisName ||
                  m.name?.toUpperCase().includes(`WILAYAH ${num}`) ||
                  m.name?.toUpperCase().includes(`WILAYAH ${thisToRoman(num)}`),
              );

              return (
                <GeoJSON
                  key={`cabdis-${num}-${(markers || []).length}`}
                  data={geo}
                  style={() => getCabdisStyle(cabdisName)}
                  interactive={!onlyShowId}
                  onEachFeature={(f, l) => {
                    if (!onlyShowId) {
                      onEachFeature(f, l, cabdisData);
                    }
                  }}
                />
              );
            })}

            {/* CENTROID MARKERS (Only draw if not showing specific region) */}
            {(!onlyShowId) && (markers || []).map((m) => (
              <Marker
                key={`marker-${m.id}`}
                position={[m.lat, m.lng]}
                icon={yellowDotIcon}
                eventHandlers={{
                  click: () => {
                    onViewDetail?.(m);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-map-tooltip-simple">
                  <span className="font-bold text-slate-700">{m.name}</span>
                </Tooltip>
              </Marker>
            ))}

            {/* SCHOOL MARKERS (Only draw in regional view) */}
            {onlyShowId && schools && schools.map((school: any) => {
              if (!school.latitude || !school.longitude) return null;
              const isSwasta = school.name?.toUpperCase().includes("SWASTA");
              return (
                <Marker
                  key={school.id}
                  position={[parseFloat(school.latitude), parseFloat(school.longitude)]}
                  icon={isSwasta ? schoolSwastaIcon : schoolNegeriIcon}
                  interactive={true}
                  eventHandlers={{
                    click: () => {
                      onSchoolClick?.(school);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -5]}>
                    <span className="font-bold text-[10px] text-slate-800 uppercase">{school.name}</span>
                  </Tooltip>
                </Marker>
              );
            })}

            {/* Active Selected School Popup */}
            {onlyShowId && selectedSchool && selectedSchool.latitude && selectedSchool.longitude && (
              <Popup
                position={[parseFloat(selectedSchool.latitude), parseFloat(selectedSchool.longitude)]}
                eventHandlers={{
                  remove: () => {
                    if (onPopupClose) onPopupClose();
                  }
                }}
              >
                <div className="px-2 py-1.5 flex flex-col gap-0.5 text-slate-800">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-0.5">Sekolah Aktif</p>
                  <p className="text-xs font-bold uppercase leading-snug">{selectedSchool.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">NPSN: {selectedSchool.npsn || "-"}</p>
                </div>
              </Popup>
            )}
          </>
        )}
      </MapContainer>

      <style>{`
        .leaflet-container { 
          background: transparent !important; 
          pointer-events: ${layer === "base" ? "none" : (layer === "interactive" && !onlyShowId ? "none" : "auto")} !important;
        }
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-map-tooltip-simple {
          background: white !important;
          border: 1px solid #f1f5f9 !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          font-size: 10px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }
        .custom-map-tooltip::before, .custom-map-tooltip-simple::before { display: none !important; }
        .leaflet-interactive { 
          pointer-events: auto !important;
          cursor: pointer !important; 
          transition: fill-opacity 0.3s, stroke-width 0.3s !important;
        }

        /* SCHOOL MARKER ANIMATIONS & INTERACTION */
        .school-marker-icon {
          cursor: pointer !important;
          pointer-events: auto !important;
        }
        .school-marker-core {
          transition: transform 0.2s ease-in-out, filter 0.2s !important;
        }
        .school-marker-icon:hover .school-marker-core {
          transform: scale(1.35) !important;
          filter: brightness(1.1) !important;
          z-index: 1000 !important;
        }

        /* STATIC MARKER STYLE */
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-core {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
