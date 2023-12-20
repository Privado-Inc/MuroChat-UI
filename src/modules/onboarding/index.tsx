import React, { ReactElement } from "react";
import ApplicationWithHeader from "components/ApplicationWithHeader";
import Routes from "./routes";
import Tabs from "./Tabs";

const InitializeRoutes = (): ReactElement => {
    return (
        <ApplicationWithHeader>
            <Tabs />
        </ApplicationWithHeader>
    );
};

export default {
    key: "onboarding",
    path: Routes.Onboarding,
    Component: (): ReactElement => <InitializeRoutes />
};
