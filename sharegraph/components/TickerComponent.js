import React, {Component} from 'react';
import {View,} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import TickerCardComponent from "./TickerCardComponent";
import {tickerStyles as styles} from "../../../styles/styles.sharegraph";
import Helper from "../../../common/helper";


class TickerComponent extends Component {

  constructor(props) {
    super(props);
    //console.log('=============================Ticker Constructor================================');
    //console.log(props);
  }

  tabletUI = () => (
    <View style={styles.container}>
      <TickerCardComponent
        value={this.props.tickerData.lastValue}
        name={Helper.getPhrase('Last', 'ShareGraph')}
      />
      <TickerCardComponent
        value={this.props.tickerData.highValue}
        name={Helper.getPhrase('High', 'ShareGraph')}
      />
      <TickerCardComponent
        value={this.props.tickerData.lowValue}
        name={Helper.getPhrase('Low', 'ShareGraph')}
      />
      <TickerCardComponent
        hasColor
        value={this.props.tickerData.changeValue}
        name={Helper.getPhrase('Change', 'ShareGraph')}
      />
      <TickerCardComponent
        hasColor
        hasPercent
        value={this.props.tickerData.changeValuePercent}
        name={Helper.getPhrase('ChangePercent', 'ShareGraph')}
      />
      <TickerCardComponent
        vol
        value={this.props.tickerData.volumeValue}
        name={Helper.getPhrase('Volume', 'ShareGraph')}
      />
    </View>
  );

  phoneUI = () => (
    <View style={styles.container}>
      <TickerCardComponent
        value={this.props.tickerData.lastValue}
        name={Helper.getPhrase('Last', 'ShareGraph')}
      />
      <TickerCardComponent
        hasColor
        value={this.props.tickerData.changeValue}
        name={Helper.getPhrase('Change', 'ShareGraph')}
      />
      <TickerCardComponent
        hasColor
        hasPercent
        value={this.props.tickerData.changeValuePercent}
        name={Helper.getPhrase('ChangePercent', 'ShareGraph')}
      />
    </View>
  );

  render() {
    //console.log('=============================Tiker Render======================================');
    //console.log("Ticker Props", this.props);
    return (DeviceInfo.isTablet() ? this.tabletUI() : this.phoneUI());
  }
}

export default TickerComponent;