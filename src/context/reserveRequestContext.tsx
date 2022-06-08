import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import React, { createContext, useContext, useState } from "react";
import { defaultReserveRequest, IReserveRequest, ReserveRequestContextType } from "../@types/reserveRequest";
import { ShipmentContext } from "./shipmentContext";
import { ShipmentContextType } from "../@types/shipment";
import { IReserver } from "../@types/user";

export const ReserveRequestContext = createContext<ReserveRequestContextType | null>(null);

export const ReserveRequest: React.FC<React.ReactNode> = () => {

    const [reserveRequestInfo, setReserveRequestInfo] = useState<IReserveRequest[]>([defaultReserveRequest]);
    const { removeReserver } = useContext(ShipmentContext) as ShipmentContextType;

    const saveReserveRequestInfo = (data: IReserveRequest) => {
        setReserveRequestInfo((prevState) => [
            ...prevState,
            {
                shipmentId: data.shipmentId,
                requestedAt: data.requestedAt,
                reserverId: data.reserverId
            }
        ])
    }

    const reject = async (reserveRequest: IReserveRequest, reserver: IReserver): Promise<Result<OkMessage, Errors>> => {
        const { getShipmentById } = React.useContext(ShipmentContext) as ShipmentContextType;
        await getShipmentById(reserveRequest.shipmentId).then(
            async result => {
                if (result.ok) {
                    const shipment = result.val;
                    const index = reserveRequestInfo.map(e => { return e.shipmentId }).indexOf(shipment.id);
                    if (reserveRequestInfo[index].reserverId != reserver.id) {
                        return Promise.reject(Err("InvalidUser"))
                    }
                    if (shipment.senderId == reserveRequestInfo[index].reserverId) {
                        return Promise.reject(Err("SenderCantBeReserver"))
                    }
                    if (shipment.receiver.id == reserveRequestInfo[index].reserverId) {
                        return Promise.reject(Err("ReceiverCantBeReserver"))
                    }
                    return await removeReserver(shipment, reserveRequestInfo[index].reserverId).then(
                        () => {
                            return Ok("ReserveRequestRejected");
                        },
                        (error) => {
                            return error
                        }
                    )
                }
            }
        )

        return Promise.reject(Err("ShipmentNotFound"));
    }

    return (
        <ReserveRequestContext.Provider value={{ reserveRequestInfo, saveReserveRequestInfo, reject }} >
            {/* {children} */}
        </ReserveRequestContext.Provider>
    )
}
