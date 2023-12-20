import axios, { AxiosRequestConfig } from "axios";
import MyLocalStorage from "./storage/LocalStorage";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status <= 300) {
            return response;
        }
        const newErr = new Error("Error");
        (newErr as any).response = response;
        throw newErr;
    },
    async (error) => {
        if ((!error.response && error.response.status === 403) || error.response.status === 401) {
            MyLocalStorage.clearAllData();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export type RequestConfig = AxiosRequestConfig;

export const axiosOriginal = axios;
export default axiosInstance;
