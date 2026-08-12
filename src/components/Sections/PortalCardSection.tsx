import React, { useRef } from "react";
import { ChevronRight, ChevronsUpDown, School, Layers, Users } from "lucide-react";

interface PortalDataCardsProps {
  cards?: any;
  gtkStats?: any;
  onViewRegionDetail?: (region: any) => void;
}

// Graduation Cap Icon
const GraduationCapIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

// Shield Crest Logo generator for Palu, Donggala, Sigi, etc.
const RegencyCrestLogo: React.FC<{ name: string; className?: string }> = ({
  name,
  className = "w-10 h-12",
}) => {
  const isPalu = name.includes("Palu");
  const isDonggala = name.includes("Donggala");

  const topColor = isPalu ? "#16A34A" : isDonggala ? "#2563EB" : "#D97706";
  const mainColor = isPalu ? "#F59E0B" : isDonggala ? "#F59E0B" : "#2563EB";

  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5 L90 20 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V20 Z"
        fill={mainColor}
        stroke="#B45309"
        strokeWidth="3"
      />
      <path
        d="M50 10 L84 23 V63 C84 84 50 106 50 106 C50 106 16 84 16 63 V23 Z"
        fill={topColor}
      />
      <polygon
        points="50,25 53,35 63,35 55,41 58,51 50,45 42,51 45,41 37,35 47,35"
        fill="#FACC15"
      />
      <path d="M30 65 C40 55 60 55 70 65 L65 85 C55 90 45 90 35 85 Z" fill="#FFFFFF" opacity="0.9" />
      <text
        x="50"
        y="78"
        fill="#0F172A"
        fontSize="10"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {name.includes("Palu") ? "PALU" : name.includes("Donggala") ? "DONGGALA" : "SULTENG"}
      </text>
    </svg>
  );
};

// 12-13 Regencies & Cities in Central Sulawesi
const REGION_DATA = [
  {
    id: 1,
    name: "Dinas Pendidikan Kota Palu",
    slug: "cabdis-1",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kota Palu.png",
  },
  {
    id: 2,
    name: "Dinas Pendidikan Kab. Donggala",
    slug: "cabdis-2",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Donggala.png",
  },
  {
    id: 3,
    name: "Dinas Pendidikan Kab. Sigi",
    slug: "cabdis-1",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Sigi.png",
  },
  {
    id: 4,
    name: "Dinas Pendidikan Kab. Parigi Moutong",
    slug: "cabdis-2",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Parigi Moutong.png",
  },
  {
    id: 5,
    name: "Dinas Pendidikan Kab. Poso",
    slug: "cabdis-3",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Poso.png",
  },
  {
    id: 6,
    name: "Dinas Pendidikan Kab. Tojo Una-Una",
    slug: "cabdis-3",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Tojo Una-Una.png",
  },
  {
    id: 7,
    name: "Dinas Pendidikan Kab. Morowali",
    slug: "cabdis-4",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Morowali.png",
  },
  {
    id: 8,
    name: "Dinas Pendidikan Kab. Morowali Utara",
    slug: "cabdis-4",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Morowali Utara.png",
  },
  {
    id: 9,
    name: "Dinas Pendidikan Kab. Banggai",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Banggai.png",
  },
  {
    id: 10,
    name: "Dinas Pendidikan Kab. Banggai Kepulauan",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Banggai Kepulauan.png",
  },
  {
    id: 11,
    name: "Dinas Pendidikan Kab. Banggai Laut",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Banggai Laut.png",
  },
  {
    id: 12,
    name: "Dinas Pendidikan Kab. Tolitoli",
    slug: "cabdis-6",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Tolitoli.png",
  },
  {
    id: 13,
    name: "Dinas Pendidikan Kab. Buol",
    slug: "cabdis-6",
    schools: 3000,
    rombel: 3000,
    students: 3000,
    logo: "/images/kabupaten_kota.png/Kabupaten Buol.png",
  },
];

const getRegionLogo = (region: any) => {
  if (region.logo) {
    return region.logo;
  }

  const isKota = region.name.includes("Kota");
  const shortName = region.name
    .replace(/Dinas Pendidikan (Kab\. |Kab\. |Kota )/, "")
    .trim();

  const prefix = isKota ? "Kota" : "Kabupaten";
  return `/images/kabupaten_kota.png/${encodeURIComponent(`${prefix} ${shortName}`)}.png`;
};

export const PortalDataCards: React.FC<PortalDataCardsProps> = ({
  onViewRegionDetail,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.35)] font-poppins sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.10),_transparent_40%)]" />
      {/* Outer Header Section */}
      <div className="mb-4 shrink-0 px-1 text-center">
        <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
          Wilayah
        </div>
        <h3 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-xl">
          Portal Dinas Pendidikan
        </h3>
        <p className="mt-0.5 text-sm font-medium leading-tight text-slate-700 sm:text-base">
          Kabupaten dan Kota Sulawesi Tengah
        </p>
      </div>

      {/* Scrollable Container for 12 Regencies/Cities */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-hide hover:scrollbar-thumb-slate-300 transition-all rounded-[2rem]"
      >
        {REGION_DATA.map((reg) => (
          <div
            key={reg.id}
            className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_-24px_rgba(15,23,42,0.4)]"
          >
            {/* Card Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-100 shadow-sm">
                {getRegionLogo(reg) ? (
                  <img
                    src={getRegionLogo(reg)}
                    alt={`${reg.name} logo`}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <RegencyCrestLogo name={reg.name} className="w-10 h-14" />
                )}
              </div>
              <div className="min-w-0">
                <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-blue-600">
                  Kabupaten / Kota
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                  {reg.name}
                </h4>
              </div>
            </div>

            {/* 3 Stat Cards */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#DCFCE7] text-[#166534] shadow-inner shadow-green-100/60">
                  <School className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Total Sekolah
                  </p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {reg.schools.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[1.4rem] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#DBEAFE] text-[#1D4ED8] shadow-inner shadow-sky-100/60">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Total Rombel
                  </p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {reg.rombel.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[1.4rem] border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEF3C7] text-[#92400E] shadow-inner shadow-amber-100/60">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Total Siswa
                  </p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {reg.students.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (onViewRegionDetail) {
                  onViewRegionDetail(reg);
                } else {
                  window.location.href = `/${reg.slug}?name=${encodeURIComponent(reg.name)}`;
                }
              }}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              <span>Kunjungi</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ))}
      </div>

      {/* Scroll indicator chevrons at bottom */}
      <div className="flex justify-center items-center pt-2 shrink-0 text-slate-400">
        <ChevronsUpDown className="w-5 h-5 animate-bounce" />
      </div>
    </div>
  );
};

