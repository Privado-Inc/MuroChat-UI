import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MessageTitle } from "./bookmarkMessage/MessageTitle";
import { MessageBox } from "./bookmarkMessage/MessageBox";
import { getBookmarkMessages } from "services/chat";
import { Loader, Notification, Error as ErrorView } from "uiLibrary/components";
import { BookmarkMessageResponse, BookmarkMessage } from "services/chatBackendUIType"
import { NoBookmarks } from "./NoBookmarks";
import { Colors } from "uiLibrary/index";

export enum LoadingState {
    NOT_STARTED = "NOT_STARTED",

    CHATS_COMPLETED = "CHATS_COMPLETED",
    CHATS_REQUESTED = "CHATS_REQUESTED",
    CHATS_FAILED = "CHATS_FAILED",

    CHATS_MESSAGES_REQUEST = "CHATS_MESSAGES_REQUEST",
    CHATS_MESSAGES_COMPLETED = "CHATS_MESSAGES_COMPLETED",
    CHATS_MESSAGES_FAILED = "CHATS_MESSAGES_FAILED",

    MESSAGE_REQUEST = "MESSAGE_REQUEST",
    MESSAGE_REQUEST_SUCCESS = "MESSAGE_REQUEST_SUCCESS",
    MESSAGE_REQUEST_FAILED = "MESSAGE_REQUEST_FAILED"
}

export const OutsideContainer = styled.div`
`;

export const Container = styled.div`
margin-bottom: 24px;
border-radius: 8px;
border: 1px solid ${Colors.neutral.p30};
background: ${Colors.neutral.p10};

/* Modern Shadow */
box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);
`;


const Bookmarks = () => {
    const tab = location.pathname.split("/")
    const showWhat = tab[tab.length - 1]

    const [loadingState, updateLoadingState] = useState(LoadingState.NOT_STARTED);
    const [chatData, setChatData] = useState<BookmarkMessageResponse[]>([]);

    useEffect(() => {
        const init = async () => {
            updateLoadingState(LoadingState.CHATS_REQUESTED);
            const response = await getBookmarkMessages(showWhat);

            if (!response.ok) {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to load Chats."
                });
                updateLoadingState(LoadingState.CHATS_FAILED);
                return;
            }
            setChatData(response.data);
            updateLoadingState(LoadingState.CHATS_COMPLETED);
        };

        init();
    }, []);

    if (loadingState in [LoadingState.NOT_STARTED, LoadingState.CHATS_REQUESTED]) {
        return <Loader />;
    }

    if (loadingState === LoadingState.CHATS_FAILED) {
        return <ErrorView> Failed to load chats </ErrorView>;
    }
    return (
        <OutsideContainer>
            {chatData.length ?
                chatData.map((chat: BookmarkMessageResponse) => {
                    return chat.messages.map((message: BookmarkMessage) => {
                        return (
                            <Container key={message.id}>
                                <MessageTitle title={chat.name} modifiedAt={message.modifiedAt} />
                                <MessageBox message={message} chat={chat} setChatData={setChatData} />
                            </Container>
                        )
                    })
                })
                : loadingState !== LoadingState.CHATS_REQUESTED && <NoBookmarks showWhat={showWhat} />
            }

        </OutsideContainer>
    )
}

export default Bookmarks;
