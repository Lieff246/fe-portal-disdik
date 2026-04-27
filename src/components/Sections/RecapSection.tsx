import React from "react";
import type { LandingData } from "@/types";
import { School, Users, GraduationCap, UserCheck } from "lucide-react";

interface Props {
  landingData?: LandingData;
}

export const RecapSection: React.FC<Props> = ({ landingData }) => {
  // console.log(landingData);
  const summary = landingData?.summary;

  const stats = [
    {
      label: "Cabang Dinas",
      value: summary?.totalSkTerbit?.toLocaleString('id-ID') || "0",
      sub: "Kab/Kota",
      icon: <UserCheck className="w-5 h-5 text-accent" />,
      bg: "bg-accent/5",
    },
    {
      label: "Total Sekolah",
      value: summary?.totalSekolah?.toLocaleString('id-ID') || "0",
      icon: <School className="w-5 h-5 text-primary" />,
      bg: "bg-primary/5",
    },
    {
      label: "T. Pendidik",
      value: summary?.tenagaPendidik?.toLocaleString('id-ID') || "0",
      sub: "Guru",
      icon: <Users className="w-5 h-5 text-cyan-500" />,
      bg: "bg-cyan-500/5",
    },
    {
      label: "T. Kependidikan",
      value: summary?.tenagaKependidikan?.toLocaleString('id-ID') || "0",
      sub: "Staf",
      icon: <Users className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-500/5",
    },
    {
      label: "Total Pegawai",
      value: summary?.totalPegawai?.toLocaleString('id-ID') || "0",
      sub: "ASN",
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-500/5",
    },
  ];

  return (
    <section className="py-8 ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 px-5 py-4 bg-[#F8FCFF] border border-gray-100 rounded-3xl hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className=" mb-0.5 whitespace-nowrap">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">
                  {stat.value}
                </span>
                {stat.sub && (
                  <span className="">
                    {stat.sub}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
