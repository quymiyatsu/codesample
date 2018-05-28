/**
 * Created by haconglinh on 03/03/2017.
 */

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShareGraphComponent from '../components/ShareGraphComponent';
import {shouldForceRerender, shouldInitDataSelector} from "../helper/Selectors";
import {changeInstrumentId} from "../actions/ActiveAction";
import {updateData} from "../actions/DataAction";

const mapStateToProps = state => ({
  shouldInitData: shouldInitDataSelector(state),
  currentInstrumentId: state.shareGraphGlobalState.currentInstrumentId,
  forceReRender: shouldForceRerender(state),
  language: state.appGlobalState.generalSettings ? state.appGlobalState.generalSettings.language : null,
  shouldEnabledGestures: state.appGlobalState.shouldEnabledGestures
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    changeInstrumentId,
    updateData
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ShareGraphComponent);

