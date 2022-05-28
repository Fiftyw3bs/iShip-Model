
enum PackageType {
    Perishable = "Perishable",
    NonPerishable = "NonPerishable",
    All = "All"
}

interface PackageSize {
    length: number,
    width: number,
    height: number
}

export class Package {
    constructor(type: PackageType, size: PackageSize = { length: 0, height: 0, width: 0 }) {
        this._type = type;
        this._size = size;
    }

    public get type(): PackageType {
        return this._type;
    }

    public get size(): PackageSize {
        return this._size;
    }

    public set image(path: string) {
        this._images.push(path);
    }

    public get images(): Array<string> {
        return this._images;
    }

    /**
     * toJSON
     */
    public toJSON() {
        return {
            type: JSON.stringify(this._type),
            images: JSON.stringify(this._images),
            size: JSON.stringify(this._size)
        }
    }
    
    private _type: PackageType
    private _images: Array<string> = new Array<string>();
    private _size: PackageSize;
}


declare module "Package" {
    export { Package, PackageType };
}