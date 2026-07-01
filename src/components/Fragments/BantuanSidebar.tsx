import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { X, Clock } from 'lucide-react';

interface BantuanSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ServiceStep {
    title: string;
    actorIdx: number;
    persyaratan: string;
    waktu: string;
    output: string;
    icon: string;
    description: string;
}

interface ServiceData {
    id: string;
    name: string;
    icon: string;
    iconBg: string;
    iconText: string;
    readTime: string;
    peran: string;
    description: string;
    actors: string[];
    sop: ServiceStep[];
}

interface PulpenData {
    title: string;
    subtitle: string;
    pic: {
        name: string;
        role: string;
        whatsapp: string;
        email: string;
    };
    services: ServiceData[];
}

export const BantuanSidebar: React.FC<BantuanSidebarProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'kepegawaian' | 'gtk'>('kepegawaian');
    const [activeServiceId, setActiveServiceId] = useState<string>('pusdatin-kepegawaian');
    const [serviceTab, setServiceTab] = useState<'tentang' | 'pengelola' | 'sop'>('tentang');

    // Data Bantuan
    const bantuanData: Record<'kepegawaian' | 'gtk', PulpenData> = {
        kepegawaian: {
            title: "Pulpen Kepegawaian",
            subtitle: "Pusat Layanan Pendidikan Kepegawaian",
            pic: {
                name: "Ahmad Subarjo, S.Kom",
                role: "Koordinator Layanan Kepegawaian",
                whatsapp: "+62 812-3456-7890",
                email: "kepegawaian.disdik@sultengprov.go.id"
            },
            services: [
                {
                    id: "pusdatin-kepegawaian",
                    name: "Pusat Data dan Informasi",
                    icon: "mdi:database-search-outline",
                    iconBg: "bg-blue-600",
                    iconText: "text-white",
                    readTime: "3 Menit",
                    peran: "Cabdis & Sekolah",
                    actors: ["Pemohon", "Admin Operator", "Tim Analis"],
                    description: "Layanan pengolahan, sinkronisasi, verifikasi dan penyajian data statistik kepegawaian pendidik dan tenaga kependidikan di lingkungan Dinas Pendidikan Provinsi Sulawesi Tengah untuk mendukung pengambilan kebijakan berbasis data.",
                    sop: [
                        {
                            title: "Pengajuan permohonan data kepegawaian melalui portal layanan.",
                            actorIdx: 0,
                            persyaratan: "Form Permohonan Data, Akun Portal",
                            waktu: "15 Menit",
                            output: "Tiket Permohonan Data",
                            icon: "mdi:file-document-edit-outline",
                            description: "Mengisi form permohonan data secara digital."
                        },
                        {
                            title: "Verifikasi berkas permohonan oleh admin operator.",
                            actorIdx: 1,
                            persyaratan: "Berkas Usulan Permohonan",
                            waktu: "1 Hari",
                            output: "Checklist Verifikasi Berkas",
                            icon: "mdi:account-check-outline",
                            description: "Pemeriksaan kelengkapan administrasi oleh tim operator."
                        },
                        {
                            title: "Penarikan data dari database service rekap secara berkala.",
                            actorIdx: 1,
                            persyaratan: "Server Service Rekap Active",
                            waktu: "2 Jam",
                            output: "Raw Data Rekapitulasi",
                            icon: "mdi:database-sync",
                            description: "Sistem menarik data terbaru sesuai filter."
                        },
                        {
                            title: "Validasi kesesuaian data oleh tim analis.",
                            actorIdx: 2,
                            persyaratan: "Kriteria Data Valid, Tools Analisis",
                            waktu: "1 Hari",
                            output: "Draf Laporan Statistik Valid",
                            icon: "mdi:check-decagram-outline",
                            description: "Analisis keakuratan data sebelum diterbitkan."
                        },
                        {
                            title: "Penyerahan laporan data kepada pemohon.",
                            actorIdx: 0,
                            persyaratan: "Laporan Hasil Cetak/PDF",
                            waktu: "30 Menit",
                            output: "Dokumen Laporan Diterima",
                            icon: "mdi:file-certificate-outline",
                            description: "Laporan data diserahkan dan tiket ditutup."
                        }
                    ]
                },
                {
                    id: "layanan-kepegawaian",
                    name: "Layanan Kepegawaian",
                    icon: "mdi:account-badge-outline",
                    iconBg: "bg-indigo-600",
                    iconText: "text-white",
                    readTime: "4 Menit",
                    peran: "ASN & PPPK",
                    actors: ["Pegawai (ASN/PPPK)", "Tim Verifikator", "BKD Provinsi"],
                    description: "Layanan administrasi kepegawaian berkala, meliputi pengajuan kenaikan pangkat, gaji berkala, pensiun, mutasi, serta pemutakhiran berkas administrasi fisik dan digital bagi seluruh ASN dan PPPK.",
                    sop: [
                        {
                            title: "Upload berkas persyaratan administrasi (SK, Ijazah, dll) ke aplikasi Kepegawaian.",
                            actorIdx: 0,
                            persyaratan: "SK Pangkat Terakhir, Ijazah",
                            waktu: "1 Jam",
                            output: "Berkas Terunggah di Portal",
                            icon: "mdi:cloud-upload-outline",
                            description: "Mengunggah file berkas kepegawaian secara lengkap."
                        },
                        {
                            title: "Pemeriksaan kelengkapan dokumen oleh tim verifikator bidang terkait.",
                            actorIdx: 1,
                            persyaratan: "Berkas Administrasi Lengkap",
                            waktu: "2 Hari",
                            output: "Status Berkas \"Memenuhi Syarat\"",
                            icon: "mdi:file-eye-outline",
                            description: "Verifikasi berkas digital dengan database pusat."
                        },
                        {
                            title: "Proses penerbitan rekomendasi / nota usul ke BKD.",
                            actorIdx: 1,
                            persyaratan: "Rekomendasi Bidang",
                            waktu: "3 Hari",
                            output: "Surat Rekomendasi Dinas / Nota Usul",
                            icon: "mdi:file-send-outline",
                            description: "Pembuatan nota rekomendasi resmi dinas ke BKD."
                        },
                        {
                            title: "Penerimaan keputusan persetujuan berkas.",
                            actorIdx: 2,
                            persyaratan: "Persetujuan Teknis BKD",
                            waktu: "7 Hari",
                            output: "Surat Keputusan (SK) BKD",
                            icon: "mdi:email-check-outline",
                            description: "BKD menerbitkan keputusan persetujuan administrasi."
                        },
                        {
                            title: "Distribusi SK fisik/digital kepada pegawai bersangkutan.",
                            actorIdx: 0,
                            persyaratan: "Arsip Digital SK",
                            waktu: "1 Hari",
                            output: "SK diterima oleh Pegawai",
                            icon: "mdi:clipboard-check-outline",
                            description: "Pegawai menerima SK asli fisik / digital di akun masing-masing."
                        }
                    ]
                }
            ]
        },
        gtk: {
            title: "Pulpen GTK",
            subtitle: "Pusat Layanan Pendidikan Guru & Tenaga Kependidikan",
            pic: {
                name: "Dr. Sri Wahyuni, M.Pd",
                role: "Kepala Bidang Guru & Tenaga Kependidikan",
                whatsapp: "+62 811-9876-5432",
                email: "gtk.disdik@sultengprov.go.id"
            },
            services: [
                {
                    id: "pusdatin-gtk",
                    name: "Pusat Data dan Informasi",
                    icon: "mdi:folder-account-outline",
                    iconBg: "bg-emerald-600",
                    iconText: "text-white",
                    readTime: "3 Menit",
                    peran: "Sekolah & Guru",
                    actors: ["Operator Sekolah", "Kemendikbudristek", "Dinas Pendidikan"],
                    description: "Pengelolaan basis data khusus Guru dan Tenaga Kependidikan (GTK) terintegrasi dengan Data Pokok Pendidikan (Dapodik), analisis kebutuhan guru riil (analisis beban kerja/ABK), pemetaan sebaran guru, sertifikasi, serta pemenuhan jam mengajar.",
                    sop: [
                        {
                            title: "Sekolah melakukan update berkala pada aplikasi Dapodik lokal.",
                            actorIdx: 0,
                            persyaratan: "PC/Laptop, Berkas Profil GTK",
                            waktu: "Mandiri",
                            output: "Aplikasi Dapodik Terupdate",
                            icon: "mdi:laptop",
                            description: "Memasukkan data profil guru dan rombel baru."
                        },
                        {
                            title: "Sinkronisasi data dapodik ke server pusat Kemendikbudristek.",
                            actorIdx: 0,
                            persyaratan: "Jaringan Internet",
                            waktu: "30 Menit",
                            output: "Data Terkirim ke Pusat",
                            icon: "mdi:cloud-upload",
                            description: "Sinkronisasi data sekolah ke server Dapodik pusat."
                        },
                        {
                            title: "Penarikan data sinkronisasi oleh portal Dinas Pendidikan.",
                            actorIdx: 2,
                            persyaratan: "Koneksi API Service Rekap",
                            waktu: "1 Jam",
                            output: "Database Provinsi Terupdate",
                            icon: "mdi:download-network-outline",
                            description: "Dinas menarik data terbaru dari server pusat."
                        },
                        {
                            title: "Analisis sebaran dan pemetaan ideal guru di tiap satuan pendidikan.",
                            actorIdx: 2,
                            persyaratan: "Rumus Rasio ABK",
                            waktu: "2 Hari",
                            output: "Peta Sebaran & Analisis Guru",
                            icon: "mdi:chart-pie-outline",
                            description: "Menganalisis sebaran guru per mata pelajaran."
                        },
                        {
                            title: "Penyusunan laporan neraca guru provinsi secara periodik.",
                            actorIdx: 2,
                            persyaratan: "Hasil Analisis Pemetaan",
                            waktu: "3 Hari",
                            output: "Laporan Neraca Guru Provinsi",
                            icon: "mdi:chart-box-outline",
                            description: "Penyusunan dokumen formal laporan neraca guru."
                        }
                    ]
                }
            ]
        }
    };

    // Auto-select first service and reset right tab to 'tentang' when active tab changes
    useEffect(() => {
        const firstService = bantuanData[activeTab].services[0];
        if (firstService) {
            setActiveServiceId(firstService.id);
        }
        setServiceTab('tentang');
    }, [activeTab]);

    const currentTab = bantuanData[activeTab];
    const currentService = currentTab.services.find(s => s.id === activeServiceId) || currentTab.services[0];

    return (
        <div className={`fixed inset-y-0 left-0 w-full bg-[#f8fafc] shadow-2xl z-[1000] transform transition-transform duration-500 ease-in-out border-r border-slate-100 ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>

            {/* Background Image Layer */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{ backgroundImage: "url('/images/cmd/bc-cmdcenter-bg.webp')" }}
            />

            {/* Light Overlay for Glassmorphism */}
            <div className="absolute inset-0 bg-slate-50/90 pointer-events-none" />

            <div className="h-full container flex flex-col relative z-10">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md bg-white/70 sticky top-0 z-30 no-print">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-slate-900 text-lg tracking-tight">Pusat Layanan & Bantuan (Customer Center)</span>
                        <p className="text-[10px] font-semibold text-slate-500">SOP & Pusat Bantuan Layanan Pendidikan Provinsi Sulawesi Tengah</p>
                    </div>

                    {/* PIC Contact Details in Sticky Header */}
                    <div className="flex items-center gap-4 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200/40">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-100 shrink-0">
                                <Icon icon="mdi:card-account-phone-outline" className="text-lg" />
                            </div>
                            <div>
                                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block">PIC {currentTab.title}</span>
                                <h4 className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">{currentTab.pic.name}</h4>
                                <p className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">{currentTab.pic.role}</p>
                            </div>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <a
                                href={`https://wa.me/${currentTab.pic.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                                <Icon icon="mdi:whatsapp" className="text-xs" />
                                WhatsApp
                            </a>
                            <a
                                href={`mailto:${currentTab.pic.email}`}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                                <Icon icon="mdi:email-outline" className="text-xs" />
                                Email
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-400 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="px-6 py-3 border-b border-slate-200/60 bg-white/60 backdrop-blur-md flex gap-2 no-print z-20">
                    <button
                        onClick={() => setActiveTab('kepegawaian')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'kepegawaian' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100/80'}`}
                    >
                        <Icon icon="mdi:account-tie-outline" className="text-base" />
                        Pulpen Kepegawaian
                    </button>
                    <button
                        onClick={() => setActiveTab('gtk')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'gtk' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100/80'}`}
                    >
                        <Icon icon="mdi:school-outline" className="text-base" />
                        Pulpen GTK
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-8 p-6 relative z-10">

                    {/* LEFT COLUMN: Service Cards Navigation (1/3 Width on Large Screens) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-hidden h-full">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 shrink-0">Daftar Panduan Layanan</span>
                        
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-3 pb-6">
                            {currentTab.services.map((service) => {
                                const isActive = service.id === activeServiceId;
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => {
                                            setActiveServiceId(service.id);
                                            setServiceTab('tentang');
                                        }}
                                        className={`p-5 rounded-3xl cursor-pointer transition-all duration-300 border flex gap-4 ${
                                            isActive
                                                ? "bg-white border-blue-500 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20"
                                                : "bg-white/60 hover:bg-white border-slate-200/60 hover:border-slate-300"
                                        }`}
                                    >
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                            isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                                        }`}>
                                            <Icon icon={service.icon} className="text-xl" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold">{service.readTime}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 mt-1 leading-snug">
                                                {service.name}
                                            </h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Active Service Detailed SOP (2/3 Width on Large Screens) */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6 overflow-hidden h-full">
                        
                        {/* Service Sub-Tab Bar */}
                        <div className="flex gap-2 border-b border-slate-200/60 pb-3 no-print shrink-0">
                            <button
                                onClick={() => setServiceTab('tentang')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${serviceTab === 'tentang' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                Tentang Layanan
                            </button>
                            <button
                                onClick={() => setServiceTab('pengelola')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${serviceTab === 'pengelola' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                Pengelola
                            </button>
                            <button
                                onClick={() => setServiceTab('sop')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${serviceTab === 'sop' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                SOP (Matriks Alur)
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-6 pb-6">
                            {serviceTab === 'tentang' && (
                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="flex flex-wrap gap-2 items-center relative z-10">
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                            Peran: {currentService.peran}
                                        </span>
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            Estimasi membaca: {currentService.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 relative z-10 leading-tight">
                                        {currentService.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                                        {currentService.description}
                                    </p>
                                </div>
                            )}

                            {serviceTab === 'pengelola' && (
                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 flex flex-col gap-6 relative overflow-hidden">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Icon icon="mdi:account-cog" className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Unit Pengelola Layanan</h3>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Dinas Pendidikan Provinsi Sulawesi Tengah</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                <Icon icon="mdi:account-tie" className="text-lg" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PIC Bidang</div>
                                                <div className="text-sm font-bold text-slate-800 mt-0.5">{currentTab.pic.name}</div>
                                                <div className="text-xs font-semibold text-slate-500">{currentTab.pic.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                <Icon icon="mdi:shield-check" className="text-lg" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Sasaran Layanan</div>
                                                <div className="text-sm font-bold text-slate-800 mt-0.5">{currentService.peran}</div>
                                                <div className="text-xs font-semibold text-slate-500">Layanan ini dikhususkan bagi target sasaran di lingkungan Provinsi.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {serviceTab === 'sop' && (
                                <div className="w-full bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl shadow-slate-100/50">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-left text-xs font-semibold">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="p-3 text-center border-r border-slate-200 text-slate-500 font-bold uppercase w-10">No.</th>
                                                    <th className="p-3 border-r border-slate-200 text-slate-500 font-bold uppercase min-w-[180px]">Aktivitas</th>
                                                    <th 
                                                        className="p-1 border-r border-slate-200 text-slate-500 font-bold uppercase text-center"
                                                        colSpan={currentService.actors.length}
                                                    >
                                                        <div className="border-b border-slate-200 py-1.5 mb-1 text-[10px] font-black tracking-wider">Pelaksana</div>
                                                        <div className="flex">
                                                            {currentService.actors.map((actor, idx) => (
                                                                <div 
                                                                    key={idx} 
                                                                    className={`flex-1 text-[9px] font-extrabold px-1 truncate ${idx < currentService.actors.length - 1 ? 'border-r border-slate-100' : ''}`}
                                                                    title={actor}
                                                                >
                                                                    {actor}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </th>
                                                    <th 
                                                        className="p-1 border-slate-200 text-slate-500 font-bold uppercase text-center"
                                                        colSpan={3}
                                                    >
                                                        <div className="border-b border-slate-200 py-1.5 mb-1 text-[10px] font-black tracking-wider">Mutu Baku</div>
                                                        <div className="flex">
                                                            <div className="flex-1 text-[9px] font-extrabold border-r border-slate-100 px-1 min-w-[100px]">Persyaratan</div>
                                                            <div className="w-16 text-[9px] font-extrabold border-r border-slate-100 px-1">Waktu</div>
                                                            <div className="flex-1 text-[9px] font-extrabold px-1 min-w-[100px]">Output</div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentService.sop.map((step, rIdx) => {
                                                    const lastIdx = currentService.sop.length - 1;
                                                    const prevActorIdx = rIdx > 0 ? currentService.sop[rIdx - 1].actorIdx : -1;

                                                    return (
                                                        <tr key={rIdx} className="border-b border-slate-150 hover:bg-slate-50/50 transition-colors">
                                                            
                                                            {/* Step Number */}
                                                            <td className="p-3 text-center border-r border-slate-200 font-bold text-slate-400 bg-slate-50/20">{rIdx + 1}</td>
                                                            
                                                            {/* Activity Title */}
                                                            <td className="p-3 border-r border-slate-200 text-slate-700 font-medium leading-relaxed">{step.title}</td>
                                                            
                                                            {/* Pelaksana Columns with Flowchart connections */}
                                                            {currentService.actors.map((_, aIdx) => {
                                                                const isCurr = aIdx === step.actorIdx;
                                                                const minVal = Math.min(prevActorIdx, step.actorIdx);
                                                                const maxVal = Math.max(prevActorIdx, step.actorIdx);
                                                                const inHorizontalRange = rIdx > 0 && aIdx >= minVal && aIdx <= maxVal;

                                                                return (
                                                                    <td 
                                                                        key={aIdx} 
                                                                        className={`p-0 text-center border-r border-slate-200 relative h-16 w-24 shrink-0 bg-slate-50/5`}
                                                                    >
                                                                        {/* Top Horizontal Flow Connector */}
                                                                        {inHorizontalRange && (
                                                                            <div 
                                                                                className={`absolute top-0 h-0.5 bg-blue-500/80 ${
                                                                                    aIdx === minVal 
                                                                                        ? 'left-1/2 right-0' 
                                                                                        : aIdx === maxVal 
                                                                                            ? 'left-0 right-1/2' 
                                                                                            : 'left-0 right-0'
                                                                                }`} 
                                                                            />
                                                                        )}

                                                                        {/* Top Vertical Connector */}
                                                                        {rIdx > 0 && isCurr && (
                                                                            <div className="absolute top-0 bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 bg-blue-500/80" />
                                                                        )}

                                                                        {/* Bottom Vertical Connector */}
                                                                        {rIdx < lastIdx && isCurr && (
                                                                            <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-blue-500/80" />
                                                                        )}

                                                                        {/* Process / Node Symbol */}
                                                                        {isCurr && (
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <div 
                                                                                    className={`w-7 h-7 flex items-center justify-center text-white text-[10px] font-black shadow-md border ${
                                                                                        rIdx === 0 
                                                                                            ? 'rounded-full bg-emerald-500 border-emerald-600 shadow-emerald-100' // Start node
                                                                                            : rIdx === lastIdx 
                                                                                                ? 'rounded-full bg-rose-500 border-rose-600 shadow-rose-100' // End node
                                                                                                : 'rounded-lg bg-blue-600 border-blue-700 shadow-blue-100' // Step node
                                                                                    } relative z-10 transition-transform hover:scale-110`}
                                                                                    title={step.description}
                                                                                >
                                                                                    <Icon icon={step.icon} className="text-xs" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                );
                                                            })}

                                                            {/* Mutu Baku: Persyaratan */}
                                                            <td className="p-3 border-r border-slate-200 text-slate-500 font-medium leading-relaxed min-w-[100px]">{step.persyaratan}</td>
                                                            
                                                            {/* Mutu Baku: Waktu */}
                                                            <td className="p-3 border-r border-slate-200 text-slate-600 font-bold text-center w-16 shrink-0">{step.waktu}</td>
                                                            
                                                            {/* Mutu Baku: Output */}
                                                            <td className="p-3 text-slate-600 font-semibold leading-relaxed min-w-[100px]">{step.output}</td>

                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .glass-card { 
                        border: 1px solid #e2e8f0 !important; 
                        box-shadow: none !important; 
                        break-inside: avoid; 
                        margin-bottom: 24px !important;
                        background: white !important;
                        border-radius: 1rem !important;
                    }
                    body { background: white !important; overflow: visible !important; }
                    .fixed { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: auto !important; transform: none !important; overflow: visible !important; }
                    .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    .flex-1 { overflow: visible !important; }
                    .overflow-y-auto { overflow: visible !important; height: auto !important; }
                    .h-full { height: auto !important; }
                    .grid { display: block !important; }
                }
            `}</style>

        </div>
    );
};
