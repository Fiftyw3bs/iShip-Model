import RegisteredUser from "../user/User";
import { Errors, OkMessage, Result } from "./Errors";

interface IRequest {
    accept(accepter: RegisteredUser): Result<OkMessage, Errors>;
    reject(rejector: RegisteredUser): Result<OkMessage, Errors>;
}

export default IRequest;