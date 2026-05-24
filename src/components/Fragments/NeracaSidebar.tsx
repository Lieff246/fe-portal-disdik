import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Chart from 'react-apexcharts';
import { X, Sparkles, Download, Loader2 } from 'lucide-react';
import { PortalService } from '@/services/portalService';

interface NeracaSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    initialNeracaData: any;
}

export const NeracaSidebar: React.FC<NeracaSidebarProps> = ({ isOpen, onClose, initialNeracaData }) => {
    const [neracaData, setNeracaData] = useState(initialNeracaData);
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [filters, setFilters] = useState({
        kabupaten_kota: '',
        status_kepegawaian: ''
    });

    const fetchNeraca = useCallback(async (currentFilters: any) => {
        setLoading(true);
        try {
            const data = await PortalService.getNeraca(currentFilters);
            setNeracaData(data);
        } catch (error) {
            console.error('Failed to fetch filtered neraca:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialNeracaData) {
                setNeracaData(initialNeracaData);
            } else if (!neracaData) {
                fetchNeraca(filters);
            }
        }
    }, [isOpen, initialNeracaData, neracaData, fetchNeraca, filters]);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        fetchNeraca(newFilters);
    };

    const generateAIInsight = (title: string, data: any) => {
        if (!data) return "Analisis data sedang diproses...";

        if (title === 'Proporsi Jenis Kelamin') {
            const l = data['L'] || 0;
            const p = data['P'] || 0;
            const dominant = l > p ? 'Laki-laki' : 'Perempuan';
            const diff = Math.abs(l - p);
            return `Terdapat dominasi personel ${dominant} dengan selisih ${diff} jiwa. Hal ini menunjukkan dinamika distribusi gender yang perlu diperhatikan dalam kebijakan kesejahteraan.`;
        }

        if (title === 'Distribusi Usia') {
            const keys = Object.keys(data);
            const values = Object.values(data) as number[];
            const maxIdx = values.indexOf(Math.max(...values));
            return `Kelompok usia ${keys[maxIdx]} merupakan populasi terbesar. Strategi regenerasi dan persiapan masa pensiun harus difokuskan pada segmen usia produktif akhir.`;
        }

        if (title === 'Sertifikasi') {
            return "Tingkat sertifikasi menunjukkan progres positif di jenjang SMA. Fokus peningkatan kompetensi perlu diarahkan pada sekolah dengan rasio sertifikasi rendah.";
        }

        return "Data menunjukkan tren stabil dengan pertumbuhan yang konsisten di berbagai indikator utama kepegawaian provinsi.";
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const blob = await PortalService.downloadNeracaPdf(filters);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Statistik_Pendidikan_${filters.kabupaten_kota || 'Sulteng'}_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className={`fixed inset-y-0 left-0 w-full bg-white shadow-2xl z-[1000] transform transition-transform duration-500 ease-in-out border-r border-slate-100 ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>

            {/* Background Image Layer - Opacity dihilangkan agar tampil 100% */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{ backgroundImage: "url('/images/cmd/bc-cmdcenter-bg.webp')" }}
            />

            {/* Light Overlay - Menggunakan bg-white/85 untuk efek kaca/pudar yang pas */}
            <div className="absolute inset-0 bg-white/85 pointer-events-none" />

            <div className="h-full container flex flex-col relative z-10">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between backdrop-blur-md bg-white/50 sticky top-0 z-30 no-print">
                    <div className="flex items-center gap-6">
                        <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
                        <div className="h-8 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kabupaten</span>
                                <select
                                    className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                                    value={filters.kabupaten_kota}
                                    onChange={(e) => handleFilterChange('kabupaten_kota', e.target.value)}
                                >
                                    <option value="">Semua Wilayah</option>
                                    {(neracaData?.filter_options?.kabupaten_kota || []).map((opt: string) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <select
                                    className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500"
                                    value={filters.status_kepegawaian}
                                    onChange={(e) => handleFilterChange('status_kepegawaian', e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    {(neracaData?.filter_options?.status_kepegawaian || []).map((opt: string) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting || loading || !neracaData}
                            className={`flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isExporting ? 'Generating PDF...' : 'Export Statistik (PDF)'}
                        </button>
                        <button onClick={onClose} className="p-3 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {!neracaData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Data Neraca...</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6 relative z-10">
                        {/* Grid 1: Jenis Kelamin & Rentang Usia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Proporsi Jenis Kelamin</h4>
                                    <Icon icon="mdi:gender-male-female" className="text-rose-500 text-lg" />
                                </div>
                                <Chart
                                    type="donut"
                                    width="100%"
                                    height={320}
                                    series={Object.values(neracaData.lp || {}) as number[]}
                                    options={{
                                        labels: Object.keys(neracaData.lp || {}).map(k => k === 'L' ? 'Laki-laki' : 'Perempuan'),
                                        colors: ['#0EA5E9', '#F43F5E'],
                                        legend: { position: 'bottom', fontSize: '14px', fontWeight: 400 } as any,
                                        plotOptions: { pie: { donut: { size: '70%' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 400 } }
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">AI Insights</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        {generateAIInsight('Proporsi Jenis Kelamin', neracaData.lp)}
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Distribusi Rentang Usia</h4>
                                    <Icon icon="mdi:calendar-range" className="text-amber-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={350}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.age_ranges || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, distributed: true } } as any,
                                        colors: ['#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E'],
                                        xaxis: { categories: Object.keys(neracaData.age_ranges || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        dataLabels: { enabled: false } as any,
                                        legend: { show: false } as any
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-amber-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Analisis Demografi</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        {generateAIInsight('Distribusi Usia', neracaData.age_ranges)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid 2: Status Pendidik & Jam Mengajar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Status Pendidik</h4>
                                    <Icon icon="mdi:account-tie" className="text-indigo-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={450}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.status_kepegawaian || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '50%' } } as any,
                                        colors: ['#6366F1'],
                                        xaxis: { categories: Object.keys(neracaData.status_kepegawaian || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 400 } } as any
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Analisis Kepegawaian</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        {generateAIInsight('Status Pendidik', neracaData.status_kepegawaian)}
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Jam Mengajar / Minggu</h4>
                                    <Icon icon="mdi:clock-outline" className="text-emerald-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={350}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.jam_mengajar_perminggu || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        colors: ['#10B981'],
                                        xaxis: { categories: Object.keys(neracaData.jam_mengajar_perminggu || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 400 } } as any
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Beban Kerja</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        Rasio jam mengajar menunjukkan efisiensi distribusi tugas pendidik di wilayah kerja terkait.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid 3: Tersertifikasi & Rekap Pendidikan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Pendidik Tersertifikasi</h4>
                                    <Icon icon="mdi:certificate" className="text-blue-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={350}
                                    series={[
                                        { name: 'Sudah', data: ['SMA', 'SMK', 'SLB'].map(l => neracaData.sertifikasi_per_level?.[l]?.['Sudah'] || 0) },
                                        { name: 'Belum', data: ['SMA', 'SMK', 'SLB'].map(l => neracaData.sertifikasi_per_level?.[l]?.['Belum'] || 0) }
                                    ]}
                                    options={{
                                        chart: { stacked: true, stackType: '100%', toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        colors: ['#10B981', '#F59E0B'],
                                        xaxis: { categories: ['SMA', 'SMK', 'SLB'], labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        legend: { position: 'bottom', fontSize: '14px', fontWeight: 400 } as any,
                                        dataLabels: { enabled: true, formatter: (val: any) => val.toFixed(0) + '%', style: { fontSize: '14px', fontWeight: 400 } }
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Analisis Sertifikasi</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        {generateAIInsight('Sertifikasi', neracaData.sertifikasi_per_level)}
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Rekap Pendidikan</h4>
                                    <Icon icon="mdi:school" className="text-purple-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={450}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.rekap_pendidikan || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } } as any,
                                        colors: ['#A855F7'],
                                        xaxis: { categories: Object.keys(neracaData.rekap_pendidikan || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 400 } } as any
                                    } as any}
                                />
                                <div className="mt-6 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-purple-600">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Kualifikasi Akademik</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        Profil pendidikan mencerminkan standar profesionalisme tenaga pendidik di lingkungan provinsi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid 1 Column: Pangkat & Sebaran Wilayah */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Pangkat & Golongan</h4>
                                    <Icon icon="mdi:shield-star-outline" className="text-amber-600 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={350}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.pangkat_gol || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        xaxis: { categories: Object.keys(neracaData.pangkat_gol || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        colors: ['#D97706'],
                                        dataLabels: { enabled: false } as any
                                    } as any}
                                />
                            </div>

                            <div className="glass-card p-6 rounded-[2rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-slate-700">Sebaran Wilayah</h4>
                                    <Icon icon="mdi:map-marker-multiple" className="text-emerald-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={800}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.kabupaten_kota || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '70%' } } as any,
                                        colors: ['#10B981'],
                                        xaxis: { categories: Object.keys(neracaData.kabupaten_kota || {}), labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        yaxis: { labels: { style: { fontSize: '14px', fontWeight: 400 } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '14px', fontWeight: 400 } } as any
                                    } as any}
                                />
                            </div>
                        </div>
                    </div>
                )}
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
                    .md\\:grid-cols-2 { grid-template-columns: 1fr !important; }
                    .space-y-6 > * { margin-top: 24px !important; }
                    canvas { max-width: 100% !important; }
                }
            `}</style>
        </div>
    );
};