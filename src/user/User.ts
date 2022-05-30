import { Availability } from "../context/availabilityContext"

class LoggedInUser {
    constructor(id: string) {
        this._id = id
    }

    public set availability(v : Availability) {
        this.available = v;
    }
    
    public get availability() : Availability {
        return this.available;
    }

    public get id() : string {
        return this._id;
    }
    
    available:          Availability = new Availability();
    private _id:                 string;
}

export default LoggedInUser