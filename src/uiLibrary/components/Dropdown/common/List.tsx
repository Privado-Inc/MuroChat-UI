import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import { Scrollbars } from "react-custom-scrollbars";

import CheckMarkIcon from "assets/svg/dropdownCheck.svg";

import colors from "../../../colors";
import textStyles from "../../../textStyles";

import { DropdownData } from "./types";
import Checkbox from "uiLibrary/components/Checkbox";

const MaxHeightDropDownList = 168;
const DropdownItemHeight = 28;
const DropdownListPadding = 4;

const DropdownListContainer = styled.div<{ widthByContent: boolean }>`
    padding: ${DropdownListPadding}px 0;
    background: ${colors.white};
    border: 1px solid ${colors.neutral.p20};
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 3;
    margin: 0;
    border-radius: 4px;
    overflow: hidden;
    list-style-type: none;
    box-sizing: border-box;
    box-shadow: 0px 4px 8px rgba(104, 115, 125, 0.1);
    ${({ widthByContent }) => (widthByContent ? "auto" : "100%")};
    &.upwardDirection {
        bottom: 34px;
    }
`;

type ListItemProps = {
    selected: boolean;
    hover: boolean;
    showCheckMark: boolean;
};

const selectedItemWithCheckMarkCss = css`
    padding: 5px 20px 5px 10px;
    color: ${colors.purple.p60};
    &::after {
        content: "";
        width: 12px;
        height: 12px;
        position: absolute;
        right: 8px;
        top: 0px;
        bottom: 0px;
        margin: auto;
        background-image: url("${CheckMarkIcon}");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
`;

const ListItem = styled.div<ListItemProps>`
    ${textStyles.TextT200Regular};
    color: ${colors.neutral.p80};
    background: ${colors.white};
    min-height: ${DropdownItemHeight}px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &:hover {
        background: ${colors.neutral.p5};
    }

    ${({ hover }) => (hover ? `background: ${colors.neutral.p5};` : "")};

    ${({ showCheckMark, selected }) =>
        showCheckMark && selected ? selectedItemWithCheckMarkCss : ""}
`;

const NotFoundListItem = styled.div`
    ${textStyles.TextT200Regular};
    display: flex;
    align-items: center;
    padding-left: 9px;
    height: ${DropdownItemHeight}px;
    position: relative;
    color: ${colors.neutral.p80};
    width: 100%;
    cursor: context-menu;
    background: ${colors.white};
    &:hover {
        background: ${colors.white};
    }
`;

const AddNewItem = styled.div`
    ${textStyles.TextT200Semibold};
    display: flex;
    align-items: center;
    padding-left: 12px;
    height: 34px;
    position: relative;
    bottom: 0px;
    color: ${colors.neutral.p70};
    box-shadow: inset 0px 1px 0px ${colors.neutral.p20};
    width: 100%;
    cursor: pointer;
    background: ${colors.white};
    &:hover {
        background: ${colors.neutral.p10};
    }
`;

const numberOfElementCanBeInViewPort =
    Math.floor(MaxHeightDropDownList / DropdownItemHeight) - 1;

export default ({
    options,
    selected,
    onClick,
    currentActiveListItemIndex,
    showCheckBox,
    showCheckMark,
    widthByContent,
    containerRef,
    onClickAddNew
}: {
    containerRef: React.RefObject<HTMLDivElement>;
    showCheckBox?: boolean;
    widthByContent?: boolean;
    showCheckMark?: boolean;
    currentActiveListItemIndex?: number;
    options: DropdownData[];
    selected: DropdownData[];
    onClick: (item: DropdownData) => void;
    onClickAddNew?: () => void;
}): ReactElement => {
    const scrollbars = React.createRef<Scrollbars>();

    React.useEffect(() => {
        if (!currentActiveListItemIndex) return;
        const totalNumber = options.length;
        if (
            scrollbars.current &&
            scrollbars.current.getScrollTop() > MaxHeightDropDownList &&
            currentActiveListItemIndex <= numberOfElementCanBeInViewPort
        ) {
            scrollbars.current.scrollToTop();
        } else if (
            scrollbars.current &&
            scrollbars.current.getScrollHeight() > 0 &&
            totalNumber > numberOfElementCanBeInViewPort
        ) {
            const scrollValue =
                (currentActiveListItemIndex - numberOfElementCanBeInViewPort) *
                DropdownItemHeight;
            if (scrollValue >= 0) {
                scrollbars.current.scrollTop(scrollValue);
            }
        }
    }, [currentActiveListItemIndex, scrollbars, options]);

    return (
        <DropdownListContainer
            widthByContent={!!widthByContent}
            ref={containerRef}>
            {options.length ? (
                <Scrollbars
                    ref={scrollbars}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    style={{
                        width: "100%",
                        height: `${Math.min(
                            MaxHeightDropDownList,
                            options.length * DropdownItemHeight
                        )}px`
                    }}>
                    {options.map((item, index) => (
                        <ListItem
                            showCheckMark={!!showCheckMark}
                            hover={currentActiveListItemIndex === index}
                            selected={
                                !!selected.find((s) => s.key === item.key)
                            }
                            data-name="allowedClick"
                            role="presentation"
                            key={`${item.key}${Math.random()}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(item);
                            }}>
                            {showCheckBox ? (
                                <Checkbox
                                    onChange={() => { }}
                                    checked={
                                        !!selected.find(
                                            (s) => s.key === item.key
                                        )
                                    }
                                />
                            ) : null}
                            {item.label}
                        </ListItem>
                    ))}
                </Scrollbars>
            ) : (
                <NotFoundListItem onClick={(e) => e.stopPropagation()}>
                    No results found
                </NotFoundListItem>
            )}
            {onClickAddNew && (
                <AddNewItem onClick={() => onClickAddNew()}>
                    Add New +
                </AddNewItem>
            )}
        </DropdownListContainer>
    );
};
