import React from "react";
import ChatListMessageLayout from "components/ChatListMessageLayout";
import { ChatResponse, SharedChatItem } from "services/chatBackendUIType";
import { ReactComponent as EditIcon } from "assets/svg/PencilSimpleLine.svg";
import { ReactComponent as TrashIcon } from "assets/svg/Trash.svg";
import styled from "styled-components";

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

export default ({
    chatIdsSharedByUser,
    chatIdsSharedWithUser,
    selectedChat,
    deleteChat,
    onSelectChat
}: {
    onSelectChat: (id: SharedChatItem) => void,
    deleteChat: (id: SharedChatItem, selfRemove: boolean) => void,
    selectedChat?: SharedChatItem,
    chatIdsSharedByUser: SharedChatItem[],
    chatIdsSharedWithUser: SharedChatItem[]
}) => {
    const ChatItemAction = ({ id, selfRemove }: { id: string, selfRemove: boolean }) => <ChatListMessageLayout.SelectedChatRightOverlayIcons>
        <ChatListMessageLayout.OverlayIcons><TrashIcon onClick={async () => {
            if (selectedChat) {
                deleteChat(selectedChat, selfRemove)
            }
        }} /></ChatListMessageLayout.OverlayIcons>
    </ChatListMessageLayout.SelectedChatRightOverlayIcons>;

    return (
        <>
            <ChatListMessageLayout.SidePanelChatGroupsDivider />
            <ListContainer>
                {chatIdsSharedWithUser.length ? <><Groups title="Shared with me">
                    {chatIdsSharedWithUser.map(chat => {
                        return <ChatListMessageLayout.ChatItemSaredToMe
                            onClick={() => {
                                onSelectChat(chat);
                            }}
                            key={chat.id}
                            isSelected={selectedChat && selectedChat.id === chat.id}
                        >
                            {chat.name}
                            {selectedChat && selectedChat.id === chat.id ? <ChatItemAction id={chat.id} selfRemove /> : null}
                        </ChatListMessageLayout.ChatItemSaredToMe>
                    })}
                </Groups> <ChatListMessageLayout.SidePanelChatGroupsDivider /></> : null}
                {/*  */}
                <ScrollableList>
                    {chatIdsSharedByUser.length ? <ChatListMessageLayout.Groups title={"Shared by me"}>
                        {chatIdsSharedByUser.map(chat => {
                            return <ChatListMessageLayout.ChatItemSaredWithOthers
                                key={chat.id}
                                onClick={() => {
                                    onSelectChat(chat);
                                }}
                                isSelected={selectedChat && selectedChat.id === chat.id}
                            >
                                {chat.name}
                                {selectedChat && selectedChat.id === chat.id ? <ChatItemAction selfRemove={false} id={chat.id} /> : null}
                            </ChatListMessageLayout.ChatItemSaredWithOthers>
                        })}
                    </ChatListMessageLayout.Groups> : null}
                </ScrollableList>

            </ListContainer>
        </>
    );
};
