import React, { useState } from "react"

import styled from "styled-components";
import MessageInput from "components/ChatListMessageLayout/MessageInput";
import { ReactComponent as ChatSendDefault } from "assets/svg/chatSendDefault.svg";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";

const BottomContainer = styled.div`
    position: absolute;
    width: 100%;
    bottom: 20px;
    padding: 24px 68px 0px;
    left: 0;
`
const Container = styled.div`
    width: 100%;
    height: calc(100% - 96px);
    padding: 32px 68px;
`;

const GuideContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: center;
`;

const AboutPrivadoChat = styled.div`
    flex: 1;
`;

const Prompts = styled.div`
    flex: 1;
    gap: 10px;
    display: flex;
    flex-direction: column;
`;

const Heading = styled.div`
    ${TextStyles.HeadlineH200Regular};
    color: ${Colors.neutral.p90};
    margin-bottom: 24px;
`;

const SubHeading = styled.div`
    ${TextStyles.HeadlineH400Semibold};
    color: ${Colors.neutral.p90};
`;

const Content = styled.div`
    ${TextStyles.TextT100Regular};
    color: ${Colors.neutral.p90};
    margin-bottom: 16px;
`;

const Prompt = styled.div`
    width: 100%;
    padding: 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    border-radius: 8px;
    background: ${Colors.neutral.p10};
    & > div {
        ${TextStyles.TextT100Regular};
    }
`;

const SendIconContainer = styled.div`
    flex: 0 0 35px;
`

const PromptsText = [
    "Explain the difference between git and github in software development context",
    "How to increase overall work output and productivity",
    "What are the various console outputs in python language?"
];

export default ({
    newChatMessage
}: {
    newChatMessage: (a: string) => Promise<void>
}) => {
    const [value, setValue] = useState("");

    return <Container>
        <GuideContainer>
            <AboutPrivadoChat>
                <Heading>Get Started with MuroChat</Heading>
                <SubHeading>📈 Enhance your productivity</SubHeading>
                <Content>A co-pilot that will help you in your workflow with its intelligent responses</Content>
                <SubHeading>⚡️ Leverage the power</SubHeading>
                <Content>Top large language models that work the best for your use case</Content>
                <SubHeading>🔒 Ensure secure exchange</SubHeading>
                <Content>Secure exchange of information with generative AI and contributing to the overall security of the company</Content>
            </AboutPrivadoChat>
            <Prompts>
                {PromptsText.map(promptText => {
                    return <Prompt key={promptText} onClick={() => {
                        setValue(promptText);
                        newChatMessage(promptText)
                    }}>
                        <div>{promptText}</div>
                        <SendIconContainer><ChatSendDefault /></SendIconContainer>
                    </Prompt>
                })}
            </Prompts>
        </GuideContainer>
        <BottomContainer>
            <MessageInput
                value={value}
                onSend={(value) => {
                    newChatMessage(value.trim())
                }}
            />
        </BottomContainer>
    </Container>
}