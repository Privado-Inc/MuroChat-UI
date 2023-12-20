import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import getConfiguration from "../../idpConfiguration";
import Configuration from "../../constants/configuration";

class AuthService {
    userManager;

    constructor() {
        const configuration = Configuration();
        const isOktaEnabled = configuration.okta && configuration.okta.enabled;
        if (isOktaEnabled) {
            const configuration = getConfiguration();
            const settings = {
                ...configuration,
                userStore: new WebStorageStateStore({
                    store: window.localStorage
                }),
                stateStore: {
                    get: (key: string): Promise<string> => {
                        return Promise.resolve(sessionStorage.getItem(key) || ""); // Return as a User object
                    },
                    remove: (key: string): Promise<string> => {
                        const value = sessionStorage.getItem(key) || "";
                        sessionStorage.removeItem(key);
                        sessionStorage.removeItem("secretCode");
                        return Promise.resolve(value);
                    },
                    set: (key: string, secret: string): Promise<void> => {
                        sessionStorage.setItem(key, secret);
                        return Promise.resolve();
                    },
                    getAllKeys: () => {
                        if (sessionStorage.getItem("secretCode")) {
                            return Promise.resolve(["secretCode"]);
                        } else {
                            return Promise.resolve([]);
                        }
                    }
                }
            };

            this.userManager = new UserManager(settings);
        }
    }

    login() {
        const params = { secretCode: "" };

        return (
            this.userManager &&
            this.userManager.signinRedirect({
                state: { secretCode: params.secretCode || "" }
            })
        );
    }

    logout() {
        return this.userManager && this.userManager.signoutRedirect();
    }

    getUser() {
        return this.userManager && this.userManager.getUser();
    }

    handleCallback() {
        return this.userManager && this.userManager.signinRedirectCallback();
    }
}

let authService: any;

export default () => {
    if (!authService) {
        authService = new AuthService();
    }
    return authService;
};
