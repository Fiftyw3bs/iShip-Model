import { Errors, OkMessage, Result } from "../interfaces/Errors";
import { Id, IReserver } from "./user";

export interface IReserveRequest {
    shipmentId:     Id;
    reserverId:     Id;
    requestedAt:    Date;
}

export type ReserveRequestContextType = {
    reserveRequestInfo: IReserveRequest[];
    saveReserveRequestInfo(data: IReserveRequest): void;
    reject(reserveRequest: IReserveRequest, reserver: IReserver): Promise<Result<OkMessage, Errors>>;
}

export const defaultReserveRequest: IReserveRequest = {
    shipmentId: "0",
    reserverId: "UNASSIGNED",
    requestedAt: new Date()
}