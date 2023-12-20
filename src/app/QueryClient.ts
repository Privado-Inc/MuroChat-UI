import { QueryClient } from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            retry: 0
        }
    }
});

export default queryClient;
