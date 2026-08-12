import React, { useRef, useEffect, useState } from "react";
import { ChevronRight, ChevronsUpDown, School, Layers, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PemetaanService } from "@/services/pemetaanService";

interface PortalDataCardsProps {
  cards?: any[];          // Data dari /v1/portal/landing → data.cards
  onViewRegionDetail?: (region: any) => void;
}

// Pemetaan kode_kabupaten → slug cabdis
// Sesuai dengan data CabangDinasSeeder di backend
const KODE_KAB_TO_CABDIS: Record<string, string> = {
  "7271": "cabdis-1", // Kota Palu
  "7210": "cabdis-1", // Kab. Sigi
  "7203": "cabdis-2", // Kab. Donggala
  "7208": "cabdis-2", // Kab. Parigi Moutong
  "7202": "cabdis-3", // Kab. Poso
  "7209": "cabdis-3", // Kab. Tojo Una-Una
  "7206": "cabdis-4", // Kab. Morowali
  "7212": "cabdis-4", // Kab. Morowali Utara
  "7201": "cabdis-5", // Kab. Banggai
  "7207": "cabdis-5", // Kab. Banggai Kepulauan
  "7211": "cabdis-5", // Kab. Banggai Laut
  "7204": "cabdis-6", // Kab. Tolitoli
  "7205": "cabdis-6", // Kab. Buol
};

const getRegionLogo = (kabupaten: string) => {
  // Normalise: "Kota Palu" → "Kota Palu", "Kab. Donggala" → "Kabupaten Donggala"
  const isKota = kabupaten.toLowerCase().startsWith("kota");
  const name = kabupaten.replace(/^Kab\.\s*/i, "").replace(/^Kota\s*/i, "").trim();
  const prefix = isKota ? "Kota" : "Kabupaten";
  return `/images/kabupaten_kota.png/${encodeURIComponent(`${prefix} ${name}`)}.png`;
};

export const PortalDataCards: React.FC<PortalDataCardsProps> = ({
  cards = [],
  onViewRegionDetail,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Kalau cards dari landing kosong / belum tersedia, fetch statistik kabupaten
  const [statCards, setStatCards] = useState<any[]>([]);
  const [loadingStat, setLoadingStat] = useState(false);

  useEffect(() => {
    if (cards && cards.length > 0) {
      setStatCards(cards);
      return;
    }
    // Fallback: fetch dari /v1/statistik/kabupaten
    setLoadingStat(true);
    PemetaanService.getStatistikKabupaten()
      .then((res) => {
        if (res?.data) setStatCards(res.data);
      })
      .catch(console.error)
      .finally(() => setLoadingStat(false));
  }, [cards]);

  const handleKunjungi = (item: any) => {
    const slug = KODE_KAB_TO_CABDIS[item.kode_kabupaten] ?? "cabdis-1";
    if (onViewRegionDetail) {
      onViewRegionDetail({ ...item, slug });
    } else {
      navigate(`/${slug}?name=${encodeURIComponent(item.kabupaten ?? item.nama ?? "")}`);
    }
  };

  return (
    <div className="relative flex h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.35)] font-poppins sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.10),_transparent_40%)]" />

      {/* Header */}
      <div className="mb-4 shrink-0 px-1 text-center">
        <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
          Wilayah
        </div>
        <h3 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-xl">
          Portal Dinas Pendidikan
        </h3>
        <p className="mt-0.5 text-sm font-medium leading-tight text-slate-700">
          Kabupaten dan Kota Sulawesi Tengah
        </p>
      </div>

      {/* Left badge: Provinsi */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 bg-white/90 border border-slate-100 rounded-[2rem] p-5 shadow-xl z-10 w-44">
        <div className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Provinsi</div>
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-white">
          <img src="/logo.png" alt="Logo Sulteng" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="font-extrabold text-slate-900 text-xs text-center leading-snug">Portal Dinas Pendidikan</div>
          <div className="text-[10px] text-slate-500 text-center mt-0.5">Provinsi Sulawesi Tengah</div>
        </div>
        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest text-center mt-1">Ringkasan</div>
        <div className="w-full text-xs font-bold text-slate-700 text-center">Pengelolaan Provinsi (SMA, SMK, SLB)</div>
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-hide rounded-[2rem]"
      >
        {loadingStat && (
          <div className="py-10 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
            Memuat data...
          </div>
        )}

        {!loadingStat && statCards.length === 0 && (
          <div className="py-10 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
            Data belum tersedia
          </div>
        )}

        {statCards.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_-24px_rgba(15,23,42,0.4)]"
          >
            {/* Card Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-100 shadow-sm">
                <img
                  src={getRegionLogo(item.kabupaten ?? item.nama ?? "")}
                  alt={item.kabupaten}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-blue-600">
                  Kabupaten / Kota
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                  Dinas Pendidikan {item.kabupaten ?? item.nama}
                </h4>
              </div>
            </div>

            {/* Stat cards */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 rounded-[1.4rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#DCFCE7] text-[#166534] shadow-inner">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Total Sekolah</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {(item.total_sekolah ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[1.4rem] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#DBEAFE] text-[#1D4ED8] shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Negeri / Swasta</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {(item.total_negeri ?? 0).toLocaleString("id-ID")}
                    <span className="text-slate-400 font-medium text-sm"> / </span>
                    {(item.total_swasta ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[1.4rem] border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-3 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEF3C7] text-[#92400E] shadow-inner">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Total Siswa</p>
                  <p className="mt-1 text-base font-extrabold text-slate-900">
                    {(item.total_siswa ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol navigasi */}
            <button
              onClick={() => handleKunjungi(item)}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
              <span>Kunjungi</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center items-center pt-2 shrink-0 text-slate-400">
        <ChevronsUpDown className="w-5 h-5 animate-bounce" />
      </div>
    </div>
  );
};
