import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Download, Eye, Play, Star, Mail, Phone,
  ChevronRight, Calendar, Bell,
  Clock, ArrowLeft, FileText, BookOpen,
  Video as VideoIcon, Home, Newspaper, Users, Archive,
  Library, Zap, CheckCircle, Info, Globe2, Link2, Share2
} from "lucide-react";

// ─── Deterministic Data Generator ────────────────────────────────────────────
const getDeterministicData = (schoolId: string, schoolName: string) => {
  let hash = 0;
  const idStr = String(schoolId || schoolName || "");
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const principalNames = [
    "Drs. H. Ahmad Fauzi, M.Pd.", "Dr. I Wayan Sudarta, S.Pd., M.Si.",
    "Siti Rahmawati, S.Pd., M.Pd.", "Hendra Wijaya, S.T., M.Kom.",
    "Ni Made Lestari, M.Pd.", "Drs. Syarifuddin, M.Si.",
  ];
  const kecamatanList = [
    "Palu Timur", "Palu Barat", "Palu Selatan", "Palu Utara",
    "Donggala", "Sigi Biromaru", "Banawa",
  ];

  const studentCount = 350 + (hash % 650);
  const totalTeachers = 15 + (hash % 45);
  const pnsCount = Math.round(totalTeachers * (50 + (hash % 35)) / 100);
  const npsn = `${69000000 + (hash % 999999)}`;
  const accreditation = ["A", "B", "A"][hash % 3];

  return {
    principalName: principalNames[hash % principalNames.length],
    kecamatan: kecamatanList[hash % kecamatanList.length],
    studentCount,
    totalTeachers,
    pnsCount,
    nonPnsCount: totalTeachers - pnsCount,
    npsn,
    accreditation,
    rombelCount: Math.round(studentCount / 32),
    email: `admin.${schoolName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12)}@sch.id`,
    phone: `0451-${2000 + (hash % 8000)}-${100 + (hash % 900)}`,
    address: `Jl. Pendidikan No. ${1 + (hash % 100)}, ${kecamatanList[hash % kecamatanList.length]}, Sulawesi Tengah`,
  };
};

// ─── Types ────────────────────────────────────────────────────────────────────
type PageType = "beranda" | "berita" | "video" | "perpustakaan" | "fasilitas" | "guru-siswa" | "arsip";

// ─── Navigation Items ─────────────────────────────────────────────────────────
const navItems: { id: PageType; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "berita", label: "Berita & Pengumuman", icon: Newspaper },
  { id: "video", label: "Video", icon: VideoIcon },
  { id: "guru-siswa", label: "Guru & Siswa", icon: Users },
  { id: "fasilitas", label: "Fasilitas", icon: Zap },
  { id: "arsip", label: "Arsip", icon: Archive },
  { id: "perpustakaan", label: "Perpustakaan", icon: Library },
];

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const SchoolLandingSekolahku = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const schoolName = queryParams.get("name") || `SMA Negeri (ID: ${id})`;
  const gradeType = schoolName.toUpperCase().includes("SMK") ? "SMK"
    : schoolName.toUpperCase().includes("SLB") ? "SLB" : "SMA";
  const d = getDeterministicData(id || "1", schoolName);

  const [activePage, setActivePage] = useState<PageType>("beranda");
  const [bookQuery, setBookQuery] = useState("");
  const [bookCategory, setBookCategory] = useState<"IPA" | "IPS" | "Bahasa">("IPA");
  const [selectedBook, setSelectedBook] = useState(0);
  const [newsFilter, setNewsFilter] = useState<"Umum" | "Sekolah">("Umum");
  const [videoFilter, setVideoFilter] = useState<"Sekolah" | "Umum">("Sekolah");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  // ── Data dumps ────────────────────────────────────────────────────────────
  const books = {
    IPA: [
      { id: 0, title: "Buku Matematika Kelas 12", rating: 3.5, cover: "📘", desc: "Buku ini mencakup materi dasar seperti trigonometri, fungsi, kalkulus, dan matematika diskrit", downloads: "2.4rb" },
      { id: 1, title: "Buku Fisika Kelas 10", rating: 3, cover: "📗", desc: "Materi fisika dasar mencakup kinematika, dinamika, dan termodinamika untuk kelas 10.", downloads: "1.8rb" },
      { id: 2, title: "Buku Biologi Kelas 10", rating: 3, cover: "📙", desc: "Biologi kelas 10 mencakup sel, jaringan, ekosistem, dan keanekaragaman hayati.", downloads: "1.2rb" },
    ],
    IPS: [
      { id: 0, title: "Buku Ekonomi Kelas 11", rating: 4, cover: "📒", desc: "Mencakup teori ekonomi mikro dan makro, pasar, dan kebijakan moneter fiskal.", downloads: "900" },
      { id: 1, title: "Buku Geografi Kelas 10", rating: 3, cover: "📔", desc: "Geografi fisik dan manusia, peta, SIG, serta fenomena geosfer.", downloads: "750" },
      { id: 2, title: "Buku Sosiologi Kelas 12", rating: 3.5, cover: "📓", desc: "Struktur sosial, perubahan sosial, konflik, dan integrasi sosial.", downloads: "680" },
    ],
    Bahasa: [
      { id: 0, title: "Bahasa Indonesia Kelas 12", rating: 4, cover: "📕", desc: "Teks argumentasi, debat, puisi, dan karya tulis ilmiah untuk kelas 12.", downloads: "1.5rb" },
      { id: 1, title: "Bahasa Inggris Kelas 11", rating: 3.5, cover: "📖", desc: "Grammar, reading comprehension, writing, dan percakapan formal bahasa Inggris.", downloads: "1.1rb" },
    ],
  };

  const relatedBooks = [
    { title: "Buku Kimia Kelas 12", cover: "🧪", rating: 3 },
    { title: "Buku Fisika Kelas 12", cover: "⚡", rating: 3 },
    { title: "Buku Biologi Kelas 12", cover: "🌿", rating: 3 },
    { title: "Buku Geografi Kelas 12", cover: "🌍", rating: 3 },
    { title: "Buku Bahasa Indonesia", cover: "📝", rating: 3 },
    { title: "Buku Biologi Kelas 12", cover: "🔬", rating: 3 },
  ];

  const newsItems = [
    {
      tag: "Berita Terbaru", tagColor: "#3b82f6",
      img: "🎨",
      title: "Lestarikan Keragaman Budaya Nusantara, Eversac Gelar Lomba Desain Tas Berhadiah",
      time: "10.00 WIta", date: "Kamis, 1 Desember 2022", read: "Baca Selengkapnya",
      category: "Umum" as const,
    },
    {
      tag: "Pendidikan", tagColor: "#8b5cf6",
      img: "📚",
      title: "Perkuat Pendidikan Karakter Kemendikbudristek Gelar PUSAKA 2022",
      time: "10.00 WIta", date: "Kamis, 1 Desember 2022", read: "Baca Selengkapnya",
      category: "Umum" as const,
    },
    {
      tag: "Guru", tagColor: "#10b981",
      img: "👩‍🏫",
      title: "Pendidikan Guru Penggerak Angkatan Empat, 7.948 Guru Dinyatakan Lulus",
      time: "10.00 WIta", date: "Kamis, 1 Desember 2022", read: "Baca Selengkapnya",
      category: "Umum" as const,
    },
    {
      tag: "Statistik", tagColor: "#f59e0b",
      img: "📊",
      title: "IKPK Kemendikbudristek Tahun 2022 Meningkat Menjadi 85,9",
      time: "10.00 WIta", date: "Kamis, 1 Desember 2022", read: "Baca Selengkapnya",
      category: "Umum" as const,
    },
    {
      tag: "Prestasi", tagColor: "#ef4444",
      img: "🏆",
      title: `${schoolName} Raih Juara I Olimpiade Sains Tingkat Provinsi 2022`,
      time: "09.00 WIta", date: "Senin, 28 Nov 2022", read: "Baca Selengkapnya",
      category: "Sekolah" as const,
    },
    {
      tag: "PPDB", tagColor: "#06b6d4",
      img: "📋",
      title: "Jadwal dan Syarat PPDB Online Tahun Ajaran 2023/2024",
      time: "08.00 WIta", date: "Jumat, 25 Nov 2022", read: "Baca Selengkapnya",
      category: "Sekolah" as const,
    },
  ];

  const announcements = [
    { img: "📢", title: "Pengumuman Pendidikan Guru Penggerak Angkatan Empat 2022", time: "15.00 wita", date: "25-11-2022" },
    { img: "🎓", title: "Pengumuman Pembukaan Pendaftaran Beasiswa 2023", time: "15.00 wita", date: "25-11-2022" },
    { img: "💰", title: "Pendaftaran Beasiswa Prioritas untuk guru se-sulawesi tengah", time: "15.00 wita", date: "25-11-2022" },
    { img: "🔬", title: "Pendaftaran Peserta Olimpiade Sains Tingkat Provinsi Tahun 2022", time: "15.00 wita", date: "25-11-2022" },
  ];

  const videos = [
    { title: `Hari Pendidikan Nasional Tahun 2022 ${schoolName}`, duration: "10:00", views: "15rb", time: "1 Hari yang lalu", thumb: "🎓", category: "Sekolah" as const },
    { title: "Launching Panduan Lalu Lintas Mata Pelajaran...", duration: "20:40", views: "15rb", time: "1 Hari yang lalu", thumb: "📡", category: "Umum" as const },
    { title: "Webinar Implementasi Kurikulum Merdeka...", duration: "08:40", views: "15rb", time: "1 Hari yang lalu", thumb: "💻", category: "Umum" as const },
    { title: "Lomba Menyanyi Peringatan Hari Guru Nasional", duration: "30:40", views: "15rb", time: "1 Hari yang lalu", thumb: "🎵", category: "Sekolah" as const },
    { title: "Kampanye Keselamatan Lalu Lintas Angkatan Jalan", duration: "25:00", views: "15rb", time: "1 Hari yang lalu", thumb: "🚦", category: "Umum" as const },
    { title: "Kemahan Jumat s/d Sabtu Perjusa 2022", duration: "20:00", views: "15rb", time: "1 Hari yang lalu", thumb: "⛺", category: "Sekolah" as const },
    { title: "Story Telling D'bestien Competition", duration: "1:00:40", views: "15rb", time: "1 Hari yang lalu", thumb: "🎭", category: "Sekolah" as const },
    { title: "After Movie - SMA Indonesia Charity Concert 2018", duration: "15:40", views: "15rb", time: "1 Hari yang lalu", thumb: "🎬", category: "Umum" as const },
    { title: "LKPS (Latihan Kepemimpinan Siswa) Tahun 2022", duration: "22:40", views: "15rb", time: "1 Hari yang lalu", thumb: "🤝", category: "Sekolah" as const },
  ];

  const facilities = [
    { icon: "🔬", title: "Laboratorium IPA", desc: "Lab biologi, kimia, dan fisika dengan peralatan lengkap dan modern untuk praktikum siswa.", files: ["Inventaris Lab 2023", "SOP Penggunaan Lab"] },
    { icon: "💻", title: "Laboratorium Komputer", desc: "40 unit komputer berkoneksi internet fiber optik 1 Gbps untuk kegiatan belajar digital.", files: ["Jadwal Lab Komputer", "Tata Tertib Lab"] },
    { icon: "📚", title: "Perpustakaan", desc: "Koleksi lebih dari 5.000 judul buku pelajaran, referensi, dan bacaan umum siswa.", files: ["Katalog Buku 2023"] },
    { icon: "⚽", title: "Lapangan Olahraga", desc: "Lapangan basket, voli, dan futsal yang representatif untuk kegiatan olahraga siswa.", files: ["Jadwal Penggunaan Lapangan"] },
    { icon: "🎨", title: "Ruang Seni & Budaya", desc: "Fasilitas studio seni rupa, teater, dan musik untuk pengembangan bakat siswa.", files: ["Jadwal Studio Seni"] },
    { icon: "🏥", title: "Ruang UKS", desc: "Unit Kesehatan Sekolah dengan tenaga medis dan perlengkapan P3K lengkap.", files: ["SOP UKS"] },
  ];

  const activeBooks = books[bookCategory];
  const currentBook = activeBooks[selectedBook] ?? activeBooks[0];
  const filteredNews = newsItems.filter(n => n.category === newsFilter);
  const filteredVideos = videos.filter(v => v.category === videoFilter);
  const featuredVideo = videos.find(v => v.category === videoFilter) || videos[0];

  // ─── Styles ────────────────────────────────────────────────────────────────
  const BG = "#0d1117";
  const BG2 = "#161b22";
  const BG3 = "#1c2333";
  const BORDER = "rgba(255,255,255,0.08)";
  const BLUE = "#3b82f6";

  return (
    <div className="min-h-screen font-poppins" style={{ background: BG, color: "white" }}>

      {/* ── TOPBAR NAVBAR ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full" style={{ background: BG2, borderBottom: `1px solid ${BORDER}` }}>
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center gap-6 h-14">
          {/* Logo */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mr-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BLUE }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-sm tracking-wide hidden sm:block">sekolahku</span>
          </button>

          {/* Nav Items */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
                style={{
                  color: activePage === item.id ? "white" : "rgba(255,255,255,0.5)",
                  background: "transparent",
                  borderBottom: activePage === item.id ? `2px solid ${BLUE}` : "2px solid transparent",
                  borderRadius: 0,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </button>
        </div>
      </nav>

      {/* ════════════════ BERANDA ════════════════ */}
      {activePage === "beranda" && (
        <div>
          {/* Hero Slider */}
          <section className="relative w-full h-[340px] overflow-hidden flex items-end"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}>
            <div className="absolute inset-0 opacity-20 flex items-center justify-center text-[200px] pointer-events-none select-none">
              🏫
            </div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,17,23,0.9) 40%, transparent)" }} />
            <div className="relative z-10 p-10 max-w-xl">
              <div className="flex gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase" style={{ background: BLUE }}>Populer</span>
                <span className="text-[10px] text-white/50 flex items-center gap-1"><Eye className="w-3 h-3" /> 15rb ditonton</span>
                <span className="text-[10px] text-white/50 flex items-center gap-1"><Clock className="w-3 h-3" /> 1 Hari yang lalu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                {gradeType === "SMK" ? "SMK" : "SMA"} Terbaik Provinsi Sulawesi Tengah
                <br />Tahun Ajaran 2025/2026
              </h1>
              <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-sm">
                {schoolName} berkomitmen menghadirkan pendidikan berkualitas, karakter unggul, dan prestasi gemilang untuk generasi Sulawesi Tengah.
              </p>
              <button
                onClick={() => setActivePage("berita")}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase cursor-pointer transition-all hover:opacity-90"
                style={{ background: BLUE }}
              >
                <ChevronRight className="w-4 h-4" />
                Baca Selengkapnya
              </button>
            </div>
            {/* Thumbnail strips */}
            <div className="absolute right-6 bottom-6 flex gap-2">
              {["🎓", "📚", "🏆", "🌍"].map((emoji, i) => (
                <div key={i} className="w-16 h-12 rounded-lg flex items-center justify-center text-2xl cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                  style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                  {emoji}
                </div>
              ))}
            </div>
          </section>

          {/* Banner */}
          <section className="w-full px-6 py-4 max-w-7xl mx-auto">
            <div className="w-full rounded-2xl flex items-center justify-between px-8 py-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" }}>
              <div className="absolute right-0 top-0 bottom-0 flex items-center text-[100px] opacity-10 pointer-events-none select-none pr-6">🎓</div>
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">SELAMAT</div>
                <div className="text-xl font-black text-white">TAHUN AJARAN BARU 2025/2026</div>
                <div className="text-xs text-blue-200 mt-1">Mari bersama mewujudkan pendidikan berkualitas dan merata.</div>
              </div>
              <button
                onClick={() => setActivePage("berita")}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase cursor-pointer flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                Info Lebih Lanjut
              </button>
            </div>
          </section>

          {/* Data Sekolah */}
          <section className="w-full px-6 py-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Stats */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Data Sekolah</h3>
                  <span className="text-[10px] text-white/40 uppercase">Detail →</span>
                </div>
                <div className="flex items-center gap-6">
                  {/* Simple circle stat */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke={BLUE} strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 32 * 0.72} ${2 * Math.PI * 32}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-white">{d.studentCount}</span>
                      <span className="text-[9px] text-white/40 font-bold">Siswa</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { label: "Guru PNS", count: d.pnsCount, color: BLUE },
                      { label: "Guru Honorer", count: d.nonPnsCount, color: "#8b5cf6" },
                      { label: "Rombel", count: d.rombelCount, color: "#10b981" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-white/60 font-medium">
                          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          {item.label}
                        </span>
                        <span className="font-black text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="lg:col-span-2 rounded-2xl p-6 space-y-4" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-black text-white text-sm uppercase tracking-wider">Visi</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Mewujudkan generasi penerus bangsa yang unggul dalam IPTEK, berkarakter kuat, berakhlak mulia, dan berdaya saing global berbasis budaya lokal Sulawesi Tengah.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-white text-sm uppercase tracking-wider">Misi</h3>
                    <ul className="space-y-1">
                      {[
                        "Menyelenggarakan pembelajaran berkualitas dan inovatif",
                        "Membangun karakter dan akhlak mulia siswa",
                        "Mengintegrasikan teknologi dalam proses belajar mengajar",
                      ].map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/60">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Principal */}
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: BG }}>
                    👨‍💼
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Kepala Sekolah</div>
                    <div className="text-sm font-black text-white">{d.principalName}</div>
                    <div className="text-[10px] text-white/50">Akreditasi {d.accreditation} • NPSN {d.npsn}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Jurusan */}
          <section className="w-full px-6 py-4 max-w-7xl mx-auto">
            <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4">Program Jurusan / Peminatan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: "🔬", title: "Jurusan IPA", desc: "Matematika, Fisika, Kimia, dan Biologi sebagai mata pelajaran unggulan dengan laboratorium lengkap.", color: "#3b82f6" },
                { emoji: "📈", title: "Jurusan IPS", desc: "Ekonomi, Geografi, Sosiologi, dan Sejarah dengan pembelajaran berbasis studi kasus kontekstual.", color: "#8b5cf6" },
                { emoji: "🌐", title: "Jurusan Bahasa", desc: "Bahasa Indonesia, Inggris, Jepang, dan Sastra dengan penekanan pada komunikasi global.", color: "#10b981" },
              ].map((jur, i) => (
                <div key={i} className="rounded-2xl p-6 space-y-3" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${jur.color}22` }}>
                    {jur.emoji}
                  </div>
                  <h4 className="font-black text-white text-sm">{jur.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{jur.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Kalender & Keterangan */}
          <section className="w-full px-6 py-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" /> Kalender Pendidikan — Januari 2026
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => (
                    <div key={d} className="text-[10px] font-black text-white/30 uppercase py-1">{d}</div>
                  ))}
                  {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => (
                    <div key={i} className={`text-xs py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      day === 15 ? "text-white font-black" : day ? "text-white/60 hover:text-white hover:bg-white/05" : ""
                    }`} style={day === 15 ? { background: BLUE } : {}}>
                      {day || ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Keterangan */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" /> Keterangan
                </h3>
                <div className="space-y-3">
                  {[
                    { color: "#3b82f6", label: "Hari Efektif Belajar", desc: "Kegiatan belajar mengajar reguler" },
                    { color: "#10b981", label: "Hari Libur Sekolah", desc: "Libur resmi dan libur nasional" },
                    { color: "#f59e0b", label: "Kegiatan Khusus", desc: "Ujian, lomba, atau kegiatan sekolah" },
                    { color: "#ef4444", label: "Tanggal Merah/Nasional", desc: "Hari libur nasional resmi" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                      <div>
                        <div className="text-xs font-bold text-white/80">{item.label}</div>
                        <div className="text-[10px] text-white/40">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                  <div className="text-xs font-black text-white uppercase tracking-wider">Potensi Daerah</div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    {schoolName} berlokasi di Kecamatan {d.kecamatan}, Sulawesi Tengah — daerah dengan potensi sumber daya alam dan budaya yang kaya untuk mendukung pembelajaran kontekstual.
                  </p>
                  <button
                    onClick={() => setActivePage("fasilitas")}
                    className="text-xs font-black flex items-center gap-1 cursor-pointer transition-all hover:opacity-80"
                    style={{ color: BLUE }}>
                    Lihat Fasilitas <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ════════════════ BERITA & PENGUMUMAN ════════════════ */}
      {activePage === "berita" && (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          {/* Featured + Pengumuman */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Featured News */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden relative" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
              <div className="h-48 flex items-center justify-center text-[80px]" style={{ background: BG3 }}>
                {newsItems[0].img}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase" style={{ background: newsItems[0].tagColor }}>
                    {newsItems[0].tag}
                  </span>
                  <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{newsItems[0].time}</span>
                  <span className="text-[10px] text-white/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{newsItems[0].date}</span>
                </div>
                <h2 className="text-base font-black text-white leading-snug">{newsItems[0].title}</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all hover:opacity-90"
                  style={{ background: BLUE }}>
                  Baca Selengkapnya
                </button>
              </div>
            </div>

            {/* Pengumuman Sidebar */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" /> Pengumuman
                </h3>
                <span className="text-[10px] text-blue-400 cursor-pointer">All item</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input className="w-full bg-transparent border rounded-lg pl-8 pr-3 py-2 text-xs text-white/70 outline-none"
                  style={{ borderColor: BORDER }} placeholder="Cari judul..." />
              </div>
              <div className="space-y-3">
                {announcements.map((ann, i) => (
                  <div key={i} className="flex gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background: BG3 }}>
                      {ann.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white/80 leading-snug group-hover:text-white line-clamp-2">{ann.title}</p>
                      <div className="flex gap-2 mt-1 text-[9px] text-white/30">
                        <span>{ann.time}</span>
                        <span>{ann.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 mb-6">
            {(["Umum", "Sekolah"] as const).map(f => (
              <button key={f} onClick={() => setNewsFilter(f)}
                className="px-5 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all"
                style={{ background: newsFilter === f ? BLUE : BG2, color: newsFilter === f ? "white" : "rgba(255,255,255,0.5)", border: `1px solid ${newsFilter === f ? "transparent" : BORDER}` }}>
                {f}
              </button>
            ))}
            <div className="ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input className="bg-transparent border rounded-lg pl-8 pr-3 py-2 text-xs text-white/70 outline-none w-48"
                style={{ borderColor: BORDER }} placeholder="cari artikel disini..." />
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((news, i) => (
              <div key={i} className="flex gap-5 p-5 rounded-2xl cursor-pointer group transition-all hover:border-blue-500/50"
                style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <div className="w-24 h-20 rounded-xl flex items-center justify-center text-4xl shrink-0" style={{ background: BG3 }}>
                  {news.img}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors leading-snug">{news.title}</h3>
                  <div className="flex gap-3 text-[10px] text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{news.time}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{news.date}</span>
                  </div>
                </div>
                <button className="self-center px-4 py-2 rounded-lg text-[10px] font-black uppercase cursor-pointer flex-shrink-0"
                  style={{ background: `${BLUE}22`, color: BLUE, border: `1px solid ${BLUE}44` }}>
                  {news.read}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════ VIDEO ════════════════ */}
      {activePage === "video" && (
        <div>
          {/* Featured Video */}
          <section className="relative w-full h-[360px] flex items-end"
            style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-[150px] opacity-10 pointer-events-none">
              {featuredVideo.thumb}
            </div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,17,23,0.85) 50%, transparent)" }} />
            {/* Play button center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                style={{ background: BLUE }}>
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            <div className="relative z-10 p-10 max-w-lg">
              <div className="flex gap-3 mb-3 text-[10px] text-white/50">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {featuredVideo.views} ditonton</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredVideo.time}</span>
              </div>
              <h2 className="text-xl font-black text-white leading-snug">{featuredVideo.title}</h2>
            </div>
          </section>

          <div className="w-full max-w-7xl mx-auto px-6 py-8">
            {/* Filter & Search */}
            <div className="flex items-center gap-4 mb-6">
              {(["Sekolah", "Umum"] as const).map(f => (
                <button key={f} onClick={() => setVideoFilter(f)}
                  className="px-5 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all"
                  style={{ background: videoFilter === f ? BLUE : BG2, color: videoFilter === f ? "white" : "rgba(255,255,255,0.5)", border: `1px solid ${videoFilter === f ? "transparent" : BORDER}` }}>
                  {f}
                </button>
              ))}
              <div className="ml-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input className="bg-transparent border rounded-lg pl-8 pr-3 py-2 text-xs text-white/70 outline-none w-56"
                  style={{ borderColor: BORDER }} placeholder="Tuliskan judul video yang ingin kamu cari disini" />
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video, i) => (
                <div key={i} className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:border-blue-500/50"
                  style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                  <div className="relative h-36 flex items-center justify-center text-5xl" style={{ background: BG3 }}>
                    {video.thumb}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-black" style={{ background: "rgba(0,0,0,0.8)" }}>
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-xs font-bold text-white/80 leading-snug line-clamp-2">{video.title}</p>
                    <div className="flex gap-3 text-[10px] text-white/40">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views} ditonton</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{video.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ PERPUSTAKAAN ════════════════ */}
      {activePage === "perpustakaan" && (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Search + Book List */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={bookQuery}
                  onChange={e => setBookQuery(e.target.value)}
                  className="w-full bg-transparent border rounded-xl pl-10 pr-4 py-3 text-sm text-white/70 outline-none"
                  style={{ borderColor: BORDER, background: BG2 }} placeholder="Cari Kelas" />
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2">
                {(["IPA", "IPS", "Bahasa"] as const).map(cat => (
                  <button key={cat} onClick={() => { setBookCategory(cat); setSelectedBook(0); }}
                    className="px-4 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer transition-all"
                    style={{
                      background: bookCategory === cat ? BLUE : BG2,
                      color: bookCategory === cat ? "white" : "rgba(255,255,255,0.4)",
                      border: `1px solid ${bookCategory === cat ? "transparent" : BORDER}`
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Book List */}
              <div className="space-y-3">
                {activeBooks.filter(b => b.title.toLowerCase().includes(bookQuery.toLowerCase())).map((book, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedBook(i)}
                    className="flex gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: selectedBook === i ? BLUE : BG2,
                      border: `1px solid ${selectedBook === i ? "transparent" : BORDER}`,
                    }}
                  >
                    <div className="w-12 h-16 rounded-lg flex items-center justify-center text-3xl shrink-0" style={{ background: "rgba(0,0,0,0.2)" }}>
                      {book.cover}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-black text-white leading-snug">{book.title}</p>
                      <StarRating rating={Math.floor(book.rating)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Book Detail */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main book detail */}
              <div className="flex flex-col sm:flex-row gap-8 p-6 rounded-2xl" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <div className="w-40 h-52 rounded-2xl flex items-center justify-center text-7xl shrink-0 self-start"
                  style={{ background: BG3 }}>
                  {currentBook.cover}
                </div>
                <div className="flex-1 space-y-4">
                  <h2 className="text-xl font-black text-white leading-snug">{currentBook.title}</h2>
                  <StarRating rating={Math.floor(currentBook.rating)} />
                  <p className="text-sm text-white/60 leading-relaxed">{currentBook.desc}</p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black cursor-pointer transition-all hover:opacity-90"
                      style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                      <BookOpen className="w-4 h-4 text-blue-400" /> Baca
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black cursor-pointer transition-all hover:opacity-90"
                      style={{ background: BLUE }}>
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Related books */}
              <div className="space-y-3">
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Buku Serupa</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {relatedBooks.map((rb, i) => (
                    <div key={i} className="rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-500/50 transition-all"
                      style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                      <span className="text-2xl">{rb.cover}</span>
                      <p className="text-[10px] font-bold text-white/70 text-center leading-tight">{rb.title}</p>
                      <StarRating rating={rb.rating} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ FASILITAS ════════════════ */}
      {activePage === "fasilitas" && (
        <div>
          {/* Hero */}
          <section className="relative w-full h-60 flex items-end overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f1729 0%, #1e3a8a 100%)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-[160px] opacity-10 pointer-events-none select-none">🏫</div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,17,23,0.85) 50%, transparent)" }} />
            <div className="relative z-10 p-10 max-w-xl">
              <h1 className="text-3xl font-black text-white leading-tight">Fasilitas<br />Sekolah</h1>
              <p className="text-sm text-white/60 mt-2 leading-relaxed">
                Fasilitas merupakan salah satu faktor penting dalam mendukung kegiatan belajar mengajar yang efektif dan menyenangkan.
              </p>
            </div>
          </section>

          {/* Fasilitas Grid */}
          <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((fac, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                  <div className="h-28 flex items-center justify-center text-6xl" style={{ background: BG3 }}>
                    {fac.icon}
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-black text-white text-sm">{fac.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{fac.desc}</p>

                    {/* File Downloads */}
                    <div className="space-y-2 pt-2">
                      {fac.files.map((file, fi) => (
                        <div key={fi} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-bold text-white/70">{file}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                              style={{ background: BG, border: `1px solid ${BORDER}` }}>
                              <Eye className="w-3.5 h-3.5 text-white/50" />
                            </button>
                            <button className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                              style={{ background: BLUE }}>
                              <Download className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ GURU & SISWA ════════════════ */}
      {activePage === "guru-siswa" && (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-8">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Data Guru & Siswa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Guru", value: d.totalTeachers, icon: "👨‍🏫", color: BLUE },
              { label: "Guru PNS", value: d.pnsCount, icon: "🏛️", color: "#8b5cf6" },
              { label: "Guru Honorer", value: d.nonPnsCount, icon: "📋", color: "#f59e0b" },
              { label: "Total Siswa", value: d.studentCount, icon: "🎓", color: "#10b981" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 text-center space-y-2"
                style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <span className="text-3xl">{item.icon}</span>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: item.color }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-8 text-center" style={{ background: BG2, border: `1px solid ${BORDER}` }}>
            <div className="text-white/30 text-sm">Data detail guru & siswa akan tersedia setelah integrasi Dapodik.</div>
          </div>
        </div>
      )}

      {/* ════════════════ ARSIP ════════════════ */}
      {activePage === "arsip" && (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <Archive className="w-5 h-5 text-blue-400" /> Arsip Dokumen Sekolah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Laporan BOS Triwulan I 2026", "Laporan BOS Triwulan II 2026",
              "Dokumen Akreditasi 2024", "SK Pembagian Tugas Guru 2025",
              "Jadwal Pelajaran Ganjil 2025", "Daftar Inventaris Sekolah 2025",
              "Laporan Pertanggungjawaban PPDB", "Rencana Kerja Sekolah (RKS) 2025",
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl cursor-pointer group hover:border-blue-500/50 transition-all"
                style={{ background: BG2, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white/80 group-hover:text-white">{doc}</span>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                    <Eye className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BLUE }}>
                    <Download className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full mt-10 pt-10 pb-6" style={{ background: BG2, borderTop: `1px solid ${BORDER}` }}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 pb-8 border-b" style={{ borderColor: BORDER }}>
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BLUE }}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-white text-sm">sekolahku</span>
              </div>
              <div className="text-[11px] text-white/40 leading-relaxed space-y-1">
                <p>{d.address}</p>
              </div>
              <div className="space-y-1.5 text-[11px] text-white/50">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" />{d.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" />{d.phone}</div>
              </div>
            </div>

            {/* Link Terkait */}
            <div className="space-y-4">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">Link terkait</h4>
              <ul className="space-y-2 text-[11px] text-white/40">
                <li className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                  <ChevronRight className="w-3 h-3" /> Dinas Pendidikan Provinsi Sulawesi Tengah
                </li>
                <li className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                  <ChevronRight className="w-3 h-3" /> Pemerintah Provinsi Sulawesi Tengah
                </li>
                <li className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                  <ChevronRight className="w-3 h-3" /> Kemdikbud RI
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-[11px] text-white/40">
                <li className="cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
                <li className="cursor-pointer hover:text-white transition-colors">Term of Service</li>
              </ul>
            </div>

            {/* Sosial Media */}
            <div className="space-y-4">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">Sosial Media</h4>
              <div className="flex gap-2">
                {[
                  { icon: Globe2, label: "Facebook" },
                  { icon: Link2, label: "LinkedIn" },
                  { icon: Share2, label: "Twitter" },
                ].map((sm, i) => (
                  <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                    style={{ background: BG3, border: `1px solid ${BORDER}` }}>
                    <sm.icon className="w-3.5 h-3.5 text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="py-8 text-center space-y-3">
            <div className="text-xs font-bold text-white/40 uppercase">Belum Punya Website</div>
            <h3 className="text-xl font-black text-white">Hubungi Kami Sekarang!</h3>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase cursor-pointer transition-all hover:opacity-90 mx-auto"
              style={{ background: BLUE }}>
              <Phone className="w-4 h-4" /> Hubungi
            </button>
          </div>

          <div className="border-t pt-4 text-center text-[10px] text-white/20" style={{ borderColor: BORDER }}>
            © 2026 <span className="font-black text-white/40">{schoolName}</span>. All Rights Reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};
