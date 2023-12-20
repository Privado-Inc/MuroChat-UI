import React, { ReactElement, useEffect } from "react";
import "highlight.js/styles/vs2015.css";
import { Route, Redirect, Switch, useHistory, useLocation } from "react-router-dom";
import Modules from "./privateModules";
import { useSafeAuth } from "app/store";

const Component = ({ children }: { children: ReactElement }) => {
    const { user } = useSafeAuth();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (!user.isOnboardingCompleted) {
            return history.push("/onboarding");
        } else if (location.pathname.startsWith("/onboarding")) {
            return history.push("/");
        }
    }, [user]);

    return children;
};
export default (): ReactElement => {
    const { user } = useSafeAuth();
    const finalModules = Modules.filter((module) => user.permissions[module.key]);

    return (
        <Switch>
            {finalModules.map((item) => (
                <Route key={item.path} path={item.path} exact={item.path === "/"}>
                    <Component>
                        <item.Component />
                    </Component>
                </Route>
            ))}
            <Redirect key="path" to={!user.isOnboardingCompleted ? "/onboarding" : finalModules[0].path} />
        </Switch>
    );
};
