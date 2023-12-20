import React, { ReactNode, useEffect, useState } from "react"
import { MessageAction, UserMessage, Icon as MessageActionIcon, EditIcon, CopyIcon, BookmarkIcon } from "components/ChatListMessageLayout/Message"
import { ReactComponent as BookmarkActive } from "assets/svg/bookmarkActive.svg";
import { copyToClipboard } from "utils/clipboard"
import { UseStore } from "./useChatStore";
import { ChatMessage } from "./useChatStore";
import styled from "styled-components";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import { Button } from "uiLibrary/components";
import { useSafeAuth } from "app/store";

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex: 1 0 0;
`;

const Pre = styled.pre`
    text-wrap:wrap;
    ${TextStyles.HeadlineH500Regular}
    & span.redact-content {
        ${TextStyles.TextT100Semibold}
        color: ${Colors.purple.p50};
    }
`;


const BottonHolder = styled.div`
    display: flex;
    gap: 10px;
`;

const Textarea = styled.textarea`
    ${TextStyles.TextT100Regular};
    resize: none;
    width: 100%;
    outline: none;
    border: none;
    border-radius: 8px;
    border: 1px solid ${Colors.neutral.p40};
    background:  ${Colors.white};
    box-shadow: 0px 2px 6px 0px rgba(104, 115, 125, 0.05);
    padding: 12px 12px 12px 16px;
`;


const EditMessage = ({
    onCancel,
    onSubmit,
    message
}: {
    onSubmit: (a: string) => void
    onCancel: () => void,
    message: string
}) => {
    const [state, setState] = React.useState(message);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(e.target.value);
        // Adjust the textarea's height to fit the content
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !!state.trim()) {
            e.preventDefault(); // Prevent adding a new line
            onSubmit(state);
            setState(""); // Clear the textarea
        }
    };

    return <InputContainer>
        <Textarea
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            value={state}
            placeholder={"Enter a message"}
        />
        <BottonHolder>
            <Button.Medium
                tertiary
                label="Cancel"
                onClick={onCancel}
            />
            <Button.Medium
                label="Submit"
                onClick={() => {
                    onSubmit(state)
                }}
            />

        </BottonHolder>
    </InputContainer>
}

export default ({ message, highlightedMessage, messageRef, store, maskedMessage }: {
    store: UseStore;
    highlightedMessage: string | undefined;
    messageRef: React.RefObject<HTMLDivElement>,
    message: ChatMessage,
    maskedMessage: string
}) => {
    const { user: { firstName } } = useSafeAuth()
    const [isEditMode, setEditMode] = useState(false);
    const piiToEntityMap = message.piiToEntityTypeMap || {}
    const piiToEntityMapData = Object.keys(piiToEntityMap).map((item) => ({ key: item, label: piiToEntityMap[item] }))

    return <UserMessage
        piiToEntityMappedData={piiToEntityMapData}
        messageRef={highlightedMessage === message.id ? messageRef : undefined}
        className={highlightedMessage === message.id ? "highlight" : ""}
        userInitial={firstName[0]}
        messageContent={isEditMode ? <EditMessage
            onCancel={() => setEditMode(false)}
            message={message.message}
            onSubmit={(a) => {
                if (store.selectedChat && store.selectedChat.id) {
                    store.editMessage(
                        store.selectedChat.id,
                        a,
                        message.id
                    )
                }
            }}
        /> : null}
        messageAction={<MessageAction>
            <MessageActionIcon onClick={() => copyToClipboard(message.message)}><CopyIcon title="Copy" /></MessageActionIcon>
            <MessageActionIcon onClick={() => setEditMode(true)}><EditIcon title="Edit" /></MessageActionIcon>
            {
                message.isBookmarked ?
                    <MessageActionIcon><BookmarkActive title="Remove Bookmark" onClick={() => store.selectedChat && store.removeBookmarkMessage(store.selectedChat.id, message.id)} /></MessageActionIcon> :
                    <MessageActionIcon><BookmarkIcon title="Bookmark" onClick={() => store.selectedChat && store.bookmarkMessage(store.selectedChat.id, message.id)} /></MessageActionIcon>
            }
        </MessageAction>}
        message={<Pre dangerouslySetInnerHTML={{ __html: maskedMessage }} ></Pre>}
    />
}