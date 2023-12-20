import React, { ReactElement, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "app/store";
import { useHistory } from "react-router-dom";
import { Notification } from "uiLibrary/components";
import { loginViaSSO, getUserDetails } from "services/authentication/login";
import { ReactComponent as LoaderIcon } from "assets/svg/bigLoader.svg";
import idpClient from "../idpClient";

type User = {
    token: string;
    username: string;
    firstName: string;
    lastName: string;
};

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 150px;
`;

const InnerContainer = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Spinner = styled.span`
    animation-name: loading;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    zoom: 1.5;
    width: 24px;
    height: 24px;
`;

const Bold = styled.p`
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    line-height: 28px;
    color: #3d4658;
    margin-bottom: 15px;
`;

export default (): ReactElement => {
    const { updateData } = useAuth();
    const history = useHistory();

    const login = async (userData: User) => {
        try {
            const loginResponse = await loginViaSSO(
                { ...userData } as any
            );
            if (!loginResponse.ok) {
                throw new Error(loginResponse.error.msg)
            }
            const response = await getUserDetails();
            if (response.ok) {
                return updateData({ user: response.data });
            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to login"
                });
                history.push({
                    pathname: "/login"
                });
            }
        } catch (e: any) {
            const backendErrors = [
                "Super_Admin_Only_Allowed",
                "NO_IDP_CONFIGURATION",
                "NO_ROLE_FOUND",
                "INVALID_REQUEST",
                "UserNotInvited",
                "Onboarding_Not_Completed"
            ]
            if (backendErrors.find(errCode => e.message.includes(errCode))) {
                Notification.createNotification({
                    type: "Error",
                    subHeading:
                        "You do not have a permission to create the account. Please contact your system administrator."
                });
                history.push({
                    pathname: "/nonInvitedUser"
                });
                return;
            }
            Notification.createNotification({
                type: "Error",
                subHeading: e.message
            });
            history.push({
                pathname: "/login"
            });
        }
    };

    useEffect(() => {
        const postSSO = async (): Promise<void> => {
            const user = await idpClient().handleCallback();

            if (!user) throw Error("something went wrong");
            try {
                const state = user.state as { secretCode: string };
                const invitedData: any =
                    state && state.secretCode
                        ? JSON.parse(atob(state.secretCode))
                        : {};
                const userData = {
                    ...invitedData,
                    token: user.access_token,
                    email: user.profile.email || "",
                    lastName: user.profile.family_name,
                    firstName: user.profile.given_name,
                    id: user.profile.sub,
                    groups: (user.profile as any).groups || []
                };
                login(userData);
            } catch (e: any) {
                Notification.createNotification({
                    type: "Error",
                    subHeading:
                        "Seems like the query param is changed and not compatible now"
                });
            }
        };
        postSSO();
    }, []);

    return (
        <Container>
            <InnerContainer>
                <Bold>Logging you into MuroChat...</Bold>
                <Spinner>
                    <LoaderIcon />
                </Spinner>
            </InnerContainer>
        </Container>
    );
};
