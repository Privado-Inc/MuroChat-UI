import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import ChatListMessageLayout from "components/ChatListMessageLayout";
import hljs from "highlight.js";
import {
    BookmarkIcon,
    CopyIcon,
    EditIcon,
    MessageAction,
    RegenerateIcon,
    SystemMessage,
    UserMessage,
    Icon as MessageActionIcon
} from "components/ChatListMessageLayout/Message";
import { Loader, Error as ErrorView, Button, Notification } from "uiLibrary/components";
import { ReactComponent as ChatPinned } from "assets/svg/chatPinned.svg";
import { ReactComponent as ChatPinnedActive } from "assets/svg/pinnedActive.svg";
import { ReactComponent as PlusCircle } from "assets/svg/PlusCircle.svg";
import MessageInput from "components/ChatListMessageLayout/MessageInput";
import { ReactComponent as BookmarkActive } from "assets/svg/bookmarkActive.svg";
import { ChatMessageResponse, Message, MessageType } from "services/chatBackendUIType";
import { copyToClipboard } from "utils/clipboard";
import useChatStore, { LoadingState } from "./useChatStore";
import ChatList from "./ChatList";
import ChatViewEmptyState from "./ChatViewEmptyState";
import { importChat } from "services/chat";
import { useHistory } from "react-router-dom";
import { useSafeAuth } from "app/store";
import { Colors, TextStyles } from "uiLibrary/index";
import colors from "uiLibrary/colors";
import { getMaskedHtmlMessage } from "../chat/utils"
import { Tooltip as ReactTooltip } from "react-tooltip";

const UserProfile = styled.span`
    background: ${Colors.yellow.p4};
    color: ${Colors.white};
    width: 24px;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ShareWithList = styled.div`
    width: 56px;
    overflow: hidden;
    height: 20px;
    margin-right: 5px;
`;

const SharedByInfo = styled.div`
    width: auto;
    height: 100%;
    position: absolute;
    left: 66px;
    top: 15px;
    gap: 10px;
    display: flex;
`;

const SharedByNameContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const SharedByTite = styled.div`
    ${TextStyles.TextT300Regular};
    color: ${Colors.neutral.p90};
`;

const SharedByPersonName = styled.div`
    ${TextStyles.TextT200Semibold};
    color: ${Colors.neutral.p90};
`;

const BottomContainer = styled.div`
    position: absolute;
    width: 100%;
    bottom: 25px;
    padding: 24px 68px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;

    & button {
        padding: 11px 19px;
    }
`
const Icon = styled.span`
    width: 24px;
    height: 24px;
    display: flex;
    flex: 0 0 24px;
    align-items: center;
    margin-left: 10px;
    justify-content: center;
    cursor: pointer;
`;

const MessageList = styled.div`
    height: calc(100% - 100px);
    overflow: scroll;
`;

const WhiteLine = styled.div`
    height: 1px;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    padding: 6px 8px 6px 6px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 6px;
    background: ${colors.neutral.p90};
    cursor: pointer;
`;

const Pre = styled.pre`
    text-wrap: wrap;
    ${TextStyles.HeadlineH500Regular}
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

const HeaderComponent = () => {
    return <>
        Shared Chats
    </>
}

export default () => {
    const store = useChatStore();
    const { user: { id, firstName } } = useSafeAuth()
    const divRef = useRef<HTMLDivElement>(null);
    const history = useHistory();

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollIntoView();
        }
    });

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

    const chatTitle = store.selectedChat ? store.selectedChat.name : "No Shared Chat";
    const selectedChatMessages = store.selectedChat ? store.chatMessageById[store.selectedChat.id] : undefined;
    const chatsExist = !!(store.chats.chatIdsSharedByUser.length + store.chats.chatIdsSharedWithUser.length);

    if ([LoadingState.INProgress, LoadingState.NS].includes(store.fetchChatsS)) {
        return <Loader />;
    }

    return <ChatListMessageLayout header={<HeaderComponent />} hideSidePanel={!chatsExist}>
        {chatsExist ? <ChatList
            chatIdsSharedByUser={store.chats.chatIdsSharedByUser}
            chatIdsSharedWithUser={store.chats.chatIdsSharedWithUser}
            deleteChat={(id, selfRemove) => store.deleteChat(id, selfRemove)}
            onSelectChat={(chat) => {
                store.setSelectedChat(chat);
                store.updateChatByIdMap((chatbyChatIdMap: { [id: string]: ChatMessageResponse }) => {
                    return {
                        ...chatbyChatIdMap,
                        [chat.id]: chat.chatMessages
                    }
                })
                return true
            }}
            selectedChat={store.selectedChat}
            key={"chatList"}
        /> : null}
        {chatsExist ? <ChatListMessageLayout.MessagesSection>
            <ChatListMessageLayout.MessageTitle>
                <ChatListMessageLayout.MessageTitleWithShare>
                    {store.selectedChat?.sharedBy !== id && <SharedByInfo>
                        {/* <UserProfile>V</UserProfile>
                    <SharedByNameContainer>
                        <SharedByTite>Shared By</SharedByTite>
                        <SharedByPersonName> - </SharedByPersonName>
                    </SharedByNameContainer> */}
                    </SharedByInfo>}
                    {chatTitle}
                </ChatListMessageLayout.MessageTitleWithShare>
                {
                    store.selectedChat?.sharedBy === id &&
                    <>
                        <ShareWithList id="sharedWithList">
                            {store.selectedChat.sharedWithList}
                        </ShareWithList>
                        <ReactTooltip
                            anchorSelect="#sharedWithList"
                            id={"tooltip-id"}
                            key={"tooltip-key"}
                            place={"bottom"}
                        >
                            {store.selectedChat.sharedWithList}
                        </ReactTooltip>
                        <ChatListMessageLayout.ShareChatIcon />
                    </>
                }
            </ChatListMessageLayout.MessageTitle>
            <MessageList>
                {
                    selectedChatMessages && selectedChatMessages.messages.map((message, index) => {
                        const piiToEntityMap = message.piiToEntityTypeMap || {}
                        const piiToEntityMapData = Object.keys(piiToEntityMap).map((item) => ({ key: item, label: piiToEntityMap[item] }))
                        const maskedMessage = getMaskedHtmlMessage({ noHighlight: true, message: message.message, piiToEntityMapData: piiToEntityMapData, isUser: message.type === MessageType.USER_INPUT })

                        const htmlMessage = { __html: getHtmlMessage(maskedMessage) };
                        if (message.type === MessageType.USER_INPUT) {
                            return <UserMessage
                                key={message.id}
                                userInitial={firstName[0]}
                                message={<Pre dangerouslySetInnerHTML={htmlMessage}></Pre>}
                            />
                        } else {
                            return <SystemMessage
                                key={message.id}
                                message={<Pre dangerouslySetInnerHTML={htmlMessage}></Pre>}
                            />
                        }
                    })
                }
                <WhiteLine ref={divRef} />
            </MessageList>
            {selectedChatMessages && store.selectedChat?.sharedBy !== id && <BottomContainer>
                <Button.Large
                    label="Continue this conversation"
                    onClick={async () => {
                        if (!store.selectedChat) return;
                        const response = await importChat(store.selectedChat.id, selectedChatMessages.chatId);
                        if (response.ok) {
                            Notification.createNotification({
                                type: "Success",
                                subHeading: "Successfully Imported Chat"
                            });
                            history.push({
                                pathname: `/chats/list/${response.data.chatId}`
                            });
                            return
                        }
                        Notification.createNotification({
                            type: "Error",
                            subHeading: "Failed to Import Chat. Please try again"
                        });
                    }}
                />
            </BottomContainer>}
        </ChatListMessageLayout.MessagesSection > : null}

        {!chatsExist ? <ChatViewEmptyState /> : null}
    </ChatListMessageLayout >
}
