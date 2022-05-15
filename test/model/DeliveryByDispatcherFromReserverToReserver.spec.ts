import { expect } from "chai";
import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DispatchState } from "../../src/interfaces/IDeliveryStep";
import DeliveryByDispatcherFromReserverToReserver from "../../src/delivery/DeliveryByDispatcherFromReserverToReserver";

describe('Package Delivery Step | Delivery By Dispatcher From Reserver to Reserver | pickup()', () => {
    
    it('should return true (Pickup succeeds)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = new DeliveryByDispatcherFromReserverToReserver(user_test.reserver, user(1, 1, 2, 2).reserver, user(1, 1, 2, 2).dispatcher);
        const deliveryStep2 = new DeliveryByDispatcherFromReserverToReserver(user_test.reserver, user(1, 1, 3, 3).reserver, user(1, 1, 3, 3).dispatcher);

        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1, 1, 2, 2).reserver).ok).to.equal(true);

        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.addDeliveryStep(deliveryStep1).val).to.equal("DeliveryStepInitialized");

        shipment.pickup(deliveryStep)
        shipment.deliver(deliveryStep)
        
        const pickedup = shipment.pickup(deliveryStep1);

        expect(pickedup.val).to.equal("PackagePickedUp");
        expect(deliveryStep1.status()).to.equal(DispatchState.IN_TRANSIT);
        expect(shipment.status()).to.equal(ShipmentState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(deliveryStep1.dispatcher.id);
    })
    
    it('should return true (Pickup doesn\'t succeeds, wrong step)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = new DeliveryByDispatcherFromReserverToReserver(user_test.reserver, user(1, 1, 3, 3).reserver, user(1, 1, 3, 3).dispatcher);

        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1, 1, 2, 2).reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1, 1, 3, 3).reserver).ok).to.equal(true);

        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.addDeliveryStep(deliveryStep1).val).to.equal("WrongStepInDeliverySequence");

        shipment.pickup(deliveryStep)
        shipment.deliver(deliveryStep)
        
        const pickedup = shipment.pickup(deliveryStep1);

        expect(pickedup.val).to.equal("DeliveryStepNotFound");
        expect(deliveryStep1.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(deliveryStep.recipient.id);
    })
    
    it('should return true (Pickup doesn\'t succeeds, destination reserver not found)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = new DeliveryByDispatcherFromReserverToReserver(user_test.reserver, user(1, 1, 3, 3).reserver, user(1, 1, 3, 3).dispatcher);

        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1, 1, 2, 2).reserver).ok).to.equal(true);

        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.addDeliveryStep(deliveryStep1).val).to.equal("UserNotFound");

        shipment.pickup(deliveryStep)
        shipment.deliver(deliveryStep)
        
        const pickedup = shipment.pickup(deliveryStep1);

        expect(pickedup.val).to.equal("DeliveryStepNotFound");
        expect(deliveryStep1.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(deliveryStep.recipient.id);
    })
    
    it('should return true (Pickup doesn\'t succeeds, source reserver not found)', () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = new DeliveryByDispatcherFromReserverToReserver(user(1, 1, 3, 3).reserver, user(1, 1, 3, 3).reserver, user(1, 1, 3, 3).dispatcher);

        expect(shipment.addReserver(user_test.reserver).ok).to.equal(true);
        expect(shipment.addReserver(user(1, 1, 2, 3).reserver).ok).to.equal(true);

        expect(shipment.addDeliveryStep(deliveryStep).val).to.equal("DeliveryStepInitialized");
        expect(shipment.addDeliveryStep(deliveryStep1).val).to.equal("ReserverNotFound");
    })
    
});