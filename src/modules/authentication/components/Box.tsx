import React, { ReactElement } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import Colors from "uiLibrary/colors";

const BoxStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 514px;
    box-sizing: border-box;
    padding: 44px 44px 36px 44px;
    background: ${Colors.white};
    box-shadow: 0px 6px 12px rgba(104, 115, 125, 0.05);
    border-radius: 8px;
`;

const BoxContainerStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    ${({ css }: { css: FlattenSimpleInterpolation }) => css};
`;

const BoxContainer = ({
    children,
    css
}: ReactElementChildren & {
    css: FlattenSimpleInterpolation;
}): ReactElement => (
    <BoxContainerStyled css={css}>
        <BoxStyled>{children}</BoxStyled>
    </BoxContainerStyled>
);

export default BoxContainer;
