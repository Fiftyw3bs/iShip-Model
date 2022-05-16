import Shipment from "./Shipment";
import { IDeliveryStep } from "./interfaces/IDeliveryStep";
import Cost from "./interfaces/Cost";
import Sender from "./user/Sender";
import { Err, Errors, Ok, OkMessage, Result } from "./interfaces/Errors";

export enum DeliveryRequestState {
    AWAITING_APPROVAL,
    APPROVED,
    REJECTED
}

class DeliveryRequest {
    shipment:   Shipment;
    state:      DeliveryRequestState
    step:       IDeliveryStep;
    cost:       Cost;

    constructor(shipment: Shipment, cost: Cost, step: IDeliveryStep) {
        this.shipment = shipment;
        this.cost = cost;
        this.step = step;
        this.state = DeliveryRequestState.AWAITING_APPROVAL;
    }

    async accept(sender: Sender): Promise<Result<OkMessage, Errors>> {
        if (sender.id == this.shipment.sender.id) {
            return await this.shipment.addDeliveryStep(this.step).then(
                e => e.andThen(
                    () => {
                        this.state = DeliveryRequestState.APPROVED;
                        return Ok("DeliveryRequestAccepted");
                    }
                )
            )
        } else {
            return Promise.reject(Err("InvalidUser"));
        }
    }

    async reject(sender: Sender): Promise<Result<OkMessage, Errors>> {
        if (this.shipment.sender.id == sender.id) {
            return await this.shipment.addDeliveryStep(this.step).then(
                e => e.andThen(
                    () => {
                        this.state = DeliveryRequestState.REJECTED;
                        return Ok("DeliveryRequestRejected")
                    }
                )
            )
        } else {
            return Promise.reject(Err("InvalidUser"));
        }
    }
}

export default DeliveryRequest