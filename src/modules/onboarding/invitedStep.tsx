import React, { ReactElement, useRef } from "react";
import { ReactComponent as ThreeStars } from "assets/svg/threeStars.svg";
import { ReactComponent as CopyIcon } from "assets/svg/copyIcon.svg";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import { copyToClipboard } from "utils/clipboard";
import { Button, Notification } from "uiLibrary/components";
import styled from "styled-components";
import StepFooter from "components/Onboarding/StepFooter";

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
`;

const BottonHolder = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 16px;
    width: 60%;
    & button {
        padding: 6px 20px;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 12px;
`;

const Heading = styled.div`
    display: flex;
    flex-direction: column;
`;

const SubHeading = styled.div`
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p70};
`;

const ContentHeading = styled.div`
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p90};
`;
const MainHeading = styled.div`
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p100};
`;

const Content = styled.div`
    display: flex;
    width: 550px;
    gap: 10px;
    padding: 10px 24px;
    flex-direction: column;
`;

const InviteText = styled.div`
    background: ${Colors.neutral.p20};
    padding: 10px 12px;
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p80};
`;

const InviteTextContainer = styled.div`
    background: ${Colors.neutral.p20};
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p80};
`;

const Link = styled.a`
    ${TextStyles.TextT200Link};
    color: ${Colors.neutral.p80};
`;

export default ({ goNext, goPrevious }: { goNext: () => void; goPrevious: () => void }): ReactElement => {
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <Container>
            <Header>
                <ThreeStars />
                <Heading>
                    <MainHeading>You’ve completed the onboarding for MuroChat!</MainHeading>
                    <SubHeading>You can now invite your employees to use the chat application.</SubHeading>
                </Heading>
            </Header>
            <Content>
                <ContentHeading>Share an invite message with your employees</ContentHeading>
                <InviteTextContainer>
                    <InviteText ref={divRef}>
                        Hello Team 👋 <br />
                        We are excited to onboard <b>MuroChat</b> for you, a secure chat application leveraging
                        generative AI.
                        <br />
                        <br />
                        You can use this application to:
                        <br />
                        📈 <b>Enhance your productivity</b> with a co-pilot that will help you in your workflow
                        <br />
                        ⚡️ <b>Leverage the power</b> of top large language models that work the best for your use case
                        <br />
                        🔒 <b>Ensure secure exchange</b> of information with generative AI and contribute to the overall
                        security of the company
                        <br />
                        <br />
                        You can login to the application using your Okta credentials via{" "}
                        <Link href="http://localhost:4001/">this link</Link>.<br />
                        If you need assistance with your login, please feel free to contact us.
                        <br />
                    </InviteText>
                </InviteTextContainer>
                <BottonHolder>
                    <Button.Medium
                        addIcon={<CopyIcon />}
                        onClick={async () => {
                            if (divRef.current) {
                                const range = document.createRange();
                                range.selectNode(divRef.current);
                                (window as any).getSelection().removeAllRanges(); // Clear previous selections
                                (window as any).getSelection().addRange(range);

                                try {
                                    document.execCommand("copy");
                                } catch (err) {
                                    console.error("Unale to copy text to clipboard");
                                } finally {
                                    (window as any).getSelection().removeAllRanges(); // Deselect the text
                                }
                            }
                            Notification.createNotification({
                                type: "Success",
                                subHeading: "Successfully Copied"
                            });
                        }}
                        label="Copy Message"
                    />
                </BottonHolder>
            </Content>
            <StepFooter nextLabel="Launch Dashboard" onPrevious={goPrevious} onNext={goNext} />
        </Container>
    );
};
