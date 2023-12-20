import React from "react";

export function useDebounce(value: string, delay = 500): string {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
}

/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/ban-types */

export function debounceFunc(func: Function, wait = 1500): (...args: any[]) => void {
    let timeout: NodeJS.Timeout | null = wait as any;
    return (...args: any[]) => {
        const later = (): any => {
            timeout = null;
            func.apply(null, args);
        };
        // const callNow = !timeout;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        // if (callNow) func.apply(null, args);
    };
}

/* eslint-enable prefer-spread */
/* eslint-enable @typescript-eslint/ban-types */
