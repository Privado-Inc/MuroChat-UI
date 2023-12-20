import { Roles } from "services/authentication/types";

export const getRoleNames = (role: string): string => {
    switch (role) {
        case Roles.IT_ADMIN:
            return "IT Admin";
        case Roles.SECURITY_PRIVACY_ADMIN:
            return "Security And Privacy Admin";
        case Roles.USER:
            return "User";
        default:
            return "";
    }
};

export const rolesList = [
    {
        key: Roles.IT_ADMIN,
        label: "IT Admin",
        description: "Ideal for system admin who is going to manage this application"
    },
    {
        key: Roles.SECURITY_PRIVACY_ADMIN,
        label: "Security And Privacy Admin",
        description: "Ideal for Managers and Directors."
    },
    {
        key: Roles.USER,
        label: "User",
        description: "Ideal for Employees who is indivual contributor and not managing any teams."
    }
];

export const getAvailableRoles = ({
    role
}: {
    role: string;
}): {
    key: Roles;
    label: string;
    description: string;
}[] => {
    switch (role) {
        case Roles.IT_ADMIN:
            return rolesList;
        case Roles.SECURITY_PRIVACY_ADMIN:
            return rolesList.slice(1, rolesList.length);
        case Roles.USER:
            return rolesList.slice(2, rolesList.length);
        default:
            return [];
    }
};

export const getRoleByLabel = (label: string): string => {
    return rolesList.find((i) => i.label === label)?.key || "";
};
export const getLabelByRole = (role: string): string => {
    return rolesList.find((i) => i.key === role)?.label || "";
};
