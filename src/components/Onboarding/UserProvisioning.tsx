import React, { ReactElement, useCallback } from "react";
import styled from "styled-components";
import { omit, flatten } from "ramda";
import { Button, Notification, Loader, TextAreaInputField, Dropdown } from "uiLibrary/components";
import { TextStyles, Colors } from "uiLibrary";
import { Roles as UserRole } from "services/authentication/types";
import { createOrUpdateIDPRoleMapping, getIdpGroups, getIDPRoleMapping } from "services/onboarding";
import { Response } from "services/utils/parseResponse";
import useEditSave from "./useEditSave";
import {
    CompletedLabel,
    Container,
    Content,
    InprogressLabel,
    InputColumn,
    InputRowReadModeWithValues,
    LabelColumn
} from "./Common";
import StepFooter from "./StepFooter";

const Heading = styled.div`
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p90};
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    width: 100%;
    margin-bottom: 30px;
`;

const Row = styled.div`
    display: flex;
    width: 70%;
`;

const PrivadoRolesLabel = styled.span`
    flex: 2;
    ${TextStyles.TextT300Regular};
    color: ${Colors.neutral.p80};
`;

const OktaGroupsLabel = styled.span`
    ${TextStyles.TextT300Regular};
    flex: 3;
    color: ${Colors.neutral.p80};
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

const HelperText = styled.div`
    ${TextStyles.TextT300Regular};
    color: ${Colors.neutral.p70};
    padding: 8px 0 0;
`;

const MultilineInput = styled(TextAreaInputField.MultiTagTextInputField)`
    & > div {
        min-height: 45px;
    }

    & .multi-input-wrapper {
        min-width: 100%;
    }
`;

const ReadMode = styled.div``;

const InputRow = ({
    value,
    onChange,
    title,
    availableRoles
}: {
    value: string;
    title: string;
    availableRoles: { key: string; label: string }[] | undefined;
    onChange: (a: string[]) => void;
}) => {
    return (
        <Row>
            <LabelColumn addMargin={!(availableRoles && availableRoles.length)}>{title}</LabelColumn>
            <InputColumn>
                {availableRoles && availableRoles.length ? (
                    <Dropdown
                        onChange={(val) => {
                            if (val.length === 0 && value === "") {
                                return;
                            }
                            onChange(val.map((item) => item.key));
                        }}
                        list={availableRoles}
                        multiSelect={true}
                        value={value
                            .split(",")
                            .filter((a) => !!a.trim())
                            .map((selectedValue) => {
                                const selected = availableRoles.find((role) => role.key === selectedValue);
                                return (
                                    selected || {
                                        key: selectedValue,
                                        label: selectedValue
                                    }
                                );
                            })}
                        placeholder="Select Roles"
                    />
                ) : (
                    <>
                        <MultilineInput
                            splitter=","
                            splitterKeyCode={188} // Comma
                            resize="vertical"
                            value={value}
                            onChange={(e: string) => {
                                onChange(e.split(",").filter((a) => !!a.trim()));
                            }}
                        />
                        <HelperText>Add comma(", ") separated groups.</HelperText>
                    </>
                )}
            </InputColumn>
        </Row>
    );
};

const getRemaining = (
    roles: { key: string; label: string }[],
    roleMapping: Record<UserRole, string[]>,
    exclude: UserRole
) => {
    const filterSelectedRoles = flatten(Object.values(omit([exclude], roleMapping)));

    return roles.filter((role) => !filterSelectedRoles.includes(role.key));
};

const fetchAvailableRoles = async (setData: (a: { key: string; label: string }[]) => void): Promise<void> => {
    const response = await getIdpGroups();
    if (response.ok) {
        setData(
            response.data.map((item) => ({
                key: item.name,
                label: item.name
            }))
        );
    } else {
        setData([]);
    }
};

const initialState: Record<UserRole, string[]> = {
    [UserRole.IT_ADMIN]: [],
    [UserRole.SECURITY_PRIVACY_ADMIN]: [],
    [UserRole.USER]: []
};

const fetchRoleMapping = async (): Promise<Response<Record<UserRole, string[]>>> => {
    const response = await getIDPRoleMapping();
    if (response.ok) {
        return response.map((data) => {
            return data.reduce(
                (acc, roleMapping) => {
                    acc[roleMapping.privadoRole] = acc[roleMapping.privadoRole].concat(roleMapping.idpRoles || []);
                    return acc;
                },
                {
                    [UserRole.IT_ADMIN]: [],
                    [UserRole.SECURITY_PRIVACY_ADMIN]: [],
                    [UserRole.USER]: []
                }
            );
        });
    }
    return response;
};

const createOrUpdate = async (data: Record<UserRole, string[]>) => {
    const payload = [
        { privadoRole: UserRole.IT_ADMIN, idpRoles: data[UserRole.IT_ADMIN] || [] },
        {
            privadoRole: UserRole.SECURITY_PRIVACY_ADMIN,
            idpRoles: data[UserRole.SECURITY_PRIVACY_ADMIN] || []
        },
        { privadoRole: UserRole.USER, idpRoles: data[UserRole.USER] || [] }
    ];

    return createOrUpdateIDPRoleMapping(payload);
};

export default ({
    updateCompletionState = () => { },
    goNext = () => { },
    goPrevious = () => { },
    hideFooter = false
}: {
    hideFooter?: boolean;
    goNext?: () => void;
    goPrevious?: () => void;
    updateCompletionState?: (a: boolean) => void;
}): ReactElement => {
    const store = useEditSave({
        initialState,
        createFetcher: createOrUpdate,
        updateFetcher: createOrUpdate,
        fetcher: fetchRoleMapping
    });
    const [availableRoles, setAvailableRoles] = React.useState<{ key: string; label: string }[] | undefined>(undefined);

    React.useEffect(() => {
        fetchAvailableRoles(setAvailableRoles);
    }, []);

    React.useEffect(() => {
        if (!store.isEditing && store.state.IT_ADMIN.length > 0 && store.state.USER.length > 0) {
            updateCompletionState(true);
        }
    }, [store.state, store.isEditing]);

    if (store.initialAPIRequestState === 0 || !availableRoles || !store.state) {
        return <Loader />;
    }

    return (
        <Container>
            <Content>
                <Heading>Map Okta User Groups to MuroChat Roles</Heading>
                <InputContainer>
                    <Row>
                        <PrivadoRolesLabel>MuroChat Roles</PrivadoRolesLabel>
                        <OktaGroupsLabel>Okta Groups</OktaGroupsLabel>
                    </Row>
                    {store.isEditing ? (
                        <>
                            <InputRow
                                key={"IT Administrator"}
                                availableRoles={getRemaining(availableRoles, store.state, UserRole.IT_ADMIN)}
                                title="IT Administrator"
                                value={store.state[UserRole.IT_ADMIN].join(",")}
                                onChange={(value) =>
                                    store.updateState((roleMapping) => {
                                        if (!roleMapping) return roleMapping;
                                        return {
                                            ...roleMapping,
                                            [UserRole.IT_ADMIN]: value
                                        };
                                    })
                                }
                            />
                            <InputRow
                                key={"Security Administrator"}
                                availableRoles={getRemaining(
                                    availableRoles,
                                    store.state,
                                    UserRole.SECURITY_PRIVACY_ADMIN
                                )}
                                title="Security Administrator"
                                value={store.state[UserRole.SECURITY_PRIVACY_ADMIN].join(",")}
                                onChange={(value) =>
                                    store.updateState((roleMapping) => {
                                        if (!roleMapping) return roleMapping;
                                        return {
                                            ...roleMapping,
                                            [UserRole.SECURITY_PRIVACY_ADMIN]: value
                                        };
                                    })
                                }
                            />
                            <InputRow
                                key={"Chat User"}
                                availableRoles={getRemaining(availableRoles, store.state, UserRole.USER)}
                                title="Chat User"
                                value={store.state[UserRole.USER].join(",")}
                                onChange={(value) =>
                                    store.updateState((roleMapping) => {
                                        if (!roleMapping) return roleMapping;
                                        return {
                                            ...roleMapping,
                                            [UserRole.USER]: value
                                        };
                                    })
                                }
                            />
                            <Row>
                                <BottonHolder>
                                    <Button.Medium onClick={() => store.onCancel()} label="Cancel" />
                                    {store.savingState === 0 && <InprogressLabel>Saving Mapping....</InprogressLabel>}
                                    {store.savingState === 1 && <CompletedLabel>Saved Succesfully....</CompletedLabel>}
                                    {(store.savingState === -1 || store.savingState === undefined) && (
                                        <Button.Medium
                                            primary
                                            onClick={async () => {
                                                if (
                                                    !store.state ||
                                                    store.state[UserRole.IT_ADMIN].length === 0 ||
                                                    store.state[UserRole.USER].length === 0
                                                ) {
                                                    Notification.createNotification({
                                                        type: "Error",
                                                        subHeading:
                                                            "Please select at least one mapping for IT Admin and Chat User Role"
                                                    });
                                                    return;
                                                }
                                                if (
                                                    !Object.keys(store.state).find(
                                                        (a) => store.state && store.state[a].length > 0
                                                    )
                                                ) {
                                                    Notification.createNotification({
                                                        type: "Error",
                                                        subHeading: "Please select at least one mapping"
                                                    });
                                                    return;
                                                }
                                                if (!store.apiState) {
                                                    return store.create(store.state);
                                                }
                                                return store.update(store.state);
                                            }}
                                            label="Save Changes"
                                        />
                                    )}
                                </BottonHolder>
                            </Row>
                        </>
                    ) : (
                        <>
                            <InputRowReadModeWithValues
                                key={"IT Administrator"}
                                title="IT Administrator"
                                value={store.state[UserRole.IT_ADMIN].join(",")}
                            />
                            <InputRowReadModeWithValues
                                key={"Security Administrator"}
                                title="Security Administrator"
                                value={store.state[UserRole.SECURITY_PRIVACY_ADMIN].join(",")}
                            />
                            <InputRowReadModeWithValues
                                key={"Chat User"}
                                title="Chat User"
                                value={store.state[UserRole.USER].join(",")}
                            />
                            <Row>
                                <BottonHolder>
                                    <Button.Medium
                                        onClick={() => store.setIsEditMode(true)}
                                        label="Edit Configuration"
                                    />
                                </BottonHolder>
                            </Row>
                        </>
                    )}
                </InputContainer>
            </Content>
            {!store.isEditing && !hideFooter && (
                <StepFooter
                    nextDisabled={
                        !(
                            store.state &&
                            store.state[UserRole.IT_ADMIN].length > 0 &&
                            store.state[UserRole.USER].length > 0
                        )
                    }
                    onNext={goNext}
                    onPrevious={goPrevious}
                />
            )}
        </Container>
    );
};
