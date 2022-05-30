import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DeliveryRequestState } from "../../src/context/deliveryRequestContext";
import { Ok } from '../../src/interfaces/Errors';
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect

describe('Delivery Request', () => {
    
    it('should return true (accepted successfully)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver)
        const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

        expect((await deliverRequest.accept(user_test.sender)).val).to.equal("DeliveryRequestAccepted")
        expect(deliverRequest.state).to.equal(DeliveryRequestState.APPROVED)
        expect(shipment.dispatchers.length).to.equal(1);
    })
    
    it('should return true (rejected successfully)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver)
        const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

        expect(deliverRequest.reject(user_test.sender)).to.be.rejectedWith(Ok("DeliveryRequestRejected"))
        expect(deliverRequest.state).to.equal(DeliveryRequestState.REJECTED)
        expect(shipment.dispatchers.length).to.not.equal(1);
    })
    
    it('should return false (invalid rejecting user)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.SenderAsDispatcher))
        const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

        expect((deliverRequest.reject(user(2, 1, 1, 1).sender))).to.be.rejectedWith("InvalidUser")
        expect(deliverRequest.state).to.equal(DeliveryRequestState.AWAITING_APPROVAL)
        expect(shipment.dispatchers.length).to.not.equal(1);
    })
    
    it('should return false (invalid accepting user)', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver, user_fault(FaultType.SenderAsDispatcher))
        const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

        expect((deliverRequest.accept(user(2, 1, 1, 1).sender))).to.be.rejectedWith("InvalidUser")
        expect(deliverRequest.state).to.equal(DeliveryRequestState.AWAITING_APPROVAL)
        expect(shipment.dispatchers.length).to.not.equal(1);
    })
    
});
   