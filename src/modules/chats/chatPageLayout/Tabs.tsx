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
import textStyles from "uiLibrary/textStyles";

const ParentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`;

const TabContainer = styled.div`
    ${textStyles.TextT100Semibold};
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${colors.neutral.p100};
    padding: 12px;
    border-right: 1px solid ${colors.neutral.p70};

`;

const Tab = styled.div<{ match: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    width: 36px;
    height: 36px;
    position: relative;
    background: ${({ match }) => (match ? colors.neutral.p90 : colors.neutral.p100)};
    box-sizing: border-box;
    border-radius: 6px;
    a {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &:hover {
        border: 1px solid ${colors.neutral.p70};
        cursor: pointer;
    }
`;

type Props = {
    tabs: {
        label: string | ReactElement;
        path: string;
        nonClickable?: boolean;
        Component: () => ReactElement;
    }[];
};

const TabContentStyled = styled.div`
    width: 100%;
    overflow: auto;
    position: relative;
    height: 100%;
`;

const TabComponent = (props: Props): ReactElement => {
    const location = useLocation();
    return (
        <ParentContainer>
            <TabContainer>
                {props.tabs.map((tab) => {
                    if (tab.nonClickable) return null;

                    const match = matchPath<{ id: string }>(location.pathname, {
                        exact: false,
                        path: tab.path
                    });

                    return (
                        <Tab key={tab.path} match={!!match}>
                            <Link
                                to={tab.path}
                                style={{
                                    textDecoration: "none"
                                }}>
                                {tab.label}
                            </Link>
                        </Tab>
                    );
                })}
            </TabContainer>
            <Switch>
                {props.tabs.map((tab) => (
                    <Route
                        key={tab.path}
                        path={tab.path}
                        render={() => (
                            <TabContentStyled>
                                <tab.Component />
                            </TabContentStyled>
                        )}
                    />
                ))}

                <Redirect
                    key="default"
                    to={{
                        pathname: props.tabs[0].path
                    }}
                />
            </Switch>
        </ParentContainer>
    );
};


export default TabComponent;
