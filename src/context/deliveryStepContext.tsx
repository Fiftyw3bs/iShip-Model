import { createContext, useState } from "react";
import { v4 } from "uuid";
import { defaultDeliveryStep, DeliveryStepContextType, IDeliveryStep } from "../@types/deliveryStep";
import { IShipment } from "../@types/shipment";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";

export const DeliveryStepContext = createContext<DeliveryStepContextType | null>(null);

export const DeliveryStepProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [deliveryStepInfo, setDeliveryStepInfo] = useState<IDeliveryStep>(defaultDeliveryStep);

    const saveDeliveryStepInfo = (data: IDeliveryStep) => setDeliveryStepInfo({
        source: data.source,
        recipient: data.recipient,
        completionTime: data.completionTime,
        dispatchState: data.dispatchState,
       id: data.id ? data.id : v4(),
        dispatcher: data.dispatcher,
        stepValidator: data.stepValidator
    })

    const selfDeliveryBySenderToReserver = (shipment: IShipment): Result<OkMessage, Errors> => {
        if (deliveryStepInfo.source.id == shipment.sender.id) {
            const index = shipment.reservers.map(e => { return e.id }).indexOf(deliveryStepInfo.recipient.id);
            if (index > -1) {
                if (index == 0) { // Ensure the Reserver is the first in the package delivery sequence
                    return Ok("DeliveryStepInitialized");
                } else {
                    return Err("WrongStepInDeliverySequence");
                }
            } else {
                return Err("ReserverNotFound");
            }
        } else {
            return Err("InvalidSender");
        }
    }

    const deliveryByDispatcherFromReserverToReceiver = (shipment: IShipment): Result<OkMessage, Errors> => {
        if (deliveryStepInfo.dispatcher.id == shipment.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (deliveryStepInfo.dispatcher.id == shipment.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (deliveryStepInfo.source.id == shipment.sender.id) {
            return Err("SenderCantBeReserver");
        }
        if (deliveryStepInfo.recipient.id != shipment.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipment.reservers.length > 0) {
            // Ensure it's the last `Reserver` in the delivery sequence
            const index = shipment.reservers.map(e => { return e.id }).indexOf(deliveryStepInfo.source.id);
            if (index != (shipment.reservers.length - 1)) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromReserverToReserver = (shipment: IShipment): Result<OkMessage, Errors> => {
        const all_reservers = shipment.reservers.map(e => { return e.id });
        const source_index = all_reservers.indexOf(deliveryStepInfo.source.id);
        const recipient_index = all_reservers.indexOf(deliveryStepInfo.recipient.id);
        if (source_index == -1) {
            return Err("ReserverNotFound");
        }
        if (recipient_index == -1) {
            return Err("UserNotFound");
        }
        if ((recipient_index - source_index) != 1) {
            return Err("WrongStepInDeliverySequence");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromSenderToReceiver = (shipment: IShipment): Result<OkMessage, Errors> => {
        const all_reservers = shipment.reservers.map(e => { return e.id });
        const source_index = all_reservers.indexOf(deliveryStepInfo.source.id);
        const recipient_index = all_reservers.indexOf(deliveryStepInfo.recipient.id);
        if (source_index == -1) {
            return Err("ReserverNotFound");
        }
        if (recipient_index == -1) {
            return Err("UserNotFound");
        }
        if ((recipient_index - source_index) != 1) {
            return Err("WrongStepInDeliverySequence");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromSenderToReserver = (shipment: IShipment) : Result<OkMessage, Errors> => {
        if (deliveryStepInfo.dispatcher.id == shipment.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (deliveryStepInfo.dispatcher.id == shipment.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (deliveryStepInfo.source.id != shipment.sender.id) {
            return Err("InvalidSender");
        }
        if (shipment.reservers.length > 0) { // Must be confirmed from user
            const index = shipment.reservers.map(e => { return e.id }).indexOf(deliveryStepInfo.recipient.id);
            if (index != 0) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    return (
        <DeliveryStepContext.Provider value={
            {
                deliveryStepInfo,
                saveDeliveryStepInfo,
                selfDeliveryBySenderToReserver,
                deliveryByDispatcherFromReserverToReceiver,
                deliveryByDispatcherFromReserverToReserver,
                deliveryByDispatcherFromSenderToReceiver,
                deliveryByDispatcherFromSenderToReserver
            }
        }>
            {children}
        </DeliveryStepContext.Provider>
    )
}