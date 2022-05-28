import { Db, OrbitDbType } from "./Db";
import Shipment from "../Shipment";
import IDatabase from "../interfaces/IDatabase";
import { Result } from "ts-results";
import { OkMessage, Errors } from "../interfaces/Errors";

export default class ShipmentDb extends Db implements IDatabase<Shipment> {
    constructor() {
        super();
        this.createDb(OrbitDbType.DOCS, "shipment");
        this.db.events.on("replicated", () => {
            this.db.iterator({ limit: -1 })
                .map((e: { payload: { value: { content: string; deliverySteps: string; reservers: string; sender: string; _id: string; currentHolder: string; receiver: string; state: string; creationTime: string; }; }; }) => Shipment.deserialize(e.payload.value))
                .forEach((val: Shipment) => this.shipments.push(Object.assign({}, val)))
        });
    }
    async function init() {
        name
    }

    async create(data: Shipment): Promise<Result<OkMessage, Errors>> {
        const v = await this.db.put(data)
        console.log("something: ", v);
        return v
    }
    async query(id: string): Promise<Result<Shipment, Errors>> {
        return await this.db.get(id)
    }
    async delete(id: string): Promise<Result<OkMessage, Errors>> {
        throw new Error("Method not implemented.");
    }
    async getMany(limit: number): Promise<Result<Shipment[], Errors>> {
        throw new Error("Method not implemented.");
    }

    shipments: Shipment[] = [];
}