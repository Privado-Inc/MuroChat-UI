import React, { ReactElement } from "react";
import styled from "styled-components";
import MyLocalStorage from "services/utils/storage/LocalStorage";
import { ReactComponent as GearIcon } from "assets/svg/gear.svg";
import { ReactComponent as LogoutIcon } from "assets/svg/logout.svg";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import { useSafeAuth } from "app/store";
import { useHistory } from "react-router-dom";

const Container = styled.div`
    display: flex;
    width: 240px;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

const Option = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;

    text-align: center;
    font-feature-settings: "salt" on;

    ${TextStyles.TextT100SemiDark}
    color: ${Colors.neutral.p70};
`;

const Options = (): ReactElement => {
    const { user } = useSafeAuth();
    const history = useHistory();

    return (
        <Container>
            {user.isOnboardingCompleted && user.permissions.settings && (
                <Option
                    key={"settings"}
                    onClick={(e) => {
                        // setShowPanel(false);
                        e.preventDefault();
                        e.stopPropagation();
                        history.push({
                            pathname: "/settings"
                        });
                    }}
                >
                    <GearIcon /> Settings
                </Option>
            )}
            <Option
                key={"logout"}
                onClick={() => {
                    MyLocalStorage.clearAllData();
                    location.reload();
                }}
            >
                <LogoutIcon /> Log Out
            </Option>
        </Container>
    );
};

export default Options;
