import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import {
    Button
} from "uiLibrary/components";
import TextStyles from "uiLibrary/textStyles";
import idpClient from "../idpClient";
import { ReactComponent as TransparentLock } from "assets/svg/transparentlock.svg";
import {
    AuthenticationContainer,
    InputContainerContentDiv
} from "./Container";
import Header from "./Header";


const OktaSignInButton = styled(Button.Medium)`
    ${TextStyles.HeadlineH500Semibold}
    width: 264px;
    height: 48px;
    border-radius: 40px;
    margin-bottom: 56px;

    & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        flex-direction: row-reverse;
    }
    & > div > div {
        margin-left: 6px !important;
    }
`;

const Login = (): ReactElement => {

    return (
        <AuthenticationContainer>
            <InputContainerContentDiv>
                <Header heading="Log in to your account" />
                <OktaSignInButton
                    addIcon={<TransparentLock />}
                    onClick={async () => {
                        await idpClient().login();
                    }}
                    tertiary
                    label="Continue with OKTA"
                />
            </InputContainerContentDiv>
        </AuthenticationContainer>
    );
};

export default Login;
