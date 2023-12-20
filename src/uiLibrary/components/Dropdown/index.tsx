import React, { ReactElement, useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";

import List from "./common/List";
import Input from "./common/Input";
import { DropdownData } from "./common/types";

const DropDownContainer = styled.div`
    width: 100%;
    position: relative;
`;

type Dropdown = {
    label?: string;
    value: DropdownData[];
    multiSelect?: boolean;
    list: DropdownData[];
    isMandatory?: boolean;
    className?: string;
    placeholder: string;
    onChange: (a: DropdownData[]) => void;
    disabled?: boolean;
    isShowArrowIcon?: boolean;
    separateSelected?: boolean;
    onClickAddNew?: () => void;
    onSearchText?: (a: string) => void;
};

const addOrRemoveItem = (
    items: DropdownData[],
    item: DropdownData
): DropdownData[] => {
    if (!item) return items;

    const found = items.find((a) => a.key === item.key);

    if (found) {
        return items.filter((a) => a.key !== item.key);
    }
    return [...items, item];
};

export default ({
    label = "",
    multiSelect = true,
    value,
    placeholder,
    isShowArrowIcon = true,
    isMandatory = false,
    onChange,
    className,
    list,
    separateSelected = false,
    disabled,
    onClickAddNew,
    onSearchText
}: Dropdown): ReactElement => {
    const [isOpen, openDropdown] = useState(false);
    const [higlightedIndex, setHighlightedIndex] = useState(-1);
    const [hasUserTyped, userTyped] = useState(false);
    const [textValue, setTextValue] = useState(
        !multiSelect && value.length > 0 ? value[0].label : ""
    );
    const [suggestions, setSuggestions] = useState(list);

    const dropDownInput = React.createRef<HTMLInputElement>();
    const container = React.createRef<HTMLDivElement>();
    const listContainer = React.createRef<HTMLDivElement>();

    useEffect(() => {
        setTextValue(!multiSelect && value.length > 0 ? value[0].label : "");
    }, [value]);

    useEffect(() => {
        const LabelList = (list || []).map((li) => li.label);
        if (
            value.length > 0 &&
            value.filter((val) => R.includes(val.label, LabelList)).length !==
            value.length
        ) {
            onChange([]);
            setTextValue("");
        }
        if (!R.equals(suggestions, list)) {
            setSuggestions(list);
        }
    }, [list]);

    useEffect(() => {
        if (!hasUserTyped) {
            return;
        }
        const newSuggestions = list
            .sort((a, b) => (a.label as any) - (b.label as any))
            .filter(
                (sItem) =>
                    sItem.label
                        .toLowerCase()
                        .indexOf(textValue.trim().toLowerCase()) >= 0
            );

        if (newSuggestions.length === 1) {
            setHighlightedIndex(0);
        }
        setSuggestions(newSuggestions);
    }, [textValue]);

    useEffect(() => {
        if (!hasUserTyped) {
            if (list.length === 1) setHighlightedIndex(0);
            setSuggestions(list);
        }
    }, [hasUserTyped, isOpen]);

    useEffect((): any => {
        if (
            isOpen &&
            listContainer.current &&
            window.document.elementFromPoint
        ) {
            const rect = listContainer.current.getBoundingClientRect();
            const isVisible = listContainer.current.contains(
                window.document.elementFromPoint(
                    rect.left + 30,
                    rect.top + rect.height - (rect.height < 40 ? 5 : 20)
                )
            );
            if (!isVisible) {
                listContainer.current.classList.add("upwardDirection");
            }
        }
        if (isOpen && dropDownInput.current) {
            dropDownInput.current.focus();
        }
    }, [isOpen]);

    const onWindowClick = (e: any): void => {
        if (container.current && !container.current.contains(e.target)) {
            if (multiSelect) {
                setTextValue("");
            } else {
                setTextValue(value.length > 0 ? value[0].label : "");
            }
            openDropdown(false);
            userTyped(false);
            setHighlightedIndex(-1);
        }
    };

    useEffect(() => {
        window.addEventListener("click", onWindowClick);
        return () => {
            window.removeEventListener("click", onWindowClick);
        };
    }, [container]);

    const props = multiSelect
        ? {
            isMulti: true,
            selected: value,
            onRemove: (item: DropdownData) => {
                if (multiSelect && Array.isArray(value))
                    onChange(value.filter((c) => c.key !== item.key));
                else onChange([]);
            }
        }
        : null;

    return (
        <DropDownContainer
            style={disabled ? { pointerEvents: "none" } : {}}
            className={className}
            onClick={() => !disabled && openDropdown(true)}>
            <Input
                {...(props || {})}
                containerRef={container}
                isDisabled={disabled}
                value={textValue}
                label={label}
                isMandatory={isMandatory}
                separateSelected={separateSelected}
                isOpen={isOpen}
                onchange={(changedValue) => {
                    if (!isOpen) {
                        openDropdown(true);
                    }
                    userTyped(true);
                    setHighlightedIndex(-1);
                    setTextValue(changedValue);
                    if (onSearchText) onSearchText(changedValue);
                }}
                onClick={(e: any) => {
                    if (e.target) (e.target as any).select();
                }}
                onKeyDown={(e) => {
                    if (e.which === 9) {
                        openDropdown(false);
                        userTyped(false);
                        setHighlightedIndex(-1);
                    } else if (
                        (e.which === 13 || e.which === 32) &&
                        suggestions[higlightedIndex]
                    ) {
                        if (multiSelect) {
                            setTextValue("");
                            onChange(
                                addOrRemoveItem(
                                    value,
                                    suggestions[higlightedIndex]
                                )
                            );
                        } else {
                            openDropdown(false);
                            userTyped(false);
                            setHighlightedIndex(-1);
                            const udpatedValue = value.find(
                                (a) =>
                                    a.key === suggestions[higlightedIndex].key
                            )
                                ? []
                                : [suggestions[higlightedIndex]];
                            setTextValue(
                                udpatedValue.length > 0
                                    ? udpatedValue[0].label
                                    : ""
                            );
                            onChange(udpatedValue);
                            if (dropDownInput.current) {
                                dropDownInput.current.blur();
                            }
                        }
                    } else if (e.which === 27) {
                        if (multiSelect) {
                            setTextValue("");
                        } else {
                            setTextValue(
                                value.length > 0 ? value[0].label : ""
                            );
                        }
                        if (dropDownInput.current) {
                            dropDownInput.current.blur();
                        }
                        openDropdown(false);
                        userTyped(false);
                        setHighlightedIndex(-1);
                    } else if (e.which === 38 && isOpen) {
                        if (higlightedIndex <= 0) {
                            setHighlightedIndex(suggestions.length - 1);
                        } else {
                            setHighlightedIndex(higlightedIndex - 1);
                        }
                    } else if (e.which === 40 && isOpen) {
                        if (higlightedIndex >= suggestions.length - 1) {
                            setHighlightedIndex(0);
                        } else {
                            setHighlightedIndex(higlightedIndex + 1);
                        }
                    } else if (e.keyCode === 8 && !textValue && value.length) {
                        value.pop();
                        onChange([...value]);
                    }
                }}
                onFocus={(e) => {
                    if (disabled) {
                        e.stopPropagation();
                        return;
                    }
                    openDropdown(true);
                    if (e.target) (e.target as any).select();
                }}
                placeholder={
                    (multiSelect && value.length === 0) ||
                        (value && value.length === 0)
                        ? placeholder || "Select"
                        : ""
                }
                isShowArrowIcon={isShowArrowIcon}
                toggleDropdown={(e) => {
                    e.stopPropagation();
                    openDropdown(!isOpen);
                    if (isOpen) {
                        userTyped(false);
                        setHighlightedIndex(-1);
                    }
                }}
            />
            {isOpen && (
                <List
                    onClickAddNew={onClickAddNew}
                    containerRef={listContainer}
                    options={suggestions}
                    selected={value}
                    onClick={(item) => {
                        const filteredValue = value.filter(
                            (c) => c.key !== item.key
                        );
                        const adding = filteredValue.length === value.length;

                        if (!multiSelect) {
                            setTextValue(adding ? item.label : "");
                            onChange(adding ? [item] : []);
                            userTyped(false);
                            setHighlightedIndex(-1);
                            openDropdown(false);
                        } else {
                            onChange(adding ? [...value, item] : filteredValue);
                            if (isOpen && dropDownInput.current) {
                                dropDownInput.current.focus();
                            }
                            setTextValue("");
                        }
                    }}
                    currentActiveListItemIndex={higlightedIndex}
                    showCheckBox={!!multiSelect}
                    showCheckMark={!multiSelect}
                />
            )}
        </DropDownContainer>
    );
};
