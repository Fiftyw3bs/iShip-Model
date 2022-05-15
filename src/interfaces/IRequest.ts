import LoggedInUser from "../user/User";
import { Errors, OkMessage, Result } from "./Errors";

interface IRequest {
    accept(accepter: LoggedInUser): Result<OkMessage, Errors>;
    reject(rejector: LoggedInUser): Result<OkMessage, Errors>;
}

export default IRequest;