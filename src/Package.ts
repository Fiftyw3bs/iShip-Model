
enum PackageType {
    Perishable = 1,
    NonPerishable,
    All
}

interface PackageSize {
    length: number,
    width: number,
    height: number
};

class Package {
    constructor(type: PackageType, size?: PackageSize) {
        this._type = type;
        this._size = size!;
    }
    
    public get type() : PackageType {
        return this._type;
    }
    
    public get size() : PackageSize {
        return this._size;
    }

    private _type:   PackageType
    private _image:  Array<String> = new Array<String>();
    private _size:   PackageSize;
}

export {Package, PackageType};