import { ShipmentContext } from "../../src/context/shipmentContext";
import { ShipmentContextType, IShipment } from "../../src/@types/shipment";

import { expect } from "chai";
import 'mocha';
import { useContext } from "react";
import { IPackage, PackageContext, PackageContextType, PackageType } from "../../src/Package";
import { AvailabilityContextType } from "../../src/@types/availability";
import { AvailabilityContext } from "../../src/context/availabilityContext";
import { IReceiver } from "../../src/@types/user";

describe('Shipment', () => {
    
    it('should return true', () => {
        const { addDeliveryStep, saveShipmentInfo, shipmentInfo } = useContext(ShipmentContext) as ShipmentContextType;
        const { packageInfo, saveContent } = useContext(PackageContext) as PackageContextType;
        const { setAvailability, availabilityInfo } = useContext(AvailabilityContext) as AvailabilityContextType;

        setAvailability({day: "Monday", from: "12pm", to: "6:pm"});

        saveContent(<IPackage>{description: "Something Eatable", image:"None.jpg", size: {height:100, width:10, length: 5}, type: PackageType.NonPerishable})
        expect(packageInfo.description).to.equal("Something Eatable");

        saveShipmentInfo(<IShipment>{
            content: packageInfo,
            reserversId: ["UNASSIGNED"],
            senderId: "UNASSIGNED",
            receiver: <IReceiver>{}
        })

        expect(shipmentInfo.length).to.equal(1);
        expect(shipmentInfo[0].content).to.be.equal(packageInfo)
    })
    
})