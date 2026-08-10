import React, { useRef } from "react";
import { ChevronRight, ChevronsUpDown } from "lucide-react";

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
  },
  {
    id: 2,
    name: "Dinas Pendidikan Kab. Donggala",
    slug: "cabdis-2",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 3,
    name: "Dinas Pendidikan Kab. Sigi",
    slug: "cabdis-1",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 4,
    name: "Dinas Pendidikan Kab. Parigi Moutong",
    slug: "cabdis-2",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 5,
    name: "Dinas Pendidikan Kab. Poso",
    slug: "cabdis-3",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 6,
    name: "Dinas Pendidikan Kab. Tojo Una-Una",
    slug: "cabdis-3",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 7,
    name: "Dinas Pendidikan Kab. Morowali",
    slug: "cabdis-4",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 8,
    name: "Dinas Pendidikan Kab. Morowali Utara",
    slug: "cabdis-4",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 9,
    name: "Dinas Pendidikan Kab. Banggai",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 10,
    name: "Dinas Pendidikan Kab. Banggai Kepulauan",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 11,
    name: "Dinas Pendidikan Kab. Banggai Laut",
    slug: "cabdis-5",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 12,
    name: "Dinas Pendidikan Kab. Tolitoli",
    slug: "cabdis-6",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
  {
    id: 13,
    name: "Dinas Pendidikan Kab. Buol",
    slug: "cabdis-6",
    schools: 3000,
    rombel: 3000,
    students: 3000,
  },
];

export const PortalDataCards: React.FC<PortalDataCardsProps> = ({
  onViewRegionDetail,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="glass !bg-[#F1F5F9]/90 rounded-[2.5rem] p-6 sm:p-7 flex flex-col h-[580px] relative overflow-hidden font-poppins shadow-xl border border-white/80">
      {/* Outer Header Section */}
      <div className="text-center flex flex-col items-center mb-4 px-1 shrink-0">
        <h3 className="text-slate-900 font-extrabold text-lg sm:text-xl leading-tight tracking-tight">
          Portal Dinas Pendidikan
        </h3>
        <p className="text-slate-700 font-medium text-sm sm:text-base leading-tight mt-0.5">
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
            className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3.5">
              <RegencyCrestLogo name={reg.name} className="w-10 h-12 shrink-0 drop-shadow-sm" />
              <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                {reg.name}
              </h4>
            </div>

            {/* 3 Item Pills */}
            <div className="w-full flex flex-col gap-3">
              {/* Total Sekolah */}
              <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                    <GraduationCapIcon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 tracking-wide">
                    Total Sekolah
                  </span>
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  {reg.schools.toLocaleString()}
                </span>
              </div>

              {/* Total Rombel */}
              <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                    <GraduationCapIcon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 tracking-wide">
                    Total Rombel
                  </span>
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  {reg.rombel.toLocaleString()}
                </span>
              </div>

              {/* Total Siswa */}
              <div className="bg-[#F3F4F6] hover:bg-slate-200/70 transition-colors rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] text-[#A16207] flex items-center justify-center shrink-0">
                    <GraduationCapIcon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 tracking-wide">
                    Total Siswa
                  </span>
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  {reg.students.toLocaleString()}
                </span>
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
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25 text-sm cursor-pointer mt-1"
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

