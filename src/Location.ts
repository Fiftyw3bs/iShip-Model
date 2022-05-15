
class Address {
    address: string
    city: string
    state: string
    
    constructor(address = '', city = '', state = '') {
        this.address = address
        this.city = city
        this.state = state
    }
}

export default Address
