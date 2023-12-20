import styled from "styled-components";
import textStyles from "../../textStyles";
import colors from "../../colors";

export const InputFieldWrapper = styled.div`
    width: 100%;
    padding: 0px;
    position: relative;
`;

export const Box = styled.div`
    position: relative;
`;

export const InputBox = styled.input<{ error: boolean; isDisabled: boolean }>`
    ${textStyles.HeadlineH600Regular};
    background: ${({ isDisabled }) =>
        isDisabled ? colors.neutral.p5 : colors.white};
    border-radius: 4px;
    width: 100%;
    height: 32px;
    box-sizing: border-box;
    padding: 7px 12px;
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

export const InputLabel = styled.div<{ isMandatory: boolean }>`
    ${textStyles.TextT200Semibold};
    color: ${colors.neutral.p60};
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
export const Description = styled.div`
    ${textStyles.LightTextT300Regular};
    color: ${colors.neutral.p70};
    margin-top: 8px;
`;

export const Error = styled.div`
    ${textStyles.TextT300Regular};
    color: ${colors.red.p3};
    margin-top: 8px;
`;
