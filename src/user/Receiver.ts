import LoggedInUser from "./User";
import Address from "../Location";

class Receiver extends LoggedInUser {
    constructor(id = 'UNASSIGNED') {
        super(id)
    }

    public toJSON() {
        return { 
            location: JSON.stringify(this.location),
            availability: JSON.stringify(this.available),
            id: JSON.stringify(this.id)
        }
    }

    location: Address = new Address();
}

export default Receiver