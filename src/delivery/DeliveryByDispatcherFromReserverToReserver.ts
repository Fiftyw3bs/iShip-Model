import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { DispatchState, IDeliveryStep } from "../interfaces/IDeliveryStep";
import Shipment from "../Shipment";
import Dispatcher from "../user/Dispatcher";
import Reserver from "../user/Reserver";
import LoggedInUser from "../user/User";
import { v4 } from "uuid";


class DeliveryByDispatcherFromReserverToReserver implements IDeliveryStep {
    dispatcher:         Dispatcher;
    source:             LoggedInUser;
    recipient:          LoggedInUser;
    completionTime:     Date;
    dispatchState:      DispatchState;
    id:                 string;

    constructor(source: Reserver, recipient: Reserver, dispatcher: Dispatcher) {
        this.dispatcher = dispatcher
        this.source = source
        this.recipient = recipient
        this.completionTime = new Date();
        this.dispatchState = DispatchState.PENDING
        this.id = v4()
    }
    init(shipment: Shipment) : Result<OkMessage, Errors> {
        const all_reservers = shipment.reservers.map(e => { return e.id });
        const source_index = all_reservers.indexOf(this.source.id);
        const recipient_index = all_reservers.indexOf(this.recipient.id);
        if(source_index == -1) {
            return Err("ReserverNotFound");
        }
        if(recipient_index == -1) {
            return Err("UserNotFound");
        }
        if ((recipient_index - source_index) != 1) {
            return Err("WrongStepInDeliverySequence");
        }
        return Ok("DeliveryStepInitialized");
    }

    status(): DispatchState {
        return this.dispatchState
    }
}

export default DeliveryByDispatcherFromReserverToReserver;