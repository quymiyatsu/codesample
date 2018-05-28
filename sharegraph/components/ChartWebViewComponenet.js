/**
 * Created by haconglinh on 2/17/17.
 */

import React, {Component} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar,} from '../../../../Plugins/react-native-scrollable-tab-view';
import {chartWebViewStyles as styles} from "../../../styles/styles.sharegraph";
import {
  PERIOD_ONE_DAY,
  PERIOD_ONE_YEAR,
  PERIOD_SIX_MONTH,
  PERIOD_THREE_MONTH,
  PERIOD_THREE_YEAR
} from "../../../common/constants";
import {indexTabByPeriod} from "../helper/Helper";
import HighchartComponentOfMEOMEO from "./HighchartComponentOfMeoMeo";
import ViewNoNetwork from "../../../components/notifications/nonetwork";
import Helper from "../../../common/helper";
import GlobalStyle from "../../../styles/GlobalStyle";


class ChartWebViewComponent extends Component {
  constructor(props) {
    super(props);
    // //console.log('========================Chart Constructor===============================');

    const initIndex = indexTabByPeriod(this.props.currentPeriod);
    // //console.log(initIndex);
    this.state = {
      index: 2,
      initIndex,
    };
    this.handleChangePeriodTab = this.handleChangePeriodTab.bind(this);
  }

  handleChangePeriodTab({i}) {
    if (this.state.index !== i) {
      this.setState({
        index: i,
      });

      switch (i) {
        case 0:
          this.props.changePeriod(PERIOD_ONE_DAY);
          // //console.log('===================Action PERIOD_ONE_DAY======================');
          break;
        case 1:
          this.props.changePeriod(PERIOD_THREE_MONTH);
          // //console.log('==================Action PERIOD_THREE_MONTH=====================');
          break;
        case 2:
          this.props.changePeriod(PERIOD_SIX_MONTH);
          // //console.log('==================Action PERIOD_SIX_MONTH=================');
          break;
        case 3:
          this.props.changePeriod(PERIOD_ONE_YEAR);
          // //console.log('====================Action PERIOD_ONE_YEAR==========================');
          break;
        case 4:
          this.props.changePeriod(PERIOD_THREE_YEAR);
          // //console.log('===================Action PERIOD_THREE_YEAR=====================');
          break;
        default:
          this.props.changePeriod(PERIOD_SIX_MONTH);
          // //console.log('=====================Action PERIOD_DEFAULT=========================');
          break;
      }
    }
  }

  render() {
    // //console.log('==================Chart Render======', this.props.highChartData);
    // //console.log('==================Chart Render======', this.props.isLoading);

    const listTitle = ["Button1Day", "Button3Month", "Button6Month", "Button1Year", "Button3Year"];

    return (
      <View style={styles.container}>
        <ViewNoNetwork />
        <View style={this.props.ipL ? styles.contentIPL : styles.content}>
          <ActivityIndicator
            size="large"
            style={this.props.isLoading ? styles.spinnerShow : styles.spinnerHide}
            color={this.props.isLoading ? GlobalStyle.spinnerColor : 'white'}
          />

          {((this.props.highChartData.length === 0) && !this.props.isLoading) ?
            <Text style={styles.textNoData}>
              {Helper.getPhrase('MsgNoData', 'Common')}
            </Text>
            :
            <HighchartComponentOfMEOMEO
              decimalDot={this.props.decimalDot}
              period={this.props.currentPeriod}
              lang={this.props.lang}
              style={this.props.ipL ? styles.contentIPL : styles.content}
              volumeData={JSON.stringify(this.props.highChartData
                // .filter(chart => ((new Date(chart.Date).getTime()) >= timeWeNeed.getTime()))
                .map(chart => ({ x: new Date(chart.Date).getTime(), y: chart.Volume }))
              )}
              closeData={JSON.stringify(this.props.highChartData
                // .filter(chart => ((new Date(chart.Date).getTime()) >= timeWeNeed.getTime()))
                .map(chart => ({ x: new Date(chart.Date).getTime(), y: chart.Close }))
              )}
              seriesNameVolume={this.props.seriesNameVolume}
              seriesNameData={this.props.seriesNameData}
            />
          }

        </View>

        <ScrollableTabView
          locked
          onChangeTab={this.handleChangePeriodTab}
          style={styles.periodTabView}
          initialPage={this.state.initIndex}
          tabBarUnderlineStyle={styles.underLineTab}
          renderTabBar={() => (<DefaultTabBar
            tabStyle={styles.periodTabStyle}
            textStyle={styles.periodTabText}
            activeTextColor={GlobalStyle.primaryTextColor}
            inactiveTextColor={GlobalStyle.secondaryTextColor}
          />)}
        >

          {listTitle.map(title => (
            <Text
              key={listTitle.indexOf(title)}
              tabLabel={Helper.getPhrase(title, 'ShareGraph')}
            />))}

        </ScrollableTabView>


      </View>
    );
  }
}


export default ChartWebViewComponent;