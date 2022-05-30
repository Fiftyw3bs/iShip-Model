import { createContext, useState } from "react";
import { v4 } from "uuid";
import { DispatchState, IDeliveryStep } from "../@types/deliveryStep";
import { ShipmentContextType, IShipment, ShipmentState, defaultShipmentInfo } from "../@types/shipment";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { PackageType } from "../Package";
import Reserver from "../user/Reserver";

export const ShipmentContext = createContext<ShipmentContextType | null>(null);

export const ShipmentProvider: React.FC<React.ReactNode> = ({ children }): JSX.Element => {

    const [shipmentInfo, setShipmentInfo] = useState<IShipment>(defaultShipmentInfo);

    const saveShipmentInfo = (data: IShipment) => {
        setShipmentInfo({
            content: data.content,
            deliverySteps: data.deliverySteps,
            reservers: data.reservers,
            sender: data.sender,
            id: data.id ? data.id : v4(),
            currentHolder: data.currentHolder,
            receiver: data.receiver,
            state: data.state,
            creationTime: data.creationTime
        })
    }

    const addDeliveryStep = (step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (shipmentInfo.deliverySteps.map(e => { return e.dispatcher.id }).indexOf(step.dispatcher.id) > -1) {
                    reject(Err("UserAlreadyADispatcher"));
                }
                resolve(step.stepValidator(shipmentInfo).andThen(
                    (e) => {
                        step.dispatchState = DispatchState.ACCEPTED;
                        setShipmentInfo((prevState) => {
                            return { ...prevState, deliverySteps: [...prevState.deliverySteps, step] }
                        })
                        return Ok(e);
                    }
                ));
            }
        )
    }

    const addReserver = (reserver: Reserver): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (shipmentInfo.content.type != reserver.packageType && reserver.packageType != PackageType.All) {
                    reject(Err("InvalidReservablePackage"))
                }
                if (shipmentInfo.reservers.includes(reserver, 0)) {
                    reject(Err("ReserverAlreadySelected"))
                }
                setShipmentInfo((prevState) => {
                    return { ...prevState, reservers: [...prevState.reservers, reserver] }
                })
                resolve(Ok("ReserverAdded"));
            }
        );
    }

    const removeReserver = (reserver: Reserver): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(reserver.id);
                if (index > -1) {
                    setShipmentInfo((prevState) => {
                        return { ...prevState, reservers: prevState.reservers = prevState.reservers.splice(index, 1) }
                    })
                    resolve(Ok("ReserverRemoved"));
                } else {
                    reject(Err("ReserverNotFound"));
                }
            }
        );
    }

    const pickup = (step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (step.source.id != shipmentInfo.currentHolder.id) {
                    reject(Err("UserNotCurrentHolder"));
                }
                const index = shipmentInfo.deliverySteps.map(e => { return e.id }).indexOf(step.id);
                if (index > -1) {
                    if (shipmentInfo.deliverySteps[index].dispatchState == DispatchState.ACCEPTED) {
                        shipmentInfo.deliverySteps[index].dispatchState = DispatchState.IN_TRANSIT;
                        step.dispatchState = DispatchState.IN_TRANSIT;
                        setShipmentInfo((prevState) => {
                            return { ...prevState, state: ShipmentState.IN_TRANSIT }
                        })
                        resolve(Ok("PackagePickedUp"));
                    } else {
                        reject(Err("DeliveryStepNotYetAccepted"));
                    }
                } else {
                    reject(Err("DeliveryStepNotFound"));
                }
            }
        );
    }

    const deliver = (step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (step.dispatcher.id != shipmentInfo.currentHolder.id) {
                    reject(Err("UserNotCurrentHolder"));
                }
                const index = shipmentInfo.deliverySteps.map(e => { return e.id }).indexOf(step.id);
                if (index > -1) {
                    if (shipmentInfo.deliverySteps[index].dispatchState == DispatchState.IN_TRANSIT) {
                        shipmentInfo.deliverySteps[index].dispatchState = DispatchState.COMPLETED;
                        setShipmentInfo((prevState) => {
                            return { ...prevState, deliverySteps: shipmentInfo.deliverySteps, currentHolder: step.recipient, state: prevState.receiver.id == step.recipient.id ? ShipmentState.DELIVERED : shipmentInfo.state }
                        })
                        step.dispatchState = DispatchState.COMPLETED;
                        resolve(Ok("PackageDelivered"));
                    } else {
                        reject(Err("DeliveryStepNotInitialized"));
                    }
                } else {
                    reject(Err("DeliveryStepNotFound"));
                }
            }
        );
    }

    return (
        <ShipmentContext.Provider value={{ shipmentInfo, saveShipmentInfo, addDeliveryStep, deliver, pickup, addReserver, removeReserver }}>
            {children}
        </ShipmentContext.Provider>
    )
}