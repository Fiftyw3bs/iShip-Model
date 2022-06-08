export interface AvailabilityPeriod {
    day: string
    from: string
    to: string
}

export enum DateFormat {
    FORMAT_12_HOUR = 'h:mm A',
    FORMAT_24_HOUR = 'HH:mm'
}

export interface IAvailability {
    times: Map<string, Map<string, string>>;
    format: DateFormat;
}

export type AvailabilityContextType = {
    availabilityInfo: IAvailability;
    setAvailability(availability: AvailabilityPeriod): void;
    isAvailable(datetime: Date) : boolean;
    availabilityWithinRange(datetime1: Date, datetime2: Date) : boolean;
}

export const defaultAvailability: IAvailability = {
    format:  DateFormat.FORMAT_12_HOUR,
    times: new Map()
}