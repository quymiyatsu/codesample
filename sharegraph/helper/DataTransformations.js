import {getDateOfPeriodFromNow, shouldShowNoDataAvailable} from "./Helper";
import {PERIOD_ONE_DAY} from "../../../common/constants";
import Helper from "../../../common/helper";

export const filterChartDataByPeriod = (chartData, chartDataOneDay, currentPeriod) => {
  // //console.log('=============================filterChartDataByPeriod===========================');
  // //console.log('==================filterChartDataByPeriod======', chartData[0]);
  let result;

  if (currentPeriod === PERIOD_ONE_DAY){
    result = chartDataOneDay;
  } else {
    const timeWeNeed = getDateOfPeriodFromNow(currentPeriod);
    if (!shouldShowNoDataAvailable(chartData, currentPeriod)) {
      result = chartData.filter(chart => ((new Date(chart.Date).getTime()) >= timeWeNeed.getTime()))
    } else {
      result = [];
    }
  }
  return result;
};


export const transformTickerData = (tickerData, currentInstrumentId) => {
  let result = {};
  if (tickerData.length > 0) {
    const tickerOut = tickerData.find(ticker => ticker.InstrumentId === currentInstrumentId);
    result = {
      instrumentId: tickerOut.InstrumentId,
      lastValue: tickerOut.Last,
      highValue: tickerOut.High,
      lowValue: tickerOut.Low,
      changeValue: (tickerOut.Last - tickerOut.PrevClose),
      changeValuePercent: (((tickerOut.Last - tickerOut.PrevClose) * 100) / tickerOut.PrevClose),
      volumeValue: tickerOut.Volume,
    };
  }
  return result;
};

const makerByInstrumentId = (state, currentInstrumentId) => {
  const instruments = state.companyData.common.instruments;
  const markets = state.companyData.common.markets;

  const instrument = instruments.find(ins => ins.instrumentid === currentInstrumentId);
  const result = markets.find(market => market.id === instrument.marketid);
  return result.name["en-gb"];
};

const currencyByInstrumentId = (state, currentInstrumentId) => {
  let output = "DKK";

  if (state.generalSettings.currency.isDefault) {
    const instruments = state.companyData.common.instruments;
    const instrument = instruments.find(ins => ins.instrumentid === currentInstrumentId);
    output = instrument.currencycode;
  } else {
    output = state.generalSettings.currency.value;
  }

  return output;
};

const currencyText = (state) => {
  let output = Helper.getPhrase("Currency", "ShareGraph");

  if (state.generalSettings.currency.isDefault) {
    output = Helper.getPhrase("Currency", "ShareGraph");
  } else {
    const textCurrentcy = Helper.getPhrase("Currency", "ShareGraph");
    const textCustom = Helper.getPhrase("CustomCurrencyLabel", "ShareGraph");
    output = `${textCurrentcy} (${textCustom})`;
  }
  return output;
};

export const formatPerGlobalState = (state, currentInstrumentId) => ({
  shareDataNote: Helper.getPhrase("ShareDataNote", "ShareGraph"),
  shareDataTitleText: Helper.getPhrase("ShareData", "ShareGraph"),
  // settingsButtonText: state.langData.Common.Settings,
  currencyText: currencyText(state),
  currencyValue: currencyByInstrumentId(state, currentInstrumentId),
  tPrevCloseText: Helper.getPhrase("PreviousClose", "ShareGraph"),
  t52wHighText: Helper.getPhrase("WeeksHigh52", "ShareGraph"),
  t52wLowText: Helper.getPhrase("WeeksLow52", "ShareGraph"),
  t52wChangeText: Helper.getPhrase("WeeksPercent52", "ShareGraph"),
  tYTDText: Helper.getPhrase("YTDPercent", "ShareGraph"),
  marketDataTitleText: Helper.getPhrase("MarketData", "ShareGraph"),
  marketText: Helper.getPhrase("Market", "ShareGraph"),
  marketValue: makerByInstrumentId(state, currentInstrumentId),
  SymbolText: Helper.getPhrase("Symbol", "ShareGraph"),
  ListText: Helper.getPhrase("List", "ShareGraph"),
  IndustryText: Helper.getPhrase("Industry", "ShareGraph"),
  NumberOfSharesText: Helper.getPhrase("NoOfSharesMil", "ShareGraph"),
  MarketCapText: Helper.getPhrase("MarketCapMil", "ShareGraph")
});

export const formatPerData = (per, tickers, currentInstrumentId) => {
  let tickerTLast = 0;
  if (tickers.length > 0) {
    tickerTLast = tickers.find(ticker => ticker.InstrumentId === currentInstrumentId).Last;
  }
  const marketCap = ((per.NumberOfShares + per.NumberOfUnlistedShares) * tickerTLast) / 1000000;

  return {
    tLast: per.tLast,
    tPrevClose: per.tPrevClose,
    t3mHigh: per.t3mHigh,
    t3mLow: per.t3mLow,
    t52wHigh: per.t52wHigh,
    t52wLow: per.t52wLow,
    t52wChange: per.t52wChange,
    tYTD: per.tYTD,
    Symbol: per.Symbol,
    List: per.List,
    Industry: per.Industry,
    NumberOfShares: per.NumberOfShares / 1000000,
    MarketCap: marketCap
  };
};

