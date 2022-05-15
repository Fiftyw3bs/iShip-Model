
const uuid = require('crypto')

export default class Identification {
    constructor() {
        this.id = uuid.v4();
    }

    protected id: String;
}