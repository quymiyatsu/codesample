import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Helper from "../../../common/helper";
import {performanceCardStyles as styles} from "../../../styles/styles.sharegraph";

class PerformanceCardComponent extends Component {
  constructor(props) {
    super(props);
    this.stylesContent = this.stylesContent.bind(this);
  }

  formatValue() {
    let result = (<Text style={styles.value}>{this.props.value}</Text>);

    if (typeof this.props.value === 'number') {
      if (this.props.hasColor) {
        if (this.props.value > 0) {
          result = (<Text style={styles.valueColorGreen}>+{Helper.formatNumber(this.props.value)}%</Text>);
        } else if (this.props.value === 0) {
          result = (<Text style={styles.value} />);
        } else {
          result = (<Text style={styles.valueColorRed}>{Helper.formatNumber(this.props.value)}%</Text>);
        }
      } else {
        if (this.props.value === 0) {
          result = (<Text style={styles.value} />);
        } else {
          result = (<Text style={styles.value}>{Helper.formatNumber(this.props.value)}</Text>);
        }
      }
    }
    return result;
  }

  stylesContent = (styles) => {
    let result;

    if (this.props.ipL) {
      if(global.isArabic){
        result =  styles.contentIPLArabic
      } else {
        result = styles.contentIPL;
      }
    } else {
      if(global.isArabic){
        result =  styles.contentArabic
      } else {
        result = styles.content;
      }
    }
    return result;
  }

  render() {
    return (
      <View style={this.stylesContent(styles)}>
        <Text style={styles.name}>{this.props.name}</Text>
        {this.formatValue()}
      </View>
    );
  }
}

export default PerformanceCardComponent;