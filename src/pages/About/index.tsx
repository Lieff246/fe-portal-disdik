import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { PortalService } from '@/services/portalService';
import { motion, AnimatePresence } from 'framer-motion';

const About: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeApp, setActiveApp] = useState<number | null>(null);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PortalService.getAboutInfo();
        setApps(data);
        if (data && data.length > 0) {
            setActiveApp(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch about info", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFeature = (versionId: number, featureIdx: number) => {
    const key = `${versionId}-${featureIdx}`;
    setExpandedFeatures(prev => ({
        ...prev,
        [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-inter transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Ekosistem Digital Dinas Pendidikan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto"
          >
            Platform terpadu untuk pelayanan publik, manajemen tenaga kependidikan, dan analitik data cerdas demi kemajuan pendidikan di Provinsi Sulawesi Tengah.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Apps & Features Section */}
            <div className="space-y-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {apps.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => setActiveApp(app.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                                activeApp === app.id 
                                ? 'bg-blue-600 text-white shadow-blue-500/30' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {app.icon && <Icon icon={app.icon} className="text-lg" />}
                            {app.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {apps.map((app) => (
                        <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ 
                                opacity: activeApp === app.id ? 1 : 0.4, 
                                scale: activeApp === app.id ? 1 : 0.95,
                                display: activeApp === app.id ? 'block' : 'none'
                            }}
                            className="lg:col-span-3 bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-none backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Icon icon={app.icon || 'mdi:application'} className="text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{app.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{app.description}</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8 mt-8">
                                <div className="lg:col-span-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                        <Icon icon="mdi:star-circle" className="text-amber-500" /> Fitur Utama
                                    </h3>
                                    <div className="space-y-4">
                                        {app.features?.map((feature: any) => (
                                            <div key={feature.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">{feature.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-8">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                        <Icon icon="mdi:history" className="text-emerald-500" /> Version History (Changelog)
                                    </h3>
                                    <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                                        {app.versions?.length > 0 ? app.versions.map((version: any) => (
                                            <div key={version.id} className="relative">
                                                <div className="absolute -left-[27px] flex items-center justify-center w-5 h-5 rounded-full border-4 border-slate-50 dark:border-[#0f172a] bg-emerald-500 z-10 shadow-sm">
                                                </div>
                                                
                                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-lg">
                                                                {version.version_string}
                                                            </span>
                                                            <h4 className="font-bold text-slate-800 dark:text-white">{version.title}</h4>
                                                        </div>
                                                        <time className="text-xs font-medium text-slate-400">
                                                            {new Date(version.release_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </time>
                                                    </div>
                                                    
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{version.description}</p>
                                                    
                                                    {version.features && (
                                                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                                                            {version.features.map((f: any, i: number) => {
                                                                const isObject = typeof f === 'object' && f !== null;
                                                                const featureText = isObject ? f.feature : f;
                                                                const problem = isObject ? f.problem : null;
                                                                const solution = isObject ? f.solution : null;
                                                                const isExpanded = expandedFeatures[`${version.id}-${i}`];

                                                                return (
                                                                    <div key={i} className="group">
                                                                        <div 
                                                                            onClick={() => (problem || solution) && toggleFeature(version.id, i)}
                                                                            className={`flex items-start gap-2 text-xs py-1 transition-colors ${(problem || solution) ? 'cursor-pointer hover:text-blue-500' : ''}`}
                                                                        >
                                                                            <Icon icon="mdi:check-circle" className="text-emerald-500 mt-0.5 shrink-0" />
                                                                            <span className="font-medium text-slate-700 dark:text-slate-300">{featureText}</span>
                                                                            {(problem || solution) && (
                                                                                <Icon 
                                                                                    icon="mdi:chevron-down" 
                                                                                    className={`ml-auto text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <AnimatePresence>
                                                                            {isExpanded && (problem || solution) && (
                                                                                <motion.div
                                                                                    initial={{ height: 0, opacity: 0 }}
                                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                                    exit={{ height: 0, opacity: 0 }}
                                                                                    className="overflow-hidden"
                                                                                >
                                                                                    <div className="ml-5 mt-1 mb-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                                                                                        {problem && (
                                                                                            <div className="space-y-1">
                                                                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                                                                                                    <Icon icon="mdi:alert-circle-outline" className="text-sm" /> Permasalahan
                                                                                                </div>
                                                                                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                                                                    "{problem}"
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {solution && (
                                                                                            <div className="space-y-1">
                                                                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                                                                                    <Icon icon="mdi:check-decagram-outline" className="text-sm" /> Solusi Implementasi
                                                                                                </div>
                                                                                                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                                                                    {solution}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </motion.div>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-sm text-slate-400 italic text-center w-full py-8">Belum ada riwayat versi untuk aplikasi ini.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Kepegawaian Admin Ecosystem Workflow */}
            <div className="mt-24">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-black mb-4">Ekosistem Kepegawaian Admin</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Sistem manajemen kepegawaian dirancang dengan prinsip **Role-Based Access Control (RBAC)** dan isolasi data yang sangat ketat untuk memastikan keamanan dan validitas layanan digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Icon icon="mdi:shield-account" className="text-indigo-500 text-2xl" /> Struktur Hak Akses (Level/Role)
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                    <Icon icon="mdi:school" className="text-2xl text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Admin Sekolah (`school`)</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hanya memiliki akses penuh terhadap data Guru dan Pegawai yang berstatus aktif di instansi sekolah tersebut. Bertugas untuk memvalidasi kelengkapan awal berkas dan mengunggah dokumen usulan (misal: KGB, Pangkat) pada tahap `Draft`, sebelum akhirnya ditekan tombol *Telah Mengajukan* agar masuk ke Cabang Dinas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                    <Icon icon="mdi:domain" className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Verifikator Cabang Dinas (`cabang_dinas`)</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mengawasi seluruh sekolah yang berada di dalam wilayah administratifnya (Regional). Berfungsi sebagai Verifikator Tingkat 1. Mereka akan memeriksa berkas dari sekolah. Jika tidak lengkap, status dikembalikan menjadi `Perbaikan dari Cabdis`. Jika lengkap, di-acc menjadi `Telah diperiksa Cabdis` dan diteruskan ke Dinas Provinsi.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                    <Icon icon="mdi:office-building-cog" className="text-2xl text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">3. Pengelola Layanan Kepegawaian (`admin_kepegawaian` / `dinas`)</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Akses eksklusif Dinas Pendidikan Provinsi. Berlaku sebagai Validator Akhir (Tingkat 2). Dapat melihat semua usulan lintas wilayah Cabdis. Setelah berkas dinyatakan valid, status berubah menjadi `Telah disetujui Dinas` yang mengindikasikan siap dikirimkan ke Badan Kepegawaian Daerah (BKD).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                    <Icon icon="mdi:account-tie-hat" className="text-2xl text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">4. Pengelola Data Kepegawaian (`pengelola_data`)</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peran khusus bagi PIC di internal Dinas Provinsi (Non-Sekolah). Bertanggung jawab melakukan pengelolaan data pegawai secara menyeluruh serta melakukan pengawasan terhadap layanan kepegawaian bagi staf yang bukan merupakan guru di sekolah (berdasarkan Prefix ID: `SUB`). Fungsinya identik dengan admin sekolah dalam hal usulan, namun dengan cakupan yang terisolasi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Icon icon="mdi:transit-connection-variant" className="text-indigo-500 text-2xl" /> Alur Pelayanan (Workflow)
                        </h3>
                        
                        <div className="flex-1 flex flex-col justify-center space-y-2 relative">
                            {/* Line connecting the workflow */}
                            <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-100 dark:bg-slate-700 z-0"></div>
                            
                            {[
                                { status: 'Draft', desc: 'Pembuatan usulan dan upload dokumen oleh Admin Sekolah atau Pengelola Data.', icon: 'mdi:pencil-outline', color: 'bg-slate-200 text-slate-600' },
                                { status: 'Telah Mengajukan', desc: 'Usulan dikirim ke Cabang Dinas untuk verifikasi berkas tahap 1.', icon: 'mdi:file-send-outline', color: 'bg-blue-100 text-blue-600' },
                                { status: 'Perbaikan / Tolak', desc: 'Jika berkas kurang, dikembalikan ke tahap Perbaikan (Cabdis/Dinas) atau TMS (Tidak Memenuhi Syarat).', icon: 'mdi:alert-circle-outline', color: 'bg-rose-100 text-rose-600' },
                                { status: 'Telah Diperiksa Cabdis', desc: 'Berkas valid secara wilayah dan diteruskan ke Dinas Provinsi.', icon: 'mdi:check-all', color: 'bg-indigo-100 text-indigo-600' },
                                { status: 'Telah Disetujui Dinas', desc: 'Validasi akhir oleh Dinas Pendidikan. Berkas siap di-ekspor.', icon: 'mdi:check-decagram', color: 'bg-purple-100 text-purple-600' },
                                { status: 'Telah Dikirim ke BKD', desc: 'Dokumen fisik / digital diserahkan secara massal ke BKD Provinsi.', icon: 'mdi:bank-transfer', color: 'bg-amber-100 text-amber-600' },
                                { status: 'SK Terbit', desc: 'Tahap final. SK berhasil diterbitkan oleh BKD dan diunggah kembali ke sistem untuk diunduh pegawai.', icon: 'mdi:certificate', color: 'bg-emerald-100 text-emerald-600' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative z-10 flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${step.color.replace('bg-', 'bg-').replace('100', '100 dark:bg-opacity-20').replace('text-', 'text-').replace('600', '600 dark:text-opacity-80')}`}>
                                        <Icon icon={step.icon} className="text-2xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{step.status}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default About;
