
export enum DeliveryRequestState {
    AWAITING_APPROVAL,
    APPROVED,
    REJECTED
}

export interface IDeliveryRequest {
    shipment: IShipment;
    state: DeliveryRequestState
    step: IDeliveryStep;
    cost: Cost;
}

export type DeliveryRequestContextType = {
    deliveryRequestInfo: IDeliveryRequest;
    saveDeliveryRequestInfo(data: IDeliveryRequest);
    accept(sender: Sender): Promise<Result<OkMessage, Errors>>;
    reject(sender: Sender): Promise<Result<OkMessage, Errors>>;
}

export const defaultDeliveryRequest = {
    shipment: useContext(ShipmentContext).shipmentInfo,
    state: DeliveryRequestState.AWAITING_APPROVAL,
    step: <IDeliveryStep>{},
    cost: {amount: 0, currency: 'ADA'},
}
