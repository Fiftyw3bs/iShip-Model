import { createContext, useState } from "react";
import { DateFormat, IAvailability } from "../@types/availability";
import ILoggedInUser, { LoggedInUserContextType } from "../@types/user";
import Address from "../Location";

export const LoggedInUserContext = createContext<LoggedInUserContextType | null>(null);

export const LoggedInUserProvider: React.FC<React.ReactNode> = () => {

    const [loggedInUserInfo, setLoggedInUserInfo] = useState<ILoggedInUser>({id: "UNASSIGNED"});
    const [location, setLocation] = useState<Address>({address: "", city: "", state: ""});
    const [availability, setAvailability] = useState<IAvailability>({format: DateFormat.FORMAT_12_HOUR, times: new Map<string, Map<string, string>>()});
    
    return (
        <LoggedInUserContext.Provider value={{loggedInUserInfo, location, availability, setLoggedInUserInfo, setLocation, setAvailability}}>

        </LoggedInUserContext.Provider>
    );
}

export default LoggedInUserProvider;