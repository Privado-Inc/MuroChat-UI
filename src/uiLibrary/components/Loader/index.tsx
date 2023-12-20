import React, { ReactElement } from "react";
import styled from "styled-components";

import colors from "../../colors";

type LoaderProps = {
    complete?: boolean;
    style?: React.CSSProperties;
};

const ProgressContainer = styled.div`
    position: relative;
    width: 100%;
    background: ${colors.purple.p10};
`;

const Loader = styled.div`
    height: 4px;
    background: ${colors.purple.p50};
    animation: ${({ complete }: LoaderProps) =>
        !complete
            ? "fillLoader 2.5s cubic-bezier(0, 0, 0, 0.56) forwards"
            : "completeBar 0.2s linear forwards"};
    @keyframes fillLoader {
        0% {
            width: 0%;
        }
        100% {
            width: 95%;
        }
    }
    @keyframes completeBar {
        0% {
            width: 95%;
        }
        100% {
            width: 100%;
        }
    }
`;

export default ({ complete, style }: LoaderProps): ReactElement => {
    return (
        <ProgressContainer style={style}>
            <Loader complete={complete} />
        </ProgressContainer>
    );
};
