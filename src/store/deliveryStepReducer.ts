import { v4 } from 'uuid'
import { IDeliveryStep } from '../@types/deliveryStep'
import { Action_Redux, initialState, State_Redux } from './actionCreators'
import * as actionTypes from './actionTypes'

const deliveryStepReducer = (
    state: State_Redux = initialState,
    action: Action_Redux<IDeliveryStep>
): State_Redux => {
    switch (action.type) {
        case actionTypes.ADD: {
            const newDeliveryStep: IDeliveryStep = {
                id: v4(),
                completionTime: action.object.completionTime,
                creationTime: new Date(),
                dispatchState: action.object.dispatchState,
                dispatcher: action.object.dispatcher,
                recipient: action.object.recipient,
                shipmentId: action.object.shipmentId,
                source: action.object.source
            }
            
            return {
                ...state,
                deliverySteps: state.deliverySteps.concat(newDeliveryStep),
            }
        }
        case actionTypes.REMOVE: {
            const updatedDeliverySteps: IDeliveryStep[] = state.deliverySteps.filter(
                deliveryStep => deliveryStep.id !== action.object.id
            )
            return {
                ...state,
                deliverySteps: updatedDeliverySteps,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.deliverySteps.findIndex((object) => object.id === action.object.id)
            const updated = {
                ...state,
                deliverySteps: [
                    ...state.deliverySteps.slice(0, index),
                    action.object,
                    ...state.deliverySteps.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default deliveryStepReducer