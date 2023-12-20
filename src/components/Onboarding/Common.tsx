import React from "react";
import styled from "styled-components";
import { Colors } from "uiLibrary/index";
import TextStyles from "uiLibrary/textStyles";

export const InprogressLabel = styled.span`
    ${TextStyles.TextT200Semibold};
    color: ${Colors.purple.p50};
    align-items: center;
    justify-content: center;
    display: flex;
`;

export const CompletedLabel = styled.span`
    ${TextStyles.TextT200Semibold};
    color: ${Colors.green.p60};
    align-items: center;
    justify-content: center;
    display: flex;
`;

export const Row = styled.div`
    display: flex;
    width: 70%;
`;

export const InputColumn = styled.div`
    flex: 3;
    & .input-container {
        height: auto;
    }
`;

export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
`;

export const Content = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    gap: 24px;
`;

export const LabelColumn = styled.div<{ addMargin?: boolean }>`
    flex: 2;
    ${TextStyles.TextT100Semibold};
    color: ${Colors.neutral.p80};
    display: flex;
    justify-content: start;
    gap: 10px;
    align-items: center;
    ${({ addMargin }) => (addMargin ? "margin-bottom: 40px;" : "")}
`;

export const LabelColumnValue = styled.div<{ addMargin?: boolean }>`
    flex: 2;
    ${TextStyles.TextT200Regular};
    color: ${Colors.neutral.p80};
    display: flex;
    justify-content: start;
    gap: 10px;
    align-items: center;
    ${({ addMargin }) => (addMargin ? "margin-bottom: 40px;" : "")}
`;

export const Pill = styled.div`
    border-radius: 12px;
    border: 1px solid ${Colors.neutral.p40};
    background: ${Colors.neutral.p10};
    margin-right: 8px;
    padding: 3px 8px;
`;

export const InputRowReadModeWithValues = ({ value, title }: { value: string; title: string }) => {
    return (
        <Row>
            <LabelColumn>{title}</LabelColumn>
            <InputColumn>
                {value ? (
                    <LabelColumn>
                        {value
                            .split(",")
                            .filter((a) => !!a.trim())
                            .map((groupName, index) => {
                                return <Pill key={index}>{groupName}</Pill>;
                            })}
                    </LabelColumn>
                ) : (
                    " - "
                )}
            </InputColumn>
        </Row>
    );
};

export const InputRowReadMode = ({ value, title }: { value: string; title: string }) => {
    return (
        <Row>
            <LabelColumn>{title}</LabelColumn>
            <InputColumn>
                <LabelColumnValue>{value}</LabelColumnValue>
            </InputColumn>
        </Row>
    );
};

export const ModelTypes = {
    gpt: [
        {
            label: "gpt-3.5-turbo",
            key: "gpt-3.5-turbo"
        },
        {
            label: "gpt-3.5-turbo-0301",
            key: "gpt-3.5-turbo-0301"
        },
        {
            label: "gpt-3.5-turbo-0613",
            key: "gpt-3.5-turbo-0613"
        },
        {
            label: "gpt-3.5-turbo-16k",
            key: "gpt-3.5-turbo-16k"
        },
        {
            label: "gpt-3.5-turbo-16k-0613",
            key: "gpt-3.5-turbo-16k-0613"
        },
        {
            label: "gpt-4",
            key: "gpt-4"
        }
    ],
    llama: [
        {
            key: "Llama 2",
            label: "Llama 2"
        }
    ]
};
