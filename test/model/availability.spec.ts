import {Availability, DateFormat} from "../../src/Availability";
import { expect } from "chai";
import 'mocha';

describe('isAvailable', () => {
    var av = new Availability(DateFormat.FORMAT_12_HOUR);
    
    it('should return true', () => {
        av.setAvailability("tuesday", "3 am", "11 pm");
        expect(av.isAvailable(new Date(1651601037000))).to.equal(true); // Tuesday, 3. May 2022 18:03:57
    })
    
    it('should return true', () => {
        av.setAvailability("Wednesday", "3 am", "9 pm");
        expect(av.isAvailable(new Date(1651687437000))).to.equal(true); // Wednesday, 4. May 2022 18:03:57
    })
    
    it('should return false', () => {
        av.setAvailability("thursday", "3 am", "2 pm");
        expect(av.isAvailable(new Date(1651773837000))).to.equal(false); // Thursday, 5. May 2022 6:03:57
    })
    
    it('should return true', () => {
        av.setAvailability("tuesday", "5 am", "8:30 pm");
        expect(av.isAvailable(new Date(1651601037000))).to.equal(true); // Dienstag, 3. Mai 2022 8:03 pm
    })

    it('should return true', () => {
        var av1 = new Availability(DateFormat.FORMAT_24_HOUR);
        av1.setAvailability("thursday", "3:00", "20:30");
        expect(av1.isAvailable(new Date(1651773837000))).to.equal(true); // Donnerstag, 5. Mai 2022 20:03:57
    })
    
    it('should return false', () => {
        var av1 = new Availability(DateFormat.FORMAT_24_HOUR);
        av1.setAvailability("thursday", "3:15", "20:30");
        expect(av1.isAvailable(new Date(1651547568000))).to.equal(false); // Tuesday, 3. May 2022 03:12:48
    })
    
    it('should return false', () => {
        var av1 = new Availability(DateFormat.FORMAT_24_HOUR);
        av1.setAvailability("thursday", "3:13", "20:30");
        expect(av1.isAvailable(new Date(1651713168000))).to.equal(false); // Thursday, 5. Mai 2022 03:12:48
    })
    
    it('should pass', () => {
        var av1 = new Availability(DateFormat.FORMAT_24_HOUR);
        av1.setAvailability("thursday", "3:10", "5:30");
        av1.setAvailability("thursday", "9:50", "15:30");
        av1.setAvailability("thursday", "19:50", "22:30");
        expect(av1.isAvailable(new Date(1651713168000))).to.equal(true); // Thursday, 5. Mai 2022 03:12:48
        expect(av1.isAvailable(new Date(1651723968000))).to.equal(false); // Thursday, 5. Mai 2022 06:12:48
        expect(av1.isAvailable(new Date(1651737108000))).to.equal(true); // Thursday, 5. Mai 2022 09:51:48
        expect(av1.isAvailable(new Date(1651773108000))).to.equal(true); // Thursday, 5. Mai 2022 19:51:48
        expect(av1.isAvailable(new Date(1651782828000))).to.equal(false); // Thursday, 5. Mai 2022 22:33:48
    })
});