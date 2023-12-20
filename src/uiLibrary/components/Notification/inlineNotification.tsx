import React, { ReactElement } from "react";
import styled from "styled-components";

import Colors from "../../colors";
import TextStyles from "../../textStyles";
import { ReactComponent as CrossIcon } from "assets/svg/cross.svg";

const StyledCrossIcon = styled(CrossIcon)`
    position: absolute;
    cursor: pointer;
    right: 10px;
    padding: 1px 0px;
`;

const Container = styled.div<{ bgColor: string; color: string }>`
    ${TextStyles.TextT200Regular}
    position: relative;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 9px 12px;
    background-color: ${({ bgColor }) => bgColor};
    color: ${({ color }) => color};
    & svg path {
        stroke: ${({ color }) => color};
    }
`;

const BaseInlineNotification = ({
    children,
    bgColor,
    color,
    onClose
}: {
    children: React.ReactNode;
    bgColor: string;
    color: string;
    onClose: () => void;
}): ReactElement => {
    return (
        <Container bgColor={bgColor} color={color}>
            {children}
            <StyledCrossIcon onClick={() => onClose()} />
        </Container>
    );
};

const InlineNotification = {
    Warning: ({
        label,
        onClose
    }: {
        label: string;
        onClose: () => void;
    }): ReactElement => (
        <BaseInlineNotification
            bgColor={Colors.yellow.p1}
            color={Colors.yellow.p5}
            onClose={onClose}>
            {label}
        </BaseInlineNotification>
    ),
    Error: ({
        label,
        onClose
    }: {
        label: string;
        onClose: () => void;
    }): ReactElement => (
        <BaseInlineNotification
            bgColor={Colors.red.p1}
            color={Colors.red.p4}
            onClose={onClose}>
            {label}
        </BaseInlineNotification>
    ),
    Success: ({
        label,
        onClose
    }: {
        label: string;
        onClose: () => void;
    }): ReactElement => (
        <BaseInlineNotification
            bgColor={Colors.purple.p10}
            color={Colors.purple.p60}
            onClose={onClose}>
            {label}
        </BaseInlineNotification>
    )
};

export default InlineNotification;
