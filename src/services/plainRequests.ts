import MyLocalStorage from "./utils/storage/LocalStorage";
import Logger from "../utils/log";
import axiosInstance, { axiosOriginal, RequestConfig } from "./utils/axios";
import { Response, getUISuccessResponse, getUIErrorResponse } from "./utils/parseResponse";

const createCommonHeaders = (path: string, contentType = "application/json"): { [a: string]: string } => {
    const commonHeaders = {
        "data-url": path,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": contentType,
        Accept: "application/json"
    };
    if (MyLocalStorage.getAccessToken()) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        commonHeaders["Authorization"] = `Token ${MyLocalStorage.getAccessToken()}`;
        // eslint-disable-next-line @typescript-eslint/dot-notation
    }
    return commonHeaders;
};
// const uploadHeader = createCommonHeaders("multipart/form-data");

export const getPlainRequest = async <T>(url: string, config: RequestConfig = {}): Promise<Response<T>> => {
    try {
        const response: any = await axiosOriginal.get<{ data: T }>(url, {
            headers: createCommonHeaders(url),
            ...config
        });
        return getUISuccessResponse<T>({ data: response.data });
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e as any);
    }
};

export const postPlainRequest = async <T>(
    url: string,
    data: unknown,
    headers: { [a: string]: string } = {},
    config: RequestConfig = {},
    sendRawData = false
): Promise<Response<T>> => {
    try {
        const newData = sendRawData ? data : JSON.stringify(data);
        const response: any = await axiosOriginal.post<{ data: T }>(url, newData, {
            headers: { ...createCommonHeaders(url), ...headers },
            ...config
        });
        return getUISuccessResponse<T>({ data: response.data });
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e as any);
    }
};
export const putPlainRequest = async <T>(
    url: string,
    data: unknown,
    config: RequestConfig = {}
): Promise<Response<T>> => {
    try {
        const response: any = await axiosOriginal.put<{ data: T }>(url, JSON.stringify(data), {
            headers: createCommonHeaders(url),
            ...config
        });
        return getUISuccessResponse<T>({ data: response.data });
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e as any);
    }
};

export const downloadPlainPostRequest = async <T>(
    url: string,
    data: unknown,
    config: RequestConfig = {}
): Promise<Blob> => {
    try {
        const response: any = await axiosInstance.post<T>(url, data, {
            headers: createCommonHeaders(url),
            ...config
        });
        return new Blob([response.data], {
            type: "text/csv"
        });
    } catch (e: any) {
        Logger.log(e);
        throw e;
    }
};
