export interface AppConfig {
  API_BASE_URL: string;
  SERVICE_PTK: string;
  SERVICE_WEBSEKOLAH: string;
  SERVICE_SCHOOL: string;
  SERVICE_PPDB: string;
  SERVICE_BERANI_CERDAS: string;
  API_MESSAGE_URL: string;
}

export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  SERVICE_PTK: import.meta.env.VITE_API_SERVICE_PTK,
  SERVICE_WEBSEKOLAH: import.meta.env.VITE_API_SERVICE_WEBSEKOLAH,
  SERVICE_SCHOOL: import.meta.env.VITE_API_SERVICE_SCHOOL,
  SERVICE_PPDB: import.meta.env.VITE_API_SERVICE_PPDB,
  SERVICE_BERANI_CERDAS: import.meta.env.VITE_API_SERVICE_BERANI_CERDAS,
  SERVICE_OPENDATA: import.meta.env.VITE_API_SERVICE_OPENDATA,
  API_MESSAGE_URL: import.meta.env.VITE_API_MESSAGE_URL,
};
