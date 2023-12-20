import styled from "styled-components";
import { ReactComponent as NoshareInfoIcon } from "assets/svg/noBookmarkInfo.svg";
import React, { ReactElement } from "react";
import colors from "uiLibrary/colors";
import TextStyles from "uiLibrary/textStyles";

export const NoshareContainer = styled.div`
    gap: 8px;
    align-self: stretch;
    display: flex;
    width: 65%;
    align-items: center;
    height: 200px;
    margin: -50px 240px auto;

    & > svg {
        flex: 30px 0 0;
    }
`

export const NoshareTitle = styled.div`
    align-self: stretch;
    color:${colors.neutral.p85};
    ${TextStyles.HeadlineH400Semibold}
`

export const NoshareMessage = styled.div`
    color:${colors.neutral.p80};
    ${TextStyles.TextT100Regular}
`

export default () => {
    return (
        <NoshareContainer>
            <NoshareInfoIcon />
            <div>
                <NoshareTitle>
                    You have no Shared Chats at the moment.
                </NoshareTitle>
                <NoshareMessage>
                    Click the Share icon on a chat to share it with your colleagues. Import chats shared by your colleagues by opening the link they shared.
                </NoshareMessage>
            </div>
        </NoshareContainer>
    )
}

