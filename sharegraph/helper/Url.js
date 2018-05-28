/**
 * Created by haconglinh on 11/05/2017.
 */
import {PERIOD_THREE_YEAR} from "../../../common/constants";
import Helper from "../../../common/helper";
import {getDateOfPeriodFromNow} from "./Helper";

/* URL ============================================= */

export const updateNewestChartDataUrl = (store, chartData) => {
  const timeEndRequest = Helper.formatDate(new Date(), 'yyyymmdd');
  let timeBeginRequest = Helper.formatDate(getDateOfPeriodFromNow(PERIOD_THREE_YEAR), 'yyyymmdd');

  if (chartData.length > 0){
    timeBeginRequest = Helper.formatDate(new Date(chartData[chartData.length - 1].Date), 'yyyymmdd');
  }

  const servicesUrl = `${global.serviceUrl}chartdata/`;
  let requestParams = `${store.getState().shareGraphGlobalState.currentInstrumentId}/${timeBeginRequest}/${timeEndRequest}`;

  if (!store.getState().appGlobalState.generalSettings.currency.isDefault){
    requestParams += `/${store.getState().appGlobalState.generalSettings.currency.value}/`;
  }
  const url = servicesUrl + requestParams;

  //console.log('URL Newest Chart', url);
  return url;
};

export const getChartOneDayUrl = (store) => {
  const servicesUrl = `${global.serviceUrl}chartdata/1d/`;
  let requestParams = `${store.getState().shareGraphGlobalState.currentInstrumentId}`;

  if (!store.getState().appGlobalState.generalSettings.currency.isDefault){
    requestParams += `/${store.getState().appGlobalState.generalSettings.currency.value}/`;
  }

  const url = servicesUrl + requestParams;

  //console.log('URL One day Chart', url);
  return url;
};

export const getTickerDataUrl = (store) => {
  const servicesUrl = `${global.serviceUrl}ticker/${global.companyCode}/`;
  let requestParams = '';

  if (!store.getState().appGlobalState.generalSettings.currency.isDefault){
    requestParams = `${store.getState().appGlobalState.generalSettings.currency.value}/`;
  }

  const url = servicesUrl + requestParams;

  //console.log('URL TICKER', url);
  return url;
};

export const fetchPerDataUrl = (store) => {
  const instrumentId = store.getState().shareGraphGlobalState.currentInstrumentId;
  const language = store.getState().appGlobalState.generalSettings.language.value;
  const servicesUrl = `${global.serviceUrl}performancedata/${global.companyCode}/`;
  let requestParams = `${instrumentId}/${language}`;

  if (!store.getState().appGlobalState.generalSettings.currency.isDefault){
    requestParams += `/${store.getState().appGlobalState.generalSettings.currency.value}/`;
  }

  const url = servicesUrl + requestParams;
  //console.log('URL Per', url);
  return url;
};