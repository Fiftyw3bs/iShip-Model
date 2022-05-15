import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { DispatchState, IDeliveryStep } from "../interfaces/IDeliveryStep";
import Shipment from "../Shipment";
import Dispatcher from "../user/Dispatcher";
import Receiver from "../user/Receiver";
import Reserver from "../user/Reserver";
import LoggedInUser from "../user/User";
import { v4 } from "uuid";

class DeliveryByDispatcherFromReserverToReceiver implements IDeliveryStep {
    dispatcher:     Dispatcher;
    source:         LoggedInUser;
    recipient:      LoggedInUser;
    completionTime: Date;
    dispatchState:  DispatchState;
    id:             string;

    constructor(source: Reserver, recipient: Receiver, dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        this.source = source;
        this.recipient = recipient;
        this.dispatchState = DispatchState.PENDING;
        this.id = v4();
        this.completionTime = new Date();
    }
    init(shipment: Shipment) : Result<OkMessage, Errors> {
        if (this.dispatcher.id == shipment.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (this.dispatcher.id == shipment.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (this.source.id == shipment.sender.id) {
            return Err("SenderCantBeReserver");
        }
        if (this.recipient.id != shipment.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipment.reservers.length > 0) {
            // Ensure it's the last `Reserver` in the delivery sequence
            const index = shipment.reservers.map(e => { return e.id }).indexOf(this.source.id);
            if (index != (shipment.reservers.length-1)) {
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

export default DeliveryByDispatcherFromReserverToReceiver;