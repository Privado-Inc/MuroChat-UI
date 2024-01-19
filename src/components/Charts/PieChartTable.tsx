
import React from "react";
import { TopRedactedSensitiveData } from "services/chatBackendUIType";
import styled from "styled-components";
import { Colors } from "uiLibrary/index";
import TextStyles from "uiLibrary/textStyles";

const PieChartTable = styled.table`
    width: 100%;
    margin-right: 30px;
`;

const Colour = styled.div`

`;
const Label = styled.div`
    width: 140px;
    font-feature-settings: 'salt' on;
    ${TextStyles.ParagraphP250};
`;

const Value = styled.div`
    text-align: right;
    font-feature-settings: 'salt' on;
    ${TextStyles.HeadlineH600boldLight};
`;

export default ({
    data
}: {
    data: TopRedactedSensitiveData[]
}) => {

    return (
        <PieChartTable>
            {data.map(d => {
                return <tr key={d.label}>
                    <td>
                        <Colour>
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <circle cx="4" cy="4" r="4" fill={d.colour} />
                            </svg>
                        </Colour>
                    </td>
                    <td><Label>{d.label}</Label></td>
                    <td><Value>{d.value}</Value></td>
                </tr>
            })}
        </PieChartTable>
    );
}