/**
 * Created by haconglinh on 09/03/2017.
 */

import {CHANGE_PERIOD_BY_MEOMEO} from '../actions/ActionTypes';
import {PERIOD_SIX_MONTH} from "../../../common/constants";

export default (state = PERIOD_SIX_MONTH, action) => {
  switch (action.type) {
    case CHANGE_PERIOD_BY_MEOMEO:
      ////console.log('=============================PeriodReducer CHANGE_PERIOD_BY_MEOMEO============');
      return action.payload;
    default:
      return state;
  }
};

