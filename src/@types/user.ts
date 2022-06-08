import Cost from "../interfaces/Cost";
import Address from "../Location";
import { PackageType } from "../Package";
import ShipmentHistory from "../ShipmentHistory";
import { IAvailability } from "./availability";
import { IDeliveryRequest } from "./deliveryRequest";
import { IDeliveryStep } from "./deliveryStep";
import { IReserveRequest } from "./reserveRequest";
import { IShipment } from "./shipment";

enum VehicleType {
    Bike = 1,
    Car,
    Bus
}

export default interface ILoggedInUser {
    available: IAvailability;
    id: string;
}

export interface IReserver extends ILoggedInUser {
    costPerHour: Cost;
    packageType: PackageType;
    location: Address;
    reserveRequests: Array<IReserveRequest>;
}

export interface IReceiver extends ILoggedInUser {
    location: Address;
}

export interface IDispatcher extends ILoggedInUser {
    vehicle: VehicleType;
    deliveryRequests: Array<IDeliveryRequest>;
}

export type DispatcherContextType = {
    dispatcherInfo: IDispatcher[],
    pickup(shipment: IShipment, step: IDeliveryStep): void;
    deliver(shipment: IShipment, step: IDeliveryStep): void;
    bid(shipment: IShipment, cost: Cost, step: IDeliveryStep): IDeliveryRequest;
}

export interface ISender extends ILoggedInUser {
    shipmentHistory:    ShipmentHistory;
}
