import React, { ReactElement } from "react";
import styled from "styled-components";

import DownArrow from "assets/svg/downArrow.svg";
import colors from "../../../colors";
import textStyles from "../../../textStyles";

import SelectedLabel from "./SelectedLabel";
import { DropdownData, InputProps } from "./types";

const Heading = styled.span`
    ${textStyles.TextT200Semibold}
    display: block;
    color: ${colors.neutral.p60};
    margin-bottom: 6px;
    &:hover {
        cursor: default;
    }
`;

const InputContainer = styled.div<{ active: boolean; isDisabled: boolean }>`
    display: flex;
    position: relative;
    width: 100%;
    min-height: 32px;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0px 27px 0px 12px;
    border: 1px solid
        ${({ active }) => (active ? colors.purple.p50 : colors.neutral.p30)};
    box-shadow: ${({ active }) =>
        active ? "0px 0px 8px rgba(29, 201, 129, 0.1)" : "none"};
    border-radius: 8px;
    background: ${({ isDisabled }) =>
        isDisabled ? colors.neutral.p20 : colors.white};
`;

const InputLabel = styled.span<{ isMandatory: boolean }>`
    position: relative;
    ${({ isMandatory }) =>
        isMandatory
            ? `
        &::after {
            position: relative;
            color: ${colors.red.p3};
            content: "*";
            left: 3px;
        }
    `
            : ""}
`;

const DropdownInput = styled.input`
    ${textStyles.HeadlineH600Regular}
    width: 100%;
    position: absolute;
    background: transparent;
    border-radius: 5px;
    outline: none;
    height: 100%;
`;

const FlexGrowInputContainer = styled.div`
    min-width: 100px;
    overflow: hidden;
    flex-grow: 1;
    box-sizing: border-box;
    position: relative;
    padding: 0px;
    height: 30px;
`;

const ArrowIcon = styled.span`
    position: absolute;
    right: 8px;
    top: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transform: rotateZ(
        ${({ editing }: { editing: boolean }) => (editing ? "180deg" : "0deg")}
    );
`;

const SelectedLabelWrapper = styled.div`
    display: flex;
    max-width: 100%;
    flex-wrap: wrap;
    position: absolute;
`;

const MultiSelectSelectedLabels = ({
    selected,
    onRemove
}: {
    selected: DropdownData[];
    onRemove: (a: DropdownData) => void;
}): ReactElement => {
    return (
        <>
            {selected.map((selectedValue: DropdownData) => (
                <SelectedLabel
                    key={selectedValue.key}
                    data={selectedValue}
                    onRemove={(item: DropdownData) => onRemove(item)}
                />
            ))}
        </>
    );
};

export default ({
    value,
    containerRef,
    label,
    isMandatory,
    isOpen,
    onchange,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    placeholder,
    isShowArrowIcon,
    toggleDropdown,
    separateSelected,
    isDisabled,
    ...restProps
}: InputProps): ReactElement => {
    return (
        <>
            {label && (
                <Heading>
                    <InputLabel isMandatory={!!isMandatory}>{label}</InputLabel>
                </Heading>
            )}
            <InputContainer
                isDisabled={!!isDisabled}
                active={isOpen}
                className="input-container"
                ref={containerRef}>
                {!separateSelected && "isMulti" in restProps && (
                    <MultiSelectSelectedLabels
                        selected={restProps.selected}
                        onRemove={restProps.onRemove}
                    />
                )}
                <FlexGrowInputContainer>
                    <DropdownInput
                        disabled={!!isDisabled}
                        data-name="allowedClick"
                        onChange={(e) => onchange(e.target.value)}
                        onClick={(e) => onClick && !isDisabled && onClick(e)}
                        onKeyDown={onKeyDown}
                        value={value}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </FlexGrowInputContainer>
                {isShowArrowIcon && toggleDropdown && (
                    <ArrowIcon
                        editing={isOpen}
                        onClick={(e) => !isDisabled && toggleDropdown(e)}>
                        <img src={DownArrow} alt="updownarrow" />
                    </ArrowIcon>
                )}
            </InputContainer>
            {separateSelected && (
                <SelectedLabelWrapper>
                    {"isMulti" in restProps && (
                        <MultiSelectSelectedLabels
                            selected={restProps.selected}
                            onRemove={restProps.onRemove}
                        />
                    )}
                </SelectedLabelWrapper>
            )}
        </>
    );
};
