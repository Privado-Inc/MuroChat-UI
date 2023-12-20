import React, { ReactElement } from "react";
import { useRouteMatch } from "react-router-dom";
import BookmarkPageLayout from "./bookmarksPageLayout";

const BookmarkRoutes = (): ReactElement => {
    const { path } = useRouteMatch();
    return (
        <BookmarkPageLayout />
    );
};

export default BookmarkRoutes;
