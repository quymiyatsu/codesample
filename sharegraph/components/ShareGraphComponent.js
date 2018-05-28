import React, {Component} from 'react';
import {Platform, ScrollView, View,} from 'react-native';
import Orientation from 'react-native-orientation';
import ChartContainer from '../containers/ChartContainer';
import TickerContainer from '../containers/TickerContainer';
import PerformanceContainer from "../containers/PerformanceContainer";
import {indexTabByInstrument} from "../helper/Helper";
import Helper from '../../../common/helper';
import {shareGraphStyles as styles} from "../../../styles/styles.sharegraph";
import ScrollTabBarView from "../../../components/Tabbar/ScrollTabBarView";
import WatchlistModal from "../../../components/watchlist/watchlist-modal";
import ButtonBack from '../../../navigators/buttons/backbutton';
import {NavigatorStyles} from "../../../styles/styles.components";

class ShareGraphComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    let shouldEnabledGestures = Platform.OS === 'ios';
    if (state.params)
      shouldEnabledGestures = state.params.shouldEnabledGestures;
    return {
      headerLeft: (
        <ButtonBack onPress = {() => navigation.goBack()} />
      ),
      headerStyle: NavigatorStyles.navigator,
      headerTitleStyle: NavigatorStyles.title,
      title: `${state.params.title === undefined
        ? Helper.getPhrase(navigation.state.routeName)
        : state.params.title}`,
      gesturesEnabled: shouldEnabledGestures
    };
  };

  constructor(props) {
    //console.log('========================SG Constructor==============================');
    super(props);

    this.state = {
      index: indexTabByInstrument(
        global.companyData.common.instruments,
        this.props.currentInstrumentId
      ),
      isIPadLanscape: false,
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  componentWillMount() {
    //console.log('========================SG componentWillMount=======================');
    Orientation.addOrientationListener(this.onOrientationChange);
    const orientation = Orientation.getInitialOrientation();
    this.onOrientationChange(orientation);

    if (!global.isTablet) {
      Orientation.lockToPortrait();
    }
    // (if store has data, check it need update it or init data)
    if (this.props.shouldInitData) {
      // Init data for default instrument id
      const companyData = global.companyData;
      const initInstrumentId = companyData.common.instruments[0].instrumentid;
      this.props.changeInstrumentId({
        oldID: null,
        newID: initInstrumentId
      });
    } else {
      // come back to sh module, check update data
      this.props.updateData();
      //console.log('========================SG Update data================');
    }
  }

  onOrientationChange = (orientation) => {
    const isIPadLanscape = (Platform.OS === 'ios' && global.isTablet && orientation === 'LANDSCAPE');
    if (isIPadLanscape !== this.state.isIPadLanscape) {
      //console.log('========================Change Ipad to Lanscape============================');
      this.setState({isIPadLanscape: isIPadLanscape});
    }
  };

  componentWillReceiveProps(nextProps){
    if (!this.props.forceReRender && nextProps.forceReRender){
      this.props.updateData();
      //console.log('========================SG Update data================');
    }

    if(this.props.language && nextProps.language){
      if (nextProps.language.value != this.props.language.value) {
        this.props.navigation.setParams({
          title: Helper.getPhrase(this.props.navigation.state.routeName)
        });
      }
    }
    if (this.props.shouldEnabledGestures !== nextProps.shouldEnabledGestures)
        this.props.navigation.setParams({
          shouldEnabledGestures: nextProps.shouldEnabledGestures
        });

    //console.log('========================SG componentWillReceiveProps================');
  }

  componentDidMount() {
    //console.log('========================SG componentDidMount========================');
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.onOrientationChange);
    //console.log('========================SG componentWillUnmount=====================');
  }

  handleChangeTab(i) {
    if (this.state.index !== i) {
      this.setState({index: i});
      const instruments = global.companyData.common.instruments;
      this.props.changeInstrumentId({
        oldID: this.props.currentInstrumentId,
        newID: instruments[i].instrumentid
      });
    }
  }

  render() {
    //console.log('=============================SG Render==============================');
    const instruments = global.companyData.common.instruments;
    const tabTitles = instruments.map(instrument => ({name: instrument.name['en-gb'].toUpperCase()}));
    const ipL = this.state.isIPadLanscape;

    return (
      <View style={styles.container}>

        <ScrollTabBarView
          initTab={this.state.index < 0 ? 0 : this.state.index}
          tabsList={tabTitles}
          onTabChange={this.handleChangeTab}
        />

        <ScrollView>
          <View style={ipL ? styles.contentIPL : styles.content}>
            <View style={ipL ? styles.viewCTCIPL : styles.viewCTC}>
              <View>
                <ChartContainer ipL={ipL} />
              </View>
              <View>
                <TickerContainer/>
              </View>
              <View style={ipL ? styles.viewCompareIPL : styles.viewCompare}>
                <WatchlistModal moduleName="ShareGraph"/>
              </View>

            </View>
            <View style={ipL ? styles.viewPerIPL : styles.viewPer}>
              <PerformanceContainer isIPadLanscape={ipL} navigation={this.props.navigation}/>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ShareGraphComponent;