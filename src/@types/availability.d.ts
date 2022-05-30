interface AvailabilityPeriod {
    day: string
    from: string
    to: string
}

enum DateFormat {
    FORMAT_12_HOUR = 'h:mm A',
    FORMAT_24_HOUR = 'HH:mm'
}

interface IAvailability {
    times: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    format: DateFormat;
}

export type AvailabilityContextType = {
    availabilityInfo: IAvailability;
    setAvailability(day: string, start: string, end: string);
    isAvailable(datetime: Date) : boolean;
    availabilityWithinRange(datetime1: Date, datetime2: Date) : boolean;
}

export const defaultAvailability: IAvailability = {
    format:  DateFormat.FORMAT_12_HOUR,
    times: new Map()
}