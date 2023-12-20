import React, { ReactElement } from "react";
import { createIDPConfiguration, getIDPConfiguration } from "services/onboarding";
import styled from "styled-components";
import { Response } from "services/utils/parseResponse";
import { TextInputField, Loader, Button, Notification } from "uiLibrary/components";
import { Colors } from "uiLibrary/index";
import TextStyles from "uiLibrary/textStyles";
import useEditSave from "./useEditSave";
import { CompletedLabel, Container, Content, InprogressLabel, InputRowReadMode, Row } from "./Common";
import StepFooter from "./StepFooter";

const BottonHolder = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 16px;
    width: 60%;
    & button {
        padding: 6px 20px;
    }
`;

const Heading = styled.div`
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p90};
`;

const TextInputFieldColumnLayout = styled(TextInputField)`
    display: flex;
    width: 600px;
    align-items: center;
    justify-content: center;

    & div:first-child {
        flex: 0 0 100px;
    }
    & div:last-child {
        position: relative;
        flex: 1;
    }
`;

type IdpData = {
    clientId: string;
    clientSecret: string;
    domain: string;
    status: number;
    id?: string;
};

const initialState = {
    clientId: "",
    clientSecret: "",
    domain: "",
    status: 0
};

const fetchConfigurationSaved = async (): Promise<Response<IdpData>> => getIDPConfiguration();
const createOrUpdate = async (data: IdpData) => createIDPConfiguration(data);

export default ({
    updateCompletionState = () => { },
    goNext = () => { },
    hideFooter = false
}: {
    hideFooter?: boolean;
    goNext?: () => void;
    updateCompletionState?: (a: boolean) => void;
}): ReactElement => {
    const store = useEditSave({
        initialState,
        createFetcher: createOrUpdate,
        updateFetcher: createOrUpdate,
        fetcher: fetchConfigurationSaved
    });

    React.useEffect(() => {
        if (!store.isEditing && store.state && store.state.clientId && store.state.domain && store.state.status) {
            updateCompletionState(true);
        }
    }, [store.state, store.isEditing]);

    if (store.initialAPIRequestState !== 1 || !store.state) {
        return <Loader />;
    }

    return (
        <Container>
            <Content>
                <Heading>Set-up Okta to get Okta Groups for MuroChat</Heading>
                {store.isEditing ? (
                    <>
                        <TextInputFieldColumnLayout
                            valueType="text"
                            label="Client ID"
                            value={store.state.clientId || ""}
                            isMandatory
                            placeholder="asDF3dfdsfS334"
                            onChange={(val) => {
                                if (store.state) {
                                    store.updateState({
                                        ...store.state,
                                        clientId: val
                                    });
                                }
                            }}
                        />
                        <TextInputFieldColumnLayout
                            label="Issuer"
                            valueType="text"
                            value={store.state.domain || ""}
                            onChange={(val) => {
                                if (store.state) {
                                    store.updateState({
                                        ...store.state,
                                        domain: val
                                    });
                                }
                            }}
                            isMandatory
                            placeholder="https://dev-55661589.okta.com"
                        />
                        <TextInputFieldColumnLayout
                            label="Redirect URI"
                            valueType="text"
                            value={`${location.origin}/idp/okta`}
                            onChange={(val) => { }}
                            disabled
                        />
                        <BottonHolder>
                            <Button.Medium onClick={() => store.onCancel()} label="Cancel" />

                            {store.savingState === 0 && <InprogressLabel>Validating Mappings....</InprogressLabel>}
                            {store.savingState === 1 && <CompletedLabel>Saved Succesfully....</CompletedLabel>}
                            {(store.savingState === -1 || store.savingState === undefined) && (
                                <Button.Medium
                                    onClick={async () => {
                                        if (!store.state || !store.state.clientId) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading: "Client ID field is mandatory."
                                            });
                                            return;
                                        }
                                        if (
                                            !store.state ||
                                            !store.state.domain.startsWith("http") ||
                                            store.state.domain.endsWith("/")
                                        ) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading:
                                                    "Issuer field is mandatory. It should start with http and does not end with '/'"
                                            });
                                            return;
                                        }
                                        const response = await store.create(store.state); // create or update endpoint is same for this
                                        if (response.ok) {
                                            store.updateAPIState((st) => {
                                                if (st) {
                                                    return {
                                                        ...st,
                                                        status: 1
                                                    };
                                                }
                                                return st;
                                            });
                                        }
                                    }}
                                    label="Test Connection"
                                />
                            )}
                        </BottonHolder>
                    </>
                ) : (
                    <>
                        <InputRowReadMode key={"Client Id"} title="Client Id" value={store.state.clientId} />
                        <InputRowReadMode key={"Issuer"} title="Issuer" value={store.state.domain} />
                        <InputRowReadMode
                            key={"Redirect URI"}
                            title="Redirect URI"
                            value={`${location.origin}/idp/okta`}
                        />
                        <Row>
                            <BottonHolder>
                                <Button.Medium
                                    onClick={() => store.setIsEditMode(true)}
                                    label={store.state.status ? "Edit Configuration" : "Test Connection"}
                                />
                            </BottonHolder>
                        </Row>
                    </>
                )}
            </Content>

            {!store.isEditing && !hideFooter && (
                <StepFooter hidePrevious nextDisabled={!store.state.status} onNext={goNext} />
            )}
        </Container>
    );
};
