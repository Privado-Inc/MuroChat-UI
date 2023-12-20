const Logger = {
    // eslint-disable-next-line no-console
    log: (text: string | any, ...rest: any): void => console.log(text, ...rest),
    error: (text: string | any, ...rest: any): void =>
        // eslint-disable-next-line no-console
        console.error(text, ...rest),
    warn: (text: string | any, ...rest: any): void =>
        // eslint-disable-next-line no-console
        console.warn(text, ...rest)
};

export default Logger;
