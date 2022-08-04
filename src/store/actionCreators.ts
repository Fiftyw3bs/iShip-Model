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

export type State_Redux<T> = {
    objects: T[]
}

export type ShipmentState = State_Redux<IShipment>
export type DeliveryStepState = State_Redux<IDeliveryStep>
export type DeliveryRequestState = State_Redux<IDeliveryRequest>
export type ReserveRequestState = State_Redux<IReserveRequest>

export type Action_Redux<T> = {
    type: string,
    object: T
}

export type ShipmentAction = Action_Redux<IShipment>
export type DeliveryStepAction = Action_Redux<IDeliveryStep>
export type DeliveryRequestAction = Action_Redux<IDeliveryRequest>
export type ReserveRequestAction = Action_Redux<IReserveRequest>

type DispatchType<T> = (args: Action_Redux<T>) => Action_Redux<T>

export type ShipmentDispatchType = DispatchType<IShipment>
export type DeliveryStepDispatchType = DispatchType<IDeliveryStep>
export type DeliveryRequestDispatchType = DispatchType<IDeliveryRequest>
export type ReserveRequestDispatchType = DispatchType<IReserveRequest>

export const initialShipmentState: State_Redux<IShipment> = {
    objects: [defaultShipmentInfo]
}

export const initialtDeliveryRequestState: State_Redux<IDeliveryRequest> = {
    objects: [defaultDeliveryRequest]
}

export const initialtReserveRequestState: State_Redux<IReserveRequest> = {
    objects: [defaultReserveRequest]
}

export const initialDeliveryStepState: State_Redux<IDeliveryStep> = {
    objects: [defaultDeliveryStep]
}