import { get, post } from "./utils/request";
import { Response } from "./utils/parseResponse";
import createEndpoint from "./utils/createEndpoint";

export enum MessageType {
    GPT = "GPT",
    USER_INPUT = "USER_INPUT"
}

export type User = {
    name: string;
    organizationName: string;
    departmentName: string;
    reportsTo: string;
    email: string;
    firstName: string;
    lastName: string;
    id: string;
};

const RoleMapping = {
    IT_ADMIN: "IT_ADMIN",
    SECURITY_PRIVACY_ADMIN: "SECURITY_PRIVACY_ADMIN",
    USER: "USER"
};

export const getUsersList = async (): Promise<Response<User[]>> => {
    const response = await get<any>(createEndpoint.users(), {});

    if (response.ok) {
        return response.map((data) => {
            return data.map((item: any) => ({
                email: item.user.email,
                firstName: item.user.firstName,
                lastName: item.user.lastName,
                id: item.user.id,
                isActive: item.user.is_active,
                departmentName: item.details.departmentName,
                reportsTo: item.details.reportsTo,
                organizationName: item.details.organizationName,
                role: RoleMapping[item.role] || "Invalid Role"
            }));
        });
    }

    return response;
};

export const changeUserStatus = async (
    users: { role: string; userId: string; enable: boolean }[]
): Promise<Response<User[]>> => {
    const response = await post<any>(createEndpoint.inviteUsers(), { users }, undefined, {});
    return response;
};

export const syncUsersFromOkta = async (): Promise<Response<User[]>> => {
    const response = await get<any>(createEndpoint.syncUsers(), {});
    return response;
};
