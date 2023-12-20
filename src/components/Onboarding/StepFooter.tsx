import React from "react";
import styled from "styled-components";
import { Button } from "uiLibrary/components";
import { Colors } from "uiLibrary/index";

const StepFooter = styled.div`
    display: flex;
    padding: 20px 0 0;
    justify-content: space-between;
    border-top: 1.5px solid ${Colors.neutral.p30};
`;

export default ({
    nextLabel = "Next",
    hidePrevious = false,
    onNext = () => {},
    onPrevious = () => {},
    nextDisabled = false,
    previousDisabled = false
}: {
    hidePrevious?: boolean;
    nextDisabled?: boolean;
    previousDisabled?: boolean;
    nextLabel?: string;
    onNext?: () => void;
    onPrevious?: () => void;
}) => {
    return (
        <StepFooter>
            {!hidePrevious ? (
                <Button.Medium tertiary label="Previous" isDisabled={previousDisabled} onClick={onPrevious} />
            ) : (
                <span />
            )}
            <Button.Medium secondary label={nextLabel} isDisabled={nextDisabled} onClick={onNext} />
        </StepFooter>
    );
};
