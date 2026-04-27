import React from 'react';
import { Users, UserCircle, Briefcase, TrendingUp } from 'lucide-react';

export const SidebarKPI: React.FC = () => {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6 pointer-events-none w-80">
      
      {/* Total Employees */}
      <div className="glass-card pointer-events-auto group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +2.4%
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pegawai (ASN)</h3>
        <p className="text-4xl font-extrabold text-forest tracking-tight">14,285</p>
      </div>

      {/* PNS vs PPPK Ratio */}
      <div className="glass-card pointer-events-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Rasio PNS & PPPK</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-bold text-forest mb-2">
              <span>PNS</span>
              <span>68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-forest h-2.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-bold text-forest-light mb-2">
              <span>PPPK</span>
              <span>32%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-forest-light h-2.5 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Retirements */}
      <div className="glass-card pointer-events-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <UserCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Purna Tugas (Thn Ini)</h3>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-4xl font-extrabold text-forest tracking-tight">412</p>
          <span className="text-sm font-medium text-gray-500 mb-1">Pegawai</span>
        </div>
      </div>

    </div>
  );
};
