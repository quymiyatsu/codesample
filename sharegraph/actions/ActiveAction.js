/**
 * Created by haconglinh on 09/03/2017.
 */


import {CHANGE_INSTRUMENT_ID, CHANGE_PERIOD_BY_MEOMEO, NETWORK_CHANGE} from "./ActionTypes";


export const networkChange = isConnected => ({
  type: NETWORK_CHANGE,
  payload: isConnected
});


export const changeInstrumentId = ids => ({
  type: CHANGE_INSTRUMENT_ID,
  payload: ids
});


export const changePeriod = period => ({
  type: CHANGE_PERIOD_BY_MEOMEO,
  payload: period
});
