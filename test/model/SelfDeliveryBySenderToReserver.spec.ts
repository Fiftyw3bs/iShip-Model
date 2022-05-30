import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DispatchState } from "../../src/DeliveryStep";
import { Err } from "../../src/interfaces/Errors";
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect

describe('Package Delivery Step | SelfDeliveryBySenderToReserver', () => {
    
    it('should return true (DeliveryStepInitialized)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.SelfDeliveryBySenderToReserver, user_fault(FaultType.ReceiverAsReserver))
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        
        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("DeliveryStepInitialized");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup).to.be.rejectedWith(Err("PackagePickedUp"));
        expect(deliveryStep.status()).to.equal(DispatchState.COMPLETED);
        expect(shipment.status()).to.equal(ShipmentState.IN_TRANSIT);
        expect(shipment.currentHolder.id).to.equal(user_test.reserver.id);
    })
    
    it('should return true (WrongStepInDeliverySequence)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
        expect((await shipment.addReserver(user(1,1,2,1).reserver)).ok).to.equal(true);
        const deliveryStep = delivery_step(DeliveryStepType.SelfDeliveryBySenderToReserver, user_fault(FaultType.ReceiverAsReserver))
                
        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("WrongStepInDeliverySequence");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup).to.be.rejectedWith(Err("DeliveryStepNotFound"));
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return true (ReceiverCantBeDispatcher)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.SelfDeliveryBySenderToReserver)
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
                
        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("ReserverNotFound");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup).to.be.rejectedWith(Err("DeliveryStepNotFound"));
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return false (InvalidSender)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.SelfDeliveryBySenderToReserver, user_fault(FaultType.SenderAsReserver))
        expect((await shipment.addReserver(user_test.reserver)).ok).to.equal(true);
                
        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("InvalidSender");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup).to.be.rejectedWith(Err("UserNotCurrentHolder"));
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
    it('should return false (ReserverNotFound)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.SelfDeliveryBySenderToReserver, user_fault(FaultType.ReceiverAsReserver))
                
        expect((await shipment.addDeliveryStep(deliveryStep)).val).to.equal("ReserverNotFound");
        const pickedup = shipment.pickup(deliveryStep);
        shipment.deliver(deliveryStep)

        expect(pickedup).to.be.rejectedWith(Err("DeliveryStepNotFound"));
        expect(deliveryStep.status()).to.equal(DispatchState.PENDING);
        expect(shipment.status()).to.equal(ShipmentState.AWAITING_PICKUP);
        expect(shipment.currentHolder.id).to.equal(user_test.sender.id);
    })
    
});