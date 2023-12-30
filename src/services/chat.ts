import { get, put, post, streamPutPOST, remove } from "./utils/request";
import { Response, getUISuccessResponse } from "./utils/parseResponse";
import createEndpoint from "./utils/createEndpoint";
import {
    ChatMessageResponse,
    ChatResponse,
    ChatsByGroups,
    MessageType,
    BookmarkMessageResponse,
    SharedChat
} from "./chatBackendUIType";

const parseStream = async (
    response: any,
    streamCallback: (a: {
        message: string;
        chatId?: string;
        finished?: boolean;
        uMessageId: string;
        piiToEntityTypeMap: { [a: string]: string };
        sMessageId: string;
    }) => void,
    chatId?: string
) => {
    let newChatId = "";
    let newUserMessageId = "";
    let piiToEntityTypeMapStr = {};
    let newSystemMessageId = "";
    let buffer = "";

    if (response && response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    streamCallback({
                        finished: true,
                        message: "",
                        chatId: chatId || newChatId,
                        uMessageId: newUserMessageId,
                        piiToEntityTypeMap: piiToEntityTypeMapStr,
                        sMessageId: newSystemMessageId
                    });
                    return true;
                }

                let streamText = decoder.decode(value);
                buffer += streamText;
                // yield chatId + "," + userMessageId + "," + systemMessageId + "|-<><>-|" + json.dumps(piiToEntityTypeMap) + "|-<><>-|"
                // This is how first chunk comes from backend
                if (buffer.includes("|-<><>-|")) {
                    const data = buffer.split("|-<><>-|");
                    [newChatId, newUserMessageId, newSystemMessageId] = data[0].trim().split(","); // This is chat ID
                    try {
                        piiToEntityTypeMapStr = JSON.parse(data[1]);
                    } catch (e) {
                        //
                    }
                    streamText = data[2];
                    buffer = streamText;
                } else {
                    buffer += streamText;
                }

                streamCallback({
                    finished: false,
                    message: streamText,
                    chatId: chatId || newChatId,
                    uMessageId: newUserMessageId,
                    piiToEntityTypeMap: piiToEntityTypeMapStr,
                    sMessageId: newSystemMessageId
                });
            }
        } else {
            return undefined;
        }
    }
};

export const createMessageMeta = async ({ message, chatId }: { message: string; chatId: string }): Promise<any> => {
    const response = await post<any>(createEndpoint.chats(), { message }, chatId, {});
    return response;
};

export const sendMessage = async ({
    message,
    chatId,
    streamCallback
}: {
    streamCallback: (a: {
        message: string;
        chatId?: string;
        finished?: boolean;
        uMessageId: string;
        piiToEntityTypeMap: { [a: string]: string };
        sMessageId: string;
    }) => void;
    message: string;
    chatId?: string;
}): Promise<true | undefined> => {
    const response = await streamPutPOST<{ message: string; chat?: ChatResponse }>(
        createEndpoint.chats(),
        { message },
        chatId,
        {}
    );
    return parseStream(response, streamCallback, chatId);
};

export const editMessage = async ({
    message,
    messageId,
    chatId,
    streamCallback
}: {
    streamCallback: (a: {
        message: string;
        chatId?: string;
        finished?: boolean;
        piiToEntityTypeMap: { [a: string]: string };
        uMessageId: string;
        sMessageId: string;
    }) => void;
    messageId: string;
    message: string;
    chatId: string;
}): Promise<true | undefined> => {
    const response = await streamPutPOST<any>(
        createEndpoint.message(chatId),
        {
            message
        },
        messageId
    );
    return parseStream(response, streamCallback, chatId);
};

export const getBookmarkMessages = async (showWhat = ""): Promise<Response<BookmarkMessageResponse[]>> => {
    const params = { page: 1, pageSize: 100 };
    if (showWhat == "bookmarks") {
        params["bookmarkType"] = "ALL";
    }
    if (showWhat == "prompts") {
        params["bookmarkType"] = MessageType.USER_INPUT;
    } else if (showWhat == "responses") {
        params["bookmarkType"] = MessageType.GPT;
    }

    const response = await get<BookmarkMessageResponse[]>(
        createEndpoint.getBookmarkChats(),
        { params },
        {
            queryParams: {}
        }
    );

    if (response.ok) {
        return response.map((data) => {
            return data.map((item: BookmarkMessageResponse) => item);
        });
    }

    if (response.error.code === 404) {
        return getUISuccessResponse<BookmarkMessageResponse[]>({ data: [] });
    }

    return response;
};

export const getChats = async (groups: boolean, showWhat = ""): Promise<Response<ChatResponse[]>> => {
    const params = { page: 1, pageSize: 100 };
    if (showWhat == "bookmarks") {
        params["bookmarkType"] = "ALL";
    }
    if (showWhat == "prompts") {
        params["bookmarkType"] = MessageType.USER_INPUT;
    } else if (showWhat == "responses") {
        params["bookmarkType"] = MessageType.GPT;
    }

    const response = await get<ChatResponse[]>(
        createEndpoint.chats(),
        { params },
        {
            queryParams: groups
                ? {
                      groups: "True"
                  }
                : {}
        }
    );

    if (response.ok) {
        return response.map((data) => {
            return data.map((item: ChatResponse) => ({
                ...item,
                id: item["_id"]["$oid"]
            }));
        });
    }

    if (response.error.code === 404) {
        return getUISuccessResponse<ChatResponse[]>({ data: [] });
    }

    return response;
};

export const reGenerateMessage = async ({
    messageId,
    chatId,
    streamCallback
}: {
    streamCallback: (a: {
        message: string;
        chatId?: string;
        finished?: boolean;
        piiToEntityTypeMap: { [a: string]: string };
        uMessageId: string;
        sMessageId: string;
    }) => void;
    messageId: string;
    chatId: string;
}): Promise<true | undefined> => {
    const response = await streamPutPOST<any>(createEndpoint.message(chatId) + "/" + messageId, {});
    return parseStream(response, streamCallback, chatId);
};

export const updateMessage = async ({
    messageId,
    message,
    chatId,
    streamCallback
}: {
    streamCallback: (a: {
        message: string;
        chatId?: string;
        finished?: boolean;
        uMessageId: string;
        piiToEntityTypeMap: { [a: string]: string };
        sMessageId: string;
    }) => void;
    messageId: string;
    message: string;
    chatId: string;
}): Promise<true | undefined> => {
    const response = await streamPutPOST<any>(createEndpoint.message(chatId), { message }, messageId);
    return parseStream(response, streamCallback, chatId);
};

export const getChatsByGroup = async (groups: boolean): Promise<Response<ChatsByGroups>> => {
    const response = await get<ChatsByGroups>(
        createEndpoint.chats(),
        {},
        {
            queryParams: groups
                ? {
                      groups: "True"
                  }
                : {}
        }
    );

    if (response.ok) {
        return response.map((data) => {
            return {
                pinnedChats: data.pinnedChats.map((item: ChatResponse) => ({
                    ...item,
                    id: item["_id"]["$oid"]
                })),
                chatsByDate: data.chatsByDate.map((group) => ({
                    ...group,
                    chats: group.chats.map((item: ChatResponse) => ({
                        ...item,
                        id: item["_id"]["$oid"]
                    }))
                }))
            };
        });
    }

    if (response.error.code === 404) {
        return getUISuccessResponse<ChatsByGroups>({ data: { pinnedChats: [], chatsByDate: [] } });
    }

    return response;
};

export const getChatMessages = async (chatId: string): Promise<Response<ChatMessageResponse>> => {
    const response = await get<any>(createEndpoint.chats() + "/" + chatId, {});

    return response;
};

export const deleteChat = async (chatId: string): Promise<Response<{ message: string }>> => {
    const response = await remove<any>(createEndpoint.chats() + "/" + chatId, {});

    return response;
};

export const bookmarkMessage = async (chatId: string, messageId: string): Promise<Response<{ message: string }>> => {
    const response = await post<any>(createEndpoint.bookmarkMessage(chatId, messageId), {});

    return response;
};

export const removeBookmark = async (chatId: string, messageId: string): Promise<Response<{ message: string }>> => {
    const response = await remove<any>(createEndpoint.bookmarkMessage(chatId, messageId), {});
    return response;
};

export const pinChat = async (chatId: string): Promise<Response<{ message: string }>> => {
    const response = await put<any>(createEndpoint.pinChat(chatId), {});

    return response;
};

export const editChatName = async (chatId: string, name: string): Promise<Response<{ message: string }>> => {
    const response = await put<any>(createEndpoint.chats(), {
        chatId,
        name
    });

    return response;
};

export const shareChat = async (
    chatId: string,
    name: string,
    sharedWith: string[]
): Promise<Response<{ message: string }>> => {
    const response = await post<any>(createEndpoint.chats() + "/" + chatId + "/share", {
        sharedWith,
        name
    });

    return response;
};

export const deleteSharedChat = async (
    chatId: string,
    userIds: string[] | null,
    selfRemove: boolean,
    sharedBy: string
): Promise<Response<{ message: string }>> => {
    const response = await remove<any>(createEndpoint.chats() + "/" + chatId + "/share", {
        chatId,
        userIds,
        selfRemove,
        sharedBy
    });

    return response;
};

export const unPinChat = async (chatId: string): Promise<Response<{ message: string }>> => {
    const response = await remove<any>(createEndpoint.pinChat(chatId), {});
    return response;
};

export const importChat = async (
    userChatSharingId: string,
    chatId: string
): Promise<Response<{ message: string; chatId: string }>> => {
    const response = await post<{ message: string; chatId: string }>(
        createEndpoint.importChat(userChatSharingId, chatId),
        {}
    );
    return response;
};

export const getSharedChats = async (): Promise<Response<SharedChat>> => {
    const response = await get<SharedChat>(createEndpoint.sharedChat(), {});
    if (response.ok) {
        return response.map((data) => {
            return {
                chatIdsSharedByUser: data.chatIdsSharedByUser.map((item) => ({
                    ...item,
                    id: item.id,
                    shareId: item.id
                })),
                chatIdsSharedWithUser: data.chatIdsSharedWithUser.map((item) => ({
                    ...item,
                    id: item.id,
                    shareId: item.id
                }))
            };
        });
    }
    return response;
};
