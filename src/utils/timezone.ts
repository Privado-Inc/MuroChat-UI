import moment from "moment";

const DEFAULT_FORMAT = "DD/MM/YYYY LT";

export const useUserTimezoneFromNow = (timeString: string): string => {
    return moment.utc(timeString, DEFAULT_FORMAT).local().fromNow() || timeString;
};

export const toLocalTimezone = (timeString: string, format?: string): string => {
    return (
        moment
            .utc(timeString, DEFAULT_FORMAT)
            .local()
            .format(format || DEFAULT_FORMAT) || timeString
    );
};

export const useUserTimezone = (timeString: string): string => {
    if (timeString === "scanning failed" || timeString === "scanning" || timeString === "scanning initiated") {
        return timeString;
    }
    return toLocalTimezone(timeString);
};

export const getLocalDate = (timeStr: string): string => moment.utc(timeStr).local().format("DD/MM/YYYY");
