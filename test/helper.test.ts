import Dispatcher from "../src/user/Dispatcher";
import Receiver from "../src/user/Receiver";
import Reserver from "../src/user/Reserver";
import Sender from "../src/user/Sender";
import { v4 as gen_id } from "uuid";
import { gen } from "./model/reserve.spec";
import Address from "../src/Location";
import { Availability, DateFormat } from "../src/Availability";
import { IDeliveryStep } from "../src/interfaces/IDeliveryStep";
import LoggedInUser from "../src/user/User";
import DeliveryByDispatcherFromReserverToReceiver from "../src/delivery/DeliveryByDispatcherFromReserverToReceiver";
import DeliveryByDispatcherFromReserverToReserver from "../src/delivery/DeliveryByDispatcherFromReserverToReserver";
import DeliveryByDispatcherFromSenderToReceiver from "../src/delivery/DeliveryByDispatcherFromSenderToReceiver";
import DeliveryByDispatcherFromSenderToReserver from "../src/delivery/DeliveryByDispatcherFromSenderToReserver";
import SelfDeliveryBySenderToReserver from "../src/delivery/SelfDeliveryBySenderToReserver";

interface UserIndex {
    sender_index: number,
    receiver_index: number,
    reserver_index: number,
    dispatcher_index: number,
}

interface TestUser {
    sender: Sender,
    receiver: Receiver,
    reserver: Reserver,
    dispatcher: Dispatcher,
}
interface TestDispatchStep {
    source: LoggedInUser,
    receiver: LoggedInUser,
    dispatcher: LoggedInUser,
}

export enum FaultType {
    SenderAsReserver,
    DispatcherAsReserver,
    SenderAsDispatcher,
    DispatcherAsReceiver,
    ReceiverAsReserver,
    ReserverAsSender,
    ReserverAsReceiver
}

export enum DeliveryStepType {
    DeliveryByDispatcherFromReserverToReceiver,
    DeliveryByDispatcherFromReserverToReserver,
    DeliveryByDispatcherFromSenderToReceiver,
    DeliveryByDispatcherFromSenderToReserver,
    SelfDeliveryBySenderToReserver
}

export class TestHelper {
    private senders = new Array<Sender>(10);
    private receivers = new Array<Receiver>(10);
    private reservers = new Array<Reserver>(10);
    private dispatchers = new Array<Dispatcher>(10);
    private static _instance:TestHelper = new TestHelper();
    private current_index: UserIndex;

    constructor() {
        if(TestHelper._instance){
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        TestHelper._instance = this;
        for (let index = 0; index < this.senders.length; index++) {
            this.senders[index] = new Sender(gen_id());
            this.receivers[index] = new Receiver(gen_id());
            this.reservers[index] = new Reserver(gen_id(), {amount: gen(1000), currency: 'ADA'}, new Address(), new Availability(DateFormat.FORMAT_24_HOUR));
            this.dispatchers[index] = new Dispatcher(gen_id());
        }
        this.current_index = {sender_index: 0, receiver_index: 0, reserver_index: 0, dispatcher_index: 0};
    }

    private getSender = (index = 0) => {
        return index == 0 ? this.senders[gen(10)] : this.senders[index]; 
    }
    private getReceiver = (index = 0) => {
        return index == 0 ? this.receivers[gen(10)] : this.receivers[index]; 
    }
    private getReserver = (index = 0) => {
        return index == 0 ? this.reservers[gen(10)] : this.reservers[index]; 
    }
    private getDispatcher = (index = 0) => {
        return index == 0 ? this.dispatchers[gen(10)] : this.dispatchers[index]; 
    }

    public getUser (user_index: UserIndex) : TestUser {
        this.current_index = user_index;
        return {sender: this.getSender(user_index.sender_index)
              , receiver: this.getReceiver(user_index.receiver_index)
              , reserver: this.getReserver(user_index.reserver_index)
              , dispatcher: this.getDispatcher(user_index.dispatcher_index)};
    }

    private testUser2dispatchStep = (user: TestUser) : TestDispatchStep => <TestDispatchStep>{source: user.sender, dispatcher: user.dispatcher, receiver: user.receiver};

    public getDeliveryStep(step: DeliveryStepType, user: TestUser = this.getUser(this.current_index)) : IDeliveryStep {
        const deliveryStep = this.testUser2dispatchStep(user);
        var ret: IDeliveryStep 
        switch (step) {
            case DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver:
                ret = new DeliveryByDispatcherFromReserverToReceiver(deliveryStep.source as Reserver, deliveryStep.receiver as Receiver, deliveryStep.dispatcher as Dispatcher);
                break;
        
            case DeliveryStepType.DeliveryByDispatcherFromReserverToReserver:
                ret = new DeliveryByDispatcherFromReserverToReserver(deliveryStep.source as Reserver, user.receiver as Reserver, deliveryStep.dispatcher as Dispatcher);
                break;
        
            case DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver:
                ret = new DeliveryByDispatcherFromSenderToReceiver(deliveryStep.source as Sender, deliveryStep.receiver as Receiver, deliveryStep.dispatcher as Dispatcher);
                break;
        
            case DeliveryStepType.DeliveryByDispatcherFromSenderToReserver:
                ret = new DeliveryByDispatcherFromSenderToReserver(deliveryStep.source as Sender, deliveryStep.receiver as Reserver, deliveryStep.dispatcher as Dispatcher);
                break;
        
            case DeliveryStepType.SelfDeliveryBySenderToReserver:
                ret = new SelfDeliveryBySenderToReserver(deliveryStep.source as Sender, deliveryStep.receiver as Reserver);
                break;
        
            default:
                ret = new DeliveryByDispatcherFromReserverToReceiver(deliveryStep.source as Reserver, deliveryStep.receiver as Receiver, deliveryStep.dispatcher as Dispatcher);
                break;
        }
        return ret;
    }

    public faultInjection(type: FaultType) : TestUser {
        var user : TestUser = this.getUser(this.current_index);
        switch (type) {
            case FaultType.SenderAsReserver:
                user.sender = new Sender(user.reserver.id)
                break;
            case FaultType.DispatcherAsReserver:
                user.dispatcher = new Dispatcher(user.dispatcher.id)
                break;
            case FaultType.SenderAsDispatcher:
                user.dispatcher = new Dispatcher(user.sender.id)
                break;
            case FaultType.DispatcherAsReceiver:
                user.dispatcher = new Dispatcher(user.receiver.id)
                break;
            case FaultType.ReceiverAsReserver:
                user.receiver = new Receiver(user.reserver.id)
                break;
            case FaultType.ReserverAsReceiver:
                user.reserver = new Reserver(user.receiver.id, {amount: user.reserver.cost.amount, currency: user.reserver.cost.currency}, user.reserver.location, user.reserver.availability);
                break;
            case FaultType.ReserverAsSender:
                user.reserver = new Reserver(user.sender.id, {amount: user.reserver.cost.amount, currency: user.reserver.cost.currency}, user.reserver.location, user.reserver.availability);
                break;
        }
        return user;
    }

    public static getInstance():TestHelper
    {
        return TestHelper._instance;
    }
    
}

export var user = (sender_index: number = 0
                 , receiver_index: number = 0
                 , reserver_index: number = 0
                 , dispatcher_index: number = 0
                 ) => TestHelper.getInstance().getUser({sender_index: sender_index, receiver_index: receiver_index, reserver_index: reserver_index, dispatcher_index: dispatcher_index})

export var user_fault = (fault: FaultType) => TestHelper.getInstance().faultInjection(fault);
export var delivery_step = (step: DeliveryStepType, user?: TestUser) => TestHelper.getInstance().getDeliveryStep(step, user);