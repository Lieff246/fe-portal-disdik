import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { LandingService } from "@/services/landingService";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "../Elements/Skeleton/Skeleton";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  initialTab = "guru_sma",
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen && !data) {
      fetchDetails();
    }
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await LandingService.getServiceDetails();
      setData(response);
    } catch (error) {
      console.error("Failed to fetch service details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentTabData = data?.tabs?.find((t: any) => t.key === activeTab);

  const chartData = [
    { name: "Selesai", value: data?.summary?.finished || 0 },
    {
      name: "Sisa",
      value: Math.max(
        0,
        (data?.summary?.total || 0) - (data?.summary?.finished || 0),
      ),
    },
  ];
  const COLORS = ["#84cc16", "#f1f5f9"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Detail{" "}
                {activeTab.includes("guru")
                  ? "Tenaga Pendidik"
                  : "Tenaga Kependidikan"}
              </h2>
              <p className="text-sm font-medium text-slate-400">
                {new Date().toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-8">
          {loading ? (
            <ServiceDetailSkeleton />
          ) : (
            <>
              {/* Left Sidebar */}
              <div className="w-full lg:w-80 border-r border-gray-100 bg-slate-50/30 p-8 overflow-y-auto shrink-0">
                {/* Gauge Chart */}
                <div className="relative w-full aspect-square mb-10">
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Disesuaikan
                    </span>
                    <div className="text-2xl font-black text-slate-800">
                      {data?.summary?.finished || 0}
                      <span className="text-sm font-bold text-slate-300 ml-1">
                        /{data?.summary?.total || 0}
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        startAngle={210}
                        endAngle={-30}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                      >
                        {chartData.map((entry, index) => {
                          console.log(entry);
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-slate-800 tracking-tight">
                    Penyelesaian Berkas
                  </h3>
                  <div className="space-y-4">
                    {data?.breakdown?.map((item: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-blue-500 flex items-center justify-center shadow-sm">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            {item.finished}{" "}
                            <span className="text-slate-300 text-[10px]">
                              / {item.total}
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${(item.finished / item.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 bg-white flex flex-col overflow-hidden shadow-[0px_12px_50px_12px_#DBE8FF] rounded-3xl">
                {/* Tabs */}
                <div className="px-8 pt-6 shrink-0">
                  <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center gap-1 w-fit">
                    {data?.tabs?.map((tab: any) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          activeTab === tab.key
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service List */}
                <div className="flex-1 overflow-y-auto px-8 py-6 pb-12 space-y-8 scrollbar-hide">
                  {currentTabData?.services?.map(
                    (service: any, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="border border-slate-100 rounded-[2rem] p-4 bg-[#F8FAFC]"
                      >
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-1">
                            {service.name}
                          </h4>
                          <p className="text-sm font-medium text-slate-400">
                            Berikut informasi rinci terkait{" "}
                            {service.name.toLowerCase()}.
                          </p>
                        </div>

                        <div className="space-y-6">
                          {service.stages.map((stage: any, stIdx: number) => (
                            <div
                              key={stIdx}
                              className="flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                              <div className="flex items-center gap-3 w-48 shrink-0">
                                <div>
                                  <div
                                    className={`w-3 h-3 rounded-full ${stage.count === stage.total ? "bg-emerald-400" : "bg-blue-100"}`}
                                  />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                                    {stage.label}
                                  </p>
                                  <p className="text-sm mt-1">{stage.sub}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-center gap-6 ml-4">
                                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      stage.label === "Telah Diselesaikan"
                                        ? "bg-emerald-500"
                                        : "bg-blue-600"
                                    }`}
                                    style={{
                                      width: `${(stage.count / stage.total) * 100}%`,
                                    }}
                                  />
                                </div>
                                <div className="w-16 text-right">
                                  <span className="">{stage.count}</span>
                                  <span className="text-slate-500 ml-1">
                                    / {stage.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}

                  {(!currentTabData?.services ||
                    currentTabData.services.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                      <User className="w-16 h-16 opacity-20 mb-4" />
                      <p className="font-bold uppercase tracking-widest text-sm">
                        Tidak ada data pelayanan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceDetailSkeleton = () => {
  return (
    <>
      <div className="w-full lg:w-80 border-r border-gray-100 bg-slate-50/30 p-8 overflow-y-auto shrink-0">
        <Skeleton className="w-48 h-48 rounded-full mx-auto mb-10" />
        <div className="space-y-6">
          <Skeleton className="w-32 h-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-12 h-4" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        <div className="px-8 pt-6 shrink-0">
          <Skeleton className="w-96 h-12 rounded-2xl" />
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="border border-slate-50 rounded-[2rem] p-8">
              <Skeleton className="w-48 h-6 mb-2" />
              <Skeleton className="w-64 h-4 mb-8" />
              <div className="space-y-8">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="w-full h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
