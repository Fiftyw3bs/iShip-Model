import ILoggedInUser from "../@types/user";
import { Errors, OkMessage, Result } from "./Errors";

interface IRequest {
    accept(accepter: ILoggedInUser): Result<OkMessage, Errors>;
    reject(rejector: ILoggedInUser): Result<OkMessage, Errors>;
}

export default IRequest;