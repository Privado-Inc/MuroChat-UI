import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { Colors, TextStyles } from "uiLibrary/index";
import { Tooltip as ReactTooltip } from "react-tooltip";

// import { ReactComponent as DeleteChat } from "assets/svg/Trash.svg";
// import { ReactComponent as EditChat } from "assets/svg/PencilSimpleLine.svg";
import RegenerateDefault from "assets/svg/regenerateDefault.svg";
import RegenerateHover from "assets/svg/regenerateHover.svg";
import EditDefault from "assets/svg/editDefault.svg";
import EditHover from "assets/svg/editHover.svg";
import CopyDefault from "assets/svg/copyDefault.svg";
import { ReactComponent as CopyActive } from "assets/svg/copyActive.svg";
import CopyHover from "assets/svg/copyHover.svg";
import BookmarkHover from "assets/svg/bookmarkHover.svg";
import BookmarkActive from "assets/svg/bookmarkActive.svg";
import BookmarkDefault from "assets/svg/bookmarkDefault.svg";
import { ReactComponent as Lightning } from "assets/svg/lightning.svg";
import { ReactComponent as ProfilePrivado } from "assets/svg/profilePrivado.svg";

const MessageStyle = styled.div<{ background?: boolean }>`
    display: flex;
    align-items: flex-start;
    gap: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 68px;
    ${({ background }: { background?: boolean }) => (background ? `background: ${Colors.neutral.p5}` : "")};
`;
const ProfilePic = styled.span`
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    border-radius: 2px;
`;

const UserProfile = styled.span`
    background: ${Colors.yellow.p4};
    color: ${Colors.white};
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
`;

const MessageContent = styled.span`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Message = styled.span`
    ${TextStyles.HeadlineH500Regular}
    color: ${Colors.neutral.p90};
`;

const TooltipContent = styled.div`
    display: flex;
    max-width: 318px;
    align-items: center;
`;
const TooltipText = styled.div`
    ${TextStyles.TextT300Regular};
    color: ${Colors.neutral.p90};
    width: calc(100% - 26px);
`;
const BoldText = styled.span`
    ${TextStyles.TextT300Semibold};
    color: ${Colors.neutral.p90};
`;
const StyledLightning = styled(Lightning)`
    margin-right: 6px;
`;

const Tooltip = styled(ReactTooltip)`
    border-radius: 6px;
    background-color: ${Colors.purple.p20};
    padding: 8px 14px 8px 10px;
    z-index: 3;
`;

export const MessageAction = styled.span`
    display: flex;
    gap: 12px;
`;

export const GoToChatIcon = styled.span`
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 0 0 26px;
    & > span {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
    & * {
        cursor: pointer;
    }
    width: 30px;
    border-radius: 23px;
    border: 1px solid ${Colors.neutral.p50};
`;

export const Icon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    display: flex;
    flex: 0 0 26px;
    & > span {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
    & * {
        cursor: pointer;
    }
`;

export const CopyIcon = styled.span`
    background-image: url("${CopyDefault}");
    background-repeat: no-repeat;
    &:hover {
        background-image: url("${CopyHover}");
    }
`;

export const EditIcon = styled.span`
    background-image: url("${EditDefault}");
    background-repeat: no-repeat;
    &:hover {
        background-image: url("${EditHover}");
    }
`;

export const BookmarkIcon = styled.span`
    background-image: url("${BookmarkDefault}");
    background-repeat: no-repeat;
    &:hover {
        background-image: url("${BookmarkHover}");
    }

    &.selected {
        background-image: url("${BookmarkActive}");
    }
`;

export const RegenerateIcon = styled.span`
    background-image: url("${RegenerateDefault}");
    background-repeat: no-repeat;
    &:hover {
        background-image: url("${RegenerateHover}");
    }
`;

export const UserMessage = ({
    messageAction = null,
    userInitial,
    messageRef,
    message,
    className = "",
    chatId = "",
    messageContent = null,
    piiToEntityMappedData
}: {
    chatId?: string;
    messageAction?: ReactNode;
    userInitial: string;
    messageRef?: React.RefObject<HTMLDivElement>;
    className?: string;
    piiToEntityMappedData?: { key: string; label: string }[];
    message: ReactNode;
    messageContent?: ReactNode;
}) => {
    return (
        <MessageStyle className={className} ref={messageRef}>
            <ProfilePic>
                <UserProfile>{userInitial}</UserProfile>
            </ProfilePic>
            {!messageContent ? (
                <MessageContent>
                    <Message>{message}</Message>
                    {messageAction}
                </MessageContent>
            ) : (
                messageContent
            )}
            {piiToEntityMappedData?.length
                ? piiToEntityMappedData.map((item) => (
                    <Tooltip
                        delayShow={200}
                        id={`tooltip-${item.key}`}
                        key={`tooltip-${item.key}`}
                        place={"top-start" as any}
                    >
                        <TooltipContent>
                            <StyledLightning />
                            <TooltipText>
                                This data was redacted as <BoldText>[{item.label}]</BoldText> prior to its sharing
                                with the LLM API.
                            </TooltipText>
                        </TooltipContent>
                    </Tooltip>
                ))
                : null}
        </MessageStyle>
    );
};

export const SystemMessage = ({
    message,
    className = "",
    messageAction = null,
    messageRef,
    chatId = "",
    piiToEntityMappedData
}: {
    chatId?: string;
    messageRef?: React.RefObject<HTMLDivElement>;
    messageAction?: ReactNode;
    className?: string;
    message: ReactNode;
    piiToEntityMappedData?: { key: string; label: string }[];
}) => {
    return (
        <MessageStyle className={className} background ref={messageRef}>
            <ProfilePic>
                <ProfilePrivado />
            </ProfilePic>
            <MessageContent>
                <Message>{message}</Message>
                {messageAction}
            </MessageContent>
            {piiToEntityMappedData?.length
                ? piiToEntityMappedData.map((item) => (
                    <Tooltip
                        delayShow={200}
                        id={`tooltip-${item.key}`}
                        key={`tooltip-${item.key}`}
                        place={"top-start" as any}
                    >
                        <TooltipContent>
                            <StyledLightning />
                            <TooltipText>
                                This data was redacted as <BoldText>[{item.label}]</BoldText> prior to its sharing
                                with the LLM API.
                            </TooltipText>
                        </TooltipContent>
                    </Tooltip>
                ))
                : null}
        </MessageStyle>
    );
};
