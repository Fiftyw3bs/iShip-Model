import Dispatcher from "./user/Dispatcher";
import Reserver from "./user/Reserver";

export interface Colony {
    name: string;
    reservers: Array<Reserver>;
    dispatchers: Array<Dispatcher>;
}