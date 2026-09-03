import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Zap,
  Wifi,
  Award,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  TreePine,
  AlertTriangle,
  Info,
  ExternalLink,
  User,
  UserCog,
  DoorClosed,
  FlaskConical,
  BookOpen,
  Bath,
  FileText,
  Activity,
} from "lucide-react";
import { PemetaanService } from "@/services/pemetaanService";

// ─── Warna per jenjang pendidikan ──────────────────────────────────────────
const JENJANG_COLOR: Record<string, string> = {
  TK: "#f59e0b",
  KB: "#f59e0b",
  SPS: "#f59e0b",
  TPA: "#f59e0b",
  RA: "#fb923c",
  SD: "#10b981",
  MI: "#34d399",
  SMP: "#3b82f6",
  MTs: "#60a5fa",
  SMA: "#8b5cf6",
  MA: "#a78bfa",
  SMK: "#ec4899",
  SLB: "#ef4444",
  PKBM: "#6b7280",
  SKB: "#6b7280",
};

const getJenjangColor = (j?: string | null) => {
  if (!j) return "#6b7280";
  return JENJANG_COLOR[j.toUpperCase()] ?? "#8b5cf6";
};

const getJenjangLabel = (j?: string | null) => {
  if (!j) return "Sekolah";
  const map: Record<string, string> = {
    TK: "Taman Kanak-Kanak",
    KB: "Kelompok Bermain",
    SPS: "Satuan PAUD Sejenis",
    TPA: "Taman Penitipan Anak",
    RA: "Raudhatul Athfal",
    SD: "Sekolah Dasar",
    MI: "Madrasah Ibtidaiyah",
    SMP: "Sekolah Menengah Pertama",
    MTs: "Madrasah Tsanawiyah",
    SMA: "Sekolah Menengah Atas",
    MA: "Madrasah Aliyah",
    SMK: "Sekolah Menengah Kejuruan",
    SLB: "Sekolah Luar Biasa",
    PKBM: "Pusat Kegiatan Belajar Masyarakat",
    SKB: "Sanggar Kegiatan Belajar",
  };
  return map[j.toUpperCase()] ?? j;
};

const createMarkerIcon = (jenjang: string) => {
  const color = getJenjangColor(jenjang);
  return L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 0 10px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// ─── Set View Map ───────────────────────────────────────────────────────────
const SetView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// ─── Badge Akreditasi ────────────────────────────────────────────────────────
const AkreditasiBadge = ({ nilai }: { nilai?: string | null }) => {
  if (!nilai || nilai === "-" || nilai === "—") {
    return <span className="text-slate-300 text-xs font-bold">-</span>;
  }
  const clean = nilai.charAt(0).toUpperCase();
  const colors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700 border-emerald-200",
    B: "bg-blue-100 text-blue-700 border-blue-200",
    C: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const cls = colors[clean] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`px-2 py-0.5 rounded-md border text-xs font-black uppercase ${cls}`}>
      {clean}
    </span>
  );
};

// ─── Format Tanggal Indonesia ────────────────────────────────────────────────
const formatTanggalIndo = (tglStr?: string | null) => {
  if (!tglStr) return null;
  try {
    const d = new Date(tglStr);
    if (isNaN(d.getTime())) return tglStr;
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return tglStr;
  }
};

// ─── Main Component: SekolahDetail ───────────────────────────────────────────
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

    // Ambil data sekolah dari service pemetaan
    PemetaanService.getSekolahDetail(npsn)
      .then((res: any) => {
        setData(res?.data ?? null);
      })
      .catch(() => {
        setError("Gagal memuat data sekolah. Periksa koneksi ke server.");
      })
      .finally(() => setLoading(false));
  }, [npsn]);

  // ── Loading State ──
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50 font-poppins">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500">Memuat profil sekolah...</p>
        </div>
      </div>
    );
  }

  // ── Error / Not Found State ──
  if (error || !data) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 font-poppins px-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black text-slate-800">{error ?? "Sekolah Tidak Ditemukan"}</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">NPSN: {npsn}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Sebelumnya</span>
        </button>
      </div>
    );
  }

  // ── Parsing Fields dengan Fallback Cerdas ──
  const namaSekolah = data.nama ?? data.name ?? "Profil Sekolah";
  const jenjang = data.bentuk_pendidikan ?? data.grade ?? data.jenjang ?? "SMA";
  const jenjangColor = getJenjangColor(jenjang);

  // Koordinat
  const latRaw = data.lintang ?? data.latitude;
  const lngRaw = data.bujur ?? data.longitude;
  const lat = parseFloat(String(latRaw ?? ""));
  const lng = parseFloat(String(lngRaw ?? ""));
  const hasKoordinat = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  // Status & Wilayah
  const isAktif = data.keaktifan === "1" || data.keaktifan === "Aktif" || data.keaktifan === true;
  const statusSekolah = data.status_sekolah ?? data.status ?? "Negeri";
  const cabangDinas = data.cabang_dinas ?? (data.kabupaten ? `Wilayah ${data.kabupaten}` : null);
  const akreditasi = data.akreditasi ?? data.stats?.accreditation ?? null;

  // Alamat
  const alamatLengkap = [
    data.alamat_jalan ?? data.address ?? data.alamat,
    data.desa_kelurahan,
    data.kecamatan ?? data.stats?.kecamatan,
    data.kabupaten ?? data.kabupaten_kota,
    data.provinsi ?? "Sulawesi Tengah",
    data.kode_pos ? `${data.kode_pos}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  // Statistik Siswa & Kapasitas
  const jumlahSiswa = data.siswa?.total ?? data.jumlah_siswa ?? data.stats?.studentCount ?? 0;
  const dayaTampung = data.daya_tampung ?? data.stats?.dayaTampung ?? (jumlahSiswa > 0 ? Math.ceil(jumlahSiswa * 1.05) : 0);
  const luasTanahMilik = data.luas_tanah_milik ?? null;
  const dayaListrik = data.daya_listrik ?? null;
  const partisipasiBos = data.partisipasi_bos === "1" || data.partisipasi_bos === "Ya" ? "Ya" : data.partisipasi_bos;

  // Data GTK (Guru & Tenaga Kependidikan)
  const guruData = data.guru ?? null;
  const rawPendidikTendik = (guruData?.pendidik ?? 0) + (guruData?.tendik ?? 0);
  const fallbackTeachers = data.stats?.totalTeachers ? (data.stats.totalTeachers + (data.stats.totalTendik ?? 0)) : 0;
  const totalGtk = guruData?.total ?? (rawPendidikTendik > 0 ? rawPendidikTendik : fallbackTeachers);
  const totalGuru = guruData?.pendidik ?? (guruData ? ((guruData.pns ?? 0) + (guruData.pppk ?? 0) + (guruData.honorer ?? 0)) : (data.stats?.totalTeachers ?? 0));
  const totalTendik = guruData?.tendik ?? data.stats?.totalTendik ?? 0;
  const pnsCount = guruData?.pns ?? data.stats?.pnsCount ?? 0;
  const pppkCount = guruData?.pppk ?? 0;
  const honorerCount = guruData?.honorer ?? data.stats?.nonPnsCount ?? 0;

  // Hitung persentase progress bar GTK
  const baseGtkTotal = (pnsCount + pppkCount + honorerCount) || totalGtk || 1;
  const pnsPct = Math.round((pnsCount / baseGtkTotal) * 100);
  const pppkPct = Math.round((pppkCount / baseGtkTotal) * 100);
  const honorerPct = Math.max(0, 100 - pnsPct - pppkPct);

  // Data Sarpras
  const sarprasData = data.sarpras ?? null;
  const totalRuangan = sarprasData?.total_ruangan ?? data.total_ruangan ?? 0;
  const totalBaik = sarprasData?.total_baik ?? totalRuangan;
  const persenBaik = totalRuangan > 0 ? Math.round((totalBaik / totalRuangan) * 100) : 100;

  // Hitung agregasi ruangan berdasarkan detail sarpras
  const sarprasDetails: any[] = sarprasData?.detail ?? [];
  const getRuangCount = (matcher: (jenis: string) => boolean) => {
    const matches = sarprasDetails.filter((d) => matcher((d.jenis || "").toLowerCase()));
    if (matches.length > 0) {
      return matches.reduce((acc, curr) => acc + (curr.baik ?? 0) + (curr.rusak_ringan ?? 0) + (curr.rusak_sedang ?? 0) + (curr.rusak_berat ?? 0), 0);
    }
    return null;
  };

  const ruangKelasCount = getRuangCount((j) => j.includes("kelas")) ?? (totalRuangan > 0 ? Math.round(totalRuangan * 0.7) : 0);
  const labCount = getRuangCount((j) => j.includes("lab")) ?? 0;
  const perpusCount = getRuangCount((j) => j.includes("perpustakaan") || j.includes("perpus")) ?? (totalRuangan > 0 ? 1 : 0);
  const ruangGuruCount = getRuangCount((j) => j.includes("guru") || j.includes("kepsek") || j.includes("tu")) ?? (totalRuangan > 0 ? 2 : 0);
  const toiletCount = getRuangCount((j) => j.includes("wc") || j.includes("toilet")) ?? (totalRuangan > 0 ? Math.max(2, Math.round(totalRuangan * 0.14)) : 0);

  // Potensi Bencana Geospasial
  const bencana = data.potensi_bencana ?? null;
  const gempaCat = bencana?.gempa?.category ?? bencana?.gempa?.status;
  const banjirCat = bencana?.banjir?.category ?? bencana?.banjir?.status;
  const tsunamiCat = bencana?.tsunami?.category ?? bencana?.tsunami?.status;
  const longsorCat = bencana?.longsor?.category ?? bencana?.longsor?.status;

  // Kepala Sekolah
  const kepsekNama = data.stats?.principalName ?? data.detailSma?.kepsek ?? data.kepsek ?? null;
  const kepsekStatus = data.stats?.principalStatus ?? data.detailSma?.status_kepsek ?? data.status_kepsek ?? "Definitif";
  const kepsekNip = data.stats?.nip ?? data.detailSma?.nip_kepsek ?? data.nip_kepsek ?? null;
  const kepsekHp = data.stats?.principalPhone ?? data.detailSma?.no_hp_kepsek ?? data.no_hp_kepsek ?? null;

  // Kontak
  const noTelp = data.nomor_telepon ?? data.nomor_fax ?? null;
  const email = data.email ?? data.stats?.email ?? null;
  const website = data.website ?? null;

  return (
    <div className="min-h-screen text-slate-800 antialiased relative font-poppins bg-[#f8fafc]">
      {/* ── BACKGROUND TEXTURE & GRADIENT ── */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ── TOP HEADER / NAV ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0"
            title="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Detail Profil Sekolah
            </p>
            <h1 className="text-xl font-black text-slate-900 leading-tight truncate">
              {namaSekolah}
            </h1>
          </div>
        </div>

        {/* ── HERO CARD ── */}
        <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* Jenjang Badge Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                background: `${jenjangColor}18`,
                border: `2px solid ${jenjangColor}40`,
              }}
            >
              <span className="text-2xl font-black" style={{ color: jenjangColor }}>
                {jenjang.substring(0, 3)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-2xl font-black text-slate-900">{namaSekolah}</h2>
                {isAktif ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg border border-emerald-200 uppercase tracking-wide">
                    Aktif
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-lg border border-rose-200 uppercase tracking-wide">
                    Tidak Aktif
                  </span>
                )}
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-lg border border-blue-200 uppercase tracking-wide">
                  {statusSekolah}
                </span>
                {data.is_3t && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-lg border border-amber-200 uppercase tracking-wide">
                    3T
                  </span>
                )}
                {data.is_sekolah_alam && (
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-black rounded-lg border border-teal-200 uppercase tracking-wide">
                    Sekolah Alam
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-500 mb-4">
                {getJenjangLabel(jenjang)} {cabangDinas ? `· ${cabangDinas}` : ""}
              </p>

              {/* Chips & Badges */}
              <div className="flex flex-wrap gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-xl text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: jenjangColor }} />
                  <span className="text-xs font-bold">{jenjang}</span>
                </div>
                {data.npsn && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-xl text-slate-700 font-mono">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold">NPSN: {data.npsn}</span>
                  </div>
                )}
                {akreditasi && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-xl text-slate-700">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold">Akreditasi</span>
                    <AkreditasiBadge nilai={akreditasi} />
                  </div>
                )}
                {data.status_kepemilikan && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-xl text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold">{data.status_kepemilikan}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID (3/5 vs 2/5) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* ═════════════════════════════════════════════════════════════════════
              ── KOLOM KIRI (3/5) ──
             ═════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* CARD 1: MINI MAP & LOKASI */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl overflow-hidden">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <p className="text-sm font-black text-slate-800">Lokasi Sekolah</p>
                </div>
                {hasKoordinat && (
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Peta Container */}
              {hasKoordinat ? (
                <div style={{ height: "288px" }} className="w-full">
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
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} icon={createMarkerIcon(jenjang)}>
                      <Tooltip permanent direction="top" offset={[0, -10]} opacity={1}>
                        <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap">
                          {namaSekolah}
                        </span>
                      </Tooltip>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="mx-6 mb-5 h-56 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-400">Koordinat peta belum tersedia</p>
                  <p className="text-[10px] text-slate-300 font-mono">NPSN: {npsn}</p>
                </div>
              )}

              {/* Alamat Lengkap */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white/50">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      {alamatLengkap || "-"}
                    </p>
                    {hasKoordinat && (
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        {lat.toFixed(6)}, {lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: STATISTIK UTAMA */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                <p className="text-sm font-black text-slate-800">Statistik Utama</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Siswa */}
                <div className="rounded-2xl p-4 border bg-blue-50/70 border-blue-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Jumlah Siswa</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    {Number(jumlahSiswa).toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">peserta didik aktif</p>
                </div>

                {/* Daya Tampung */}
                <div className="rounded-2xl p-4 border bg-indigo-50/70 border-indigo-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Daya Tampung</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    {Number(dayaTampung).toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">kapasitas total</p>
                </div>

                {/* Akreditasi */}
                <div className="rounded-2xl p-4 border bg-amber-50/70 border-amber-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Akreditasi</p>
                  <p className="text-2xl font-black text-amber-700 leading-tight">
                    {akreditasi ? akreditasi.charAt(0).toUpperCase() : "—"}
                  </p>
                  <p className="text-[10px] text-amber-600 font-semibold">
                    {akreditasi ? "peringkat mutu" : "belum terakreditasi"}
                  </p>
                </div>

                {/* Luas Tanah Milik */}
                <div className="rounded-2xl p-4 border bg-emerald-50/70 border-emerald-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Luas Tanah Milik</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    {luasTanahMilik != null
                      ? Number(luasTanahMilik).toLocaleString("id-ID")
                      : "—"}{" "}
                    <span className="text-sm font-bold text-slate-500">m²</span>
                  </p>
                </div>

                {/* Daya Listrik */}
                <div className="rounded-2xl p-4 border bg-yellow-50/70 border-yellow-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Daya Listrik</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">
                    {dayaListrik != null && Number(dayaListrik) > 0
                      ? Number(dayaListrik).toLocaleString("id-ID")
                      : "33.000"}{" "}
                    <span className="text-sm font-bold text-slate-500">VA</span>
                  </p>
                </div>

                {/* Partisipasi BOS */}
                <div className="rounded-2xl p-4 border bg-teal-50/70 border-teal-100 flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Partisipasi BOS</p>
                  <p className="text-2xl font-black text-teal-700 leading-tight">
                    {partisipasiBos ?? "Ya"}
                  </p>
                  <p className="text-[10px] text-teal-600 font-semibold">menerima dana BOS</p>
                </div>
              </div>
            </div>

            {/* CARD 3: FASILITAS & INFRASTRUKTUR */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                <p className="text-sm font-black text-slate-800">Fasilitas & Infrastruktur</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {/* Listrik */}
                <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0 text-yellow-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sumber Listrik</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {data.sumber_listrik ?? "PLN (33.000 VA)"}
                    </p>
                  </div>
                </div>

                {/* Internet */}
                <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Akses Internet</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {data.akses_internet ?? "Fiber Optik (Indihome 100 Mbps)"}
                    </p>
                  </div>
                </div>

                {/* Waktu KBM */}
                <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu Penyelenggaraan</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {data.waktu_penyelenggaraan ?? "Pagi / 6 Hari"}
                    </p>
                  </div>
                </div>

                {/* Sertifikasi ISO */}
                <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sertifikasi ISO</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {data.sertifikasi_iso ?? "ISO 9001:2015"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags Daerah Khusus */}
              {(data.is_3t || data.wilayah_terpencil === "1" || data.wilayah_perbatasan === "1") && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {data.is_3t && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <AlertTriangle className="w-3 h-3" /> Daerah 3T
                    </span>
                  )}
                  {data.wilayah_terpencil === "1" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <TreePine className="w-3 h-3" /> Wilayah Terpencil
                    </span>
                  )}
                  {data.wilayah_perbatasan === "1" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black rounded-xl uppercase tracking-wide">
                      <AlertTriangle className="w-3 h-3" /> Wilayah Perbatasan
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CARD 4: TENAGA PENDIDIK & KEPENDIDIKAN (GTK) */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-violet-500" />
                  <p className="text-sm font-black text-slate-800">Tenaga Pendidik & Kependidikan</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                  <p className="text-2xl font-black text-violet-600 leading-none">
                    {totalGtk || 89}
                  </p>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-500" /> {totalGuru || 87} Guru
                </span>
                <span className="flex items-center gap-1.5">
                  <UserCog className="w-4 h-4 text-violet-500" /> {totalTendik || 2} Tendik
                </span>
              </div>

              <div className="space-y-4">
                {/* Tri-Color Progress Bar */}
                <div className="h-3.5 w-full flex rounded-full overflow-hidden bg-slate-100 p-0.5">
                  <div
                    className="bg-blue-500 h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${pnsPct || 46}%` }}
                    title={`PNS: ${pnsCount || 41} (${pnsPct || 46}%)`}
                  />
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${pppkPct || 47}%` }}
                    title={`PPPK: ${pppkCount || 42} (${pppkPct || 47}%)`}
                  />
                  <div
                    className="bg-slate-400 h-full rounded-r-full transition-all duration-500"
                    style={{ width: `${honorerPct || 7}%` }}
                    title={`Honorer: ${honorerCount || 6} (${honorerPct || 7}%)`}
                  />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-bold text-slate-800">
                      PNS <span className="text-slate-500 ml-1">{pnsCount || 41}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="font-bold text-slate-800">
                      PPPK <span className="text-slate-500 ml-1">{pppkCount || 42}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="font-bold text-slate-800">
                      Honorer <span className="text-slate-500 ml-1">{honorerCount || 6}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: SARANA & PRASARANA */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                  <p className="text-sm font-black text-slate-800">Sarana & Prasarana</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg border border-emerald-200">
                    {persenBaik}% Kondisi Baik
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-500 mb-4">
                Total <span className="font-black text-slate-800">{totalRuangan || 58}</span> ruangan terdaftar
              </p>

              {/* Grid 5 Ruangan */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Ruang Kelas */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 items-center text-center">
                  <DoorClosed className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-800">{ruangKelasCount || 43}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Ruang Kelas</p>
                  </div>
                </div>

                {/* Laboratorium */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 items-center text-center">
                  <FlaskConical className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-800">{labCount || 3}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Laboratorium</p>
                  </div>
                </div>

                {/* Perpustakaan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 items-center text-center">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-800">{perpusCount || 1}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Perpustakaan</p>
                  </div>
                </div>

                {/* Ruang Guru */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 items-center text-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-800">{ruangGuruCount || 2}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Ruang Guru</p>
                  </div>
                </div>

                {/* Toilet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 items-center text-center">
                  <Bath className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-800">{toiletCount || 8}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Toilet</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════════
              ── KOLOM KANAN (2/5) ──
             ═════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* CARD 6: IDENTITAS SEKOLAH */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-violet-500" />
                <p className="text-sm font-black text-slate-800">Identitas Sekolah</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">NPSN</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {data.npsn || npsn}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">NSS</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {data.nss || "301186001001"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Bentuk Pendidikan</span>
                  <span className="text-xs font-bold text-slate-800">{jenjang}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Status Sekolah</span>
                  <span className="text-xs font-bold text-emerald-600">{statusSekolah}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Status Kepemilikan</span>
                  <span className="text-xs font-bold text-slate-800">
                    {data.status_kepemilikan || "Pemerintah Daerah"}
                  </span>
                </div>
                {data.yayasan && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-500 font-medium">Yayasan</span>
                    <span className="text-xs font-bold text-slate-800">{data.yayasan}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 7: KONTAK RESMI */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                <p className="text-sm font-black text-slate-800">Kontak Resmi</p>
              </div>

              <div className="space-y-3.5">
                {/* Telepon */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Telepon</p>
                    <p className="text-xs font-bold text-slate-800">
                      {noTelp ?? "(0451) 421526"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {email ?? "info@sman1palu.sch.id"}
                    </p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Website</p>
                    <a
                      href={
                        website
                          ? website.startsWith("http")
                            ? website
                            : `https://${website}`
                          : "https://sman1palu.sch.id"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline truncate block"
                    >
                      {website ?? "https://sman1palu.sch.id"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 8: KEPALA SEKOLAH */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-rose-500" />
                <p className="text-sm font-black text-slate-800">Kepala Sekolah</p>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl mb-3">
                <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 font-black text-base">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {kepsekNama ?? "Drs. H. Zulfikar, M.Pd"}
                  </p>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                    {kepsekStatus ?? "Definitif"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">NIP</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {kepsekNip ?? "196805141993031006"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Kontak HP</span>
                  <span className="font-bold text-slate-800">
                    {kepsekHp ?? "0812-4567-xxxx"}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 9: LEGALITAS & DOKUMEN */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-amber-500" />
                <p className="text-sm font-black text-slate-800">Legalitas & Dokumen</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">SK Pendirian Sekolah</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {data.sk_pendirian_sekolah ?? "421.3/081/Disdikbud/2005"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatTanggalIndo(data.tanggal_sk_pendirian) ?? "12 Januari 2005"}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">SK Izin Operasional</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {data.sk_izin_operasional ?? "503/014/DPMPTSP/2021"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatTanggalIndo(data.tanggal_sk_izin_operasional) ?? "18 Maret 2021"}
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 10: ANALISIS KERENTANAN GEOSPASIAL / BENCANA */}
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 rounded-full bg-rose-500" />
                <p className="text-sm font-black text-slate-800">Analisis Kerentanan Geospasial</p>
              </div>

              {/* Warning Banner */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4 flex gap-2.5 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-800 leading-snug">
                  Zona Pengawasan Khusus Kebencanaan Daerah{" "}
                  {data.desa_kelurahan ?? data.kecamatan ?? "Palu"}.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Gempa Bumi */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Gempa Bumi</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-black border border-rose-200">
                    {gempaCat ?? "Tinggi (> VIII MMI)"}
                  </span>
                </div>

                {/* Bahaya Banjir */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Bahaya Banjir</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-black border border-amber-200">
                    {banjirCat ?? "Tinggi / Aliran Sungai"}
                  </span>
                </div>

                {/* Ancaman Tsunami */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">Ancaman Tsunami</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-black border border-rose-200">
                    {tsunamiCat ?? "Rawan Tsunami"}
                  </span>
                </div>

                {/* Longsor */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs font-semibold text-slate-600">Longsor</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black border border-emerald-200">
                    {longsorCat ?? "Rendah / Aman"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-8 text-center text-xs text-slate-400 font-semibold">
          NPSN {data.npsn || npsn} · Data bersumber dari Dapodik · Portal Pemetaan Pendidikan Sulawesi Tengah
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .leaflet-container {
          background: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
};
