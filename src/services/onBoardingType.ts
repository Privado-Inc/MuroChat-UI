export type BackendIDPConfiguration = {
    clientId: string;
    clientSecret: string;
    domain: string;
    status: number;
    _id: {
        $oid: string;
    };
};

export type UIIDPConfigurationPayload = {
    clientId: string;
    clientSecret: string;
    domain: string;
    status: number;
};

export type UIIDPConfiguration = UIIDPConfigurationPayload & {
    id: string;
};

export type BackendIDPGroupsResponse = {
    _id: {
        $oid: string;
    };
    name: string;
    idpName: string;
}[];

export type UIIDPGroupsResponse = {
    id: string;
    name: string;
    idpName: string;
}[];

export type BackendIDPRoleMappingResponse = {
    _id: {
        $oid: string;
    };
    privadoRole: string;
    idpRoles: string[];
}[];

export type UIIDPRoleMappingResponse = {
    id: string;
    privadoRole: string;
    idpRoles: string[];
}[];

export type UIIDPRoleMappingPayload = {
    privadoRole: string;
    idpRoles: string[];
}[];
