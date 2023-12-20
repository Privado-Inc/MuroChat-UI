import { get, post } from "../utils/request";

import { Response, getUISuccessResponse } from "../utils/parseResponse";
import parseLoginData from "./parseLoginData";

import Endpoints from "./endpoints";
import { BackendUser, LoginResponse, UIUser, LoginSSOPayload } from "./types";
import { saveTokensInLocalStorage } from "./utils";

export const getUserDetails = async (): Promise<Response<UIUser>> => {
    const response = await get<BackendUser>(Endpoints.getCurrentLoggedInUser());

    if (!response.ok) {
        return response;
    }

    return getUISuccessResponse({
        data: parseLoginData(response.data)
    });
};

export const loginViaSSO = async (requestData: LoginSSOPayload): Promise<Response<LoginResponse>> => {
    const loginResponse = await post<LoginResponse>(Endpoints.signInIdp(), {
        ...requestData,
        email: requestData.email
    });
    if (loginResponse.ok) {
        saveTokensInLocalStorage(loginResponse.data);
    }
    return loginResponse;
};

export const logout = async (): Promise<void> => {
    await get(Endpoints.logout());
};
