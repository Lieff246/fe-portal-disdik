import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ProyeksiCardProps {
  projections: any;
}

export const ProyeksiCard: React.FC<ProyeksiCardProps> = ({ projections }) => {
  const totalTarget = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.target_count || 0),
    0,
  );
  const totalReal = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.real_count || 0),
    0,
  );
  const totalOverdue = Object.values(projections).reduce(
    (acc: number, curr: any) => acc + (curr.overdue_count || 0),
    0,
  );
  // Menghitung belum submit dari selisih total target dan total yang sudah disubmit
  const totalRemaining = Math.max(0, totalTarget - totalReal - totalOverdue);

  const donutData = [
    { name: "Telah Submit", value: totalReal, color: "#10b981" },
    { name: "Belum Submit", value: totalRemaining, color: "#e2e8f0" },
    { name: "Terlewat", value: totalOverdue, color: "#f43f5e" },
  ];

  return (
    <div className="glass rounded-[3rem] p-8 w-1/3 flex flex-col gap-8 h-full">
      {/* Donut Chart */}
      <div className="flex flex-col items-center">
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius="75%"
                outerRadius="100%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Target
            </span>
            <span className="text-3xl font-black text-slate-800 leading-none">
              {totalTarget}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-3 mt-6 w-full">
          {donutData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-700 leading-none">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-6 pt-4 border-t border-slate-300/30">
        {[
          { label: "Berkala", data: projections.berkala },
          { label: "Pangkat", data: projections.pangkat },
          { label: "PNS", data: projections.pns },
          { label: "PPPK", data: projections.pppk },
        ].map((item, idx) => {
          const realized = item.data.real_count;
          const target = item.data.target_count;
          const overdue = item.data.overdue_count;
          const percent = target > 0 ? (realized / target) * 100 : 0;
          const overduePercent = target > 0 ? (overdue / target) * 100 : 0;

          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label} PROSES
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-slate-800">
                    {realized}
                  </span>
                  {overdue > 0 && (
                    <span className="text-xs font-bold text-rose-500">
                      ({overdue}!)
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400">
                    / {target}
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-slate-200/50 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-1000"
                  style={{ width: `${percent}%` }}
                ></div>
                <div
                  className="h-full bg-rose-500 transition-all duration-1000"
                  style={{ width: `${overduePercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
