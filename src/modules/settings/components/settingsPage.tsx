import React from "react";
import styled from "styled-components";
import SettingItems from "./settingItems";
import UserProvisioningStep from "components/Onboarding/UserProvisioning";
import SSOConfiguration from "components/Onboarding/SSOConfiguration";
import ModelStep from "components/Onboarding/LLMModel";
import { Colors, TextStyles } from "uiLibrary/index";
import Overview from "components/Onboarding/Overview";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
    align-self: stretch;
`;
const Heading = styled.div`
    display: flex;
    padding: 24px 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-bottom: 1.5px solid ${Colors.neutral.p30};
`;

const HeadingLabel = styled.div`
    flex: 1 0 0;
    align-self: stretch;
    color:  ${Colors.neutral.p100};
    font-feature-settings: 'salt' on;

    ${TextStyles.HeadlineH100Bold};
`;

const Content = styled.div`
    display: flex;
    padding: 20px 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    overflow-y: auto;
`;

export default ({
    selectedStep
}: {
    selectedStep: string,
}) => {

    return (() => {
        switch (selectedStep) {
            case SettingItems[0].id:
                return (
                    <Container>
                        <Heading>
                            <HeadingLabel>
                                {SettingItems[0].name}
                            </HeadingLabel>
                        </Heading>
                        <Content>
                            <Overview />
                        </Content>
                    </Container>
                );
            case SettingItems[1].id:
                return (
                    <Container>
                        <Heading>
                            <HeadingLabel>
                                {SettingItems[1].name}
                            </HeadingLabel>
                        </Heading>
                        <Content>
                            <SSOConfiguration
                                hideFooter
                            />
                        </Content>
                    </Container>
                );
            case SettingItems[2].id:
                return (
                    <Container>
                        <Heading>
                            <HeadingLabel>
                                {SettingItems[2].name}
                            </HeadingLabel>
                        </Heading>
                        <Content>
                            <UserProvisioningStep
                                hideFooter
                            />
                        </Content>
                    </Container>
                );
            case SettingItems[3].id:
                return (
                    <Container>
                        <Heading>
                            <HeadingLabel>
                                {SettingItems[3].name}
                            </HeadingLabel>
                        </Heading>
                        <Content>
                            <ModelStep
                                hideFooter
                            />
                        </Content>
                    </Container>
                );

            default:
                return null;
        }
    })()
}