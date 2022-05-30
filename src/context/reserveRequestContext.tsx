import Reserver from "../user/Reserver";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import React, { createContext, useContext, useState } from "react";
import { defaultReserveRequest, IReserveRequest, ReserveRequestContextType } from "../@types/reserveRequest";
import { ShipmentContext } from "./shipmentContext";
import { ShipmentContextType } from "../@types/shipment";

export const ReserveRequestContext = createContext<ReserveRequestContextType | null>(null);

export const ReserveRequest: React.FC<React.ReactNode> = ({ children }) => {

    const [reserveRequestInfo, setReserveRequestInfo] = useState<IReserveRequest>(defaultReserveRequest);
    const { removeReserver } = useContext(ShipmentContext) as ShipmentContextType;
    
    const saveReserveRequestInfo = (data: IReserveRequest) => {
        setReserveRequestInfo({
            shipment: data.shipment,
            requestedAt: data.requestedAt,
            reserver: data.reserver
        })
    }

    const reject = async (reserver: Reserver): Promise<Result<OkMessage, Errors>> => {
        if (reserveRequestInfo.reserver.id != reserver.id) {
            return Promise.reject(Err("InvalidUser"))
        }
        if (reserveRequestInfo.shipment.sender.id == reserveRequestInfo.reserver.id) {
            return Promise.reject(Err("SenderCantBeReserver"))
        }
        if (reserveRequestInfo.shipment.receiver.id == reserveRequestInfo.reserver.id) {
            return Promise.reject(Err("ReceiverCantBeReserver"))
        }
        return await removeReserver(reserveRequestInfo.reserver).then(
            () => {
                return Ok("ReserveRequestRejected");
            },
            (error) => {
                return error
            }
        )
    }

    return (
        <ReserveRequestContext.Provider value={{reserveRequestInfo, saveReserveRequestInfo, reject}} >
            {children}
        </ReserveRequestContext.Provider>
    )
}
