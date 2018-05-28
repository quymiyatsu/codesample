
import {NETWORK_CHANGE} from "../actions/ActionTypes";

export default (state = true, action) => {
  switch (action.type) {
    case NETWORK_CHANGE:
      ////console.log('=============================NetworkReducer NETWORK_CHANGE============');
      ////console.log('isConnected: ', action.payload);
      return action.payload;
    default:
      return state;
  }
};

