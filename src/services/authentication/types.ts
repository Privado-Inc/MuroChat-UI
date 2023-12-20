export enum Roles {
    IT_ADMIN = "IT_ADMIN",
    SECURITY_PRIVACY_ADMIN = "SECURITY_PRIVACY_ADMIN",
    USER = "USER"
}

export type BackendUser = {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: Roles;
    permissions: {
        settings: boolean;
        chat: boolean;
        onboarding: boolean;
    };
    account: {
        id: string;
        name: string;
        is_setup_done: boolean;
    };
};

export type LoginResponse = {
    token: string;
    user: BackendUser;
};

export type UIUser = {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: Roles;
    permissions: {
        settings: boolean;
        chat: boolean;
        onboarding: boolean;
    };
    accountId: string;
    isOnboardingCompleted: boolean;
};

export type LoginSSOPayload = {
    email: string;
    token: string;
    firstName: string;
    lastName: string;
    id: string;
};
