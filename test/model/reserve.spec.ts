import { Availability, DateFormat } from "../../src/context/availabilityContext";
// import { expect } from "chai";
import 'mocha';
import Reserver from "../../src/user/Reserver";
import Sender from "../../src/user/Sender";
import { Package, PackageType } from "../../src/Package";
import ReserveRequest from "../../src/context/reserveRequestContext";
import Address from "../../src/Location";
import Receiver from "../../src/user/Receiver";
import Shipment from "../../src/Shipment";
import { Err } from "../../src/interfaces/Errors";
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect

export const gen = (max: number): number => {
    return Math.floor(Math.random() * (max + 1))
}

describe('Test package reservation', () => {
    const max: number = 10;
    var reservers = new Array<Reserver>();


    for (var x = 1; x < max; x++) {
        var av = new Availability(DateFormat.FORMAT_24_HOUR);
        av.setAvailability("monday", "12:13", "15:30");
        var reserver = new Reserver(
            x.toString(),
            { currency: 'EUR', amount: gen(max) },
            new Address(),
            av
        )
        reservers.push(reserver);
    }

    it('should be able to reject reserve request [reserver is selected by sender]', async () => {
        var sender = new Sender((6).toString());
        const content = new Package(PackageType.NonPerishable);
        const receiver = new Receiver();
        var shipment = Shipment.create(content, sender, receiver);
        shipment.addReserver(reservers[0]);
        shipment.addReserver(reservers[1]);
        shipment.addReserver(reservers[2]);
        var reserver = reservers[1];
        var reserveRequest = new ReserveRequest(shipment, reserver);
        const ret = await reserveRequest.reject(reserver);
        expect(ret.val).to.equal("ReserveRequestRejected");
        expect(shipment.reservers.length).to.equal(2);
    })

    it('should not be able to reject reserve request [reserver is not selected by sender]', async () => {
        var sender = new Sender((6).toString());
        const content = new Package(PackageType.NonPerishable);
        const receiver = new Receiver();
        var shipment = Shipment.create(content, sender, receiver);
        shipment.addReserver(reservers[0]);
        shipment.addReserver(reservers[1]);
        var reserver = reservers[2];
        var reserveRequest = new ReserveRequest(shipment, reserver);
        expect(reserveRequest.reject(reserver)).to.be.rejectedWith(Err("ReserverNotFound"))
    })

    it('should not be able to add reserver [invalid reservable package type]', async () => {
        var sender = new Sender((6).toString());
        const content = new Package(PackageType.Perishable);
        const receiver = new Receiver();
        reservers[2].packageType = PackageType.NonPerishable;
        var shipment = Shipment.create(content, sender, receiver);
        expect(shipment.addReserver(reservers[2])).to.be.rejectedWith(Err("InvalidReservablePackage"))
    })

    it('should be able to add reserver [all package type reservable]', async () => {
        var sender = new Sender((6).toString());
        const content = new Package(PackageType.Perishable);
        const receiver = new Receiver();
        reservers[2].packageType = PackageType.All;
        var shipment = Shipment.create(content, sender, receiver);
        expect(shipment.addReserver(reservers[2])).to.be.rejectedWith(Err("ReserverAdded"))
    })

    it('should not be able to add reserver [reserver already added]', async () => {
        var sender = new Sender((6).toString());
        const content = new Package(PackageType.Perishable);
        const receiver = new Receiver();
        reservers[2].packageType = PackageType.All;
        var shipment = Shipment.create(content, sender, receiver);
        shipment.addReserver(reservers[2]);
        expect(shipment.addReserver(reservers[2])).to.be.rejectedWith(Err("ReserverAlreadySelected"));
    })

});