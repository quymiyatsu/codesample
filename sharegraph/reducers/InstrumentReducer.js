import {CHANGE_INSTRUMENT_ID} from "../actions/ActionTypes";

export default (state = 32940, action) => {
  switch (action.type) {
    case CHANGE_INSTRUMENT_ID:
      ////console.log('=============================InstrumentReducer CHANGE_INSTRUMENT_ID============');
      ////console.log(action.payload);
      return action.payload.newID;

    default:
      return state;
  }
};

