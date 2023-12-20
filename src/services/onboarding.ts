import { get, put, post, streamPutPOST, remove } from "./utils/request";
import { Response, getUISuccessResponse } from "./utils/parseResponse";
import createEndpoint from "./utils/createEndpoint";
import {
    BackendIDPConfiguration,
    BackendIDPGroupsResponse,
    BackendIDPRoleMappingResponse,
    UIIDPConfiguration,
    UIIDPConfigurationPayload,
    UIIDPGroupsResponse,
    UIIDPRoleMappingPayload,
    UIIDPRoleMappingResponse
} from "./onBoardingType";
import idpClient from "modules/authentication/idpClient";

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

const _cacheData = {};

export const getIDPConfiguration = async (): Promise<Response<UIIDPConfiguration>> => {
    const response = await get<BackendIDPConfiguration>(createEndpoint.idpConfiguration(), {});

    if (response.ok) {
        return response.map((configuration) => ({
            ...configuration,
            id: configuration["_id"]["$oid"]
        }));
    }
    return response;
};

export const createIDPConfiguration = async (configuration: UIIDPConfigurationPayload): Promise<Response<void>> => {
    const user = await idpClient().getUser();
    const response = await post<void>(createEndpoint.idpConfiguration(), {
        ...configuration,
        type: "OKTA",
        token: user?.access_token
    });

    return response;
};

export const updateIDPConfiguration = async (
    configuration: UIIDPConfigurationPayload,
    id: string
): Promise<Response<void>> => {
    const response = await put<void>(createEndpoint.idpConfiguration(), configuration, id);

    return response;
};

export const removeIDPConfiguration = async (id: string): Promise<Response<void>> => {
    const response = await remove<void>(createEndpoint.idpConfiguration() + `/${id}`, {});

    return response;
};

export const getIdpGroups = async (): Promise<Response<UIIDPGroupsResponse>> => {
    if (_cacheData["getIdpGroups"]) return _cacheData["getIdpGroups"];

    const response = await get<BackendIDPGroupsResponse>(createEndpoint.idpGroups(), {});

    if (response.ok) {
        _cacheData["getIdpGroups"] = response;
        return response.map((data) =>
            data.map((idpGroups) => ({
                ...idpGroups,
                id: idpGroups["_id"]["$oid"]
            }))
        );
    }
    return response;
};

export const getIDPRoleMapping = async (): Promise<Response<UIIDPRoleMappingResponse>> => {
    if (_cacheData["getIDPRoleMapping"]) return _cacheData["getIDPRoleMapping"];
    const response = await get<BackendIDPRoleMappingResponse>(createEndpoint.idpRoleMapping(), {});

    if (response.ok) {
        _cacheData["getIDPRoleMapping"] = response;
        return response.map((data) =>
            data.map((idpGroups) => ({
                ...idpGroups,
                id: idpGroups["_id"]["$oid"]
            }))
        );
    }
    return response;
};

export const createOrUpdateIDPRoleMapping = async (
    idpRoleMappings: UIIDPRoleMappingPayload
): Promise<Response<void>> => {
    const response = await post<void>(createEndpoint.idpRoleMapping(), idpRoleMappings);
    _cacheData["getIDPRoleMapping"] = null;
    return response;
};

export const getOnboardingStatus = async (): Promise<Response<{ ok: boolean }>> => {
    const response = await post<{ ok: boolean }>(createEndpoint.onboarding(), {});

    return response;
};

export const getLlmModels = async (): Promise<Response<ModelsData>> => {
    const response = await get<any>(createEndpoint.llm_models(), {});

    if (response.ok) {
        return response.map((data) =>
            data.map((llmModel: ModelData) => ({
                ...llmModel,
                id: llmModel["_id"]["$oid"],
                modelType: [{ key: llmModel.type, label: llmModel.type }],
                modelVersion: [{ key: llmModel.modelVersion, label: llmModel.modelVersion }],
                apiURL: llmModel.apiURL
            }))
        );
    }
    return response;
};

export const createModelDetails = async (currentModel: ModelData): Promise<Response<void>> => {
    const response = await post<void>(createEndpoint.llm_models(), {
        modelType: currentModel.modelType[0].key,
        modelVersion: currentModel.modelVersion[0].key,
        secretKey: currentModel.secretKey,
        apiURL: currentModel.apiURL,
        isDefault: currentModel.isDefault,
        type: currentModel.type
    });

    return response;
};

export const updateModelDetails = async (modelId: string, model: ModelData): Promise<Response<void>> => {
    const response = await put<void>(createEndpoint.llm_models() + "/" + modelId, {
        id: model.id,
        modelType: model.modelType[0].key,
        modelVersion: model.modelVersion[0].key,
        secretKey: model.secretKey,
        apiURL: model.apiURL,
        isDefault: model.isDefault,
        type: model.type
    });

    return response;
};

export const deleteModel = async (modelId: string): Promise<Response<void>> => {
    const response = await remove<void>(createEndpoint.llm_models() + "/" + modelId, {});

    return response;
};
