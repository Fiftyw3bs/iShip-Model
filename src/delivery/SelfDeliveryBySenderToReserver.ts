import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { DispatchState, IDeliveryStep } from "../interfaces/IDeliveryStep";
import Shipment from "../Shipment";
import Reserver from "../user/Reserver";
import Sender from "../user/Sender";
import LoggedInUser from "../user/User";
import { v4 } from "uuid";

class SelfDeliveryBySenderToReserver implements IDeliveryStep {
    source:         LoggedInUser;
    recipient:      LoggedInUser;
    completionTime: Date = new Date();
    dispatchState:  DispatchState;
    id:             string;
    dispatcher:     Sender;

    constructor(source: Sender, recipient: Reserver) {
        this.source = source
        this.dispatcher = source
        this.recipient = recipient
        this.dispatchState = DispatchState.PENDING
        this.id = v4()
    }

    init(shipment: Shipment): Result<OkMessage, Errors> {
        if (this.source.id == shipment.sender.id) {
            const index = shipment.reservers.map(e => { return e.id }).indexOf(this.recipient.id);
            if (index > -1) {
                if (index == 0) { // Ensure the Reserver is the first in the package delivery sequence
                    return Ok("DeliveryStepInitialized");
                } else {
                    return Err("WrongStepInDeliverySequence");
                }
            } else {
                return Err("ReserverNotFound");
            }
        } else {
            return Err("InvalidSender");
        }
    }

    status(): DispatchState {
        return this.dispatchState
    }
}

export default SelfDeliveryBySenderToReserver;