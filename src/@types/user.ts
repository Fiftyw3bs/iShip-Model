import Cost from "../interfaces/Cost";
import Address from "../Location";
import { PackageType } from "../Package";
import ShipmentHistory from "../ShipmentHistory";
import { IAvailability } from "./availability";
import { IDeliveryRequest } from "./deliveryRequest";
import { IDeliveryStep } from "./deliveryStep";
import { IReserveRequest } from "./reserveRequest";
import { IShipment } from "./shipment";

export type Id = string;

enum VehicleType {
    Bike = 1,
    Car,
    Bus
}

export default interface ILoggedInUser {
    id: Id;
}

export type LoggedInUserContextType = {
    loggedInUserInfo: ILoggedInUser;
    location: Address;
    availability: IAvailability;
    setLoggedInUserInfo: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
    setLocation: React.Dispatch<React.SetStateAction<Address>>;
    setAvailability: React.Dispatch<React.SetStateAction<IAvailability>>;
}

export interface IReserver extends ILoggedInUser {
    costPerHour: Cost;
    packageType: PackageType;
    reserveRequests: Array<IReserveRequest>;
}

export type ReserverContextType = {
    reservers: IReserver[];
    setReserver: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
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
