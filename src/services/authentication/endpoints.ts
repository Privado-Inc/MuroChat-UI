export default {
    getCurrentLoggedInUser: (): string => "u/session-user",
    logout: (): string => "ce/users/logout",
    signInIdp: (): string => "u/sso/okta"
};
