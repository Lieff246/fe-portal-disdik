import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Tag, Loader2 } from "lucide-react";
import { LandingService } from "@/services/landingService";

export const AdminSection: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const response = await LandingService.getAdmins();
        console.log("tes");
        console.log(response);
        setAdmins([]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Filter logic
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const currentAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("admin-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="admin-section" className="py-24 pt-12 bg-white">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 bg-primary rounded-full"></div>
              <span className="text-[10px] font-bold text-primary uppercase">
                RESOURCE PERSONS
              </span>
            </div>
            <h2 className="font-bold text-2xl text-gray-800">
              Daftar Pengelola
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Temukan kontak dan pejabat pengelola sesuai dengan wilayah kerja
              dan layanan Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Cari nama, wilayah, atau posisi..."
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
              MENGAMBIL DATA PENGELOLA...
            </p>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {currentAdmins.map((admin, idx) => (
                <div key={idx} className="flex flex-col group cursor-pointer">
                  {/* Photo Container */}
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-200/50 group-hover:shadow-primary/20 transition-all duration-500">
                    <img
                      src={
                        admin.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name}`
                      }
                      alt={admin.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Date Badge */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Tag className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      26 April 2026
                    </span>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-primary transition-colors">
                      {admin.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mb-4 line-clamp-1">
                      {admin.position}
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                      {admin.wilayah}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;

                    if (totalPages <= maxVisiblePages) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push("...");

                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = start; i <= end; i++) {
                        if (!pages.includes(i)) pages.push(i);
                      }

                      if (currentPage < totalPages - 2) pages.push("...");
                      if (!pages.includes(totalPages)) pages.push(totalPages);
                    }

                    return pages.map((p, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          typeof p === "number" && handlePageChange(p)
                        }
                        disabled={p === "..."}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                          currentPage === p
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : p === "..."
                              ? "text-gray-300 cursor-default"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500">
              Tidak ada pengelola yang cocok
            </h3>
            <p className="text-gray-400">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
