import { v4 } from "uuid";
import { Errors, OkMessage, Result } from "../interfaces/Errors";
import { IPackage } from "../Package";
import { IDeliveryStep } from "./deliveryStep";
import { Id, IReceiver, IReserver, ISender } from "./user";

export enum Priority {
    Low = 1,
    Medium,
    High
}

export enum ShipmentState {
    AWAITING_PICKUP,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}

export interface IShipment {
    content: IPackage;
    reservers: Array<Id>;
    sender: Id;
    id: Id;
    currentHolder: Id;
    receiver: IReceiver;
    state: ShipmentState;
    creationTime: Date;
}

export type ShipmentContextType = {
    shipmentInfo: IShipment[];
    getShipmentById(id: Id): Promise<Result<IShipment, Errors>>;
    getShipmentBySender(sender: ISender): Promise<Result<IShipment[], Errors>>;
    saveShipmentInfo(data: IShipment): void;
    addDeliveryStep(step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    addReserver(shipmentInfo: IShipment, reserver: IReserver): Promise<Result<OkMessage, Errors>>;
    removeReserver(shipmentInfo: IShipment, reserverId: Id): Promise<Result<OkMessage, Errors>>;
    pickup(shipmentInfo: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    deliver(shipmentInfo: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
}

export const defaultShipmentInfo: IShipment = {
    content: <IPackage>{},
    reservers: [],
    sender: "UNASSIGNED",
    id: v4(),
    currentHolder: "UNASSIGNED",
    receiver: <IReceiver>{},
    state: ShipmentState.AWAITING_PICKUP,
    creationTime: new Date(),
}
