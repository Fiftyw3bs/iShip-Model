import Dispatcher from "./context/dispatcherContext";
import Reserver from "./user/Reserver";

export interface Colony {
    name: string;
    reservers: Array<Reserver>;
    dispatchers: Array<Dispatcher>;
}