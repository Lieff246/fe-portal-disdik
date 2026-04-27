import React from "react";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export const AdminSection2: React.FC = () => {
  const admins = [
    {
      name: "Zeyn Zifferent",
      role: "Verifikator Kenaikan Pangkat",
      region: "Dinas Pendidikan",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=zeyn",
    },
    {
      name: "Sari Melati",
      role: "Verifikator Kenaikan Pangkat",
      region: "Wilayah 2 (Parigi, Donggala)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=sari",
    },
    {
      name: "Rina Pratiwi",
      role: "Verifikator Kenaikan Pangkat",
      region: "Wilayah 3 (Poso, Ampana)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=rina",
    },
    {
      name: "Andi Setiawan",
      role: "Verifikator Kenaikan Pangkat",
      region: "Wilayah 4 (Morowali, Morut)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=andi",
    },
    {
      name: "Deni Saputra S",
      role: "Admin SAPK & Pensiun",
      region: "Wilayah 5 (Banggai Raya)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=deni",
    },
    {
      name: "Siti Nurhaliza",
      role: "Verifikator Gaji Berkala",
      region: "Wilayah 6 (Tolitoli, Buol)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=siti",
    },
    {
      name: "Lina Anggraini",
      role: "Admin Mutasi & Kepegawaian",
      region: "Wilayah 6 (Tolitoli, Buol)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=lina",
    },
    {
      name: "Indah Purnamam",
      role: "Verifikator KGB & Pensiun",
      region: "Wilayah 6 (Tolitoli, Buol)",
      date: "5 Januari 2025",
      img: "https://i.pravatar.cc/300?u=indah",
    },
  ];

  return (
    <section id="admin" className="px-10 py-20 bg-white">
      <div className="mb-10">
        <div className="font-bold text-2xl">Daftar Admin</div>
        <p className="text-sm">
          Berikut adalah daftar admin pengelola PUSDAPENDIK
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tuliskan NIP"
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20 transition-all">
          <Search className="w-4 h-4" />
          Cari
        </button>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {admins.map((admin, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-[2.5rem] p-6 flex flex-col  hover:shadow-2xl hover:shadow-gray-200/50 transition-all group group cursor-pointer"
          >
            <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50  shadow-lg">
              <img
                src={admin.img}
                alt={admin.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-sm text-[#475569]">{admin.date}</span>
            </div>

            <h3 className="text-lg font-bold mt-2 mb-1">{admin.name}</h3>
            <p className="text-[#64748B] mb-2">{admin.role}</p>

            <div className=" bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-center transition-colors">
              {admin.region}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center items-center gap-2">
        <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:bg-primary hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30">
          1
        </button>
        <button className="w-10 h-10 rounded-xl border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50">
          2
        </button>
        <div className="mx-2 text-gray-300 font-bold italic tracking-widest">
          ...
        </div>
        <button className="w-10 h-10 rounded-xl border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50">
          24
        </button>
        <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:bg-primary hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
