import { v4 } from 'uuid'
import { IDeliveryRequest } from '../../@types/deliveryRequest'
import { Action_Redux, initialtDeliveryRequestState, State_Redux } from '../actionCreators'
import * as actionTypes from '../actionTypes'

const deliveryRequestReducer = (
    state: State_Redux<IDeliveryRequest> = initialtDeliveryRequestState,
    action: Action_Redux<IDeliveryRequest>
): State_Redux<IDeliveryRequest> => {
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
                objects: state.objects.concat(newDeliveryRequest),
            }
        }
        case actionTypes.REMOVE: {
            const updatedDeliveryRequests: IDeliveryRequest[] = state.objects.filter(
                deliveryRequest => deliveryRequest.id !== action.object.id
            )
            return {
                ...state,
                objects: updatedDeliveryRequests,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.objects.findIndex((object) => object.id === action.object.id)
            const updated = {
                ...state,
                objects: [
                    ...state.objects.slice(0, index),
                    action.object,
                    ...state.objects.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default deliveryRequestReducer