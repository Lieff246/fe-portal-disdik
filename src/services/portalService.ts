import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_REKAP_URL = import.meta.env.VITE_API_SERVICE_REKAP;

export const PortalService = {
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
    // Keep this one hitting the original API (usually GTK / Dapodik)
    const response = await axios.get(`${API_BASE_URL}/v1/portal/neraca`, { params });
    return response.data.data;
  },
  getNeracaRekap: async (params?: any) => {
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-rekap`, { params });
    return response.data;
  },
  downloadNeracaPdf: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/neraca-pdf`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  getSchoolReports: async (params?: any) => {
    // Fetched from service_rekap progress endpoint
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/progress`, { params });
    return response.data; // Return full response for summary
  },
  getRegionDetail: async (params?: { department_id: string; month?: string; range?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/region-detail`, { params });
    return response.data.data;
  },
  getDepartments: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/departments`);
    return response.data.data;
  },
  getGtkStats: async () => {
    // Now fetched from neracaRekap in service_rekap
    const response = await axios.get(`${API_REKAP_URL}/v1/portal/neraca-rekap`);
    return response.data;
  },
  getAboutInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/about-info`);
    return response.data.data;
  }
};
