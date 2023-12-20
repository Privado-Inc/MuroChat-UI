import React from "react";
import styled from "styled-components";
import { Colors, TextStyles } from "uiLibrary/index";
import { ReactComponent as ZapIcon } from "assets/svg/zap.svg";
import SettingItems from "./settingItems";
import { useHistory } from "react-router-dom";

const ContainerLeft = styled.div`
    display: flex;
    width: 284px;
    padding: 12px;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
    align-self: stretch;
    background: ${Colors.neutral.p100};
`;

const SettingsListBottom = styled.div`
    display: flex;
    padding: 16px 14px 16px 12px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    cursor: pointer;

    border-radius: 8px;
    background: ${Colors.neutral.p90};
`;

const LaunchChatLabel = styled.div`
    font-feature-settings: 'salt' on;
    
    ${TextStyles.HeadlineH500Semibold}
    color: ${Colors.white};
`;

const SettingsList = styled.div`
    display: flex;
    width: 264px;
    padding: 12px;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
    align-self: stretch;
    
    background: ${Colors.neutral.p100};
`;

const SettingsListTop = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
`;

const SettingsListItem = styled.div<{ active: boolean }>`
    display: flex;
    padding: 6px 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 6px;
    cursor: pointer;

    color: ${Colors.white};
    font-feature-settings: 'salt' on;
    
    background: ${({ active }) => (active ? Colors.neutral.p90 : "")};

    ${TextStyles.LightTextT300Semibold};
`;

const IconContainer = styled.div`
    display: flex;
    padding: 2px 0px;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
`;

export default ({
    selectedStep,
    setSelectedStep
}: {
    selectedStep: string,
    setSelectedStep: (id: string) => void,
}) => {
    const history = useHistory();

    return (
        <ContainerLeft>
            <SettingsList>
                <SettingsListTop>
                    {
                        SettingItems.map((settingItem) => {
                            return <SettingsListItem
                                key={settingItem.id}
                                active={settingItem.id === selectedStep}
                                onClick={() => {
                                    setSelectedStep(settingItem.id)
                                }}
                            >
                                <IconContainer>
                                    {settingItem.icon}
                                    {settingItem.name}
                                </IconContainer>
                            </SettingsListItem>
                        })
                    }
                </SettingsListTop>
            </SettingsList>

            <SettingsListBottom onClick={() => {
                history.push({
                    pathname: "/chats/all"
                })
            }}>
                <ZapIcon />
                <LaunchChatLabel>
                    Launch MuroChat
                </LaunchChatLabel>
            </SettingsListBottom>
        </ContainerLeft>
    )
}