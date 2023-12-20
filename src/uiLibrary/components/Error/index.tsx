import React, { ReactElement } from "react";
import styled from "styled-components";
import { ReactComponent as ErrorIcon } from "../../assets/svg/errorIcon.svg";
import logo from "../../assets/svg/purple_logo_large.svg";
import { ReactComponent as FullPageErrorIcon } from "../../assets/svg/fullpageerrorIcon.svg";

import Colors from "../../colors";
import TextStyles from "../../textStyles";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
`;
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 336px;
`;

const Message = styled.h2`
    ${TextStyles.TextT200Regular}
    text-align: center;
    color: ${Colors.neutral.p70};
`;
const Heading = styled.div`
    ${TextStyles.HeadlineH200Semibold};
    margin-bottom: 12px;
`;
const StyledErrorIcon = styled(ErrorIcon)`
    margin-bottom: 16px;
`;
const StyledFullPageErrorIcon = styled(FullPageErrorIcon)`
    margin-bottom: 24px;
`;
const Link = styled.a`
    ${TextStyles.TextT200Link}
    cursor: pointer;
`;
const Logo = styled.img`
    margin-top: 170px;
    width: 85px;
`;

const Error = ({
    children,
    className,
    hideLink
}: ReactNodeChildren & {
    className?: string;
    hideLink?: boolean;
}): ReactElement => {
    return (
        <Container className={className}>
            <Wrapper>
                <StyledErrorIcon />
                <Message>
                    {children || "Sorry we couldn’t fetch the content."}
                    <br />

                    {!hideLink && (
                        <>
                            Try{" "}
                            <Link onClick={() => window.location.reload()}>
                                refreshing the page
                            </Link>
                        </>
                    )}
                </Message>
            </Wrapper>
        </Container>
    );
};

Error.FullPageError = (): ReactElement => {
    return (
        <Container style={{ alignItems: "flex-start" }}>
            <Wrapper style={{ marginTop: "120px", maxWidth: "514px" }}>
                <StyledFullPageErrorIcon />
                <Heading>Something went wrong</Heading>
                <Message>
                    Sorry, we could’t process your request. Try refreshing the
                    page.
                    <br />
                    If problem persists,{" "}
                    <Link href="https://www.privado.ai/">contact support.</Link>
                </Message>
                <Logo src={logo} alt="privado-logo" />
            </Wrapper>
        </Container>
    );
};

export default Error;
