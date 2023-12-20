import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Colors, TextStyles } from "uiLibrary/index";
import { ReactComponent as CaretDownIcon } from "assets/svg/caretDown.svg";
import { ReactComponent as DropdownOptionChecked } from "assets/svg/dropdownOptionChecked.svg";

export type Option = {
    id: number;
    title: string;
    message: string;
    isSelected?: boolean;
    onClick: () => void;
}

export const DropdownOptionContiner = styled.div`
position: absolute;
top: 22px;
border-radius: 8px;
`
export const DropdownOption = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    gap: 6px;
    align-self: stretch;
    cursor: pointer;
    width: 300px;

    border: 1px solid ${Colors.neutral.p20};
    background: ${Colors.white};
    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);

    :first-child{
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    :last-child{
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`

export const OptionTitle = styled.div`
    color: ${Colors.neutral.p90};
    font-feature-settings: 'salt' on;

    ${TextStyles.TextT100Semibold};


    &.selected {
        color: ${Colors.purple.p50};
    }
`

export const OptionMesage = styled.div`
    color: ${Colors.neutral.p70};
    font-feature-settings: 'salt' on;
    ${TextStyles.TextT300Regular};
    display: flex;
    
    &.selected {
        color: ${Colors.purple.p50};
    }
    `

export const Trigger = styled.div`
    display: flex;
    padding: 0px 12px;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    position: relative;
`

const Dropdown = ({
    options,
    selectedOption,
    setSelectedOption
}: {
    options: any,
    selectedOption: Option,
    setSelectedOption: (option: Option) => void,
}): ReactElement => {
    const [showPanel, setShowPanel] = useState(false);
    const container = React.createRef<HTMLDivElement>();

    const onWindowClick = (e: any): void => {
        if (container.current && !container.current.contains(e.target)) {
            setShowPanel(false)
        }
    };

    useEffect(() => {
        window.addEventListener("click", onWindowClick);
        return () => {
            window.removeEventListener("click", onWindowClick);
        };
    }, [container]);

    return (
        <Trigger id="trigger" ref={container} onClick={() => {
            setShowPanel(true)
        }}>
            {selectedOption?.title}
            <CaretDownIcon />
            <DropdownOptionContiner>
                {showPanel && options.length && options.map((option: Option) => {
                    return (
                        <DropdownOption key={option.id} onClick={(e) => {
                            option.onClick();
                            setShowPanel(false);
                            e.stopPropagation();
                            setSelectedOption(option);
                        }}>
                            <OptionTitle className={`${option.id === selectedOption.id ? "selected" : ""}`}>
                                {option.title}
                            </OptionTitle>
                            <OptionMesage className={`${option.id === selectedOption.id ? "selected" : ""}`}>
                                <div>{option.message}</div>
                                {option.id === selectedOption.id && <DropdownOptionChecked style={{ width: "18px", height: "16px" }}></DropdownOptionChecked>}
                            </OptionMesage>
                        </DropdownOption>)
                })}
            </DropdownOptionContiner>
        </Trigger>
    )
}

export default Dropdown;
