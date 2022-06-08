import { createContext, useContext, useState } from "react";
import { DeliveryRequestContextType, DeliveryRequestState, IDeliveryRequest } from "../@types/deliveryRequest";
import { IDeliveryStep } from "../@types/deliveryStep";
import { IShipment, ShipmentContextType } from "../@types/shipment";
import { DispatcherContextType, IDispatcher } from "../@types/user";
import { DeliveryRequestContext } from "./deliveryRequestContext";
import { ShipmentContext } from "./shipmentContext";
import Cost from "../interfaces/Cost";
import { v4 } from "uuid";

export const DispatcherContext = createContext<DispatcherContextType | null>(null);

export const Dispatcher: React.FC<React.ReactNode> = () => {

    const [dispatcherInfo, setDispatcherInfo] = useState<IDispatcher[]>([]);
    
    const pickup = (shipment: IShipment, step: IDeliveryStep) => {
        const { pickup } = useContext(ShipmentContext) as ShipmentContextType;
        pickup(shipment, step);
    }

    const deliver = (shipment: IShipment, step: IDeliveryStep) => {
        const { deliver } = useContext(ShipmentContext) as ShipmentContextType;
        deliver(shipment, step);
    }

    const bid = (shipment: IShipment, cost: Cost, step: IDeliveryStep): IDeliveryRequest => {
        const { saveDeliveryRequestInfo } = useContext(DeliveryRequestContext) as DeliveryRequestContextType;
        const request = {cost: cost, shipmentId: shipment.id, step: step, state: DeliveryRequestState.AWAITING_APPROVAL, id: v4()};
        saveDeliveryRequestInfo(request);
        return request
    }

    return (
        <DispatcherContext.Provider value={{dispatcherInfo, pickup, deliver, bid}}>

        </DispatcherContext.Provider>
    );
}

export default Dispatcher   