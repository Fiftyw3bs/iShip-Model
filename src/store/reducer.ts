import { combineReducers } from "redux"
import deliveryRequestReducer from "./deliveryRequestReducer"
import deliveryStepReducer from "./deliveryStepReducer"
import reserveRequestReducer from "./reserveRequestReducer"
import shipmentReducer from "./shipmentReducer"

const allReducers = combineReducers({
    shipment: shipmentReducer,
    deliveryRequest: deliveryRequestReducer,
    deliveryStep: deliveryStepReducer,
    reserveRequest: reserveRequestReducer
})

export default allReducers