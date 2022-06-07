import RegisteredUser from "./User";
import Address from "../Location";

class Receiver extends RegisteredUser {
    constructor(id = 'UNASSIGNED') {
        super(id)
    }

    location: Address = new Address();
}

export default Receiver