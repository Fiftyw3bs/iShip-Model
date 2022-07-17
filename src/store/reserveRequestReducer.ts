import { v4 } from 'uuid'
import { IReserveRequest } from '../@types/reserveRequest'
import { Action_Redux, initialState, State_Redux } from './actionCreators'
import * as actionTypes from './actionTypes'

const reserveRequestReducer = (
    state: State_Redux = initialState,
    action: Action_Redux<IReserveRequest>
): State_Redux => {
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
                reserveRequests: state.reserveRequests.concat(newReserReserveRequest),
            }
        }
        case actionTypes.REMOVE: {
            const updatedReserveRequests: IReserveRequest[] = state.reserveRequests.filter(
                reserveRequest => reserveRequest.id !== action.object.id
            )
            return {
                ...state,
                reserveRequests: updatedReserveRequests,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.reserveRequests.findIndex((object) => object.id === action.object.id)
            const updatedReserveRequest = {
                ...action.object, 
                sender: state.shipments[index].sender, 
                receiver: state.shipments[index].receiver,
                creationTime: state.shipments[index].creationTime,
                content: state.shipments[index].content,
            }
            const updated = {
                ...state,
                reserveRequests: [
                    ...state.reserveRequests.slice(0, index),
                    action.object,
                    ...state.reserveRequests.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default reserveRequestReducer