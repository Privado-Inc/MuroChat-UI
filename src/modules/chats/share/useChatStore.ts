import { useEffect, useState } from "react";
import { ChatResponse, ChatMessageResponse, MessageType, ChatsByGroup, SharedChat, SharedChatItem, PiiToEntityTypeMap } from "services/chatBackendUIType";
import { getSharedChats, getChatMessages, sendMessage, deleteChat, bookmarkMessage, removeBookmark, pinChat, unPinChat, reGenerateMessage, getChatsByGroup, deleteSharedChat } from "services/chat";
import { Notification } from "uiLibrary/components";
import { useParams } from "react-router-dom";
import { getUsersList } from "services/users";

export type ChatMessage = {
    message: string;
    type: MessageType;
    id: string;
    isBookmarked?: boolean;
    anonymizedMessage: string;
    piiToEntityTypeMap: PiiToEntityTypeMap;
    createdAt?: string;
    modifiedAt?: string;
}

export type ChatMessages = ChatMessageResponse | {
    chatId: string;
    messages: ChatMessage[]
}

export enum LoadingState {
    NS = "NOT_STARTED",
    INProgress = "InProgress",
    Completed = "Completed",
    Error = "Error",
}

type NewChat = {
    userMessage: string;
    systemMessage: string;
}

export type CHATS_API_STATUS = LoadingState;
export type CHAT_MESSAGE_API_STATUS = LoadingState;
export type CHAT_SEND_MESSAGE_API_STATUS = LoadingState;

export type ChatGroupType = {
    pinnedChats: ChatResponse[],
    chatsByDate: ChatsByGroup[]
}


export default () => {
    const selectedSharedChatId = new URLSearchParams(window.location.search).get(
        "id"
    );
    const [chats, setChats] = useState<SharedChat>({ chatIdsSharedByUser: [], chatIdsSharedWithUser: [] });
    const [chatMessageById, updateChatByIdMap] = useState<{ [id: string]: ChatMessages }>({});
    const [selectedChat, setSelectedChat] = useState<SharedChatItem | undefined>();

    const [fetchChatsS, updateFetchChatsS] = useState<CHATS_API_STATUS>(LoadingState.NS);

    useEffect(() => {
        const init = async () => {
            updateFetchChatsS(LoadingState.INProgress)


            const userResponse = await getUsersList();
            let users: { key: string, label: string }[] = [];
            if (userResponse.ok) {
                users = userResponse.data.map(user => ({
                    key: user.id,
                    label: `${user.firstName} ${user.lastName}`
                }));
            }

            const response = await getSharedChats();
            if (!response.ok) {
                updateFetchChatsS(LoadingState.Error);
                return undefined;
            }

            response.data.chatIdsSharedByUser.forEach(chat => {
                if (!chat.sharedWith.length) {
                    chat.sharedWithList = "Everyone in the Organisation"
                } else {
                    chat.sharedWithList = chat.sharedWith.map(sharedWithId => {
                        const user = users.find(user => user.key === sharedWithId);
                        return user ? user.label : sharedWithId;
                    }).join(", ")
                }
                return chat;
            })

            setChats(response.data)
            updateFetchChatsS(LoadingState.Completed);
        }
        init();
    }, []);

    useEffect(() => {
        const allChats = chats.chatIdsSharedWithUser.concat(chats.chatIdsSharedByUser);

        if (selectedSharedChatId) {
            const chatFound = allChats.find(chat => chat.chatId === selectedSharedChatId);
            if (chatFound) {
                setSelectedChat(chatFound);
                updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                    return {
                        ...chatbyChatIdMap,
                        [chatFound.id]: chatFound.chatMessages
                    }
                })
                return;
            }
        }
        if (!allChats.length) return;
        setSelectedChat(() => {
            const chatFound = allChats[0];
            updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                return {
                    ...chatbyChatIdMap,
                    [chatFound.id]: chatFound.chatMessages
                }
            })
            return chatFound;
        })
    }, [selectedSharedChatId, chats])

    return {
        fetchChatsS,
        chats,
        selectedChat,
        setSelectedChat,
        updateChatByIdMap,
        chatMessageById,
        deleteChat: async (chat: SharedChatItem, selfRemove: boolean) => {
            const isDelete = await deleteSharedChat(chat.chatId, null, selfRemove, chat.sharedBy);
            if (isDelete) {
                const response = await getSharedChats();
                if (response.ok) {
                    setChats(response.data);
                    const allChats = response.data.chatIdsSharedByUser.concat(response.data.chatIdsSharedWithUser);
                    setSelectedChat(allChats[0])
                }
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Successfully Delete chat"
                });
                return true;
            }
            Notification.createNotification({
                type: "Error",
                subHeading: "Error while deleting chat"
            });
            return false;
        }
    }
}
