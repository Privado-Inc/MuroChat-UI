enum Routes {
    Chats = "/list",
    Bookmarks = "/bookmarks",
    Share = "/share",
}

export const Labels = {
    [Routes.Chats]: "Chat List",
    [Routes.Bookmarks]: "Bookmark List",
    [Routes.Share]: "Share List"
};

export default Routes;
