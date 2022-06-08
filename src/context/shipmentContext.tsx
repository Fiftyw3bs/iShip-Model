import { createContext, useContext, useState } from "react";
import { v4 } from "uuid";
import { DeliveryStep, DispatchState, IDeliveryStep } from "../@types/deliveryStep";
import { ShipmentContextType, IShipment, ShipmentState } from "../@types/shipment";
import { Id, IDispatcher, IReceiver, IReserver, ISender } from "../@types/user";
import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";
import { PackageType } from "../Package";
import { DeliveryStepContext } from "./deliveryStepContext";

export const ShipmentContext = createContext<ShipmentContextType | null>(null);

export const ShipmentProvider: React.FC<React.ReactNode> = (): JSX.Element => {

    const [shipmentInfo, setShipmentInfo] = useState<IShipment[]>([]);

    const saveShipmentInfo = (data: IShipment) => {
        setShipmentInfo((prevState) => [
            ...prevState,
            {
                content: data.content,
                reserversId: data.reserversId,
                senderId: data.senderId,
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

    const getShipmentBySender = (sender: ISender): Promise<Result<IShipment[], Errors>> => {
        const shipments = shipmentInfo.filter(e => { return e.senderId == sender.id });
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
                stepValidator(shipmentInfo[index], step).andThen(
                    (e) => {
                        const tmp_step = step;
                        tmp_step.dispatchState = DispatchState.ACCEPTED
                        deliveryStep?.addDeliveryStep(tmp_step)
                        resolve(Ok(e));
                        return Ok(e);
                    }
                );
            }
        )
    }

    
    function instanceOfObj<A>(object: A): object is A {
        return 'member' in object;
    }

    const stepValidator = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (
            instanceOfObj<ISender>(step.source as ISender) &&
            instanceOfObj<ISender>(step.dispatcher as ISender) &&
            instanceOfObj<IReserver>(step.recipient as IReserver) &&
            instanceOfObj<ISender>(step.source as ISender) &&
            shipmentInfo.senderId == step.source.id
        ) {
            return selfDeliveryBySenderToReserver(shipmentInfo, step);
        } else if (
            instanceOfObj<IReserver>(step.source as IReserver) &&
            instanceOfObj<IReceiver>(step.recipient as IReceiver) &&
            instanceOfObj<IDispatcher>(step.dispatcher as IDispatcher)
        ) {
            return deliveryByDispatcherFromReserverToReceiver(shipmentInfo, step);
        } else if (
            instanceOfObj<IReserver>(step.source as IReserver) &&
            instanceOfObj<IReserver>(step.recipient as IReserver) &&
            instanceOfObj<IDispatcher>(step.dispatcher as IDispatcher)
        ) {
            return deliveryByDispatcherFromReserverToReserver(shipmentInfo, step);
        } else if (
            instanceOfObj<ISender>(step.source as ISender) &&
            instanceOfObj<IReceiver>(step.recipient as IReceiver) &&
            instanceOfObj<IDispatcher>(step.dispatcher as IDispatcher) &&
            step.source.id == shipmentInfo.senderId
        ) {
            return deliveryByDispatcherFromSenderToReceiver(shipmentInfo, step);
        } else if (
            instanceOfObj<ISender>(step.source as ISender) &&
            instanceOfObj<IReserver>(step.recipient as IReserver) &&
            instanceOfObj<IDispatcher>(step.dispatcher as IDispatcher) &&
            step.source.id == shipmentInfo.senderId
        ) {
            return deliveryByDispatcherFromSenderToReserver(shipmentInfo, step);
        } else {
            return Err("DeliveryStepNotAdded")
        }
    }

    const addReserver = (shipmentInfo: IShipment, reserver: IReserver): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.reserversId.map(e => { return e }).indexOf(reserver.id);
                if (index > -1) {
                    reject(Err("ReserverAlreadySelected"))
                }
                if (shipmentInfo.content.type != reserver.packageType && reserver.packageType != PackageType.All) {
                    reject(Err("InvalidReservablePackage"))
                }
                setShipmentInfo((prevState) => {
                    return [...prevState, { ...prevState[index], reserversId: [...prevState[index].reserversId, reserver.id] }]
                })
                resolve(Ok("ReserverAdded"));
            }
        );
    }

    const removeReserver = (shipmentInfo: IShipment, reserverId: Id): Promise<Result<OkMessage, Errors>> => {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = shipmentInfo.reserversId.map(e => { return e }).indexOf(reserverId);
                if (index > -1) {
                    setShipmentInfo((prevState) => {
                        const tmp = prevState[index].reserversId
                        tmp.splice(index, 1)
                        return [...prevState, { ...prevState[index], reserversId: tmp }]
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
        if (step.source.id == shipmentInfo.senderId) {
            const index = shipmentInfo.reserversId.map(e => { return e }).indexOf(step.recipient.id);
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
        if (step.dispatcher.id == shipmentInfo.senderId) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id == shipmentInfo.senderId) {
            return Err("SenderCantBeReserver");
        }
        if (step.recipient.id != shipmentInfo.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipmentInfo.reserversId.length > 0) {
            // Ensure it's the last `Reserver` in the delivery sequence
            const index = shipmentInfo.reserversId.map(e => { return e }).indexOf(step.source.id);
            if (index != (shipmentInfo.reserversId.length - 1)) {
                return Err("WrongStepInDeliverySequence");
            }
        } else {
            return Err("ReserverNotFound");
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromReserverToReserver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        const all_reservers = shipmentInfo.reserversId.map(e => { return e });
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
        if (step.dispatcher.id == shipmentInfo.senderId) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id != shipmentInfo.senderId) {
            return Err("InvalidSender");
        }
        if (step.recipient.id != shipmentInfo.receiver.id) {
            return Err("InvalidRecipient");
        }
        if (shipmentInfo.reserversId.length > 0) { // Must be confirmed from user
            setShipmentInfo((prevState) => {
                return {
                    ...prevState, reserversId: []
                }
            })
        }
        return Ok("DeliveryStepInitialized");
    }

    const deliveryByDispatcherFromSenderToReserver = (shipmentInfo: IShipment, step: IDeliveryStep): Result<OkMessage, Errors> => {
        if (step.dispatcher.id == shipmentInfo.senderId) {
            return Err("SenderCantBeDispatcher");
        }
        if (step.dispatcher.id == shipmentInfo.receiver.id) {
            return Err("ReceiverCantBeDispatcher");
        }
        if (step.source.id != shipmentInfo.senderId) {
            return Err("InvalidSender");
        }
        if (shipmentInfo.reserversId.length > 0) { // Must be confirmed from user
            const index = shipmentInfo.reserversId.map(e => { return e }).indexOf(step.recipient.id);
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
            {/* {children} */}
        </ShipmentContext.Provider>
    )
}

export default ShipmentProvider;