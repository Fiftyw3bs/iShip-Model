import RegisteredUser from "../user/User";

enum DispatchState {
    PENDING = 0,
    ACCEPTED,
    IN_TRANSIT,
    COMPLETED
}

interface IDeliveryStep {
    id:                             string;
    shipmentId:                     string;
    dispatcher:                     RegisteredUser;
    source:                         RegisteredUser;
    recipient:                      RegisteredUser;
    completionTime:                 Date;
    dispatchState:                  DispatchState;
}

export type DeliveryStepContextType = {
    deliveryStepInfo: IDeliveryStep[];
    updateState(data: IDeliveryStep, newState: DispatchState): Promise<void>;
    getState(data: IDeliveryStep): Promise<Result<DispatchState, Errors>>;
    addDeliveryStep(data: IDeliveryStep);
    getByShipmentId(shipmentId: string): Promise<Result<IDeliveryStep, Errors>>;
    getByDispatcher(dispatcher: Dispatcher): Promise<Result<IDeliveryStep[], Errors>>;
    getByRecipient(recipient: RegisteredUser): Promise<Result<IDeliveryStep[], Errors>>;
    getBySource(source: RegisteredUser): Promise<Result<IDeliveryStep[], Errors>>;
    getByState(state: DispatchState): Promise<Result<IDeliveryStep[], Errors>>;
}

export type DeliveryStep = DeliveryStepContextType;

export const defaultDeliveryStep: IDeliveryStep = {
    source:         new RegisteredUser(""),
    recipient:      new RegisteredUser(""),
    completionTime: new Date(),
    dispatchState:  DispatchState.PENDING,
    id:             v4(),
    dispatcher:     new RegisteredUser(""),
    shipmentId:     "UNASSIGNED"
}
