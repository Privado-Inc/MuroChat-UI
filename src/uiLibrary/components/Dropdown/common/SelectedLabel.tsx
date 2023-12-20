import React, { ReactElement } from "react";
import styled from "styled-components";

import DropdownCross from "assets/svg/dropdownCross.svg";
import colors from "../../../colors";
import textStyles from "../../../textStyles";

import { DropdownData } from "./types";

const SelectedSpan = styled.span`
    ${textStyles.TextT200Regular}
    background: ${colors.neutral.p5};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 4px;
    flex-shrink: 0;
    padding: 3px 8px;
    margin-right: 4px;
    height: 24px;
    margin: 3px 4px 3px 0px;
`;

const CrossIcon = styled.img`
    margin-left: 2px;
    cursor: pointer;
`;

export default ({
    data,
    onRemove
}: {
    data: DropdownData;
    onRemove: (data: DropdownData) => void;
}): ReactElement => (
    <SelectedSpan key={data.key}>
        {data.label}
        <CrossIcon
            src={DropdownCross}
            onClick={(e) => {
                e.stopPropagation();
                onRemove(data);
            }}
            alt="Remove"
        />
    </SelectedSpan>
);
