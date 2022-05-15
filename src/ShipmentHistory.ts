import Shipment from "./Shipment";

class ShipmentHistory {
    
    update(shipment: Shipment) {
        this.history.push(shipment);
    }

    private history: Array<Shipment> = new Array<Shipment>();
}

export default ShipmentHistory