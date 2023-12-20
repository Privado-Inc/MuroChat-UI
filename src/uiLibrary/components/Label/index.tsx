import React, { ReactElement } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";

const Common = styled.span`
    ${({ css }) => css}
`;

const Label = ({
    children,
    css = [],
    className,
    onClick = () => ({})
}: ReactNodeChildren & {
    css?: FlattenSimpleInterpolation;
    className?: string;
    onClick?: () => void;
}): ReactElement => (
    <Common css={css} onClick={onClick} className={className}>
        {children}
    </Common>
);

export default Label;
