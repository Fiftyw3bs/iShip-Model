import 'mocha';
import { Package, PackageType } from "../../src/Package";
import Shipment, { ShipmentState } from "../../src/Shipment";
import { DeliveryStepType, delivery_step, FaultType, user, user_fault } from "../helper.test";
import { DeliveryRequestState } from "../../src/DeliveryRequest";
import { Ok } from '../../src/interfaces/Errors';
import ShipmentDb from '../../src/db/Shipment.db';
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect

describe('ShipmentDb', () => {
    
    it('create', async () => {
        var user_test = user(1, 1, 1, 1);
        var shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
        const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver)
        const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

        const shipment_db = new ShipmentDb();
        await shipment_db.create(shipment)

        // expect((await deliverRequest.accept(user_test.sender)).val).to.equal("DeliveryRequestAccepted")
        // expect(deliverRequest.state).to.equal(DeliveryRequestState.APPROVED)
        // expect(shipment.addedDeliverySteps).to.equal(1);
    })
})