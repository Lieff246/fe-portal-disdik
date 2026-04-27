import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart Options to map with modern, minimalist aesthetic
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      titleColor: '#2f5233',
      bodyColor: '#45784b',
      borderColor: '#eaddcf',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: { family: "'Inter', sans-serif", size: 14 },
      bodyFont: { family: "'Inter', sans-serif", size: 13 },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: "'Inter', sans-serif" } },
    },
    y: {
      grid: { color: '#f1ebd9', drawBorder: false },
      ticks: { font: { family: "'Inter', sans-serif" } },
      border: { display: false }
    },
  },
};

const eduData = {
  labels: ['S1', 'S2', 'S3', 'D3/D4'],
  datasets: [{
    data: [65, 20, 5, 10],
    backgroundColor: ['#2f5233', '#45784b', '#7a9f7d', '#eaddcf'],
    borderWidth: 0,
    hoverOffset: 4,
  }],
};

const statusData = {
  labels: ['PNS Daerah', 'PNS Pusat (DPK)', 'PPPK Guru', 'PPPK Teknis'],
  datasets: [{
    label: 'Jumlah Pegawai',
    data: [6200, 150, 4800, 3135],
    backgroundColor: '#45784b',
    borderRadius: 6,
  }],
};

const retireData = {
  labels: ['2026', '2027', '2028', '2029', '2030'],
  datasets: [{
    label: 'Proyeksi Pensiun',
    data: [412, 530, 680, 490, 710],
    borderColor: '#2f5233',
    backgroundColor: 'rgba(47, 82, 51, 0.1)',
    borderWidth: 3,
    fill: true,
    tension: 0.4,
    pointBackgroundColor: '#fff',
    pointBorderColor: '#2f5233',
    pointBorderWidth: 2,
    pointRadius: 4,
  }],
};


export const BottomCharts: React.FC = () => {
  return (
    <div className="absolute bottom-6 left-6 right-6 z-40 pointer-events-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Education Level Chart */}
        <div className="glass-card pointer-events-auto h-[300px] flex flex-col">
          <h3 className="text-forest font-bold text-lg mb-4">Tingkat Pendidikan</h3>
          <div className="flex-1 relative">
            <Doughnut data={eduData} options={{ ...commonOptions, scales: {} }} />
          </div>
        </div>

        {/* Employment Status */}
        <div className="glass-card pointer-events-auto h-[300px] flex flex-col">
          <h3 className="text-forest font-bold text-lg mb-4">Status Kepegawaian</h3>
          <div className="flex-1 relative">
            <Bar data={statusData} options={{ ...commonOptions, indexAxis: 'y' } as any} />
          </div>
        </div>

        {/* Retirement Projections */}
        <div className="glass-card pointer-events-auto h-[300px] flex flex-col">
          <h3 className="text-forest font-bold text-lg mb-4">Proyeksi Purna Tugas (5 Thn)</h3>
          <div className="flex-1 relative">
            <Line data={retireData} options={commonOptions} />
          </div>
        </div>
        
      </div>
    </div>
  );
};
