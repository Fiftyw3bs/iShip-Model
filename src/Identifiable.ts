const uuid = require('crypto')

export default class Identifiable {
    constructor() {
        this.id = uuid.v4();
    }

    protected id: string;
}