import React, { ReactElement } from "react";
import styled from "styled-components";
import colors from "uiLibrary/colors";

const HeadingStyled = styled.span`
    font-style: normal;
    font-size: 32px;
    text-align: center;
    font-weight: 500;
    color: ${colors.neutral.p90};
`;

const HeaderStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 44px;
`;
const Header = ({
    heading,
    className
}: {
    heading: string;
    className?: string;
}): ReactElement => (
    <HeaderStyled className={className}>
        <HeadingStyled>{heading}</HeadingStyled>
    </HeaderStyled>
);

export default Header;
