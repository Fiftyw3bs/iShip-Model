import { Errors, OkMessage, Result } from "../interfaces/Errors";
import { Id, IReserver } from "./user";

export interface IReserveRequest {
    id:             Id;
    shipmentId:     Id;
    reserverId:     Id;
    requestedAt:    Date;
    creationTime:   Date;
}

export type ReserveRequestContextType = {
    reserveRequestInfo: IReserveRequest[];
    saveReserveRequestInfo(data: IReserveRequest): void;
    reject(reserveRequest: IReserveRequest, reserver: IReserver): Promise<Result<OkMessage, Errors>>;
}

export const defaultReserveRequest: IReserveRequest = {
    shipmentId: "0",
    reserverId: "UNASSIGNED",
    requestedAt: new Date(),
    id: 'UNASSIGNED',
    creationTime: new Date(),
}