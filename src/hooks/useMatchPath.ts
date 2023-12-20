import { matchPath, useLocation } from "react-router-dom";

const useMatchPath = (route: string): string | null => {
    const location = useLocation();

    const matched = matchPath<{ id: string }>(location.pathname, {
        exact: false,
        path: `${route}/:id`
    });

    if (!matched?.params.id) {
        return null;
    }
    return matched.params.id;
};

export default useMatchPath;
