import React from "react";
import {
  School,
  GraduationCap,
  LayoutPanelLeft,
  Users,
  Settings,
} from "lucide-react";

interface Props {
  data: any;
}

export const GeneralDataSection: React.FC<Props> = ({ data }) => {
  const stats = [
    {
      label: "Total Sekolah",
      value: data?.total_sekolah || 0,
      icon: School,
      color: "emerald",
    },
    {
      label: "Total Guru",
      value: data?.total_guru || 0,
      icon: GraduationCap,
      color: "emerald",
    },
    {
      label: "Jumlah Rombel",
      value: data?.total_rombel || 0,
      icon: LayoutPanelLeft,
      color: "emerald",
    },
    {
      label: "Total Siswa",
      value: data?.total_siswa || 0,
      icon: Users,
      color: "emerald",
    },
    {
      label: "Total Tendik",
      value: data?.total_tendik || 0,
      icon: Settings,
      color: "emerald",
    },
  ];

  return (
    <section className="w-full ">
      {/* Turunkan bg-white/60 menjadi bg-white/30 */}
      <div className="glass ring-2 !ring-white rounded-[2rem] px-8 py-6 relative z-10">
        <h3 className="text-xl font-bold text-slate-800 mb-8 drop-shadow-sm">
          Data Umum Satuan Pendidikan
        </h3>

        <div className="flex  justify-between">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex rounded-2xl bg-[#F8FCFF]/80 p-4 items-center gap-5 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-green-50 text-${item.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-7 h-7" />
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
