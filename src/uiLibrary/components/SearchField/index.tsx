import React, { ReactElement } from "react";
import styled from "styled-components";
import colors from "../../colors";
import textStyles from "../../textStyles";

import { ReactComponent as SearchDefaultIcon } from "assets/svg/searchDefault.svg";
import { ReactComponent as SearchActiveIcon } from "assets/svg/searchActive.svg";
import { ReactComponent as ClearSearchIcon } from "assets/svg/clearSearch.svg";

type Props = {
    value?: string; // can be controlled or uncontrolled
    onChange: (a: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

const InputContainer = styled.div`
    width: 100%;
    padding: 0px;
    position: relative;
`;

const InputBox = styled.input`
    ${textStyles.HeadlineH600Regular}
    background: ${colors.neutral.p5};
    border-radius: 8px;
    width: 100%;
    height: 32px;
    box-sizing: border-box;
    padding: 7px 32px;
    border: 1px solid ${colors.neutral.p5};
    &:focus {
        border: 1px solid ${colors.purple.p50};
        background: ${colors.white};
    }
    &::placeholder {
        ${textStyles.TextT100Regular}
        color: ${colors.neutral.p60};
    }
`;

const SearchField = ({
    value,
    onChange,
    placeholder,
    className,
    disabled
}: Props): ReactElement => {
    const [isFocus, setIsFocus] = React.useState(false);
    return (
        <InputContainer className={className}>
            {isFocus ? (
                <SearchActiveIcon
                    style={{ position: "absolute", top: "8px", left: "8px" }}
                />
            ) : (
                <SearchDefaultIcon
                    style={{ position: "absolute", top: "8px", left: "8px" }}
                />
            )}
            <InputBox
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                placeholder={placeholder || ""}
            />
            {value && (
                <ClearSearchIcon
                    style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "8px",
                        right: "8px"
                    }}
                    onClick={() => !disabled && onChange("")}
                />
            )}
        </InputContainer>
    );
};

export default SearchField;
