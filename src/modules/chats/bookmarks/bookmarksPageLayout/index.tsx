import React, { ReactElement } from "react";
import { useRouteMatch } from "react-router-dom";

import Routes from "./routes";
import BookmarksTabs from "./BookmarksTabs";
import Bookmarks from "../bookmarks";

const tabs = [
    {
        label: "All Bookmarks",
        path: Routes.Bookmarks,
        Component: () => <Bookmarks />
    },
    {
        label: "Prompts",
        path: Routes.Prompts,
        Component: () => <Bookmarks />
    },
    {
        label: "Responses",
        path: Routes.Responses,
        Component: () => <Bookmarks />
    }
];


const BookmarkPageLayout = (): ReactElement => {
    const { url } = useRouteMatch();
    return (<>
        <div>
            <BookmarksTabs
                tabs={tabs.map((tab) => ({
                    ...tab,
                    path: `${url}${tab.path}`
                }))}
            />
        </div>
    </>)
};

export default BookmarkPageLayout;
