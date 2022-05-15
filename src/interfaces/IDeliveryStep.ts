import Shipment from "../Shipment";
import LoggedInUser from "../user/User";
import { Errors, OkMessage, Result } from "./Errors";

enum DispatchState {
    PENDING = 0,
    ACCEPTED,
    IN_TRANSIT,
    COMPLETED
}

interface IDeliveryStep {
    id:                             string;
    dispatcher:                     LoggedInUser;
    source:                         LoggedInUser;
    recipient:                      LoggedInUser;
    completionTime:                 Date;
    dispatchState:                  DispatchState;
    status() :                      DispatchState;
    init(shipment: Shipment):       Result<OkMessage, Errors>;
}

export {DispatchState, IDeliveryStep}