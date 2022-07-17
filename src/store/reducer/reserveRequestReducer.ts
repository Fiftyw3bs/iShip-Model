import { v4 } from 'uuid'
import { IReserveRequest } from '../@types/reserveRequest'
import { Action_Redux, initialtReserveRequestState, State_Redux } from './actionCreators'
import * as actionTypes from './actionTypes'

const reserveRequestReducer = (
    state: State_Redux<IReserveRequest> = initialtReserveRequestState,
    action: Action_Redux<IReserveRequest>
): State_Redux<IReserveRequest> => {
    switch (action.type) {
        case actionTypes.ADD: {
            const newReserReserveRequest: IReserveRequest = {
                id: v4(),
                requestedAt: action.object.requestedAt,
                reserverId: action.object.reserverId,
                shipmentId: action.object.shipmentId,
                creationTime: new Date()
            }
            return {
                ...state,
                objects: state.objects.concat(newReserReserveRequest),
            }
        }
        case actionTypes.REMOVE: {
            const updatedReserveRequests: IReserveRequest[] = state.objects.filter(
                reserveRequest => reserveRequest.id !== action.object.id
            )
            return {
                ...state,
                objects: updatedReserveRequests,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.objects.findIndex((object) => object.id === action.object.id)
            const updatedReserveRequest: IReserveRequest = {
                ...action.object, 
                requestedAt: action.object.requestedAt
            }
            const updated = {
                ...state,
                objects: [
                    ...state.objects.slice(0, index),
                    updatedReserveRequest,
                    ...state.objects.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default reserveRequestReducer