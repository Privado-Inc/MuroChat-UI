import React, { useEffect } from "react";
import styled from "styled-components";
import { Colors } from "uiLibrary/index";
import TextStyles from "uiLibrary/textStyles";
// import { ReactComponent as DeleteChat } from "assets/svg/Trash.svg";
// import { ReactComponent as EditChat } from "assets/svg/PencilSimpleLine.svg";
import { ReactComponent as ChatSendActive } from "assets/svg/chatSendActive.svg";
import { ReactComponent as ChatSendDefault } from "assets/svg/chatSendDefault.svg";
import { ReactComponent as ChatSendBlocked } from "assets/svg/regenerateActive.svg";

const InputContainer = styled.span`
    margin-top: 24px;
    display: block;
    background-color: ${Colors.white};
    box-shadow: 0px 2px 6px 0px rgba(104, 115, 125, 0.05);
    border-radius: 12px;
    border: 1px solid ${Colors.neutral.p30};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    flex: 1;
`;

const Textarea = styled.textarea`
    ${TextStyles.TextT100Regular};
    resize: none;
    width: 100%;
    outline: none;
    border: none;
`;

const SendIconContainer = styled.div`
    flex: 0 0 35px;
`;

type Props = {
    isMessageLoading?: boolean;
    onSend: (a: string) => void;
    value?: string;
};

const MessageInput = ({ isMessageLoading = false, onSend, value }: Props) => {
    const [state, setState] = React.useState("");
    const textAreaBox = React.createRef<HTMLTextAreaElement>();

    const adjustTextArea = () => {
        if (textAreaBox.current) {
            textAreaBox.current.style.maxHeight = "500px";
            textAreaBox.current.style.height = "36px";
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(e.target.value);
        // Adjust the textarea's height to fit the content
        e.target.style.maxHeight = "500px";
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isMessageLoading) return;
        if (e.key === "Enter" && !e.shiftKey && !!state.trim()) {
            e.preventDefault(); // Prevent adding a new line
            onSend(state.trim());
            setState(""); // Clear the textarea
            adjustTextArea();
        }
    };

    useEffect(() => {
        if (value !== undefined) {
            setState(value);
        }
    }, [value]);

    let sendButton = (
        <ChatSendActive
            onClick={() => {
                if (!state.trim() || isMessageLoading) return;

                onSend(state.trim());
                setState(""); // Clear the textarea
                adjustTextArea();
            }}
        />
    );
    if (!state.trim()) {
        sendButton = <ChatSendDefault />;
    }

    if (isMessageLoading) {
        sendButton = <ChatSendBlocked />;
    }

    return (
        <InputContainer>
            <Textarea
                ref={textAreaBox}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                value={state}
                placeholder={"Enter a message"}
            />
            <SendIconContainer>{sendButton}</SendIconContainer>
        </InputContainer>
    );
};

export default MessageInput;
