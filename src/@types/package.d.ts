
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

export interface PackageInfo {
    description: string;
    type: PackageType;
    image: string;
    size: PackageSize;
}
