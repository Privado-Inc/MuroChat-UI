export default {
    meta: () => "u/meta",
    chats: () => "c/chats",
    inviteUsers: () => "u/invite-users",
    syncUsers: () => "u/sync-users",
    idpConfiguration: () => "u/idp-configuration",
    idpGroups: () => "u/idp-groups",
    idpRoleMapping: () => "u/idp-role-mapping",
    onboarding: () => "u/onboarding",
    llm_models: () => "c/llm_models",
    users: () => "u/users",
    message: (chatId: string) => `c/chats/${chatId}/message`,
    getBookmarkChats: () => "c/chats/bookmark",
    bookmarkMessage: (chatId: string, messageId: string) => `c/chats/${chatId}/message/${messageId}/bookmark`,
    pinChat: (chatId: string) => `c/chat/${chatId}/pin`,
    sharedChat: () => "c/chats/share",
    stats: () => "c/stats",
    importChat: (userChatSharingId: string, chatId: string) => `c/chats/import/${userChatSharingId}/${chatId}`
};
