import { Availability } from "../Availability";

class LoggedInUser {
    constructor(id: any) {
        this._id = id
    }

    public set availability(v : Availability) {
        this.available = v;
    }
    
    public get availability() : Availability {
        return this.available
    }

    public get id() : String {
        return this._id;
    }
    
    available:          Availability = new Availability();;
    private _id:                 String;
}

export default LoggedInUser