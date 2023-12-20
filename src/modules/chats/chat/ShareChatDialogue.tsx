import { SystemMessage, UserMessage } from "components/ChatListMessageLayout/Message";
import React, { useState } from "react";
import { ChatResponse, Message, MessageType } from "services/chatBackendUIType";
import styled from "styled-components";
import Dialog from "uiLibrary/components/Dialog";
import EditChat from "assets/svg/PencilSimpleLine.svg";
import { ReactComponent as CopyLink } from "assets/svg/copyLink.svg";
import colors from "uiLibrary/colors";
import hljs from "highlight.js";
import { useQuery } from "react-query";
import { ChatMessages } from "./useChatStore";
import Dropdown, { Option } from "./Dropdown";
import { Colors, TextStyles } from "uiLibrary/index";
import { copyToClipboard } from "utils/clipboard";
import { shareChat } from "services/chat";
import { Notification, Button, Dropdown as NativeDropdown, Loader } from "uiLibrary/components";
import { User, getUsersList } from "services/users";
import { getMaskedHtmlMessage } from "./utils";
import { useSafeAuth } from "app/store";

const EditIcon = styled.span`
    background-image: url("${EditChat}");
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    color: ${colors.neutral.p50};
`;

const ShareChatContainer = styled.div`
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;
`

const ShareChat = styled.div`
    display: flex;
    padding: 0 24px;
    flex-direction: column;
    align-items: center;

    border-radius: 12px;
    background: ${colors.white};
    max-height: 500px;
    overflow: auto;
    flex-grow: 1;
    margin-bottom: 10px;
`;

const DialogTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
`;

const DialogTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;

    & div {
        color: ${colors.neutral.p85};
        font-feature-settings: 'salt' on;

        ${TextStyles.HeadlineH200Semibold};
    }
`;

const Notice = styled.div`
    ${TextStyles.HeadlineH500Regular};
    color: ${colors.neutral.p70};

    align-self: stretch;
    margin-bottom: 24px;
`;

const ShareChatBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid ${colors.neutral.p30};
    flex-grow: 1;
    overflow: auto;
`;

const ChatTitle = styled.div`
    display: flex;
    padding: 8px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
`;

const ShareChatMessages = styled.div`
    overflow-y: auto;
    width: 100%;
`;

const MessageBoxContainer = styled.div`
    width: 100%;
`;

const SUserMessage = styled(UserMessage)`
    padding: 12px;
`;

export const SSystemMessage = styled(SystemMessage)`
    padding: 12px;
`;

const ShareChatPeople = styled.div`
    display: flex;
    margin: 24px 0;
    width: 100%;
    padding: 0px 24px;
`;

const ButtonHolder = styled.div`
    width: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
`;

const AddPeople = styled.textarea`
    display: flex;
    height: 72px;
    padding: 12px;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    margin-right: 16px;
    width: 388px;

    border-radius: 8px;
    border: 1px solid ${colors.neutral.p30};
    background: ${colors.white};

    box-shadow: 0px 2px 6px 0px rgba(104, 115, 125, 0.05);
`;

const ChatDate = styled.div`
    color: ${colors.neutral.p85};
    ${TextStyles.TextT300Regular};
`;

const DialogFooter = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    padding: 24px;
    justify-content: space-between;

    border-radius: 0px 0px 8px 8px;
    border-top: 1px solid ${Colors.neutral.p40};
    background: ${Colors.neutral.p5};
    flex-grow: 0;
`;

const CopyButton = styled.button`
    display: flex;
    padding: 2px 10px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 6px;
    border: 1px solid ${Colors.neutral.p30};
    background: ${Colors.white};
    cursor: pointer;
`;

// const PrimaryButton = styled.button`
//     display: flex;
//     padding: 8px 12px;
//     justify-content: center;
//     align-items: center;
//     gap: 6px;
//     flex: 1 0 0;
//     cursor: pointer;
//     height: 30px;

//     border-radius: 6px;
//     background: ${colors.purple.p50};

//     /* Small Drop Shadow */
//     box-shadow: 0px 2px 3px -2px rgba(16, 24, 40, 0.06);

//     color: ${colors.white};
//     ${TextStyles.TextT200Semibold};
// `;

const Pre = styled.pre`
    text-wrap: wrap;

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

const fetcher = async (): Promise<{ key: string, label: string }[]> => {
    const response = await getUsersList();
    if (response.ok) {
        return response.data.map(user => ({
            key: user.id,
            label: `${user.firstName} ${user.lastName} - ${user.email}`
        }))
    }
    throw new Error(response.error.msg);
};

export default ({
    chat,
    chatMessage,
    setShareChatDialogue
}: {
    chat: ChatResponse,
    chatMessage: ChatMessages,
    setShareChatDialogue: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
    const { user: { firstName } } = useSafeAuth()
    const [selectedUser, setSelectedUser] = useState<{ key: string, label: string }[]>([]);
    const {
        data: users,
        isLoading,
        isError
    } = useQuery("users", async () => fetcher(), {
        refetchOnMount: true,
        retry: true,
        retryDelay: 10000
    });

    const OPTIONS: Option[] = [{
        id: 1,
        title: "Anyone with the link",
        message: "All employees from your organisation with the link can access this chat",
        isSelected: true,
        onClick: () => { }
    }, {
        id: 2,
        title: "Only people invited",
        message: "Only people & groups that you have sent an invite to the chat can access this chat",
        onClick: () => { }
    }];
    const [selectedOption, setSelectedOption] = useState(OPTIONS[1]);

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


    return <Dialog
        padding="0"
        height="508px"
        enableCloseShortcuts={true}
        onClose={() => {
            setShareChatDialogue(false)
        }}
    >
        {
            isLoading ? <Loader /> : <ShareChatContainer>
                <ShareChat>
                    <DialogTitleContainer>
                        <DialogTitle>
                            <div>Share Chat</div>
                        </DialogTitle>
                        <Notice>
                            Messages you send later in this chat won't be shared.
                        </Notice>
                    </DialogTitleContainer>

                    <ShareChatBox>
                        <ChatTitle>
                            {chat.name}
                            {/* <EditIcon /> */}
                            <ChatDate>
                                {chat.modifiedAt && (new Date(chat.modifiedAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }))}
                            </ChatDate>
                        </ChatTitle>

                        <ShareChatMessages>
                            <MessageBoxContainer>
                                {chatMessage.messages.map((message: Message) => { // Message
                                    const piiToEntityMap = message.piiToEntityTypeMap || {}
                                    const piiToEntityMapData = Object.keys(piiToEntityMap).map((item) => ({ key: item, label: piiToEntityMap[item] }))
                                    const maskedMessage = getMaskedHtmlMessage({ noHighlight: true, message: message.message, piiToEntityMapData: piiToEntityMapData, isUser: message.type === MessageType.USER_INPUT })

                                    return message.type === MessageType.USER_INPUT ?
                                        <SUserMessage
                                            userInitial={firstName[0]}
                                            messageAction={<></>}
                                            message={<Pre dangerouslySetInnerHTML={{ __html: getHtmlMessage(message.message) }} ></Pre>}
                                        />
                                        :
                                        <SSystemMessage
                                            messageAction={<></>}
                                            message={<Pre dangerouslySetInnerHTML={{ __html: getHtmlMessage(maskedMessage) }} ></Pre>}
                                        />
                                })}
                            </MessageBoxContainer>
                        </ShareChatMessages>
                    </ShareChatBox>
                </ShareChat>
                {
                    selectedOption.id === 2 && <ShareChatPeople>
                        <NativeDropdown
                            onChange={(val) => {
                                setSelectedUser(val);
                            }}
                            list={users || []}
                            multiSelect
                            label="Add People and Groups"
                            value={selectedUser}
                            placeholder="Add Users"
                        />
                        <ButtonHolder><Button.Medium
                            label={"Share"}
                            onClick={async () => {
                                if (selectedUser.length === 0) {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "No employee is selected. Please selected atleast one employee."
                                    });
                                    return;
                                }
                                const response = await shareChat(chat.id, chat.name, selectedUser.map(user => user.key));
                                if (response.ok) {
                                    Notification.createNotification({
                                        type: "Success",
                                        subHeading: "Shared Chat Succesfully to selected employees."
                                    });
                                } else {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "Failed to Share Chat. Please try again"
                                    });
                                }
                            }}

                        /></ButtonHolder>
                    </ShareChatPeople>
                }
                <DialogFooter>
                    <Dropdown
                        options={OPTIONS}
                        selectedOption={selectedOption}
                        setSelectedOption={async (value) => {
                            setSelectedOption(value);
                            if (value.id === 1) {
                                const response = await shareChat(chat.id, chat.name, []);
                                if (response.ok) {
                                    Notification.createNotification({
                                        type: "Success",
                                        subHeading: "Chat Shared with everyone. You can copy link and share with other employees. We don't send email when chat is shared with everyone."
                                    });
                                } else {
                                    Notification.createNotification({
                                        type: "Error",
                                        subHeading: "Failed to Share Chat. Please try again"
                                    });
                                }
                            }
                        }}
                    ></Dropdown>

                    <CopyButton onClick={() => copyToClipboard(`${window.location.href}`)}>
                        {<CopyLink />}
                        Copy Link
                    </CopyButton>
                </DialogFooter>
            </ShareChatContainer>
        }

    </Dialog>
}
