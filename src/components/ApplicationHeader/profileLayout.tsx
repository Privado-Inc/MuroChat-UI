import React, { ReactElement } from "react";
import styled from "styled-components";
import { Colors } from "uiLibrary/index";
import UserInfo from "./userInfo";
import Options from "./options";

const Container = styled.div`
    display: flex;
    width: 240px;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 40px;
    right: 1px;
    cursor: default;
    z-index: 3;

    border-radius: 8px;
    background: ${Colors.white};

    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);
`;

const ProfileLayout = (): ReactElement => {
    return (
        <Container>
            <UserInfo />
            <Options />
        </Container>
    );
};

export default ProfileLayout;
