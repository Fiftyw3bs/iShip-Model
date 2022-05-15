import { expect } from "chai";
import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DispatchState } from "../../src/interfaces/IDeliveryStep";

describe('Package Delivery Step | DeliveryByDispatcherFromSenderToReceiver', () => {
    
    it('should return true (DeliveryStepInitialized)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver)
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.reservers.length).to.equal(1);
        
        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.reservers.length).to.equal(0);

        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup.val).to.equal("PackagePickedUp");
        expect(deliveryStep.status()).to.equal(DispatchState.COMPLETED);
        expect(shipment.status()).to.equal(ShipmentState.DELIVERED);
        expect(shipment.currentHolder.id).to.equal(user_test.receiver.id);
        expect(shipment.currentHolder.id).to.equal(shipment.receiver.id);
    })
    
    it('should return true (SenderCantBeDispatcher)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1,1,2,1).reserver).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.SenderAsDispatcher))
        
        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("SenderCantBeDispatcher");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup.val).to.equal("DeliveryStepNotFound");
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return true (ReceiverCantBeDispatcher)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.DispatcherAsReceiver))
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
                
        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("ReceiverCantBeDispatcher");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup.val).to.equal("DeliveryStepNotFound");
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return false (InvalidSender)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.SenderAsReserver))
        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
                
        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("InvalidSender");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup.val).to.equal("UserNotCurrentHolder");
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return false (InvalidRecipient)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.ReceiverAsReserver))
                
        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("InvalidRecipient");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup.val).to.equal("DeliveryStepNotFound");
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
});