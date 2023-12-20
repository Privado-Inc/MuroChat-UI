import React, { ReactElement } from "react";
import styled from "styled-components";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { ReactComponent as BookamarkIcon } from "assets/svg/bookmark.svg";
import { ReactComponent as ChatIcon } from "assets/svg/chat.svg";
import { ReactComponent as ShareIcon } from "assets/svg/share.svg";

import Routes from "./routes";
import ChatList from "../chat";
import Bookmarks from "../bookmarks";
import Tabs from "./Tabs";
import Share from "../share";

const tabs = [
    {
        label: <ChatIcon />,
        path: Routes.Chats,
        Component: () => {
            const { url } = useRouteMatch();
            return <Switch>
                <Route
                    key={"chatItem"}
                    path={`${url}/:chatId`}
                    render={() => (
                        <ChatList />
                    )}
                />

                <Redirect
                    key="default"
                    to={{
                        pathname: `${url}/loading`
                    }}
                />
            </Switch>
        }
    },
    {
        label: <BookamarkIcon />,
        path: Routes.Bookmarks,
        Component: () => <Bookmarks />
    },
    {
        label: <ShareIcon />,
        path: Routes.Share,
        Component: () => {
            const { url } = useRouteMatch();
            return <Switch>
                <Route
                    key={"chatShare"}
                    path={`${url}/:chatId`}
                    render={() => (
                        <Share />
                    )}
                />
                <Route
                    key={"chatShareItems"}
                    path={url}
                    render={() => (
                        <Share />
                    )}
                />

                <Redirect
                    key="default"
                    to={{
                        pathname: url
                    }}
                />
            </Switch>
        }
    }
];


const ChatPage = styled.div`
    display: flex;
    max-height: calc(100% - 55px);
    height: calc(100% - 55px);
    width: 100%;
    position: relative;
`;


const ChatPageLayout = (): ReactElement => {
    const { url } = useRouteMatch();
    // const newTabs = permissions.settings.configure_settings ? tabs : [tabs[0]];
    return <ChatPage>
        <Tabs
            tabs={tabs.map((tab) => ({
                ...tab,
                path: `${url}${tab.path}`
            }))}
        />
    </ChatPage>
};

export default ChatPageLayout;

