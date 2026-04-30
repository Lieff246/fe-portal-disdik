import React from 'react';
import { Icon } from '@iconify/react';
import Chart from 'react-apexcharts';
import { X } from 'lucide-react';

interface NeracaSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    neracaData: any;
}

export const NeracaSidebar: React.FC<NeracaSidebarProps> = ({ isOpen, onClose, neracaData }) => {
    console.log("tessssss");
    console.log(neracaData);
    return (
        <div className={`fixed inset-y-0 left-0 w-full sm:w-[850px] bg-white shadow-2xl z-[1000] transform transition-transform duration-500 ease-in-out border-r border-slate-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                            <Icon icon="mdi:scale-balance" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Neraca Personel</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analitik Data Dapodik</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {!neracaData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Data Neraca...</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
                        {/* Grid 1: Jenis Kelamin & Rentang Usia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Proporsi Jenis Kelamin</h4>
                                    <Icon icon="mdi:gender-male-female" className="text-rose-500 text-lg" />
                                </div>
                                <Chart
                                    type="donut"
                                    width="100%"
                                    height={220}
                                    series={Object.values(neracaData.lp || {}) as number[]}
                                    options={{
                                        labels: Object.keys(neracaData.lp || {}).map(k => k === 'L' ? 'Laki-laki' : 'Perempuan'),
                                        colors: ['#0EA5E9', '#F43F5E'],
                                        legend: { position: 'bottom', fontSize: '10px', fontWeight: 'bold' } as any,
                                        plotOptions: { pie: { donut: { size: '70%' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '10px' } }
                                    } as any}
                                />
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Distribusi Rentang Usia</h4>
                                    <Icon icon="mdi:calendar-range" className="text-amber-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={220}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.age_ranges || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, distributed: true } } as any,
                                        colors: ['#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E'],
                                        xaxis: { categories: Object.keys(neracaData.age_ranges || {}), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        dataLabels: { enabled: false } as any,
                                        legend: { show: false } as any
                                    } as any}
                                />
                            </div>
                        </div>

                        {/* Grid 2: Status Pendidik & Jam Mengajar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Status Pendidik</h4>
                                    <Icon icon="mdi:account-tie" className="text-indigo-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={220}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.status_kepegawaian || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '50%' } } as any,
                                        colors: ['#6366F1'],
                                        xaxis: { categories: Object.keys(neracaData.status_kepegawaian || {}), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '9px' } } as any
                                    } as any}
                                />
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Jam Mengajar / Minggu</h4>
                                    <Icon icon="mdi:clock-outline" className="text-emerald-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={220}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.jam_mengajar_perminggu || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        colors: ['#10B981'],
                                        xaxis: { categories: Object.keys(neracaData.jam_mengajar_perminggu || {}), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '9px' } } as any
                                    } as any}
                                />
                            </div>
                        </div>

                        {/* Grid 3: Tersertifikasi & Rekap Pendidikan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Pendidik Tersertifikasi</h4>
                                    <Icon icon="mdi:certificate" className="text-blue-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={220}
                                    series={[
                                        { name: 'Sudah', data: ['SMA', 'SMK', 'SLB'].map(l => neracaData.sertifikasi_per_level?.[l]?.['Sudah'] || 0) },
                                        { name: 'Belum', data: ['SMA', 'SMK', 'SLB'].map(l => neracaData.sertifikasi_per_level?.[l]?.['Belum'] || 0) }
                                    ]}
                                    options={{
                                        chart: { stacked: true, stackType: '100%', toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        colors: ['#10B981', '#F59E0B'],
                                        xaxis: { categories: ['SMA', 'SMK', 'SLB'], labels: { style: { fontSize: '10px', fontWeight: 'bold' } } } as any,
                                        legend: { position: 'bottom', fontSize: '10px' } as any,
                                        dataLabels: { enabled: true, formatter: (val: any) => val.toFixed(0) + '%' }
                                    } as any}
                                />
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Rekap Pendidikan</h4>
                                    <Icon icon="mdi:school" className="text-purple-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={220}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.rekap_pendidikan || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } } as any,
                                        colors: ['#A855F7'],
                                        xaxis: { categories: Object.keys(neracaData.rekap_pendidikan || {}), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '9px' } } as any
                                    } as any}
                                />
                            </div>
                        </div>

                        {/* Grid 1 Column: Pangkat & Sebaran Wilayah */}
                        <div className="space-y-6">
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Pangkat & Golongan</h4>
                                    <Icon icon="mdi:shield-star-outline" className="text-amber-600 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={250}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.pangkat_gol || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } } as any,
                                        xaxis: { categories: Object.keys(neracaData.pangkat_gol || {}), labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        colors: ['#D97706'],
                                        dataLabels: { enabled: false } as any
                                    } as any}
                                />
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Sebaran Wilayah</h4>
                                    <Icon icon="mdi:map-marker-multiple" className="text-emerald-500 text-lg" />
                                </div>
                                <Chart
                                    type="bar"
                                    height={600}
                                    series={[{ name: 'Personel', data: Object.values(neracaData.kabupaten_kota || {}) as number[] }]}
                                    options={{
                                        chart: { toolbar: { show: false } } as any,
                                        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '70%' } } as any,
                                        colors: ['#10B981'],
                                        xaxis: { categories: Object.keys(neracaData.kabupaten_kota || {}), labels: { style: { fontSize: '8px', fontWeight: 'bold' } } } as any,
                                        yaxis: { labels: { style: { fontSize: '9px', fontWeight: 'bold' } } } as any,
                                        dataLabels: { enabled: true, style: { fontSize: '9px' } } as any
                                    } as any}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 bg-slate-900 text-white mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Service GTK</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold">Sinkronisasi Terakhir</h4>
                            <p className="text-xs text-white/40">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <Icon icon="mdi:database-sync" className="text-xl text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
