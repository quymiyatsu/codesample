/**
 * Created by eurolandmacmini3 on 2/27/17.
 */

import {connect} from 'react-redux';
import TickerComponent from '../components/TickerComponent';
import {tickerSelector} from '../helper/Selectors';

const mapStateToProps = state => ({
  tickerData: tickerSelector(state),
  lastText: state.appGlobalState.langData.Common.Last,
  highText: state.appGlobalState.langData.Common.High,
  lowText: state.appGlobalState.langData.Common.Low,
  changeText: state.appGlobalState.langData.Common.Change,
  changePercentText: state.appGlobalState.langData.Common.ChangePercent,
  volumeText: state.appGlobalState.langData.Common.Volume,
  decimalSeparator: state.appGlobalState
});

export default connect(mapStateToProps)(TickerComponent);

