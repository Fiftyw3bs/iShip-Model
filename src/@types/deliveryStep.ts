import { v4 } from "uuid";
import { Errors, Result } from "../interfaces/Errors";
import ILoggedInUser, { Id, IDispatcher } from "./user";

export enum DispatchState {
    PENDING = 0,
    ACCEPTED,
    IN_TRANSIT,
    COMPLETED
}

export interface IDeliveryStep {
    id:                             Id;
    shipmentId:                     Id;
    dispatcher:                     ILoggedInUser;
    source:                         ILoggedInUser;
    recipient:                      ILoggedInUser;
    completionTime:                 Date;
    dispatchState:                  DispatchState;
}

export type DeliveryStepContextType = {
    deliveryStepInfo: IDeliveryStep[];
    updateState(data: IDeliveryStep, newState: DispatchState): Promise<void>;
    getState(data: IDeliveryStep): Promise<Result<DispatchState, Errors>>;
    addDeliveryStep(data: IDeliveryStep) : void;
    getByShipmentId(shipmentId: string): Promise<Result<IDeliveryStep, Errors>>;
    getByDispatcher(dispatcher: IDispatcher): Promise<Result<IDeliveryStep[], Errors>>;
    getByRecipient(recipient: ILoggedInUser): Promise<Result<IDeliveryStep[], Errors>>;
    getBySource(source: ILoggedInUser): Promise<Result<IDeliveryStep[], Errors>>;
    getByState(state: DispatchState): Promise<Result<IDeliveryStep[], Errors>>;
}

export type DeliveryStep = DeliveryStepContextType;

export const defaultDeliveryStep: IDeliveryStep = {
    source:         <ILoggedInUser>{},
    recipient:      <ILoggedInUser>{},
    completionTime: new Date(),
    dispatchState:  DispatchState.PENDING,
    id:             v4(),
    dispatcher:     <ILoggedInUser>{},
    shipmentId:     "UNASSIGNED"
}
