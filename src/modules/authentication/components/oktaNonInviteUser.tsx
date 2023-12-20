import React, { ReactElement } from "react";
import styled from "styled-components";
import Lock from "assets/svg/lock.svg";
import {
    Label
} from "uiLibrary/components";
import TextStyles from "uiLibrary/textStyles";
import logo from "assets/svg/profilePrivado.svg";
import Colors from "uiLibrary/colors";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: ${Colors.neutral.p5};
`;

const Header = styled.div`
    width: 100%;
    height: 64px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    display: flex;
    position: absolute;
`;

const ContactUs = styled(Label)`
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p70};
    width: 100%;
    text-align: right;
    width: 200px;
`;

const StyledLink = styled.a`
    ${TextStyles.TextT200Link};
    color: ${Colors.neutral.p90};
    margin-top: 4px;
    text-decoration-line: underline !important;
`;


const NewLogoContainer = styled.div`
    & span {
        ${TextStyles.HeadlineH300Semibold};
    }
    width: 150px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    img {
        width: auto;
        height: 100%;
    }
`;

const LockLogoContainer = styled.div`
    width: 116px;
    height: 48px;
    margin-bottom: 24px;
    img {
        width: 48px;
        height: 48px;
    }
`;

const CenterContainer = styled.div`
    width: 514px;
    height: 284px;
    flex-direction: column;
    background: ${Colors.white};
    box-shadow: 0px 4px 8px rgba(104, 115, 125, 0.05);
    border-radius: 8px;
    display: flex;
`;
const Section = styled.div`
    padding-top: 136px;
    border-radius: 8px;
`;
const Main = styled.div`
    padding: 24px 32px;
`;

const Heading = styled.div`
    color: ${Colors.neutral.p100};
    ${TextStyles.HeadlineH300Regular};
    margin-bottom: 24px;
`;

const SubHeading = styled.div`
    margin-top: 8px;
    color: ${Colors.neutral.p90};
    ${TextStyles.TextT200Regular};
    margin-bottom: 24px;
`;

const InvalidUserPage = (): ReactElement => {
    return (
        <Container>
            <Header>
                <NewLogoContainer>
                    <img src={logo} alt="privado-logo" /><span>MuroChat</span>
                </NewLogoContainer>
                <ContactUs>
                    Need help{" "}
                    <StyledLink
                        target="_blank"
                        href="mailto:hello@privado.ai">
                        Contact Support
                    </StyledLink>{" "}
                </ContactUs>
            </Header>
            <Section>
                <CenterContainer>
                    <Main>
                        <LockLogoContainer>
                            <img src={Lock} alt="privado-logo" />
                        </LockLogoContainer>
                        <Heading>{"We're sorry, we are unable to process your request without valid permissions. Please contact your organisation administrator for access."}</Heading>
                        <ContactUs>
                            If you think this is an error{" "}
                            <StyledLink
                                target="_blank"
                                href="mailto:hello@privado.ai">
                                Contact Support
                            </StyledLink>{" "}
                        </ContactUs>
                    </Main>
                </CenterContainer>
            </Section>
        </Container>
    );
};

export default InvalidUserPage;
