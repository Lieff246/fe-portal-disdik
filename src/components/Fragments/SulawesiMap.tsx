import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, GeoJSON, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import indonesiaGeoData from "@/assets/geojson/indonesia-provinces.json";

// --- PROPS ---
interface MapProps {
  markers?: any[]; // Cabdis stats
  kabupatenStats?: any[];
  onViewDetail?: (marker: any) => void;
  layer?: "base" | "interactive";
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

export const SulawesiMap: React.FC<MapProps> = ({
  markers = [],
  onViewDetail,
  layer = "base",
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

  const baseStyle = (feature: any) => {
    const provinceName =
      feature.properties?.PROVINSI ||
      feature.properties?.name ||
      feature.properties?.propinsi ||
      "";

    if (provinceName.toUpperCase() === "SULAWESI TENGAH") {
      return { fillOpacity: 0, weight: 0 };
    }

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
      color: "#ffffff",
      weight: isHovered ? 3 : 1.5,
      fillColor: isHovered ? "#1e40af" : baseColor,
      fillOpacity: isHovered ? 0.9 : 1,
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

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
      <MapContainer
        center={[-4.1, 121.0]}
        zoom={7.2}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
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
                  onEachFeature={(f, l) => onEachFeature(f, l, cabdisData)}
                />
              );
            })}

            {/* CENTROID MARKERS */}
            {(markers || []).map((m) => (
              <Marker
                key={`marker-${m.id}`}
                position={[m.lat, m.lng]}
                icon={yellowDotIcon}
                eventHandlers={{
                  click: () => {
                    // setActiveMarkerId(m.id);
                    onViewDetail?.(m);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-map-tooltip-simple">
                  <span className="font-bold text-slate-700">{m.name}</span>
                </Tooltip>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      <style>{`
        .leaflet-container { 
          background: transparent !important; 
          pointer-events: ${layer === "interactive" ? "none" : "auto"} !important;
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
