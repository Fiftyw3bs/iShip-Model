import Shipment from "./Shipment";

class ShipmentHistory {

    update(shipment: Shipment) {
        this.history.push(shipment);
    }
    public toJSON() {
        return JSON.stringify(this.history);
    }

    private history: Array<Shipment> = new Array<Shipment>();
}

export default ShipmentHistory