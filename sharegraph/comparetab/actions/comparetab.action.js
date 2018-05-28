import { 
    SET_TAB_INDEX, SHOW_INDICATOR, HIDE_INDICATOR
} from '../../../../common/constants';


export const showIndicator = () => {
    return {
        type: SHOW_INDICATOR
    };
};

export const hideIndicator = () => {
    return {
        type: HIDE_INDICATOR
    }
}

export const setTabIndex = (index) => {
    return {
        type: SET_TAB_INDEX,
        index
    };
};

