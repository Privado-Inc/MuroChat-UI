import React, { ReactElement } from "react";
import styled from "styled-components";
import ApplicationHeader from "../ApplicationHeader";

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Application = ({ children }: { children: ReactElement }): ReactElement => {
    return (
        <AppContainer>
            <ApplicationHeader />
            {children}
        </AppContainer>
    );
};

export default Application;
