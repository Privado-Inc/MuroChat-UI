import React, { ReactElement } from "react";
import styled from "styled-components";

import {
    Switch,
    Route,
    Redirect,
    matchPath,
    Link,
    useLocation
} from "react-router-dom";
import colors from "uiLibrary/colors";
import TextStyles from "uiLibrary/textStyles";

const TabContainer = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
margin-bottom: 32px;
width: fit-content;

border-radius: 8px;
border: 1px solid ${colors.neutral.p40};

/* Button Shadow */
box-shadow: 0px 2px 6px 0px rgba(104, 115, 125, 0.05);
background-color: ${colors.neutral.p10};

& div:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

& div:last-child {
    border-right: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}
`;

const ParentContainer = styled.div`
    margin: 24px 240px 32px 240px;
`;

const HorizontalTab = styled.div`
display: flex;
padding: 8px 12px;
justify-content: center;
align-items: center;
gap: 10px;
border-right: 1px solid ${colors.neutral.p40};

&.selected {
    background: ${colors.white};
    font-feature-settings: 'salt' on;
    
    ${TextStyles.HeadlineH500Bold};
    color: ${colors.purple.p50};
}

`;

type Props = {
    tabs: {
        label: string | ReactElement;
        path: string;
        Component: () => ReactElement;
    }[];
};


const BookmarkTabComponent = (props: Props): ReactElement => {
    const location = useLocation();

    return (
        <ParentContainer>
            <TabContainer>
                {props.tabs.map((tab) => {
                    const match = matchPath<{ id: string }>(location.pathname, {
                        path: tab.path
                    });

                    return (
                        <>
                            <HorizontalTab key={tab.path} className={`${!!match ? "selected" : ""}`}>
                                <Link
                                    to={tab.path}
                                    style={{
                                        textDecoration: "none"
                                    }}>
                                    {tab.label}
                                </Link>
                            </HorizontalTab>
                        </>
                    );
                })}
            </TabContainer>
            <Switch>
                {props.tabs.map((tab) => (
                    <Route
                        key={tab.path}
                        path={tab.path}
                        render={() => (
                            <div>
                                <tab.Component />
                            </div>
                        )}
                    />
                ))}

                <Redirect
                    key="test"
                    to={{
                        pathname: props.tabs[0].path
                    }}
                />
            </Switch>
        </ParentContainer>
    );
};


export default BookmarkTabComponent;
