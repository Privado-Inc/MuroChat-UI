import React, { useEffect, useState } from "react";
import ChatListMessageLayout from "components/ChatListMessageLayout";
import { ChatResponse } from "services/chatBackendUIType";
import { ReactComponent as EditIcon } from "assets/svg/PencilSimpleLine.svg";
import { ReactComponent as TrashIcon } from "assets/svg/Trash.svg";
import { ReactComponent as CheckIcon } from "assets/svg/Check.svg";
import { ReactComponent as CrossIcon } from "assets/svg/EditCross.svg";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";

const ListContainer = styled.div`
    display: flex;
    height: 92%;
    flex-direction: column;
    width: 100%;
`;

const Groups = styled(ChatListMessageLayout.Groups)`
    max-height: 250px;
`;

const ScrollableList = styled.div`
    flex: 1;
    overflow: auto;
`;

const EditNameContainer = styled.div`
    display: flex;
    width: 226px;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
`;

const EditNameBox = styled.input`
    ${TextStyles.TextT100Semibold}; 
    width: 191px;
    height: 24px;
    padding: 8px;
    
    color: ${Colors.white};
    border-radius: 4px;
    border: 1px solid ${Colors.neutral.p70};
    background: ${Colors.neutral.p100};
`;

const EditNameIconBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 4px;
`;

const EditNameComponent = ({
    id,
    chat,
    setEditNameForChat,
    editChatName
}: {
    id: string,
    chat: ChatResponse,
    setEditNameForChat: (a: string) => void,
    editChatName: (a: string, b: string) => Promise<boolean>,
}) => {
    const [updatedName, setUpdatedName] = useState(chat.name);

    return (
        <EditNameContainer>
            <EditNameBox
                type="text"
                onChange={(e) => {
                    setUpdatedName(e.target.value);
                }}
                value={updatedName}
            ></EditNameBox>
            <EditNameIconBox>
                <CheckIcon onClick={async () => {
                    if (chat.name !== updatedName) {
                        const isEdited = await editChatName(id, updatedName);
                        if (isEdited) {
                            chat.name = updatedName;
                        }
                    }
                    setEditNameForChat("");
                }} />
                <CrossIcon onClick={() => {
                    setEditNameForChat("");
                }} />
            </EditNameIconBox>
        </EditNameContainer>
    )
}

export default ({
    chatGroups,
    pinnedChats,
    selectedChat,
    deleteChat,
    editChatName,
    onSelectChat
}: {
    onSelectChat: (id: ChatResponse) => void,
    deleteChat: (id: string) => void,
    editChatName: (id: string, name: string) => Promise<boolean>,
    selectedChat?: ChatResponse,
    pinnedChats: ChatResponse[],
    chatGroups: {
        title: string;
        chats: ChatResponse[]
    }[]
}) => {
    const history = useHistory();
    const [editNameForChat, setEditNameForChat] = useState("");

    useEffect(() => {
        setEditNameForChat("")
    }, [selectedChat])

    const ChatItemAction = ({ id }: { id: string }) => <ChatListMessageLayout.SelectedChatRightOverlayIcons>
        <ChatListMessageLayout.OverlayIcons><EditIcon onClick={() => {
            setEditNameForChat(id);
        }} /></ChatListMessageLayout.OverlayIcons>
        <ChatListMessageLayout.OverlayIcons><TrashIcon onClick={async () => {
            deleteChat(id)
        }} /></ChatListMessageLayout.OverlayIcons>
    </ChatListMessageLayout.SelectedChatRightOverlayIcons>;

    return (
        <>
            <ChatListMessageLayout.SidePanelChatGroupsDivider />
            <ListContainer>
                {pinnedChats.length ? <><Groups title="Pinned Chats">
                    {pinnedChats.map(chat => {
                        return <ChatListMessageLayout.ChatItemPinned
                            key={chat.id}
                            showIcon={editNameForChat !== chat.id}
                            onClick={() => {
                                onSelectChat(chat);
                                history.push({
                                    pathname: `/chats/list/${chat.id}`
                                });
                            }}
                            isSelected={selectedChat && selectedChat.id === chat.id}
                        >
                            {editNameForChat === chat.id ?
                                <EditNameComponent
                                    id={chat.id}
                                    chat={chat}
                                    editChatName={editChatName}
                                    setEditNameForChat={setEditNameForChat}
                                />
                                : chat.name}
                            {selectedChat && selectedChat.id === chat.id && !editNameForChat ? <ChatItemAction id={chat.id} /> : null}
                        </ChatListMessageLayout.ChatItemPinned>
                    })}
                </Groups> <ChatListMessageLayout.SidePanelChatGroupsDivider /></> : null}
                {/*  */}
                <ScrollableList>
                    {chatGroups.map(chatGroup => {
                        return <ChatListMessageLayout.Groups key={chatGroup.title} title={chatGroup.chats.length ? chatGroup.title : ""}>
                            {chatGroup.chats.map(chat => {
                                return <ChatListMessageLayout.ChatItem
                                    key={chat.id}
                                    onClick={() => {
                                        onSelectChat(chat);
                                        history.push({
                                            pathname: `/chats/list/${chat.id}`
                                        });
                                    }}
                                    isSelected={selectedChat && selectedChat.id === chat.id}
                                    showIcon={editNameForChat !== chat.id}
                                >
                                    {editNameForChat === chat.id ?
                                        <EditNameComponent
                                            id={chat.id}
                                            chat={chat}
                                            editChatName={editChatName}
                                            setEditNameForChat={setEditNameForChat}
                                        />
                                        : chat.name}
                                    {selectedChat && selectedChat.id === chat.id && !editNameForChat ? <ChatItemAction id={chat.id} /> : null}
                                </ChatListMessageLayout.ChatItem>
                            })}
                        </ChatListMessageLayout.Groups>
                    })}
                </ScrollableList>

            </ListContainer>
        </>
    );
};
