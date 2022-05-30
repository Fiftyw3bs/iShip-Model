import Reserver from "../user/Reserver";
import { defaultShipmentInfo } from "./shipment";

interface IReserveRequest {
    shipment:       IShipment;
    reserver:       Reserver;
    requestedAt:    Date;
}

export type ReserveRequestContextType = {
    reserveRequestInfo: IReserveRequest;
    saveReserveRequestInfo(data: IReserveRequest);
    reject(reserver: Reserver): Promise<Result<OkMessage, Errors>>;
}

export const defaultReserveRequest: IReserveRequest = {
    shipment: defaultShipmentInfo,
    reserver: new Reserver(""),
    requestedAt: new Date()
}