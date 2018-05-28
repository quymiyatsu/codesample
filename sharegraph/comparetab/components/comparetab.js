import React, { PureComponent, PropTypes } from 'react';
import {
    View, Text, TouchableOpacity, StatusBar, Platform
} from 'react-native';
import { connect } from 'react-redux';
import { setTabIndex } from '../actions/comparetab.action';
import Helper from '../../../../common/helper';
import { CompareTabStyles } from '../../../../styles/styles.sharegraph';
import Header from '../../../investmentcalculator/modal/header';
import Chart from './chart/chart';
import Compare from './compare/compare';
import Performance from './performance/performance';
import ViewNoNetwork from '../../../../components/notifications/nonetwork';

class CompareTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            tabIndex: 1,
            enableCompare: false,
            enablePerformance: false
        });
        this.moduleName = "ShareGraph";
    }
    componentWillUnmount() {
        // console.log(new Date());
        this.props.dispatch(setTabIndex(1));
        // this.props.dispatch(resetData());
        if (Platform.OS === "ios")
            StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    openTabItem(index) {
        if (this.props.networkState) {
            this.setState({
                tabIndex: index,
            });
            this.props.dispatch(setTabIndex(index));
            if (index === 2) this.setState({ enableCompare: true });
            if (index === 3) this.setState({ enablePerformance: true });
        }
    }
  
    renderTabContent() {
        return (
            <View style = {{ position: 'relative', flex: 1, marginTop: 30 }}>
                <Chart {...this.props} />
                {this.renderCompareTab()}
                {this.renderPerformanceTab()} 
            </View>
        );
    }
    renderCompareTab() {
        if (this.state.enableCompare)
            return <Compare {...this.props} />;
        return null;
    }
    renderPerformanceTab() {
        if (this.state.enablePerformance)
            return <Performance {...this.props} />;
        return null;
    }
    render() {
        return (
            <View style={CompareTabStyles.modal} >
                <Header onBtnClosePress={this.props.onBtnClosePress} type={this.props.type} />
                <View style={CompareTabStyles.tabbar}>
                    <TouchableOpacity activeOpacity={1.5} style={[CompareTabStyles.tabbarItem, CompareTabStyles.tabbarItemFirst, this.state.tabIndex === 1 && CompareTabStyles.tabItemActive]} onPress={() => this.openTabItem(1)}>
                        <Text style={[CompareTabStyles.text, CompareTabStyles.tabItemText, this.state.tabIndex === 1 && CompareTabStyles.tabItemTextActive]}>{Helper.getPhrase("Charts", this.moduleName)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1.5} style={[CompareTabStyles.tabbarItem, CompareTabStyles.tabbarItemMid, this.state.tabIndex === 2 && CompareTabStyles.tabItemActive]} onPress={() => this.openTabItem(2)}>
                        <Text style={[CompareTabStyles.text, CompareTabStyles.tabItemText, this.state.tabIndex === 2 && CompareTabStyles.tabItemTextActive]}>{Helper.getPhrase("Compare", this.moduleName)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1.5} style={[CompareTabStyles.tabbarItem, CompareTabStyles.tabbarItemLast, this.state.tabIndex === 3 && CompareTabStyles.tabItemActive]} onPress={() => this.openTabItem(3)}>
                        <Text style={[CompareTabStyles.text, CompareTabStyles.tabItemText, this.state.tabIndex === 3 && CompareTabStyles.tabItemTextActive]}>{Helper.getPhrase("Performance", this.moduleName)}</Text>
                    </TouchableOpacity>
                </View>
                <ViewNoNetwork />
                {this.renderTabContent()}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        networkState: state.netWorkGlobalState
    };
};

CompareTab.PropTypes = {
    networkState: PropTypes.bool
};

export default connect(mapStateToProps)(CompareTab);
