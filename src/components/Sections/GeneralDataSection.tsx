import React from "react";
import { Icon } from "@iconify/react";

interface Props {
  data: any;
}

export const GeneralDataSection: React.FC<Props> = ({ data }) => {
  const stats = [
    {
      label: "Total Sekolah",
      value: data?.total_sekolah || 0,
      icon: "hugeicons:school",
      color: "emerald",
    },
    {
      label: "Jumlah Rombel",
      value: data?.total_rombel || 0,
      icon: "carbon:multiuser-device",
      color: "emerald",
    },
    {
      label: "Total Siswa",
      value: data?.total_siswa || 0,
      icon: "solar:user-linear",
      color: "emerald",
    },
    {
      label: "Tenaga Pendidik",
      value: data?.total_guru || 0,
      icon: "mdi:school-outline",
      color: "emerald",
    },
    {
      label: "Tenaga Kependidikan",
      value: data?.total_tendik || 0,
      icon: "clarity:administrator-line",
      color: "emerald",
    },
    {
      label: "Pegawai Dinas",
      value: data?.total_pegawai || 0,
      icon: "clarity:administrator-line",
      color: "emerald",
    },
  ];

  return (
    <section className="w-full ">
      {/* Turunkan bg-white/60 menjadi bg-white/30 */}
      <div className="glass ring-2 !ring-white rounded-[2rem] px-8 py-6 relative z-10">
        <div className="text-xl font-bold text-slate-800 mb-5">
          Data Umum Satuan Pendidikan
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex rounded-2xl bg-[#F8FCFF]/80 p-4 items-center gap-5 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-green-50 text-${item.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon icon={item.icon.toString()} className="text-3xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm whitespace-nowrap">{item.label}</span>
                <span className="font-bold text-slate-800">
                  {item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
