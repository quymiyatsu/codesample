import {combineReducers} from 'redux';
import instrumentReducer from './InstrumentReducer';
import periodReducer from './PeriodReducer';
import chartReducer from './ChartReducer';
import tickerReducer from './TickerReducer';
import performanceReducer from './PerformanceReducer';

const shareGraphReducer = combineReducers({
  currentInstrumentId: instrumentReducer,
  currentPeriod: periodReducer,
  chartState: chartReducer,
  tickerState: tickerReducer,
  performanceState: performanceReducer,
});

export default shareGraphReducer;
