import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { DispatchState, IDeliveryStep } from "../interfaces/IDeliveryStep";
import Shipment from "../Shipment";
import Dispatcher from "../user/Dispatcher";
import Sender from "../user/Sender";
import LoggedInUser from "../user/User";
import { v4 } from "uuid";
import Reserver from "../user/Reserver";

class DeliveryByDispatcherFromSenderToReserver implements IDeliveryStep {
    dispatcher:     Dispatcher;
    source:         LoggedInUser;
    recipient:      LoggedInUser;
    completionTime: Date;
    dispatchState:  DispatchState;
    id:             string;

    constructor(source: Sender, recipient: Reserver, dispatcher: Dispatcher) {
        this.dispatcher = dispatcher
        this.source = source
        this.recipient = recipient
        this.completionTime = new Date();
        this.dispatchState = DispatchState.PENDING
        this.id = v4();
    }
    init(shipment: Shipment) : Result<OkMessage, Errors> {
        if (this.dispatcher.id == shipment.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (this.dispatcher.id == shipment.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (this.source.id != shipment.sender.id) {
            return Err("InvalidSender");
        }
        if (shipment.reservers.length > 0) { // Must be confirmed from user
            const index = shipment.reservers.map(e => { return e.id }).indexOf(this.recipient.id);
            if (index != 0) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    status(): DispatchState {
        return this.dispatchState;
    }
}

export default DeliveryByDispatcherFromSenderToReserver