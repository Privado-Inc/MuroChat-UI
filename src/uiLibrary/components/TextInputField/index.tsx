import React, { ReactElement } from "react";
import styled from "styled-components";
import colors from "../../colors";

import PasswordEyeIcon from "assets/svg/passwordhidden.svg";

import MultiTagTextInputField from "./multiTagTextInputField";
import {
    InputFieldWrapper,
    InputLabel,
    Box,
    InputBox,
    Description,
    Error
} from "./styled";

const Image = styled.img`
    font-size: 13px;
    position: absolute;
    right: 12px;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 17px;
    color: ${colors.purple.p50};
    cursor: pointer;
    user-select: none;
`;

type Props = {
    value: string;
    onChange: (a: string) => void;
    isMandatory?: boolean;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    description?: string;
    valueType?: "text" | "password" | "number" | "email";
    className?: string;
};

const ShowButton = ({
    onClick
}: {
    onClick: () => void;
}): ReactElement => {
    return (
        <Image
            src={PasswordEyeIcon}
            onClick={() => onClick()}
        />
    );
};

const TextInputField = ({
    label,
    value,
    onChange,
    placeholder,
    isMandatory = false,
    description,
    disabled,
    error,
    valueType = "text",
    className = ""
}: Props): ReactElement => {
    const [show, toggle] = React.useState(false);
    return (
        <InputFieldWrapper className={className}>
            {label && (
                <InputLabel isMandatory={isMandatory}>{label}</InputLabel>
            )}
            <Box>
                <InputBox
                    isDisabled={!!disabled}
                    type={show ? "text" : valueType}
                    disabled={disabled}
                    error={!!error}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    value={value}
                    placeholder={placeholder || ""}
                />
                {valueType === "password" && (
                    <ShowButton
                        onClick={() => {
                            toggle(!show);
                        }}
                    />
                )}
            </Box>
            {description && <Description>{description}</Description>}
            {error && <Error>{error}</Error>}
        </InputFieldWrapper>
    );
};

TextInputField.MultiTagTextInputField = MultiTagTextInputField;
export default TextInputField;
