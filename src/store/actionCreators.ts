import { defaultDeliveryRequest, IDeliveryRequest } from "../@types/deliveryRequest";
import { defaultDeliveryStep, IDeliveryStep } from "../@types/deliveryStep";
import { defaultReserveRequest, IReserveRequest } from "../@types/reserveRequest";
import { defaultShipmentInfo, IShipment } from "../@types/shipment";
import * as actionTypes from "./actionTypes";

export function add<T>(object: T) {
    const action: Action_Redux<T> = {
        type: actionTypes.ADD,
        object,
    }

    return simulateHttpRequest<T>(action)
}

export function remove<T>(object: T) {
    const action: Action_Redux<T> = {
        type: actionTypes.REMOVE,
        object,
    }
    return simulateHttpRequest<T>(action)
}

export function update<T>(object: T) {
    const action: Action_Redux<T> = {
        type: actionTypes.UPDATE,
        object,
    }
    return simulateHttpRequest<T>(action)
}

export function simulateHttpRequest<T>(action: Action_Redux<T>) {
    return (dispatch: DispatchType<T>) => {
        setTimeout(() => {
            dispatch(action)
        }, 500)
    }
}

export type State_Redux = {
    shipments: IShipment[],
    deliverySteps: IDeliveryStep[],
    deliveryRequests: IDeliveryRequest[],
    reserveRequests: IReserveRequest[]
}

export type Action_Redux<T> = {
    type: string,
    object: T
}

type DispatchType<T> = (args: Action_Redux<T>) => Action_Redux<T>

export type ShipmentDispatchType = DispatchType<IShipment>
export type DeliveryStepDispatchType = DispatchType<IDeliveryStep>
export type DeliveryRequestDispatchType = DispatchType<IDeliveryRequest>
export type ReserveRequestDispatchType = DispatchType<IReserveRequest>

export const initialState: State_Redux = {
    shipments: [defaultShipmentInfo],
    deliverySteps: [defaultDeliveryStep],
    deliveryRequests: [defaultDeliveryRequest],
    reserveRequests: [defaultReserveRequest]
}
