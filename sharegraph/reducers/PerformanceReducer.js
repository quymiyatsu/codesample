import {FETCH_PERFORMANCE_DATA_FAILURE, FETCH_PERFORMANCE_DATA_SUCCESS} from '../actions/ActionTypes';

export const initialPerState = {
  performanceData: {
    tLast: 0.00,
    tPrevClose: 0.00,
    t3mHigh: 0.00,
    t3mLow: 0.00,
    t52wHigh: 0.00,
    t52wLow: 0.00,
    t52wChange: 0.00,
    tYTD: 0.00,
    Symbol: "",
    List: "",
    Industry: "",
    NumberOfShares: 0.00,
    NumberOfUnlistedShares: 0.00
  },
  error: 'Fetch Performance Error',
  // isLoading: false
};

export default (state = initialPerState, action) => {
  switch (action.type) {

    case FETCH_PERFORMANCE_DATA_SUCCESS:
      ////console.log('=============================PerReducer FETCH_PERFORMANCE_DATA_SUCCESS==============');
      return { ...state, performanceData: action.payload, error: 'No'}

    case FETCH_PERFORMANCE_DATA_FAILURE:
      ////console.log('=============================PerReducer FETCH_PERFORMANCE_DATA_FAILURE======');
      return {
        ...state,
        error: action.payload,
        // isLoading: false
      };
    default:
      return state;
  }
};
