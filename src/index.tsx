import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import allReducers from "./store/reducer";

// const store: Store<State_Redux, Action_Redux<IShipment>> & {
//   dispatch: ShipmentDispatchType
// } = createStore(shipmentReducer, applyMiddleware(thunk))

const store = configureStore({reducer: allReducers}); createStore(allReducers, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
      {/* <App /> */}
    </Provider>,
    document.getElementById("root")
);