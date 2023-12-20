import React, { ReactElement } from "react";
import styled from "styled-components";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { TextStyles, Colors } from "../../uiLibrary";
import Routes, { Labels } from "./routes";
import { useSafeAuth } from "app/store";
import ApplicationWithHeader from "components/ApplicationWithHeader";
import SettingsLayout from "./components/settingsLayout";

const InitializeRoutes = (): ReactElement => {
    const {
        user: { permissions }
    } = useSafeAuth();
    const { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route
                    path={path}
                    render={() => {
                        return (
                            <ApplicationWithHeader>
                                <SettingsLayout />
                            </ApplicationWithHeader>
                        );
                    }}
                />
            </Switch>
        </>
    );
};

export default {
    key: "settings",
    path: Routes.Settings,
    Component: () => <InitializeRoutes />
};
