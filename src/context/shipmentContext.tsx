import { createContext, useContext, useState } from "react";
import { v4 } from "uuid";
import { DeliveryStep, DispatchState, IDeliveryStep } from "../@types/deliveryStep";
import { ShipmentContextType, IShipment, ShipmentState } from "../@types/shipment";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { PackageType } from "../Package";
import Dispatcher from "../user/Dispatcher";
import Receiver from "../user/Receiver";
import Reserver from "../user/Reserver";
import Sender from "../user/Sender";
import { DeliveryStepContext } from "./deliveryStepContext";

export const ShipmentContext = createContext<ShipmentContextType | null>(null);

export const ShipmentProvider: React.FC<React.ReactNode> = ({ children }): JSX.Element => {

    const [shipmentInfo, setShipmentInfo] = useState<IShipment[]>([]);

    const saveShipmentInfo = (data: IShipment) => {
        setShipmentInfo((prevState) => [
            ...prevState,
            {
                content: data.content,
                reservers: data.reservers,
                sender: data.sender,
                id: data.id ? data.id : v4(),
                currentHolder: data.currentHolder,
                receiver: data.receiver,
                state: data.id ? data.state : ShipmentState.AWAITING_PICKUP,
                creationTime: data.id ? data.creationTime : new Date()
            }
        ])
    }

    const getShipmentById = (id: string): Promise<Result<IShipment, Errors>> => {
        const index = shipmentInfo.map(e => { return e.id }).indexOf(id);
        if (index > -1) {
            return Promise.reject(Err("ShipmentNotFound"));
        } else {
            return Promise.resolve(Ok(shipmentInfo[index]))
        }
    }

    const getShipmentBySender = (sender: Sender): Promise<Result<IShipment[], Errors>> => {
        const shipments = shipmentInfo.filter(e => { return e.sender.id == sender.id });
        if (shipments.length < 1) {
            return Promise.reject(Err("ShipmentNotFound"));
        } else {
            return Promise.resolve(Ok(shipments))
        }
    }

    const addDeliveryStep = (step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.map(e => { return e.id }).indexOf(step.shipmentId);
                if (index > -1) {
                    reject(Err("ShipmentNotFound"));
                }
                resolve(stepValidator(shipmentInfo[index], step).andThen(
                    (e) => {
                        const tmp_step = step;
                        tmp_step.dispatchState = DispatchState.ACCEPTED
                        deliveryStep?.addDeliveryStep(tmp_step)
                        return Ok(e);
                    }
                ));
            }
        )
    }

    const stepValidator = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (
            step.source instanceof Sender &&
            step.dispatcher instanceof Sender &&
            step.recipient instanceof Reserver &&
            shipmentInfo.sender.id == step.source.id
        ) {
            return selfDeliveryBySenderToReserver(shipmentInfo, step);
        } else if (
            step.source instanceof Reserver &&
            step.recipient instanceof Receiver &&
            step.dispatcher instanceof Dispatcher
        ) {
            return deliveryByDispatcherFromReserverToReceiver(shipmentInfo, step);
        } else if (
            step.source instanceof Reserver &&
            step.recipient instanceof Reserver &&
            step.dispatcher instanceof Dispatcher
        ) {
            return deliveryByDispatcherFromReserverToReserver(shipmentInfo, step);
        } else if (
            step.source instanceof Sender &&
            step.recipient instanceof Receiver &&
            step.dispatcher instanceof Dispatcher &&
            step.source.id == shipmentInfo.sender.id
        ) {
            return deliveryByDispatcherFromSenderToReceiver(shipmentInfo, step);
        } else if (
            step.source instanceof Sender &&
            step.recipient instanceof Reserver &&
            step.dispatcher instanceof Dispatcher &&
            step.source.id == shipmentInfo.sender.id
        ) {
            return deliveryByDispatcherFromSenderToReserver(shipmentInfo, step);
        } else {
            return Err("DeliveryStepNotAdded")
        }
    }

    const addReserver = (shipmentInfo: IShipment, reserver: Reserver): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(reserver.id);
                if (index > -1) {
                    reject(Err("ReserverAlreadySelected"))
                }
                if (shipmentInfo.content.type != reserver.packageType && reserver.packageType != PackageType.All) {
                    reject(Err("InvalidReservablePackage"))
                }
                if (shipmentInfo.reservers.includes(reserver, 0)) {
                    reject(Err("ReserverAlreadySelected"))
                }
                setShipmentInfo((prevState) => {
                    return [...prevState, { ...prevState[index], reservers: [...prevState[index].reservers, reserver] }]
                })
                resolve(Ok("ReserverAdded"));
            }
        );
    }

    const removeReserver = (shipmentInfo: IShipment, reserver: Reserver): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(reserver.id);
                if (index > -1) {
                    setShipmentInfo((prevState) => {
                        const tmp = prevState[index].reservers
                        tmp.splice(index, 1)
                        return [...prevState, { ...prevState[index], reservers: tmp }]
                    })
                    resolve(Ok("ReserverRemoved"));
                } else {
                    reject(Err("ReserverNotFound"));
                }
            }
        );
    }

    const pickup = (shipmentInfo: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (step.source.id != shipmentInfo.currentHolder.id) {
                    reject(Err("UserNotCurrentHolder"));
                }
                const index = deliveryStep?.deliveryStepInfo.map(e => { return e.id }).indexOf(step.id);
                if (index > -1) {
                    deliveryStep?.getState(step).then(
                        (state: Result<DispatchState, Errors>) => {
                            if (state.ok) {
                                const val = state.val;
                                if (val == DispatchState.ACCEPTED) {
                                    deliveryStep?.updateState(step, DispatchState.IN_TRANSIT);
                                    setShipmentInfo((prevState) => {
                                        return {
                                            ...prevState,
                                            state: ShipmentState.IN_TRANSIT
                                        }
                                    })
                                    resolve(Ok("PackagePickedUp"));
                                } else {
                                    reject(Err("DeliveryStepNotYetAccepted"));
                                }
                            }
                        }
                    )
                } else {
                    reject(Err("DeliveryStepNotFound"));
                }
            }
        );
    }

    const deliveryStep = useContext(DeliveryStepContext) as DeliveryStep;

    const deliver = (shipment: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const shipmentIndex = shipmentInfo.map(e => { return e.id }).indexOf(step.shipmentId);
                if (shipmentIndex > -1) {
                    if (step.dispatcher.id != shipment.currentHolder.id) {
                        reject(Err("UserNotCurrentHolder"));
                    }
                    const index = deliveryStep?.deliveryStepInfo.map(e => { return e.id }).indexOf(step.id);
                    if (index > -1) {
                        deliveryStep?.getState(step).then(
                            (state: Result<DispatchState, Errors>) => {
                                if (state.ok) {
                                    const val = state.val;
                                    if (val == DispatchState.IN_TRANSIT) {
                                        deliveryStep?.updateState(step, DispatchState.COMPLETED);
                                        setShipmentInfo((prevState) => {
                                            return {
                                                ...prevState,
                                                currentHolder: step.recipient,
                                                state: prevState[shipmentIndex].receiver.id == step.recipient.id ? ShipmentState.DELIVERED : shipment.state
                                            }
                                        })
                                        resolve(Ok("PackageDelivered"));
                                    } else {
                                        reject(Err("DeliveryStepNotInitialized"));
                                    }
                                }
                            }
                        )
                    } else {
                        reject(Err("DeliveryStepNotFound"));
                    }
                } else {
                    reject(Err("ShipmentNotFound"))
                }
            });
    }

    const selfDeliveryBySenderToReserver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (step.source.id == shipmentInfo.sender.id) {
            const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(step.recipient.id);
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

    const deliveryByDispatcherFromReserverToReceiver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (step.dispatcher.id == shipmentInfo.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id == shipmentInfo.sender.id) {
            return Err("SenderCantBeReserver");
        }
        if (step.recipient.id != shipmentInfo.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipmentInfo.reservers.length > 0) {
            // Ensure it's the last `Reserver` in the delivery sequence
            const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(step.source.id);
            if (index != (shipmentInfo.reservers.length - 1)) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromReserverToReserver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        const all_reservers = shipmentInfo.reservers.map(e => { return e.id });
        const source_index = all_reservers.indexOf(step.source.id);
        const recipient_index = all_reservers.indexOf(step.recipient.id);
        if (source_index == -1) {
            return Err("ReserverNotFound");
        }
        if (recipient_index == -1) {
            return Err("ReserverNotFound");
        }
        if ((recipient_index - source_index) != 1) {
            return Err("WrongStepInDeliverySequence");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromSenderToReceiver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (step.dispatcher.id == shipmentInfo.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id != shipmentInfo.sender.id) {
            return Err("InvalidSender");
        }
        if (step.recipient.id != shipmentInfo.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipmentInfo.reservers.length > 0) { // Must be confirmed from user
            setShipmentInfo((prevState) => {
                return {
                    ...prevState, reservers: []
                }
            })
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromSenderToReserver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (step.dispatcher.id == shipmentInfo.sender.id) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id != shipmentInfo.sender.id) {
            return Err("InvalidSender");
        }
        if (shipmentInfo.reservers.length > 0) { // Must be confirmed from user
            const index = shipmentInfo.reservers.map(e => { return e.id }).indexOf(step.recipient.id);
            if (index != 0) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    return (
        <ShipmentContext.Provider value={
            {
                shipmentInfo,
                getShipmentById,
                getShipmentBySender,
                saveShipmentInfo,
                addDeliveryStep,
                deliver,
                pickup,
                addReserver,
                removeReserver
            }
        }>
            {children}
        </ShipmentContext.Provider>
    )
}