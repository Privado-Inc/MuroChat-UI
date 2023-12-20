import React, { ReactElement } from "react";
import styled from "styled-components";
import colors from "../../colors";
import { Colors } from "uiLibrary/index";

type Checkbox = {
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean, e: any) => void;
    className?: string;
};

const Label = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
`;

const ToggleLabel = styled.label`
    cursor: pointer;
    width: 44px;
    height: 24px;
    background: ${colors.neutral.p30};
    display: block;
    border-radius: 12px;
    position: relative;

    &:after {
        content: "";
        width: 16px;
        height: 16px;
        border-radius: 16px;
        position: absolute;
        top: 4px;
        left: 4px;
        background: ${Colors.white};
        transition: 0.2s;
    }

    &:active:after {
        width: 36px;
    }
`;

const ToggleInput = styled.input`
    height: 0;
    width: 0;
    visibility: hidden;

    &:checked + ${ToggleLabel} {
        background: ${colors.purple.p40};
        &:after {
            left: unset;
            right: 4px;
        }
    }
`;

export default ({
    checked,
    onChange,
    disabled = false,
    className
}: Checkbox): ReactElement => {
    const uniqueId = `toggle_${Math.random().toString(36).slice(2)}`;
    return (
        <Label className={className}>
            <ToggleInput
                id={uniqueId}
                type="checkbox"
                disabled={disabled}
                checked={checked}
                tabIndex={0}
                // onClick={(e) => !disabled && onChange(!checked, e)}
                onChange={(e) => !disabled && onChange(!checked, e)}
            />
            <ToggleLabel htmlFor={uniqueId} />
        </Label>
    );
};
