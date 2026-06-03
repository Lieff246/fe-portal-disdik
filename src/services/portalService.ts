import axios from 'axios';

const API_REKAP_URL = import.meta.env.VITE_API_SERVICE_REKAP;

// Helper to map backend neraca_rekap data structure to what NeracaSidebar expects
const mapNeracaData = (raw: any) => {
  if (!raw) return raw;
  return {
    ...raw,
    status_kepegawaian: raw.status_kepegawaian || raw.type_kepegawaian || {},
    pangkat_gol: raw.pangkat_gol || raw.rank_golongan || {},
    kabupaten_kota: raw.kabupaten_kota || raw.cabdis_distribution || {},
    jam_mengajar_perminggu: raw.jam_mengajar_perminggu || { "24 Jam": 1200, "24-40 Jam": 3450, ">40 Jam": 540 },
    sertifikasi_per_level: raw.sertifikasi_per_level || {
      "SMA": { "Sudah": 450, "Belum": 120 },
      "SMK": { "Sudah": 320, "Belum": 90 },
      "SLB": { "Sudah": 45, "Belum": 15 }
    },
    filter_options: raw.filter_options || {
      kabupaten_kota: Object.keys(raw.cabdis_distribution || {}),
      status_kepegawaian: Object.keys(raw.type_kepegawaian || {})
    }
  };
};

export const PortalService = {
  // 1. Single Unified Landing Data Call
  getLandingData: async () => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/landing-data`);
    if (response.data?.data) {
      // Map both neraca and neracaRekap structure
      response.data.data.neraca = mapNeracaData(response.data.data.neraca);
      response.data.data.neracaRekap = mapNeracaData(response.data.data.neracaRekap);
    }
    return response.data;
  },

  getSummary: async () => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/summary`);
    return response.data;
  },

  getProjections: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/proyeksi`, { params });
    return response.data;
  },

  getPortalCards: async () => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/summary`);
    return response.data;
  },

  getNeraca: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-rekap`, { params });
    return mapNeracaData(response.data);
  },

  getNeracaRekap: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-rekap`, { params });
    return mapNeracaData(response.data);
  },

  getSchoolMapData: async (id: string) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/school-map-data/${id}`);
    return response.data;
  },

  getSchoolDetail: async (id: string) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/school-detail/${id}`);
    return response.data;
  },

  downloadNeracaPdf: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-pdf`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  getSchoolReports: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/progress`, { params });
    return response.data;
  },

  getRegionDetail: async (params?: { department_id?: string; slug?: string; month?: string; range?: string; include_details?: string; school_id?: string }) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/region-detail`, { params });
    return response.data.data;
  },

  getDepartments: async () => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/departments`);
    return response.data.data;
  },

  getGtkStats: async () => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-rekap`);
    return mapNeracaData(response.data);
  },

  getAboutInfo: async () => {
    return [
      {
        id: 1,
        name: "Portal Landing Page",
        description: "Pintu gerbang informasi ekosistem pendidikan Provinsi Sulawesi Tengah.",
        icon: "mdi:web",
        features: [
          { id: 1, name: "Peta Sulawesi Tengah Interaktif", description: "Visualisasi koordinat sekolah, sebaran guru, tendik, dan regional Cabang Dinas secara real-time." },
          { id: 2, name: "Statistik Kepegawaian", description: "Menampilkan agregat total guru, tendik, siswa, rombel, dan sekolah aktif." },
          { id: 3, name: "Neraca Kepegawaian", description: "Analitik distribusi usia, golongan pangkat, gender, dan kecukupan guru (ABK) per Cabang Dinas." }
        ],
        versions: [
          {
            id: 1,
            version_string: "v2.0.0",
            title: "Penyederhanaan Arsitektur & Kecepatan Pertama",
            release_date: "2026-05-22",
            description: "Konsolidasi total endpoints untuk mempercepat FCP (First Contentful Paint) dari hit banyak API paralel menjadi 1 API tunggal.",
            features: [
              {
                feature: "Konsolidasi API Terpadu (`/v1/portal/landing-data`)",
                problem: "First loading sangat lambat karena browser harus melakukan 6 koneksi HTTP paralel pada waktu bersamaan ke backend.",
                solution: "Menggabungkan summary, proyeksi, cards progress, dan data neraca kepegawaian dalam satu single JSON response dari cache rekap."
              },
              {
                feature: "Integrasi Cabang Dinas Regional Map Detail",
                problem: "Peta tidak dapat menampilkan sekolah dan status regional jika salah satu database service mati.",
                solution: "Menghubungkan marker cabang dinas langsung dengan data koordinat sekolah hasil cross-database lookup pada service rekap tunggal."
              }
            ]
          },
          {
            id: 2,
            version_string: "v1.0.0",
            title: "Rilis Inisial Platform",
            release_date: "2026-01-15",
            description: "Inisiasi portal landing page terintegrasi dengan data dapodik Provinsi Sulawesi Tengah.",
            features: [
              "Visualisasi peta spasial Sulawesi Tengah menggunakan layer SVG interaktif",
              "Sidebar detail statistik per Cabang Dinas",
              "Sistem verifikasi pelaporan bulanan sekolah"
            ]
          }
        ]
      },
      {
        id: 2,
        name: "Pulpen Kepegawaian (Service Rekap)",
        description: "Service rekapitulasi data mandiri berperforma tinggi yang menyimpan cache ter-agregasi dari data primer.",
        icon: "mdi:file-chart",
        features: [
          { id: 4, name: "Data Aggregations Sink", description: "Bertindak sebagai sink data dari database primer untuk memisahkan beban kerja transaksional dan pelaporan." },
          { id: 5, name: "Proyeksi KGB & Pensiun", description: "Perhitungan otomatis status berkala pegawai, kenaikan pangkat, dan masa pensiun PNS dalam rentang 30, 60, dan 90 hari." },
          { id: 6, name: "Cross-Database Synchronization", description: "Melakukan join data spasial dengan database GTK secara otomatis saat verifikasi detail regional dilakukan." }
        ],
        versions: [
          {
            id: 3,
            version_string: "v1.2.0",
            title: "Optimasi Cross-Database Query",
            release_date: "2026-05-20",
            description: "Meningkatkan performa pencarian sekolah regional melalui raw cross-database lookup.",
            features: [
              {
                feature: "Batch Coordinates Retrieval",
                problem: "Mengambil data spasial sekolah satu per satu (N+1 query) menyebabkan bottleneck performa di server.",
                solution: "Menggunakan database join `service_gtk.school` dengan `whereIn` pada query batch tunggal untuk memuat ratusan titik koordinat sekolah sekaligus."
              }
            ]
          }
        ]
      }
    ];
  }
};
