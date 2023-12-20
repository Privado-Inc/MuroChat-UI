import styled from "styled-components";
import { ReactComponent as NoBookmarkInfoIcon } from "assets/svg/noBookmarkInfo.svg";
import React, { ReactElement } from "react";
import colors from "uiLibrary/colors";
import TextStyles from "uiLibrary/textStyles";

export const NoBookmarkContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
`

export const NoBookmarkTitle = styled.div`
    align-self: stretch;
    color: ${colors.neutral.p85};
    font-feature-settings: 'salt' on;

    ${TextStyles.HeadlineH400Bold};
`

export const NoBookmarkMessage = styled.div`
    align-self: stretch;
    color: ${colors.neutral.p80};
    font-feature-settings: 'salt' on;

    ${TextStyles.HeadlineH600Regular};
`

export const NoBookmarks = ({
    showWhat
}: {
    showWhat: string,
}): ReactElement => {
    return (
        <NoBookmarkContainer>
            <NoBookmarkInfoIcon />
            <div>
                <NoBookmarkTitle>
                    You have no {showWhat !== "bookmarks" ? showWhat + " bookmarked" : "bookmarks"} at the moment.</NoBookmarkTitle>
                <NoBookmarkMessage>
                    Tap on the Bookmark icon below a message to show it here.
                </NoBookmarkMessage>
            </div>
        </NoBookmarkContainer>
    )
}

