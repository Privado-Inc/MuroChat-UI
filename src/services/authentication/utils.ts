import LocalStorage from "../utils/storage/LocalStorage";

import type { LoginResponse } from "./types";

export const saveTokensInLocalStorage = (data: LoginResponse): LoginResponse => {
    LocalStorage.setAccessToken(data.token);

    return data;
};
