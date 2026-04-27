import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_GTK_URL = import.meta.env.VITE_API_SERVICE_GTK;

export const PortalService = {
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/summary`);
    return response.data.data;
  },
  getProjections: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/projections`);
    return response.data.data;
  },
  getPortalCards: async () => {
    const response = await axios.get(`${API_BASE_URL}/portal/cards`);
    return response.data.data;
  },
  getGtkStats: async () => {
    // PTK card from GTK service
    const response = await axios.get(`${API_GTK_URL}/v1/gtk-landingpage/summary`);
    return response.data.data;
  }

};
