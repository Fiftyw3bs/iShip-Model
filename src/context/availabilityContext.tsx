import moment from 'moment';
import React, { createContext, useState } from 'react';
import { IAvailability, defaultAvailability, AvailabilityContextType } from '../@types/availability';

export const AvailabilityContext = createContext<AvailabilityContextType | null>(null)

export const Availability: React.FC<React.ReactNode> = ({children}) => {

    const [availabilityInfo, setAvailabilityInfo] = useState<IAvailability>(defaultAvailability)


    const setAvailability = (day: string, start: string, end: string) => {
        if (availabilityInfo.times.has(day.toLowerCase())) {
            availabilityInfo.times.get(day.toLowerCase())?.set(start, end)
        } else {
            availabilityInfo.times.set(day.toLowerCase(), new Map<string, string>().set(start, end))
        }
        setAvailabilityInfo((prevState) => {
            return {
                ...prevState, times: availabilityInfo.times.get(day.toLowerCase())?.set(start, end)
            }
        })
    }
    
    const isAvailable = (datetime: Date) : boolean => {
        let available = false;
        const day = datetime.toLocaleString("en", { weekday: "long" }).toLowerCase();
        if (availabilityInfo.times.has(day)) 
        {
            availabilityInfo.times.get(day)?.forEach((to: string, from: string) => {
                const start = new Date(moment(from, [availabilityInfo.format]).format());
                const end = new Date(moment(to, [availabilityInfo.format]).format());

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

    const availabilityWithinRange = (datetime1: Date, datetime2: Date) : boolean => {
        return isAvailable(datetime1) || isAvailable(datetime2)
    }

    return (
        <AvailabilityContext.Provider value={{availabilityInfo,setAvailability,isAvailable,availabilityWithinRange}}>
            {children}
        </AvailabilityContext.Provider>
    )
}