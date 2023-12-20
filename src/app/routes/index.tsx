import React, { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../store";
import PrivateView from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

export default (): ReactElement => {
    const { user } = useAuth();

    if (!user) {
        return <PublicRoutes />;
    }

    if (user) {
        return <PrivateView />;
    }

    throw new Error("Not identified which type of user has loggedIn ");
};
