import styled from "styled-components";
import TextStyles from "../../textStyles";
import { UserIconColorPalette } from "./utils";

export const UserIconWrapper = styled.div<{ mainInitial: string }>`
    height: 24px;
    width: 24px;
    border-radius: 12px;
    display: flex;
    justify-conten: center;
    align-items: center;
    background-color: ${({ mainInitial }) =>
        mainInitial in UserIconColorPalette
            ? UserIconColorPalette[mainInitial]
            : UserIconColorPalette.V};
`;

export const UserInitials = styled.p`
    ${TextStyles.TextT300Semibold}
    color: white;
    margin: 0 auto;
`;
