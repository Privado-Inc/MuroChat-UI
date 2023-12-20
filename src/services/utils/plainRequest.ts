import Logger from "../../utils/log";
import { axiosOriginal, RequestConfig } from "./axios";
import { Response, getUISuccessResponse, getUIErrorResponse } from "./parseResponse";

export const getPlainRequest = async <T>(url: string, config: RequestConfig = {}): Promise<Response<T>> => {
    try {
        const response: any = await axiosOriginal.get<{ data: T }>(url, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            ...config
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e);
    }
};

export const putPlainRequest = async <T>(
    url: string,
    data: unknown,
    config: RequestConfig = {}
): Promise<Response<T>> => {
    try {
        const response: any = await axiosOriginal.put<{ data: T }>(url, JSON.stringify(data), {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            ...config
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e);
    }
};
