import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { createContext, useContext, useState } from "react";
import React from "react";
import { DeliveryRequestContextType, DeliveryRequestState, IDeliveryRequest } from "../@types/deliveryRequest";
import { ShipmentContext } from "./shipmentContext";
import { IShipment, ShipmentContextType } from "../@types/shipment";
import { v4 } from "uuid";
import { ISender } from "../@types/user";

export const DeliveryRequestContext = createContext<DeliveryRequestContextType | null>(null)

export const DeliveryRequestProvider: React.FC<React.ReactNode> = () => {

    const [deliveryRequestInfo, setDeliveryRequestInfo] = useState<IDeliveryRequest[]>([]);

    const { addDeliveryStep } = useContext(ShipmentContext) as ShipmentContextType;

    const saveDeliveryRequestInfo = (data: IDeliveryRequest) => {
        setDeliveryRequestInfo((prevState) => [
            ...prevState,
            {
                cost: data.cost,
                shipmentId: data.shipmentId,
                state: data.state,
                step: data.step,
                id: data.id ? data.id : v4()
            }
        ])
    }

    const accept = async (request: IDeliveryRequest, sender: ISender): Promise<Result<OkMessage, Errors>> => {
        return await useContext(ShipmentContext)?.getShipmentById(request.shipmentId).then(
            async (value: Result<IShipment, Errors>) => {
                if (value.ok) {
                    const shipment = value.val
                    if (sender.id == shipment.senderId) {
                        return await addDeliveryStep(request.step).then(
                            e => e.andThen(
                                () => {
                                    setDeliveryRequestInfo((prevData) => {
                                        return { ...prevData, state: DeliveryRequestState.APPROVED }
                                    })
                                    return Ok("DeliveryRequestAccepted");
                                }
                            )
                        )
                    } else {
                        return Err("InvalidUser");
                    }
                }
            },
            (error) => {
                return error;
            }
        )
    }

    const reject = async (request: IDeliveryRequest, sender: ISender): Promise<Result<OkMessage, Errors>> => {
        return await useContext(ShipmentContext)?.getShipmentById(request.shipmentId).then(
            async (value: Result<IShipment, Errors>) => {
                if (value.ok) {
                    const shipment = value.val
                    if (shipment.senderId == sender.id) {
                        return new Promise<Result<OkMessage, Errors>>(
                            (resolve) => {
                                setDeliveryRequestInfo((prevData) => {
                                    return { ...prevData, state: DeliveryRequestState.REJECTED }
                                })
                                resolve(Ok("DeliveryRequestRejected"))
                            }
                        )
                    } else {
                        return Promise.reject(Err("InvalidUser"));
                    }
                }
            },
            (error) => {
                return error;
            }
        )
    }

    return (
        <DeliveryRequestContext.Provider value={{ deliveryRequestInfo, saveDeliveryRequestInfo, accept, reject }}>
            {/* {children} */}
        </DeliveryRequestContext.Provider>
    )
}

export default DeliveryRequestProvider;