import {FETCH_TICKER_DATA_FAILURE, FETCH_TICKER_DATA_SUCCESS} from '../actions/ActionTypes';

const initialState = {
  tickerData: [],
  error: 'Fetch Ticker error',
};

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_TICKER_DATA_SUCCESS:
      ////console.log('=============================TickerReducer FETCH_TICKER_DATA_SUCCESS========');
      return { ...state, tickerData: action.payload, error: 'No'};

    case FETCH_TICKER_DATA_FAILURE:
      ////console.log('=============================TickerReducer FETCH_TICKER_DATA_FAILURE========');
      return { ...state, error: action.payload};
    default:
      return state;
  }
};

