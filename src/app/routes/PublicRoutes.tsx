import React, { ReactElement } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import AuthenticationRoutes from "modules/authentication";

export default (): ReactElement => {
    const publicRoute = AuthenticationRoutes.map((config) => (
        <Route
            key={config.path}
            exact
            path={config.path}
            render={() => {
                return <config.Component />;
            }}
        />
    ));

    return (
        <Switch>
            {publicRoute}
            <Redirect
                key="loginDefault"
                to={{
                    pathname: "/login"
                }}
            />
        </Switch>
    );
};
