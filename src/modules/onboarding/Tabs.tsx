import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import { useSafeAuth } from "app/store";
import { Notification } from "uiLibrary/components";
import { ReactComponent as GreenCompleteCheckMark } from "assets/svg/greenCheckMarkSuccess.svg";
import { Roles as UserRole } from "services/authentication/types";
import { useHistory } from "react-router-dom";
import IDPConfigurationStep from "components/Onboarding/SSOConfiguration";
import UserProvisioningStep from "components/Onboarding/UserProvisioning";
import ModelStep from "components/Onboarding/LLMModel";
import InvitedStep from "./invitedStep";

import StepsData, { StepId } from "./steps";
import { getOnboardingStatus } from "services/onboarding";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 16;
    background-color: ${Colors.neutral.p10};
    overflow: auto;
`;

const HeaderContainer = styled.div`
    display: flex;
    padding: 16px 48px;
    flex-direction: column;
    justify-content: center;
`;

const HeaderMainHeading = styled.div`
    ${TextStyles.HeadlineH100Semibold};
    color: ${Colors.neutral.p90};
`;

const HeaderSubHeading = styled.div`
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p80};
`;

const Content = styled.div`
    display: flex;
    padding: 16px 32px 72px 32px;
    align-items: flex-start;
    gap: 32px;
    flex: 1 0 0;
    align-self: stretch;
`;

const SelectedStepContainer = styled.div`
    border-radius: 10px;
    border: 1.5px ${Colors.neutral.p40};
    background: ${Colors.white};
    flex-grow: 1;
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 600px;
    overflow: auto;
`;

const StepContent = styled.div`
    border-radius: 10px;
    border: 1.5px ${Colors.neutral.p40};
    background: ${Colors.white};
    width: 100%;
    flex: 1;
    padding: 20px 24px;
    gap: 35px;
    display: flex;
    flex-direction: column;
`;

const StepFooter = styled.div`
    display: flex;
    padding: 20px 24px;
    justify-content: space-between;
    border-top: 1.5px solid ${Colors.neutral.p30};
`;

const Steps = styled.div`
    display: flex;
    width: 600px;
    height: 360px;
    flex-direction: column;
    align-items: flex-start;
`;

const Step = styled.div<{ active?: boolean; clickable?: boolean }>`
    display: flex;
    padding: 12px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 10px;
    border: 1.5px solid ${Colors.neutral.p40};
    ${({ clickable }) => (clickable ? "cursor: pointer;" : "")}
    ${({ active }) =>
        active
            ? `
        border: 1.5px solid ${Colors.purple.p40};
        background:  ${Colors.purple.p10};
    `
            : `
        background:  ${Colors.neutral.p5};
        box-shadow: 0px 2px 6px 0px rgba(104, 115, 125, 0.05);
    `}
`;

const StepGreenIcon = styled.span`
    display: flex;
    flex: 0 0 32px;
    height: 32px;
`;

const StepNotCompleted = styled.span`
    display: flex;
    flex: 0 0 32px;
    & span {
        display: flex;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        border: 1.5px solid ${Colors.neutral.p40};
        background: ${Colors.white};
        justify-content: center;
        align-items: center;
    }
`;

const StepTextContainer = styled.span`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const StepTextContainerHeading = styled.span`
    ${TextStyles.HeadlineH400Semibold};
    color: ${Colors.neutral.p90};
`;

const StepTextContainerSubHeading = styled.span`
    ${TextStyles.TextT300Regular};
    color: ${Colors.neutral.p70};
`;

type StepSavedData = {
    step1: {
        completed: boolean;
        data:
            | {
                  clientId: string;
                  clientSecret: string;
                  domain: string;
                  status: number;
              }
            | undefined;
        index: number;
    };
    step2: {
        completed: boolean;
        data: Record<UserRole, string[]> | undefined;
        index: number;
    };
    step3: {
        completed: boolean;
        data:
            | {
                  modelType: { key: string; label: string }[];
                  secretKey: string;
                  modelVersion: { key: string; label: string }[];
              }[]
            | undefined;
        index: number;
    };
    step4: {
        completed: boolean;
        data: undefined;
        index: number;
    };
};

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default () => {
    const history = useHistory();
    const { user } = useSafeAuth();
    const [stepState, updateStepState] = useState<{ [a in StepId]: boolean }>({
        step1: false,
        step2: false,
        step3: false,
        step4: false
    });
    const [selectedStep, setSelectedStep] = useState(StepsData[0].id);

    return (
        <PageContainer>
            <HeaderContainer>
                <HeaderMainHeading>{`${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(
                    user.lastName
                )}!`}</HeaderMainHeading>
                <HeaderSubHeading>Get Started with MuroChat</HeaderSubHeading>
            </HeaderContainer>
            <Content>
                <Steps>
                    <StepContent>
                        {StepsData.map((stepData, index) => {
                            return (
                                <Step
                                    key={stepData.id}
                                    active={stepData.id === selectedStep}
                                    clickable={stepState && stepState[stepData.id]}
                                    onClick={() => {
                                        if (stepData.id !== selectedStep && stepState && stepState[stepData.id]) {
                                            setSelectedStep(stepData.id);
                                        }
                                    }}
                                >
                                    <StepGreenIcon>
                                        {stepState && stepState[stepData.id] ? (
                                            <GreenCompleteCheckMark />
                                        ) : (
                                            <StepNotCompleted>
                                                <span>{index + 1}</span>
                                            </StepNotCompleted>
                                        )}
                                    </StepGreenIcon>
                                    <StepTextContainer>
                                        <StepTextContainerHeading>{stepData.name}</StepTextContainerHeading>
                                        <StepTextContainerSubHeading>
                                            {stepData.description}
                                        </StepTextContainerSubHeading>
                                    </StepTextContainer>
                                </Step>
                            );
                        })}
                    </StepContent>
                </Steps>
                <SelectedStepContainer>
                    <StepContent>
                        {selectedStep && StepsData[0].id === selectedStep && (
                            <IDPConfigurationStep
                                goNext={() => setSelectedStep("step2")}
                                updateCompletionState={(isCompleted) =>
                                    updateStepState({
                                        ...stepState,
                                        step1: isCompleted
                                    })
                                }
                            />
                        )}
                        {selectedStep && StepsData[1].id === selectedStep && (
                            <UserProvisioningStep
                                goNext={() => setSelectedStep("step3")}
                                goPrevious={() => setSelectedStep("step1")}
                                updateCompletionState={(isCompleted) =>
                                    updateStepState({
                                        ...stepState,
                                        step2: isCompleted
                                    })
                                }
                            />
                        )}
                        {selectedStep && StepsData[2].id === selectedStep && (
                            <ModelStep
                                goNext={() => setSelectedStep("step4")}
                                goPrevious={() => setSelectedStep("step2")}
                                updateCompletionState={(isCompleted) =>
                                    updateStepState({
                                        ...stepState,
                                        step3: isCompleted
                                    })
                                }
                            />
                        )}
                        {selectedStep && StepsData[3].id === selectedStep && (
                            <InvitedStep
                                goNext={async () => {
                                    const response = await getOnboardingStatus();
                                    if (response.ok && response.data.ok) {
                                        Notification.createNotification({
                                            type: "Success",
                                            subHeading: "Onboarding is completed. Redirecting you to chat application"
                                        });
                                        setTimeout(() => {
                                            history.push("/chats");
                                        }, 200);
                                        return;
                                    }
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading:
                                            "Onboarding is npt yet completed. Please save all details to use the chat application"
                                    });
                                }}
                                goPrevious={() => setSelectedStep("step3")}
                            />
                        )}
                    </StepContent>
                </SelectedStepContainer>
            </Content>
        </PageContainer>
    );
};
