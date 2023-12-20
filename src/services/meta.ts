import { get } from "./utils/request";
import { Response } from "./utils/parseResponse";
import createEndpoint from "./utils/createEndpoint";

export const getMetaForApp = async (): Promise<Response<{ clientId: string; domain: string }>> => {
    const response = await get<{ clientId: string; domain: string }>(createEndpoint.meta(), {});

    return response;
};
