import { IDispatcher, IReserver } from "./@types/user";

export interface Colony {
    name: string;
    reservers: Array<IReserver>;
    dispatchers: Array<IDispatcher>;
}