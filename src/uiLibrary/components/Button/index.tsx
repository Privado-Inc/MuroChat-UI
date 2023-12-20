import React, { ReactElement } from "react";

import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import colors from "../../colors";
import BoxShadows from "../../boxshadows";
import { ReactComponent as WhitePlusIcon } from "../../assets/svg/whitePlusIcon.svg";
import { ReactComponent as LoaderIcon } from "../../assets/svg/loaderIcon.svg";

type CustomProps = {
    addIcon?: boolean | ReactElement;
    primary?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    destructive?: boolean;
    applied?: boolean;
    isDisabled?: boolean;
    className?: string;
    loading?: boolean;
};

type ButtonTP = {
    label?: string | ReactElement;
    onClick?: (e?: Event) => void;
    dataBtnRef?: string;
    actionRef?: React.Ref<HTMLDivElement>;
    title?: string;
    clickOnEnter?: boolean;
} & CustomProps;

const generateStyles = ({
    color,
    hoverColor,
    focusColor,
    activeColor,
    backgroundColor,
    hoverBackgroundColor,
    focusBackgroundColor,
    activeBackgroundColor,
    border,
    hoverBorder,
    focusBorder,
    activeBorder,
    boxShadow,
    hoverBoxShadow,
    focusBoxShadow,
    activeBoxShadow
}: {
    [a: string]: string;
}): FlattenSimpleInterpolation => css`
    color: ${color};
    background-color: ${backgroundColor};
    border: ${border};
    box-shadow: ${boxShadow};
    &:hover {
        color: ${hoverColor};
        background-color: ${hoverBackgroundColor};
        border: ${hoverBorder};
        box-shadow: ${hoverBoxShadow};
    }
    &:focus {
        color: ${focusColor};
        background-color: ${focusBackgroundColor};
        border: ${focusBorder};
        box-shadow: ${focusBoxShadow};
    }
`;

// &:active {
//     color: ${activeColor};
//     background-color: ${activeBackgroundColor};
//     border: ${activeBorder};
//     box-shadow: ${activeBoxShadow};
// }

const getDestructiveStyles = (): FlattenSimpleInterpolation => {
    return generateStyles({
        color: colors.red.p4,
        backgroundColor: colors.red.p1,
        border: `1px solid ${colors.red.p1}`,
        boxShadow: "none",
        // hover state
        hoverColor: colors.red.p4,
        hoverBackgroundColor: colors.red.p2,
        hoverBorder: `1px solid ${colors.red.p2}`,
        hoverBoxShadow: "none",
        // focus state
        focusColor: colors.red.p4,
        focusBackgroundColor: colors.red.p2,
        focusBorder: `1px solid ${colors.red.p2}`,
        focusBoxShadow: `0px 0px 0px 3px ${colors.red.p1}`,
        // active state
        activeColor: colors.red.p4,
        activeBackgroundColor: colors.red.p2,
        activeBorder: `1px solid ${colors.red.p2}`,
        activeBoxShadow: "none"
    });
};

const getTertiaryStyles = (): FlattenSimpleInterpolation => {
    return generateStyles({
        color: colors.neutral.p70,
        backgroundColor: colors.white,
        border: `1px solid ${colors.neutral.p40}`,
        boxShadow: BoxShadows.xsNeutral,
        // hover state
        hoverColor: colors.neutral.p90,
        hoverBackgroundColor: colors.neutral.p10,
        hoverBorder: `1px solid ${colors.neutral.p40}`,
        hoverBoxShadow: "none",
        // focus state
        focusColor: colors.neutral.p70,
        focusBackgroundColor: colors.white,
        focusBorder: `1px solid ${colors.neutral.p40}`,
        focusBoxShadow: "0px 0px 0px 3px rgba(126, 141, 169, 0.1)",
        // active state
        activeColor: colors.purple.p50,
        activeBackgroundColor: colors.purple.p20,
        activeBorder: `1px solid ${colors.purple.p20}`,
        activeBoxShadow: "none"
    });
};

const getTertiarySvgStyles = (): FlattenSimpleInterpolation => {
    return css`
        & svg [class$="bstrokestyle"] {
            stroke: ${colors.neutral.p70};
        }
        &:hover svg [class$="bstrokestyle"] {
            stroke: ${colors.neutral.p90};
        }
        &:focus svg [class$="bstrokestyle"] {
            stroke: ${colors.neutral.p70};
        }
        & svg [class$="bfillstyle"] {
            fill: ${colors.neutral.p70};
        }
        &:hover svg [class$="bfillstyle"] {
            fill: ${colors.neutral.p90};
        }
        &:focus svg [class$="bfillstyle"] {
            fill: ${colors.neutral.p70};
        }
    `;
};

const getTertiaryStylesApplied = (): FlattenSimpleInterpolation => {
    return generateStyles({
        color: colors.purple.p50,
        backgroundColor: colors.purple.p10,
        border: `1px solid ${colors.purple.p10}`,
        boxShadow: "none",
        // hover state
        hoverColor: colors.purple.p50,
        hoverBackgroundColor: colors.purple.p20,
        hoverBorder: `1px solid ${colors.purple.p20}`,
        hoverBoxShadow: "none",
        // focus state
        focusColor: colors.purple.p50,
        focusBackgroundColor: colors.purple.p20,
        focusBorder: `1px solid ${colors.purple.p20}`,
        focusBoxShadow: `0px 0px 0px 3px ${colors.purple.p10}`,
        // active state
        activeColor: colors.purple.p50,
        activeBackgroundColor: colors.purple.p20,
        activeBorder: `1px solid ${colors.purple.p20}`,
        activeBoxShadow: "none"
    });
};

const getTertiarySvgStylesApplied = (): FlattenSimpleInterpolation => {
    return css`
        & svg [class$="bstrokestyle"] {
            stroke: ${colors.purple.p50};
        }
        & svg [class$="bfillstyle"] {
            fill: ${colors.purple.p50};
        }
    `;
};

const getSecondaryStyles = (): FlattenSimpleInterpolation => {
    return generateStyles({
        color: colors.purple.p50,
        backgroundColor: colors.white,
        border: `1px solid ${colors.purple.p50}`,
        boxShadow: BoxShadows.xsPurple,
        // hover state
        hoverColor: colors.purple.p50,
        hoverBackgroundColor: colors.purple.p20,
        hoverBorder: `1px solid ${colors.purple.p20}`,
        hoverBoxShadow: "none",
        // focus state
        focusColor: colors.purple.p50,
        focusBackgroundColor: colors.white,
        focusBorder: `1px solid ${colors.purple.p50}`,
        focusBoxShadow: "0px 0px 0px 3px rgba(117, 76, 255, 0.15)",
        // active state
        activeColor: colors.purple.p50,
        activeBackgroundColor: colors.purple.p20,
        activeBorder: `1px solid ${colors.purple.p20}`,
        activeBoxShadow: "none"
    });
};
const getPrimaryStyles = (): FlattenSimpleInterpolation => {
    return generateStyles({
        color: colors.white,
        backgroundColor: colors.purple.p50,
        border: `1px solid ${colors.purple.p50}`,
        boxShadow: BoxShadows.md,
        // hover state
        hoverColor: colors.white,
        hoverBackgroundColor: colors.purple.p60,
        hoverBorder: `1px solid ${colors.purple.p60}`,
        hoverBoxShadow: "none",
        // focus state
        focusColor: colors.white,
        focusBackgroundColor: colors.purple.p50,
        focusBorder: `1px solid ${colors.purple.p50}`,
        focusBoxShadow: `0px 0px 0px 3px ${colors.purple.p20}`,
        // active state
        activeColor: colors.white,
        activeBackgroundColor: colors.purple.p60,
        activeBorder: `1px solid ${colors.purple.p60}`,
        activeBoxShadow: BoxShadows.md
    });
};

const Spinner = styled.span`
    animation-name: loading;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    width: 24px;
    height: 24px;
`;

const ClearButttonStyle = styled.span`
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
    margin-left: 4px;
    color: ${colors.purple.p60};
    background-color: ${colors.white};
`;

const ButtonContent = styled.div`
    display: flex;
    align-items: center;
`;
const ButtonLabel = styled.div<{ withIcon: boolean }>`
    ${({ withIcon }) =>
        withIcon
            ? css`
                  margin-right: 4px;
              `
            : ""};
`;

const StyledWhitePlusIcon = styled(WhitePlusIcon)`
    user-select: none;
`;
const PurpleLoaderIcon = styled(LoaderIcon)`
    & path {
        stroke: ${colors.purple.p60};
    }
`;

const ButtonStyled = styled.button<CustomProps>`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    ${(props: CustomProps) => {
        if (props.isDisabled) {
            return css`
                color: ${colors.white};
                border: 1px solid ${colors.neutral.p40};
                background-color: ${colors.neutral.p40};
                box-shadow: none;
                cursor: default;
            `;
        }
        if (props.destructive) {
            return getDestructiveStyles();
        }
        if (props.tertiary) {
            return css`
                ${props.applied
                    ? getTertiaryStylesApplied()
                    : getTertiaryStyles()}
                ${props.applied
                    ? getTertiarySvgStylesApplied()
                    : getTertiarySvgStyles()}
            `;
        }
        if (props.secondary) {
            return css`
                ${getSecondaryStyles()}
                ${getTertiarySvgStyles()}
            `;
        }
        return getPrimaryStyles();
    }};
`;

// &:active svg [class$="bstrokestyle"] {
//     stroke: ${colors.purple.p50};
// }
// &:active svg [class$="bfillstyle"] {
//     fill: ${colors.purple.p50};
// }

const ButtonStyledSmall = styled(ButtonStyled) <{ withIcon: boolean }>`
    padding: 2px 7px; // -1px from mockups as border will take 1px
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    ${({ withIcon }) =>
        withIcon
            ? css`
                  padding-right: 5px;
              `
            : ""}
`;
const ButtonStyledMedium = styled(ButtonStyled) <{ withIcon: boolean }>`
    padding: 6px 11px; // -1px from mockups as border will take 1px
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    ${({ withIcon }) => {
        return withIcon
            ? css`
                  padding-right: 7px;
              `
            : "";
    }}
`;
const ButtonStyledLarge = styled(ButtonStyled) <{ withIcon: boolean }>`
    padding: 7px 15px; // -1px from mockups as border will take 1px
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;
    ${({ withIcon }) =>
        withIcon
            ? css`
                  padding-right: 11px;
              `
            : ""}
`;

const createButton = ({
    StyledComponent,
    label,
    addIcon,
    onClick,
    isDisabled,
    primary,
    secondary,
    tertiary,
    destructive,
    applied,
    className,
    dataBtnRef,
    title,
    actionRef,
    loading,
    clickOnEnter
}: ButtonTP & { StyledComponent: any }): ReactElement => {
    const ref = React.createRef<HTMLDivElement>();

    const EnterKeyEvent = (e: KeyboardEvent): void => {
        if (e.which === 13) {
            const button = ref.current;
            button?.focus();
            button?.click();
        }
    };

    React.useEffect(() => {
        if (clickOnEnter) {
            if (ref.current) {
                window.addEventListener("keypress", EnterKeyEvent);
            }
            return () => {
                window.removeEventListener("keypress", EnterKeyEvent);
            };
        }
    }, [ref]);

    return (
        <StyledComponent
            ref={clickOnEnter ? ref : actionRef}
            className={className}
            onClick={(e: Event) => {
                if (!loading && onClick) onClick(e);
            }}
            title={title}
            isDisabled={isDisabled}
            disabled={isDisabled}
            primary={primary}
            secondary={secondary}
            tertiary={tertiary}
            destructive={destructive}
            applied={applied}
            withIcon={addIcon && !loading}
            data-btn-ref={dataBtnRef}>
            <ButtonContent>
                {loading ? (
                    <Spinner>
                        {tertiary ? <PurpleLoaderIcon /> : <LoaderIcon />}
                    </Spinner>
                ) : (
                    <>
                        {typeof label === "string" && label.length && (
                            <ButtonLabel withIcon={!!addIcon}>
                                {label}
                            </ButtonLabel>
                        )}
                        {typeof label !== "string" && label}

                        {typeof addIcon !== "boolean"
                            ? addIcon
                            : addIcon && <StyledWhitePlusIcon />}
                    </>
                )}
            </ButtonContent>
        </StyledComponent>
    );
};

const SmallButton = (props: ButtonTP): ReactElement => {
    return createButton({ StyledComponent: ButtonStyledSmall, ...props });
};
const MediumButton = (props: ButtonTP): ReactElement => {
    return createButton({ StyledComponent: ButtonStyledMedium, ...props });
};
const LargeButton = (props: ButtonTP): ReactElement => {
    return createButton({ StyledComponent: ButtonStyledLarge, ...props });
};
const ClearButton = ({
    onClick,
    label,
    className
}: {
    className?: string;
    onClick: () => void;
    label: string;
}): ReactElement => {
    return (
        <ClearButttonStyle className={className} onClick={onClick}>
            {label}
        </ClearButttonStyle>
    );
};

const Button = {
    Small: SmallButton,
    Medium: MediumButton,
    Large: LargeButton,
    Clear: ClearButton
};

export default Button;
