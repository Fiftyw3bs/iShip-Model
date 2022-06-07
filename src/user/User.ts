import { DateFormat, defaultAvailability, IAvailability } from "../@types/availability";

class RegisteredUser {
    constructor(id: string) {
        this._id = id
    }

    public set availability(v : IAvailability) {
        this.available = v;
    }
    
    public get availability() : IAvailability {
        return this.available;
    }

    public get id() : string {
        return this._id;
    }
    
    available:          IAvailability = defaultAvailability;
    private _id:        string;
}

export default RegisteredUser