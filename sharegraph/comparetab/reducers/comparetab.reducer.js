// import {  } from '../../../common/constants';
import { combineReducers } from 'redux';
// import chartReducer from './chart.reducer';
// import compareReducer from './compare.reducer';
// import performanceReducer from './performance.reducer';
import tabCompareReducer from './tabcompare.reducer';

const compareTabReducers = combineReducers({
    // chart: chartReducer,
    // compare: compareReducer,
    // performance: performanceReducer,
    tab: tabCompareReducer
});
export default compareTabReducers;
