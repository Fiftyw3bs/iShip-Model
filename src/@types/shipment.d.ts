
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

export interface IShipment {
    content: IPackage;
    reservers: Array<Reserver>;
    sender: Sender;
    id: string;
    currentHolder: RegisteredUser;
    receiver: Receiver;
    state: ShipmentState;
    creationTime: Date;
}

export type ShipmentContextType = {
    shipmentInfo: IShipment[];
    getShipmentById(id: string): Promise<Result<IShipment, Errors>>;
    getShipmentBySender(sender: Sender): Promise<Result<IShipment, Errors>>;
    saveShipmentInfo(data: IShipment);
    addDeliveryStep(step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    addReserver(shipmentInfo: IShipment, reserver: Reserver): Promise<Result<OkMessage, Errors>>;
    removeReserver(shipmentInfo: IShipment, reserver: Reserver): Promise<Result<OkMessage, Errors>>;
    pickup(shipmentInfo: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    deliver(shipmentInfo: IShipment, step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
}

export const defaultShipmentInfo: IShipment = {
    content: useContext(PackageContext).packageInfo,
    reservers: [],
    sender: new Sender(""),
    id: data.id ? data.id : v4(),
    currentHolder: new RegisteredUser(""),
    receiver: new Receiver(""),
    state: ShipmentState.AWAITING_PICKUP,
    creationTime: new Date(),
}
