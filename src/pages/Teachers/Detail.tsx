import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeacherPublicService } from '@/services/landingService';

const TYPE_BADGES: Record<string, string> = {
  'PNS': 'bg-blue-100 text-blue-700',
  'PPPK Penuh waktu': 'bg-emerald-100 text-emerald-700',
  'PPPK Paruh waktu': 'bg-amber-100 text-amber-700',
  'Non paruh waktu': 'bg-slate-100 text-slate-600',
};

const AVATAR_COLORS = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600', 'from-amber-500 to-orange-600'];

const Avatar = ({ name, photo }: { name: string; photo?: string }) => {
  const initials = name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  const colorIdx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  if (photo) return <img src={photo} alt={name} className="w-32 h-32 rounded-2xl object-cover shadow-xl border-4 border-white" />;
  return (
    <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
      {initials}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700 font-medium">{value}</span>
    </div>
  );
};

export const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [bimteks, setBimteks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'biodata' | 'pendidikan' | 'bimtek'>('biodata');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [teacherResp, eduResp, bimtekResp] = await Promise.all([
          TeacherPublicService.getTeacher(id!),
          TeacherPublicService.getTeacherEducations(id!),
          TeacherPublicService.getTeacherBimteks(id!),
        ]);
        setTeacher(teacherResp?.data?.teacher);
        setEducations(eduResp?.data?.educations || []);
        setBimteks(bimtekResp?.data?.bimteks || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Memuat profil guru...</p>
      </div>
    </div>
  );

  if (!teacher) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl mb-4">😔</p>
        <p className="text-slate-600 font-medium">Guru tidak ditemukan</p>
        <button onClick={() => navigate('/teachers')} className="mt-4 px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
          ← Kembali ke daftar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 pt-16 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNlYyNGgtNnY2aC02VjE4SDI0djZoLTZ2LTZIMTh2NmgtNnYtNkgwaDB2NmgxMnY2aDZWMTJoNlY2aDZWMEg2djZoNnY2aDZ2NmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <button onClick={() => navigate('/teachers')} className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm mb-8">
            ← Kembali ke daftar guru
          </button>
          <div className="flex items-end gap-6">
            <Avatar name={teacher.name} photo={teacher.photo_url} />
            <div className="text-white pb-2">
              <h1 className="text-3xl font-bold">{teacher.name}</h1>
              <p className="text-blue-200 font-mono text-sm mt-1">NIP: {teacher.nip}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {teacher.type && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TYPE_BADGES[teacher.type] || 'bg-white/20 text-white'}`}>{teacher.type}</span>}
                {teacher.nama_jabatan && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-100 border border-white/20">{teacher.nama_jabatan}</span>}
                {teacher.last_education && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-100 border border-white/20">🎓 {teacher.last_education}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10 pb-16">
        {/* Quick stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Riwayat Pendidikan', value: educations.length, icon: '🎓' },
            { label: 'Bimtek Diikuti', value: bimteks.length, icon: '📜' },
            { label: 'Sekolah', value: teacher.school?.name || '-', icon: '🏫', small: true },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={stat.small ? 'text-xs font-bold text-slate-700 line-clamp-2' : 'text-2xl font-bold text-indigo-600'}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { key: 'biodata', label: '👤 Biodata' },
              { key: 'pendidikan', label: `🎓 Riwayat Pendidikan (${educations.length})` },
              { key: 'bimtek', label: `📜 Bimtek (${bimteks.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Biodata tab */}
            {activeTab === 'biodata' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Identitas</h3>
                  <InfoRow label="NIK" value={teacher.nik} />
                  <InfoRow label="Jenis Kelamin" value={teacher.gender === 'L' ? 'Laki-laki' : teacher.gender === 'P' ? 'Perempuan' : null} />
                  <InfoRow label="Agama" value={teacher.religion} />
                  <InfoRow label="Gol. Darah" value={teacher.golongan_darah} />
                  <InfoRow label="Tempat Lahir" value={teacher.birthplace} />
                  <InfoRow label="Tanggal Lahir" value={teacher.birthday ? new Date(teacher.birthday).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                  <InfoRow label="Alamat" value={teacher.address} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Kepegawaian</h3>
                  <InfoRow label="Status" value={teacher.type} />
                  <InfoRow label="Pend. Terakhir" value={teacher.last_education} />
                  <InfoRow label="Bid. Studi Pend." value={teacher.bidang_studi_pendidikan} />
                  <InfoRow label="Bid. Studi Sertif." value={teacher.bidang_studi_sertifikasi} />
                  <InfoRow label="Jabatan" value={teacher.nama_jabatan} />
                  <InfoRow label="Jenjang Fungsional" value={teacher.jenjang_jabatan_fungsional} />
                  <InfoRow label="Kelas Jabatan" value={teacher.kelas_jabatan} />
                  <InfoRow label="Sekolah Induk" value={teacher.school?.name} />
                  <InfoRow label="Sekolah Penempatan" value={teacher.placement_school?.name} />
                  <InfoRow label="Pangkat" value={teacher.rank ? `${teacher.rank.name} - ${teacher.rank.level}` : null} />
                  {teacher.keterangan && <InfoRow label="Keterangan" value={teacher.keterangan} />}
                </div>
              </div>
            )}

            {/* Pendidikan tab */}
            {activeTab === 'pendidikan' && (
              <div className="space-y-3">
                {educations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-4xl mb-2">🎓</p>
                    <p className="text-sm">Belum ada riwayat pendidikan</p>
                  </div>
                ) : (
                  educations.map(edu => (
                    <div key={edu.id} className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {edu.kategori}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{edu.name}</p>
                        {edu.date && <p className="text-xs text-slate-400 mt-0.5">Lulus: {new Date(edu.date).getFullYear()}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bimtek tab */}
            {activeTab === 'bimtek' && (
              <div className="space-y-3">
                {bimteks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-4xl mb-2">📜</p>
                    <p className="text-sm">Belum ada data bimtek</p>
                  </div>
                ) : (
                  bimteks.map(b => (
                    <div key={b.id} className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg flex-shrink-0">📜</div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{b.name}</p>
                        {b.date && <p className="text-xs text-slate-400 mt-0.5">{new Date(b.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
