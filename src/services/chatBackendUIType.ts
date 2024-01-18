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
    sharedList?: string;
    shareId: string; // This is only for frontend
    chatMessages: ChatMessageResponse;
};

export type SharedChat = {
    chatIdsSharedByUser: SharedChatItem[];
    chatIdsSharedWithUser: SharedChatItem[];
};

export type StatisticalData = {
    _id?: number,
    userGroup?: string;
    totalMessageCount: number;
    totalPiiCount: number;
    label?: string;
    activeUsers?: number;
    time: string;
}

export type BiMonthly = {
    activeUsers: number;
    activeUsersPercent: number;
    piiCount: number;
    piiCountPercent: number;
    promptSent: number;
    promptSentPercent: number;
}

export type TopRedactedSensitiveData = {
    label: string;
    value: number;
    colour: string;
}

export type Stats = {
    UsageAcrossUserGroups: StatisticalData[];
    bimonthly: BiMonthly;
    daily: StatisticalData[];
    monthly: StatisticalData[];
    topRedactedSensitiveData: TopRedactedSensitiveData[];
};
