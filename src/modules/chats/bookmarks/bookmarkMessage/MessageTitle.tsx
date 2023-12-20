import styled from "styled-components";
import { ReactComponent as ChatIcon } from "assets/svg/chatDark.svg";
import React, { ReactElement } from "react";
import colors from "uiLibrary/colors";
import moment from "moment";
import TextStyles from "uiLibrary/textStyles";


const TitleContainer = styled.div`
display: flex;
padding: 8px 24px;
align-items: center;
gap: 4px;
align-self: stretch;

border-bottom: 1px solid ${colors.neutral.p30};
`;

const TitleContent = styled.div`
flex: 1 0 0;

color: ${colors.neutral.p85};
font-feature-settings: 'salt' on;

${TextStyles.TextT100Regular};
`;

const TitleTimstamp = styled.div`
color: ${colors.neutral.p85};
${TextStyles.TextT200Regular};
`;


export const MessageTitle = ({
    title,
    modifiedAt
}: {
    title: string,
    modifiedAt?: string,
}): ReactElement => {
    return (
        <TitleContainer>
            <ChatIcon style={{ width: "24px", height: "24px", marginRight: "4px" }} />
            <TitleContent>
                {title}
            </TitleContent>
            <TitleTimstamp>
                {modifiedAt && (moment(new Date(modifiedAt)).format("DD MMMM YYYY · HH:mm A"))}
            </TitleTimstamp>
        </TitleContainer>
    )
}

