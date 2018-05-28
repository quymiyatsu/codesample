import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ChartWebViewComponent from '../components/ChartWebViewComponenet';
import {filterChartDataSelector} from "../helper/Selectors";
import {changePeriod} from "../actions/ActiveAction";

const mapStateToProps = (state, chartProps) => ({
  highChartData: filterChartDataSelector(state),
  currentPeriod: state.shareGraphGlobalState.currentPeriod,
  isLoading: state.shareGraphGlobalState.chartState.isLoading,
  isConnected: state.netWorkGlobalState,
  decimalDot: state.appGlobalState.generalSettings.separator.decimal,
  lang: state.appGlobalState.generalSettings.language.value.split("-")[0],
  seriesNameVolume: state.appGlobalState.langData.Common.Volume,
  seriesNameData: state.appGlobalState.langData.ShareGraph.Price,
  chartProps
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({changePeriod}, dispatch)
);

// export default connect(mapStateToProps, mapDispatchToProps)(ChartComponent);

export default connect(mapStateToProps, mapDispatchToProps)(ChartWebViewComponent);