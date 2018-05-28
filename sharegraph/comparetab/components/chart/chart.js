import React, { PropTypes } from 'react';
import {
    ScrollView, Text, StatusBar, TouchableOpacity, View, Platform, Dimensions, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import HighchartComponent from '../../../../../components/highchart-component';
import CompareTabService from '../../middleware/compareTabService';
import { CompareTabStyles, TabChartStyles } from '../../../../../styles/styles.sharegraph';
import { showIndicator, hideIndicator } from '../../actions/comparetab.action';
import { ActivityIndicator, ViewNoData } from '../../../../../components/notifications';
import Helper from '../../../../../common/helper';


class Chart extends React.Component {
    config = {};
    priorityDay;
    moduleName = "ShareGraph";
    numberOfPress = 1;
    jsCode = '';
    colors = [];
    currentPeriod;
    listShare = [];
    listCurrentOwnShare = [];
    listWatchlistShares = [];
    firstSeriesData;
    isWatchlist;
    constructor(props) {
        super(props);

        /* *********************************** CURRENT... **************************** */
        this.currentOwnShareActive = this.props.activeId ? this.props.activeId : global.companyData.common.instruments[0].instrumentid;
        // console.log(this.currentOwnShareActive);
        this.listCurrentOwnShare.push({
            Id: this.currentOwnShareActive,
            priority: 1
        });
        this.currentPeriod = 3;
        this.currentPriorityId = this.currentOwnShareActive; // currentOwnShareActive ID
        /* *********************************** CURRENT... **************************** */

        /* *********************************** PERIOD **************************** */
        this.listPeriod = [
            { name: Helper.getPhrase('Button1Day', this.moduleName), value: 1 },
            { name: Helper.getPhrase('Button3Month', this.moduleName), value: 3 },
            { name: Helper.getPhrase('Button6Month', this.moduleName), value: 6 },
            { name: Helper.getPhrase('Button1Year', this.moduleName), value: 12 },
            { name: Helper.getPhrase('Button3Year', this.moduleName), value: 36 },
        ];
        /* *********************************** PERIOD **************************** */

        /* *********************************** TYPE **************************** */
        if (props.type === "watchlist") {
            this.isWatchlist = true;
            this.watchListSharesTitle = Helper.getPhrase("WatchlistShares", this.moduleName);
        } else {
            this.isWatchlist = false;
            this.listPeriod.splice(0, 1);
            this.watchListSharesTitle = Helper.getPhrase("Indices", this.moduleName);
        }
        /* *********************************** TYPE **************************** */

        /* *********************************** COLOR **************************** */
        if (global.companyData.sharegraph.comparechartcolors && global.companyData.sharegraph.comparechartcolors.length > 0) {
            global.companyData.sharegraph.comparechartcolors.forEach((color) => {
                this.colors.push({
                    color,
                    isSelected: false
                });
            });
        } else {
            this.colors = [
                { color: "#FFFFFF", isSelected: true },
                { color: "#4A90E2", isSelected: false },
                { color: "#7ED321", isSelected: false },
                { color: "#FF7F0E", isSelected: false },
                { color: "#FF6275", isSelected: false }
            ];
        }
        /* *********************************** COLOR **************************** */

        this.loadOwnShares(); // Load list ownShare from Setting.json
        this.loadWatchlistShares(); // Load list watchlist/indices from user choose.

        /* *********************************** STATE... **************************** */
        const { height, width } = Dimensions.get('window');
        this.state = ({
            jsCode: '',
            firstSeriesData: [],
            isLandscape: width > height,
        });
        /* *********************************** STATE... **************************** */
        this.firstSeriesData = [];
        this._onLayout = this._onLayout.bind(this);
        this.hideIndicator = this.hideIndicator.bind(this);
    }
    componentWillMount() {
        this.initFunction();
        this.loadFirstChartData();
    }

    initFunction() {
        this.initFunction = `
            var serie;
            var currentPeriod = ${this.currentPeriod};
            function updateTickInterval(period) {
                chart.options.currentPeriod = period;
                chart.xAxis[0].update({
                    tickInterval: period == 1 ? (60 * 60 * 24 * 1000 / 12) : (period / 3) * 30 * 24 * 60 * 60 * 1000,
                });
            }
            function hideTooltip(){
                chart.tooltip.hide();
            }
            function removeSerie(id){
                if (chart.get(id) !== null) {
                    chart.get(id).remove();
                }
            }
            function addSerie(id,ticker,data,color,priority){
                chart.addSeries({
                    id: id,
                    name: ticker,
                    data: data,
                    color: color,
                    lineWidth: 1,
                    marker: {
                        symbol: 'circle',
                        radius: 1
                    },
                    options: {
                        priority: priority,
                    },
                }, true);
            }
            function updateSeriesData(id,ticker,data,color,priority){
                serie = chart.get(id);
                if (serie && serie != null){  
                    serie.setData(data);
                }
                else addSerie(id,ticker,data,color,priority);    
            }
        `;
    }
    // Load watchlist/indices shares from outside
    loadWatchlistShares() {
        this.listWatchlistShares = [];
        if (this.props.type == 'watchlist') {
            if (this.props.watchlist && this.props.watchlist)
                this.props.watchlist.map((item, index) => {
                    item.priority = index + 100;
                    this.listWatchlistShares.push(item);
                });
        } else if (this.props.indices && this.props.indices)
                this.props.indices.map((item, index) => {
                    item.priority = index + 100;
                    this.listWatchlistShares.push(item);
                });
    }
    // load ownshares from root settings.
    loadOwnShares() {
        const ownShares = [];
        global.companyData.common.instruments.forEach((item, index) => {
            let priority = index + 2;
            // set own share active when first load
            if (item.instrumentid === this.currentOwnShareActive) {
                priority = 1;
                this.listShare = [{
                    Id: item.instrumentid,
                    Ticker: item.ticker,
                    color: this.colors[0].color,
                    isOwnShare: true,
                    priority
                }];
                this.colors[0].isSelected = true;
            }
            
            ownShares.push({
                Id: item.instrumentid,
                Ticker: item.ticker,
                priority
            });
        });
        // console.log(this.listShare);
        // console.log(ownShares);
        this.listOwnShares = ownShares;
    }
    // Config chart
    genConfigChart() {
        const monthMask = Helper.getDateFormatWithoutYear(this.props.generalSettings.longDateFormat);// .replace(/,|\.|\'|\//g, '');
        const yearMask = "yyyy";
        const $scope = this;
        this.config = {
            chart: {
                backgroundColor: '#484849',
                type: 'line',
                events: {
                    redraw () { // For turning of Indicator
                        window.postMessage("YES");
                    }
                }
            },
            title: {
                text: '',
            },
            tooltip: {
                shared: true,
                useHTML: true,
                hideDelay: 300,
                animation: true,
                formatter: function formatter() {
                    // let tooltipDate = new Date(this.x);
                    let s = '';
                    let tooltipDate = '';
                    let number = '';
                    const textAlign = chart.options.isArabic ? 'right' : 'left';
                    const flexDirection = chart.options.isArabic ? 'row-reverse' : 'row';
                    const paddingLabel = chart.options.isArabic ? 'padding-right: 5px' : 'padding-left: 5px';
                    const paddingColon = chart.options.isArabic ? 'padding-left: 5px' : 'padding-right: 5px';
                    const bdo = chart.options.isArabic ? 'rtl' : 'ltr';
                    if (chart.options.currentPeriod === 1) {
                        tooltipDate = formatDate(this.x, "full");
                        s = `<div class="sg-tooltip-date" style= "font-size: 11px; text-align: ${  textAlign  }">${  tooltipDate  }</div>`;
                    } else {
                        tooltipDate = formatDate(this.x, "long");
                        s = `<div class="sg-tooltip-date" style= "font-size: 11px; text-align: ${  textAlign  }">${  tooltipDate  }</div>`;
                    }
                    this.points.sort((a,b) => {
                        return a.series.options.options.priority - b.series.options.options.priority;
                    });
                    for (let i = 0; i < this.points.length; i++) {
                        let point = this.points[i];
                        number = formatNumber(point.y);
                        s += `<div class="sg-tooltip-row" style = "flex-direction: ${  flexDirection  };display: flex;margin: 0;padding: 0;height: 15px;">`;
                        s += `<span class="sg-tooltip-circle" style= "background-color: ${  point.color  };justify-content: center;align-self: center;display: block;width: 5px;height: 5px;border-radius: 50%;"></span>`;
                        s += `<span class="sg-tooltip-label" style = " font-size: 12px;${  paddingLabel  }"><bdo dir="ltr">${  point.series.name  }</bdo> </span><span style = "${  paddingColon  }">:</span>`;
                        s += `<span class="sg-tooltip-value" style = "  font-weight: bold;font-size: 12px;"><bdo dir="${  bdo  }"> ${  number  } %</bdo></span> `;
                        s += '</div> ';
                    }
                    return s;
                    // return formatDate(this.x,"dddd-mmmm-yyyy");
                }
            },
            xAxis: {
                gridLineWidth: 1,
                // Get width tickInterval
                tickInterval: $scope.currentPeriod === 1 ? (60 * 60 * 24 * 1000 / 12) : ($scope.currentPeriod / 3) * 30 * 24 * 60 * 60 * 1000,
                type: 'datetime',
                tickLength: 0,
                gridLineColor: '#848484',
                lineColor: '#484849',
                lineWidth: 1,
                labels: {
                    formatter: function formatter() {
                        if (this.chart.options.currentPeriod === 1)
                            return formatDate(new Date(this.value), "time");
                        else if (this.chart.options.currentPeriod === 36)
                            return formatDate(new Date(this.value), this.chart.options.yearMask);
                        return formatDate(new Date(this.value), this.chart.options.monthMask);
                    },
                    style: {
                        color: '#808080',
                        fontSize: (global.isTablet) ? '15px' : '10px'
                    }
                }
            },
            yAxis: {
                title: '',
                gridLineWidth: 0,
                opposite: true,
                labels: {
                    formatter: function formatter() {
                        if (this.chart.options.currentPeriod === 1)
                            return formatNumber(this.value, 2) + ' %';
                        return formatNumber(this.value, 0) + ' %';
                    },
                    style: {
                        color: '#808080',
                        fontSize: (global.isTablet) ? '15px' : '10px'
                    }
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            marker: {
                enabled: false,

            },

            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            currentPeriod: $scope.currentPeriod,
            monthMask,
            yearMask,
            isArabic: global.isArabic,
            series: $scope.firstSeriesData
        };
    }

    // Get Priority day
    getPriorityDay(date) {
        return `${Helper.formatDate(new Date(date), "yyyymmdd")  }T000000`;
    }
    // Get index of this Id on listShare array object.
    getIndexShare(id) {
        for (let i = 0; i < this.listShare.length; i++)
            if (this.listShare[i].Id === id) {
                // console.log("Index ",i);
                return i;
            }
        return -1;
    }
    // Get next Priority id
    getNextPriorityId() {
        this.listCurrentOwnShare.sort((a, b) => {
            return a.priority - b.priority;
        });
        return this.listCurrentOwnShare[0].Id;
    }
    // Get color that not choosed in list
    getColor() {
        for (let i = 0; i < this.colors.length; i++)
            if (this.colors[i].isSelected === false) {
                this.colors[i].isSelected = true;
                return this.colors[i].color;
            }
        return undefined;
    }
    // sort label share by ownshare.
    sortListSharePress() {
        this.listShare.sort((a, b) => {
            return a.priority - b.priority;
        });
        // console.log(this.sharesChart)
    }
    // Delete color from list
    deleteColor(color) {
        for (let i = 0; i < this.colors.length; i++)
            if (this.colors[i].color === color) {
                this.colors[i].isSelected = false;
                break;
            }
    }
    // Convert data to string and inject to webview
    convertToString(data) {
        if (data == undefined || data == null || data.length < 0) return `[]`;
        
            const arrayData = data.toString().split(',');
            let shareData = [];
            let mid = '[';
            arrayData.forEach((value, index) => {
                if (index % 2 === 0) {
                    mid += `[${value},`;
                } else {
                    mid += `${value}],`;
                    shareData += mid;
                    mid = '';
                }
            });
            shareData += ']';
            return shareData;
    }
    updateTickInterval() { // Update Ticker interval by jsCode
        this.jsCode += `updateTickInterval(${this.currentPeriod});`;
    }
    hideTooltip() {
        this.jsCode += `hideTooltip();`;
    }
    removeSerie(id) {
        this.jsCode += `removeSerie(${id});`;
    }
    hideIndicator(event) {
        if (event.nativeEvent.data === 'YES')
            this.props.dispatch(hideIndicator());
    }
    showIndicator() {
        this.props.dispatch(showIndicator());
    }
    // Change Period time event
    onChangePeriod(period) {
        if (this.props.networkState) {
                this.jsCode = '';
                if (period != this.currentPeriod) {
                    this.currentPeriod = period;
                    this.showIndicator();
                    this.updateTickInterval();
                    this.hideTooltip();
                    this.loadChartData();
                }
            // }
        }
    }
    // On share data button press
    onSharePress(share, isOwnShare) {
        if (this.props.networkState) {
            // if (this.props.isLoadDone) {
                this.numberOfPress++;
                this.jsCode = '';
                const id = share.Id;
                const ticker = share.Ticker;
                const { priority } = share;
                // Check existed.
                if (this.getIndexShare(id) < 0) {  // not in list
                    if (this.listShare.length < 5) { // add share
                        // Show loading..................................
                        this.showIndicator();
                        // this.props.dispatch(handleSharePress());
                        // Get color
                        const color = this.getColor();
                        // Push attr on listShare arr object.
                        this.listShare.push({ Id: id, Ticker: ticker, color, isOwnShare, priority });

                        // if this share is ownshare , sort this.listCurrentOwnShare arr obj by priority attr
                        if (isOwnShare) {
                            this.listCurrentOwnShare.push({ Id: id, priority });
                        }
                        // Sort list share by ownshare
                        this.sortListSharePress();
                        const priorityId = this.getNextPriorityId(); // get highest priority ownshare
                        if (this.currentPriorityId != priorityId) { // if highest, load all data by new priorityID
                            this.currentPriorityId = priorityId;
                            this.loadChartData();
                        } else { // Else add serie normally
                            CompareTabService.getCompareChartData(this.isWatchlist, id, this.currentPeriod, this.priorityDay).then((data) => {
                                if (global.isIOS) {
                                    StatusBar.setNetworkActivityIndicatorVisible(false);
                                }
                                if (data && data.length > 0) {
                                    this.addChartSeries(id, ticker, data, color, priority);
                                } else { // Null data
                                    this.props.dispatch(hideIndicator());
                                }
                                
                                // ************************** State ************************** 
                                this.setState({
                                    jsCode: this.jsCode,
                                    // isFetchDone: true
                                });
                            });
                        }
                    } else {
                        // nothing
                    }
                } else { // remove
                    if (this.listCurrentOwnShare.length > 1) { // If this share is on list, erase
                        // Show loading
                        this.showIndicator();
                        // This color is not selected.
                        this.deleteColor(this.listShare[this.getIndexShare(id)].color);
                        // Erase line have this instrumentID
                        this.removeSerie(id);
                        this.listShare = this.listShare.filter((el) => {
                            return el.Id !== id;
                        });

                        if (isOwnShare) {
                            this.listCurrentOwnShare = this.listCurrentOwnShare.filter((el) => {
                                return el.Id != id;
                            });
                            const priorityId = this.getNextPriorityId();
                            if (this.currentPriorityId != priorityId) {
                                this.currentPriorityId = priorityId;
                                this.loadChartData();
                            }
                            // ************************** State ************************** 
                            else {
                                this.setState({ jsCode: this.jsCode });
                            }
                        }
                        // ************************** State ************************** 
                        else {
                            this.setState({ jsCode: this.jsCode });
                        }
                        this.props.dispatch(hideIndicator());
                    } else if (!isOwnShare) { // If the number of ownshare <=1, delete this share, don't care about the remain ownshare 
                        // Show loading
                        this.showIndicator();
                        // This color is not selected.
                        this.deleteColor(this.listShare[this.getIndexShare(id)].color);
                        // Filter
                        this.listShare = this.listShare.filter((el) => {
                            return el.Id != id;
                        });
                        // Erase line have this instrumentID
                        this.removeSerie(id);
                        // ************************** State ************************** 
                        this.setState({
                            jsCode: this.jsCode,
                        });
                        this.props.dispatch(hideIndicator());
                    }
                }
            // }
        }
    }
    // Load chartdata in the first time when constructor init
    loadFirstChartData() {
        this.priorityDay = null;
        CompareTabService.getCompareChartData(this.isWatchlist, this.listShare[0].Id, this.currentPeriod).then((data) => {
            if (Platform.OS === "ios") {
                StatusBar.setNetworkActivityIndicatorVisible(false);
            }
            if (data && data.length > 0) {
                if (this.currentPeriod === 1)
                    this.priorityDay = this.getPriorityDay(data[0][0]); // get date of first item
                this.pushObjectData(this.listShare[0].Id, data);
                this.genConfigChart();
                this.setState({
                    firstSeriesData: this.firstSeriesData,
                    // isFetchDone: true
                });
                // this.hideIndicator();
                // this.props.dispatch(loadDone());
            } 
            this.props.dispatch(hideIndicator());
        });
    }
    // Load chart data when changed *priority* or *period*.
    loadChartData() {
        this.priorityDay = null;
        this.hideTooltip();
        if (this.listShare.length > 1) { // Multiple Ids
            const iDs = [];
            const shares = this.listShare.slice();
            shares.sort((a, b) => {
                return a.priority - b.priority;
            });
            shares.forEach((obj) => {
                iDs.push(obj.Id);
            });

            // this.props.dispatch(getCompareChartData(iDs.toString(), this.currentPeriod)).then(data => {
            CompareTabService.getCompareChartData(this.isWatchlist, iDs.toString(), this.currentPeriod).then((data) => {
                if (Platform.OS === "ios") {
                    StatusBar.setNetworkActivityIndicatorVisible(false);
                }
                if (data != null) {
                    // console.log(data);
                    const keys = Object.keys(data);
                    // console.log(keys)
                    if (this.currentPeriod === 1) // 1d thi lay time theo thang dau.{}
                    {
                        const priorityId = this.getNextPriorityId();
                        if (data[priorityId].length > 0)
                            this.priorityDay = this.getPriorityDay(data[priorityId][0][0]); // get date of first item
                        else this.priorityDay = 0;
                    }   

                    keys.forEach((key) => {
                        if (data[key].length > 0) { // If next event have data ( when change ownshare priority or period)
                            this.updateSeriesData(parseFloat(key), data[key]);
                        } else { // delete in chart
                            this.removeSerie(key);
                        }
                    });
                } 
                this.props.dispatch(hideIndicator());
                this.setState({
                    jsCode: this.jsCode,
                });
            });
        } else {
            CompareTabService.getCompareChartData(this.isWatchlist, this.listShare[0].Id, this.currentPeriod).then((data) => {
                if (Platform.OS === "ios") {
                    StatusBar.setNetworkActivityIndicatorVisible(false);
                }
                if (data && data.length > 0) {
                    if (this.currentPeriod == 1)
                        this.priorityDay = this.getPriorityDay(data[0][0]); // get date of first item
                    this.updateSeriesData(this.listShare[0].Id, data);
                } else {
                    this.deleteColor(this.sharesChart[this.getIndexShare(this.listShare[0].Id)].color);
                    // Erase line have this instrumentID
                    this.removeSerie(this.listShare[0].Id);
                }
                this.setState({
                    jsCode: this.jsCode,
                });
            });
        }
    }
    // push first data chart into array object
    pushObjectData(id, data) {
        // const serie = this.listShare;
        this.firstSeriesData.push({
            id,
            name: this.listShare[0].Ticker,
            data,
            color: this.listShare[0].color,
            lineWidth: 1,
            marker: {
                symbol: 'circle',
                radius: 1
            },
            options: {
                priority: this.listShare[0].priority,
            },
        });
    }
    // Update series data
    updateSeriesData(id, data) {
        const serie = this.listShare.filter(obj => obj.Id == id);
        const serieData = this.convertToString(data);
        this.jsCode += `updateSeriesData(${id},'${serie[0].Ticker}',${serieData},'${serie[0].color}','${serie[0].priority}');`;
    }
    // Add series for highcharts
    addChartSeries(id, ticker, data, color, priority) {
        const serieData = this.convertToString(data);
        this.jsCode += `addSerie(${id},'${ticker}',${serieData},'${color}','${priority}');`;
    }
    _onLayout(e) {
        const { width, height } = Dimensions.get('window');
        
        this.setState({
            isLandscape: width > height
        });
    }
    renderChartWebView() {
        if (this.state.firstSeriesData !== undefined)
            if (this.state.firstSeriesData.length > 0)
                return (
                    <HighchartComponent 
                        style={StyleSheet.flatten([TabChartStyles.chart, this.state.isLandscape && TabChartStyles.chartLandscape])} 
                        config={this.config} 
                        jsCode={this.state.jsCode} 
                        func={this.initFunction} 
                        currentPeriod = {this.currentPeriod}
                        onMessage = {this.hideIndicator}
                    />
                );
            else 
                return this.props.isLoadDone ? <ViewNoData /> : <View />;
        return <View />;
    }
    render() {
        return (
            <ScrollView
                onLayout={this._onLayout}
                style={StyleSheet.flatten([
                        TabChartStyles.container,
                        this.state.isLandscape && TabChartStyles.containerLandscape, 
                        this.props.tabIndex === 1 ? CompareTabStyles.activeTab : CompareTabStyles.hideTab,
                    ])} 
            >
                    <View style={StyleSheet.flatten([TabChartStyles.chartContainer, this.state.isLandscape && TabChartStyles.chartContainerLandscape])}>
                        <Period listPeriod={this.listPeriod} currentPeriod={this.currentPeriod} onChangePeriod={period => this.onChangePeriod(period)} />
                        {this.renderChartWebView()}
                        <ActivityIndicator
                            animating={!this.props.isLoadDone}
                            size= "large"
                            style = {{ top: '50%' }}
                        />
                    </View>
                    <View style={StyleSheet.flatten([TabChartStyles.footer, this.state.isLandscape && TabChartStyles.footerLandscape])}>
                        <View style={StyleSheet.flatten([TabChartStyles.viewShareActive, this.state.isLandscape && TabChartStyles.viewShareActiveLandscape])}>
                            {
                                this.listShare.map(share =>
                                    <Text key={share.Id} style={[TabChartStyles.text, TabChartStyles.textActive, { color: `${share.color}` }]}>{share.Ticker}</Text>
                                )
                            }
                        </View>
                        <Text style={StyleSheet.flatten([TabChartStyles.text, TabChartStyles.tooltip, this.state.isLandscape && TabChartStyles.tooltipLandscape])}>
                            {Helper.getPhrase('CompareNote', this.moduleName)}
                        </Text>
                        <Text style={[TabChartStyles.text, TabChartStyles.ownShareTitle]}>
                            {Helper.getPhrase('OwnShares', this.moduleName).toUpperCase()}
                        </Text>
                        {/* <OwnShares /> */}
                        <View style={TabChartStyles.listOwnShare}>
                            {
                                this.listOwnShares.map(
                                    ownShare =>
                                        (<ButtonShare
                                            isEnabled = {this.props.isLoadDone}
                                            key={ownShare.Id}
                                            onSharePress={() => this.onSharePress(ownShare, true)}
                                            {...ownShare}
                                            isActive={this.getIndexShare(ownShare.Id) > -1}
                                        />)
                                )
                            }
                        </View>
                        <Text style={[TabChartStyles.text, TabChartStyles.watchlistShareTitle]}>
                            {this.props.type === 'watchlist' ? Helper.getPhrase('WatchlistShares', this.moduleName).toUpperCase() : Helper.getPhrase('Indices', this.moduleName).toUpperCase()}
                        </Text>
                        {/* WatchlistShares  */}
                        <View style={TabChartStyles.listWatchlistShare}>
                            {
                                this.listWatchlistShares && this.listWatchlistShares.map(
                                    watchlistShare => (
                                        <ButtonShare
                                            isEnabled = {this.props.isLoadDone}
                                            key={watchlistShare.Id}
                                            onSharePress={() => this.onSharePress(watchlistShare, false)}
                                            {...watchlistShare}
                                            isActive={this.getIndexShare(watchlistShare.Id) > -1}
                                        />
                                    )
                                )
                            }
                        </View>
                    </View>
            </ScrollView>
        );
    }
}
// list Period
const Period = (props) => {
    return (
        <View style={TabChartStyles.period} >
            {
                props.listPeriod.map((period) => {
                    return (
                        <TouchableOpacity
                            key={period.value}
                            style={[TabChartStyles.btnPeriod]}
                            onPress={() => props.onChangePeriod(period.value)}
                        >
                            <Text
                                numberOfLines={1}
                                style={
                                    [TabChartStyles.text, TabChartStyles.textButtonPeriod,
                                        props.currentPeriod == period.value && TabChartStyles.textButtonPeriodActive]
                                }
                            >
                                {period.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    );
};
const ButtonShare = (props) => {
    return (
        <TouchableOpacity
            disabled = {!props.isEnabled}
            style={[
                TabChartStyles.buttonShare,
                props.isActive
                    ? Platform.OS === 'ios'
                        ? TabChartStyles.buttonShareActiveIOS
                        : TabChartStyles.buttonShareActiveAndroid
                    : undefined
            ]}
            onPress={props.onSharePress}
        >
            <Text style={
                [
                    TabChartStyles.text,
                    TabChartStyles.textButtonShare,
                ]}
            >
                {props.Ticker}
            </Text>
        </TouchableOpacity>
    );
};
const mapStateToProps = (state) => {
    return {
        isLoadDone: state.compareTab.tab.isLoadDone,
        tabIndex: state.compareTab.tab.index,
        networkState: state.netWorkGlobalState,
        generalSettings: state.appGlobalState.generalSettings,
        watchlist: state.appGlobalState.profileSettings.watchlist,
        indices: state.appGlobalState.profileSettings.indices,
        activeId: state.shareGraphGlobalState.currentInstrumentId
    };
};

Chart.PropTypes = {
    // chart: PropTypes.object,
    networkState: PropTypes.bool,
    generalSettings: PropTypes.object
};

export default connect(mapStateToProps)(Chart);
