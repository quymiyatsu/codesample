/**
 * Created by eurolandmacmini3 on 2/27/17.
 */

import {connect} from 'react-redux';
import PerformanceComponent from "../components/PerformanceComponent";
import {performanceDataSelector, perGlobalDataSelector} from "../helper/Selectors";

const mapStateToProps = (state, perProps) => ({
  performanceData: performanceDataSelector(state),
  perGlobalData: perGlobalDataSelector(state),
  perProps
});


export default connect(mapStateToProps, null)(PerformanceComponent);

