import React, { ReactElement } from "react";

import styled, { FlattenSimpleInterpolation, css } from "styled-components";
import Checkmark from "assets/svg/whiteTick.svg";

import colors from "../../colors";
import textStyles from "../../textStyles";
import { Colors } from "uiLibrary/index";

interface CustomCheckedProps {
    checked: boolean;
    css?: FlattenSimpleInterpolation;
    className?: string;
    labelCss?: FlattenSimpleInterpolation;
}

interface Checkbox {
    disabled?: boolean;
    label?: string;
    partial?: boolean;
    invalid?: boolean;
    onChange: (a: boolean, e: any) => void;
}

export const StyledCheckbox = styled.div<{
    disabled?: boolean;
    invalid?: boolean;
    checked?: boolean;
    partial?: boolean;
}>`
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    left: 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: ${Colors.white};
    border: 1px solid ${Colors.neutral.p60};
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    &:hover {
        box-shadow: ${({ disabled, invalid }) =>
        disabled || invalid ? "none" : "0px 0px 0px 4px #bfc8dc33"};
    }
    ${({ disabled }) =>
        disabled
            ? css`
                  background-color: ${Colors.neutral.p20};
                  border: none;
              `
            : ""};

    ${({ checked, disabled }) =>
        checked
            ? css`
                  border: none;
                  background-color: ${disabled
                    ? Colors.neutral.p40
                    : Colors.purple.p50};
                  &::before {
                      content: "";
                      position: absolute;
                      width: 8px;
                      height: 6px;
                      background: url(${Checkmark}) center/cover no-repeat;
                  }
              `
            : ""};
    ${({ partial, disabled }) =>
        partial
            ? css`
                  border: none;
                  background-color: ${disabled
                    ? Colors.neutral.p40
                    : Colors.purple.p50};
                  &::before {
                      content: "";
                      position: absolute;
                      width: 8px;
                      height: 2px;
                      border-radius: 4px;
                      background-color: ${Colors.white};
                  }
              `
            : ""};
    ${({ invalid }) =>
        invalid
            ? css`
                  background-color: ${Colors.white};
                  border: 1px solid ${Colors.red.p3};
                  cursor: not-allowed;
              `
            : ""};
`;

const FakeCheckbox = styled.div`
    width: 20px;
    height: 20px;
    display: inline-block;
`;

const Label = styled.div`
    margin-right: 8px;
    display: flex;
    align-items: center;
`;

const CheckboxText = styled.div`
    ${textStyles.TextT100Regular}
    color: ${colors.neutral.p80};
    cursor: default;
    display: inline-block;
    max-width: calc(100% - 28px);
    position: relative;
    margin-left: 8px;
    word-break: break-word;
`;

const CheckboxC = ({
    checked,
    label = "",
    partial = false,
    className,
    css = [],
    labelCss = [],
    onChange,
    disabled = false,
    invalid = false
}: Checkbox & CustomCheckedProps): ReactElement => {
    return (
        <Label
            css={css}
            onClick={(e) => !disabled && !invalid && onChange(!checked, e)}
            className={className}>
            <FakeCheckbox>
                <StyledCheckbox
                    checked={checked}
                    disabled={disabled}
                    partial={partial}
                    invalid={invalid}
                />
            </FakeCheckbox>
            {label && <CheckboxText css={labelCss}>{label}</CheckboxText>}
        </Label>
    );
};

export default CheckboxC;
