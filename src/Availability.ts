const moment = require('moment')

interface AvailabilityPeriod {
    day: string
    from: string
    to: string
}

enum DateFormat {
    FORMAT_12_HOUR = 'h:mm A',
    FORMAT_24_HOUR = 'HH:mm'
}

class Availability {
    constructor(format: DateFormat = DateFormat.FORMAT_12_HOUR) {
        this.format = format;
    }

    public setAvailability(day: string, start: string, end: string) {
        if (this.times.has(day.toLowerCase())) {
            this.times.get(day.toLowerCase())?.set(start, end)
        } else {
            this.times.set(day.toLowerCase(), new Map<string, string>().set(start, end))
        }
    }
    
    public isAvailable(datetime: Date) : boolean {
        var available: boolean = false;
        const day = datetime.toLocaleString("en", { weekday: "long" }).toLowerCase();
        if (this.times.has(day)) 
        {
            this.times.get(day)?.forEach((to: string, from: string) => {
                var start = new Date(moment(from, [this.format]).format());
                var end = new Date(moment(to, [this.format]).format());

                const startHour = start.getHours()
                const startMinute = start.getMinutes()

                const endHour = end.getHours()
                const endMinute = end.getMinutes()

                const queryHour = datetime.getHours()
                const queryMinute = datetime.getMinutes()

                available ||= (
                    (startHour < queryHour && endHour > queryHour) ||
                    (
                        (
                            (startMinute < queryMinute) && 
                            (startHour == queryHour)
                        ) || 
                        (
                            (queryMinute < endMinute) && 
                            (endHour == queryHour)
                        )
                    )
                );
            });
        }
        return available;
    }

    /**
     * availabilityWithinRange
     */
    public availabilityWithinRange(datetime1: Date, datetime2: Date) : boolean {
        return this.isAvailable(datetime1) || this.isAvailable(datetime2)
    }

    times: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    format: DateFormat;
}

export {Availability, DateFormat, AvailabilityPeriod};