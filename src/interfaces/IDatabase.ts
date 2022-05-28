import { Errors, OkMessage, Result } from "./Errors";

export default interface IDatabase<T> {
    create(data: T) : Promise<Result<OkMessage, Errors>>
    query(id: string) : Promise<Result<T, Errors>>
    delete(id: string) : Promise<Result<OkMessage, Errors>>
    getMany(limit: number) : Promise<Result<Array<T>, Errors>>
}