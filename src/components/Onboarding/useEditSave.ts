import React, { useState, useEffect } from "react";
import { Response } from "services/utils/parseResponse";
import { Notification } from "uiLibrary/components";

export default <T>({
    initialState,
    fetcher,
    createFetcher,
    updateFetcher
}: {
    initialState: T;
    fetcher: () => Promise<Response<T>>;
    createFetcher: (data: T) => Promise<Response<any>>;
    updateFetcher: (data: T, id?: string) => Promise<Response<any>>;
}) => {
    const [apiState, updateAPIState] = useState<T>();
    const [state, updateState] = useState<T>(initialState);
    const [isEditing, setIsEditMode] = useState(false);
    const [savingState, setSavingState] = useState<0 | 1 | -1>(); // 0 Loading, 1 Success, -1 Error
    const [initialAPIRequestState, updateApiRequestState] = useState<0 | 1 | -1>(0); // 0 Loading, 1 Success, -1 Error

    useEffect(() => {
        if (apiState) {
            updateState(apiState);
        }
    }, [apiState]);

    useEffect(() => {
        (async () => {
            const response = await fetcher();
            if (response.ok) {
                updateAPIState(response.data);
                updateApiRequestState(1);
                return;
            }
            if (response.error.code !== 404) {
                Notification.createNotification({
                    type: "Error",
                    subHeading: response.error.msg
                });
                updateApiRequestState(0);
                return;
            }
            updateApiRequestState(-1);
        })();
    }, []);

    return {
        create: async (data: T, updateApiStateFromData?: (a: T | undefined, b: T, c: any) => T) => {
            setSavingState(0);
            const response = await createFetcher(data);
            if (response.ok) {
                setSavingState(1);
                if (updateApiStateFromData) {
                    updateAPIState(updateApiStateFromData(apiState, data, response.data));
                } else {
                    updateAPIState({
                        ...apiState,
                        ...data
                    });
                }
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Created Successfully."
                });
                setTimeout(() => {
                    setIsEditMode(false);
                    setSavingState(undefined);
                }, 200);
                return response;
            }
            setSavingState(-1);
            Notification.createNotification({
                type: "Error",
                subHeading: response.error.msg
            });
            return response;
        },
        update: async (data: T, id?: string, updateApiStateFromData?: (a: T | undefined, b: T, c: any) => T) => {
            setSavingState(0);
            const response = await updateFetcher(data, id);
            if (response.ok) {
                setSavingState(1);
                if (updateApiStateFromData) {
                    updateAPIState(updateApiStateFromData(apiState, data, response.data));
                } else {
                    updateAPIState({
                        ...apiState,
                        ...data
                    });
                }
                Notification.createNotification({
                    type: "Success",
                    subHeading: "Update Successfully."
                });
                setTimeout(() => {
                    setIsEditMode(false);
                    setSavingState(undefined);
                }, 200);
                return true;
            }
            setSavingState(-1);
            Notification.createNotification({
                type: "Error",
                subHeading: response.error.msg
            });
            return false;
        },
        onCancel: () => {
            updateState(apiState || initialState);
            setIsEditMode(false);
        },
        initialAPIRequestState,
        updateAPIState,
        apiState,
        isEditing,
        setIsEditMode,
        state,
        updateState,
        savingState
    };
};
