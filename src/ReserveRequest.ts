import Shipment from "./Shipment";
import Reserver from "./user/Reserver";
import { Err, Errors, Ok, OkMessage, Result } from "./interfaces/Errors";

class ReserveRequest {
    shipment:       Shipment;
    reserver:       Reserver;
    requestedAt:    Date;

    constructor(shipment: Shipment, reserver: Reserver) {
        this.shipment = shipment;
        this.reserver = reserver;
        this.requestedAt = new Date();
    }

    reject(reserver: Reserver): Result<OkMessage, Errors> {
        if (this.reserver.id != reserver.id) {
            return Err("InvalidUser")
        }
        if (this.shipment.sender.id == this.reserver.id) {
            return Err("SenderCantBeReserver")
        }
        if (this.shipment.receiver.id == this.reserver.id) {
            return Err("ReceiverCantBeReserver")
        }
        const rejected = this.shipment.removeReserver(this.reserver);
        if (rejected.err) {
            return rejected
        } else {
            return Ok("ReserveRequestRejected");
        }
    }
}

export default ReserveRequest