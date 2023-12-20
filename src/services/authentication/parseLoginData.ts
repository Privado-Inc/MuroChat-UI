import { BackendUser, UIUser } from "./types";

export default (userData: BackendUser): UIUser => {
    return {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        permissions: userData.permissions,
        accountId: userData.account.id,
        isOnboardingCompleted: !!userData.account.is_setup_done
    };
};
