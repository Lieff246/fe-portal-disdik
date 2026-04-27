import React from 'react';
import type { DetailData } from '@/types';
import { CalendarClock, ArrowUpRight, GraduationCap } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface Props {
  onShowDetail: (data: DetailData) => void;
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { display: false } },
  elements: { point: { radius: 3 } },
};

export const ProjectionSection: React.FC<Props> = ({ onShowDetail }) => {
  const dummyPurna = [
    { name: 'Budi Santoso', status: 'Pensiun BUP - Guru Madya', date: 'Bulan Depan' },
    { name: 'Siti Aminah', status: 'Pensiun Dini - Struktural', date: '3 Bulan Lagi' },
  ];

  const dummyPangkat = [
    { name: 'Joni Iskandar', status: 'Ke Golongan III/C', date: 'April 2026' },
    { name: 'Mawar Eva', status: 'Ke Golongan IV/A', date: 'Oktober 2026' },
  ];

  const dummyBerkala = [
    { name: 'Rudi Hartono', status: 'KGB Rutin 2 Tahun', date: 'Mei 2026' },
    { name: 'Luna Maya', status: 'KGB Rutin 2 Tahun', date: 'Juni 2026' },
  ];

  // Dummy 5-year data
  const dataPurna = { labels: ['26', '27', '28', '29', '30'], datasets: [{ data: [400, 450, 420, 500, 600], borderColor: '#f43f5e', backgroundColor: '#f43f5e20', fill: true, tension: 0.4 }] };
  const dataPangkat = { labels: ['26', '27', '28', '29', '30'], datasets: [{ data: [800, 950, 1100, 850, 920], borderColor: '#3b82f6', backgroundColor: '#3b82f620', fill: true, tension: 0.4 }] };
  const dataBerkala = { labels: ['26', '27', '28', '29', '30'], datasets: [{ data: [1200, 1050, 1300, 1500, 1450], borderColor: '#f59e0b', backgroundColor: '#f59e0b20', fill: true, tension: 0.4 }] };

  return (
    <section className="px-10 py-16 bg-white">
      <div className="flex items-center gap-3 mb-10">
        <CalendarClock className="w-8 h-8 text-forest" />
        <h2 className="text-3xl font-bold text-forest">Proyeksi Pegawai ASN</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Purna Tugas */}
        <div className="bg-rose-50/50 rounded-[32px] p-6 shadow-sm border border-rose-100 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-200 text-rose-700 rounded-2xl flex items-center justify-center">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-forest">Purna Tugas</h3>
              <p className="text-xs text-gray-500">Proyeksi Pensiun (5 Thn)</p>
            </div>
          </div>
          <div className="h-24 mb-4">
            <Line data={dataPurna} options={lineOptions} />
          </div>
          <ul className="space-y-3 mb-6 flex-1">
            {dummyPurna.map((itm, i) => (
              <li key={i} className="flex flex-col border-b border-gray-200 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{itm.name}</p>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{itm.date}</span>
                </div>
                <p className="text-xs text-gray-500">{itm.status}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onShowDetail({ type: 'purna', title: 'Data Lengkap Proyeksi Purna Tugas', data: dummyPurna })}
            className="w-full py-3 bg-white border border-rose-200 text-rose-700 font-medium rounded-xl hover:bg-rose-50 transition-colors"
          >
            Lihat Detail Pensiun
          </button>
        </div>

        {/* Kenaikan Pangkat */}
        <div className="bg-blue-50/50 rounded-[32px] p-6 shadow-sm border border-blue-100 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-forest">Kenaikan Pangkat</h3>
              <p className="text-xs text-gray-500">Proyeksi Golongan (5 Thn)</p>
            </div>
          </div>
          <div className="h-24 mb-4">
            <Line data={dataPangkat} options={lineOptions} />
          </div>
          <ul className="space-y-3 mb-6 flex-1">
            {dummyPangkat.map((itm, i) => (
              <li key={i} className="flex flex-col border-b border-gray-200 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{itm.name}</p>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{itm.date}</span>
                </div>
                <p className="text-xs text-gray-500">{itm.status}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onShowDetail({ type: 'pangkat', title: 'Daftar Nominatif Kenaikan Pangkat', data: dummyPangkat })}
            className="w-full py-3 bg-white border border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition-colors"
          >
            Lihat Detail Pangkat
          </button>
        </div>

        {/* Gaji Berkala */}
        <div className="bg-amber-50/50 rounded-[32px] p-6 shadow-sm border border-amber-100 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-200 text-amber-700 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-forest">Gaji Berkala</h3>
              <p className="text-xs text-gray-500">Estimasi KGB (5 Thn)</p>
            </div>
          </div>
          <div className="h-24 mb-4">
            <Line data={dataBerkala} options={lineOptions} />
          </div>
          <ul className="space-y-3 mb-6 flex-1">
            {dummyBerkala.map((itm, i) => (
              <li key={i} className="flex flex-col border-b border-gray-200 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{itm.name}</p>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{itm.date}</span>
                </div>
                <p className="text-xs text-gray-500">{itm.status}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onShowDetail({ type: 'berkala', title: 'Daftar Kenaikan Gaji Berkala', data: dummyBerkala })}
            className="w-full py-3 bg-white border border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-colors"
          >
            Lihat Detail Berkala
          </button>
        </div>

      </div>
    </section>
  );
};
