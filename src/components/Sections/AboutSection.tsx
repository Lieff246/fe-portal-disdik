import React from "react";
import { ShieldCheck, Quote } from "lucide-react";
import Chart from "react-apexcharts";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Text & Features */}
        <div className="lg:col-span-6 flex flex-col gap-8 pt-4">
          <div>
            <div className="text-6xl font-bold mb-2 flex">
              PTK<span className="text-primary text-4xl">+</span>
            </div>
            <div className="text-lg font-bold text-secondary mb-6">
              Melayani dengan Sepenuh Hati
            </div>
            <p className="text-[#64748B] leading-relaxed  mb-8">
              Transformasi layanan kepegawaian untuk memangkas birokrasi dan
              mempercepat proses administrasi, sehingga pengelolaan pegawai
              menjadi lebih efektif didukung kolaborasi bersama BLPT.
            </p>

            <div className="bg-surface p-8 rounded-[2.5rem] border border-gray-100 relative mb-8">
              <Quote className="absolute top-4 right-8 w-12 h-12 text-gray-200" />
              <p className="text-sm font-bold text-content italic leading-relaxed relative z-10">
                “Layanan kepegawaian ditransformasi untuk memangkas birokrasi
                dan memastikan proses yang cepat, transparan, dan bebas pungli
                sehingga guru dapat sepenuhnya fokus mengajar tanpa terbebani
                urusan administrasi.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-gray-50">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm">Bebas Pungli</div>
                  <p className="text-xs text-[#64748B] mt-1.5 font-medium">
                    Transparansi penuh dalam setiap proses layanan.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-gray-50">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm">Pelayanan Real-time</div>
                  <p className="text-xs text-[#64748B] mt-1.5 font-medium">
                    Proses cepat tanpa harus meninggalkan sekolah.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Mini Chart at bottom left */}
          <div className="h-40 w-full opacity-40 hidden">
            <Chart
              options={{
                chart: { sparkline: { enabled: true }, type: "area" },
                stroke: { curve: "smooth", width: 2 },
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                  },
                },
                colors: ["#3b82f6"],
                tooltip: { enabled: false },
              }}
              series={[{ data: [31, 40, 28, 51, 42, 109, 100] }]}
              type="area"
              height={160}
            />
          </div>
          <div className="w-full relative">
            <img
              src="/stats.png"
              className="w-[60%] top-0 absolute z-10 opacity-80  -right-40"
            />
          </div>
        </div>

        {/* Right Column: Image with floating cards */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end ">
          <div className="relative w-full flex">
            <img
              src="/rekap.png"
              className="w-[28%] top-24 absolute z-10 opacity-80 left-0"
            />
            <img
              src="/kadis_pendidikan.png"
              alt="Official"
              className="w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
