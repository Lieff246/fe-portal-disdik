import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeacherPublicService } from '@/services/landingService';

const TYPE_COLORS: Record<string, string> = {
  'PNS': 'bg-blue-100 text-blue-700 border-blue-200',
  'PPPK Penuh waktu': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'PPPK Paruh waktu': 'bg-amber-100 text-amber-700 border-amber-200',
  'Non paruh waktu': 'bg-slate-100 text-slate-600 border-slate-200',
};

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

const Avatar = ({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  const colorIdx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-14 h-14 text-base';
  if (photo) return <img src={photo} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

export const TeachersList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [params, setParams] = useState({ page: 1, limit: 12, search: '' });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await TeacherPublicService.getTeachers(params);
      const d = resp?.data;
      if (d?.teacher) {
        setData(d.teacher.data || []);
        setPagination({ current_page: d.teacher.current_page, last_page: d.teacher.last_page, total: d.teacher.total });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      {/* ── CAMPAIGN HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-20">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Dinas Pendidikan Sulawesi Tengah
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Guru Indonesia,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400">Penyelamat Bangsa</span>
              </h1>
              <p className="text-blue-100/80 text-lg mb-8 max-w-lg">
                Para pendidik berdedikasi yang mencerdaskan generasi penerus bangsa di seluruh Sulawesi Tengah. Mereka bukan sekadar pengajar — mereka adalah pahlawan tanpa tanda jasa.
              </p>
              <div className="flex gap-4">
                <a href="#guru-list" className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  Lihat Semua Guru
                </a>
                <button
                  onClick={() => navigate('/teachers/achievement')}
                  className="px-6 py-3 bg-white/10 border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  🏆 Hall of Fame
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Guru', value: pagination.total || '500+', icon: '👨‍🏫', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
                { label: 'Guru PNS', value: Math.floor((pagination.total || 500) * 0.55), icon: '🏛️', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
                { label: 'Guru PPPK', value: Math.floor((pagination.total || 500) * 0.30), icon: '📋', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
                { label: 'Sekolah Terjangkau', value: '50+', icon: '🏫', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
              ].map(stat => (
                <div key={stat.label} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-sm`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</div>
                  <div className="text-blue-200/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & GRID ── */}
      <section id="guru-list" className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-lg">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama guru, NIP... (tekan Enter)"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm bg-white shadow-sm"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setParams(p => ({ ...p, search: searchInput, page: 1 }))}
            />
          </div>
          <button
            onClick={() => setParams(p => ({ ...p, search: searchInput, page: 1 }))}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Cari
          </button>
          <button
            onClick={() => navigate('/teachers/achievement')}
            className="px-5 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
          >
            🏆 Prestasi
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Daftar Guru & Pegawai</h2>
          <p className="text-sm text-slate-400">{pagination.total} guru ditemukan</p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded mb-2" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.map(teacher => (
              <div
                key={teacher.id}
                onClick={() => navigate(`/teachers/${teacher.id}`)}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={teacher.name} photo={teacher.photo_url} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{teacher.name}</h3>
                    <p className="text-xs text-slate-400 font-mono truncate">{teacher.nip}</p>
                    {teacher.type && (
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[teacher.type] || TYPE_COLORS['Non paruh waktu']}`}>
                        {teacher.type}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  {teacher.nama_jabatan && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300">💼</span>
                      <span className="truncate">{teacher.nama_jabatan}</span>
                    </div>
                  )}
                  {teacher.school?.name && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300">🏫</span>
                      <span className="truncate">{teacher.school.name}</span>
                    </div>
                  )}
                  {teacher.last_education && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300">🎓</span>
                      <span>{teacher.last_education}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{teacher.gender === 'L' ? '♂ Laki-laki' : teacher.gender === 'P' ? '♀ Perempuan' : '-'}</span>
                  <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700">Lihat profil →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              ← Sebelumnya
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Halaman {pagination.current_page} / {pagination.last_page}
            </span>
            <button
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
