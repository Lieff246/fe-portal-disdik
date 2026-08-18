import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft, MapPin, Phone, Mail, Globe, Zap, Wifi,
  Award, Users, BookOpen, Building2, Clock, ShieldCheck,
  TreePine, AlertTriangle, Info, ExternalLink,
} from "lucide-react";
import { PemetaanService } from "@/services/pemetaanService";

// ─── Warna per jenjang (sama dengan KabupatenDetail) ────────────────────────
const JENJANG_COLOR: Record<string, string> = {
  "TK": "#f59e0b", "KB": "#f59e0b", "SPS": "#f59e0b", "TPA": "#f59e0b",
  "RA": "#fb923c",
  "SD": "#10b981", "MI": "#34d399",
  "SMP": "#3b82f6", "MTs": "#60a5fa",
  "SMA": "#8b5cf6", "MA": "#a78bfa",
  "SMK": "#ec4899",
  "SLB": "#ef4444",
  "PKBM": "#6b7280", "SKB": "#6b7280",
};

const getJenjangColor = (j: string) => JENJANG_COLOR[j] ?? "#6b7280";

const getJenjangLabel = (j: string) => {
  const map: Record<string, string> = {
    TK: "Taman Kanak-Kanak", KB: "Kelompok Bermain", SPS: "Satuan PAUD Sejenis",
    TPA: "Taman Penitipan Anak", RA: "Raudhatul Athfal",
    SD: "Sekolah Dasar", MI: "Madrasah Ibtidaiyah",
    SMP: "Sekolah Menengah Pertama", MTs: "Madrasah Tsanawiyah",
    SMA: "Sekolah Menengah Atas", MA: "Madrasah Aliyah",
    SMK: "Sekolah Menengah Kejuruan",
    SLB: "Sekolah Luar Biasa",
    PKBM: "Pusat Kegiatan Belajar Masyarakat", SKB: "Sanggar Kegiatan Belajar",
  };
  return map[j] ?? j;
};

const createMarkerIcon = (jenjang: string) => {
  const color = getJenjangColor(jenjang);
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 0 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

// ─── Komponen set view peta ──────────────────────────────────────────────────
const SetView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom, map]);
  return null;
};

// ─── Badge Akreditasi ─────────────────────────────────────────────────────────
const AkreditasiBadge = ({ nilai }: { nilai: string | null }) => {
  if (!nilai) return <span className="text-slate-300 text-xs font-bold">-</span>;
  const colors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700 border-emerald-200",
    B: "bg-blue-100 text-blue-700 border-blue-200",
    C: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const cls = colors[nilai.toUpperCase()] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`px-2 py-0.5 rounded-lg border text-xs font-black uppercase ${cls}`}>
      {nilai}
    </span>
  );
};

// ─── Info Row ────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, color = "text-slate-400" }: {
  icon: any; label: string; value?: string | number | null; color?: string;
}) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs font-semibold text-slate-700 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, sub }: {
  label: string; value: string | number; color: string; sub?: string;
}) => (
  <div className={`rounded-2xl p-4 border ${color} flex flex-col gap-1`}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="text-2xl font-black text-slate-800 leading-tight">
      {typeof value === "number" ? value.toLocaleString("id-ID") : value}
    </p>
    {sub && <p className="text-[10px] text-slate-400 font-semibold">{sub}</p>}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const SekolahDetail = () => {
  const { npsn } = useParams<{ npsn: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!npsn) return;
    setLoading(true);
    setError(null);
    PemetaanService.getSekolahDetail(npsn)
      .then((res: any) => setData(res?.data ?? null))
      .catch(() => setError("Gagal memuat data sekolah. Periksa koneksi ke server."))
      .finally(() => setLoading(false));
  }, [npsn]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50 font-poppins">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500">Memuat data sekolah...</p>
        </div>
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error || !data) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 font-poppins">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <p className="text-base font-bold text-slate-600">{error ?? "Sekolah tidak ditemukan"}</p>
        <p className="text-xs text-slate-400">NPSN: {npsn}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const jenjang = data.bentuk_pendidikan ?? "";
  const jenjangColor = getJenjangColor(jenjang);
  const lat = parseFloat(String(data.lintang ?? ""));
  const lng = parseFloat(String(data.bujur ?? ""));
  const hasKoordinat = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  const kepsek = data.detailSma?.kepsek ?? null;
  const nip = data.detailSma?.nip_kepsek ?? null;
  const hp = data.detailSma?.no_hp_kepsek ?? null;
  const statusKepsek = data.detailSma?.status_kepsek ?? null;

  // Format alamat lengkap
  const alamatLengkap = [
    data.alamat_jalan,
    data.desa_kelurahan,
    data.kecamatan,
    data.kabupaten,
    data.provinsi,
    data.kode_pos ? `${data.kode_pos}` : null,
  ].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen w-full font-poppins bg-slate-50">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/cmd/bc-cmdcenter-bg.webp"
          alt=""
          className="w-full h-full object-cover opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-2xl bg-white border border-white/80 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Sekolah</p>
            <h1 className="text-lg font-black text-slate-800 leading-tight truncate">{data.nama}</h1>
          </div>
        </div>

        {/* ── HERO CARD ── */}
        <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6 mb-5">
          <div className="flex flex-col sm:flex-row items-start gap-5">

            {/* Avatar jenjang */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: jenjangColor + "20", border: `2px solid ${jenjangColor}40` }}
            >
              <span className="text-xl font-black" style={{ color: jenjangColor }}>
                {jenjang.substring(0, 3)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-800">{data.nama}</h2>
                {data.keaktifan === "1" ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-200 uppercase tracking-wide">
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-lg border border-red-200 uppercase tracking-wide">
                    Tidak Aktif
                  </span>
                )}
                {data.is_3t && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg border border-orange-200 uppercase tracking-wide">
                    3T
                  </span>
                )}
                {data.is_sekolah_alam && (
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-black rounded-lg border border-teal-200 uppercase tracking-wide">
                    Sekolah Alam
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-500 mb-3">
                {getJenjangLabel(jenjang)} · {data.status_sekolah}
              </p>

              {/* Chips info cepat */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                  <div className="w-2 h-2 rounded-full" style={{ background: jenjangColor }} />
                  <span className="text-[11px] font-bold text-slate-600">{jenjang}</span>
                </div>
                {data.npsn && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                    <Info className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">NPSN {data.npsn}</span>
                  </div>
                )}
                {data.akreditasi && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                    <Award className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">Akreditasi</span>
                    <AkreditasiBadge nilai={data.akreditasi} />
                  </div>
                )}
                {data.status_kepemilikan && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">{data.status_kepemilikan}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── GRID UTAMA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── KOLOM KIRI (3/5) ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* MINI MAP */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-black text-slate-700">Lokasi Sekolah</p>
                </div>
                {hasKoordinat && (
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Buka di Maps
                  </a>
                )}
              </div>

              {hasKoordinat ? (
                <div style={{ height: "280px" }}>
                  <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    zoomControl={false}
                    attributionControl={false}
                    scrollWheelZoom={false}
                    dragging={true}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <SetView center={[lat, lng]} zoom={15} />

                    {/* Tile layer OpenStreetMap */}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker
                      position={[lat, lng]}
                      icon={createMarkerIcon(jenjang)}
                    >
                      <Tooltip permanent direction="top" offset={[0, -10]} opacity={1}>
                        <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
                          {data.nama}
                        </span>
                      </Tooltip>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div
                  className="mx-5 mb-5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2"
                  style={{ height: "220px" }}
                >
                  <MapPin className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-400">Koordinat belum tersedia</p>
                  <p className="text-[10px] text-slate-300 font-semibold">NPSN: {npsn}</p>
                </div>
              )}

              {/* Alamat di bawah peta */}
              <div className="px-5 py-4 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    {alamatLengkap || "-"}
                  </p>
                </div>
                {hasKoordinat && (
                  <p className="text-[10px] text-slate-300 font-mono mt-1 ml-5">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            {/* STATISTIK */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-blue-500" />
                <p className="text-sm font-black text-slate-700">Statistik</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  label="Jumlah Siswa"
                  value={data.jumlah_siswa ?? 0}
                  color="bg-blue-50 border-blue-100"
                  sub="peserta didik"
                />
                <StatCard
                  label="Daya Tampung"
                  value={data.daya_tampung ?? 0}
                  color="bg-indigo-50 border-indigo-100"
                  sub="kapasitas"
                />
                <StatCard
                  label="Akreditasi"
                  value={data.akreditasi ?? "—"}
                  color="bg-amber-50 border-amber-100"
                  sub={data.akreditasi ? "peringkat mutu" : "belum terakreditasi"}
                />
                {data.luas_tanah_milik != null && (
                  <StatCard
                    label="Luas Tanah Milik"
                    value={`${Number(data.luas_tanah_milik).toLocaleString("id-ID")} m²`}
                    color="bg-emerald-50 border-emerald-100"
                  />
                )}
                {data.luas_tanah_bukan_milik != null && Number(data.luas_tanah_bukan_milik) > 0 && (
                  <StatCard
                    label="Tanah Bukan Milik"
                    value={`${Number(data.luas_tanah_bukan_milik).toLocaleString("id-ID")} m²`}
                    color="bg-orange-50 border-orange-100"
                  />
                )}
                {data.daya_listrik != null && Number(data.daya_listrik) > 0 && (
                  <StatCard
                    label="Daya Listrik"
                    value={`${Number(data.daya_listrik).toLocaleString("id-ID")} VA`}
                    color="bg-yellow-50 border-yellow-100"
                  />
                )}
              </div>
            </div>

            {/* FASILITAS */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                <p className="text-sm font-black text-slate-700">Fasilitas & Infrastruktur</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={Zap} label="Sumber Listrik" value={data.sumber_listrik} color="text-yellow-500" />
                <InfoRow icon={Wifi} label="Akses Internet" value={data.akses_internet} color="text-blue-500" />
                {data.akses_internet_2 && (
                  <InfoRow icon={Wifi} label="Akses Internet 2" value={data.akses_internet_2} color="text-blue-400" />
                )}
                <InfoRow icon={Clock} label="Waktu Penyelenggaraan" value={data.waktu_penyelenggaraan} color="text-slate-400" />
                <InfoRow icon={ShieldCheck} label="Sertifikasi ISO" value={data.sertifikasi_iso} color="text-emerald-500" />
                <InfoRow icon={BookOpen} label="Partisipasi BOS" value={data.partisipasi_bos === "1" ? "Ya" : data.partisipasi_bos === "0" ? "Tidak" : data.partisipasi_bos} color="text-indigo-500" />
              </div>

              {/* Tags wilayah khusus */}
              {(data.wilayah_terpencil === "1" || data.wilayah_perbatasan === "1" || data.is_3t) && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {data.is_3t && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <AlertTriangle className="w-3 h-3" /> Daerah 3T
                    </span>
                  )}
                  {data.wilayah_terpencil === "1" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <TreePine className="w-3 h-3" /> Wilayah Terpencil
                    </span>
                  )}
                  {data.wilayah_perbatasan === "1" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <AlertTriangle className="w-3 h-3" /> Wilayah Perbatasan
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── KOLOM KANAN (2/5) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* INFO SEKOLAH */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full bg-violet-500" />
                <p className="text-sm font-black text-slate-700">Informasi Sekolah</p>
              </div>
              <InfoRow icon={Info} label="NPSN" value={data.npsn} color="text-blue-500" />
              <InfoRow icon={Info} label="NSS" value={data.nss} color="text-slate-400" />
              <InfoRow icon={Building2} label="Jenjang" value={getJenjangLabel(jenjang)} color="text-violet-500" />
              <InfoRow icon={ShieldCheck} label="Status" value={data.status_sekolah} color="text-emerald-500" />
              <InfoRow icon={Building2} label="Kepemilikan" value={data.status_kepemilikan} color="text-slate-400" />
              {data.yayasan && (
                <InfoRow icon={Building2} label="Yayasan" value={data.yayasan} color="text-indigo-500" />
              )}
              <InfoRow icon={Award} label="Akreditasi" value={data.akreditasi} color="text-amber-500" />
              <InfoRow icon={Info} label="Semester" value={data.semester_id} color="text-slate-400" />
            </div>

            {/* KONTAK */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full bg-blue-500" />
                <p className="text-sm font-black text-slate-700">Kontak</p>
              </div>
              <InfoRow icon={Phone} label="Telepon" value={data.nomor_telepon} color="text-blue-500" />
              <InfoRow icon={Mail} label="Email" value={data.email} color="text-rose-500" />
              {data.website ? (
                <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5 text-indigo-500">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website</p>
                    <a
                      href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline break-all mt-0.5 block"
                    >
                      {data.website}
                    </a>
                  </div>
                </div>
              ) : null}
              {!data.nomor_telepon && !data.email && !data.website && (
                <p className="text-xs text-slate-300 font-semibold text-center py-4">
                  Belum ada data kontak
                </p>
              )}
            </div>

            {/* KEPALA SEKOLAH */}
            {kepsek && (
              <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-rose-500" />
                  <p className="text-sm font-black text-slate-700">Kepala Sekolah</p>
                </div>

                {/* Avatar + nama */}
                <div className="flex items-center gap-3 mb-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 leading-tight">{kepsek}</p>
                    {statusKepsek && (
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                        {statusKepsek}
                      </span>
                    )}
                  </div>
                </div>

                <InfoRow icon={Info} label="NIP" value={nip} color="text-slate-400" />
                <InfoRow icon={Phone} label="No. HP" value={hp} color="text-blue-500" />
              </div>
            )}

            {/* LEGALITAS */}
            {(data.sk_pendirian_sekolah || data.sk_izin_operasional) && (
              <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-amber-500" />
                  <p className="text-sm font-black text-slate-700">Legalitas</p>
                </div>
                <InfoRow icon={ShieldCheck} label="SK Pendirian" value={data.sk_pendirian_sekolah} color="text-amber-500" />
                <InfoRow icon={Info} label="Tanggal SK Pendirian" value={data.tanggal_sk_pendirian ? new Date(data.tanggal_sk_pendirian).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : null} color="text-slate-400" />
                <InfoRow icon={ShieldCheck} label="SK Izin Operasional" value={data.sk_izin_operasional} color="text-amber-500" />
                <InfoRow icon={Info} label="Tanggal SK Izin" value={data.tanggal_sk_izin_operasional ? new Date(data.tanggal_sk_izin_operasional).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : null} color="text-slate-400" />
              </div>
            )}

          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-semibold">
            NPSN {npsn} · Data bersumber dari Dapodik · Portal Pemetaan Pendidikan Sulteng
          </p>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .leaflet-container { background: #f1f5f9 !important; }
      `}</style>
    </div>
  );
};
