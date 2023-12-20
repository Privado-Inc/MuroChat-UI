import React, { useEffect, useRef, useState } from "react";
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
    Icon as MessageActionIcon,
    UserMessage as GenericUserMessage
} from "components/ChatListMessageLayout/Message";
import { Loader, Error as ErrorView } from "uiLibrary/components";
import { ReactComponent as ChatPinned } from "assets/svg/chatPinned.svg";
import { ReactComponent as ChatPinnedActive } from "assets/svg/pinnedActive.svg";
import { ReactComponent as PlusCircle } from "assets/svg/PlusCircle.svg";
import MessageInput from "components/ChatListMessageLayout/MessageInput";
import ShareChatDialogue from "./ShareChatDialogue";
import { ReactComponent as BookmarkActive } from "assets/svg/bookmarkActive.svg";
import ChatList from "./ChatList";
import useChatStore, { LoadingState } from "./useChatStore";
import { Message, MessageType } from "services/chatBackendUIType";
import { copyToClipboard } from "utils/clipboard";
import { Colors, TextStyles } from "uiLibrary/index";
import ChatViewEmptyState from "./ChatViewEmptyState";
import { useHistory, useParams } from "react-router-dom";
import UserMessage from "./UserMessage";
import { getMaskedHtmlMessage } from "./utils"
import { useSafeAuth } from "app/store";

const BottomContainer = styled.div`
    position: absolute;
    width: 100%;
    bottom: 20px;
    padding: 24px 68px 0px;
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
    height: calc(100% - 180px);
    overflow-y: scroll;

    & .highlight {
        border-top: 1.5px solid ${Colors.purple.p40};
        border-bottom: 1.5px solid ${Colors.purple.p40};
        background: ${Colors.purple.p20};
    }
`;

const WhiteLine = styled.div`
    height: 20px;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    padding: 6px 8px 6px 6px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 6px;
    background: ${Colors.neutral.p90};
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

const HeaderComponent = ({ onClick }: { onClick: () => void }) => {
    return <>
        All Chats
        <Header onClick={onClick}>
            <PlusCircle />
            New Chat
        </Header>
    </>
}

export default () => {
    const store = useChatStore();
    const divRef = useRef<HTMLDivElement>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const previousValueRef = useRef<string>("");
    const [isInView, setIsInView] = useState(true);
    const [highlightedMessage, setHighlightedMessage] = useState<string | undefined>(undefined);

    const checkIfElementIsInView = () => {
        const element = divRef.current;
        const scrollContainer = messageListRef.current;

        if (element && scrollContainer) {
            const elementRect = element.getBoundingClientRect();
            const containerRect = scrollContainer?.getBoundingClientRect();
            const isInView = elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom;
            setIsInView(isInView);
        }
    };

    const history = useHistory();
    useEffect(() => {
        if (!isInView) return;
        if (messageRef.current) {
            messageRef.current.scrollIntoView();
        } else if (divRef.current && previousValueRef.current !== "clearing") {
            divRef.current.scrollIntoView();
        } else if (previousValueRef.current === "clearing") {
            previousValueRef.current = "";
        }
    });

    useEffect(() => {
        const messageId = new URLSearchParams(window.location.search).get(
            "messageId"
        );
        if (messageId) {
            setHighlightedMessage(messageId);
            setTimeout(() => {
                previousValueRef.current = "clearing";
                setHighlightedMessage(undefined);
            }, 3000)
        }
    }, [])

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

    const chatTitle = store.selectedChat ? store.selectedChat.name : "New Chat";
    const selectedChatMessages = store.selectedChat ? store.chatMessageById[store.selectedChat.id] : undefined;
    const [shareChatDialogue, setShareChatDialogue] = useState(false);
    const showChatList = !!React.useMemo(() => {
        return store.chats.pinnedChats.length || store.chats.chatsByDate.find(group => group.chats.length);
    }, [store.chats]) || store.newChatState;

    if ([LoadingState.INProgress, LoadingState.NS].includes(store.fetchChatsS)) {
        return <Loader />;
    }

    return <ChatListMessageLayout
        hideSidePanel={!showChatList}
        header={
            <HeaderComponent onClick={() => {
                if (!store.newChatState) {
                    history.push({
                        pathname: "/chats/list/newChat"
                    });
                    store.setSelectedChat(store.newChatMock);
                }
            }}
            />}
    >
        {
            (showChatList) ?
                <ChatList
                    chatGroups={store.chats.chatsByDate}
                    pinnedChats={store.chats.pinnedChats}
                    editChatName={store.editChatName}
                    deleteChat={async (id) => await store.deleteChat(id) && store.setSelectedChat(undefined)}
                    onSelectChat={(chat) => {
                        store.setSelectedChat(chat);
                        store.setIsMessageLoading(false);
                        divRef.current?.scrollIntoView();
                        return true
                    }}
                    selectedChat={store.selectedChat}
                    key={"chatList"}
                /> : null}
        {showChatList ? <ChatListMessageLayout.MessagesSection>
            <ChatListMessageLayout.MessageTitle>
                <ChatListMessageLayout.MessageTitleWithShare>
                    {chatTitle}
                    {
                        store.selectedChat && <Icon>
                            {store.selectedChat.isPinned && <ChatPinnedActive onClick={() => store.selectedChat && store.unPinChat(store.selectedChat.id)} />}
                            {!store.selectedChat.isPinned && <ChatPinned onClick={() => {
                                if (store.selectedChat) {
                                    store.pinChat(store.selectedChat.id)
                                }
                            }} />}
                        </Icon>
                    }

                </ChatListMessageLayout.MessageTitleWithShare>
                {
                    store.selectedChat && <ChatListMessageLayout.ShareChatIcon onClick={() => { setShareChatDialogue(true) }} />
                }
            </ChatListMessageLayout.MessageTitle>

            {shareChatDialogue && store.selectedChat && selectedChatMessages ?
                <ShareChatDialogue chat={store.selectedChat} chatMessage={selectedChatMessages} setShareChatDialogue={setShareChatDialogue} />
                : null
            }

            <MessageList ref={messageListRef} onScroll={() => {
                checkIfElementIsInView();
            }}>
                {
                    selectedChatMessages && selectedChatMessages.messages.map((message, index) => {
                        const piiToEntityMap = message.piiToEntityTypeMap || {}
                        const piiToEntityMapData = Object.keys(piiToEntityMap).map((item) => ({ key: item, label: piiToEntityMap[item] }))
                        const maskedMessage = getMaskedHtmlMessage({ message: message.message, piiToEntityMapData: piiToEntityMapData, isUser: message.type === MessageType.USER_INPUT })

                        const htmlMessage = { __html: getHtmlMessage(maskedMessage) };
                        if (message.type === MessageType.USER_INPUT) {
                            return <UserMessage
                                key={message.id}
                                messageRef={messageRef}
                                highlightedMessage={highlightedMessage}
                                message={message}
                                store={store}
                                maskedMessage={maskedMessage}
                            />
                        } else {
                            return <SystemMessage
                                key={message.id}
                                className={highlightedMessage === message.id ? "highlight" : ""}
                                messageRef={highlightedMessage === message.id ? messageRef : undefined}
                                messageAction={
                                    <MessageAction>
                                        <MessageActionIcon onClick={() => copyToClipboard(maskedMessage)}><CopyIcon title="Copy" /></MessageActionIcon>
                                        {
                                            message.isBookmarked ?
                                                <MessageActionIcon><BookmarkActive title="Remove Bookmark" onClick={() => store.selectedChat && store.removeBookmarkMessage(store.selectedChat.id, message.id)} /></MessageActionIcon> :
                                                <MessageActionIcon><BookmarkIcon title="Bookmark" onClick={() => store.selectedChat && store.bookmarkMessage(store.selectedChat.id, message.id)} /></MessageActionIcon>
                                        }
                                        {
                                            (index === selectedChatMessages.messages.length - 1) ?
                                                <MessageActionIcon><RegenerateIcon title="Regenerate Message" onClick={() => store.selectedChat && store.reGenerateMessage(store.selectedChat.id, message.id)} /></MessageActionIcon> :
                                                null
                                        }

                                    </MessageAction>
                                }
                                message={<Pre dangerouslySetInnerHTML={htmlMessage}></Pre>}
                            />
                        }
                    })
                }
                <WhiteLine ref={divRef} />
            </MessageList>
            <BottomContainer>
                <MessageInput
                    isMessageLoading={store.isMessageLoading}
                    onSend={(value) => {
                        if (store.selectedChat && store.selectedChat.id !== store.newChatMock.id) {
                            store.sendMessage(store.selectedChat.id, value);
                        } else {
                            store.setSelectedChat(store.newChatMock)
                            store.newChatMessage(value.trim());
                        }
                        if (isInView) {
                            // divRef.current?.scrollIntoView(); // this is kept intentionally
                            messageRef.current?.scrollIntoView();
                        }
                    }}
                />
            </BottomContainer>
        </ChatListMessageLayout.MessagesSection > : null}
        {!showChatList ? <ChatViewEmptyState
            newChatMessage={store.newChatMessage}
        /> : null}
    </ChatListMessageLayout >
}
