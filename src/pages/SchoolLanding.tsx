import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Award, Users, Calendar, MapPin,
  Clock, Activity, BookOpen,
  CheckCircle2, UserCheck, Shield, GraduationCap,
  Copy, Check, TrendingUp, Star, Zap,
  Globe, Phone, Mail, ChevronRight,
  BookMarked, Layers, Target, ArrowUpRight,
  Newspaper, Trophy, Cpu
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PortalService } from '@/services/portalService';

// ─── Deterministic Mock Generator ────────────────────────────────────────────
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
    "Sri Wahyuni, S.Pd., M.Hum.", "Dr. Irwan Setiawan, M.Pd.",
    "Andi Hermawan, S.Pd., M.T.", "Hj. Nurhayati, S.Pd., M.Pd."
  ];
  const principalStatuses = [
    "PNS (Pembina Utama Muda, IV/c)", "PNS (Pembina Tingkat I, IV/b)",
    "PNS (Pembina, IV/a)", "PNS (Penata Tingkat I, III/d)", "PPPK (Ahli Madya)"
  ];

  const principalName = principalNames[hash % principalNames.length];
  const principalStatus = principalStatuses[hash % principalStatuses.length];
  const birthYear = 1965 + (hash % 20);
  const recruitYear = birthYear + 25 + (hash % 5);
  const nip = `${birthYear}${String(1 + (hash % 12)).padStart(2, "0")}${String(1 + (hash % 28)).padStart(2, "0")}${recruitYear}${String(1 + (hash % 12)).padStart(2, "0")}${(hash % 2) + 1}${String(100 + (hash % 900))}`;
  const principalPhone = `0812-${4000 + (hash % 5000)}-${1000 + (hash % 8000)}`;

  const accreditationList = ["A (Amat Baik)", "B (Baik)", "A (Amat Baik)"];
  const accreditation = accreditationList[hash % accreditationList.length];
  const studentCount = 350 + (hash % 650);
  const rombelCount = Math.round(studentCount / 32);
  const totalTeachers = 15 + (hash % 45);
  const pnsCount = Math.round((totalTeachers * (50 + (hash % 35))) / 100);
  const nonPnsCount = totalTeachers - pnsCount;
  const certifiedPercentage = 40 + (hash % 45);
  const abkStatuses = ["SEIMBANG / IDEAL", "KEKURANGAN GURU", "KELEBIHAN GURU"];
  const abkStatus = abkStatuses[hash % abkStatuses.length];
  const abkColor = abkStatus.includes("IDEAL")
    ? { text: "#059669", bg: "#ecfdf5", border: "#a7f3d0" }
    : (abkStatus.includes("KEKURANGAN")
      ? { text: "#e11d48", bg: "#fff1f2", border: "#fecdd3" }
      : { text: "#d97706", bg: "#fffbeb", border: "#fde68a" });

  const email = `admin.${schoolName.toLowerCase().replace(/[^a-z0-9]/g, "")}@sch.id`;
  const npsn = `${69000000 + (hash % 999999)}`;

  // Projection data
  const lulusanData = [2021, 2022, 2023, 2024, 2025].map((year, i) => ({
    year,
    count: 85 + (hash % 10) + i * (2 + (hash % 3)),
    ptn: 40 + (hash % 30) + i * (1 + (hash % 2))
  }));
  const proyeksiSiswa = [2025, 2026, 2027].map((year, i) => ({
    year,
    count: studentCount + i * (10 + (hash % 20))
  }));

  const kecamatanList = [
    "Palu Timur", "Palu Barat", "Palu Selatan", "Palu Utara",
    "Donggala", "Sigi Biromaru", "Banawa", "Kulawi", "Palolo"
  ];
  const kecamatan = kecamatanList[hash % kecamatanList.length];

  return {
    principalName, principalStatus, nip, principalPhone,
    accreditation, studentCount, rombelCount, totalTeachers,
    pnsCount, nonPnsCount, certifiedPercentage, abkStatus, abkColor,
    email, npsn, lulusanData, proyeksiSiswa, kecamatan
  };
};

// ─── Counter Animation Hook ───────────────────────────────────────────────────
const useCountUp = (target: number, duration = 1500, started = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
};

// ─── Stat Counter Component ───────────────────────────────────────────────────
const StatCounter = ({ target, label, suffix = "", started }: { target: number; label: string; suffix?: string; started: boolean }) => {
  const count = useCountUp(target, 1500, started);
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black text-white tabular-nums drop-shadow-lg">
        {count.toLocaleString("id-ID")}{suffix}
      </div>
      <div className="text-xs font-bold text-white/70 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
};

// ─── Bar Chart Component ──────────────────────────────────────────────────────
const BarChart = ({ data, valueKey, labelKey, color }: {
  data: Record<string, number | string>[];
  valueKey: string;
  labelKey: string;
  color: string;
}) => {
  const max = Math.max(...data.map(d => Number(d[valueKey])));
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => {
        const pct = (Number(d[valueKey]) / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] font-black text-slate-600">{d[valueKey]}</span>
            <div className="w-full rounded-t-lg transition-all duration-700" style={{
              height: `${pct}%`,
              background: color,
              minHeight: "8px"
            }} />
            <span className="text-[9px] font-bold text-slate-400 uppercase">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Custom Map Controls Component ──────────────────────────────────────────
const MapControls = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  return (
    <div className="absolute top-24 right-6 z-[1000] flex flex-col gap-2 pointer-events-auto">
      {/* Zoom In */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          map.zoomIn();
        }}
        className="w-10 h-10 rounded-xl bg-[#15171bf2] hover:bg-[#1f2228f2] border border-white/10 text-white shadow-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center cursor-pointer font-black text-lg"
        style={{ backdropFilter: "blur(8px)" }}
        title="Perbesar Peta"
      >
        +
      </button>

      {/* Zoom Out */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          map.zoomOut();
        }}
        className="w-10 h-10 rounded-xl bg-[#15171bf2] hover:bg-[#1f2228f2] border border-white/10 text-white shadow-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center cursor-pointer font-black text-lg"
        style={{ backdropFilter: "blur(8px)" }}
        title="Perkecil Peta"
      >
        -
      </button>

      {/* Recenter / Focus */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          map.setView([lat, lng], 15, { animate: true });
        }}
        className="w-10 h-10 rounded-xl bg-[#15171bf2] hover:bg-[#1f2228f2] border border-white/10 text-white shadow-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center cursor-pointer"
        style={{ backdropFilter: "blur(8px)" }}
        title="Kembali ke Sekolah Aktif"
      >
        <Target className="w-4 h-4 animate-pulse text-emerald-400" />
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const SchoolLanding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const schoolName = queryParams.get("name") || `Sekolah Menengah Atas (ID: ${id})`;
  const isSwasta = schoolName.toUpperCase().includes("SWASTA");
  const gradeType = schoolName.toUpperCase().includes("SMK") ? "SMK"
    : schoolName.toUpperCase().includes("SLB") ? "SLB" : "SMA";
  const d = getDeterministicData(id || "1", schoolName);

  const [activeSection, setActiveSection] = useState<"overview" | "akademik" | "gtk" | "berita">("overview");
  const [copiedNip, setCopiedNip] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<{ schools: any[], cabdis: any } | null>(null);
  const [cabdisGeoData, setCabdisGeoData] = useState<Record<number, any>>({});

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

  useEffect(() => {
    if (id) {
      PortalService.getSchoolMapData(id).then((res) => {
        if (res?.data) {
          setMapData(res.data);
        }
      }).catch(err => console.error(err));
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { clearTimeout(t1); observer.disconnect(); };
  }, []);

  const primaryGradient = isSwasta
    ? "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)"
    : "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)";

  const accentColor = isSwasta ? "#059669" : "#4f46e5";

  const copyNip = () => {
    navigator.clipboard.writeText(d.nip);
    setCopiedNip(true);
    setTimeout(() => setCopiedNip(false), 2000);
  };

  // ── Section tab data
  const sections = [
    { id: "overview", label: "Ikhtisar", icon: Layers },
    { id: "akademik", label: "Akademik", icon: BookMarked },
    { id: "gtk", label: "GTK & SDM", icon: Users },
    { id: "berita", label: "Berita", icon: Newspaper },
  ] as const;

  const newsItems = [
    {
      tag: "PRESTASI", tagBg: "#fef3c7", tagColor: "#92400e",
      img: "🏆",
      title: `${schoolName} Raih Medali Emas OSN 2026`,
      desc: "Tim sains sekolah berhasil meraih medali emas dalam ajang Olimpiade Sains Nasional 2026 bidang Astronomi dan Informatika.",
      date: "18 Mei 2026", read: "3 mnt"
    },
    {
      tag: "AKADEMIK", tagBg: "#eff6ff", tagColor: "#1e40af",
      img: "📚",
      title: "PPDB Online 2026/2027 Resmi Dibuka",
      desc: "Pendaftaran peserta didik baru tahun ajaran 2026/2027 telah resmi dibuka. Kuota terbatas, daftar segera melalui sistem PPDB daerah.",
      date: "12 Mei 2026", read: "5 mnt"
    },
    {
      tag: "WORKSHOP", tagBg: "#f5f3ff", tagColor: "#5b21b6",
      img: "💡",
      title: "Workshop Kurikulum Merdeka Mandiri Berbagi",
      desc: "Dinas Pendidikan Provinsi Sulawesi Tengah memfasilitasi workshop lokakarya peningkatan kapasitas guru untuk implementasi Kurikulum Merdeka.",
      date: "08 Mei 2026", read: "4 mnt"
    },
    {
      tag: "FASILITAS", tagBg: "#f0fdf4", tagColor: "#065f46",
      img: "🏫",
      title: "Peresmian Lab Komputer & Robotika Baru",
      desc: "Sekolah kini dilengkapi laboratorium komputer modern berkapasitas 40 unit dengan koneksi internet fiber optik 1 Gbps.",
      date: "02 Mei 2026", read: "2 mnt"
    },
  ];

  const programs = [
    { icon: "🔬", title: "Sains & Teknologi", desc: "Program unggulan IPA terintegrasi teknologi informasi modern", badge: "Unggulan" },
    { icon: "💻", title: "Informatika & Coding", desc: "Pemrograman, desain UI, dan komputasi awan untuk era digital", badge: "Baru" },
    { icon: "🎨", title: "Seni & Kebudayaan", desc: "Pelestarian budaya lokal Sulawesi Tengah dalam ekosistem kreatif", badge: "" },
    { icon: "⚽", title: "Olahraga Prestasi", desc: "Pembinaan atlet berprestasi tingkat provinsi dan nasional", badge: "" },
    { icon: "🌿", title: "Adiwiyata & Lingkungan", desc: "Program sekolah hijau berbasis ekosistem berkelanjutan", badge: "Aktif" },
    { icon: "🤝", title: "Kepemimpinan OSIS", desc: "Pembentukan karakter pemimpin masa depan yang berintegritas", badge: "" },
  ];

  const agenda = [
    { date: "28 Mei", event: "Rapat Evaluasi Semester", status: "selesai" },
    { date: "02 Jun", event: "Ujian Kenaikan Kelas (UKK)", status: "aktif" },
    { date: "15 Jun", event: "Wisuda & Pelepasan Siswa XII", status: "mendatang" },
    { date: "22 Jun", event: "Pembukaan PPDB Online", status: "mendatang" },
    { date: "10 Jul", event: "Orientasi Peserta Didik Baru", status: "mendatang" },
  ];

  const rawLat = mapData?.schools?.find(s => s.id === id)?.latitude ?? mapData?.cabdis?.latitude ?? -0.8917;
  const rawLng = mapData?.schools?.find(s => s.id === id)?.longitude ?? mapData?.cabdis?.longitude ?? 119.8707;

  const centerLat = isNaN(Number(rawLat)) ? -0.8917 : Number(rawLat);
  const centerLng = isNaN(Number(rawLng)) ? 119.8707 : Number(rawLng);



  const mapSchools = mapData?.schools || [];

  const currentIcon = L.divIcon({
    html: `<div style="background-color: ${accentColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${accentColor}; display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const normalIcon = L.divIcon({
    html: `<div style="background-color: rgba(255,255,255,0.4); width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); cursor: pointer;" title="Klik untuk lihat"></div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  return (
    <div className="relative w-full min-h-screen bg-[#0f1117] text-white overflow-x-hidden font-poppins">
      <style>{`
        .leaflet-tile-pane {
          opacity: 0.3 !important;
          mix-blend-mode: screen !important;
        }
        .leaflet-popup-content-wrapper {
          background: #15171bf2 !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
        }
        .leaflet-popup-tip {
          background: #15171bf2 !important;
          border-left: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255, 255, 255, 0.5) !important;
          padding: 8px 8px 0 0 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
      `}</style>

      {/* ── FIXED NAVBAR ─────────────────────────────────────────── */}
      

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden pt-16">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 z-0" style={{ background: primaryGradient }} />
        <div className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,255,255,0.08) 0%, transparent 70%)"
        }} />
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Floating geometric accents */}
        <div className="absolute top-24 right-16 w-80 h-80 rounded-full opacity-10 blur-3xl z-0"
          style={{ background: "white" }} />
        <div className="absolute top-40 left-10 w-48 h-48 rounded-full opacity-10 blur-2xl z-0"
          style={{ background: "rgba(255,255,255,0.5)" }} />

        {/* Big background map */}
        <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-10 pointer-events-auto" style={{
          maskImage: "radial-gradient(ellipse 95% 95% at 90% 90%, black 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 95% at 90% 90%, black 45%, transparent 100%)"
        }}>
          <MapContainer 
            key={`${centerLat}-${centerLng}`}
            center={[centerLat, centerLng]} 
            zoom={15} 
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {Object.entries(cabdisGeoData).map(([num, geo]) => (
              <GeoJSON
                key={`cabdis-${num}`}
                data={geo}
                style={{
                  color: "rgba(255, 255, 255, 0.12)",
                  weight: 1.5,
                  fillColor: accentColor,
                  fillOpacity: 0.04
                }}
                interactive={false}
              />
            ))}
            {mapSchools.map((s) => {
              const lat = Number(s.latitude);
              const lng = Number(s.longitude);
              return !isNaN(lat) && !isNaN(lng) && s.latitude && s.longitude ? (
                <Marker 
                  key={s.id} 
                  position={[lat, lng]} 
                  icon={s.id === id ? currentIcon : normalIcon} 
                >
                  <Popup>
                    <div className="p-1.5 text-white font-poppins min-w-[180px]">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase border border-blue-500/30">
                          {s.status || (s.name.toUpperCase().includes("SWASTA") ? "SWASTA" : "NEGERI")}
                        </span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase">
                          {s.grade || "SMA"}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white uppercase leading-snug mb-0.5">{s.name}</h4>
                      <p className="text-[9px] text-white/40 font-bold mb-2">NPSN: {s.npsn || "-"}</p>
                      
                      {s.id !== id ? (
                        <button 
                          onClick={() => navigate(`/sekolah/${s.id}?name=${encodeURIComponent(s.name)}`)}
                          className="w-full text-center text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded transition-colors duration-200"
                        >
                          Lihat Detail Sekolah
                        </button>
                      ) : (
                        <div className="w-full text-center text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold py-1 rounded">
                          Sekolah Aktif
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null;
            })}
            <MapControls lat={centerLat} lng={centerLng} />
          </MapContainer>
        </div>

        {/* Hero Content */}
        <div className={`relative z-20 w-full max-w-7xl mx-auto px-6 pb-20 pt-32 transition-all duration-1000 pointer-events-none ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: isSwasta ? "Swasta" : "Negeri", bg: "rgba(255,255,255,0.15)" },
              { label: gradeType, bg: "rgba(255,255,255,0.15)" },
              { label: `Akreditasi ${d.accreditation.split(" ")[0]}`, bg: "rgba(255,255,255,0.15)" },
              { label: `NPSN ${d.npsn}`, bg: "rgba(255,255,255,0.08)" },
            ].map((b, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20 backdrop-blur-sm"
                style={{ background: b.bg }}>
                {b.label}
              </span>
            ))}
          </div>

          {/* School name */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight uppercase max-w-4xl"
            style={{ textShadow: "0 4px 32px rgba(0,0,0,0.3)" }}>
            {schoolName}
          </h1>

          <div className="flex items-center gap-2 mt-4 text-white/70 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span>Kecamatan {d.kecamatan}, Sulawesi Tengah</span>
          </div>

          <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-medium">
            Menyediakan layanan pendidikan jenjang {gradeType} berkualitas dengan mengedepankan
            pembentukan karakter, pemanfaatan teknologi modern, dan prestasi akademik berkelanjutan
            di bawah Dinas Pendidikan Provinsi Sulawesi Tengah.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pointer-events-auto">
            <button
              onClick={() => setActiveSection("akademik")}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white transition-all cursor-pointer shadow-xl hover:scale-105"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}
            >
              <BookOpen className="w-4 h-4" /> Lihat Data Akademik
            </button>
            <button
              onClick={() => setActiveSection("gtk")}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white/80 border border-white/20 transition-all cursor-pointer hover:bg-white/10"
            >
              <Users className="w-4 h-4" /> Data GTK
            </button>
          </div>
        </div>

        {/* Stats Band */}
        <div ref={statsRef} className="relative z-10 w-full border-t border-white/10"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)" }}>
          <div className="w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 divide-x divide-white/10">
            <StatCounter target={d.studentCount} label="Peserta Didik Aktif" started={statsVisible} />
            <StatCounter target={d.totalTeachers} label="Guru & Tendik" started={statsVisible} />
            <StatCounter target={d.rombelCount} label="Rombongan Belajar" started={statsVisible} />
            <StatCounter target={d.certifiedPercentage} suffix="%" label="Guru Bersertifikat" started={statsVisible} />
          </div>
        </div>
      </section>

      {/* ── SECTION NAVIGATION ───────────────────────────────────── */}
      <div className="sticky top-14 z-40 w-full" style={{ background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-full max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-none py-2">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              style={activeSection === sec.id
                ? { background: accentColor, color: "white" }
                : { background: "transparent", color: "rgba(255,255,255,0.5)" }
              }
            >
              <sec.icon className="w-3.5 h-3.5" />
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT AREA ─────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* ══════════════ OVERVIEW SECTION ══════════════ */}
        {activeSection === "overview" && (
          <div className="space-y-8 animate-fadeIn">

            {/* Kepala Sekolah Card */}
            <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center text-center gap-3 shrink-0">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    👨‍💼
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-black mb-1">Kepala Sekolah</div>
                    <div className="font-black text-white text-sm leading-snug max-w-[180px]">{d.principalName}</div>
                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase inline-block"
                      style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}>
                      {d.principalStatus}
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "NIP", value: d.nip, icon: Shield },
                    { label: "Kontak / WhatsApp", value: d.principalPhone, icon: Phone },
                    { label: "Email Resmi Sekolah", value: d.email, icon: Mail },
                    { label: "NPSN", value: d.npsn, icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                      <div className="min-w-0">
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">{item.label}</div>
                        <div className="text-xs font-black text-white/90 truncate mt-0.5">{item.value}</div>
                      </div>
                      {item.label === "NIP" && (
                        <button onClick={copyNip} className="ml-auto shrink-0 cursor-pointer p-1.5 rounded-lg transition-all"
                          style={{ background: "rgba(255,255,255,0.06)" }}>
                          {copiedNip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visi Misi */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 rounded-3xl p-8 space-y-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}33` }}>
                    <Target className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <h2 className="font-black text-white uppercase text-sm tracking-wider">Visi & Misi Sekolah</h2>
                </div>
                <div className="p-5 rounded-2xl space-y-2" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                  <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentColor }}>Visi Utama</div>
                  <p className="text-sm font-bold text-white/90 leading-relaxed italic">
                    "Mewujudkan insan pendidik yang unggul, religius, berbudaya, kompetitif secara global, serta berwawasan teknologi dan lingkungan."
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Menyelenggarakan proses pembelajaran berkualitas berbasis karakter moral serta keunggulan sains.",
                    "Mengintegrasikan platform teknologi informasi digital modern dalam administrasi dan KBM.",
                    "Membina kemandirian, sportivitas, dan kecakapan sosial siswa dalam program ekstrakurikuler.",
                    "Menciptakan ekosistem sekolah yang bersih, hijau, sehat, dan kondusif bagi kreativitas belajar.",
                  ].map((misi, i) => (
                    <li key={i} className="flex gap-3 items-start text-xs text-white/60 font-medium leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                        style={{ background: `${accentColor}33`, color: accentColor }}>
                        {i + 1}
                      </span>
                      {misi}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Agenda */}
              <div className="lg:col-span-2 rounded-3xl p-8 space-y-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}33` }}>
                    <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <h2 className="font-black text-white uppercase text-sm tracking-wider">Agenda Sekolah</h2>
                </div>
                <div className="space-y-3">
                  {agenda.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="text-center shrink-0 w-12">
                        <div className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{item.date}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white/80 leading-snug truncate">{item.event}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${item.status === "selesai" ? "bg-emerald-400" : item.status === "aktif" ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Unggulan */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-white text-lg uppercase tracking-wider flex items-center gap-3">
                  <Zap className="w-5 h-5" style={{ color: accentColor }} />
                  Program Unggulan
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {programs.map((prog, i) => (
                  <div key={i} className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 group hover:scale-105 transition-transform duration-200 relative cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {prog.badge && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-black"
                        style={{ background: `${accentColor}33`, color: accentColor }}>
                        {prog.badge}
                      </span>
                    )}
                    <span className="text-3xl">{prog.icon}</span>
                    <div>
                      <div className="text-xs font-black text-white/90 leading-snug">{prog.title}</div>
                      <div className="text-[10px] text-white/40 font-medium mt-1 leading-relaxed">{prog.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════ AKADEMIK SECTION ══════════════ */}
        {activeSection === "akademik" && (
          <div className="space-y-8 animate-fadeIn">

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Peserta Didik", value: d.studentCount.toLocaleString("id-ID"), sub: "Aktif TA 2025/2026", color: "#4f46e5" },
                { icon: Layers, label: "Rombel", value: `${d.rombelCount}`, sub: "Kelompok Belajar", color: "#0891b2" },
                { icon: Award, label: "Akreditasi", value: d.accreditation.split(" ")[0], sub: "BAN-SM Nasional", color: "#d97706" },
                { icon: Trophy, label: "Prestasi", value: "12+", sub: "Penghargaan 2025", color: "#059669" },
              ].map((kpi, i) => (
                <div key={i} className="rounded-3xl p-6 flex flex-col gap-3"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: `${kpi.color}25` }}>
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{kpi.value}</div>
                    <div className="text-xs font-black text-white/70 uppercase tracking-wider">{kpi.label}</div>
                    <div className="text-[10px] text-white/40 font-medium mt-0.5">{kpi.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lulusan Trend */}
              <div className="rounded-3xl p-8 space-y-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}33` }}>
                      <GraduationCap className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                    <h3 className="font-black text-white text-sm uppercase tracking-wider">Trend Lulusan</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase">2021 – 2025</span>
                </div>
                <BarChart
                  data={d.lulusanData.map(l => ({ year: String(l.year), count: l.count }))}
                  valueKey="count"
                  labelKey="year"
                  color={`linear-gradient(to top, ${accentColor}, ${accentColor}66)`}
                />
                <div className="flex items-center gap-4 text-xs text-white/50 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: accentColor }} />
                    Jumlah Lulusan
                  </span>
                </div>
              </div>

              {/* PTN Intake */}
              <div className="rounded-3xl p-8 space-y-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#0891b233" }}>
                      <Target className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="font-black text-white text-sm uppercase tracking-wider">Siswa Masuk PTN</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase">5 Tahun Terakhir</span>
                </div>
                <BarChart
                  data={d.lulusanData.map(l => ({ year: String(l.year), count: l.ptn }))}
                  valueKey="count"
                  labelKey="year"
                  color="linear-gradient(to top, #0891b2, #06b6d444)"
                />
                <div className="flex items-center gap-4 text-xs text-white/50 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block bg-cyan-500" />
                    Diterima PTN/Kedinasan
                  </span>
                </div>
              </div>
            </div>

            {/* Proyeksi Siswa */}
            <div className="rounded-3xl p-8 space-y-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#05966933" }}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Proyeksi Kapasitas Siswa</h3>
                <span className="ml-auto text-[10px] font-black text-white/40 uppercase">2025 – 2027</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {d.proyeksiSiswa.map((p, i) => (
                  <div key={i} className="rounded-2xl p-5 text-center relative overflow-hidden"
                    style={{
                      background: i === 0 ? `${accentColor}20` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 0 ? accentColor + "40" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    {i > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-0.5 text-[9px] font-black text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        Proyeksi
                      </div>
                    )}
                    <div className="text-2xl font-black text-white">{p.count}</div>
                    <div className="text-[10px] font-bold text-white/50 uppercase mt-1">Siswa {p.year}</div>
                    {i === 0 && <div className="text-[9px] font-black mt-1" style={{ color: accentColor }}>AKTUAL</div>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/30 font-medium">
                * Proyeksi berdasarkan tren pertumbuhan siswa 5 tahun terakhir dan data PPDB daerah.
              </p>
            </div>

            {/* Jatuh Tempo & Pelayanan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-3xl p-8 space-y-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: accentColor }} />
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Jatuh Tempo Dokumen</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Pembaruan Akreditasi", due: "12 Sep 2027", status: "Aman", color: "#059669" },
                    { label: "Sertifikasi Guru (Batch)", due: "30 Jun 2026", status: "Segera", color: "#d97706" },
                    { label: "Laporan BOS Triwulan II", due: "15 Jul 2026", status: "Dalam Proses", color: "#4f46e5" },
                    { label: "Audit Dapodik Semester", due: "01 Jul 2026", status: "Perlu Tindak", color: "#e11d48" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <div className="text-xs font-bold text-white/80">{item.label}</div>
                        <div className="text-[10px] text-white/40 font-medium mt-0.5">{item.due}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase"
                        style={{ background: `${item.color}22`, color: item.color }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-8 space-y-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5" style={{ color: accentColor }} />
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Proyeksi Layanan</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Target PPDB 2026/2027", progress: 65, target: "350 Siswa Baru" },
                    { label: "Kapasitas Lab Komputer", progress: 80, target: "80 Unit Tersedia" },
                    { label: "Konversi Digital Arsip", progress: 42, target: "42% Terdigitasi" },
                    { label: "Guru Terlatih Kurikulum Merdeka", progress: d.certifiedPercentage, target: `${d.certifiedPercentage}% Terpenuhi` },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white/70">{item.label}</span>
                        <span className="font-black text-white/50">{item.target}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${item.progress}%`, background: `linear-gradient(to right, ${accentColor}, ${accentColor}88)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══════════════ GTK SECTION ══════════════ */}
        {activeSection === "gtk" && (
          <div className="space-y-8 animate-fadeIn">

            {/* GTK KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total GTK", value: d.totalTeachers, icon: "👨‍🏫", color: accentColor },
                { label: "Guru PNS", value: d.pnsCount, icon: "🏛️", color: "#0891b2" },
                { label: "Guru Honorer/PPPK", value: d.nonPnsCount, icon: "📋", color: "#d97706" },
                { label: "Bersertifikasi", value: `${d.certifiedPercentage}%`, icon: "🎓", color: "#059669" },
              ].map((k, i) => (
                <div key={i} className="rounded-3xl p-6 text-center space-y-2"
                  style={{ background: `${k.color}15`, border: `1px solid ${k.color}30` }}>
                  <span className="text-3xl">{k.icon}</span>
                  <div className="text-2xl font-black text-white">{k.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: k.color }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Distribusi GTK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl p-8 space-y-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" style={{ color: accentColor }} />
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Distribusi Status GTK</h3>
                </div>
                <div className="space-y-5">
                  {[
                    { label: "Guru PNS", count: d.pnsCount, total: d.totalTeachers, color: accentColor },
                    { label: "Guru Honorer / PPPK", count: d.nonPnsCount, total: d.totalTeachers, color: "#0891b2" },
                    { label: "Guru Bersertifikat", count: Math.round(d.totalTeachers * d.certifiedPercentage / 100), total: d.totalTeachers, color: "#059669" },
                    { label: "Linier Bidang Ajar", count: Math.round(d.totalTeachers * 0.96), total: d.totalTeachers, color: "#d97706" },
                  ].map((item, i) => {
                    const pct = Math.round((item.count / item.total) * 100);
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-white/70">{item.label}</span>
                          <span className="font-black text-white/80">{item.count} Guru <span className="text-white/40">({pct}%)</span></span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-2 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: item.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl" style={{ background: `${d.abkColor.bg}22`, border: `1px solid ${d.abkColor.text}33` }}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Status ABK (Analisis Beban Kerja)</div>
                  <div className="text-sm font-black uppercase" style={{ color: d.abkColor.text }}>{d.abkStatus}</div>
                </div>
              </div>

              {/* Kualifikasi Pendidikan */}
              <div className="rounded-3xl p-8 space-y-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <BookMarked className="w-5 h-5" style={{ color: accentColor }} />
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Kualifikasi Pendidikan</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "S2 / Magister", pct: 15, count: Math.round(d.totalTeachers * 0.15), color: "#7c3aed" },
                    { label: "S1 / Sarjana", pct: 80, count: Math.round(d.totalTeachers * 0.80), color: accentColor },
                    { label: "Diploma / Lainnya", pct: 5, count: Math.round(d.totalTeachers * 0.05), color: "#64748b" },
                  ].map((edu, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-lg font-black"
                        style={{ background: `${edu.color}22`, color: edu.color }}>
                        {edu.pct}%
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-white/70">{edu.label}</span>
                          <span className="font-black text-white/60">{edu.count} Guru</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${edu.pct}%`, background: edu.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Data Integritas Info */}
                <div className="space-y-2 pt-4 border-t border-white/05">
                  {[
                    "Data bersumber dari integrasi Dapodik dan sistem kepegawaian ASN Smart.",
                    "Pembaruan status linier mengajar divalidasi setiap awal semester."
                  ].map((info, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] font-medium text-white/40 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kepala Sekolah Timeline Detail */}
            <div className="rounded-3xl p-8 space-y-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5" style={{ color: accentColor }} />
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Riwayat Kepemimpinan</h3>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {[
                  { year: "2020 – 2023", name: "Drs. H. Kamaruddin, M.Pd.", status: "Purnabakti" },
                  { year: "2023 – Sekarang", name: d.principalName, status: "Aktif" },
                ].map((leader, i) => (
                  <div key={i} className="flex-1 min-w-[200px] p-5 rounded-2xl relative"
                    style={{
                      background: i === 1 ? `${accentColor}15` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 1 ? accentColor + "40" : "rgba(255,255,255,0.05)"}`
                    }}>
                    <div className="text-[10px] font-black uppercase tracking-wider text-white/40">{leader.year}</div>
                    <div className="text-sm font-black text-white/90 mt-1 leading-snug">{leader.name}</div>
                    <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-black"
                      style={{
                        background: i === 1 ? `${accentColor}33` : "rgba(255,255,255,0.08)",
                        color: i === 1 ? accentColor : "rgba(255,255,255,0.4)"
                      }}>
                      {leader.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════ BERITA SECTION ══════════════ */}
        {activeSection === "berita" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-white text-xl uppercase tracking-wider flex items-center gap-3">
                <Newspaper className="w-6 h-6" style={{ color: accentColor }} />
                Kabar & Prestasi
              </h2>
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider">{newsItems.length} Berita Terbaru</span>
            </div>

            {/* Featured news */}
            <div className="rounded-3xl overflow-hidden cursor-pointer group"
              style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
              <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  {newsItems[0].img}
                </div>
                <div className="flex-1 space-y-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase"
                    style={{ background: newsItems[0].tagBg, color: newsItems[0].tagColor }}>
                    {newsItems[0].tag}
                  </span>
                  <h3 className="text-xl font-black text-white leading-snug group-hover:text-white/80 transition-colors">
                    {newsItems[0].title}
                  </h3>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">{newsItems[0].desc}</p>
                  <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{newsItems[0].read}</span>
                    <span>{newsItems[0].date}</span>
                    <span className="flex items-center gap-1 ml-auto" style={{ color: accentColor }}>
                      Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other news grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {newsItems.slice(1).map((news, idx) => (
                <div key={idx}
                  className="rounded-3xl p-6 space-y-4 cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase"
                      style={{ background: news.tagBg, color: news.tagColor }}>
                      {news.tag}
                    </span>
                    <span className="text-3xl">{news.img}</span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-snug group-hover:text-white/80 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-[11px] text-white/50 font-medium leading-relaxed line-clamp-3">{news.desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/05 text-[10px] font-black text-white/30 uppercase">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{news.read}</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Highlights */}
            <div className="rounded-3xl p-8 space-y-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Prestasi Unggulan 2025 – 2026</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { emoji: "🥇", title: "Medali Emas OSN Astronomi", scope: "Tingkat Nasional", year: "2026" },
                  { emoji: "🏆", title: "Juara I LKBB Provinsi Sulawesi Tengah", scope: "Tingkat Provinsi", year: "2025" },
                  { emoji: "🌿", title: "Penghargaan Sekolah Adiwiyata Mandiri", scope: "Tingkat Nasional", year: "2025" },
                  { emoji: "💡", title: "Inovasi Terbaik PPBN Dinas Pendidikan", scope: "Tingkat Provinsi", year: "2026" },
                  { emoji: "🎨", title: "Juara I Festival Seni Budaya Daerah", scope: "Tingkat Kabupaten", year: "2025" },
                  { emoji: "📊", title: "Nilai UN Tertinggi IPA Wilayah", scope: "Tingkat Wilayah", year: "2025" },
                ].map((ach, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-2xl shrink-0">{ach.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-white/80 leading-snug">{ach.title}</div>
                      <div className="text-[10px] font-bold text-white/40 mt-1">{ach.scope} • {ach.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="w-full mt-16 py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ background: accentColor }}>
              {gradeType}
            </div>
            <div>
              <div className="text-xs font-black text-white/70 uppercase leading-snug max-w-xs truncate">{schoolName}</div>
              <div className="text-[10px] text-white/30 font-medium">Dinas Pendidikan Provinsi Sulawesi Tengah</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-wider">
            <span>NPSN: {d.npsn}</span>
            <span>•</span>
            <span>Data valid per TA 2025/2026</span>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Kembali ke Peta
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};
