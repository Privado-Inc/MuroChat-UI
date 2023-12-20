import React, { ReactElement } from "react";
import styled from "styled-components";
// import { ReactComponent as LockIcon } from "assets/svg/lockIcon.svg";
import { TextStyles, Colors } from "uiLibrary";
import { Loader } from "uiLibrary/components";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Content = styled.div`
    width: 514px;
    height: auto;
`;
// const StyledLockIcon = styled(LockIcon)`
//     margin-bottom: 32px;
// `;
const Description = styled.div`
    ${TextStyles.HeadlineH300Regular};
    color: ${Colors.neutral.p100};
    margin-bottom: 64px;
`;

const HelperText = styled.div`
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p80};
`;
const StyledLink = styled.a`
    ${TextStyles.TextT200Link};
    color: ${Colors.neutral.p100};
    cursor: pointer;
`;
const UnauthorizedScreen = ({ text, className }: { text?: string; className?: string }): ReactElement => {
    return (
        <Wrapper className={className}>
            <Content>
                {/* <StyledLockIcon /> */}
                {text ? (
                    <Description>{text}</Description>
                ) : (
                    <Description>
                        We&apos;re sorry, but it looks like you&apos;re trying to access a resource that requires valid
                        permissions. Please contact your team administrator for access.
                    </Description>
                )}
                <HelperText>
                    Need further assistance or have questions about your account?{" "}
                    <StyledLink target="_blank" href="mailto:support@privado.ai">
                        Contact Us
                    </StyledLink>
                </HelperText>
            </Content>
        </Wrapper>
    );
};

export const DelayedUnauthorizedScreen = ({
    text,
    className,
    isLoading,
    wait = 1000
}: {
    text?: string;
    className?: string;
    isLoading: boolean;
    wait?: number;
}): ReactElement => {
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, wait);
    }, []);

    if (!show || isLoading) {
        return <Loader />;
    }
    return <UnauthorizedScreen text={text} className={className} />;
};

export default UnauthorizedScreen;
