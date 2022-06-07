import { IShipment } from "./@types/shipment";

class ShipmentHistory {
    
    update(shipment: IShipment) {
        this.history.push(shipment);
    }

    private history: Array<IShipment> = new Array<IShipment>();
}

export default ShipmentHistory