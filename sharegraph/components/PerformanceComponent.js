/**
 * Created by haconglinh on 2/17/17.
 */

import React from 'react';
import {Text, View} from 'react-native';
import DeviceInfo from "react-native-device-info";
import PerformanceCardComponent from './PerformanceCardComponent';
import Helper from "../../../common/helper";
import {performanceStyles as styles} from "../../../styles/styles.sharegraph";

const isTablet = DeviceInfo.isTablet();

const shareDataNoteView = props => (<View>
  <Text style={props.isIPadLanscape ? styles.noteContentIPL : styles.noteContent}>
    {props.perGlobalData.shareDataNote.split("<a>")[0]
    }

    <Text
      style={styles.settingText}
      onPress={() => {
        props.navigation.navigate('settings',
          {title: Helper.getPhrase('Settings', 'Settings')}
        );
      }}
    >
      {props.perGlobalData.shareDataNote.split("<a>")[1].split("</a>")[0]}
    </Text>
    {props.perGlobalData.shareDataNote.split("<a>")[1].split("</a>")[1]}
  </Text>
</View>);

const shareDataView = props => (<View style={styles.dataView}>
  <PerformanceCardComponent
    name={props.perGlobalData.currencyText}
    value={props.perGlobalData.currencyValue}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    name={props.perGlobalData.tPrevCloseText}
    value={props.performanceData.tPrevClose}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    name={props.perGlobalData.t52wHighText}
    value={props.performanceData.t52wHigh}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    name={props.perGlobalData.t52wLowText}
    value={props.performanceData.t52wLow}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    hasColor
    name={props.perGlobalData.t52wChangeText}
    value={props.performanceData.t52wChange}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    hasColor
    name={props.perGlobalData.tYTDText}
    value={props.performanceData.tYTD}
    ipL={props.isIPadLanscape}
  />
</View>);

const marketDataView = props => (<View style={styles.dataView}>
  { isTablet ? <View /> :
  <PerformanceCardComponent
    name={props.perGlobalData.currencyText}
    value={props.perGlobalData.currencyValue}
    ipL={props.isIPadLanscape}
  />
  }

  <PerformanceCardComponent
    name={props.perGlobalData.marketText}
    value={props.perGlobalData.marketValue}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    name={props.perGlobalData.SymbolText}
    value={props.performanceData.Symbol}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    name={props.perGlobalData.ListText}
    value={props.performanceData.List}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    name={props.perGlobalData.IndustryText}
    value={props.performanceData.Industry}
    ipL={props.isIPadLanscape}
  />

  <PerformanceCardComponent
    formatNumber
    name={props.perGlobalData.NumberOfSharesText}
    value={props.performanceData.NumberOfShares}
    ipL={props.isIPadLanscape}
  />
  <PerformanceCardComponent
    formatNumber
    name={props.perGlobalData.MarketCapText}
    value={props.performanceData.MarketCap}
    ipL={props.isIPadLanscape}
  />
</View>);

const stylesContentPerView = (props) => {
  let result = styles.verticalView;

  if (props.isIPadLanscape) {
    result = styles.verticalView;
  } else {
    // if(global.isArabic){
    //   result = styles.horizontalViewArabic;
    // }else {
    //   result = styles.horizontalView;
    // }
    result = styles.horizontalView;
  }
  return result;
};

const mainContent = (props) => {
  let result = null;

  // Tablet
  if (DeviceInfo.isTablet()){
    result = (
      <View style={styles.perView}>
        <View style={stylesContentPerView(props)} >
          <View style={styles.outSideViewData}>
            <Text style={styles.title}>
              {props.perGlobalData.shareDataTitleText}
            </Text>
           
            {shareDataView(props)}
          </View>

          <View style={styles.outSideViewData}>
            <Text style={styles.title}>
              {props.perGlobalData.marketDataTitleText}
            </Text>
           
            {marketDataView(props)}
          </View>
        </View>

        {shareDataNoteView(props)}

      </View>
    );
  } else {
  // All Mobile

    result = (

      <View style={styles.outsideCardMobile}>

        <View style={styles.shareDataCard}>
          <Text style={styles.title}>
            {props.perGlobalData.shareDataTitleText}
          </Text>
          {shareDataNoteView(props)}
          {shareDataView(props)}
        </View>

        <View style={styles.marketDataCard}>
          <Text style={styles.title}>
            {props.perGlobalData.marketDataTitleText}
          </Text>
          {marketDataView(props)}
        </View>
      </View>
    );
  }
  return result;
};


const PerformanceComponent = props => (
  <View style={styles.content}>
    {mainContent(props)}
  </View>
);

export default PerformanceComponent;