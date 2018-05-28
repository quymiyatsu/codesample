/**
 * Created by haconglinh on 18/04/2017.
 */

import 'rxjs';
import {CHANGE_INSTRUMENT_ID, NETWORK_CHANGE, UPDATE_DATA} from "../actions/ActionTypes";
import {streamGetASData, streamOfNull, streamSetDataToStore, streamUpdateData} from "../helper/Observable";
import {CHANGE_CURRENCY} from "../../../common/constants";
import {deleteDataInAS, saveDataToAS} from "../helper/Helper";


export const changeInstrumentEpic = (action$, store) =>
  action$.ofType(CHANGE_INSTRUMENT_ID)
    .do((action) => {
      if (action.payload.oldID) saveDataToAS(store, action.payload.oldID);
    })
    .mergeMap(() => streamGetASData(store.getState().shareGraphGlobalState.currentInstrumentId.toString())
      .catch(() => streamOfNull())
      .do((data) => {
        //console.log("DATA FROM AS", data);
      })
      .mergeMap(dataAS => (store.getState().netWorkGlobalState ?
          streamUpdateData(action$, store, (dataAS ? dataAS.chartData : [])) : streamSetDataToStore(dataAS)
        )
      )
    );


export const changeCurrencyEpic = (action$, store) =>
  action$.ofType(CHANGE_CURRENCY)
    .filter(() => (store.getState().netWorkGlobalState))
    .do(() => deleteDataInAS())
    .mergeMap(() => streamUpdateData(action$, store, []));


export const updateDataEpic = (action$, store) =>
  action$.ofType(UPDATE_DATA)
    .filter(() => (store.getState().netWorkGlobalState))
    .mergeMap(() => streamUpdateData(action$, store, store.getState().shareGraphGlobalState.chartState.chartData));


export const networkEpic = (action$, store) =>
  action$.ofType(NETWORK_CHANGE)
    .do(() => {
      //console.log("Update data when change network before Skip", store.getState().netWorkGlobalState);
    })
    .skip(1)
    .do(() => {
      //console.log("Update data when change network before filter", store.getState().netWorkGlobalState);
    })
    .filter(() => (store.getState().netWorkGlobalState))
    .do(() => {
      //console.log("Update data when change network aff filter", store.getState().netWorkGlobalState);
    })
    .mergeMap(() => streamUpdateData(action$, store, store.getState().shareGraphGlobalState.chartState.chartData));
