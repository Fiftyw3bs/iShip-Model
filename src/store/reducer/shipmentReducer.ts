import { v4 } from 'uuid'
import { IShipment, ShipmentState } from '../../@types/shipment'
import { Action_Redux, initialtShipmentState, State_Redux } from './../actionCreators'
import * as actionTypes from './../actionTypes'

const shipmentReducer = (
    state: State_Redux<IShipment> = initialtShipmentState,
    action: Action_Redux<IShipment>
): State_Redux<IShipment> => {
    switch (action.type) {
        case actionTypes.ADD: {
            const newShipment: IShipment = {
                id: v4(),
                content: action.object.content,
                reservers: action.object.reservers,
                sender: action.object.sender,
                currentHolder: action.object.currentHolder,
                receiver: action.object.receiver,
                state: ShipmentState.AWAITING_PICKUP,
                creationTime: new Date()
            }
            return {
                ...state,
                objects: state.objects.concat(newShipment),
            }
        }
        case actionTypes.REMOVE: {
            const updatedShipments: IShipment[] = state.objects.filter(
                shipment => shipment.id !== action.object.id
            )
            return {
                ...state,
                objects: updatedShipments,
            }
        }
        case actionTypes.UPDATE: {
            const index = state.objects.findIndex((object) => object.id === action.object.id)
            const updatedShipment: IShipment = {
                ...action.object, 
                state: action.object.state
            }
            const updated = {
                ...state,
                objects: [
                    ...state.objects.slice(0, index),
                    updatedShipment,
                    ...state.objects.slice(index + 1)
                ]
            }
            return updated;
        }
    }
    return state
}

export default shipmentReducer