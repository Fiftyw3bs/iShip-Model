import LoggedInUser from "./User";
import Address from "../Location";

class Receiver extends LoggedInUser {
    constructor(id: String = 'UNASSIGNED') {
        super(id)
    }

    location: Address = new Address();
}

export default Receiver