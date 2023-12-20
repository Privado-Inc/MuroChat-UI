export const replaceUrlParams = (searchParams: URLSearchParams, oldKey: string, newKey: string): URLSearchParams => {
    searchParams.append(newKey, searchParams.get(oldKey) || "");
    searchParams.delete(oldKey);
    return searchParams;
};
