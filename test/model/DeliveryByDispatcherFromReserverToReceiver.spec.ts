import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DispatchState } from "../../src/interfaces/IDeliveryStep";
import { Err, Ok } from '../../src/interfaces/Errors';
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect

describe('Package Delivery Step | Delivery By Dispatcher From Reserver to Receiver | pickup()', () => {
    
    it('should return true (Pickup succeeds)', async () => {
        var user_test = user(1, 1, 1, 1);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);

        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);

        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("DeliveryStepInitialized");
        expect((await shipment.addDeliveryStep(deliveryStep1)).val).to.equal("DeliveryStepInitialized");

        shipment.pickup(deliveryStep)
        shipment.deliver(deliveryStep)
        
        const pickedup = await shipment.pickup(deliveryStep1);

        expect(pickedup.val).to.equal(Ok("PackagePickedUp"));
        expect(deliveryStep1.status()).to.equal(DispatchState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(deliveryStep1.dispatcher.id);
    })
    
    it('should return true (delivery step not yet accepted) | pickup()', async () => {
        var user_test = user(1, 1, 1, 1);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        const pickedup = shipment.pickup(deliveryStep);
        expect(pickedup).to.be.rejectedWith(Err("DeliveryStepNotFound"));
    }) 
});
    
describe('Package Delivery Step | Delivery By Dispatcher From Reserver to Receiver | deliver()', () => {

    it('should return true (delivery succeeds)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var user_test = user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        
        expect((await shipment.addDeliveryStep(deliveryStep)).ok).to.equal(true);
        expect((await shipment.addDeliveryStep(deliveryStep1)).ok).to.equal(true);

        shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep);
        
        const pickedup = shipment.pickup(deliveryStep1);
        expect(pickedup).to.be.rejectedWith(Ok("PackagePickedUp"));
        expect(shipment.currentHolder.id).to.equal(deliveryStep1.dispatcher.id);
        
        const delivered = await shipment.deliver(deliveryStep1);
        
        expect(delivered.val).to.equal("PackageDelivered");
        expect(shipment.currentHolder.id).to.equal(user_test.receiver.id);
        expect(shipment.currentHolder.id).to.equal(shipment.receiver.id);
        expect(shipment.status()).to.equal(ShipmentState.DELIVERED);
    })
    
    it('should return true (delivery doesn\'t succeed, wrong current holder) | deliver()', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user(1,1,1,2))

        expect((await shipment.addDeliveryStep(deliveryStep)).ok).to.equal(true);
        expect((await shipment.addDeliveryStep(deliveryStep1)).ok).to.equal(false);

        expect((await shipment.pickup(deliveryStep)).ok).to.equal(true);
        expect((await shipment.deliver(deliveryStep)).ok).to.equal(true);
        
        // expect((await shipment.pickup(deliveryStep1)).ok).to.equal(false);
        const delivered = shipment.deliver(deliveryStep1);
        
        expect(delivered).to.be.rejectedWith(Err("UserNotCurrentHolder"));
        expect(shipment.currentHolder.id).to.equal(deliveryStep.recipient.id);
    })
    
    it('should return true (delivery step not yet picked up) | deliver()', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        var user_test = user(1, 1, 1, 2);
        const deliveryStep1 = delivery_step(DeliveryStepType.DeliveryByDispatcherFromReserverToReceiver, user_fault(FaultType.SenderAsReserver))
        
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        expect((await shipment.addDeliveryStep(deliveryStep)).ok).to.equal(true);
        expect((await shipment.addDeliveryStep(deliveryStep1)).ok).to.equal(true);

        
        shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep);

        const delivered = shipment.deliver(deliveryStep1);
        expect(delivered).to.be.rejectedWith(Err("UserNotCurrentHolder"));
    })
    
});