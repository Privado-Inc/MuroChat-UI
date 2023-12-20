export type DropdownData = {
    label: string;
    key: string;
};

type MultiSelectInputProps = {
    isMulti: true;
    onRemove: (a: DropdownData) => void;
    selected: DropdownData[];
};

type BaseInputProps = {
    value: string;
    isMandatory?: boolean;
    label: string;
    containerRef: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    onchange: (value: string) => void;
    onClick?: (a: any) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: any) => void;
    onBlur?: (e: any) => void;
    placeholder?: string;
    toggleDropdown?: (a: any) => void;
    isShowArrowIcon?: boolean;
    separateSelected?: boolean;
    isDisabled?: boolean;
};

export type InputProps =
    | BaseInputProps
    | (BaseInputProps & MultiSelectInputProps);
