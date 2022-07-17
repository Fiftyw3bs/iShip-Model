import { v4 } from 'uuid'
import { IDeliveryStep } from '../../@types/deliveryStep'
import { Action_Redux, initialDeliveryStepState, State_Redux } from './../actionCreators'
import * as actionTypes from './../actionTypes'

const deliveryStepReducer = (
    state: State_Redux<IDeliveryStep> = initialDeliveryStepState,
    action: Action_Redux<IDeliveryStep>
): State_Redux<IDeliveryStep> => {
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
                objects: state.objects.concat(newDeliveryStep),
            }
        }
        case actionTypes.REMOVE: {
            const updatedDeliverySteps: IDeliveryStep[] = state.objects.filter(
                deliveryStep => deliveryStep.id !== action.object.id
            )
            return {
                ...state,
                objects: updatedDeliverySteps,
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

export default deliveryStepReducer