import { expect } from "chai";
import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DispatchState } from "../../src/interfaces/IDeliveryStep";

describe('Package Delivery Step | Delivery By Dispatcher From Reserver to Receiver | pickup()', () => {
    
    it('should return true (Pickup succeeds)', () => {
        var user_test = user(1, 1, 1, 1);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);

        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);

        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.addDeliveryStep(deliveryStep1).val).to.equal("DeliveryStepInitialized");

        shipment.pickup(deliveryStep)
        shipment.deliver(deliveryStep)
        
        const pickedup = shipment.pickup(deliveryStep1);

        expect(pickedup.val).to.equal("PackagePickedUp");
        expect(deliveryStep1.status()).to.equal(DispatchState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(deliveryStep1.dispatcher.id);
    })
    
    it('should return true (delivery step not yet accepted) | pickup()', () => {
        var user_test = user(1, 1, 1, 1);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        const pickedup = shipment.pickup(deliveryStep);
        expect(pickedup.val).to.equal("DeliveryStepNotFound");
    }) 
});
    
describe('Package Delivery Step | Delivery By Dispatcher From Reserver to Receiver | deliver()', () => {

    it('should return true (delivery succeeds)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var user_test = user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        
        expect(shipment.addDeliveryStep(deliveryStep).ok).to.equal(true);
        expect(shipment.addDeliveryStep(deliveryStep1).ok).to.equal(true);

        shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep);
        
        const pickedup = shipment.pickup(deliveryStep1);
        expect(pickedup.val).to.equal("PackagePickedUp");
        expect(shipment.currentHolder.id).to.equal(deliveryStep1.dispatcher.id);
        
        const delivered = shipment.deliver(deliveryStep1);
        
        expect(delivered.val).to.equal("PackageDelivered");
        expect(shipment.currentHolder.id).to.equal(user_test.receiver.id);
        expect(shipment.currentHolder.id).to.equal(shipment.receiver.id);
        expect(shipment.status()).to.equal(ShipmentState.DELIVERED);
    })
    
    it('should return true (delivery doesn\'t succeed, wrong current holder) | deliver()', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user(1,1,1,2))

        expect(shipment.addDeliveryStep(deliveryStep).ok).to.equal(true);
        expect(shipment.addDeliveryStep(deliveryStep1).ok).to.equal(false);

        expect(shipment.pickup(deliveryStep).ok).to.equal(true);
        expect(shipment.deliver(deliveryStep).ok).to.equal(true);
        
        expect(shipment.pickup(deliveryStep1).ok).to.equal(false);
        const delivered = shipment.deliver(deliveryStep1);
        
        expect(delivered.val).to.equal("UserNotCurrentHolder");
        expect(shipment.currentHolder.id).to.equal(deliveryStep.recipient.id);
    })
    
    it('should return true (delivery step not yet picked up) | deliver()', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var user_test = user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addDeliveryStep(deliveryStep).ok).to.equal(true);
        expect(shipment.addDeliveryStep(deliveryStep1).ok).to.equal(true);

        
        shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep);

        const delivered = shipment.deliver(deliveryStep1);
        expect(delivered.val).to.equal("UserNotCurrentHolder");
    })
    
});