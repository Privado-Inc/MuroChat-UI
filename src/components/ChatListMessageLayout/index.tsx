import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { ReactComponent as ChatPinned } from "assets/svg/chatPinned.svg";
import { ReactComponent as SharedWithMe } from "assets/svg/sharedWithMe.svg";
import { ReactComponent as SharedWithOthers } from "assets/svg/SharedWithOthers.svg";
import { ReactComponent as ChatPinnedActive } from "assets/svg/pinnedActive.svg";
import { ReactComponent as Chat } from "assets/svg/chat.svg";
import ShareChat from "assets/svg/shareChat.svg";
import TextStyles from "uiLibrary/textStyles";
import colors from "uiLibrary/colors";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const MessagesSection = styled.div`
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
`;

const SidePanel = styled.div`
    display: flex;
    flex: 0 0 264px;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    align-self: stretch;
    background: ${colors.neutral.p100};
`;

const SidePanelHeaderSection = styled.div`
    ${TextStyles.TextT100Semibold};
    display: flex;
    padding: 4px 8px 0px 8px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    height: 36px;
    color: ${colors.white};
`;

const SidePanelChatItem = styled.div<{ isSelected?: boolean }>`
    display: flex;
    padding: 6px 8px 6px 6px;
    align-items: center;
    width: 100%;
    gap: 8px;
    margin-top: 4px;
    border-radius: 6px;
    background: ${({ isSelected }) => (isSelected ? colors.neutral.p90 : colors.neutral.p100)};
    color: ${colors.white};
    position: relative;
    cursor: pointer;
`;

const SidePanelChatItemsHeader = styled.div`
    ${TextStyles.TextT300Semibold};
    display: flex;
    padding: 0px 8px 4px 8px;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    color: ${colors.white};
`;

const SidePanelChatItemsTitle = styled.div`
    ${TextStyles.TextT300Regular};
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    align-self: stretch;
    color: ${colors.white};
`;

const Icon = styled.span`
    width: 24px;
    height: 24px;
    display: flex;
    flex: 0 0 24px;
    align-items: center;
    justify-content: center;
`;

const OverlayIcons = styled.span`
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SidePanelSelectedChatRightOverlayIcons = styled.div`
    display: inline-flex;
    padding: 8px 0px 8px 24px;
    align-items: flex-start;
    gap: 4px;
    /* background: linear-gradient(270deg, #2A3448 65.79%, rgba(42, 52, 72, 0.00) 100%); */
    position: absolute;
    right: 12px;
`;

const SidePanelChatGroups = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
    overflow: auto;
    margin-top: 10px;
`;

const SidePanelChatGroupsDivider = styled.div`
    width: 100%;
    height: 2px;
    margin: 20px 0px;
    background: ${colors.neutral.p60};
`;

const MessageTitle = styled.div`
    width: 100%;
    height: 64px;
    padding: 22px 68px 21px 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid ${colors.neutral.p30};
`;
const MessageTitleWithShare = styled.div`
    width: 90%;
    text-align: center;
    display: flex;
    justify-content: center;
`;
const ShareChatIcon = styled.div`
    background-image: url("${ShareChat}");
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

const ChatListMessageLayout = ({
    children,
    header,
    hideSidePanel = false
}: {
    children: ReactNode;
    header: ReactNode;
    hideSidePanel?: boolean;
}): ReactElement => {
    if (hideSidePanel) return <Container>{children}</Container>;

    let messageContainer = null;
    const restChildrens: ReactNode[] = [];

    React.Children.forEach(children, (child) => {
        // Check if the child is a specific React component
        if (React.isValidElement(child) && child.type === MessagesSection) {
            messageContainer = child;
        } else {
            restChildrens.push(child);
        }
    });

    return (
        <Container>
            <SidePanel>
                <SidePanelHeaderSection>{header}</SidePanelHeaderSection>
                {restChildrens}
            </SidePanel>
            {messageContainer}
        </Container>
    );
};

ChatListMessageLayout.Groups = ({
    children,
    title,
    className = ""
}: {
    children: ReactNode;
    title: string;
    className?: string;
}) => {
    return (
        <SidePanelChatGroups className={className}>
            {title ? <SidePanelChatItemsHeader>{title}</SidePanelChatItemsHeader> : null}
            {children}
        </SidePanelChatGroups>
    );
};

ChatListMessageLayout.ChatItem = ({
    children,
    isSelected = false,
    showIcon = true,
    onClick
}: {
    children: ReactNode;
    isSelected?: boolean;
    showIcon?: boolean;
    onClick: () => void;
}) => {
    return (
        <SidePanelChatItem isSelected={isSelected} onClick={onClick}>
            {showIcon && (
                <Icon>
                    <Chat />
                </Icon>
            )}
            <SidePanelChatItemsTitle>{children}</SidePanelChatItemsTitle>
        </SidePanelChatItem>
    );
};

ChatListMessageLayout.ChatItemPinned = ({
    children,
    isSelected = false,
    showIcon = true,
    onClick
}: {
    children: ReactNode;
    isSelected?: boolean;
    showIcon?: boolean;
    onClick: () => void;
}) => {
    return (
        <SidePanelChatItem isSelected={isSelected} onClick={onClick}>
            {showIcon && (
                <Icon>
                    <ChatPinned />
                </Icon>
            )}
            <SidePanelChatItemsTitle>{children}</SidePanelChatItemsTitle>
        </SidePanelChatItem>
    );
};

ChatListMessageLayout.ChatItemSaredToMe = ({
    children,
    isSelected = false,
    onClick
}: {
    children: ReactNode;
    isSelected?: boolean;
    onClick: () => void;
}) => {
    return (
        <SidePanelChatItem isSelected={isSelected} onClick={onClick}>
            <Icon>
                <SharedWithMe />
            </Icon>
            <SidePanelChatItemsTitle>{children}</SidePanelChatItemsTitle>
        </SidePanelChatItem>
    );
};

ChatListMessageLayout.ChatItemSaredWithOthers = ({
    children,
    isSelected = false,
    onClick
}: {
    children: ReactNode;
    isSelected?: boolean;
    onClick: () => void;
}) => {
    return (
        <SidePanelChatItem isSelected={isSelected} onClick={onClick}>
            <Icon>
                <SharedWithOthers />
            </Icon>
            <SidePanelChatItemsTitle>{children}</SidePanelChatItemsTitle>
        </SidePanelChatItem>
    );
};

ChatListMessageLayout.SidePanelChatGroupsDivider = SidePanelChatGroupsDivider;
ChatListMessageLayout.SelectedChatRightOverlayIcons = SidePanelSelectedChatRightOverlayIcons;
ChatListMessageLayout.OverlayIcons = OverlayIcons;
ChatListMessageLayout.MessagesSection = MessagesSection;
ChatListMessageLayout.MessageTitle = MessageTitle;
ChatListMessageLayout.MessageTitleWithShare = MessageTitleWithShare;
ChatListMessageLayout.ShareChatIcon = ShareChatIcon;

export default ChatListMessageLayout;
