import LoggedInUser from "./User";
import {PackageType} from "../Package"
import ReserveRequest from "../ReserveRequest";
import Cost from "../interfaces/Cost";
import { Availability } from "../Availability";
import Address from "../Location";

type Hour = number;

class Reserver extends LoggedInUser {

    constructor(id: string, costPerHour: Cost, location: Address, availability: Availability) 
    {
        super(id)
        this.costPerHour = costPerHour;
        this.location = location;
        this.available = availability;
    }

    public set cost(v : Cost) {
        this.costPerHour = v;
    }
    
    public get cost() : Cost {
        return this.costPerHour
    }

    public totalReservationCost(duration: Hour) : Cost {
        return {
            currency: this.costPerHour.currency,
            amount: this.costPerHour.amount * duration
        }
    }

    async rejectReserveRequest(request: ReserveRequest) {
        return await request.reject(this);
    }
    
    costPerHour:        Cost = {currency: 'EUR', amount: 100};
    packageType:        PackageType = PackageType.All;
    location:           Address;
    reserveRequests:    Array<ReserveRequest> = new Array<ReserveRequest>();
}

export default Reserver