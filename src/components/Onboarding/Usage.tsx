import React from "react";
import { StatisticalData } from "services/chatBackendUIType";
import styled from "styled-components";
import { Colors, TextStyles } from "uiLibrary/index";

const UsageTable = styled.table`
    margin: 10px;
    & th{
        border-bottom: 1px solid ${Colors.neutral.p30};
    }
`;

const UserGroup = styled.div`
    font-feature-settings: 'salt' on;

    ${TextStyles.ParagraphP250};
    color: ${Colors.neutral.p85};
    width: 555px;
    margin: 8px 0;
    text-align: left;
`;
const PromptsSent = styled.div`
    text-align: right;
    font-feature-settings: 'salt' on;

    ${TextStyles.HeadlineH600boldLight}
    color: ${Colors.purple.p50};
    width: 190px;
`;

const DataReactions = styled.div`
    text-align: right;
    font-feature-settings: 'salt' on;
    ${TextStyles.ParagraphP250};
    color: ${Colors.neutral.p85};
    width: 190px;
`;

export default ({
    data
}: {
    data: StatisticalData[]
}) => {

    return (
        <UsageTable>
            <tr>
                <th>
                    <UserGroup>User Group</UserGroup>
                </th>
                <th><PromptsSent>Prompts Sent</PromptsSent></th>
                <th><DataReactions>Data Redactions</DataReactions></th>
            </tr>
            {data.map((d: StatisticalData) => {
                return (
                    <tr key={d.userGroup}>
                        <td><UserGroup>{d.userGroup}</UserGroup></td>
                        <td><PromptsSent>{d.totalMessageCount}</PromptsSent></td>
                        <td><DataReactions>{d.totalPiiCount}</DataReactions></td>
                    </tr>)
            })}
        </UsageTable>
    )

}