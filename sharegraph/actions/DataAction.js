/**
 * Created by haconglinh on 22/05/2017.
 */
import {
  FETCH_CHART_DATA_FAILURE,
  FETCH_CHART_DATA_ONE_DAY_SUCCESS,
  FETCH_CHART_DATA_SUCCESS,
  FETCH_PERFORMANCE_DATA_FAILURE,
  FETCH_PERFORMANCE_DATA_SUCCESS,
  FETCH_TICKER_DATA_FAILURE,
  FETCH_TICKER_DATA_SUCCESS,
  UPDATE_DATA
} from "./ActionTypes";


export const updateData = () => ({
  type: UPDATE_DATA
});


export const fetchChartDataSuccess = data => ({
  type: FETCH_CHART_DATA_SUCCESS,
  payload: data
});


export const fetchChartDataFailure = error => ({
  type: FETCH_CHART_DATA_FAILURE,
  payload: error,
});


export const fetchChartDataOneDaySuccess = result => ({
  type: FETCH_CHART_DATA_ONE_DAY_SUCCESS,
  payload: result,
});


export const fetchPerformanceDataSuccess = result => ({
  type: FETCH_PERFORMANCE_DATA_SUCCESS,
  payload: result,
});


export const fetchPerformanceDataFailure = error => ({
  type: FETCH_PERFORMANCE_DATA_FAILURE,
  payload: error,
});


export const fetchTickerDataSuccess = result => ({
  type: FETCH_TICKER_DATA_SUCCESS,
  payload: result,
});


export const fetchTickerDataFailure = error => ({
  type: FETCH_TICKER_DATA_FAILURE,
  payload: error,
});
