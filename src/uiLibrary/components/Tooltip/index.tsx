import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import { Link, useRouteMatch } from "react-router-dom";

import colors from "../../colors";
import TextStyles from "uiLibrary/textStyles";

export const TooltipStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    ${TextStyles.TextT200Semibold};
    padding: 11px 21px 11px 21px;
    background: ${colors.neutral.p90};
    border-radius: 5px;
    color: ${colors.white};
    display: none;
    z-index: 999;
`;

export const ListTooltipContainer = styled.ul`
    display: inline-flex;
    border-radius: 5px;
    flex-direction: column;
    background: ${colors.neutral.p90};
    position: absolute;
    padding: 0;
    width: 184px;
    padding-top: 8px;
    padding-bottom: 8px;
    display: none;
    margin: 0;
    z-index: 999;
    a {
        text-decoration: none;
    }
`;

const TooltipHeader = styled.li`
    min-height: 40px;
    width: 100%;
    z-index: 999;
    padding-left: 16px;
    box-sizing: border-box;
    font-family: Nunito Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: ${colors.white};
    ${({ noClickable }: { selected?: boolean; noClickable?: boolean }) =>
        (noClickable && "cursor: default; font-weight: bold;") ||
        `padding: 0px; cursor: pointer;   &: hover {
            background: ${colors.neutral.p80};
        }`}
    ${({ selected }: { selected?: boolean; noClickable?: boolean }) =>
        selected &&
        `background: ${colors.neutral.p80};
        color: ${colors.purple.p50};font-weight: bold;
    `}
`;

export const Tooltip = ({
    children,
    className
}:
    | ReactElementChildren
    | { children: string; className?: string }): ReactElement => (
    <TooltipStyled className={className}>{children}</TooltipStyled>
);

export type Props = {
    header: string;
    items: { name: string; path: string }[];
    className?: string;
};

export const ListView = (props: Props): ReactElement => (
    <ListTooltipContainer className={props.className}>
        <TooltipHeader noClickable>{props.header}</TooltipHeader>
        {props.items.map((item) => (
            <TooltipHeader
                key={`nav${item.path}`}
                selected={
                    !!useRouteMatch(
                        item.path === "/"
                            ? {
                                path: item.path,
                                exact: true
                            }
                            : item.path
                    )
                }>
                <Link
                    css={css`
                        line-height: 40px;
                        padding-left: 16px;
                    `}
                    to={item.path}>
                    {item.name}
                </Link>
            </TooltipHeader>
        ))}
    </ListTooltipContainer>
);

export default Tooltip;
