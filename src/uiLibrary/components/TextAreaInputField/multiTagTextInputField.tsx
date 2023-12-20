import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import * as R from "ramda";
import textStyles from "../../textStyles";
import colors from "../../colors";
import DropdownCross from "assets/svg/dropdownCross.svg";
import { InputFieldWrapper, InputLabel, Description, Error } from "./styled";

const EnterKeycode = 13;
const SpaceKeycode = 32;
const CommaKeycode = 188;

type ResizeType = "vertical" | "horizontal" | "both";

const InputContainer = styled.div<{ active: boolean; resize?: ResizeType }>`
    display: flex;
    align-content: flex-start;
    position: relative;
    width: 100%;
    min-height: 70px;
    overflow: auto;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0px 12px;
    border: 1px solid
        ${({ active }) => (active ? colors.purple.p50 : colors.neutral.p30)};
    border-radius: 5px;
    background: ${colors.white};
    ${({ resize }) =>
        resize
            ? css`
                  resize: ${resize};
              `
            : ""}
`;
const FlexGrowInputContainer = styled.div`
    min-width: 100px;
    overflow: hidden;
    height: 32px;
    box-sizing: border-box;
    position: relative;
    padding: 0px;
`;

const InputBox = styled.input<{ showPlaceholder: boolean }>`
    ${textStyles.HeadlineH600Regular}
    width: 100%;
    position: absolute;
    background: transparent;
    border-radius: 5px;
    outline: none;
    height: 100%;
    ${({ showPlaceholder }) =>
        !showPlaceholder
            ? css`
                  &::placeholder {
                      color: transparent;
                  }
              `
            : ""}
`;

const SelectedSpan = styled.span`
    ${textStyles.TextT200Regular}
    background: ${colors.neutral.p5};
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    border-radius: 4px;
    flex-shrink: 0;
    padding: 3px 8px;
    margin-right: 4px;
    height: 24px;
    margin: 4px 4px 0px 0px;
    display: flex;
    align-items: center;
`;

const CrossIcon = styled.img`
    margin-left: 2px;
    cursor: pointer;
    width: 8px;
    margin-left: 10px;
`;

type ElementType = { key: number; label: string };

const SelectedElements = ({
    selected,
    onRemove
}: {
    selected: ElementType[];
    onRemove: (a: ElementType) => void;
}): ReactElement => {
    return (
        <>
            {selected.map((selectedValue) => (
                <SelectedSpan key={selectedValue.key}>
                    {selectedValue.label}
                    <CrossIcon
                        src={DropdownCross}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(selectedValue);
                        }}
                        alt="Remove"
                    />
                </SelectedSpan>
            ))}
        </>
    );
};

const MultiTagTextInputField = ({
    label,
    value,
    onChange,
    splitterKeyCode,
    splitter = " ",
    placeholder,
    isMandatory = false,
    description,
    disabled,
    resize,
    error,
    className = ""
}: {
    value: string;
    splitter?: string,
    splitterKeyCode?: number;
    onChange: (a: string) => void;
    isMandatory?: boolean;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    resize?: ResizeType;
    description?: string;
    className?: string;
}): ReactElement => {
    const [isActive, setActive] = React.useState(false);
    const [textValue, setTextValue] = React.useState("");
    const [elements, setElements] = React.useState(
        value.trim() ? value.split(splitter) : []
    );
    const inputBox = React.createRef<HTMLInputElement>();

    React.useEffect(() => {
        if (!R.equals([...value.trim().split(splitter)], elements)) {
            setElements(value.trim() ? [...value.trim().split(splitter)] : []);
        }
    }, [value]);

    React.useEffect(() => {
        if (isActive && inputBox.current) {
            inputBox.current.focus();
        }
    }, [isActive]);

    const onRemoveElement = React.useCallback(
        (item: ElementType): void => {
            const newElements = [...elements];
            newElements.splice(item.key, 1);
            // setElements(newElements);
            onChange(newElements.join(splitter));
        },
        [elements]
    );
    const outOnBlur = (): void => {
        setActive(false);
        if (textValue.trim()) {
            const newElements = [...elements, ...textValue.trim().split(splitter)];
            // setElements(newElements);
            setTextValue("");
            onChange(newElements.join(splitter));
        }
    };

    return (
        <InputFieldWrapper className={className}>
            {label && (
                <InputLabel isMandatory={isMandatory}>{label}</InputLabel>
            )}
            <InputContainer
                resize={resize}
                style={disabled ? { pointerEvents: "none" } : {}}
                onClick={() => setActive(true)}
                active={isActive}>
                {elements.length > 0 && (
                    <SelectedElements
                        selected={elements.map((item, index) => ({
                            key: index,
                            label: item
                        }))}
                        onRemove={onRemoveElement}
                    />
                )}
                <FlexGrowInputContainer className="multi-input-wrapper">
                    <InputBox
                        ref={inputBox}
                        onBlur={outOnBlur}
                        data-name="allowedClick"
                        onChange={(e) => setTextValue(e.target.value)}
                        value={textValue}
                        placeholder={placeholder}
                        showPlaceholder={value.length === 0}
                        onKeyDown={(e) => {
                            if (
                                textValue.trim() &&
                                (e.which === EnterKeycode || (
                                    splitterKeyCode ? e.which === splitterKeyCode : (e.which === SpaceKeycode || e.which === CommaKeycode)
                                ))
                            ) {
                                const newElements = [
                                    ...elements,
                                    ...textValue.trim().split(splitter)
                                ];
                                // setElements(newElements);
                                setTextValue("");
                                onChange(newElements.join(splitter));
                                e.preventDefault();
                            } else if (
                                e.which === 8 &&
                                (!textValue || textValue === splitter) &&
                                elements.length
                            ) {
                                const newElements = [...elements];
                                newElements.pop();
                                // setElements(newElements);
                                onChange(newElements.join(splitter));
                            }
                        }}
                    />
                </FlexGrowInputContainer>
            </InputContainer>
            {description && <Description>{description}</Description>}
            {error && <Error>{error}</Error>}
        </InputFieldWrapper>
    );
};

export default MultiTagTextInputField;
