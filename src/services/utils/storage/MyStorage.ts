import Logger from "../../../utils/log";

const localStorageAccessKey = "__access__token";

export default class MyStorage {
    storage: Storage;

    constructor(type = "localStorage") {
        if (!window[type])
            throw new Error(
                `Invalid storage type Passed ${type}. https://developer.mozilla.org/en-US/docs/Web/API/Storage`
            );
        this.storage = window[type];
    }

    getAccessToken(): string | null {
        return this.storage.getItem(localStorageAccessKey);
    }

    setAccessToken(token: string): void {
        try {
            this.storage.setItem(localStorageAccessKey, token);
        } catch (e: any) {
            Logger.error(
                "Local storage is disabled or inaccessible, cannot create user session."
            );
        }
    }

    removeAccessToken(): void {
        this.storage.removeItem(localStorageAccessKey);
    }

    clearAllData(): void {
        this.removeAccessToken();
    }
}
