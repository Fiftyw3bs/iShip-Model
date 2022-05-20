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

    async reject(reserver: Reserver): Promise<Result<OkMessage, Errors>> {
        if (this.reserver.id != reserver.id) {
            return Promise.reject(Err("InvalidUser"))
        }
        if (this.shipment.sender.id == this.reserver.id) {
            return Promise.reject(Err("SenderCantBeReserver"))
        }
        if (this.shipment.receiver.id == this.reserver.id) {
            return Promise.reject(Err("ReceiverCantBeReserver"))
        }
        return await this.shipment.removeReserver(this.reserver).then(
            () => {
                return Ok("ReserveRequestRejected");
            },
            (error) => {
                return error
            }
        )
    }
}

export default ReserveRequest