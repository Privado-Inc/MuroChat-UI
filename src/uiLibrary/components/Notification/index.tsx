import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";
import Colors from "../../colors";
import TextStyles from "../../textStyles";
import Button from "../Button";

import CrossIcon from "assets/svg/cross.svg";
import successIcon from "assets/svg/successNotification.svg";
import alertIcon from "assets/svg/alertNotification.svg";
import errorIcon from "assets/svg/errorNotification.svg";

interface NotificationTP {
    heading: string;
    hideNotification?: number;
    subHeading: string;
    positions?: string;
    children?: ReactNode;
}

const DelButton = styled.span`
    cursor: pointer;
    display: flex;
    position: absolute;
    top: 12px;
    right: 12px;
`;

const Wrapper = styled.div`
    display: flex;
    margin-left: 16px;
    flex-direction: column;
`;

const InnerDiv = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    color: white;
    & span:first-child {
        ${TextStyles.TextT200Semibold}
        margin-bottom: 4px;
    }
    & span:last-child {
        ${TextStyles.TextT200Semibold}
        color: ${Colors.neutral.p60};
    }
`;

const Filler = styled.div`
    display: block;
    width: 100%;
    height: 12px;
`;

const Container = styled.div`
    position: relative;
    align-items: flex-start;
    width: 320px;
    word-break: break-word;
    box-sizing: border-box;
    padding: 12px;
    background-color: ${Colors.white};
    position: absolute;
    border-radius: 4px;
    z-index: 99999999;
    ${({ show, positions }: { show: boolean; positions: string }) => {
        return `
            display: ${show ? "flex" : "none"};
            ${positions}
        `;
    }}
`;

const SuccessContainer = styled(Container)`
    box-shadow: 0px 0px 2px rgba(135, 146, 157, 0.4),
        0px 8px 24px rgba(135, 146, 157, 0.15), inset 3px 0px 0px #1dc981;
`;

const AlertContainer = styled(Container)`
    box-shadow: 0px 0px 2px rgba(135, 146, 157, 0.4),
        0px 8px 24px rgba(135, 146, 157, 0.15), inset 3px 0px 0px #ffbc00;
`;

const ErrorContainer = styled(Container)`
    box-shadow: 0px 0px 2px rgba(135, 146, 157, 0.4),
        0px 8px 24px rgba(135, 146, 157, 0.15), inset 3px 0px 0px #ff7452;
`;
const ActionButtonWrapper = styled.div`
    display: flex;
`;
const PrimaryActionButton = styled(Button.Small)`
    margin-right: 8px;
`;
const SecondaryActionButton = styled(Button.Small)``;

const BaseNotification: React.FC<any> = ({
    icon,
    heading,
    hideNotification,
    subHeading,
    positions,
    StyleComponent,
    children
}) => {
    const [show, setShow] = useState(true);
    useEffect(() => {
        if (show) {
            setTimeout(() => setShow(false), hideNotification);
        }
        return () => {
            const node = document.querySelector("#notification");
            if (node) ReactDOM.unmountComponentAtNode(node);
        };
    }, [show]);
    return (
        <StyleComponent show={show} positions={positions}>
            {icon ? (
                <img
                    style={{ margin: "2px 0px 0px 4px" }}
                    src={icon}
                    alt="status"
                />
            ) : null}
            <Wrapper>
                <InnerDiv>
                    <span>{heading}</span>
                    <span>{subHeading}</span>
                </InnerDiv>
                <DelButton onClick={() => setShow(false)}>
                    <img src={CrossIcon} alt="removeButton" />
                </DelButton>
                {children && <Filler />}
                {children}
            </Wrapper>
        </StyleComponent>
    );
};

const Notification = ({
    heading,
    hideNotification,
    subHeading,
    positions,
    children
}: NotificationTP): ReactElement => {
    return (
        <BaseNotification
            heading={heading}
            hideNotification={hideNotification}
            StyleComponent={Container}
            subHeading={subHeading}
            positions={positions}
            icon={successIcon}>
            {children}
        </BaseNotification>
    );
};

const renderNotification = (NotificationComponent: ReactElement): void => {
    ReactDOM.render(
        NotificationComponent,
        document.querySelector("#notification")
    );
};

const Success = ({
    heading,
    hideNotification,
    subHeading,
    positions,
    children
}: NotificationTP): ReactElement => {
    return (
        <BaseNotification
            heading={heading}
            hideNotification={hideNotification}
            StyleComponent={SuccessContainer}
            subHeading={subHeading}
            positions={positions}
            icon={successIcon}>
            {children}
        </BaseNotification>
    );
};

const Alert = ({
    heading,
    hideNotification,
    subHeading,
    positions,
    children
}: NotificationTP): ReactElement => {
    return (
        <BaseNotification
            heading={heading}
            hideNotification={hideNotification}
            StyleComponent={AlertContainer}
            subHeading={subHeading}
            positions={positions}
            icon={alertIcon}>
            {children}
        </BaseNotification>
    );
};

const Error = ({
    heading,
    hideNotification,
    subHeading,
    positions,
    children
}: NotificationTP): ReactElement => {
    return (
        <BaseNotification
            heading={heading}
            hideNotification={hideNotification}
            StyleComponent={ErrorContainer}
            subHeading={subHeading}
            positions={positions}
            icon={errorIcon}>
            {children}
        </BaseNotification>
    );
};

Notification.Success = Success;
Notification.Alert = Alert;
Notification.Error = Error;

Notification.createNotification = ({
    type,
    title,
    subHeading,
    children
}: {
    type: string;
    title?: string;
    subHeading: string;
    children?: ReactNode;
}): void => {
    switch (type) {
        case "Success":
            renderNotification(
                <Notification.Success
                    heading={title || "Success Message"}
                    subHeading={subHeading}>
                    {children}
                </Notification.Success>
            );

            break;
        case "Error":
            renderNotification(
                <Notification.Error
                    heading={title || "Error Message"}
                    subHeading={subHeading}>
                    {children}
                </Notification.Error>
            );
            break;
        case "Alert":
            renderNotification(
                <Notification.Alert
                    heading={title || "Alert Message"}
                    subHeading={subHeading}>
                    {children}
                </Notification.Alert>
            );

            break;
        default:
            renderNotification(
                <Notification
                    heading={title || "Notification"}
                    subHeading={subHeading}>
                    {children}
                </Notification>
            );

            break;
    }
};

Notification.createNotificationWithButtons = ({
    type,
    subHeading,
    buttonLabel1,
    buttonLabel2,
    onClick1,
    onClick2
}: {
    type: string;
    subHeading: string;
} & {
    buttonLabel1: string;
    buttonLabel2: string;
    onClick1: () => void;
    onClick2: () => void;
}): void => {
    const NotificatiionActionButton = (
        <ActionButtonWrapper>
            <PrimaryActionButton
                tertiary
                label={buttonLabel1}
                onClick={onClick1}
            />
            <SecondaryActionButton
                tertiary
                label={buttonLabel2}
                onClick={onClick2}
            />
        </ActionButtonWrapper>
    );

    Notification.createNotification({
        type,
        subHeading,
        children: NotificatiionActionButton
    });
};

Notification.defaultProps = {
    hideNotification: 4000,
    positions: "top:10px;right:10px;"
};

Success.defaultProps = {
    hideNotification: 4000,
    positions: "top:10px;right:10px;"
};
Alert.defaultProps = {
    hideNotification: 4000,
    positions: "top:10px;right:10px;"
};
Error.defaultProps = {
    hideNotification: 4000,
    positions: "top:10px;right:10px;"
};

export default Notification;
