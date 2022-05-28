import { Err, Errors, Ok, OkMessage, Result } from "../interfaces/Errors";

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

enum OrbitDbType {
    LOG,
    FEED,
    KEYVALUE,
    DOCS,
    COUNTER
}

class Db {

    private ipfs:       unknown;
    private orbitdb:    any;
    protected db:       any;

    constructor() {
        this.init();
    }

    private async init() {
        this.ipfs = await IPFS.create()
        this.orbitdb = await OrbitDB.createInstance(this.ipfs);
    }

    protected async createDb(type:OrbitDbType, dbName: string): Promise<Result<OkMessage, Errors>> {
        switch (type) {
            case OrbitDbType.LOG:
                this.db = await this.orbitdb.log(dbName);
                break;
            case OrbitDbType.FEED:
                this.db = await this.orbitdb.feed(dbName); 
                break;
            case OrbitDbType.KEYVALUE:
                this.db = await this.orbitdb.keyvalue(dbName);
                break;
            case OrbitDbType.DOCS:
                this.db = await this.orbitdb.docs(dbName); 
                break;
            case OrbitDbType.COUNTER:
                this.db = await this.orbitdb.counter(dbName); 
                break;
            default:
                return Promise.reject(Err("InvalidDbType"))
        }
        await this.db.load()
        return Promise.resolve(Ok("DbCreated"));
    }
}

export {Db, OrbitDbType};