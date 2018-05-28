/**
 * Created by haconglinh on 11/05/2017.
 */

import {AsyncStorage} from 'react-native';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {ajax} from 'rxjs/observable/dom/ajax';
import {fetchPerDataUrl, getChartOneDayUrl, getTickerDataUrl, updateNewestChartDataUrl} from "./Url";
import {PERIOD_ONE_DAY} from "../../../common/constants";
import {shouldUpdateOneDayChartData, shouldUpdatePerData, shouldUpdateTickerData} from "./Helper";
import {CHANGE_INSTRUMENT_ID} from "../actions/ActionTypes";
import {
  fetchChartDataFailure,
  fetchChartDataOneDaySuccess,
  fetchChartDataSuccess,
  fetchPerformanceDataFailure,
  fetchPerformanceDataSuccess,
  fetchTickerDataFailure,
  fetchTickerDataSuccess
} from "../actions/DataAction";
import {initialPerState} from "../reducers/PerformanceReducer";

/* Stream ====================================================================*/


/* Stream chart data ===========================================================*/
export const streamFetchChartData = (store, chartData) => ajax.getJSON(updateNewestChartDataUrl(store, chartData))
  .timeout(global.defaultSettingsData.common.requestTimeout)
  .retry(global.defaultSettingsData.common.retry)
  // .filter(response => (response.length > 1))
  .do((response) => {
    //console.log('=============================Newest chart data updated===');
    //console.log("DATA RESPONSE", response.length);
    //console.log("data In", chartData);
  })
  .map((response) => {
    response.splice(0, 1);
    let result = response;
    if (chartData.length > 0) {
      result = chartData.concat(response);
    }
    return fetchChartDataSuccess(result);
  })
  // .do(() => saveDataToAS(store))
  .catch(err => Observable.of(fetchChartDataFailure(err)));


/* Stream chart data 1d========================================================*/
export const streamFetchChartDataOneDay = store => ajax.getJSON(getChartOneDayUrl(store))
  .do(() => {
    //console.log('=============================streamFetchChartDataOneDay=============');
    // //console.log(getTickerDataUrl);
    // //console.log(store.getState().netWorkGlobalState);
  })
  .filter(response => shouldUpdateOneDayChartData(response, store))
  .map(response => fetchChartDataOneDaySuccess(response))
  .catch(err => Observable.of(fetchChartDataFailure(err)));


/* Stream chart 1d interval ===================================================*/
export const streamIntervalChartOneDay = (action$, store) => Observable
  .interval(global.defaultSettingsData.sharegraph.timeInterval)
  // .startWith(0)
  .takeWhile(() => (store.getState().nav.routes[store.getState().nav.routes.length - 1].routeName === 'sharegraph'))
  .switchMap(() => ((store.getState().shareGraphGlobalState.currentPeriod === PERIOD_ONE_DAY) ?
      streamFetchChartDataOneDay(store) : Observable.never()
    )
  )
  .takeUntil(action$.ofType(CHANGE_INSTRUMENT_ID));


/* Stream ticker data =========================================================*/
export const streamFetchTickerData = (action$, store) => Observable
  .interval(global.defaultSettingsData.common.tickerTimeInterval)
  .startWith(0)
  .do(() => {
    //console.log('=============================streamFetchTickerData==========');
    // //console.log(getTickerDataUrl);
    // //console.log(store.getState().netWorkGlobalState);
  })
  .takeWhile(() => (store.getState().nav.routes[store.getState().nav.routes.length - 1].routeName === 'sharegraph'))
  .switchMap(() => ajax.getJSON(getTickerDataUrl(store))
    .timeout(global.defaultSettingsData.common.requestTimeout)
    .retry(global.defaultSettingsData.common.retry)
    .filter(response => shouldUpdateTickerData(response, store))
    .do(() => {
      ////console.log('=============================Ticker data updated=======');
    })
    .map(response => fetchTickerDataSuccess(response))
    .catch(err => Observable.of(fetchTickerDataFailure(err)))
  )
  .takeUntil(action$.ofType(CHANGE_INSTRUMENT_ID));


/* Stream per data ============================================================*/
export const streamFetchPerData = store => ajax.getJSON(fetchPerDataUrl(store))
  .timeout(global.defaultSettingsData.common.requestTimeout)
  .retry(global.defaultSettingsData.common.retry)
  .do(() => {
    // //console.log('=============================Per stream url==============');
    // //console.log(store.getState().nav);
  })
  .filter(response => (shouldUpdatePerData(response, store)))
  .map(response => fetchPerformanceDataSuccess(response))
  .catch(err => Observable.of(fetchPerformanceDataFailure(err)));


/* Stream of Null ============================================================*/
export const streamOfNull = () => Observable.of(null);


/* Stream Never subscribe ====================================================*/
export const streamNever = () => Observable.never();


/* Stream Get AS data=========================================================*/
export const streamGetASData = key => Observable
  .fromPromise(AsyncStorage.getItem(key))
  .map(value => (value ? JSON.parse(value) : null));


/* Stream set data ===========================================================*/
export const streamSetDataToStore = data => Observable.merge(
  Observable.of(fetchChartDataSuccess(data ? data.chartData : [])),
  Observable.of(fetchChartDataOneDaySuccess(data ? data.chartDataOneDay : [])),
  Observable.of(fetchPerformanceDataSuccess(data ? data.performanceData : initialPerState)),
  Observable.of(fetchTickerDataSuccess(data ? data.tickerData : []))
);


/* Stream update data ========================================================*/
export const streamUpdateData = (action$, store, chartData) => Observable.merge(
  streamFetchChartData(store, chartData),
  streamFetchChartDataOneDay(store),
  streamIntervalChartOneDay(action$, store),
  streamFetchPerData(store),
  streamFetchTickerData(action$, store),
);
