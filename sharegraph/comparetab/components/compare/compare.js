import React, { PropTypes } from 'react';
import {
    View, Text, StatusBar, FlatList, Dimensions, Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { ajax } from 'rxjs/observable/dom/ajax';
// import { Observable } from 'rxjs/Observable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCompareDataSuccess } from '../../actions/comparetab.action';
// import TabCompareStyles from './style.compare';
import { CompareTabStyles, TabCompareStyles } from '../../../../../styles/styles.sharegraph';
import Helper from '../../../../../common/helper';
import { ActivityIndicator, ViewNoData } from '../../../../../components/notifications';

const isTablet = DeviceInfo.isTablet();
const negativeChangePro = ['#C20018', '#7E000F'];
const positiveChangePro = ['#6EB43F', '#227500'];
class Compare extends React.PureComponent {
    constructor(props) {
        super(props);
        this.apiName = props.type === "watchlist" ? "watchlist" : "indices";
        const { width, height } = Dimensions.get('window');
        this.state = ({
            compareData: [],
            isLoadDone: false,
            isLandscape: false,
            width,
            height,
            numBoxOfLine: isTablet ? width > height ? 5 : 4 : 3
        });
        this.renderItem = this.renderItem.bind(this);
    }
    componentWillMount() {
        // if (this.props.compareData.length == 0)
            this.getCompareData();
    }
    
    getCompareData() {
        // setTimeout(() => {
        //     this.setState({ isLoadDone: true })
        // }, timeOutRequest);
        
        // const options = {
        //     // These properties are part of the Fetch Standard
        //     method: 'GET',
        //     headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
        //     body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
        //     redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect

        //     // The following properties are node-fetch extensions
        //     follow: 10,         // maximum redirect count. 0 to not follow redirect
        //     timeout: timeOutRequest,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
        //     compress: true,     // support gzip/deflate content encoding. false to disable
        //     size: 0,            // maximum response body size in bytes. 0 to disable
        //     agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
        // };
        // //  Get Compare Data`
        try {
            // let responseJson = [];
            const instrumentIds = this.getInstrumentIds();
            // console.log(instrumentIds)
            const servicesUrl = global.serviceUrl + this.apiName + "/compare/" + instrumentIds;
            if (global.isIOS) StatusBar.setNetworkActivityIndicatorVisible(true);
            console.log("compare", servicesUrl);
            console.log(global.defaultSettingsData.common.requestTimeout)
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
                    this.setState({ compareData: data, isLoadDone: true });
                    // this.props.fetchCompareDataSuccess(responseJson);
                }
            }
            , (err) => {
                if (global.isIOS) StatusBar.setNetworkActivityIndicatorVisible(false);
                this.setState({ isLoadDone: true });
                console.log("Error fetch CompareTab compare data", err);
            });
            // fetch(servicesUrl, options)
            //     .then((response) => response.json())
            //     .then((responseJson) => {
            //         if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
            //         if (responseJson !== undefined && responseJson !== null) {
            //             const data = responseJson.slice();
            //             data.forEach((element) => {
            //                 const item = element;
            //                 item.Ticker = element.Ticker.trim();
            //                 global.companyData.common.instruments.forEach((ownshare) => {
            //                     if (ownshare.instrumentid === item.InstrumentId)
            //                         item.Ticker = ownshare.ticker;
            //                 });
            //                 return item;
            //             });
            //             this.setState({ compareData: data, isLoadDone: true });
            //             // this.props.fetchCompareDataSuccess(responseJson);
            //         }
            //     });
        } catch (error) {
            console.error(error);
        }
    }
    getInstrumentIds() {
        const lstInstrumentIDs = [];
        global.companyData.common.instruments.forEach((item) => {
            lstInstrumentIDs.push(item.instrumentid);
        });

        if (this.props.type == "watchlist") {
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
        return lstInstrumentIDs; // "7925,70403,72460,95048,19148,36376,107777,107778,3771,72306,70291,10397,10396";
    }

    _onLayout(e) {
        const { width, height } = Dimensions.get('window');
        
        this.setState({
            isLandscape: width > height,
            width,
            height,
            numBoxOfLine: isTablet ? width > height ? 5 : 4 : 3
        });
        //console.log("state ",this.state)
    }
    _keyExtractor = (item) => item.InstrumentId;
    renderItem({ item, index }) {
        return (
            <LinearGradient
                colors={
                    item.ChangePro >= 0
                        ? positiveChangePro
                        : negativeChangePro
                }
                style={[
                    {
                        borderBottomWidth: 0.5, borderColor: "#979797", paddingHorizontal: '10%',
                        height: isTablet ? this.state.width != 600 ? this.state.isLandscape ? 0.7 * this.state.width / 5 : 0.7 * this.state.width / 4 : 0.7 * this.state.width / 3 : this.state.width / 3,
                        width: isTablet ? this.state.width != 600 ? this.state.isLandscape ? 0.7 * this.state.width / 5 : 0.7 * this.state.width / 4 : 0.7 * this.state.width / 3 : this.state.width / 3,
                        ...Platform.select({
                            android: {
                                paddingVertical: isTablet ? this.state.width == 600 ? '8%' : '10%' : '10%',
                            },
                            ios: {
                                paddingVertical: isTablet ? '15%' : '10%',
                            }
                        }),
                        flexDirection: 'column', justifyContent: 'space-between'
                    },
                    this.state.numBoxOfLine == 5 && (index % 5 == 0 || index % 5 == 4) && { marginHorizontal: -1 },
                    this.state.numBoxOfLine == 5 && (index % 5 == 1 || index % 5 == 3) && {
                        ...Platform.select({
                            ios: {
                                marginHorizontal: -1.5, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#787878'
                            },
                            android: {
                                marginRight: -3, borderLeftWidth: 2, borderRightWidth: 1, borderColor: '#787878'
                            }
                        })
                    },
                    this.state.numBoxOfLine == 4 && { borderRightWidth: 1, borderColor: '#787878' },
                    this.state.numBoxOfLine == 3 && (index % 3 == 1) && { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#787878' },

                ]}
            >
                <Text style={[TabCompareStyles.text, TabCompareStyles.textTicker]} numberOfLines={2} >{item.Ticker}</Text>
                <Text style={[TabCompareStyles.text, TabCompareStyles.textPrice]} numberOfLines={1} >{Helper.formatNumber(item.Price)}</Text>
                <View style={TabCompareStyles.boxFooter}>
                    <Text style={[TabCompareStyles.text, TabCompareStyles.textChangePro]} numberOfLines={1}>({Helper.formatNumber(item.ChangePro)}%)</Text>
                    <Text style={[TabCompareStyles.text, TabCompareStyles.textCurrency]} numberOfLines={1}>{item.Currency}</Text>
                </View>
            </LinearGradient>
        );
    }
    
    render() {
        return (
            <View style={[TabCompareStyles.container, this.props.tab.index === 2 ? CompareTabStyles.activeTab : CompareTabStyles.hideTab]} onLayout={(e) => this._onLayout(e)} >
                <ActivityIndicator
                    animating={!this.state.isLoadDone}
                    size="large"
                />
                <Text style={[TabCompareStyles.text, TabCompareStyles.textToday]}>{Helper.getPhrase("Today", "ShareGraph").toUpperCase()}</Text>
                {
                    this.state.compareData.length > 0
                    ? <FlatList
                        data={this.state.compareData}
                        renderItem={this.renderItem}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        contentContainerStyle={TabCompareStyles.flatListContainer}
                        initialNumToRender={this.state.compareData.length}
                    />
                    : this.state.isLoadDone ? <ViewNoData /> : <View />
                }
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        // compareData: state.compareTab.compare.compareData,
        tab: state.compareTab.tab,
        // isLoadDone: state.compareTab.compare.isLoadDone,
        watchlist: state.appGlobalState.profileSettings.watchlist,
        indices: state.appGlobalState.profileSettings.indices,
    };
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchCompareDataSuccess
    }, dispatch)
);

Compare.PropTypes = {
    compareData: PropTypes.arrayOf(PropTypes.object),
    isLoadDone: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
