import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Static dummy data (no database)
const TEACHER_OF_MONTH = {
  name: 'Hj. Siti Rahma, S.Pd., M.Pd.',
  school: 'SMAN 1 Palu',
  jabatan: 'Guru Madya – Bahasa Indonesia',
  avatar: null,
  xp: 4850,
  badges: ['🏆 Guru Teladan', '📚 Pahlawan Literasi', '⭐ Mentor Terbaik'],
  stats: [
    { label: 'Siswa Diajar', value: '340' },
    { label: 'Bimtek Diikuti', value: '18' },
    { label: 'Tahun Pengabdian', value: '24' },
    { label: 'Poin XP', value: '4,850' },
  ],
};

const GURU_PENGGERAK = [
  { name: 'Drs. Ahmad Fauzi, M.Si.', school: 'SMAN 3 Palu', bidang: 'Matematika', xp: 4200, rank: 2 },
  { name: 'Dr. Maria Magdalena, S.Pd.', school: 'SMPN 1 Palu', bidang: 'IPA Terpadu', xp: 3980, rank: 3 },
  { name: 'H. Bambang Suryo, S.T., M.T.', school: 'SMK N 1 Palu', bidang: 'Teknologi Mek.', xp: 3750, rank: 4 },
  { name: 'Nurhaida, S.Pd., M.Pd.', school: 'SMAN 2 Donggala', bidang: 'Bahasa Inggris', xp: 3620, rank: 5 },
  { name: 'Irwan Bachtiar, S.Pd.', school: 'SMPN 5 Palu', bidang: 'Seni Budaya', xp: 3480, rank: 6 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Hj. Siti Rahma, S.Pd., M.Pd.', school: 'SMAN 1 Palu', xp: 4850, badge: '🥇', level: 'Guru Utama' },
  { rank: 2, name: 'Drs. Ahmad Fauzi, M.Si.', school: 'SMAN 3 Palu', xp: 4200, badge: '🥈', level: 'Guru Utama' },
  { rank: 3, name: 'Dr. Maria Magdalena, S.Pd.', school: 'SMPN 1 Palu', xp: 3980, badge: '🥉', level: 'Guru Madya' },
  { rank: 4, name: 'H. Bambang Suryo, S.T., M.T.', school: 'SMK N 1 Palu', xp: 3750, badge: '4️⃣', level: 'Guru Madya' },
  { rank: 5, name: 'Nurhaida, S.Pd., M.Pd.', school: 'SMAN 2 Donggala', xp: 3620, badge: '5️⃣', level: 'Guru Muda' },
  { rank: 6, name: 'Irwan Bachtiar, S.Pd.', school: 'SMPN 5 Palu', xp: 3480, badge: '6️⃣', level: 'Guru Muda' },
  { rank: 7, name: 'Dewi Kartika, S.Pd., M.Hum.', school: 'SMAN 4 Palu', xp: 3200, badge: '7️⃣', level: 'Guru Muda' },
  { rank: 8, name: 'Moh. Rizal, S.Sos., M.Si.', school: 'SMAN 1 Parigi', xp: 3050, badge: '8️⃣', level: 'Guru Pertama' },
  { rank: 9, name: 'Fatmawati, S.Pd.I.', school: 'MTsN 1 Palu', xp: 2980, badge: '9️⃣', level: 'Guru Pertama' },
  { rank: 10, name: 'Andi Ruslan, S.Pd.', school: 'SMPN 2 Poso', xp: 2850, badge: '🔟', level: 'Guru Pertama' },
];

const ACHIEVEMENT_BADGES = [
  { icon: '📚', name: 'Pahlawan Literasi', desc: 'Membimbing 100+ siswa dalam program literasi', color: 'from-amber-400 to-orange-500', count: 12 },
  { icon: '🔬', name: 'Master Sains', desc: 'Tim olimpiade sains berhasil juara provinsi', color: 'from-blue-400 to-indigo-500', count: 7 },
  { icon: '🎯', name: 'Mentor Unggulan', desc: 'Membina guru junior selama 2+ tahun', color: 'from-emerald-400 to-teal-500', count: 18 },
  { icon: '💡', name: 'Inovator Pendidikan', desc: 'Menciptakan media pembelajaran kreatif', color: 'from-purple-400 to-pink-500', count: 9 },
  { icon: '🌟', name: 'Guru Berprestasi', desc: 'Penghargaan guru berprestasi tingkat daerah', color: 'from-rose-400 to-red-500', count: 5 },
  { icon: '🤝', name: 'Kolaborator Aktif', desc: 'Aktif dalam komunitas belajar guru', color: 'from-cyan-400 to-blue-500', count: 34 },
  { icon: '✍️', name: 'Penulis Ilmiah', desc: 'Menulis karya ilmiah yang dipublikasikan', color: 'from-indigo-400 to-violet-500', count: 4 },
  { icon: '🏅', name: 'Penggerak Kurikulum', desc: 'Pelopor implementasi Kurikulum Merdeka', color: 'from-teal-400 to-emerald-500', count: 21 },
];

const SKILL_SPECIALIZATIONS = [
  { name: 'Matematika', count: 78, color: 'bg-blue-500' },
  { name: 'Bahasa Indonesia', count: 92, color: 'bg-indigo-500' },
  { name: 'Bahasa Inggris', count: 65, color: 'bg-purple-500' },
  { name: 'IPA', count: 71, color: 'bg-emerald-500' },
  { name: 'IPS', count: 58, color: 'bg-teal-500' },
  { name: 'Pend. Agama Islam', count: 84, color: 'bg-amber-500' },
  { name: 'Seni Budaya', count: 43, color: 'bg-rose-500' },
  { name: 'Pend. Jasmani', count: 39, color: 'bg-orange-500' },
  { name: 'TIK', count: 31, color: 'bg-cyan-500' },
  { name: 'Kimia', count: 28, color: 'bg-violet-500' },
  { name: 'Fisika', count: 35, color: 'bg-red-500' },
  { name: 'Biologi', count: 42, color: 'bg-green-500' },
];

const OVERALL_STATS = [
  { label: 'Total Guru', value: '500+', icon: '👨‍🏫', sub: 'Aktif bertugas' },
  { label: 'Guru PNS', value: '275', icon: '🏛️', sub: '55% dari total' },
  { label: 'Guru PPPK', value: '150', icon: '📋', sub: '30% dari total' },
  { label: 'Guru Tersertifikasi', value: '312', icon: '📜', sub: '62.4% bersertifikat' },
  { label: 'Bergelar S2/S3', value: '89', icon: '🎓', sub: '17.8% pascasarjana' },
  { label: 'Bimtek Diikuti', value: '1,247', icon: '🏅', sub: 'Total tahun ini' },
];

const AVATAR_COLORS = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-red-600', 'from-cyan-500 to-blue-600'];
const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const colorIdx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const sizeClass = size === 'lg' ? 'w-24 h-24 text-2xl' : size === 'sm' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-lg';
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

export const TeacherAchievement = () => {
  const navigate = useNavigate();
  const [leaderboardView, setLeaderboardView] = useState<'all' | 'top3'>('all');

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── HERO: Hall of Fame ── */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Floating stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }} />
        ))}

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <button onClick={() => navigate('/teachers')} className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm mb-8">
            ← Kembali ke daftar guru
          </button>
          <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-sm font-semibold mb-6 backdrop-blur-sm">
            🏆 Hall of Fame — Guru Berprestasi Sulawesi Tengah
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300">
              Teachers
            </span>
            <br />
            <span className="text-white">Achievement</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Menghargai dedikasi para pendidik luar biasa. Setiap langkah mereka adalah investasi untuk masa depan bangsa.
          </p>
        </div>
      </section>

      {/* ── OVERALL STATS ── */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {OVERALL_STATS.map(stat => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEACHER OF THE MONTH ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-slate-900 border border-amber-500/30 p-8">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with crown */}
            <div className="relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl">👑</div>
              <Avatar name={TEACHER_OF_MONTH.name} size="lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm border-2 border-slate-900">
                🥇
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">🌟 Guru Bulan Ini</div>
              <h2 className="text-2xl font-black text-white mb-1">{TEACHER_OF_MONTH.name}</h2>
              <p className="text-slate-400 text-sm mb-1">{TEACHER_OF_MONTH.school}</p>
              <p className="text-amber-300/80 text-sm mb-4">{TEACHER_OF_MONTH.jabatan}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {TEACHER_OF_MONTH.badges.map(badge => (
                  <span key={badge} className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-semibold text-amber-300">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TEACHER_OF_MONTH.stats.map(stat => (
                  <div key={stat.label} className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-xl font-black text-amber-300">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* XP bar */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <div className="text-4xl font-black text-amber-400">{TEACHER_OF_MONTH.xp}</div>
              <div className="text-xs text-slate-400">Poin XP</div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '97%' }} />
              </div>
              <div className="text-xs text-amber-400 font-semibold">Level Max — Guru Utama</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD + GURU PENGGERAK side by side ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">🏅 Leaderboard Guru</h2>
              <select
                className="text-xs bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-slate-300 focus:outline-none"
                value={leaderboardView}
                onChange={e => setLeaderboardView(e.target.value as any)}
              >
                <option value="all">Top 10</option>
                <option value="top3">Top 3</option>
              </select>
            </div>
            <div className="divide-y divide-white/5">
              {LEADERBOARD.slice(0, leaderboardView === 'top3' ? 3 : 10).map(t => (
                <div key={t.rank} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${t.rank <= 3 ? 'bg-amber-500/5' : ''}`}>
                  <span className="text-2xl w-8 text-center flex-shrink-0">{t.badge}</span>
                  <Avatar name={t.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                    <p className="text-xs text-slate-400 truncate">{t.school}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-400">{t.xp.toLocaleString()} XP</div>
                    <div className="text-xs text-slate-500">{t.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guru Penggerak */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-500/20 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-emerald-500/20">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">🚀 Guru Penggerak</h2>
              <p className="text-xs text-slate-400 mt-1">Guru pelopor transformasi pendidikan</p>
            </div>
            <div className="p-4 space-y-3">
              {GURU_PENGGERAK.map(g => (
                <div key={g.rank} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <Avatar name={g.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{g.name}</p>
                    <p className="text-xs text-emerald-400">{g.bidang}</p>
                    <p className="text-xs text-slate-500 truncate">{g.school}</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-400">{g.xp.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENT BADGES ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">🏆 Badge Pencapaian</h2>
          <p className="text-slate-400 text-sm">Penghargaan khusus untuk dedikasi luar biasa para guru</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {ACHIEVEMENT_BADGES.map(badge => (
            <div key={badge.name} className="group text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1 cursor-pointer">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                {badge.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{badge.desc}</p>
              <div className="text-lg font-black text-white">{badge.count}</div>
              <div className="text-xs text-slate-500">guru meraih</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILL / SPESIALISASI ── */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-xl font-bold text-white">Spesialisasi Guru</h2>
              <p className="text-sm text-slate-400">Distribusi bidang studi guru aktif</p>
            </div>
          </div>
          <div className="space-y-3">
            {SKILL_SPECIALIZATIONS.map(skill => (
              <div key={skill.name} className="flex items-center gap-4">
                <span className="text-sm text-slate-300 w-40 flex-shrink-0">{skill.name}</span>
                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(skill.count / 100) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-10 text-right">{skill.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
