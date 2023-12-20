import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import colors from "../../colors";
import TextStyles from "../../textStyles";
import { ReactComponent as CrossIcon } from "assets/svg/darkCross.svg";

const node = document.querySelector("#dialog");

const CrossIconStyled = styled.span`
    display: flex;
    position: absolute;
    right: 16px;
    top: 16px;
    cursor: pointer;
    z-index: 1;
`;

const DailogOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    z-index: 999999;
    background-color: rgba(194, 200, 204, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DailogContainer = styled.div<{
    width?: string;
    height?: string;
    padding?: string;
}>`
    background: white;
    width: ${({ width }) => width || "512px"};
    height: ${({ height }) => height || "632px"};
    border-radius: 8px;
    background-color: ${colors.white};
    padding: ${({ padding }) => padding || "18px 24px 24px 24px"};
    box-sizing: border-box;
    position: relative;
    transform: scale(1);
    box-shadow: 0px 12px 24px rgba(37, 45, 51, 0.1);
`;

const LoaderContainer = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;
const LoaderContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const LoaderRing = styled.div`
    position: relative;
    animation: effect 1s linear infinite;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid ${colors.purple.p10};
    border-top-color: ${colors.purple.p50};
    margin-bottom: 16px;

    @keyframes effect {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
`;

const LoaderText = styled.div`
    ${TextStyles.HeadlineH400Regular}
`;

const renderDialog = ({
    children,
    close,
    enableCloseShortcuts,
    width,
    height,
    padding,
    disableCloseIcon
}: ReactElementChildren & {
    close: () => void;
    enableCloseShortcuts?: boolean;
    disableCloseIcon?: boolean;
    width?: string;
    height?: string;
    padding?: string;
}): ReactElement => {
    const container = React.createRef<HTMLDivElement>();

    return (
        <DailogOverlay
            onClick={(e: any) => {
                if (
                    container.current &&
                    enableCloseShortcuts &&
                    !container.current.contains(e.target)
                ) {
                    close();
                }
            }}>
            <DailogContainer
                padding={padding}
                width={width}
                height={height}
                ref={container}>
                {!disableCloseIcon && (
                    <CrossIconStyled onClick={() => close()}>
                        <CrossIcon />
                    </CrossIconStyled>
                )}
                {children}
            </DailogContainer>
        </DailogOverlay>
    );
};

const Dialog = ({
    children,
    onClose = () => ({}),
    enableCloseShortcuts = false,
    disableCloseIcon = false,
    width,
    height,
    padding
}: ReactElementChildren & {
    onClose: () => void;
    enableCloseShortcuts?: boolean;
    disableCloseIcon?: boolean;
    width?: string;
    height?: string;
    padding?: string;
}): React.ReactPortal => {
    const keyDownOnWindow = (e: KeyboardEvent): void => {
        if (e.key === "Escape" && enableCloseShortcuts) {
            onClose();
        }
    };
    React.useEffect(() => {
        window.addEventListener("keydown", keyDownOnWindow);
        return () => {
            window.removeEventListener("keydown", keyDownOnWindow);
        };
    }, [onClose]);

    if (!node) throw Error("Not able to find dialog node");

    return ReactDOM.createPortal(
        renderDialog({
            children,
            close: onClose,
            disableCloseIcon,
            enableCloseShortcuts,
            width,
            height,
            padding
        }),
        node
    );
};

Dialog.Loader = ({ label }: { label: string }): ReactElement => {
    return (
        <Dialog
            width="240px"
            height="128px"
            padding="24px"
            disableCloseIcon
            onClose={() => { }}>
            <LoaderContainer>
                <LoaderContent>
                    <LoaderRing />
                    <LoaderText>{label}</LoaderText>
                </LoaderContent>
            </LoaderContainer>
        </Dialog>
    );
};

export default Dialog;

