import DeliveryRequest from "../DeliveryRequest";
import { IDeliveryStep } from "../interfaces/IDeliveryStep";
import Cost from "../interfaces/Cost";
import Shipment from "../Shipment";
import LoggedInUser from "./User";

enum VehicleType {
    Bike = 1,
    Car,
    Bus
}

class Dispatcher extends LoggedInUser {
    constructor(id: string) {
        super(id)
    }

    pickup(shipment: Shipment, step: IDeliveryStep) {
        shipment.pickup(step);
    }
    
    deliver(shipment: Shipment, step: IDeliveryStep) {
        shipment.deliver(step);
    }

    bid(shipment: Shipment, cost: Cost, step: IDeliveryStep): DeliveryRequest {
        const request = new DeliveryRequest(shipment, cost, step);
        this.deliveryRequests.push(request);
        return request
    }
    
    vehicle:            VehicleType             = VehicleType.Bike;
    deliveryRequests:   Array<DeliveryRequest>  = new Array<DeliveryRequest>();
}

export default Dispatcher   