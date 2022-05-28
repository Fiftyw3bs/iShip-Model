import ShipmentHistory from "../ShipmentHistory";
import LoggedInUser from "./User";

class Sender extends LoggedInUser {
    constructor(id: string) {
        super(id)
    }

    public toJSON() {
        return {
            availability: JSON.stringify(this.available),
            id: JSON.stringify(this.id)
        }
    }

    shipmentHistory:    ShipmentHistory = new ShipmentHistory();
}

export default Sender