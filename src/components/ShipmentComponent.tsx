import * as React from "react";
import { useForm } from "react-hook-form";
import { IShipment, ShipmentContextType } from "../@types/shipment";
import { ShipmentContext } from "../context/shipmentContext";

const CreateShipment = () => {
    const { saveShipmentInfo } = React.useContext(ShipmentContext) as ShipmentContextType;

    const { register, handleSubmit } = useForm<IShipment>();

    const handleShipmentCreation = (data: IShipment) => {
        saveShipmentInfo(data);
    }

    return (
        <form onSubmit={handleSubmit((data) => handleShipmentCreation(data))}>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Source</span>
                <input {...register("description"), { required: true }} type="text" className="form-control" placeholder="description" aria-label="description" aria-describedby="basic-addon1" />
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