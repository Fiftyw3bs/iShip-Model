import { v4 } from 'uuid'
import { IDeliveryRequest } from '../@types/deliveryRequest'
import { Action_Redux, initialState, State_Redux } from './actionCreators'
import * as actionTypes from './actionTypes'

const deliveryRequestReducer = (
    state: State_Redux = initialState,
    action: Action_Redux<IDeliveryRequest>
): State_Redux => {
    switch (action.type) {
        case actionTypes.ADD: {
            const newDeliveryRequest: IDeliveryRequest = {
                id: v4(),
                cost: action.object.cost,
                state: action.object.state,
                shipmentId: action.object.shipmentId,
                step: action.object.step,
                creationTime: new Date()
            }
            return {
                ...state,
                deliveryRequests: state.deliveryRequests.concat(newDeliveryRequest),
            }
        }
        case actionTypes.REMOVE: {
            const updatedDeliveryRequests: IDeliveryRequest[] = state.deliveryRequests.filter(
                deliveryRequest => deliveryRequest.id !== action.object.id
            )
            return {
                ...state,
                deliveryRequests: updatedDeliveryRequests,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.deliveryRequests.findIndex((object) => object.id === action.object.id)
            const updated = {
                ...state,
                deliveryRequests: [
                    ...state.deliveryRequests.slice(0, index),
                    action.object,
                    ...state.deliveryRequests.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default deliveryRequestReducer