import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import indonesiaGeoData from "@/assets/geojson/indonesia-provinces.json";

// --- PROPS ---
interface MapProps {
  markers?: any[]; // Cabdis stats
  kabupatenStats?: any[];
  onViewDetail?: (marker: any) => void;
}

// --- COLOR SCALE (Tailwind Reds) ---
const RANK_COLORS = [
  "#7f1d1d", // Red 900 (Highest Priority)
  "#991b1b", // Red 800
  "#b91c1c", // Red 700
  "#dc2626", // Red 600
  "#ef4444", // Red 500
  "#f87171", // Red 400
];

export const SulawesiMap: React.FC<MapProps> = ({
  markers = [],
  onViewDetail,
}) => {
  const [cabdisGeoData, setCabdisGeoData] = useState<Record<number, any>>({});
  const [hoveredCabdis, setHoveredCabdis] = useState<string | null>(null);

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
    const sorted = [...markers].sort(
      (a, b) => (b.stats?.kekurangan || 0) - (a.stats?.kekurangan || 0),
    );
    const ranks: Record<string, number> = {};
    sorted.forEach((item, index) => {
      ranks[item.name.toUpperCase()] = index;
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
        : "#cbd5e1";

    return {
      color: "#ffffff",
      weight: isHovered ? 3 : 1.5,
      fillColor: baseColor,
      fillOpacity: isHovered ? 0.8 : 1,
      className: "transition-all duration-300",
    };
  };

  const onEachFeature = (feature: any, layer: any, cabdisData: any) => {
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
        onViewDetail?.(cabdisData);
      },
    });

    const regencyName =
      feature.properties?.NAMOBJ ||
      feature.properties?.name ||
      feature.properties?.KABKOT ||
      "Wilayah Kerja";

    layer.bindTooltip(
      `
      <div class="px-3 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">${cabdisData.name}</p>
        <h5 class="text-sm font-black text-slate-800">${regencyName}</h5>
        <div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
          <span class="text-[10px] font-black text-rose-500">Kekurangan: ${cabdisData.stats.kekurangan}</span>
          <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
          <span class="text-[10px] font-black text-slate-400">Klik Detail</span>
        </div>
      </div>
    `,
      { sticky: true, className: "custom-map-tooltip" },
    );
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
      <MapContainer
        center={[-1.4, 121.0]}
        zoom={7.2}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <GeoJSON data={indonesiaGeoData as any} style={baseStyle} />

        {Object.entries(cabdisGeoData).map(([num, geo]) => {
          const cabdisName = `CABANG DINAS WILAYAH ${num}`;
          const cabdisData = markers.find(
            (m) => m.name.toUpperCase() === cabdisName,
          );

          return (
            <GeoJSON
              key={`cabdis-${num}-${markers.length}-${hoveredCabdis === cabdisName}`}
              data={geo}
              style={() => getCabdisStyle(cabdisName)}
              onEachFeature={(f, l) => onEachFeature(f, l, cabdisData)}
            />
          );
        })}
      </MapContainer>

      <style>{`
        .leaflet-container { background: transparent !important; }
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-map-tooltip::before { display: none !important; }
        .leaflet-interactive { 
          cursor: pointer !important; 
          transition: fill-opacity 0.3s, stroke-width 0.3s !important;
        }
      `}</style>
    </div>
  );
};
