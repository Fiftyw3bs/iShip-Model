
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
    stepValidator:                  (n: IShipment) => Result<OkMessage, Errors>;
}

export type DeliveryStepContextType = {
    deliveryStepInfo: IDeliveryStep;
    saveDeliveryStepInfo(data: IDeliveryStep);
    selfDeliveryBySenderToReserver(shipment: IShipment):   Result<OkMessage, Errors>;
    deliveryByDispatcherFromReserverToReceiver(shipment: IShipment):   Result<OkMessage, Errors>;
    deliveryByDispatcherFromReserverToReserver(shipment: IShipment):   Result<OkMessage, Errors>;
    deliveryByDispatcherFromSenderToReceiver(shipment: IShipment):   Result<OkMessage, Errors>;
    deliveryByDispatcherFromSenderToReserver(shipment: IShipment):   Result<OkMessage, Errors>;
}

export const defaultDeliveryStep = {
    source:         new LoggedInUser(""),
    recipient:      new LoggedInUser(""),
    completionTime: new Date(),
    dispatchState:  DispatchState.PENDING,
    id:             v4(),
    dispatcher:     new LoggedInUser(""),
    stepValidator:  deliveryByDispatcherFromSenderToReceiver
}
