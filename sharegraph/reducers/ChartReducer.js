import {
  CHANGE_INSTRUMENT_ID,
  FETCH_CHART_DATA_FAILURE,
  FETCH_CHART_DATA_ONE_DAY_SUCCESS,
  FETCH_CHART_DATA_SUCCESS, NETWORK_CHANGE
} from '../actions/ActionTypes';

const initialState = {
  chartData: [],
  chartDataOneDay: [],
  error: 'Fetch Chart Error',
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CHANGE_INSTRUMENT_ID:
      ////console.log('====================ChartReducer CHANGE_INSTRUMENT_ID set Loading true ===============');
      return {
        ...state,
        isLoading: true
      };

    case FETCH_CHART_DATA_SUCCESS:
      // //console.log('=============================ChartReducer FETCH_CHART_DATA_SUCCESS==================');
      return {
        ...state,
        chartData: action.payload,
        isLoading: false
      };


    case FETCH_CHART_DATA_ONE_DAY_SUCCESS:
      ////console.log('=============================ChartReducer FETCH_CHART_DATA_ONE_DAY_SUCCESS==================');
      ////console.log(action.payload.length);
      return {
        ...state,
        chartDataOneDay: action.payload,
        // isLoading: state.isLoading ? false : state.isLoading,
        error: 'No',
      };

    case NETWORK_CHANGE:
      ////console.log('====================ChartReducer NETWORK_CHANGE set Loading true ===============');
      return {
        ...state,
        isLoading: ((action.payload && !state.isLoading) ? true : false)
      };

    case FETCH_CHART_DATA_FAILURE:
      ////console.log('=============================ChartReducer FETCH_CHART_DATA_FAILURE==========');
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

