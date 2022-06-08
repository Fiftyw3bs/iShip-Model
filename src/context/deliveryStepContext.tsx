import { createContext, useState } from "react";
import { v4 } from "uuid";
import { defaultDeliveryStep, DeliveryStepContextType, DispatchState, IDeliveryStep } from "../@types/deliveryStep";
import { Err, Errors, Ok, Result } from "../interfaces/Errors";
import ILoggedInUser, { IDispatcher } from "../@types/user";

export const DeliveryStepContext = createContext<DeliveryStepContextType | null>(null);

export const DeliveryStepProvider: React.FC<React.ReactNode> = () => {

    const [deliveryStepInfo, setDeliveryStepInfo] = useState<IDeliveryStep[]>([defaultDeliveryStep]);

    const addDeliveryStep = (data: IDeliveryStep) => setDeliveryStepInfo(
        (prevState) => [
            ...prevState,
            {
                source: data.source,
                shipmentId: data.shipmentId,
                recipient: data.recipient,
                completionTime: data.completionTime,
                dispatchState: data.dispatchState,
                id: data.id ? data.id : v4(),
                dispatcher: data.dispatcher
            }
        ]
    )

    const updateState = (data: IDeliveryStep, newState: DispatchState): Promise<void> => {
        return Promise.resolve(setDeliveryStepInfo((prevState) => {
            const index = deliveryStepInfo.map(e => { return e.id }).indexOf(data.id)
            return [
                ...prevState, { ...prevState[index], dispatchState: newState }
            ]
        }))
    }

    const getState = (data: IDeliveryStep): Promise<Result<DispatchState, Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const index = deliveryStepInfo.map(e => { return e.id }).indexOf(data.id)
                index > -1 ? resolve(Ok(deliveryStepInfo[index].dispatchState)) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    const getByShipmentId = (shipmentId: string): Promise<Result<IDeliveryStep, Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const index = deliveryStepInfo.map(e => { return e.shipmentId }).indexOf(shipmentId)
                index > -1 ? resolve(Ok(deliveryStepInfo[index])) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    const getByDispatcher = (dispatcher: IDispatcher): Promise<Result<IDeliveryStep[], Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const steps = deliveryStepInfo.filter(e => { return e.dispatcher.id == dispatcher.id })
                steps.length ? resolve(Ok(steps)) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    const getByRecipient = (recipient: ILoggedInUser): Promise<Result<IDeliveryStep[], Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const steps = deliveryStepInfo.filter(e => { return e.recipient.id == recipient.id })
                steps.length ? resolve(Ok(steps)) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    const getBySource = (source: ILoggedInUser): Promise<Result<IDeliveryStep[], Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const steps = deliveryStepInfo.filter(e => { return e.source.id == source.id })
                steps.length ? resolve(Ok(steps)) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    const getByState = (state: DispatchState): Promise<Result<IDeliveryStep[], Errors>> => {
        return new Promise(
            (resolve, reject) => {
                const steps = deliveryStepInfo.filter(e => { return e.dispatchState == state })
                steps.length ? resolve(Ok(steps)) : reject(Err("DeliveryStepNotFound"))
            }
        )
    }

    return (
        <DeliveryStepContext.Provider value={
            {
                deliveryStepInfo,
                getState,
                updateState,
                getByShipmentId,
                getByDispatcher,
                addDeliveryStep,
                getByRecipient,
                getBySource,
                getByState
            }
        }>
        </DeliveryStepContext.Provider>
    )
}