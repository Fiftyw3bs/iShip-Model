import { DispatchState, IDeliveryStep } from "./interfaces/IDeliveryStep";
import { Package, PackageType } from "./Package";
import Receiver from "./user/Receiver";
import Reserver from "./user/Reserver";
import Sender from "./user/Sender";
import LoggedInUser from "./user/User";
import { Errors, Ok, Err, Result, OkMessage } from "./interfaces/Errors";
import { v4 } from "uuid";
import Dispatcher from "./user/Dispatcher";

export enum Priority {
    Low = 1,
    Medium,
    High
}

export enum ShipmentState {
    AWAITING_PICKUP,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}

class Shipment {
    constructor(content: Package
        , sender: Sender
        , receiver: Receiver
    ) {
        this._content = content
        this._sender = sender
        this._currentHolder = sender
        this._receiver = receiver
        this._state = ShipmentState.AWAITING_PICKUP
        this._creationTime = new Date();
        this._id = v4();
    }

    public static create(content: Package
        , sender: Sender
        , receiver: Receiver
    ): Shipment {
        const shipment = new Shipment(content, sender, receiver);
        sender.shipmentHistory.update(shipment)
        return shipment;
    }

    addDeliveryStep(step: IDeliveryStep): Promise<Result<OkMessage, Errors>> {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (this._deliverySteps.map(e => { return e.dispatcher.id }).indexOf(step.dispatcher.id) > -1) {
                    reject(Err("UserAlreadyADispatcher"));
                }
                resolve(step.init(this).andThen(
                    (e) => {
                        step.dispatchState = DispatchState.ACCEPTED;
                        this._deliverySteps.push(step);
                        return Ok(e);
                    }
                ));
            }
        )
    }

    addReserver(reserver: Reserver): Promise<Result<OkMessage, Errors>> {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (this.content.type != reserver.packageType && reserver.packageType != PackageType.All) {
                    reject(Err("InvalidReservablePackage"))
                }
                if (this.reservers.includes(reserver, 0)) {
                    reject(Err("ReserverAlreadySelected"))
                }
                this.reservers.push(reserver);
                resolve(Ok("ReserverAdded"));
            }
        );
    }

    removeReserver(reserver: Reserver): Promise<Result<OkMessage, Errors>> {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                const index = this.reservers.map(e => { return e.id }).indexOf(reserver.id);
                if (index > -1) {
                    this.reservers.splice(index, 1);
                    resolve(Ok("ReserverRemoved"));
                } else {
                    reject(Err("ReserverNotFound"));
                }
            }
        );
    }

    pickup(step: IDeliveryStep): Promise<Result<OkMessage, Errors>> {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (step.source.id != this.currentHolder.id) {
                    reject(Err("UserNotCurrentHolder"));
                }
                const index = this._deliverySteps.map(e => { return e.id }).indexOf(step.id);
                if (index > -1) {
                    if (this._deliverySteps[index].dispatchState == DispatchState.ACCEPTED) {
                        this._state = ShipmentState.IN_TRANSIT;
                        this._deliverySteps[index].dispatchState = DispatchState.IN_TRANSIT;
                        step.dispatchState = DispatchState.IN_TRANSIT;
                        this._currentHolder = step.dispatcher;
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

    deliver(step: IDeliveryStep): Promise<Result<OkMessage, Errors>> {
        return new Promise<Result<OkMessage, Errors>>(
            (resolve, reject) => {
                if (step.dispatcher.id != this.currentHolder.id) {
                    reject(Err("UserNotCurrentHolder"));
                }
                const index = this._deliverySteps.map(e => { return e.id }).indexOf(step.id);
                if (index > -1) {
                    if (this._deliverySteps[index].dispatchState == DispatchState.IN_TRANSIT) {
                        this._state = this.receiver.id == step.recipient.id ? ShipmentState.DELIVERED : this._state;
                        this._deliverySteps[index].dispatchState = DispatchState.COMPLETED;
                        this._currentHolder = step.recipient;
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

    status(): ShipmentState {
        return this._state;
    }

    public set content(v: Package) {
        this._content = v;
    }

    public get content(): Package {
        return this._content;
    }

    public get sender(): Sender {
        return this._sender;
    }
    
    public get currentHolder() : LoggedInUser {
        return this._currentHolder;
    }
    
    public get creationTime() : Date {
        return this._creationTime;
    }
    
    public get state() : ShipmentState {
        return this._state;
    }
    
    public get receiver() : Receiver {
        return this._receiver;
    }
    
    public get reservers() : Array<Reserver> {
        return this._reservers;
    }
    
    public get id() : string {
        return this._id;
    }

    public get dispatchers() : Array<Dispatcher> {
        return this._deliverySteps.map(e => {return e.dispatcher as Dispatcher})
    }
    
    private _content: Package;
    private _deliverySteps: Array<IDeliveryStep> = new Array<IDeliveryStep>();
    private _reservers: Array<Reserver> = new Array<Reserver>();
    private _sender: Sender;
    private _id: string;
    private _currentHolder: LoggedInUser;
    private _receiver: Receiver;
    private _state: ShipmentState;
    private _creationTime: Date;
}

export default Shipment;