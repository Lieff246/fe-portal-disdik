import { api_pemetaan } from "@/config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminSekolah {
  sekolah_id: string;
  semester_id: string;
  npsn: string;
  nama: string;
  bentuk_pendidikan: string;
  status_sekolah: string;
  alamat_jalan?: string;
  kecamatan?: string;
  kabupaten: string;
  kode_kabupaten: string;
  lintang?: number | null;
  bujur?: number | null;
  email?: string;
  nomor_telepon?: string;
  website?: string;
  akreditasi?: string;
  jumlah_siswa?: number;
  daya_tampung?: number;
  is_3t?: boolean;
  is_sekolah_alam?: boolean;
  akses_internet?: string;
  sumber_listrik?: string;
}

export interface SekolahListMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface SekolahFormData {
  nama: string;
  npsn: string;
  bentuk_pendidikan: string;
  status_sekolah: string;
  alamat_jalan?: string;
  kecamatan?: string;
  kabupaten: string;
  kode_kabupaten: string;
  lintang?: number | string;
  bujur?: number | string;
  email?: string;
  nomor_telepon?: string;
  website?: string;
  akreditasi?: string;
  jumlah_siswa?: number | string;
  daya_tampung?: number | string;
  is_3t?: boolean;
  is_sekolah_alam?: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const AdminService = {

  // ── Auth ────────────────────────────────────────────────────────────────

  login: (email: string, password: string) =>
    api_pemetaan.post("/v1/login", { email, password }),

  logout: () =>
    api_pemetaan.post("/v1/logout"),

  getUser: () =>
    api_pemetaan.get("/v1/user"),

  // ── Sekolah (Admin) ──────────────────────────────────────────────────────

  /**
   * List sekolah dengan pagination + filter.
   * Backend otomatis filter berdasarkan role user.
   */
  getSekolah: (params?: {
    search?: string;
    jenjang?: string;
    kode_kabupaten?: string;
    status_sekolah?: string;
    is_3t?: boolean;
    per_page?: number;
    page?: number;
  }) => api_pemetaan.get("/v1/admin/sekolah", { params }),

  /** Detail satu sekolah berdasarkan NPSN */
  getSekolahDetail: (npsn: string) =>
    api_pemetaan.get(`/v1/admin/sekolah/${npsn}`),

  /** Tambah sekolah baru */
  createSekolah: (data: SekolahFormData) =>
    api_pemetaan.post("/v1/admin/sekolah", data),

  /** Update data sekolah */
  updateSekolah: (npsn: string, data: Partial<SekolahFormData>) =>
    api_pemetaan.put(`/v1/admin/sekolah/${npsn}`, data),

  /** Hapus sekolah */
  deleteSekolah: (npsn: string) =>
    api_pemetaan.delete(`/v1/admin/sekolah/${npsn}`),
};
