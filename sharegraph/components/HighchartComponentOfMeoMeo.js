import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import WKWebView from '../../../../Plugins/react-native-wkwebview-reborn';
import {PERIOD_ONE_DAY} from "../../../common/constants";


class HighchartComponentOfMEOMEO extends Component {
  render() {
    // //console.log('==================HIGHTChart Render======');
    const concatByMeomeo = `
            
      <html>
        <style media="screen" type="text/css">
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none; /* Disable selection/copy in UIWebView */
        }
        #container {
          overflow-y: hidden;
          width:100%;
          height:100%;
          top:0;
          left:0;
          right:0;
          bottom:0;
          position:absolute;
        }
        </style>
        <head>
          <script src='numeral.min.js'></script>
          <script src='moment-with-locales.min.js'></script>
          <script type="text/javascript" src="highstock-4.2.5.js"></script>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <meta name="msapplication-tap-highlight" content="no">
        </head>
        <body>
          <div id="container">
          </div>
          <script>
            
            var chart = Highcharts.stockChart(
              'container', {
                chart: {
                  animation: false, 
                  plotBorderWidth: 0, 
                  margin: [12, 3, 0, 0], 
                  spacingTop: 0, 
                  spacingBottom: 0, 
                  spacingLeft: 0, 
                  spacingRight: 0, 
                  backgroundColor: "#EDECF2", 
                  width: null, 
                  pinchType: ""
                }, 
                title: {
                  text: null
                }, 
                xAxis: {
                  gridLineWidth: 0, 
                  lineWidth: 0, 
                  tickWidth: 0, 
                  labels: {
                    enabled: false
                  }
                }, 
                yAxis: [
                  {
                    title: {
                      text: null
                    }, 
                    gridLineWidth: 0, 
                    showLastLabel: true, 
                    tickPosition: "inside", 
                    labels: {
                      enabled: true, 
                      formatter: function formatter() {
                        var arabic = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
                        
                        var numberEnDot =  numeral(this.value).format('0,0.00');
                        
                        var numberEnDotToTemp = numberEnDot.replace(",", "a");
                        var numberEnTemp = numberEnDotToTemp.replace(".", ",");
                        var numberEnComma = numberEnTemp.replace("a", ".");
                        
                        var numberEn = ${(this.props.decimalDot === '.') ? 'numberEnDot' : 'numberEnComma'} ;
                        
                        var chars = numberEn.toString().split("");
                        var newNum = new Array();
                        for (var i = 0; i < chars.length; i++) {
                          if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                            newNum[i] = chars[i];
                          else
                            newNum[i] = arabic[chars[i]];
                        }
                        var numberAr = newNum.join("");
                        var number = ${(this.props.lang === 'ar') ? 'numberAr' : 'numberEn'}
                        return number;
                      }
                    }
                  }, 
                  {
                    gridLineWidth: 0, 
                    title: {
                      text: null
                    }, 
                    showFirstLabel: false, 
                    labels: {
                      enabled: false
                    }, 
                    opposite: true
                  }
                ], 
                plotOptions: {
                  series: {
                    shadow: false, 
                    dataGrouping: {
                      groupPixelWidth: 15
                    }
                  }, 
                  column: {
                    borderWidth: 0
                  }, 
                  area: {
                    fillOpacity: 0.5, 
                    lineColor: "#fff", 
                    lineWidth: 2, 
                    color: "#7EBFEA"
                  }
                }, 
                tooltip: {
                  animation: false, 
                  useHTML: true, 
                  shared: true, 
                  crosshairs: true, 
                  followTouchMove: false, 
                  style: {padding: 5}, 
                  
                  formatter: function formatter() {      
                    moment.locale('${this.props.lang}');
                    var formatResult = moment.utc(this.x).format('${(this.props.period === PERIOD_ONE_DAY) ? 'MMMM D, YYYY h:mm A' : 'MMMM D, YYYY'}');
                    var result = formatResult.charAt(0).toUpperCase() + formatResult.slice(1);
                    
                    var s = '<span class="sg-tooltip-date">' + result + '</span>';
                    this.points.reverse().forEach(function (point) {
                      var arabic = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
                      
                      var numberEnDot =  numeral(point.y).format('0,0.00');
                      if(numberEnDot.length > 7){
                        numberEnDot =  numeral(point.y).format('0,0.');
                      }
                        
                      var numberEnDotToTemp = numberEnDot.replace(",", "a");
                      var numberEnTemp = numberEnDotToTemp.replace(".", ",");
                      var numberEnComma = numberEnTemp.replace("a", ".");
                      
                      var numberEn = ${(this.props.decimalDot === '.') ? 'numberEnDot' : 'numberEnComma'} ;

                      var chars = numberEn.toString().split("");
                      var newNum = new Array();
                      for (var i = 0; i < chars.length; i++) {
                        if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                          newNum[i] = chars[i];
                        else
                          newNum[i] = arabic[chars[i]];
                      }
                      var numberAr = newNum.join("");
                      var number = ${(this.props.lang === 'ar') ? 'numberAr' : 'numberEn'}
                    
                      s += '<div style="text-align: ${(this.props.lang === 'ar') ? 'right' : 'left'};">';
                      s += '<span style="color:' + point.series.color + ';">'
                      + point.series.name 
                      + '</span> <b>' 
                      + number 
                      + '</b>';
                      s += '</div>';
                    });
                    return s;
                  }
                }, 
                credits: {
                  enabled: false
                }, 
                legend: {
                  enabled: false
                }, 
                series: [
                  {
                    name: "${this.props.seriesNameVolume}", 
                    color: "#4572A7", 
                    animation: false, 
                    type: "column", 
                    inverted: true, 
                    yAxis: 1, 
                    data: ${this.props.volumeData}
                  }, 
                  {
                    name: "${this.props.seriesNameData}",
                    type: "area", 
                    animation: false, 
                    threshold: null, 
                    marker: {
                      enabled: false
                    }, 
                    data: ${this.props.closeData}
                  }
                ], 
                exporting: {
                  enabled: false
                }, 
                navigation: {
                  buttonOptions: {
                    enabled: false
                  }
                }, 
                navigator: {
                  enabled: false
                }, 
                scrollbar: {
                  enabled: false
                }, 
                rangeSelector: {
                  enabled: false
                }
              }
            );
            Highcharts.setOptions({
              global: {
                useUTC: ${Platform.OS === 'ios' ? 'false' : 'true'}
              }
            });
              </script>
            </body>
          </html>
        
        `;

    return (
      Platform.OS === 'android' ?
        <WebView
          style={this.props.style}
          source={{ html: concatByMeomeo, baseUrl: "file:///android_asset/" }}
          javaScriptEnabled
          scalesPageToFit
          scrollEnabled={false}
        /> :
        <WKWebView
          style={this.props.style}
          source={{ html: concatByMeomeo, baseUrl: 'Libs/'}}
          javaScriptEnabled
          scalesPageToFit
          scrollEnabled={false}
        />
    );
  }
}

export default HighchartComponentOfMEOMEO;
