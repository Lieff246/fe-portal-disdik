import React from 'react';
import { X } from 'lucide-react';
import type { DetailData } from '@/types';

interface DetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  detailData: DetailData | null;
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({ isOpen, onClose, detailData }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-forest">
              {detailData?.title || 'Detail Informasi'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="pt-2">
            {/* Dynamic Content based on Data */}
            {!detailData?.data ? (
              <p className="text-gray-500 text-sm">Tidak ada data detail tambahan.</p>
            ) : Array.isArray(detailData.data) ? (
              <ul className="space-y-4">
                {detailData.data.map((item: any, idx: any) => (
                  <li key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-bold text-forest">{item.name || 'Nama Tidak Diketahui'}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.desc || item.status || '-'}</p>
                    {item.date && (
                      <span className="inline-block mt-2 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {item.date}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="bg-gray-50 p-4 rounded-xl text-xs overflow-x-auto text-gray-600">
                {JSON.stringify(detailData.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
