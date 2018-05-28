import {createSelector} from 'reselect';
import {filterChartDataByPeriod, formatPerData, formatPerGlobalState, transformTickerData} from "./DataTransformations";

const currentPeriod = state => state.shareGraphGlobalState.currentPeriod;
const currentInstrumentId = state => state.shareGraphGlobalState.currentInstrumentId;
const chartData = state => state.shareGraphGlobalState.chartState.chartData;
const chartDataOneDay = state => state.shareGraphGlobalState.chartState.chartDataOneDay;
const tickerData = state => state.shareGraphGlobalState.tickerState.tickerData;
const performanceData = state => state.shareGraphGlobalState.performanceState.performanceData;
const chartIsLoading = state => state.shareGraphGlobalState.chartState.isLoading;
const appGlobalState = state => state.appGlobalState;
const routes = state => state.nav.routes;

export const tickerSelector = createSelector(
  [tickerData, currentInstrumentId], transformTickerData
);

export const filterChartDataSelector = createSelector(
  [chartData, chartDataOneDay, currentPeriod], filterChartDataByPeriod
);

export const chartIsLoadingSelector = createSelector(
  [chartIsLoading], loading => loading
);

export const performanceDataSelector = createSelector(
  [performanceData, tickerData, currentInstrumentId], formatPerData
);

export const perGlobalDataSelector = createSelector(
  [appGlobalState, currentInstrumentId], formatPerGlobalState
);

export const shouldInitDataSelector = createSelector(
  [chartData], chart => chart.length === 0
);

export const shouldForceRerender = createSelector(
  [routes], route => (route[route.length - 1].routeName === 'sharegraph')
);