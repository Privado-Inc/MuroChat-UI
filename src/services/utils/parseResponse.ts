export type PageInformation = {
    totalRecords: number;
    currentPageNumber: number;
    pageSize: number;
    totalPages: number;
    totalFilteredRecords: number;
};

export type UISuccessResponse<T> = {
    ok: true;
    data: T;
    pageInfo?: PageInformation;
    map: <P>(cb: (a: T) => P) => UISuccessResponse<P>;
};

export type UIErrorResponse = {
    ok: false;
    error: {
        msg: string;
        code: number;
        errorInfo?: any;
    };
};

export type Response<T> = UISuccessResponse<T> | UIErrorResponse;

export const getUISuccessResponse = <T>(backendResponse: { data: T; pageInfo?: any }): UISuccessResponse<T> => ({
    ok: true,
    data: backendResponse.data,
    pageInfo: backendResponse.pageInfo
        ? {
              totalRecords: backendResponse.pageInfo.totalRecords,
              currentPageNumber: backendResponse.pageInfo.currentPageNumber || backendResponse.pageInfo.page,
              pageSize: backendResponse.pageInfo.pageSize,
              totalPages: backendResponse.pageInfo.totalPages,
              totalFilteredRecords: backendResponse.pageInfo.totalFilteredRecords
          }
        : undefined,
    map: (cb) =>
        getUISuccessResponse({
            data: cb(backendResponse.data),
            pageInfo: backendResponse.pageInfo
                ? {
                      totalRecords: backendResponse.pageInfo.totalRecords,
                      currentPageNumber: backendResponse.pageInfo.currentPageNumber || backendResponse.pageInfo.page,
                      pageSize: backendResponse.pageInfo.pageSize,
                      totalPages: backendResponse.pageInfo.totalPages,
                      totalFilteredRecords: backendResponse.pageInfo.totalFilteredRecords
                  }
                : undefined
        })
});

export const getUIErrorResponse = (e: { [a: string]: any }): UIErrorResponse => ({
    ok: false,
    error: {
        msg:
            e.response?.data?.data?.message ||
            e.response?.data?.detail ||
            e.response?.data?.message ||
            "Failed to load data",
        code: e.response?.status || 500,
        errorInfo: e.response?.data?.errorInfo
    }
});
