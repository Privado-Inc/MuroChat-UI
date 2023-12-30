import React, { ReactElement, useEffect, useState } from "react";
import { omit } from "ramda";
import { createModelDetails, deleteModel, getLlmModels, updateModelDetails } from "services/onboarding";
import styled from "styled-components";
import { TextInputField, Loader, Button, Notification, Dropdown } from "uiLibrary/components";
import { Colors } from "uiLibrary/index";
import TextStyles from "uiLibrary/textStyles";
import { Response } from "services/utils/parseResponse";
import { CompletedLabel, Container, Content, InprogressLabel, ModelTypes } from "./Common";
import useEditSave from "./useEditSave";
import StepFooter from "./StepFooter";

const NewModelId = "newModel";

const ListContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    width: 80%;

    border-radius: 6px;
`;

const ModelLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
`;

const ModelNumber = styled.div`
    color: ${Colors.neutral.p80};
    font-feature-settings: "salt" on;

    ${TextStyles.TextT200Regular}
`;

const ModelLabel = styled.div`
    display: flex;
    padding: 2px 6px;
    align-items: center;
    gap: 10px;

    border-radius: 4px;
    background: ${Colors.neutral.p30};

    color: ${Colors.neutral.p90};
    font-feature-settings: "salt" on;

    ${TextStyles.TextT300Regular}
`;

const ModelSeparator = styled.div`
    width: 1px;
    height: 35px;
    background: ${Colors.neutral.p30};
`;

const ModelName = styled.div`
    color: ${Colors.neutral.p80};
    font-feature-settings: "salt" on;

    ${TextStyles.TextT200Regular}
`;

const ModelRight = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const DefaultButtonContainer = styled.div`
    display: flex;
    width: 78px;
    justify-content: center;
    align-items: center;
    gap: 4px;
`;

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

const EditHeading = styled.div`
    align-self: stretch;
    ${TextStyles.HeadlineH300Semibold};
    color: ${Colors.neutral.p90};
`;

const TextInputFieldColumnLayout = styled(TextInputField)`
    display: flex;
    width: 600px;
    align-items: center;
    justify-content: center;

    & > div:first-child {
        flex: 0 0 100px;
    }
    & > div:last-child {
        position: relative;
        flex: 1;
    }
`;

const DropdownInputFieldColumnLayout = styled(Dropdown)`
    display: flex;
    width: 600px;
    align-items: center;
    justify-content: center;

    & > span:first-child {
        flex: 0 0 100px;
    }
    & > div:nth-child(2) {
        position: relative;
        flex: 1;
    }

    & > div:nth-child(3) {
        margin-left: 100px;
        width: 500px;
        top: 31px;
    }
`;

const DefaultModeInput = styled.div`
    & > div {
        width: 60%;
    }
    & > div > span:first-child {
        flex: 0 0 160px;
        margin-bottom: 0;
    }
`;

const AnotherModel = styled.div`
    display: flex;
    align-items: center;
`;

export type ModelData = {
    id?: string;
    modelType: { key: string; label: string }[];
    modelVersion: { key: string; label: string }[];
    apiURL: string;
    secretKey: string;
    type?: string;
    isDefault?: boolean;
};

export type ModelsData = ModelData[];

const availableModels = [
    {
        key: "GPT",
        label: "GPT"
    },
    {
        key: "LLAMA",
        label: "Llama"
    }
];
const initialState: ModelsData = [];
const fetchSavedModels = async (): Promise<Response<ModelsData>> => getLlmModels();
const getDefaultModelLabel = (model: ModelData, index: number) =>
    `Model 0${index + 1} | ${model.modelType[0].label} | ${model.modelVersion[0].label}`;

export default ({
    updateCompletionState = () => {},
    goNext = () => {},
    goPrevious = () => {},
    hideFooter = false
}: {
    hideFooter?: boolean;
    goNext?: () => void;
    goPrevious?: () => void;
    updateCompletionState?: (a: boolean) => void;
}): ReactElement => {
    const store = useEditSave({
        initialState,
        createFetcher: async (model: ModelData[]) => createModelDetails(model[0]),
        updateFetcher: async (model: ModelData[], id?: string) => updateModelDetails(id || "", model[0]),
        fetcher: fetchSavedModels
    });
    const [editModel, setEditModel] = useState<number>();
    const [errors, setErrors] = useState({
        apiKey: "",
        version: "",
        apiURL: ""
    });
    useEffect(() => {
        if (!store.isEditing && store.state && store.state.filter((model) => model.id !== NewModelId).length > 0) {
            updateCompletionState(true);
        }
    }, [store.state, store.isEditing]);

    if (store.initialAPIRequestState !== 1 || !store.state) {
        return <Loader />;
    }

    const modelIndex = store.state.findIndex((model) => model.isDefault);
    const defaultModel = store.state[modelIndex];

    return (
        <Container>
            <Content>
                <Heading>Set-up LLM Models to use them in MuroChat</Heading>
                {defaultModel && (
                    <DefaultModeInput>
                        <DropdownInputFieldColumnLayout
                            onChange={async (val) => {
                                if (val.length) {
                                    const id = val[0].key;
                                    const modelIndex = store.state.findIndex((model) => model.id === id);
                                    const model = store.state[modelIndex];

                                    if (model) {
                                        const response = await store.update(
                                            [
                                                {
                                                    ...model,
                                                    isDefault: true
                                                }
                                            ],
                                            id,
                                            (apiState = [], newData) => {
                                                const newState = [...apiState];
                                                const modelObj = { ...newState[modelIndex] };
                                                modelObj.isDefault = true;
                                                newState[modelIndex] = modelObj;
                                                return apiState.map((m, index) => ({
                                                    ...m,
                                                    isDefault: index === modelIndex
                                                }));
                                            }
                                        );
                                    }
                                } else {
                                    // Just to re render so that it will fill the removed item again
                                    store.updateState((state) => [...state]);
                                }
                            }}
                            multiSelect={false}
                            list={store.state
                                .filter((model) => model.id !== NewModelId)
                                .map((model, index) => ({
                                    key: model.id || "",
                                    label: getDefaultModelLabel(model, index)
                                }))}
                            value={[
                                { key: defaultModel.id || "", label: getDefaultModelLabel(defaultModel, modelIndex) }
                            ]}
                            placeholder="Select Default Model"
                            label="Select Default Model"
                        />
                    </DefaultModeInput>
                )}
                {store.state
                    .filter((model) => model.id !== NewModelId)
                    .map((model, index) => {
                        return (
                            <ListContainer key="">
                                <ModelLeft>
                                    <ModelNumber>Model 0{index + 1}</ModelNumber>
                                    <ModelSeparator />
                                    <ModelLabel>{model.modelType.length ? model.modelType[0].label : "-"}</ModelLabel>
                                    <ModelName>
                                        {model.modelVersion.length ? model.modelVersion[0].label : "-"}
                                    </ModelName>
                                </ModelLeft>

                                <ModelRight>
                                    <Button.Medium
                                        tertiary
                                        label={"Edit"}
                                        onClick={() => {
                                            if (store.isEditing) {
                                                store.onCancel();
                                            }
                                            setEditModel(index);
                                            store.setIsEditMode(true);
                                        }}
                                    />
                                    {store.state.length > 1 && !store.isEditing && (
                                        <Button.Medium
                                            tertiary
                                            label="Remove"
                                            onClick={async () => {
                                                const id = store.state[index].id;
                                                if (id) {
                                                    const response = await deleteModel(id);
                                                    if (!response.ok) {
                                                        Notification.createNotification({
                                                            type: "Error",
                                                            subHeading: response.error.msg
                                                        });
                                                        return;
                                                    }

                                                    if (store.apiState) {
                                                        store.updateAPIState(
                                                            store.apiState.filter((_, i) => i !== index)
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                </ModelRight>
                            </ListContainer>
                        );
                    })}
                {store.isEditing && editModel !== undefined ? (
                    <>
                        <EditHeading>Enter Configurations for Model 0{Number(editModel) + 1}</EditHeading>
                        <DropdownInputFieldColumnLayout
                            onChange={(val) => {
                                if (val.length) {
                                    const newState = [...store.state];
                                    const modelObj = { ...newState[editModel as number] };
                                    modelObj.modelType = val;
                                    modelObj.modelVersion = [{ key: "", label: "" }];
                                    newState[editModel as number] = modelObj;
                                    store.updateState(newState);
                                } else {
                                    // Just to re render so that it will fill the removed item again
                                    store.updateState((state) => [...state]);
                                }
                            }}
                            multiSelect={false}
                            list={availableModels}
                            value={store.state[editModel as number].modelType}
                            placeholder="Model Name"
                            label="Model Name"
                        />

                        {store.state[editModel].modelType[0]?.key === availableModels[1].key && (
                            <TextInputFieldColumnLayout
                                label="API URL"
                                error={errors.apiURL}
                                value={store.state[editModel].apiURL}
                                onChange={(val) => {
                                    const newState = [...store.state];
                                    const modelObj = { ...newState[editModel as number] };
                                    modelObj.apiURL = val;
                                    newState[editModel as number] = modelObj;

                                    store.updateState(newState);
                                    if (!val) {
                                        setErrors({ ...errors, apiURL: "" });
                                        return;
                                    }
                                }}
                                isMandatory
                            />
                        )}

                        <TextInputFieldColumnLayout
                            label="API Key"
                            valueType="password"
                            error={errors.apiKey}
                            value={store.state[editModel as number].secretKey}
                            onChange={(val) => {
                                const newState = [...store.state];
                                const modelObj = { ...newState[editModel as number] };
                                modelObj.secretKey = val;
                                newState[editModel as number] = modelObj;

                                store.updateState(newState);
                                if (!val) {
                                    setErrors({ ...errors, apiKey: "" });
                                    return;
                                }
                            }}
                            isMandatory
                        />
                        {store.state[editModel].modelType[0]?.key === availableModels[0].key && (
                            <DropdownInputFieldColumnLayout
                                onChange={(val) => {
                                    if (val.length) {
                                        const newState = [...store.state];
                                        const modelObj = { ...newState[editModel as number] };
                                        modelObj.modelVersion = val;
                                        newState[editModel as number] = modelObj;
                                        store.updateState(newState);
                                    } else {
                                        // Just to re render so that it will fill the removed item again
                                        store.updateState((state) => [...state]);
                                    }
                                }}
                                multiSelect={false}
                                list={
                                    ModelTypes[store.state[editModel as number].modelType[0].key.toLocaleLowerCase()] ||
                                    []
                                }
                                value={store.state[editModel as number].modelVersion}
                                placeholder="Select model version"
                                label="Model Version"
                            />
                        )}
                        <BottonHolder>
                            <Button.Medium tertiary label={"Cancel"} onClick={() => store.onCancel()}></Button.Medium>
                            {store.savingState === 0 && <InprogressLabel>Saving Model....</InprogressLabel>}
                            {store.savingState === 1 && <CompletedLabel>Saved Succesfully....</CompletedLabel>}
                            {(store.savingState === -1 || store.savingState === undefined) && (
                                <Button.Medium
                                    primary
                                    onClick={async () => {
                                        if (!store.state[editModel as number].modelType.length) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading: "Model name field is mandatory."
                                            });
                                            return;
                                        }

                                        if (!store.state[editModel as number].secretKey.length) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading: "API Key field is mandatory."
                                            });
                                            return;
                                        }
                                        if (
                                            store.state[editModel as number].modelType[0].key ===
                                                availableModels[0].key &&
                                            !store.state[editModel as number].modelVersion.length
                                        ) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading: "Model version field is mandatory."
                                            });
                                            return;
                                        }

                                        if (
                                            store.state[editModel as number].modelType[0].key ===
                                                availableModels[1].key &&
                                            !store.state[editModel as number].apiURL.startsWith("http")
                                        ) {
                                            Notification.createNotification({
                                                type: "Error",
                                                subHeading: "API URL must start with http and is mandatory"
                                            });
                                            return;
                                        }
                                        if (
                                            store.apiState &&
                                            store.state.length === store.apiState?.length &&
                                            store.state[store.state.length - 1].id !== NewModelId
                                        ) {
                                            const response = await store.update(
                                                [store.state[editModel as number]],
                                                store.state[editModel as number].id,
                                                (apiState = [], newData) => {
                                                    const newState = [...apiState];
                                                    const modelObj = { ...newState[editModel as number] };
                                                    newState[editModel as number] = newData[0];
                                                    return newState;
                                                }
                                            );
                                            if (response) setEditModel(undefined);
                                        } else {
                                            const response = await store.create(
                                                [omit(["id"], store.state[editModel as number])],
                                                (apiState = [], newData, responseData) => {
                                                    return [
                                                        ...apiState,
                                                        {
                                                            ...newData[0],
                                                            id: responseData.id,
                                                            isDefault: !store.apiState?.length
                                                        }
                                                    ];
                                                }
                                            );
                                            if (response.ok) {
                                                setEditModel(undefined);
                                            }
                                        }
                                    }}
                                    label="Save Model"
                                />
                            )}
                        </BottonHolder>
                    </>
                ) : (
                    <AnotherModel>
                        <Button.Medium
                            primary
                            label={store.state.length ? "Add Another Model" : "Add Model"}
                            onClick={() => {
                                const newModel = {
                                    id: NewModelId,
                                    modelType: [availableModels[0]],
                                    secretKey: "",
                                    apiURL: "",
                                    modelVersion: []
                                };
                                setEditModel(store.state.length);
                                store.setIsEditMode(true);
                                store.updateState((existingModels: ModelsData) => {
                                    return [...existingModels, newModel];
                                });
                            }}
                        ></Button.Medium>
                    </AnotherModel>
                )}
            </Content>
            {!store.isEditing && !hideFooter && (
                <StepFooter
                    nextDisabled={!(store.state && store.state.length > 0 && store.state[0].id !== NewModelId)}
                    onNext={goNext}
                    onPrevious={goPrevious}
                />
            )}
        </Container>
    );
};
