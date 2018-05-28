import React, { PropTypes } from 'react';
import {
    View, Text, StatusBar, ScrollView, FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ajax } from 'rxjs/observable/dom/ajax';
import { fetchPerformanceDataSuccess } from '../../actions/comparetab.action';
// import TabPerformanceStyles from './style.performance';
import { CompareTabStyles, TabPerformanceStyles } from '../../../../../styles/styles.sharegraph';
import Helper from '../../../../../common/helper';
import { ActivityIndicator, ViewNoData } from '../../../../../components/notifications';

const moduleName = 'ShareGraph';
class Performance extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            performanceData: [],
            isLoadDone: false
        };
        this.apiName = props.type === "watchlist" ? "watchlist" : "indices";
    }
    componentWillMount() {
        // console.log(this.apiName)
        // if (this.props.performanceData.length === 0)
            this.getPerformanceData();
    }
    
    getInstrumentIds() {
        const lstInstrumentIDs = [];
        global.companyData.common.instruments.forEach((item) => {
            lstInstrumentIDs.push(item.instrumentid);
        });

        if (this.props.type === "watchlist") {
            if (this.props.watchlist)
                this.props.watchlist.forEach((item) => {
                    lstInstrumentIDs.push(item.Id);
                });
        } else {
            if (this.props.indices)
                this.props.indices.forEach((item) => {
                    lstInstrumentIDs.push(item.Id);
                });
        }
        return lstInstrumentIDs;
    }
    
    getPerformanceData() {
        // setTimeout(() => {
        //     this.setState({ isLoadDone: true })
        // }, timeOutRequest);
        const instrumentIds = this.getInstrumentIds();
        const servicesUrl = global.serviceUrl + this.apiName + "/performance/" + instrumentIds;
        console.log(servicesUrl)
        
        try {
            // let responseJson = [];
            if (global.isIOS) StatusBar.setNetworkActivityIndicatorVisible(true);
            
            ajax.get(servicesUrl)
            .timeout(global.defaultSettingsData.common.requestTimeout)
            // .timeout(200)
            .retry(global.defaultSettingsData.common.retry)
            // .catch(err => Observable.of(err.xhr))
            .map(data => data.response)
            .subscribe((responseJson) => {
                // console.log(data);
                if (global.isIOS) StatusBar.setNetworkActivityIndicatorVisible(false);
                
                if (responseJson !== undefined && responseJson !== null) {
                    const data = responseJson.slice();
                    data.forEach((element) => {
                        const item = element;
                        item.Ticker = element.Ticker.trim();
                        global.companyData.common.instruments.forEach((ownshare) => {
                            if (ownshare.instrumentid === item.InstrumentId)
                                item.Ticker = ownshare.ticker;
                        });
                        return item;
                    });
                    this.setState({ performanceData: data, isLoadDone: true });
                    // this.props.fetchPerformanceDataSuccess(responseJson);
                }
            }
            , (err) => {
                if (global.isIOS) StatusBar.setNetworkActivityIndicatorVisible(false);
                this.setState({ isLoadDone: true });
                console.log("Error fetch CompareTab performance data", err);
            });
        } catch (error) {
            // console.error(error);
        }
    }

    
    _keyExtractor = item => item.InstrumentId;
    renderItem(item, index) {
        const lastItem = (index === (this.state.performanceData.length - 1));
        // console.log(lastItem, " Index ", index , " state", this.props.performanceData.length - 1);
        return (
            <View style={[TabPerformanceStyles.rowItem, lastItem && TabPerformanceStyles.rowItemLast]}>
                {/* Name */}
                <Text style={[TabPerformanceStyles.colName, TabPerformanceStyles.text]} >
                    {item.Ticker}
                </Text>
                {/* Change3M */}
                <ColItem value = {Helper.formatNumber(item.Change3M)} />
                {/* Space */}
                <Text style={[TabPerformanceStyles.space, TabPerformanceStyles.text]} numberOfLines={1} />
                {/* Change 52W */}
                <ColItem value = {Helper.formatNumber(item.Change52W)} />
                {/* Space */}
                <Text style={[TabPerformanceStyles.space, TabPerformanceStyles.text]} numberOfLines={1} />
                {/* Chang YTD */}
                <ColItem value = {Helper.formatNumber(item.ChangeYTD)} />
            </View>
        );
    }

    render() {
        return (
            <View style = {[TabPerformanceStyles.container, this.props.tab.index === 3 ? CompareTabStyles.activeTab : CompareTabStyles.hideTab]} >
                <ActivityIndicator
                    animating={!this.state.isLoadDone}
                    size="large"
                />
                <HeaderList />
                <ScrollView style = {{ height: '100%' }}>
                    {
                        this.state.performanceData.length > 0
                        ? <FlatList
                            data={this.state.performanceData}
                            renderItem={({ item, index }) => this.renderItem(item, index)}
                            keyExtractor={this._keyExtractor}
                            contentContainerStyle = {TabPerformanceStyles.listViewContainer}
                            initialNumToRender={15}
                        />
                        : this.state.isLoadDone ? <ViewNoData /> : <View />
                    }
                    
                </ScrollView>
            </View>
        );
    }
}
const HeaderList = () => {
    return (
        <View style={[TabPerformanceStyles.headerListContainer]}>
            <View style={TabPerformanceStyles.headerListContent}>
                <Text style={[TabPerformanceStyles.colName, TabPerformanceStyles.text]} />
                <Text style={[TabPerformanceStyles.colValue, TabPerformanceStyles.text, TabPerformanceStyles.textHeaderValue]} numberOfLines={1}>
                    {Helper.getPhrase("Button6Month", moduleName)} 
                    
                </Text>
                {/* Space */}
                <Text style={[TabPerformanceStyles.space, TabPerformanceStyles.text]} numberOfLines={1} />
                <Text style={[TabPerformanceStyles.colValue, TabPerformanceStyles.text, TabPerformanceStyles.textHeaderValue, TabPerformanceStyles.colMid52]} numberOfLines={1}>
                    {Helper.getPhrase("52W", moduleName)} %
                    
                </Text>
                {/* Space */}
                <Text style={[TabPerformanceStyles.space, TabPerformanceStyles.text]} numberOfLines={1} />
                <Text style={[TabPerformanceStyles.colValue, TabPerformanceStyles.text, TabPerformanceStyles.textHeaderValue]} numberOfLines={1}>
                    {Helper.getPhrase("YTD", moduleName)} %
                </Text>
            </View>

        </View>
    )
}
const ColItem = (props) => {
    //console.log(props);
    const { value } = props;
    return (
        <View style={[TabPerformanceStyles.colValue,
            value !== null
            ? value < 0
                ? TabPerformanceStyles.negativeChangePro
                : TabPerformanceStyles.positiveChangePro
            : TabPerformanceStyles.null]}>
                <Text style={[TabPerformanceStyles.textValue, TabPerformanceStyles.text]} numberOfLines={1}>
                    {value !== null
                        ? value > 0
                            ? '+' + value + '%'
                            : value + '%'
                        : 'null'
                    }
                </Text>
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        // performanceData: state.compareTab.performance.performanceData,
        tab: state.compareTab.tab,
        // isLoadDone: state.compareTab.performance.isLoadDone,
        watchlist: state.appGlobalState.profileSettings.watchlist,
        indices: state.appGlobalState.profileSettings.indices,
    };
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchPerformanceDataSuccess
    },dispatch)
);

Performance.PropTypes = {
    performanceData: PropTypes.arrayOf(PropTypes.object),
    isLoadDone: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);
