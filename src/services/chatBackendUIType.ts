export enum MessageType {
    GPT = "GPT",
    USER_INPUT = "USER_INPUT"
}

export enum LLM_TYPE {
    GPT = "GPT"
}

export type PiiToEntityTypeMap = {
    [a: string]: string;
};

export type Message = {
    id: string;
    message: string;
    anonymizedMessage: string;
    type: MessageType;
    isBookmarked?: boolean;
    isDeleted?: boolean;
    piiToEntityTypeMap: PiiToEntityTypeMap;
    createdAt?: string;
    modifiedAt?: string;
};

export type ChatResponse = {
    name: string;
    id: string;
    modifiedAt?: string;
    type: LLM_TYPE.GPT;
    isDeleted?: boolean;
    isBookmarked?: boolean;
    isPinned?: boolean;
    userId: string;
    createdFrom?: string;
};

export type ChatsByGroups = {
    chatsByDate: ChatsByGroup[];
    pinnedChats: ChatResponse[];
};

export type ChatsByGroup = {
    title: string;
    chats: ChatResponse[];
};

export type ChatMessageResponse = {
    messages: Message[];
    chatId: string;
};

export type BookmarkMessage = Message;

export type BookmarkMessageResponse = {
    chatId: string;
    userId: string;
    name: string;
    messages: BookmarkMessage[];
};

export type SharedChatItem = {
    id: string;
    sharedBy: string;
    chatId: string;
    name: string;
    sharedWith: string[];
    sharedWithList?: string;
    shareId: string; // This is only for frontend
    chatMessages: ChatMessageResponse;
};

export type SharedChat = {
    chatIdsSharedByUser: SharedChatItem[];
    chatIdsSharedWithUser: SharedChatItem[];
};
