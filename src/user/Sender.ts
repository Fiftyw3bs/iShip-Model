import { Package } from "../Package";
import Shipment from "../Shipment";
import ShipmentHistory from "../ShipmentHistory";
import Receiver from "./Receiver";
import LoggedInUser from "./User";

class Sender extends LoggedInUser {
    constructor(id: any) {
        super(id)
    }

    shipmentHistory:    ShipmentHistory = new ShipmentHistory();
}

export default Sender