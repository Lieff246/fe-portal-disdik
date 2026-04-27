import React from "react";
import { Icon } from "@iconify/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GtkSummaryPanelProps {
  stats: any;
}

export const GtkSummaryPanel: React.FC<GtkSummaryPanelProps> = ({ stats }) => {
  const { abk_recap } = stats;
  const recap = abk_recap?.recap || { ideal: 0, kelebihan: 0, kekurangan: 0 };

  const chartData = [
    { name: "Ideal", value: recap.ideal, color: "#84CC16" }, // Lime 500
    { name: "Kurang", value: recap.kekurangan, color: "#ef4444" }, // Red 500
    { name: "Lebih", value: recap.kelebihan, color: "#f59e0b" }, // Amber 500
  ];

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl shadow-slate-200/40 flex flex-col items-center">
      {/* Chart Container - Dikembalikan ke bentuk persegi (aspect-square) agar bentuk tapal kuda presisi */}
      {/* Container utama dengan tinggi yang disesuaikan (misal 200px atau 220px) */}

      <div className="w-full flex justify-center relative aspect-square -mt-16">
        <ResponsiveContainer width="65%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="60%" // Posisi poros kembali ke tengah
              startAngle={200}
              endAngle={-20}
              innerRadius="65%"
              outerRadius="100%"
              paddingAngle={4} // Memberi jarak renggang antar potongan
              dataKey="value"
              stroke="none"
              cornerRadius={40} // Membuat ujung potongan menjadi sangat membulat
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Text Label Absolute di tengah lingkaran */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 text-center">
          <p className="text-slate-500 text-sm font-semibold">Total</p>
          <p className="text-[#1E293B] text-4xl font-black">800</p>
        </div>
      </div>
      {/* Grid Cards Data */}
      <div className="grid grid-cols-3 gap-1 w-full  -mt-16">
        {[
          {
            label: "Ideal",
            value: recap.ideal,
            color: "text-lime-500",
            bg: "bg-lime-50",
          },
          {
            label: "Kurang",
            value: recap.kekurangan,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "Kelebihan",
            value: recap.kelebihan,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`${item.bg} rounded-[1.5rem] p-4 flex flex-col items-center`}
          >
            <span className={`text-xs font-bold ${item.color}`}>
              {item.label}
            </span>
            <span className={`font-bold ${item.color}`}>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Informasi Bawah */}
      <div className="mt-3 w-full p-6 bg-blue-50/50 rounded-[2rem] flex gap-4">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
          <Icon icon="mdi:information-variant" className="" />
        </div>
        <div>
          <div className="text-sm font-bold mb-1">Informasi</div>
          <p className="text-xs font-bold text-blue-800/70 leading-relaxed">
            Saat ini terdapat kekurangan{" "}
            <span className="text-blue-900">
              {recap.kekurangan.toLocaleString()}
            </span>{" "}
            guru dan kelebihan{" "}
            <span className="text-blue-900">
              {recap.kelebihan.toLocaleString()}
            </span>{" "}
            guru yang perlu segera ditangani.
          </p>
        </div>
      </div>
    </div>
  );
};
