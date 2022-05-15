
class Address {
    address: string
    city: string
    state: string
    
    constructor(address: string = '', city: string = '', state: string = '') {
        this.address = address
        this.city = city
        this.state = state
    }
}

export default Address
