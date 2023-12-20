import Configuration from "../../constants/configuration";
import MyLocalStorage from "./storage/LocalStorage";
const configuration = Configuration();
const Host = configuration.host;

export const buildFullURL = (
    path: string,
    host = Host,
    queryParams: { [a: string]: string } = { isUI: "true" }
): string => {
    const urlWithoutQueryParam = `${host || Host}/${path}`;
    const qp = Object.keys(queryParams)
        .filter((key) => queryParams[key])
        .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
        .join("&");
    return `${urlWithoutQueryParam}${urlWithoutQueryParam.includes("?") ? "&" : "?"}${qp}`;
};

export const addHost = (path: string, host = Host): string => {
    return `${host}/${path}`;
};

export const createCommonHeaders = (path: string): { [a: string]: string } => {
    const headers = {
        "data-url": path,
        "Content-Type": "application/json",
        Authorization: `Token ${MyLocalStorage.getAccessToken()}`,
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json"
    };

    return headers;
};
