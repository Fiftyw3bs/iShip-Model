import Cost from "../interfaces/Cost";
import { Errors, OkMessage, Result } from "../interfaces/Errors";
import { IDeliveryStep } from "./deliveryStep";
import { IShipment } from "./shipment";
import { Id, ISender } from "./user";

export enum DeliveryRequestState {
    AWAITING_APPROVAL,
    APPROVED,
    REJECTED
}

export interface IDeliveryRequest {
    shipmentId: Id;
    state: DeliveryRequestState
    step: IDeliveryStep;
    cost: Cost;
    id: Id;
}

export type DeliveryRequestContextType = {
    deliveryRequestInfo: IDeliveryRequest[];
    saveDeliveryRequestInfo(data: IDeliveryRequest): void;
    accept(request: IDeliveryRequest, sender: ISender): Promise<Result<OkMessage, Errors>>;
    reject(request: IDeliveryRequest, sender: ISender): Promise<Result<OkMessage, Errors>>;
}

export const defaultDeliveryRequest = {
    shipment: <IShipment>{},
    state: DeliveryRequestState.AWAITING_APPROVAL,
    step: <IDeliveryStep>{},
    cost: {amount: 0, currency: 'ADA'},
}
