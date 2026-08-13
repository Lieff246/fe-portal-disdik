import { clearAccessTokenCookie, getAccessTokenCookie } from "@/utils/cookie";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { showNotification } from "@/utils/notification";

export const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // auth tetap aman
  config.headers.Authorization = `Bearer ${getAccessTokenCookie()}`;
  // 🔥 KUNCI UTAMA
  if (config.data instanceof FormData) {
    // BIARKAN BROWSER SET multipart boundary
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
};

export const onRequestError = (error: any): Promise<any> => {
  return Promise.reject(error.response);
};

export const onResponse = (response: AxiosResponse): any => {
  return response.data;
};

export const onResponseError = (error: any): Promise<any> => {
  localStorage.removeItem("error501");

  if (error.response.status === 401) {
    clearAccessTokenCookie();
    // window.location.pathname = "/login";
  } else if (error.response.status === 501) {
    const error_data = error.response.data;
    localStorage.setItem("error501", error_data);
    // window.location.pathname = "/error-page";
  } else if (error.response.status === 502) {
    const error_data = error.response.data;
    localStorage.setItem("error501", error_data);
    console.log(error);
    window.location.pathname = "/error-page-json";
  } else if (error.response.status == 400) {
    // showNotification("failed", "Gagal  ", error.response.data.message);
    {
      Object.entries(error.response.data.form).map(([field, message]) => {
        showNotification("failed", field, (message as string[]).join(", "));
      });
    }
  } else if (error.response.status === 500) {
    const error_data = JSON.stringify(error.response.data.message);
    localStorage.setItem("error501", error_data);
    // window.location.pathname = "/error-page";
  }

  return Promise.reject(error.response);
};
