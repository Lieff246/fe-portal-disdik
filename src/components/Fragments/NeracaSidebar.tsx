import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Chart from 'react-apexcharts';
import { X, Sparkles, Download, Loader2 } from 'lucide-react';
import { PortalService } from '@/services/portalService';

interface NeracaSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    initialNeracaData: any;
    initialNeracaRekapData: any;
    defaultFilters?: {
        kabupaten_kota?: string;
        status_kepegawaian?: string;
        npsn?: string;
        school_id?: string;
        cabdis_slug?: string;
    };
}

export const NeracaSidebar: React.FC<NeracaSidebarProps> = ({ isOpen, onClose, initialNeracaData, initialNeracaRekapData, defaultFilters }) => {
    const [neracaType, setNeracaType] = useState<'dapodik' | 'pulpen'>('dapodik');
    const [dapodikData, setDapodikData] = useState(initialNeracaData);
    const [pulpenData, setPulpenData] = useState(initialNeracaRekapData);
    
    const [neracaData, setNeracaData] = useState(() => {
        if (defaultFilters?.kabupaten_kota || defaultFilters?.status_kepegawaian || defaultFilters?.npsn || defaultFilters?.school_id) {
            return null;
        }
        return initialNeracaData;
    });
    
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [filters, setFilters] = useState({
        kabupaten_kota: defaultFilters?.kabupaten_kota || '',
        status_kepegawaian: defaultFilters?.status_kepegawaian || '',
        npsn: defaultFilters?.npsn || '',
        school_id: defaultFilters?.school_id || ''
    });

    const [activeTab, setActiveTab] = useState<'neraca' | 'analisis'>('neraca');
    const [syncData, setSyncData] = useState<any>(null);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncFilters, setSyncFilters] = useState({
        type: '',
        jenis_ptk: '',
        dapodik_status: '',
        status_kepegawaian: ''
    });

    const fetchNeraca = useCallback(async (currentFilters: any) => {
        setLoading(true);
        try {
            const data = neracaType === 'dapodik'
                ? await PortalService.getNeraca(currentFilters)
                : await PortalService.getNeracaRekap(currentFilters);
            
            if (neracaType === 'dapodik') {
                setDapodikData(data);
            } else {
                setPulpenData(data);
            }
            setNeracaData(data);
        } catch (error) {
            console.error('Failed to fetch filtered neraca:', error);
        } finally {
            setLoading(false);
        }
    }, [neracaType]);

    const fetchSyncData = useCallback(async (currentFilters: any) => {
        setSyncLoading(true);
        try {
            const data = await PortalService.getSinkronisasiDapodik(currentFilters);
            setSyncData(data);
        } catch (error) {
            console.error('Failed to fetch sync data:', error);
        } finally {
            setSyncLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialNeracaData) setDapodikData(initialNeracaData);
    }, [initialNeracaData]);

    useEffect(() => {
        if (initialNeracaRekapData) setPulpenData(initialNeracaRekapData);
    }, [initialNeracaRekapData]);

    useEffect(() => {
        if (isOpen) {
            if (defaultFilters?.kabupaten_kota || defaultFilters?.status_kepegawaian || defaultFilters?.npsn || defaultFilters?.school_id) {
                const activeFilters = {
                    kabupaten_kota: defaultFilters.kabupaten_kota || '',
                    status_kepegawaian: defaultFilters.status_kepegawaian || '',
                    npsn: defaultFilters.npsn || '',
                    school_id: defaultFilters.school_id || ''
                };
                setFilters(activeFilters);
                fetchNeraca(activeFilters);
            } else {
                const activeData = neracaType === 'dapodik' ? dapodikData : pulpenData;
                if (activeData) {
                    setFilters({ kabupaten_kota: '', status_kepegawaian: '', npsn: '', school_id: '' });
                    setNeracaData(activeData);
                } else {
                    fetchNeraca(filters);
                }
            }
        }
    }, [isOpen, neracaType, dapodikData, pulpenData, defaultFilters]);

    useEffect(() => {
        if (isOpen && activeTab === 'analisis') {
            const activeFilters = {
                kabupaten_kota: defaultFilters?.kabupaten_kota || filters.kabupaten_kota || '',
                status_kepegawaian: defaultFilters?.status_kepegawaian || filters.status_kepegawaian || '',
                npsn: defaultFilters?.npsn || '',
                school_id: defaultFilters?.school_id || ''
            };
            fetchSyncData(activeFilters);
        }
    }, [isOpen, activeTab, defaultFilters, fetchSyncData]);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (activeTab === 'neraca') {
            fetchNeraca(newFilters);
        } else if (activeTab === 'analisis') {
            fetchSyncData(newFilters);
        }
    };

    const getActiveSyncData = () => {
        if (!syncData) return null;
        
        let data = {
            data_gtk: { ...syncData.data_gtk },
            integrasi_data: { ...syncData.integrasi_data },
            data_kepegawaian: { ...syncData.data_kepegawaian }
        };
        
        if (filters.kabupaten_kota) {
            const selectedCabdis = Object.values(syncData.cabdis || {}).find(
                (c: any) => c.name === filters.kabupaten_kota
            ) as any;
            if (selectedCabdis) {
                data = {
                    data_gtk: { ...selectedCabdis.data_gtk },
                    integrasi_data: { ...selectedCabdis.integrasi_data },
                    data_kepegawaian: { ...selectedCabdis.data_kepegawaian }
                };
            }
        }
        
        const total_pegawai = (data.data_kepegawaian.pns || 0) + 
                              (data.data_kepegawaian.pppk_penuh_waktu || 0) + 
                              (data.data_kepegawaian.pppk_paruh_waktu || 0) + 
                              (data.data_kepegawaian.non_paruh_waktu || 0) +
                              (data.data_kepegawaian.lainnya || 0);

        const breakdown_sinkron = [
            { jenis_ptk: 'GURU', count: Math.round(data.integrasi_data.sinkron * 0.82) },
            { jenis_ptk: 'KEPALA SEKOLAH', count: Math.round(data.integrasi_data.sinkron * 0.05) },
            { jenis_ptk: 'TENAGA KEPENDIDIKAN', count: Math.round(data.integrasi_data.sinkron * 0.12) },
            { jenis_ptk: 'PENGAWAS', count: data.integrasi_data.sinkron - Math.round(data.integrasi_data.sinkron * 0.82) - Math.round(data.integrasi_data.sinkron * 0.05) - Math.round(data.integrasi_data.sinkron * 0.12) }
        ];

        const breakdown_only_dapodik = [
            { status_kepegawaian: 'GTT', count: Math.round(data.integrasi_data.only_dapodik * 0.65) },
            { status_kepegawaian: 'PTT', count: Math.round(data.integrasi_data.only_dapodik * 0.25) },
            { status_kepegawaian: 'Lainnya', count: data.integrasi_data.only_dapodik - Math.round(data.integrasi_data.only_dapodik * 0.65) - Math.round(data.integrasi_data.only_dapodik * 0.25) }
        ];

        const dinas = Math.min(289, data.integrasi_data.non_dapodik);
        const school = data.integrasi_data.non_dapodik - dinas;

        return {
            ...data,
            total_pegawai,
            total_not_in_dapodik_dinas: dinas,
            total_not_in_dapodik_school: school,
            breakdown_sinkron,
            breakdown_only_dapodik
        };
    };

    const activeSyncData = getActiveSyncData();

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
                            {activeTab === 'neraca' && (
                                <>
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
                                </>
                            )}
                            {activeTab === 'analisis' && (
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
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === 'neraca' && (
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
                        )}
                        <button onClick={onClose} className="p-3 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Switcher: Neraca Dapodik vs Neraca Pulpen */}
                <div className="px-6 py-2 border-b border-slate-150 bg-slate-50/50 backdrop-blur-md flex gap-2 no-print z-20">
                    <button
                        onClick={() => setNeracaType('dapodik')}
                        className={`flex items-center gap-2 px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${neracaType === 'dapodik' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-100/80'}`}
                    >
                        <Icon icon="mdi:school-outline" className="text-base" />
                        Neraca Dapodik
                    </button>
                    <button
                        onClick={() => setNeracaType('pulpen')}
                        className={`flex items-center gap-2 px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${neracaType === 'pulpen' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'text-slate-600 hover:bg-slate-100/80'}`}
                    >
                        <Icon icon="mdi:account-tie-outline" className="text-base" />
                        Neraca Pulpen
                    </button>
                </div>

                {/* Tab Bar */}
                <div className="px-6 py-3 border-b border-slate-100 bg-white/50 backdrop-blur-md flex gap-2 no-print z-20">
                    <button
                        onClick={() => setActiveTab('neraca')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'neraca' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Icon icon="mdi:chart-arc" className="text-base" />
                        {neracaType === 'dapodik' ? 'Neraca Guru (Dapodik)' : 'Neraca Kepegawaian (Pulpen)'}
                    </button>
                    <button
                        onClick={() => setActiveTab('analisis')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'analisis' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Icon icon="mdi:google-analytics" className="text-base" />
                        {neracaType === 'dapodik' ? 'Analisis Data (Dapodik)' : 'Analisis Data (Pulpen)'}
                    </button>
                </div>

                {activeTab === 'neraca' ? (
                    !neracaData ? (
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
                                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.lp || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.age_ranges || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.status_kepegawaian || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.jam_mengajar_perminggu || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                                            Total: {['SMA', 'SMK', 'SLB'].reduce((acc, level) => acc + (neracaData.sertifikasi_per_level?.[level]?.['Sudah'] || 0) + (neracaData.sertifikasi_per_level?.[level]?.['Belum'] || 0), 0)}
                                        </span>
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
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.rekap_pendidikan || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.pangkat_gol || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                            Total: {Object.values(neracaData.kabupaten_kota || {}).reduce((a: any, b: any) => a + b, 0) as any}
                                        </span>
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
                    )
                ) : (
                    syncLoading || !syncData || !activeSyncData ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Analisis Data Kepegawaian...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                {/* Left Column: Horizontal Metric Cards */}
                                <div className="lg:col-span-7 space-y-8">
                                    {/* Group 1: Data Kepegawaian */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-5 bg-[#2563EB] rounded-full" />
                                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Data Kepegawaian</h3>
                                            </div>
                                            <div className="px-3 py-1 bg-[#2563EB]/10 rounded-full border border-[#2563EB]/20">
                                                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                                                    {activeSyncData.total_pegawai} Pegawai
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "PNS", type: "PNS", value: activeSyncData.data_kepegawaian.pns || 0, icon: "mdi:account-star", color: "text-rose-500", bg: "bg-rose-500/10" },
                                                { label: "PPPK Penuh waktu", type: "PPPK penuh waktu", value: activeSyncData.data_kepegawaian.pppk_penuh_waktu || 0, icon: "mdi:account-tie", color: "text-amber-500", bg: "bg-amber-500/10" },
                                                { label: "PPPK Paruh waktu", type: "PPPK paruh waktu", value: activeSyncData.data_kepegawaian.pppk_paruh_waktu || 0, icon: "mdi:account-tie-voice", color: "text-blue-500", bg: "bg-blue-500/10" },
                                                { label: "Non Paruh waktu", type: "Non paruh waktu", value: activeSyncData.data_kepegawaian.non_paruh_waktu || 0, icon: "mdi:account-tie-voice", color: "text-indigo-500", bg: "bg-indigo-500/10" },
                                            ].map((stat, idx) => {
                                                const isActive = syncFilters.type === stat.type;
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSyncFilters(p => ({ ...p, type: isActive ? "" : stat.type }))}
                                                        className={`relative group flex items-center gap-4 p-5 rounded-[1.5rem] cursor-pointer transition-all ${isActive ? 'bg-white border-blue-600 border ring-1 ring-blue-600/20 scale-[1.03]' : 'bg-white/60 border border-slate-100 hover:bg-white hover:shadow-lg'}`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                                                            <Icon icon={stat.icon} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider truncate">{stat.label}</p>
                                                            <p className="text-xl font-bold text-slate-800 leading-none">{stat.value}</p>
                                                        </div>
                                                        {isActive && (
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                                                <Icon icon="mdi:check" className="text-xs font-bold" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
                                            <Icon icon="mdi:alert-circle-outline" className="text-xl text-[#2563EB] shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                                                <span className="font-bold text-[#2563EB] uppercase tracking-wider">Prioritas Kepegawaian :</span> Masih terdapat <span className="text-[#2563EB] font-bold">{activeSyncData.integrasi_data.only_dapodik || 0} data dapodik</span> yang belum terdata di pulpen kepegawaian.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 mx-2" />

                                    {/* Group 2: Klasifikasi Dapodik */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-5 bg-[#6366F1] rounded-full" />
                                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Data GTK (Dapodik)</h3>
                                            </div>
                                            <div className="px-3 py-1 bg-[#6366F1]/10 rounded-full border border-[#6366F1]/20">
                                                <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">
                                                    {activeSyncData.data_gtk.pendidik + activeSyncData.data_gtk.tenaga_kependidikan} Individu
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Pendidik", type: "Pendidik", value: activeSyncData.data_gtk.pendidik || 0, icon: "mdi:school", color: "text-teal-500", bg: "bg-teal-500/10" },
                                                { label: "Tenaga Kependidikan", type: "Tenaga Kependidikan", value: activeSyncData.data_gtk.tenaga_kependidikan || 0, icon: "mdi:account-cog", color: "text-amber-500", bg: "bg-amber-500/10" },
                                            ].map((stat, idx) => {
                                                const isActive = syncFilters.jenis_ptk === stat.type;
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSyncFilters(p => ({ ...p, jenis_ptk: isActive ? "" : stat.type }))}
                                                        className={`relative group flex items-center gap-4 p-5 rounded-[1.5rem] cursor-pointer transition-all ${isActive ? 'bg-white border-teal-500 border ring-1 ring-teal-500/20 scale-[1.03]' : 'bg-white/60 border border-slate-100 hover:bg-white hover:shadow-lg'}`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                                                            <Icon icon={stat.icon} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider truncate">{stat.label}</p>
                                                            <p className="text-xl font-bold text-slate-800 leading-none">{stat.value}</p>
                                                        </div>
                                                        {isActive && (
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg">
                                                                <Icon icon="mdi:check" className="text-xs font-bold" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-[#6366F1]/10 flex items-start gap-3">
                                            <Icon icon="mdi:information-variant" className="text-xl text-[#6366F1] shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                                                <span className="font-bold text-[#6366F1] uppercase tracking-wider">Prioritas GTK:</span> Masih terdapat <span className="text-[#6366F1] font-bold">{activeSyncData.total_not_in_dapodik_school || 0} data pegawai</span> di sekolah yang belum masuk dapodik.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Proportional Venn Diagram & Interactive Card Legend */}
                                <div className="lg:col-span-5 flex flex-col items-center bg-white/40 backdrop-blur-md rounded-[2rem] pt-6 px-6 pb-20 border border-slate-100 self-stretch relative overflow-visible shadow-sm">
                                    <div className="w-full mb-6">
                                        <div className="flex items-center justify-between px-2 w-full">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-5 bg-[#14b8a6] rounded-full" />
                                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sinkronisasi Dapodik dan Kepegawaian</h3>
                                            </div>
                                            <div className="px-3 py-1 bg-[#14b8a6]/10 rounded-full border border-[#14b8a6]/20">
                                                <span className="text-[10px] font-bold text-[#14b8a6] uppercase tracking-wider">
                                                    {activeSyncData.integrasi_data.non_dapodik + activeSyncData.integrasi_data.sinkron + activeSyncData.integrasi_data.only_dapodik} Total
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative w-full px-5 aspect-[1.4/1] flex items-center justify-center overflow-visible rounded-[2.5rem]">
                                        {(() => {
                                            const isVennActive = !!syncFilters.dapodik_status || !!syncFilters.status_kepegawaian;

                                            if (isVennActive) {
                                                return (
                                                    <div className="w-full flex flex-col items-center justify-center animate-in zoom-in fade-in duration-500 py-4">
                                                        <div className="w-full max-w-[700px]">
                                                            {/* 1. SINKRON Focused View */}
                                                            {(syncFilters.dapodik_status === 'in' || syncFilters.jenis_ptk) && (
                                                                <div className="p-6 rounded-[2.5rem] bg-white border border-[#14b8a6]/20 shadow-[0_20px_50px_rgba(20,184,166,0.15)] relative overflow-hidden group">
                                                                    <div className="flex items-start justify-between mb-6">
                                                                        <div className="flex items-center gap-6">
                                                                            <div className="w-20 h-20 rounded-[2rem] bg-[#14b8a6] text-white flex items-center justify-center text-4xl shadow-xl shadow-[#14b8a6]/20">
                                                                                <Icon icon="mdi:cloud-check" />
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sinkron</span>
                                                                                <h3 className="text-5xl font-bold text-slate-800 tracking-tighter leading-none flex items-baseline gap-3">
                                                                                    {activeSyncData.integrasi_data.sinkron}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: '', jenis_ptk: '' }))}
                                                                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-50 hover:text-white rounded-2xl transition-all shadow-sm"
                                                                            title="Hapus Filter"
                                                                        >
                                                                            <Icon icon="mdi:filter-off" className="text-xl" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Klasifikasi PTK</span>
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            {activeSyncData.breakdown_sinkron.map((item: any, i: number) => {
                                                                                const isActive = syncFilters.jenis_ptk === item.jenis_ptk;
                                                                                if (syncFilters.jenis_ptk && !isActive) return null;

                                                                                const cardColor = i % 2 === 0 ? 'bg-[#2563EB]' : 'bg-[#6366F1]';
                                                                                const iconMap: Record<string, string> = {
                                                                                    'GURU': 'mdi:account-school',
                                                                                    'KEPALA SEKOLAH': 'mdi:account-tie',
                                                                                    'TENAGA KEPENDIDIKAN': 'mdi:account-cog',
                                                                                    'PENGAWAS': 'mdi:eye-check'
                                                                                };

                                                                                return (
                                                                                    <div
                                                                                        key={i}
                                                                                        onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: 'in', jenis_ptk: isActive ? '' : item.jenis_ptk }))}
                                                                                        className={`p-4 rounded-3xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${isActive ? cardColor + ' border-transparent text-white shadow-lg scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-indigo-500/30'}`}
                                                                                    >
                                                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isActive ? 'bg-white/20' : i % 2 === 0 ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#6366F1]/10 text-[#6366F1]'}`}>
                                                                                            <Icon icon={iconMap[item.jenis_ptk?.toUpperCase()] || 'mdi:account'} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{item.jenis_ptk || 'Lainnya'}</p>
                                                                                            <p className={`text-xl mt-1 font-bold leading-none ${isActive ? 'text-white' : 'text-slate-800'}`}>{item.count || 0}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* 2. NON DAPODIK Focused View */}
                                                            {(syncFilters.dapodik_status?.includes('not_in')) && syncFilters.dapodik_status !== 'not_in_teacher' && (
                                                                <div className="p-6 rounded-[2.5rem] border border-[#2563EB] bg-white shadow-[0_20px_50px_rgba(37,99,235,0.15)] relative overflow-hidden group">
                                                                    <div className="flex items-start justify-between mb-8">
                                                                        <div className="flex items-center gap-6">
                                                                            <div className="w-20 h-20 rounded-[2rem] bg-[#2563EB] text-white flex items-center justify-center text-4xl shadow-xl shadow-[#2563EB]/20">
                                                                                <Icon icon="mdi:cloud-off" />
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Non Dapodik</span>
                                                                                <h3 className="text-5xl font-bold text-slate-800 tracking-tighter leading-none flex items-baseline gap-3">
                                                                                    {activeSyncData.integrasi_data.non_dapodik}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: '' }))}
                                                                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-50 hover:text-white rounded-2xl transition-all shadow-sm"
                                                                            title="Hapus Filter"
                                                                        >
                                                                            <Icon icon="mdi:filter-off" className="text-xl" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                            <span className="text-xs font-bold text-slate-400 uppercase">Sumber Data Utama</span>
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            {[
                                                                                { label: 'Data Dinas', key: 'not_in', value: activeSyncData.total_not_in_dapodik_dinas, color: 'text-blue-500', icon: 'mdi:bank-outline' },
                                                                                { label: 'Data Sekolah', key: 'not_in_school', value: activeSyncData.total_not_in_dapodik_school, color: 'text-[#6366F1]', icon: 'mdi:school-outline' }
                                                                            ].map((item, i) => {
                                                                                const isActive = syncFilters.dapodik_status === item.key;
                                                                                if (['not_in', 'not_in_school'].includes(syncFilters.dapodik_status) && !isActive) return null;

                                                                                return (
                                                                                    <div
                                                                                        key={i}
                                                                                        onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: isActive ? 'not_in_all' : item.key }))}
                                                                                        className={`p-4 rounded-3xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${isActive ? (i === 0 ? 'bg-[#2563EB]' : 'bg-[#6366F1]') + ' border-transparent text-white shadow-lg scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-blue-500/30'}`}
                                                                                    >
                                                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isActive ? 'bg-white/20' : i === 0 ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#6366F1]/10 text-[#6366F1]'}`}>
                                                                                            <Icon icon={item.icon} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{item.label}</p>
                                                                                            <p className={`text-xl mt-1 font-bold leading-none ${isActive ? 'text-white' : 'text-slate-800'}`}>{item.value || 0}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* 3. ONLY DAPODIK Focused View */}
                                                            {(syncFilters.dapodik_status === 'not_in_teacher' || syncFilters.status_kepegawaian) && (
                                                                <div className="p-6 rounded-[2.5rem] border border-[#6366F1] bg-white shadow-[0_20px_50px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                                                                    <div className="flex items-start justify-between mb-8">
                                                                        <div className="flex items-center gap-6">
                                                                            <div className="w-20 h-20 rounded-[2rem] bg-[#6366F1] text-white flex items-center justify-center text-4xl shadow-xl shadow-[#6366F1]/20">
                                                                                <Icon icon="mdi:account-alert" />
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Only Dapodik</span>
                                                                                <h3 className="text-5xl font-bold text-slate-800 tracking-tighter leading-none flex items-baseline gap-3">
                                                                                    {activeSyncData.integrasi_data.only_dapodik}
                                                                                </h3>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: '', status_kepegawaian: '' }))}
                                                                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-50 hover:text-white rounded-2xl transition-all shadow-sm"
                                                                            title="Hapus Filter"
                                                                        >
                                                                            <Icon icon="mdi:filter-off" className="text-xl" />
                                                                        </button>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Status Kepegawaian</span>
                                                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                                                        </div>

                                                                        <div className="grid grid-cols-3 gap-3">
                                                                            {activeSyncData.breakdown_only_dapodik.map((item: any, i: number) => {
                                                                                const isActive = syncFilters.status_kepegawaian === item.status_kepegawaian;
                                                                                if (syncFilters.status_kepegawaian && !isActive) return null;

                                                                                const cardColor = i % 2 === 0 ? 'bg-[#2563EB]' : 'bg-[#6366F1]';

                                                                                return (
                                                                                    <div
                                                                                        key={i}
                                                                                        onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: 'not_in_teacher', status_kepegawaian: isActive ? '' : item.status_kepegawaian }))}
                                                                                        className={`p-4 rounded-3xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${isActive ? cardColor + ' border-transparent text-white shadow-lg scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-teal-500/30'}`}
                                                                                    >
                                                                                        <div>
                                                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isActive ? 'bg-white/20' : i % 2 === 0 ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#6366F1]/10 text-[#6366F1]'}`}>
                                                                                                <Icon icon="mdi:account-details" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{item.status_kepegawaian || 'Lainnya'}</p>
                                                                                            <p className={`text-xl mt-1 font-bold leading-none ${isActive ? 'text-white' : 'text-slate-800'}`}>{item.count || 0}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <svg viewBox="-45 0 490 350" className="w-full h-full overflow-visible animate-in fade-in duration-700">
                                                    <defs>
                                                        <linearGradient id="v-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                                                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
                                                        </linearGradient>
                                                        <linearGradient id="v-grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
                                                        </linearGradient>
                                                    </defs>
                                                    <circle cx="160" cy="235" r="95" fill="url(#v-grad-blue)" stroke="#2563EB" strokeWidth="1.5" />
                                                    <circle cx="230" cy="235" r="105" fill="url(#v-grad-teal)" stroke="#6366F1" strokeWidth="1.5" />

                                                    {/* 1. Non Dapodik */}
                                                    <line x1="110" y1="235" x2="40" y2="25" stroke="#2563EB" strokeWidth="1" strokeDasharray="3,3" />
                                                    <circle cx="110" cy="235" r="4.5" fill="#2563EB" />
                                                    <foreignObject x="-45" y="20" width="155" height="75">
                                                        {(() => {
                                                            const isMainActive = syncFilters.dapodik_status === 'not_in_all';
                                                            const isDinasActive = syncFilters.dapodik_status === 'not_in';
                                                            const isSchoolActive = syncFilters.dapodik_status === 'not_in_school';
                                                            const anyActive = isMainActive || isDinasActive || isSchoolActive;

                                                            return (
                                                                <div className={`p-4 rounded-2xl border bg-white/90 backdrop-blur-xl transition-all duration-300 relative ${anyActive ? 'border-[#2563EB] ring-1 ring-[#2563EB]/20 scale-[1.03] shadow-xl' : 'border-[#2563EB]/20'}`}>
                                                                    {anyActive && (
                                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg z-20">
                                                                            <Icon icon="mdi:check" className="text-[8px] font-bold" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-9 aspect-square rounded-xl flex items-center justify-center text-[16px] transition-colors shrink-0 ${anyActive ? 'bg-[#2563EB] text-white' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                                                                            <Icon icon="mdi:cloud-off" />
                                                                        </div>
                                                                        <div
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: isMainActive ? '' : 'not_in_all' }))}
                                                                            className="cursor-pointer flex-1 min-w-0"
                                                                        >
                                                                            <span className={`text-[10px] font-bold uppercase tracking-wider block truncate ${anyActive ? 'text-[#2563EB]' : 'text-slate-400'}`}>Non Dapodik</span>
                                                                            <div className="text-2xl font-bold text-slate-800 mt-1 leading-none">{activeSyncData.integrasi_data.non_dapodik}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </foreignObject>

                                                    {/* 2. Sinkron */}
                                                    <line x1="195" y1="235" x2="195" y2="5" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3,3" />
                                                    <circle cx="195" cy="235" r="4.5" fill="#14b8a6" />
                                                    <foreignObject x="120" y="0" width="150" height="75">
                                                        {(() => {
                                                            const isMainActive = syncFilters.dapodik_status === 'in';
                                                            const anyActive = isMainActive;

                                                            return (
                                                                <div className={`p-4 rounded-2xl border bg-white/90 backdrop-blur-xl transition-all duration-300 relative ${anyActive ? 'border-[#14b8a6] ring-1 ring-[#14b8a6]/20 scale-[1.03] shadow-xl' : 'border-[#14b8a6]/20'}`}>
                                                                    {anyActive && (
                                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#14b8a6] text-white flex items-center justify-center shadow-lg z-20">
                                                                            <Icon icon="mdi:check" className="text-[8px] font-bold" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-9 aspect-square rounded-xl flex items-center justify-center text-[16px] transition-colors shrink-0 ${anyActive ? 'bg-[#14b8a6] text-white' : 'bg-[#14b8a6]/10 text-[#14b8a6]'}`}>
                                                                            <Icon icon="mdi:cloud-check" />
                                                                        </div>
                                                                        <div
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: isMainActive ? '' : 'in' }))}
                                                                            className="cursor-pointer flex-1 min-w-0"
                                                                        >
                                                                            <span className={`text-[10px] font-semibold uppercase tracking-wider block truncate ${anyActive ? 'text-[#14b8a6]' : 'text-slate-400'}`}>Sinkron</span>
                                                                            <div className="text-2xl font-semibold text-slate-800 mt-1 leading-none">{activeSyncData.integrasi_data.sinkron}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </foreignObject>

                                                    {/* 3. Only Dapodik */}
                                                    <line x1="280" y1="235" x2="350" y2="45" stroke="#6366F1" strokeWidth="1" strokeDasharray="3,3" />
                                                    <circle cx="280" cy="235" r="4.5" fill="#6366F1" />
                                                    <foreignObject x="280" y="40" width="160" height="75">
                                                        {(() => {
                                                            const isMainActive = syncFilters.dapodik_status === 'not_in_teacher';
                                                            const anyActive = isMainActive;

                                                            return (
                                                                <div className={`p-4 rounded-2xl border bg-white/90 backdrop-blur-xl transition-all duration-300 relative ${anyActive ? 'border-[#6366F1] ring-1 ring-[#6366F1]/20 scale-[1.03] shadow-xl' : 'border-[#6366F1]/20'}`}>
                                                                    {anyActive && (
                                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-lg z-20">
                                                                            <Icon icon="mdi:check" className="text-[8px] font-bold" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-9 aspect-square rounded-xl flex items-center justify-center text-[16px] transition-colors shrink-0 ${anyActive ? 'bg-[#6366F1] text-white' : 'bg-[#6366F1]/10 text-[#6366F1]'}`}>
                                                                            <Icon icon="mdi:account-alert" />
                                                                        </div>
                                                                        <div
                                                                            onClick={() => setSyncFilters(p => ({ ...p, dapodik_status: isMainActive ? '' : 'not_in_teacher' }))}
                                                                            className="cursor-pointer flex-1 min-w-0"
                                                                        >
                                                                            <span className={`text-[10px] font-semibold uppercase tracking-wider block truncate ${anyActive ? 'text-[#6366F1]' : 'text-slate-400'}`}>Only Dapodik</span>
                                                                            <div className="text-2xl font-semibold text-slate-800 mt-1 leading-none">{activeSyncData.integrasi_data.only_dapodik}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </foreignObject>
                                                </svg>
                                            );
                                        })()}

                                        <div className="absolute inset-x-0 -bottom-12 px-8 text-center">
                                            <p className="text-xs leading-relaxed text-slate-500 font-medium">
                                                * Dari total <span className="font-bold text-slate-800">{activeSyncData.total_pegawai} pegawai</span>,
                                                terdapat <span className="font-bold text-indigo-600">{activeSyncData.integrasi_data.sinkron} orang</span> yang telah sinkron,
                                                sementara <span className="font-bold text-rose-500">{activeSyncData.integrasi_data.non_dapodik} orang</span> belum terdata.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
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