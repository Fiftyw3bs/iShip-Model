import { v4 } from 'uuid'
import { IShipment } from '../@types/shipment'
import { Action_Redux, initialState, State_Redux } from './actionCreators'
import * as actionTypes from './actionTypes'

const shipmentReducer = (
    state: State_Redux = initialState,
    action: Action_Redux<IShipment>
): State_Redux => {
    switch (action.type) {
        case actionTypes.ADD: {
            const newShipment: IShipment = {
                id: v4(),
                content: action.object.content,
                reservers: action.object.reservers,
                sender: action.object.sender,
                currentHolder: action.object.currentHolder,
                receiver: action.object.receiver,
                state: action.object.state,
                creationTime: new Date()
            }
            return {
                ...state,
                shipments: state.shipments.concat(newShipment),
            }
        }
        case actionTypes.REMOVE: {
            const updatedShipments: IShipment[] = state.shipments.filter(
                shipment => shipment.id !== action.object.id
            )
            return {
                ...state,
                shipments: updatedShipments,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.shipments.findIndex((object) => object.id === action.object.id)
            const updatedShipment = {
                ...action.object, 
                sender: state.shipments[index].sender, 
                receiver: state.shipments[index].receiver,
                creationTime: state.shipments[index].creationTime,
                content: state.shipments[index].content,
            }
            const updated = {
                ...state,
                shipments: [
                    ...state.shipments.slice(0, index),
                    updatedShipment,
                    ...state.shipments.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default shipmentReducer