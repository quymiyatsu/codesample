import { SET_TAB_INDEX, SHOW_INDICATOR, HIDE_INDICATOR } from '../../../../common/constants';

const initialState = {
  index: 1,
  isLoadDone: false
};
const tabCompareReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_INDICATOR:
      return {
        ...state,
        isLoadDone: false
      };
    
    case HIDE_INDICATOR:
      return {
        ...state,
        isLoadDone: true
      }; 
    
    case SET_TAB_INDEX:
      return {
        ...state,
        index: action.index
      };
    
    default:
      return state;
  }
};
export default tabCompareReducer;
