import ShipmentHistory from "../ShipmentHistory";
import LoggedInUser from "./User";

class Sender extends LoggedInUser {
    constructor(id: string) {
        super(id)
    }

    shipmentHistory:    ShipmentHistory = new ShipmentHistory();
}

export default Sender