import React, { ReactElement } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { UIUser } from "services/authentication/types";
import { getUserDetails } from "services/authentication/login";
import Storage from "services/utils/storage/LocalStorage";
import { Error as ErrorView, Loader } from "uiLibrary/components";

export type GlobalState = {
    user: UIUser;
};

type ProviderValue = {
    user: Nullable<UIUser>;
    updateData: (a: GlobalState) => void;
};

const AuthContext = React.createContext<{
    user: Nullable<UIUser>;
    updateData: Nullable<(a: GlobalState) => void>;
}>({
    user: null,
    updateData: null
});

AuthContext.displayName = "AuthContext";

const AuthProvider = ({ children }: { children: ReactElement }): ReactElement => {
    const [appState, updateState] = React.useState<Nullable<GlobalState>>(null);
    const [isLoading, updateLoading] = React.useState(true);
    const [isError, setError] = React.useState(false);

    const appInitilization = React.useCallback((): void => {
        const token = Storage.getAccessToken();
        if (token) {
            (async () => {
                try {
                    const response = await getUserDetails();
                    if (!response.ok) {
                        return setError(true);
                    }
                    updateLoading(false);
                    setError(false);
                    updateState({ user: response.data });
                } catch (e: any) {
                    console.log(e);
                    updateLoading(false);
                    setError(true);
                }
            })();
        } else {
            updateLoading(false);
        }
    }, [appState]);

    React.useEffect(() => {
        appInitilization();
    }, []);

    const updateData = React.useCallback(
        (state: GlobalState) => {
            updateState({
                ...state
            });
        },
        [updateState]
    );

    const value = React.useMemo(
        () => ({
            user: appState ? appState.user : null,
            updateData
        }),
        [appState, updateData]
    );

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <ErrorView.FullPageError />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): ProviderValue => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context as ProviderValue;
};

type SafeProviderValue = {
    user: UIUser;
    updateData: (a: Partial<GlobalState>) => void;
};

const useSafeAuth = (): SafeProviderValue => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    if (!context.user) {
        throw new Error("App data is not set.!!!!");
    }

    return context as SafeProviderValue;
};

export { AuthProvider, useAuth, useSafeAuth };
