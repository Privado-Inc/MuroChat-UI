enum Routes {
    Bookmarks = "/bookmarks",
    Prompts = "/prompts",
    Responses = "/responses",
}

export const Labels = {
    [Routes.Bookmarks]: "All Bookmarks",
    [Routes.Prompts]: "Prompts",
    [Routes.Responses]: "Responses"
};

export default Routes;
