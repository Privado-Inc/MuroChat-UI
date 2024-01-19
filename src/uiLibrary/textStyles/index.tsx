import { css, FlattenSimpleInterpolation } from "styled-components";
import colors from "../colors";

const generateStyle = (
    fontSize: number,
    fontWeight: number,
    color: string,
    fontStyle: string,
    lineHeight: number
): FlattenSimpleInterpolation => {
    return css`
        font-size: ${fontSize}px;
        font-weight: ${fontWeight};
        color: ${color};
        font-style: ${fontStyle};
        line-height: ${lineHeight}px;
    `;
};

const HeadlineH100 = {
    HeadlineH100Regular: css`
        ${generateStyle(36, 400, colors.neutral.p90, "normal", 44)}
    `,
    HeadlineH100Semibold: css`
        ${generateStyle(36, 500, colors.neutral.p90, "normal", 44)}
    `,
    HeadlineH100Bold: css`
        ${generateStyle(36, 600, colors.neutral.p90, "normal", 46)}
    `
};

const HeadlineH200 = {
    HeadlineH200Regular: css`
        ${generateStyle(24, 400, colors.neutral.p90, "normal", 32)}
    `,
    HeadlineH200Semibold: css`
        ${generateStyle(24, 500, colors.neutral.p90, "normal", 32)}
    `
};

const HeadlineH300 = {
    HeadlineH300Regular: css`
        ${generateStyle(20, 400, colors.neutral.p90, "normal", 32)}
    `,
    HeadlineH300Semibold: css`
        ${generateStyle(20, 500, colors.neutral.p90, "normal", 28)}
    `
};

const HeadlineH400 = {
    HeadlineH400Regular: css`
        ${generateStyle(18, 400, colors.neutral.p90, "normal", 24)}
    `,
    HeadlineH400Semibold: css`
        ${generateStyle(18, 500, colors.neutral.p90, "normal", 24)}
    `,
    HeadlineH400Bold: css`
        ${generateStyle(18, 600, colors.neutral.p90, "normal", 24)}
    `
};

const HeadlineH500 = {
    HeadlineH500Small: css`
        ${generateStyle(16, 400, colors.neutral.p90, "normal", 21)}
    `,
    HeadlineH500Regular: css`
        ${generateStyle(16, 400, colors.neutral.p90, "normal", 24)}
    `,
    HeadlineH500Semibold: css`
        ${generateStyle(16, 500, colors.neutral.p90, "normal", 24)}
    `,
    HeadlineH500Big: css`
        ${generateStyle(16, 500, colors.neutral.p90, "normal", 21)}
    `,
    HeadlineH500Bold: css`
        ${generateStyle(16, 600, colors.neutral.p90, "normal", 21)}
    `
};

const HeadlineH600 = {
    HeadlineH600Regular: css`
        ${generateStyle(14, 400, colors.neutral.p90, "normal", 18)}
    `,
    HeadlineH600bold: css`
        ${generateStyle(14, 600, colors.neutral.p90, "normal", 18)}
    `,
    HeadlineH600boldLight: css`
        ${generateStyle(14, 600, colors.neutral.p80, "normal", 20)}
    `
};

const TextT100 = {
    TextT100Regular: css`
        ${generateStyle(14, 400, colors.neutral.p90, "normal", 18)}
    `,
    TextT100Semibold: css`
        ${generateStyle(14, 500, colors.neutral.p90, "normal", 18)}
    `,
    TextT100SemiDark: css`
        ${generateStyle(14, 500, colors.neutral.p90, "normal", 20)}
    `,
    TextT100Link: css`
        ${generateStyle(14, 500, colors.neutral.p90, "normal", 18)}
        text-decoration: underline;
    `
};

const TextT200 = {
    TextT200Regular: css`
        ${generateStyle(13, 400, colors.neutral.p90, "normal", 18)}
    `,
    TextT200Semibold: css`
        ${generateStyle(13, 500, colors.neutral.p90, "normal", 18)}
    `,
    TextT200Link: css`
        ${generateStyle(13, 500, colors.neutral.p90, "normal", 18)}
        text-decoration: underline;
    `
};

const TextT300 = {
    TextT300Regular: css`
        ${generateStyle(13, 400, colors.neutral.p90, "normal", 16)}
    `,
    TextT300Semibold: css`
        ${generateStyle(13, 500, colors.neutral.p90, "normal", 16)}
    `,
    TextT300Link: css`
        ${generateStyle(13, 500, colors.neutral.p90, "normal", 16)}
        text-decoration: underline;
    `
};

const CaptionC100 = {
    CaptionC100Regular: css`
        ${generateStyle(11, 400, colors.neutral.p90, "normal", 16)}
        letter-spacing: 0.04em;
    `,

    CaptionC100Semibold: css`
        ${generateStyle(11, 500, colors.neutral.p90, "normal", 16)}
        letter-spacing: 0.04em;
    `
};

const TextStyles = {
    ...HeadlineH100,
    ...HeadlineH200,
    ...HeadlineH300,
    ...HeadlineH400,
    ...HeadlineH500,
    ...HeadlineH600,
    ...TextT100,
    ...TextT200,
    ...TextT300,
    ...CaptionC100,
    ParagraphP100: css`
        ${generateStyle(16, 400, colors.neutral.p90, "normal", 24)}
    `,
    ParagraphP200: css`
        ${generateStyle(14, 400, colors.neutral.p90, "normal", 22)}
    `,
    ParagraphP250: css`
        ${generateStyle(14, 400, colors.neutral.p80, "normal", 20)}
    `,
    ParagraphP300: css`
        ${generateStyle(13, 400, colors.neutral.p70, "normal", 20)}
    `,
    LightHeadlineH400Regular: css`
        ${generateStyle(18, 400, colors.neutral.p60, "normal", 24)}
    `,
    LightTextT300Regular: css`
        ${generateStyle(13, 400, colors.neutral.p60, "normal", 16)}
    `,
    LightTextT300Semibold: css`
        ${generateStyle(14, 500, colors.white, "normal", 18)}
    `
};

export default TextStyles;
