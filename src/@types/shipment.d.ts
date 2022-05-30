
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
    content: PackageInfo;
    deliverySteps: Array<IDeliveryStep>;
    reservers: Array<Reserver>;
    sender: Sender;
    id: string;
    currentHolder: LoggedInUser;
    receiver: Receiver;
    state: ShipmentState;
    creationTime: Date;
}

export type ShipmentContextType = {
    shipmentInfo: IShipment;
    saveShipmentInfo(data: IShipment);
    addDeliveryStep(step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    addReserver(reserver: Reserver): Promise<Result<OkMessage, Errors>>;
    removeReserver(reserver: Reserver): Promise<Result<OkMessage, Errors>>;
    pickup(step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
    deliver(step: IDeliveryStep): Promise<Result<OkMessage, Errors>>;
}

export const defaultShipmentInfo: IShipment = {
    content: useContext(PackageContext).packageInfo,
    deliverySteps: [],
    reservers: [],
    sender: new Sender(""),
   id: data.id ? data.id : v4(),
    currentHolder: new LoggedInUser(""),
    receiver: new Receiver(""),
    state: ShipmentState.AWAITING_PICKUP,
    creationTime: new Date(),
}
