import ShipmentHistory from "../ShipmentHistory";
import RegisteredUser from "./User";

class Sender extends RegisteredUser {
    constructor(id: string) {
        super(id)
    }

    shipmentHistory:    ShipmentHistory = new ShipmentHistory();
}

export default Sender