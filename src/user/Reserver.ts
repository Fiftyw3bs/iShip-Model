import RegisteredUser from "./User";
import {PackageType} from "../Package"
import Cost from "../interfaces/Cost";
import Address from "../Location";
import { IAvailability } from "../@types/availability";
import { IReserveRequest } from "../@types/reserveRequest";

type Hour = number;

class Reserver extends RegisteredUser {

    constructor(id: string, costPerHour: Cost, location: Address, availability: IAvailability) 
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

    async rejectReserveRequest(request: IReserveRequest) {
        return await request.reject(this);
    }
    
    costPerHour:        Cost = {currency: 'EUR', amount: 100};
    packageType:        PackageType = PackageType.All;
    location:           Address;
    reserveRequests:    Array<IReserveRequest> = new Array<IReserveRequest>();
}

export default Reserver