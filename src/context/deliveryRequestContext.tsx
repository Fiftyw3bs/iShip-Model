import Sender from "../user/Sender";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { createContext, useContext, useState } from "react";
import React from "react";
import { defaultDeliveryRequest, DeliveryRequestContextType, DeliveryRequestState, IDeliveryRequest } from "../@types/deliveryRequest";
import { ShipmentContext } from "./shipmentContext";
import { ShipmentContextType } from "../@types/shipment";

export const DeliveryRequestContext = createContext<DeliveryRequestContextType | null>(null)

export const DeliveryRequestProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [deliveryRequestInfo, setDeliveryRequestInfo] = useState<IDeliveryRequest>(defaultDeliveryRequest);

    const { addDeliveryStep } = useContext(ShipmentContext) as ShipmentContextType;

    const saveDeliveryRequestInfo = (data: IDeliveryRequest) => {
        setDeliveryRequestInfo({
            cost: data.cost,
            shipment: data.shipment,
            state: data.state,
            step: data.step
        })
    }

    const accept = async (sender: Sender): Promise<Result<OkMessage, Errors>> => {
        if (sender.id == deliveryRequestInfo.shipment.sender.id) {
            return await addDeliveryStep(deliveryRequestInfo.step).then(
                e => e.andThen(
                    () => {
                        setDeliveryRequestInfo((prevData) => {
                            return {...prevData, state: DeliveryRequestState.APPROVED}
                        })
                        return Ok("DeliveryRequestAccepted");
                    }
                )
            )
        } else {
            return Promise.reject(Err("InvalidUser"));
        }
    }

    const reject = (sender: Sender): Promise<Result<OkMessage, Errors>> => {
        if (deliveryRequestInfo.shipment.sender.id == sender.id) {
            return new Promise<Result<OkMessage, Errors>>(
                (resolve) => {
                    setDeliveryRequestInfo((prevData) => {
                        return {...prevData, state: DeliveryRequestState.REJECTED}
                    })
                    resolve(Ok("DeliveryRequestRejected"))
                }
            )
        } else {
            return Promise.reject(Err("InvalidUser"));
        }
    }

    return (
        <DeliveryRequestContext.Provider value={{deliveryRequestInfo, saveDeliveryRequestInfo, accept, reject}}>
            {children}
        </DeliveryRequestContext.Provider>
    )
}