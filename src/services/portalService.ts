import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortalService = {
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/summary`);
    return response.data.data;
  },
  getProjections: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/portal/projections`, { params });
    return response.data.data;
  },
  getPortalCards: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/cards`);
    return response.data.data;
  },
  getNeraca: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/portal/neraca`, { params });
    return response.data.data;
  },
  getSchoolReports: async (params?: any) => {
    const response = await axios.get(`${API_BASE_URL}/portal/school-reports`, { params });
    return response.data; // Return full response for summary
  },
  getRegionDetail: async (params?: { department_id: string; month?: string; range?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/portal/region-detail`, { params });
    return response.data.data;
  },
  getDepartments: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/departments`);
    return response.data.data;
  },
  getGtkStats: async () => {
    // This one might still be from GTK service
    const API_GTK_URL = import.meta.env.VITE_API_SERVICE_GTK;
    const response = await axios.get(`${API_GTK_URL}/v1/gtk-landingpage/summary`);
    return response.data.data;
  }
};
