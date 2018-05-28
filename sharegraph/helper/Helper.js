/**
 * Created by haconglinh on 02/03/2017.
 */

import {
  AsyncStorage
} from 'react-native';
import {
  PERIOD_ONE_DAY,
  PERIOD_ONE_YEAR,
  PERIOD_SIX_MONTH,
  PERIOD_THREE_MONTH,
  PERIOD_THREE_YEAR
} from "../../../common/constants";


export const saveDataToAS = (store, key) => {
  const combineData = {
    chartData: store.getState().shareGraphGlobalState.chartState.chartData,
    chartDataOneDay: store.getState().shareGraphGlobalState.chartState.chartDataOneDay,
    tickerData: store.getState().shareGraphGlobalState.tickerState.tickerData,
    performanceData: store.getState().shareGraphGlobalState.performanceState.performanceData,
  };

  //console.log('=============================Save AS Data==============================');
  // //console.log({
  //   chartData: store.getState().chartState.chartData.length,
  //   chartDataOneDay: store.getState().chartState.chartDataOneDay.length,
  //   tickerData: store.getState().tickerState.tickerData.length,
  //   performanceData: store.getState().performanceState.performanceData,
  // });

  const data = JSON.stringify(combineData);
  AsyncStorage.setItem(key.toString(), data);
};

export const deleteDataInAS = () => {
  // //console.log('=============================Save AS Data==============================');
  const instrumentKeys = global.companyData.common.instruments.map(instrument => instrument.instrumentid.toString());
  AsyncStorage.multiRemove(instrumentKeys);
};

export const getDateOfPeriodFromNow = (period) => {
  let periodNumber = 6;
  switch (period) {
    case PERIOD_ONE_DAY:
      periodNumber = 1;
      break;
    case PERIOD_THREE_MONTH:
      periodNumber = 3;
      break;
    case PERIOD_SIX_MONTH:
      periodNumber = 6;
      break;
    case PERIOD_ONE_YEAR:
      periodNumber = 12;
      break;
    case PERIOD_THREE_YEAR:
      periodNumber = 36;
      break;
    default:
      periodNumber = 6;
      break;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);


  // //console.log('Month today', today.getMonth());
  //
  // //console.log('period', period);
  //
  // //console.log('Number of month', today.getMonth() - periodNumber);

  return new Date(today.setMonth(today.getMonth() - periodNumber));
};

export const indexTabByInstrument = (instruments, currentInstrumentId) => {
  let index = 0;
  const result = instruments.find(instrument => (instrument.instrumentid === currentInstrumentId));
  index = instruments.indexOf(result);
  return index;
};

export const indexTabByPeriod = (period) => {
  let index = 0;
  switch (period) {
    case PERIOD_ONE_DAY:
      index = 0;
      break;
    case PERIOD_THREE_MONTH:
      index = 1;
      break;
    case PERIOD_SIX_MONTH:
      index = 2;
      break;
    case PERIOD_ONE_YEAR:
      index = 3;
      break;
    case PERIOD_THREE_YEAR:
      index = 4;
      break;
    default:
      index = 2;
      break;
  }
  return index;
};

export const shouldShowNoDataAvailable = (chartData, currentPeriod) => {
  let result = false;


  const lengthWeHave = chartData.length;

  let resultCheckTime = false;

  switch (currentPeriod) {
    case PERIOD_THREE_MONTH:
      resultCheckTime = false;
      break;
    case PERIOD_SIX_MONTH:
      resultCheckTime = (lengthWeHave < 93);
      break;
    case PERIOD_ONE_YEAR:
      resultCheckTime = (lengthWeHave < 190);
      break;
    case PERIOD_THREE_YEAR:
      resultCheckTime = (lengthWeHave < 500);
      break;
    default:
      resultCheckTime = false;
      break;
  }

  if (lengthWeHave === 0 || resultCheckTime){
    result = true;
  }

  return result;
};

export const shouldUpdateTickerData = (response, store) => {
  let result = false;
  const tickerAtStore = store.getState().shareGraphGlobalState.tickerState.tickerData;
  if (JSON.stringify(response) !== JSON.stringify(tickerAtStore)){
    result = true;
    ////console.log('=============================Ticker interval updated====================================');
  }
  return result;
};

export const shouldUpdatePerData = (response, store) => {
  let result = false;
  const perAtStore = store.getState().shareGraphGlobalState.performanceState.performanceData;
  if (JSON.stringify(response) !== JSON.stringify(perAtStore)){
    result = true;
    ////console.log('=============================performanceData Data updated====================================');
  }
  return result;
};

export const shouldUpdateOneDayChartData = (response, store) => {
  let result = false;
  const chartDataOneDay = store.getState().shareGraphGlobalState.chartState.chartDataOneDay;
  const compareData = (JSON.stringify(response) !== JSON.stringify(chartDataOneDay));

  if (compareData && (response.length > 0)){
    result = true;
    ////console.log('=============================Chart interval updated====================================');
    ////console.log('=============================Current Chart ====================================');
    ////console.log(response.length);
    ////console.log('=============================Next Chart ====================================');
    ////console.log(chartDataOneDay.length);
  }

  return result;
};
