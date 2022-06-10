import { Id } from "./@types/user";

export interface Colony {
    name: string;
    reservers: Array<Id>;
    dispatchers: Array<Id>;
}