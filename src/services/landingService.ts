import { api_ptk } from "../config/api";

const endpoint = "/v1/gtk-landingpage";

export const LandingService = {
    getDashboardData: async (params?: any) => {
        try {
            const response = await api_ptk.get(`${endpoint}/summary`, { params });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch landing page data:", error);
            throw error;
        }
    },
    trackProgress: async (id: string) => {
        try {
            const response = await api_ptk.get(`${endpoint}/track/${id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to track progress:", error);
            throw error;
        }
    },
    getServiceDetails: async () => {
        try {
            const response = await api_ptk.get(`${endpoint}/details`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch service details:", error);
            throw error;
        }
    },
    getAdmins: async () => {
        try {
            const response = await api_ptk.get(`${endpoint}/admins`);
            return response;
        } catch (error) {
            console.error("Failed to fetch admins:", error);
            throw error;
        }
    },
    getSubjectDetail: async (id: string | number, params?: any) => {
        const response = await api_ptk.get(`${endpoint}/subject/${id}`, { params });
        return response.data;
    },
    getRegionDetail: async (id: string | number, params?: any) => {
        const response = await api_ptk.get(`${endpoint}/region/${id}`, { params });
        return response.data;
    }
};

export const TeacherPublicService = {
    getTeachers: async (params?: Record<string, any>) => {
        const response = await api_ptk.get(`${endpoint}/teachers`, { params });
        return response.data;
    },
    getTeacher: async (id: number | string) => {
        const response = await api_ptk.get(`${endpoint}/teachers/${id}`);
        return response.data;
    },
    getTeacherEducations: async (id: number | string) => {
        const response = await api_ptk.get(`${endpoint}/teachers/${id}/educations`);
        return response.data;
    },
    getTeacherBimteks: async (id: number | string) => {
        const response = await api_ptk.get(`${endpoint}/teachers/${id}/bimteks`);
        return response.data;
    },
};
