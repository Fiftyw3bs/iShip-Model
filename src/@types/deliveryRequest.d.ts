
export enum DeliveryRequestState {
    AWAITING_APPROVAL,
    APPROVED,
    REJECTED
}

export interface IDeliveryRequest {
    shipmentId: string;
    state: DeliveryRequestState
    step: IDeliveryStep;
    cost: Cost;
    id: string;
}

export type DeliveryRequestContextType = {
    deliveryRequestInfo: IDeliveryRequest[];
    saveDeliveryRequestInfo(data: IDeliveryRequest);
    accept(request: IDeliveryRequest, sender: Sender): Promise<Result<OkMessage, Errors>>;
    reject(request: IDeliveryRequest, sender: Sender): Promise<Result<OkMessage, Errors>>;
}

export const defaultDeliveryRequest = {
    shipment: useContext(ShipmentContext).shipmentInfo,
    state: DeliveryRequestState.AWAITING_APPROVAL,
    step: <IDeliveryStep>{},
    cost: {amount: 0, currency: 'ADA'},
}
