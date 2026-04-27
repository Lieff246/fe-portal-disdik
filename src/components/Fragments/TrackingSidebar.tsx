import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Circle, Clock, X, Loader2 } from 'lucide-react';
import { LandingService } from '@/services/landingService';

interface TrackingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingSidebar: React.FC<TrackingSidebarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHasSearched(false);
      setResults(null);
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await LandingService.trackProgress(searchQuery);
        setResults(response);
      } catch (err) {
        console.error(err);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setHasSearched(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'
          }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-primary">Lacak Progress Layanan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6 bg-gray-50/50 flex-1">
          <form onSubmit={handleSearch} className="flex items-center gap-3 mb-8">
            <input
              type="text"
              placeholder="Masukkan NIP atau Nomor Ajuan..."
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Lacak
            </button>
          </form>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-sm text-gray-500">Mencari data...</p>
            </div>
          ) : hasSearched ? (
            results ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <div className="flex flex-col gap-1 mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DATA PEGAWAI</p>
                    <h3 className="font-bold text-xl text-gray-800 leading-tight">{results.submission.teacher}</h3>
                    <p className="text-sm font-medium text-gray-500">{results.submission.school}</p>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">JENIS LAYANAN</p>
                      <p className="text-sm font-bold text-gray-700">{results.submission.category}</p>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NOMOR AJUAN</p>
                      <p className="text-sm font-mono font-bold text-gray-600">#{results.submission.number || results.submission.id}</p>
                    </div>
                  </div>
                </div>

                {/* Total Time Box */}
                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex items-center justify-between">
                  <span className="font-bold text-gray-600 uppercase tracking-widest text-xs">TOTAL WAKTU PROSES</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{results.submission.total_days}</span>
                    <span className="text-sm font-bold text-primary/60 uppercase">Hari</span>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                  <div className="relative space-y-12">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-gray-100" />

                    {results.milestones.map((milestone: any, idx: number) => (
                      <div key={idx} className="relative flex items-start gap-6 group">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${milestone.status === 'SELESAI'
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : milestone.status === 'PROSES'
                              ? 'bg-blue-100 text-primary animate-pulse'
                              : 'bg-gray-50 text-gray-300'
                          }`}>
                          {milestone.status === 'SELESAI' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : milestone.status === 'PROSES' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <h4 className={`font-bold text-sm tracking-tight transition-colors ${milestone.status === 'MENUNGGU' ? 'text-gray-300' : 'text-gray-800'
                              }`}>
                              {milestone.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${milestone.status === 'SELESAI'
                                  ? 'text-primary'
                                  : milestone.status === 'PROSES'
                                    ? 'text-blue-400'
                                    : 'text-gray-300'
                                }`}>
                                {milestone.status}
                              </span>
                              {milestone.duration && (
                                <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100">
                                  {milestone.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          {milestone.status !== 'MENUNGGU' && (
                            <span className="text-xs font-bold text-gray-400">
                              {milestone.date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <X className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h4>
                <p className="text-sm text-gray-500">Pastikan NIP atau Nomor Ajuan yang dimasukkan sudah benar.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center px-10">
              <Search className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Silakan masukkan NIP atau Nomor Ajuan untuk melacak berkas Anda</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
