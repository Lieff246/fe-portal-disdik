import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, School, Users } from "lucide-react";
import { PemetaanService } from "@/services/pemetaanService";
import type { StatistikKabupatenItem } from "@/types";

const KABUPATEN_INFO: Record<string, {
  nama: string;
  slug: string;
  cabdis: string;
  color: string;
}> = {
  "7271": { nama: "Kota Palu",              slug: "cabdis-1", cabdis: "Cabdis 1",  color: "#3b82f6" },
  "7210": { nama: "Kab. Sigi",              slug: "cabdis-1", cabdis: "Cabdis 1",  color: "#06b6d4" },
  "7203": { nama: "Kab. Donggala",          slug: "cabdis-2", cabdis: "Cabdis 2",  color: "#10b981" },
  "7208": { nama: "Kab. Parigi Moutong",    slug: "cabdis-2", cabdis: "Cabdis 2",  color: "#84cc16" },
  "7202": { nama: "Kab. Poso",              slug: "cabdis-3", cabdis: "Cabdis 3",  color: "#f59e0b" },
  "7209": { nama: "Kab. Tojo Una-Una",      slug: "cabdis-3", cabdis: "Cabdis 3",  color: "#fb923c" },
  "7206": { nama: "Kab. Morowali",          slug: "cabdis-4", cabdis: "Cabdis 4",  color: "#ef4444" },
  "7212": { nama: "Kab. Morowali Utara",    slug: "cabdis-4", cabdis: "Cabdis 4",  color: "#e11d48" },
  "7201": { nama: "Kab. Banggai",           slug: "cabdis-5", cabdis: "Cabdis 5",  color: "#8b5cf6" },
  "7207": { nama: "Kab. Banggai Kepulauan", slug: "cabdis-5", cabdis: "Cabdis 5",  color: "#a855f7" },
  "7211": { nama: "Kab. Banggai Laut",      slug: "cabdis-5", cabdis: "Cabdis 5",  color: "#d946ef" },
  "7204": { nama: "Kab. Tolitoli",          slug: "cabdis-6", cabdis: "Cabdis 6",  color: "#ec4899" },
  "7205": { nama: "Kab. Buol",              slug: "cabdis-6", cabdis: "Cabdis 6",  color: "#f97316" },
};

export const KabupatenKota = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatistikKabupatenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    PemetaanService.getStatistikKabupaten()
      .then((res) => setStats(res.data ?? []))
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  const getStats = (kode: string): StatistikKabupatenItem | undefined =>
    stats.find((s) => String(s.kode_kabupaten) === kode);

  const filtered = Object.entries(KABUPATEN_INFO).filter(([, info]) =>
    info.nama.toLowerCase().includes(search.toLowerCase())
  );

  const totalSekolah = stats.reduce((acc, s) => acc + (s.total_sekolah ?? 0), 0);
  const totalSiswa   = stats.reduce((acc, s) => acc + (s.total_siswa   ?? 0), 0);

  return (
    <div className="min-h-screen font-poppins bg-slate-50 relative overflow-x-hidden">
      {/* Background */}
      <img
        src="/images/cmd/bc-cmdcenter-bg.webp"
        alt=""
        className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Kabupaten / Kota</h1>
            <p className="text-xs text-slate-400 font-medium">Provinsi Sulawesi Tengah — {Object.keys(KABUPATEN_INFO).length} Wilayah</p>
          </div>
          <img src="/logo.png" alt="Logo" className="ml-auto h-10 opacity-80" />
        </div>

        {/* ── Summary Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Wilayah",  value: Object.keys(KABUPATEN_INFO).length, suffix: "Kab/Kota", color: "#3b82f6" },
            { label: "Total Sekolah",  value: loading ? "..." : totalSekolah.toLocaleString("id"), suffix: "Sekolah", color: "#10b981" },
            { label: "Total Siswa",    value: loading ? "..." : totalSiswa.toLocaleString("id"),   suffix: "Siswa",   color: "#f59e0b" },
            { label: "Cabang Dinas",   value: 6,                                                    suffix: "Cabdis",  color: "#8b5cf6" },
          ].map((card) => (
            <div key={card.label} className="glass-card rounded-2xl p-5 border border-white/70 shadow-md flex flex-col gap-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
              <div className="text-2xl font-black" style={{ color: card.color }}>{card.value}</div>
              <div className="text-[11px] text-slate-400 font-semibold">{card.suffix}</div>
            </div>
          ))}
        </div>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <input
          type="text"
          placeholder="Cari kabupaten / kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />

        {/* ── Grid Kabupaten ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(([kode, info]) => {
              const stat = getStats(kode);
              return (
                <button
                  key={kode}
                  onClick={() => navigate(`/kabupaten/${kode}`)}
                  className="glass-card rounded-2xl p-5 border border-white/70 shadow-md text-left flex flex-col gap-4 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group"
                >
                  {/* Top: warna + nama */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: info.color + "20", color: info.color }}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                          {info.nama}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: info.color + "15", color: info.color }}
                        >
                          {info.cabdis}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                      style={{ background: info.color }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <School className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Sekolah</span>
                      </div>
                      <p className="text-base font-black text-slate-700">
                        {stat?.total_sekolah?.toLocaleString("id") ?? "—"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Siswa</span>
                      </div>
                      <p className="text-base font-black text-slate-700">
                        {stat?.total_siswa?.toLocaleString("id") ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Kode */}
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                    Kode: {kode}
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <p className="col-span-full text-center text-sm text-slate-400 font-bold py-16 uppercase tracking-widest">
                Kabupaten tidak ditemukan
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-300 pb-4">
          &copy; 2026 BLPT - Dinas Pendidikan Provinsi Sulawesi Tengah
        </p>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};
