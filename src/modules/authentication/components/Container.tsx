import React, { ReactElement } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import { useHistory } from "react-router-dom";
import TextStyles from "uiLibrary/textStyles";
import { Button } from "uiLibrary/components";
import Colors from "../../../uiLibrary/colors";
import logo from "assets/svg/profilePrivado.svg";
import quotes from "assets/svg/quotes.svg";
import privacyLock from "assets/svg/privacyLock.svg";
import matt from "assets/svg/matt.svg";

import Header from "./Header";
import BoxContainer from "./Box";

export const GoogleSignInButton = styled(Button.Medium)`
    width: 264px;
    height: 48px;
    border-radius: 40px;
    background: ${Colors.white};
    border: 1px solid #d5dff2;
    box-shadow: 0px 2px 6px rgba(104, 115, 125, 0.05);
    margin-top: 16px;
    margin-bottom: 16px;

    & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        flex-direction: row-reverse;
    }

    & > div > div {
        margin-left: 6px !important;
        ${TextStyles.HeadlineH500Semibold};
        color: ${Colors.neutral.p90};
    }
`;

export const InputContainerContentDiv = styled.div`
    width: 60%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const AuthenticationContainerDiv = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;

const TestimonialContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    padding-top: 5%;
    padding-left: 10.7%;
    width: 40%;
    background-color: ${Colors.neutral.p5};
`;

const InputContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 350px;
`;

const NewLogoContainer = styled.div<{ width?: number }>`
    width: ${({ width = 36 }) => `${width}px`};
    height: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    top: 80px;
    left: 100px;
    img {
        width: auto;
        height: 100%;
    }
    cursor: pointer;
    & span {
        ${TextStyles.HeadlineH300Semibold};
    }
`;

const LogoContainer = styled.div`
    width: 85px;
    margin: 24px;
    height: 24px;
    img {
        width: 100%;
    }
`;

const QuoteContainer = styled.div`
    width: 24px;
    height: 18px;
    margin-top: 18%;
    img {
        width: 100%;
    }
`;

const ProfileContainer = styled.div`
    width: 80%;
    margin-top: 24px;
    /* font-family: "graphik", sans-serif; */
    max-width: 250px;
`;

const Text = styled.p`
    /* font-family: "graphik"; */
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: ${Colors.neutral.p70};
`;

const Name = styled.p`
    /* font-family: "graphik"; */
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
    color: ${Colors.neutral.p90};
`;

const Desgination = styled.p`
    /* font-family: "graphik"; */
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
    color: ${Colors.neutral.p90};
`;

const Profile = styled.div`
    margin-top: 32px;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: ${Colors.neutral.p70};
    display: flex;
`;

const NameAndDesgination = styled.div`
    margin-left: 15px;
`;

const PrivacyDetails = styled.div`
    ${TextStyles.TextT200Regular};
    letter-spacing: 0em;
    margin-top: 20%;
    display: flex;
    text-align: left;
    color: ${Colors.neutral.p70};
`;

const PrivacyText = styled.div`
    margin-left: 13px;
    cursor: pointer;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
    background: ${Colors.neutral.p5};
`;

const NewContainer = styled.div<{ margin: string }>`
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    margin: ${({ margin }) => margin};
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
`;
const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;
const SignUpLoginBoxLayout = ({
    title,
    children
}: { title?: string } & ReactElementChildren): ReactElement => {
    return (
        <Container>
            <LogoContainer>
                {/* <img src={logo} alt="privado-logo" /> */}
            </LogoContainer>
            <Header heading={title || ""} />
            {children}
        </Container>
    );
};

export const BoxContainerLayout = ({
    children,
    css = []
}: {
    css?: FlattenSimpleInterpolation;
} & ReactElementChildren): ReactElement => (
    <BoxContainer css={css}>{children}</BoxContainer>
);

export const AuthenticationContainerWithoutColumn = ({
    title,
    children,
    margin = "90px 144px"
}: { title?: string, margin?: string } & ReactElementChildren): ReactElement => {
    const history = useHistory();

    return (
        <Wrapper>
            <NewContainer margin={margin}>
                <NewLogoContainer
                    width={150}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        history.push({
                            pathname: "/"
                        });
                    }}>
                    <img src={logo} alt="privado-logo" /> <span>MuroChat</span>
                </NewLogoContainer>
                <Header heading={title || ""} />
                <Content>{children}</Content>
            </NewContainer>
        </Wrapper>
    );
};

export const AuthenticationContainer = ({
    children
}: ReactElementChildren): ReactElement => {
    return (
        <AuthenticationContainerDiv>
            {/* <TestimonialContainer>
                <NewLogoContainer width={150}>
                    <img src={logo} alt="privado-logo" /><span>MuroChat</span>
                </NewLogoContainer>
                <QuoteContainer>
                    <img src={quotes} alt="privado-quotes" />
                </QuoteContainer>
                <ProfileContainer>
                    <Text>
                        MuroChat speaks the language of the engineering
                        department, which creates an interest in the mind of
                        engineers and makes them engage with our assessments.”
                    </Text>
                    <Profile>
                        <img src={matt} alt="matt" />
                        <NameAndDesgination>
                            <Name>Matt Kingsland</Name>
                            <Desgination>
                                Compliance Manager at Zego
                            </Desgination>
                        </NameAndDesgination>
                    </Profile>
                </ProfileContainer>
                <PrivacyDetails>
                    <img src={privacyLock} alt="privacy-lock" />
                    <PrivacyText
                        onClick={() => {
                            window.open(
                                "https://www.privado.ai/post/privacy-as-code",
                                "_blank"
                            );
                        }}>
                        Read about our approach to privacy
                    </PrivacyText>
                </PrivacyDetails>
            </TestimonialContainer> */}
            <InputContainer><NewLogoContainer width={150}>
                <img src={logo} alt="privado-logo" /><span>MuroChat</span>
            </NewLogoContainer>{children}</InputContainer>
        </AuthenticationContainerDiv>
    );
};

export default SignUpLoginBoxLayout;
