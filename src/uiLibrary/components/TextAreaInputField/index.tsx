import React, { ReactElement } from "react";
import styled from "styled-components";
import colors from "../../colors";
import textStyles from "../../textStyles";
import MultiTagTextInputField from "./multiTagTextInputField";

type Props = {
    value: string;
    onChange: (a: string) => void;
    isMandatory?: boolean;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    description?: string;
    resizeVertical?: boolean;
    resizeHorizontal?: boolean;
    className?: string;
    onBlur?: () => void;
};

const InputContainer = styled.div`
    width: 100%;
    padding: 0px;
    position: relative;
`;

const InputBox = styled.textarea<{
    error: boolean;
    resizeX: boolean;
    resizeY: boolean;
    isDisabled: boolean;
}>`
    ${textStyles.HeadlineH600Regular}
    background: ${({ isDisabled }) =>
        isDisabled ? colors.neutral.p5 : colors.white};
    border-radius: 4px;
    width: 100%;
    display: flex;
    height: 72px;
    resize: ${({ resizeX, resizeY }) => {
        if (resizeX && resizeY) {
            return "both";
        }
        if (resizeX) {
            return "horizontal";
        }
        if (resizeY) {
            return "vertical";
        }
        return "none";
    }};
    box-sizing: border-box;
    padding: 8px 12px;
    border: 1px solid ${({ error }) =>
        error ? colors.red.p3 : colors.neutral.p30};
    &:focus {
        border: 1px solid ${colors.purple.p50};
    }
    &::placeholder {
        ${textStyles.TextT100Regular}
        color: ${colors.neutral.p50};
    }
`;

const InputLabel = styled.div<{ isMandatory: boolean }>`
    ${textStyles.TextT200Semibold}
    color: ${colors.neutral.p60};
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    margin-bottom: 6px;
    ${({ isMandatory }) =>
        isMandatory
            ? `
        &::after {
            position: relative;
            color: ${colors.red.p3};
            content: "*";
            left: 3px;
        }
    `
            : ""}
`;
const Description = styled.div`
    ${textStyles.LightTextT300Regular}
    color: ${colors.neutral.p70};
    margin-top: 8px;
`;

const Error = styled.div`
    ${textStyles.TextT300Regular}
    color: ${colors.red.p3};
    margin-top: 8px;
`;

const TextAreaInputField = ({
    label,
    value,
    onChange,
    placeholder,
    isMandatory = false,
    description,
    disabled,
    error,
    resizeHorizontal,
    resizeVertical,
    className,
    onBlur
}: Props): ReactElement => {
    const [isEdited, setIsEdited] = React.useState(false);
    return (
        <InputContainer>
            {label && (
                <InputLabel isMandatory={isMandatory}>{label}</InputLabel>
            )}
            <InputBox
                className={className}
                resizeX={!!resizeHorizontal}
                resizeY={!!resizeVertical}
                disabled={disabled}
                isDisabled={!!disabled}
                error={!!error}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsEdited(true);
                }}
                onBlur={() => {
                    if (isEdited && onBlur) {
                        onBlur();
                        setIsEdited(false);
                    }
                }}
                value={value}
                placeholder={placeholder || ""}
            />
            {description && <Description>{description}</Description>}
            {error && <Error>{error}</Error>}
        </InputContainer>
    );
};
TextAreaInputField.MultiTagTextInputField = MultiTagTextInputField;
export default TextAreaInputField;
