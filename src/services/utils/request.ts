import Logger from "../../utils/log";
import axiosInstance, { RequestConfig } from "./axios";
import { buildFullURL, createCommonHeaders } from "./urlBuilder";
import { Response, getUISuccessResponse, getUIErrorResponse, UISuccessResponse } from "./parseResponse";

export const get = async <T>(
    path: string,
    config: RequestConfig = {},
    overrider: { host?: string; queryParams?: { [a: string]: any } } = {}
): Promise<Response<T>> => {
    try {
        const response: any = await axiosInstance.get<{ data: T }>(
            buildFullURL(path, overrider.host, {
                isUI: "true",
                ...(overrider.queryParams || {})
            }),
            {
                headers: createCommonHeaders(path),
                ...config
            }
        );
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e);
    }
};

export const getWithErrorThrow = async <T>(
    path: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {}
): Promise<UISuccessResponse<T>> => {
    try {
        const response: any = await axiosInstance.get<{ data: T }>(buildFullURL(path, overrider.host), {
            headers: createCommonHeaders(path),
            ...config
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e.response);
        const err = new Error("Failed");
        (err as any).info = getUIErrorResponse(e);
        throw err;
    }
};

export const getByAbsoluteUrl = async <T>(
    path: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {}
): Promise<Response<T>> => {
    try {
        const response: any = await axiosInstance.get<{ data: T }>(
            buildFullURL(path, overrider.host),

            {
                headers: createCommonHeaders(path),
                ...config
            }
        );
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e);
    }
};

export const getByAbsoluteUrlWithErrorThrow = async <T>(
    path: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {}
): Promise<UISuccessResponse<T>> => {
    try {
        const response: any = await axiosInstance.get<{ data: T }>(buildFullURL(path, overrider.host), {
            headers: createCommonHeaders(path),
            ...config
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e.response);
        const err = new Error("Failed");
        (err as any).info = getUIErrorResponse(e);
        throw err;
    }
};

export const remove = async <T>(
    path: string,
    data: unknown,
    config: RequestConfig = {},
    overrider: { host?: string } = {}
): Promise<Response<T>> => {
    try {
        const response = await axiosInstance.delete<{ data: T }>(buildFullURL(path, overrider.host), {
            headers: createCommonHeaders(path),
            ...config,
            data: JSON.stringify(data)
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        return getUIErrorResponse(e);
    }
};

export const post = async <T>(
    path: string,
    data: unknown,
    id?: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {},
    queryParams: { [a: string]: any } = {}
): Promise<Response<T>> => {
    try {
        const finalPath = id ? `${path}/${id}` : path;
        const response = await axiosInstance.post<{ data: T }>(
            buildFullURL(finalPath, overrider.host, {
                ...queryParams,
                isUI: "true"
            }),
            JSON.stringify(data),
            {
                headers: createCommonHeaders(path),
                ...config,
                data: JSON.stringify(data)
            }
        );
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        Logger.log(e);
        return getUIErrorResponse(e);
    }
};

export const postFormData = async <T>(
    path: string,
    data: FormData,
    config: RequestConfig = {},
    overrider: { host?: string } = {}
): Promise<Response<T>> => {
    try {
        const response = await axiosInstance.post<{ data: T }>(buildFullURL(path, overrider.host), data, {
            headers: {
                ...createCommonHeaders(path),
                "Content-Type": "multipart/form-data"
            },
            ...config
        });
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        return getUIErrorResponse(e);
    }
};

export const put = async <T>(
    path: string,
    data: unknown,
    id?: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {},
    queryParam?: { [a: string]: string }
): Promise<Response<T>> => {
    try {
        const finalPath = id ? `${path}/${id}` : path;
        const response = await axiosInstance.put<{ data: T }>(
            buildFullURL(finalPath, overrider.host, queryParam),
            JSON.stringify(data),
            {
                headers: createCommonHeaders(path),
                ...config
            }
        );
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        return getUIErrorResponse(e);
    }
};

export const streamPutPOST = async <T>(
    path: string,
    data: unknown,
    id?: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {},
    queryParam?: { [a: string]: string }
): Promise<any | undefined> => {
    try {
        const finalPath = id ? `${path}/${id}` : path;
        const response = await fetch(buildFullURL(finalPath, overrider.host, queryParam), {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                ...createCommonHeaders(path)
            },
            body: JSON.stringify(data)
        });
        if (!response.body) return undefined; // handle error
        // const text = await response.text(); // Convert Uint8Array to text
        // const jsonData = JSON.parse(text); // Parse JSON

        return response;
    } catch (e: any) {
        return undefined;
    }
};

export const patch = async <T>(
    path: string,
    data: unknown,
    id?: string,
    config: RequestConfig = {},
    overrider: { host?: string } = {},
    queryParam?: { [a: string]: string }
): Promise<Response<T>> => {
    try {
        const finalPath = id ? `${path}/${id}` : path;
        const response = await axiosInstance.patch<{ data: T }>(
            buildFullURL(finalPath, overrider.host, queryParam),
            JSON.stringify(data),
            {
                headers: createCommonHeaders(path),
                ...config
            }
        );
        return getUISuccessResponse<T>(response.data);
    } catch (e: any) {
        return getUIErrorResponse(e);
    }
};
