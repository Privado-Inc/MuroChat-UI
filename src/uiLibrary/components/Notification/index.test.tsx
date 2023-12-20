import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import { act } from "react-dom/test-utils";
import Notification from "./index";

afterEach(cleanup);

describe("Notification", () => {
    const Heading = "Notification";
    const SubHeading = "Notification sub-heading";
    test("Success Notification should display text with proper styles", () => {
        const { container } = render(
            <Notification.Success heading={Heading} subHeading={SubHeading} />
        );
        const NotiContainer = container.querySelector("div");
        if (NotiContainer === null) throw new Error("Notification is null");
        expect(screen.getByText(Heading)).toBeInTheDocument();
        expect(screen.getByText(SubHeading)).toBeInTheDocument();
        expect(NotiContainer).toHaveStyle(
            "box-shadow: 0px 0px 2px rgba(135,146,157,0.4),0px 8px 24px rgba(135,146,157,0.15),inset 3px 0px 0px #1dc981;"
        );
    });
    test("Alert Notification should display text with proper styles", () => {
        const { container } = render(
            <Notification.Alert heading={Heading} subHeading={SubHeading} />
        );
        const NotiContainer = container.querySelector("div");
        if (NotiContainer === null) throw new Error("Notification is null");
        expect(screen.getByText(Heading)).toBeInTheDocument();
        expect(screen.getByText(SubHeading)).toBeInTheDocument();
        expect(NotiContainer).toHaveStyle(
            "box-shadow: 0px 0px 2px rgba(135,146,157,0.4),0px 8px 24px rgba(135,146,157,0.15),inset 3px 0px 0px #ffbc00;"
        );
    });
    test("Error Notification should display text with proper styles", () => {
        const { container } = render(
            <Notification.Error heading={Heading} subHeading={SubHeading} />
        );
        const NotiContainer = container.querySelector("div");
        if (NotiContainer === null) throw new Error("Notification is null");
        expect(screen.getByText(Heading)).toBeInTheDocument();
        expect(screen.getByText(SubHeading)).toBeInTheDocument();
        expect(NotiContainer).toHaveStyle(
            "box-shadow: 0px 0px 2px rgba(135,146,157,0.4),0px 8px 24px rgba(135,146,157,0.15),inset 3px 0px 0px #ff7452;"
        );
    });

    test("Notification should close onclicking cross button.", async () => {
        const { container } = render(
            <Notification heading={Heading} subHeading={SubHeading} />
        );
        const CrossButton = screen.getByAltText("removeButton");
        if (CrossButton === null)
            throw new Error("CrossButton in Notification is null");

        fireEvent.click(CrossButton);
        expect(container.querySelector("div")).not.toBeVisible();
    });
    test("Notification should close after given time", async () => {
        const { container } = render(
            <Notification
                heading={Heading}
                hideNotification={1000}
                subHeading={SubHeading}
            />
        );

        await act(async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(container.querySelector("div")).not.toBeVisible();
                    resolve();
                }, 1050);
            });
        });
    });
    test("Notification should render passed component.", () => {
        const { container } = render(
            <Notification.Success heading={Heading} subHeading={SubHeading}>
                <h1>Hello</h1>
            </Notification.Success>
        );
        expect(container.querySelector("h1")).toHaveTextContent("Hello");
    });
});
