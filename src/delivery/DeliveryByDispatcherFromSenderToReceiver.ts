import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { DispatchState, IDeliveryStep } from "../interfaces/IDeliveryStep";
import Shipment from "../Shipment";
import Dispatcher from "../user/Dispatcher";
import Receiver from "../user/Receiver";
import Sender from "../user/Sender";
import LoggedInUser from "../user/User";
import { v4 } from "uuid";

class DeliveryByDispatcherFromSenderToReceiver implements IDeliveryStep {
    dispatcher:     Dispatcher;
    source:         LoggedInUser;
    recipient:      LoggedInUser;
    completionTime: Date;
    dispatchState:  DispatchState;
    id:             string;

    constructor(source: Sender, recipient: Receiver, dispatcher: Dispatcher) {
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
        if (this.recipient.id != shipment.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipment.reservers.length > 0) { // Must be confirmed from user
            shipment.reservers.splice(0, shipment.reservers.length);
        }
        return Ok("DeliveryStepInitialized");
    }

    status(): DispatchState {
        return this.dispatchState;
    }
}

export default DeliveryByDispatcherFromSenderToReceiver