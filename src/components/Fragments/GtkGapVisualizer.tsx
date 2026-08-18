import React from "react";

interface GtkGapVisualizerProps {
  kurang: number;
  lebih: number;
  ideal: number;
  kebutuhan: number;
  eksisting: number;
  // maxVal sekarang menerima object/array dari backend
  maxVal: {
    kurang: number;
    lebih: number;
  };
}

export const GtkGapVisualizer: React.FC<GtkGapVisualizerProps> = ({
  kurang,
  lebih,
  ideal,
  kebutuhan,
  eksisting,
  maxVal,
}) => {
  console.log(ideal);
  const isDeficit = kurang > 0;
  const isSurplus = lebih > 0;
  const isIdeal = !isDeficit && !isSurplus;

  // Panggil pembaginya menggunakan maxVal.kurang dan maxVal.lebih
  const deficitWidth = isDeficit
    ? Math.max(8, (kurang / maxVal.kurang) * 100)
    : 0;
  const surplusWidth = isSurplus
    ? Math.max(8, (lebih / maxVal.lebih) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-1.5 min-w-[240px]">
      <div className=" gap-2 mb-0.5">
        <span
          className={`text-xs font-bold`}
        >
          {isDeficit
            ? `Kekurangan ${kurang} Guru`
            : isSurplus
              ? `Kelebihan ${lebih} Guru`
              : "Ideal"}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full">
        {/* Left Side: Deficit (Red) */}
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex justify-end">
          <div
            className={`h-full bg-rose-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)] ${isDeficit ? "opacity-100" : "opacity-0"}`}
            style={{ width: `${Math.min(deficitWidth, 100)}%` }}
          />
        </div>

        {isIdeal ? (

          <div className="w-5 h-3 rounded-full flex-shrink-0 flex items-center justify-center bg-lime-500 border border-slate-100" />) : (
          <div className="w-5 h-3 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-100 border border-slate-100" />
        )}

        {/* Right Side: Surplus (Orange) */}
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-amber-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] ${isSurplus ? "opacity-100" : "opacity-0"}`}
            style={{ width: `${Math.min(surplusWidth, 100)}%` }}
          />
        </div>

        <div className="ml-3 text-xs text-right">
          <span className="text-slate-400 font-bold">{eksisting}</span>
          <span className="mx-1 text-slate-200">/</span>
          <span>{kebutuhan}</span>
        </div>
      </div>
    </div>
  );
};
