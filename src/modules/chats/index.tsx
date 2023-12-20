import React, { ReactElement } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import ApplicationWithHeader from "components/ApplicationWithHeader";
import Routes from "./routes";
import ChatPageLayout from "./chatPageLayout";

const InitializeRoutes = (): ReactElement => {
    return (
        <ApplicationWithHeader>
            <ChatPageLayout />
        </ApplicationWithHeader>
    );
};

export default {
    key: "chats",
    path: Routes.Chat,
    Component: (): ReactElement => <InitializeRoutes />
};
