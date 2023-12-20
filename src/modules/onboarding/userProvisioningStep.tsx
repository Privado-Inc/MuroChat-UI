import React, { ReactElement } from "react";
import styled from "styled-components";
import { omit, flatten } from "ramda";
import { ReactComponent as InfoIcon } from "assets/svg/infoIcon.svg";
import { Button, Notification, Loader, TextAreaInputField, Dropdown } from "uiLibrary/components";
import { TextStyles, Colors } from "uiLibrary";
import { Roles as UserRole } from "services/authentication/types";
import { createOrUpdateIDPRoleMapping, getIdpGroups, getIDPRoleMapping } from "services/onboarding";

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    gap: 24px;
`;

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

const LabelColumn = styled.div<{ addMargin: boolean }>`
    flex: 2;
    ${TextStyles.TextT100Semibold};
    color: ${Colors.neutral.p80};
    display: flex;
    justify-content: start;
    gap: 10px;
    align-items: center;
    ${({ addMargin }) => (addMargin ? "margin-bottom: 40px;" : "")}
`;

const InputColumn = styled.div`
    flex: 3;
    & .input-container {
        height: auto;
    }
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

const fetchRoleMapping = async (
    setData: (a: Record<UserRole, string[]>) => void,
    setNextDisabled: (value: boolean) => void
): Promise<void> => {
    const response = await getIDPRoleMapping();
    if (response.ok) {
        setData(
            response.data.reduce(
                (acc, roleMapping) => {
                    acc[roleMapping.privadoRole] = acc[roleMapping.privadoRole].concat(roleMapping.idpRoles || []);
                    return acc;
                },
                {
                    [UserRole.IT_ADMIN]: [],
                    [UserRole.SECURITY_PRIVACY_ADMIN]: [],
                    [UserRole.USER]: []
                }
            )
        );
        setNextDisabled(false);
    } else {
        setData({ ...initialState });
    }
};

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

export default ({
    onSuccess,
    setNextDisabled,
    data
}: {
    onSuccess: (a: Record<UserRole, string[]>) => void;
    setNextDisabled: (value: boolean) => void;
    data: Record<UserRole, string[]> | undefined;
}): ReactElement => {
    const [roleMapping, updateRoleMapping] = React.useState(data);
    const [availableRoles, setAvailableRoles] = React.useState<{ key: string; label: string }[] | undefined>(undefined);

    React.useEffect(() => {
        fetchAvailableRoles(setAvailableRoles);
        if (!data) {
            fetchRoleMapping(updateRoleMapping, setNextDisabled);
        }
    }, []);

    if (!roleMapping || !availableRoles) {
        return <Loader />;
    }

    return (
        <Container>
            <Heading>Map Okta User Groups to MuroChat Roles</Heading>
            <InputContainer>
                <Row>
                    <PrivadoRolesLabel>MuroChat Roles</PrivadoRolesLabel>
                    <OktaGroupsLabel>Okta Groups</OktaGroupsLabel>
                </Row>
                <InputRow
                    key={"IT Administrator"}
                    availableRoles={getRemaining(availableRoles, roleMapping, UserRole.IT_ADMIN)}
                    title="IT Administrator"
                    value={roleMapping[UserRole.IT_ADMIN].join(",")}
                    onChange={(value) =>
                        updateRoleMapping((roleMapping) => {
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
                    availableRoles={getRemaining(availableRoles, roleMapping, UserRole.SECURITY_PRIVACY_ADMIN)}
                    title="Security Administrator"
                    value={roleMapping[UserRole.SECURITY_PRIVACY_ADMIN].join(",")}
                    onChange={(value) =>
                        updateRoleMapping((roleMapping) => {
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
                    availableRoles={getRemaining(availableRoles, roleMapping, UserRole.USER)}
                    title="Chat User"
                    value={roleMapping[UserRole.USER].join(",")}
                    onChange={(value) =>
                        updateRoleMapping((roleMapping) => {
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
                        <Button.Medium
                            onClick={async () => {
                                if (
                                    roleMapping[UserRole.IT_ADMIN].length === 0 ||
                                    roleMapping[UserRole.SECURITY_PRIVACY_ADMIN].length === 0 ||
                                    roleMapping[UserRole.USER].length === 0
                                ) {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "Please select at least one mapping for each MuroChat Role"
                                    });
                                    return;
                                }
                                if (!Object.keys(roleMapping).find((a) => roleMapping[a].length > 0)) {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "Please select at least one mapping"
                                    });
                                    return;
                                }
                                const payload = [
                                    { privadoRole: UserRole.IT_ADMIN, idpRoles: roleMapping[UserRole.IT_ADMIN] },
                                    {
                                        privadoRole: UserRole.SECURITY_PRIVACY_ADMIN,
                                        idpRoles: roleMapping[UserRole.SECURITY_PRIVACY_ADMIN]
                                    },
                                    { privadoRole: UserRole.USER, idpRoles: roleMapping[UserRole.USER] }
                                ];

                                const response = await createOrUpdateIDPRoleMapping(payload);

                                if (response.ok) {
                                    Notification.createNotification({
                                        type: "Success",
                                        subHeading: "Role Mapping Saved Successfully"
                                    });
                                    onSuccess(roleMapping);
                                } else {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "Role Mapping Failed To Save. Please try again."
                                    });
                                }
                            }}
                            label="Save Changes"
                        />
                    </BottonHolder>
                </Row>
            </InputContainer>
        </Container>
    );
};
