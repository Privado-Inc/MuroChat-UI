import styled from "styled-components";
import React, { ReactElement } from "react";
import hljs from "highlight.js";
import {
    BookmarkIcon,
    CopyIcon,
    Icon,
    MessageAction,
    SystemMessage,
    UserMessage,
    GoToChatIcon
} from "components/ChatListMessageLayout/Message";
import { ReactComponent as GoToChat } from "assets/svg/ChatsLink.svg";
import { bookmarkMessage, removeBookmark } from "services/chat";
import { Notification } from "uiLibrary/components";
import colors from "uiLibrary/colors";
import { BookmarkMessageResponse, Message, MessageType } from "services/chatBackendUIType";
import { useHistory } from "react-router-dom";
import TextStyles from "uiLibrary/textStyles";
import { getMaskedHtmlMessage } from "modules/chats/chat/utils";
import { useSafeAuth } from "app/store";
import { copyToClipboard } from "utils/clipboard";


export const MessageBoxContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;

    border: 1px solid ${colors.neutral.p30};
    border-top: none;
    background: ${colors.white};
`;

export const BUserMessage = styled(UserMessage)`
    padding: 24px;
    background: ${colors.white};
    width: 100%;
`

export const BSystemMessage = styled(SystemMessage)`
    padding: 24px;
    background: ${colors.white};
`

export const BookmarkAction = ({
    message,
    updateBookmark,
    chatId,
    maskedMessage
}: {
    chatId: string,
    message: Message,
    maskedMessage: string,
    updateBookmark: () => void,
}) => {
    const history = useHistory();
    return (
        <MessageAction>
            <Icon><BookmarkIcon
                title="Remove Bookmark"
                className={`${message.isBookmarked ? "selected" : ""}`}
                onClick={updateBookmark}
            /></Icon>
            <Icon><CopyIcon title="Copy" onClick={() => { copyToClipboard(maskedMessage) }} /></Icon>
            <GoToChatIcon
                title="Go to Chat"
                onClick={() => {
                    history.push({
                        pathname: `/chats/list/${chatId}?messageId=${message.id}`
                    });
                }}
            ><GoToChat /></GoToChatIcon>
        </MessageAction>
    )
}

const Pre = styled.pre`
    text-wrap: wrap;
    ${TextStyles.HeadlineH500Small}

    & code {
        padding: 15px;
        border-radius: 10px;
        background: black;
        color: white;
        display: block;
    }
    & * {
        font-family: "Söhne Mono", Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    }
`;

const getHtmlMessage = (message: string) => {
    const codes = message.split("```");
    const formattedMessages: string[] = []

    codes.forEach((code, index) => {
        if (index % 2 !== 0 && code) {
            formattedMessages.push(
                `<code>${hljs.highlightAuto(code).value}</code >`
            )
        } else {
            formattedMessages.push(code.replace(/<([^>]+)>/g, "[$1]"))
        }
    })

    return formattedMessages.join("")
};

export const MessageBox = ({
    message,
    chat,
    setChatData
}: {
    message: Message,
    chat: BookmarkMessageResponse,
    setChatData: React.Dispatch<React.SetStateAction<BookmarkMessageResponse[]>>,
}): ReactElement => {
    const updateBookmark = async () => {
        const response = await (message.isBookmarked ? removeBookmark(chat.chatId, message.id) : bookmarkMessage(chat.chatId, message.id))
        if (response.ok) {
            setChatData((chatData: BookmarkMessageResponse[]) => chatData.map((chat: BookmarkMessageResponse) => {
                chat.messages = chat.messages.filter((mess: Message) => mess.id !== message.id);
                return chat;
            }).filter(chat => chat.messages.length));
            Notification.createNotification({
                type: "Success",
                subHeading: "Successfully removed bookmarked message"
            });
        } else {
            Notification.createNotification({
                type: "Error",
                subHeading: "Error while removing bookmarked message"
            });
        }
    }

    const { user: { firstName } } = useSafeAuth()
    const piiToEntityMap = message.piiToEntityTypeMap || {}
    const piiToEntityMapData = Object.keys(piiToEntityMap).map((item) => ({ key: item, label: piiToEntityMap[item] }))
    const maskedMessage = getMaskedHtmlMessage({ noHighlight: true, message: message.message, piiToEntityMapData: piiToEntityMapData, isUser: message.type === MessageType.USER_INPUT })

    const htmlMessage = { __html: getHtmlMessage(maskedMessage) };

    return (
        <>
            <MessageBoxContainer>
                {message.type === "USER_INPUT" ?
                    <BUserMessage
                        // set user initial here
                        userInitial={firstName[0]}
                        messageAction={<BookmarkAction message={message} updateBookmark={updateBookmark} chatId={chat.chatId} maskedMessage={maskedMessage} />}
                        message={<Pre dangerouslySetInnerHTML={htmlMessage}></Pre>}
                    />
                    :
                    <BSystemMessage
                        messageAction={<BookmarkAction message={message} updateBookmark={updateBookmark} chatId={chat.chatId} maskedMessage={maskedMessage} />}
                        message={<Pre dangerouslySetInnerHTML={htmlMessage}></Pre>}
                    />
                }

            </MessageBoxContainer>
        </>
    )
}

