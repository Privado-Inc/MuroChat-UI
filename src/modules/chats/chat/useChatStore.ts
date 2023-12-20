import { useEffect, useState } from "react";
import { ChatResponse, ChatMessageResponse, MessageType, ChatsByGroup, Message, LLM_TYPE } from "services/chatBackendUIType";
import { getChatMessages, sendMessage, deleteChat, bookmarkMessage, removeBookmark, pinChat, unPinChat, reGenerateMessage, getChatsByGroup, editChatName, editMessage } from "services/chat";
import { Notification } from "uiLibrary/components";
import { useHistory, useParams } from "react-router-dom";

export type PiiToEntityTypeMap = {
    [a: string]: string;
}

export type ChatMessage = {
    message: string;
    type: MessageType;
    id: string;
    piiToEntityTypeMap: PiiToEntityTypeMap
    anonymizedMessage: string;
    isBookmarked?: boolean;
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

const newChatMock: ChatResponse = {
    name: "New Chat",
    id: "newChatId",
    type: LLM_TYPE.GPT,
    userId: ""
}

const useStore = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const history = useHistory();
    const [chats, setChats] = useState<ChatGroupType>({ pinnedChats: [], chatsByDate: [] });
    const [chatMessageById, updateChatByIdMap] = useState<{ [id: string]: ChatMessages }>({});
    const [selectedChat, setSelectedChat] = useState<ChatResponse | undefined>();
    const [newChatState, updateNewChatState] = useState<NewChat | undefined>();
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    const [fetchChatsS, updateFetchChatsS] = useState<CHATS_API_STATUS>(LoadingState.NS);
    const [fetchChatMessageS, updateFetchChatMessageS] = useState<CHAT_MESSAGE_API_STATUS>(LoadingState.NS);

    useEffect(() => {
        const init = async () => {
            updateFetchChatsS(LoadingState.INProgress)
            const response = await getChatsByGroup(true);
            if (!response.ok) {
                updateFetchChatsS(LoadingState.Error);
                return undefined;
            }
            setChats({
                pinnedChats: response.data.pinnedChats.filter(chat => chat.isPinned),
                chatsByDate: response.data.chatsByDate.map(group => ({
                    ...group,
                    chats: group.chats.filter(chat => !chat.isPinned)
                }))
            });
            updateFetchChatsS(LoadingState.Completed);
        };
        init();
    }, []);

    useEffect(() => {
        if (isMessageLoading) return;
        const allChats = chats.pinnedChats.concat(chats.chatsByDate.reduce<ChatResponse[]>((acc, value) => {
            return [...acc, ...value.chats];
        }, []));

        if (chatId === "newChat") {
            return setSelectedChat(newChatMock);
        }

        if (chatId) {
            const chatFound = allChats.find(chat => chat.id === chatId.split("?")[0]);
            if (chatFound) {
                updateNewChatState(undefined)
                return setSelectedChat(chatFound)
            }
        }
        if (allChats[0]) {
            updateNewChatState(undefined)
            history.push({
                pathname: `/chats/list/${allChats[0].id}`
            });
        }
    }, [chatId, chats])

    useEffect(() => {
        if (isMessageLoading || !selectedChat || selectedChat.id === newChatMock.id) return;

        const fetchMessages = async () => {
            updateFetchChatMessageS(LoadingState.INProgress);
            const response = await getChatMessages(selectedChat.id);
            if (!response) {
                updateFetchChatMessageS(LoadingState.Error);
                return undefined;
            }
            updateFetchChatMessageS(LoadingState.Completed);
            updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                if (selectedChat.id && response.ok) {
                    return {
                        ...chatbyChatIdMap,
                        [selectedChat.id]: response.data
                    };
                }
                return chatMessageById;
            });
        };
        fetchMessages();
    }, [selectedChat]);

    return {
        fetchChatsS,
        fetchChatMessageS,
        chats,
        selectedChat,
        setSelectedChat,
        newChatState,
        updateNewChatState,
        chatMessageById,
        newChatMock,
        isMessageLoading,
        setIsMessageLoading,
        reGenerateMessage: async (chatId: string, messageId: string) => {
            if (!chatId || !messageId) return;

            updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                const chatMessages = chatbyChatIdMap[chatId];
                if (!chatMessages) return chatbyChatIdMap;

                const newChatMap = {
                    ...chatbyChatIdMap,
                    [chatId]: {
                        ...chatbyChatIdMap[chatId],
                        messages: chatMessages.messages.slice(0, -1)
                    }
                }
                return { ...newChatMap };
            });

            setIsMessageLoading(true);
            let isMessageCreated = false;
            const reader = await reGenerateMessage({
                messageId: messageId,
                chatId: chatId,
                streamCallback: (value) => {
                    if (value.finished) {
                        setIsMessageLoading(false);
                        return;
                    }

                    updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                        const chatMessages = chatbyChatIdMap[chatId];
                        if (!chatMessages) return chatbyChatIdMap;

                        if (!isMessageCreated) {
                            chatMessages.messages[chatMessages.messages.length - 1].id = value.uMessageId;
                            chatMessages.messages[chatMessages.messages.length - 1].anonymizedMessage = "";
                            chatMessages.messages[chatMessages.messages.length - 1].piiToEntityTypeMap = value.piiToEntityTypeMap;
                            chatMessages.messages.push({
                                id: value.sMessageId,
                                message: value.message,
                                anonymizedMessage: value.message,
                                type: MessageType.GPT,
                                piiToEntityTypeMap: value.piiToEntityTypeMap
                            });
                            isMessageCreated = true;
                        } else {
                            chatMessages.messages[chatMessages.messages.length - 1].message = chatMessages.messages[
                                chatMessages.messages.length - 1
                            ].message.concat(value.message);
                        }

                        return { ...chatbyChatIdMap };
                    });
                }
            });

            if (!reader) {
                return false;
            }
            return reader;
        },
        bookmarkMessage: async (chatId: string, messageId: string) => {
            const bookmarkResponse = await bookmarkMessage(chatId, messageId);
            if (bookmarkResponse) {
                updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                    const chatMessages = chatbyChatIdMap[chatId];
                    if (!chatMessages) return chatbyChatIdMap;

                    const newChatMap = {
                        ...chatbyChatIdMap,
                        [chatId]: {
                            ...chatbyChatIdMap[chatId],
                            messages: chatMessages.messages.map(message => (messageId === message.id ? {
                                ...message,
                                isBookmarked: true
                            } : message))
                        }
                    }
                    return { ...newChatMap };
                });
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Successfully Bookmarked message"
                });
                return true;
            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to Bookmark message"
                });
            }
        },
        removeBookmarkMessage: async (chatId: string, messageId: string) => {
            const bookmarkResponse = await removeBookmark(chatId, messageId);
            if (bookmarkResponse) {
                updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                    const chatMessages = chatbyChatIdMap[chatId];
                    if (!chatMessages) return chatbyChatIdMap;

                    const newChatMap = {
                        ...chatbyChatIdMap,
                        [chatId]: {
                            ...chatbyChatIdMap[chatId],
                            messages: chatMessages.messages.map(message => (messageId === message.id ? {
                                ...message,
                                isBookmarked: false
                            } : message))
                        }
                    }
                    return { ...newChatMap };
                });
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Successfully unbookmarked message"
                });
                return true;
            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to unbookmarked message"
                });
            }
        },
        pinChat: async (chatId: string) => {
            const pinResponse = await pinChat(chatId);
            if (pinResponse) {
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Successfully Pinned Chat"
                });
                const response = await getChatsByGroup(true);
                if (response.ok) {
                    setChats({
                        pinnedChats: response.data.pinnedChats.filter(chat => chat.isPinned),
                        chatsByDate: response.data.chatsByDate.map(group => ({
                            ...group,
                            chats: group.chats.filter(chat => !chat.isPinned)
                        }))
                    });
                    setSelectedChat((selectedMessage) => (selectedMessage ? {
                        ...selectedMessage,
                        isPinned: false
                    } : selectedMessage));
                    updateNewChatState(undefined);
                }
                return true;
            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed To Pin Chat"
                });
            }
        },
        unPinChat: async (chatId: string) => {
            const pinResponse = await unPinChat(chatId);
            if (pinResponse) {
                const response = await getChatsByGroup(true);
                if (response.ok) {
                    setChats({
                        pinnedChats: response.data.pinnedChats.filter(chat => chat.isPinned),
                        chatsByDate: response.data.chatsByDate.map(group => ({
                            ...group,
                            chats: group.chats.filter(chat => !chat.isPinned)
                        }))
                    });
                    setSelectedChat((selectedMessage) => (selectedMessage ? {
                        ...selectedMessage,
                        isPinned: false
                    } : selectedMessage));
                    updateNewChatState(undefined);
                }
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Successfully UnPinned Chat"
                });
                return true;
            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to UnPinned Chat"
                });
            }
        },
        editChatName: async (id: string, name: string): Promise<boolean> => {
            if (!name.trim() || !id) return false;
            const response = await editChatName(id, name);
            if (!response.ok) {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Error while editing chat name"
                });
                return false
            }
            Notification.createNotification({
                type: "Success",
                subHeading: "Successfully Edited chat name"
            });
            setChats(chats => {
                chats.chatsByDate.forEach((chatGroup) => {
                    return chatGroup.chats.forEach((chat) => {
                        if (chat.id === id) {
                            chat.name = name;
                        }
                        return chat;
                    });
                });
                chats.pinnedChats.forEach(chat => {
                    if (chat.id === id) {
                        chat.name = name;
                    }
                    return chat;
                })
                return chats;
            });
            return true
        },
        deleteChat: async (id: string) => {
            const isDelete = await deleteChat(id);
            if (isDelete) {
                const response = await getChatsByGroup(true);
                if (response.ok) {
                    setChats({
                        pinnedChats: response.data.pinnedChats.filter(chat => chat.isPinned),
                        chatsByDate: response.data.chatsByDate.map(group => ({
                            ...group,
                            chats: group.chats.filter(chat => !chat.isPinned)
                        }))
                    });
                    history.push({
                        pathname: "/chats/list/select"
                    });
                    updateNewChatState(undefined);
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
        },
        newChatMessage: async (message: string) => {
            if (!message.trim()) return;
            updateNewChatState({
                userMessage: message.trim(),
                systemMessage: ""
            });
            setIsMessageLoading(true);
            const reader = await sendMessage({
                message: message.trim(),
                chatId: undefined,
                streamCallback: async (value) => {
                    if (value.finished) {
                        setIsMessageLoading(false);
                        const response = await getChatsByGroup(true);
                        if (response.ok) {
                            setChats({
                                pinnedChats: response.data.pinnedChats.filter(chat => chat.isPinned),
                                chatsByDate: response.data.chatsByDate.map(group => ({
                                    ...group,
                                    chats: group.chats.filter(chat => !chat.isPinned)
                                }))
                            });
                            const allChats = response.data.chatsByDate.reduce<ChatResponse[]>((acc, value) => {
                                return [...acc, ...value.chats];
                            }, []).concat(response.data.pinnedChats);

                            updateNewChatState(undefined);
                            history.push({
                                pathname: `/chats/list/${value.chatId}`
                            });
                        }
                    };

                    updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                        if (value.chatId && chatbyChatIdMap[value.chatId]) {
                            chatbyChatIdMap[value.chatId].messages[1].message += value.message;
                            chatbyChatIdMap[value.chatId].messages[1].anonymizedMessage = chatbyChatIdMap[value.chatId].messages[1].message;
                            chatbyChatIdMap[value.chatId].messages[1].piiToEntityTypeMap = value.piiToEntityTypeMap;
                        }
                        else if (value.chatId) {
                            chatbyChatIdMap = {
                                [value.chatId]: {
                                    chatId: value.chatId,
                                    messages: [
                                        {
                                            id: value.uMessageId,
                                            message: message,
                                            anonymizedMessage: message,
                                            type: MessageType.USER_INPUT,
                                            piiToEntityTypeMap: value.piiToEntityTypeMap
                                        }, {
                                            id: value.sMessageId,
                                            message: (value.message || ""),
                                            anonymizedMessage: (value.message || ""),
                                            type: MessageType.GPT,
                                            piiToEntityTypeMap: value.piiToEntityTypeMap
                                        }
                                    ]
                                },
                                ...chatbyChatIdMap
                            }
                            setSelectedChat({
                                ...newChatMock,
                                id: value.chatId,
                                name: message.substring(0, 24)
                            })
                        }

                        return { ...chatbyChatIdMap };
                    });
                }
            });
        },
        sendMessage: async (chatId: string, message: string) => {
            if (!chatId || !message.trim()) return;

            updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                const chatMessages = chatbyChatIdMap[chatId];
                if (!chatMessages) return chatbyChatIdMap;

                const newMessages = chatMessages.messages.concat([{
                    id: Math.random().toString(),
                    message: message,
                    anonymizedMessage: message,
                    type: MessageType.USER_INPUT,
                    piiToEntityTypeMap: {}
                }]);
                const newChatMap = {
                    ...chatbyChatIdMap,
                    [chatId]: {
                        ...chatMessages,
                        messages: newMessages
                    }
                }
                return { ...newChatMap };
            });

            setIsMessageLoading(true);
            let isMessageCreated = false;
            const reader = await sendMessage({
                message: message.trim(),
                chatId,
                streamCallback: (value) => {
                    if (value.finished) {
                        setIsMessageLoading(false);
                        return;
                    }

                    updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                        const chatMessages = chatbyChatIdMap[chatId];
                        if (!chatMessages) return chatbyChatIdMap;

                        if (!isMessageCreated) {
                            chatMessages.messages[chatMessages.messages.length - 1].id = value.uMessageId;
                            chatMessages.messages[chatMessages.messages.length - 1].anonymizedMessage = "";
                            chatMessages.messages[chatMessages.messages.length - 1].piiToEntityTypeMap = value.piiToEntityTypeMap;
                            chatMessages.messages.push({
                                id: value.sMessageId,
                                message: value.message,
                                anonymizedMessage: value.message,
                                type: MessageType.GPT,
                                piiToEntityTypeMap: value.piiToEntityTypeMap
                            });
                            isMessageCreated = true;
                        } else {
                            chatMessages.messages[chatMessages.messages.length - 1].message = chatMessages.messages[
                                chatMessages.messages.length - 1
                            ].message.concat(value.message);
                        }

                        return { ...chatbyChatIdMap };
                    });
                }
            });

            if (!reader) {
                return false;
            }
            return reader;
        },
        editMessage: async (chatId: string, message: string, messageId: string) => {
            if (!chatId || !message.trim()) return;

            updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                const chatMessages = chatbyChatIdMap[chatId];
                if (!chatMessages) return chatbyChatIdMap;

                const newMessages: Message[] = [];

                let foundMessageId = false;
                chatMessages.messages.forEach(message => {
                    if (!foundMessageId && message.id !== messageId) {
                        newMessages.push(message);
                    } else if (message.id === messageId) {
                        foundMessageId = true;
                    }
                })

                newMessages.push({
                    id: Math.random().toString(),
                    message: message,
                    anonymizedMessage: message,
                    type: MessageType.USER_INPUT,
                    piiToEntityTypeMap: {}
                });

                const newChatMap = {
                    ...chatbyChatIdMap,
                    [chatId]: {
                        ...chatMessages,
                        messages: [...newMessages]
                    }
                }
                return { ...newChatMap };
            });

            setIsMessageLoading(true);
            let isMessageCreated = false;
            const reader = await editMessage({
                messageId: messageId,
                message: message.trim(),
                chatId,
                streamCallback: (value) => {
                    if (value.finished) {
                        setIsMessageLoading(false);
                        return;
                    }

                    updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                        const chatMessages = chatbyChatIdMap[chatId];
                        if (!chatMessages) return chatbyChatIdMap;

                        if (!isMessageCreated) {
                            chatMessages.messages[chatMessages.messages.length - 1].id = value.uMessageId;
                            chatMessages.messages[chatMessages.messages.length - 1].piiToEntityTypeMap = value.piiToEntityTypeMap;
                            chatMessages.messages[chatMessages.messages.length - 1].anonymizedMessage = "";
                            chatMessages.messages.push({
                                id: value.sMessageId,
                                message: value.message,
                                anonymizedMessage: value.message,
                                type: MessageType.GPT,
                                piiToEntityTypeMap: value.piiToEntityTypeMap
                            });
                            isMessageCreated = true;
                        } else {
                            chatMessages.messages[chatMessages.messages.length - 1].message = chatMessages.messages[
                                chatMessages.messages.length - 1
                            ].message.concat(value.message);
                        }

                        return { ...chatbyChatIdMap };
                    });
                }
            });

            if (!reader) {
                return false;
            }
            return reader;
        }
    }
}

export default useStore;
export type UseStore = ReturnType<typeof useStore>;