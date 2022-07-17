import * as React from "react";
import { useForm } from "react-hook-form";
import { IShipment, ShipmentState } from "../@types/shipment";
import { OrbitProvider, useOrbitDb } from "react-orbitdb";
import { PackageContext, PackageContextType } from "../Package";
import { LoggedInUserContextType } from "../@types/user";
import { LoggedInUserContext } from "../context/loggedInUserContext";
import { v4 } from "uuid";

const CreateShipment = () => {
    const { loggedInUserInfo } = React.useContext(LoggedInUserContext) as LoggedInUserContextType;
    const { packageInfo } = React.useContext(PackageContext) as PackageContextType;

    const { register, handleSubmit } = useForm<IShipment>();

    const { db, records } = useOrbitDb('shipshift-shipment', {
        type: "docstore",
        create: true,
        public: true,
    });

    const handleShipmentCreation = async (data: IShipment) => {
        await db.put(data);
    }

    return (
        <form onSubmit={handleSubmit((data) => {
            data.content = packageInfo;
            data.sender = loggedInUserInfo.id;
            data.id = v4();
            data.currentHolder = loggedInUserInfo.id;
            data.state = ShipmentState.AWAITING_PICKUP;
            data.creationTime = new Date();
            handleShipmentCreation(data)
        })}>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Source</span>
                <input {...register("receiver"), { required: true }} type="text" className="form-control" placeholder="description" aria-label="description" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Destination</span>
                <input {...register("receiver.location"), { required: true }} type="text" className="form-control" placeholder="description" aria-label="description" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Type</label>
                <select {...register("type"), { required: true }} className="form-select" id="inputGroupSelect01">
                    <option selected>Choose...</option>
                    <option value="1">Perishable</option>
                    <option value="2">Non-Perishable</option>
                    <option value="3">All</option>
                </select>
            </div>

            <div className="input-group">
                <span className="input-group-text">Size (Length, Width, Breadth)</span>
                <input type="text" aria-label="Length" className="form-control" {...register("size.length")} />
                <input type="text" aria-label="Width" className="form-control" {...register("size.width")} />
                <input type="text" aria-label="Breadth" className="form-control" {...register("size.height")} />
            </div>

            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupFile01">Image</label>
                <input {...register("image"), { required: true }} type="file" className="form-control" id="inputGroupFile01" />
            </div>

            <input className="btn btn-primary" type="submit" value="Save Package" />
        </form>
    );
}

export default CreateShipment;