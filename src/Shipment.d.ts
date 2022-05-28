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
    AWAITING_PICKUP = "Awaiting Pickup",
    IN_TRANSIT = "In Transit",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled"
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
                        this._deliverySteps[this._addedDeliverySteps++] = step;
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
                this.reservers[this._addedReservers++] = reserver;
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
                    this._addedReservers--;
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

    public get currentHolder(): LoggedInUser {
        return this._currentHolder;
    }

    public get creationTime(): Date {
        return this._creationTime;
    }

    public get state(): ShipmentState {
        return this._state;
    }

    public get receiver(): Receiver {
        return this._receiver;
    }

    public get reservers(): Array<Reserver> {
        return this._reservers;
    }

    public get id(): string {
        return this._id;
    }

    public get addedReservers(): number {
        return this._addedReservers;
    }

    public get addedDeliverySteps(): number {
        return this._addedDeliverySteps;
    }

    public get dispatchers(): Array<Dispatcher> {
        return this._deliverySteps.map(e => { return e.dispatcher as Dispatcher })
    }

    /**
     * toJSON
     */
    public toJSON() {
        return JSON.stringify({
            content: this._content,
            deliverySteps: this._deliverySteps,
            reservers: this._reservers,
            sender: this._sender,
            _id: this._id,
            currentHolder: this.currentHolder,
            receiver: this.receiver,
            state: this._state,
            creationTime: this.creationTime
        }, null, 4)
    }

    /**
     * static deserialize
     */
    public static deserialize(shipment: {
        content: string;
        deliverySteps: string;
        reservers: string;
        sender: string;
        _id: string;
        currentHolder: string;
        receiver: string;
        state: string;
        creationTime: string;
    }): Shipment {
        const _content = JSON.parse(shipment.content);
        const _deliverySteps = JSON.parse(shipment.deliverySteps);
        const _reservers = JSON.parse(shipment.reservers);
        const _sender = JSON.parse(shipment.sender);
        const _id = JSON.parse(shipment._id);
        const _currentHolder = JSON.parse(shipment.currentHolder);
        const _receiver = JSON.parse(shipment.receiver);
        const _state = JSON.parse(shipment.state);
        const _creationTime = JSON.parse(shipment.creationTime);

        const sender = new Sender(_sender.id);
        const receiver = new Receiver(_receiver.id);

        const val = new Shipment(
            _content as Package,
            sender as Sender,
            receiver as Receiver
        )

        val._currentHolder = _currentHolder
        val._creationTime = _creationTime
        val._content = _content
        val._id = _id
        val._state = _state
        _reservers.forEach((reserver: Reserver) => val._reservers.push(Object.assign({}, reserver)))
        _deliverySteps.forEach((deliveryStep: IDeliveryStep) => val._deliverySteps.push(Object.assign({}, deliveryStep)))

        return val;
    }

    private _content: Package;
    private _deliverySteps: Array<IDeliveryStep> = new Array<IDeliveryStep>(7);
    private _reservers: Array<Reserver> = new Array<Reserver>(5);
    private _sender: Sender;
    private _id: string;
    private _currentHolder: LoggedInUser;
    private _receiver: Receiver;
    private _state: ShipmentState;
    private _creationTime: Date;

    private _addedDeliverySteps = 0;
    private _addedReservers = 0;
}

declare module "shipment" {
    export { Shipment, PackageType };
}