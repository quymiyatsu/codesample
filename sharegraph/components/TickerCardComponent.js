import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Platform, Text, View} from 'react-native';
import Helper from "../../../common/helper";
import {tickerCardStyles as styles} from "../../../styles/styles.sharegraph";

class TickerCardComponent extends Component {

  putColor() {
    let result = <Text style={styles.value}/>;
    if (this.props.value !== undefined){
      if (this.props.value >= 0) {
        result = (
          <Text style={styles.valueColorGreen}>
            +{Helper.formatNumber(this.props.value)}
            {this.props.hasPercent ? "%" : ""}
          </Text>
        );
      } else {
        result = (
          <Text style={styles.valueColorRed}>
            {Helper.formatNumber(this.props.value)}
            {this.props.hasPercent ? "%" : ""}
          </Text>
        );
      }
    }
    return result;
  }

  noColor() {
    let result = <Text style={styles.value} />;

    if (this.props.value !== undefined){
      if (this.props.vol) {
        const newValue = Helper.formatNumber(this.props.value);
        result = (
          <Text style={styles.value}>{newValue.substring(0, newValue.length - 3)}</Text>
        );
      } else {
        result = (
          <Text style={styles.value}>{Helper.formatNumber(this.props.value)}</Text>
        );
      }
    }
    return result;
  }

  render() {
    return (
      <View style={styles.card}>
        {(this.props.hasColor) ?
          this.putColor() : this.noColor()
        }
        <Text style={styles.name}>{(Platform.OS === 'ios') ?
          this.props.name : this.props.name.toUpperCase()
        }</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  decimalSeparator: state.appGlobalState
});

export default connect(mapStateToProps)(TickerCardComponent);