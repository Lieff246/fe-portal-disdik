import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortalService = {
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/summary`);
    return response.data.data;
  },
  getProjections: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/projections`, { params });
    return response.data.data;
  },
  getPortalCards: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/cards`);
    return response.data.data;
  },
  getNeraca: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/neraca`, { params });
    return response.data.data;
  },
  downloadNeracaPdf: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/neraca-pdf`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  getSchoolReports: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/school-reports`, { params });
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
    // This one might still be from GTK service
    const API_GTK_URL = import.meta.env.VITE_API_SERVICE_GTK;
    const response = await axios.get(`${API_GTK_URL}/v1/gtk-landingpage/summary`);
    return response.data.data;
  },
  getAboutInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/v1/portal/about-info`);
    return response.data.data;
  }
};
