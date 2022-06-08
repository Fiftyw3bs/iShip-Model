import React, { createContext, useState } from "react";
import { useForm } from "react-hook-form";

enum PackageType {
    Perishable = 1,
    NonPerishable,
    All
}

interface PackageSize {
    length: number,
    width: number,
    height: number
}

export interface IPackage {
    description: string;
    type: PackageType;
    image: string;
    size: PackageSize;
}

export const defaultPackageInfo = {
    description: "",
    type: PackageType.All,
    image: "",
    size: {length:0, height: 0, width: 0}
}

export type PackageContextType = {
    packageInfo: IPackage;
    saveContent(data: IPackage): void;
}

export const PackageContext = createContext<PackageContextType | null>(null);

function Package() {

    const { register, handleSubmit } = useForm<IPackage>();
    const [packageInfo, setPackageInfo] = useState<IPackage>(defaultPackageInfo);

    const saveContent = (data: IPackage) => {
        setPackageInfo({
            description: data.description,
            type: data.type,
            image: data.image,
            size: { length: data.size.length, width: data.size.width, height: data.size.height }
        })
    }

    return (
        <PackageContext.Provider value={{packageInfo, saveContent}}>
            <form onSubmit={handleSubmit((data) => saveContent(data))}>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Description</span>
                    <input {...register("description"), { required: true }} type="text" className="form-control" placeholder="description" aria-label="description" aria-describedby="basic-addon1" />
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
        </PackageContext.Provider>
    );
}

export { Package, PackageType };