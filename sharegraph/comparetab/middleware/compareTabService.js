// Service by Monkey 
import { StatusBar, Platform } from 'react-native';
import { ajax } from 'rxjs/observable/dom/ajax';
// import { Observable } from 'rxjs/Observable';
import Helper from '../../../../common/helper';


export default class CompareTabService {

    // static servicesUrl = 'http://113.190.248.146/myirappapi2/api/v1/';
    static apiName = 'chartdata';
    static defaultHisoryDateFormat = "yyyymmdd";
    // static defaultDailyDateFormat = "yyyymmdd HHMMss";
    static compareServicesUrl = '';
    // static timeOutRequest = 10000;
    // static options = {
    //     // These properties are part of the Fetch Standard
    //     method: 'GET',
    //     headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
    //     body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
    //     redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect

    //     // The following properties are node-fetch extensions
    //     follow: 10,         // maximum redirect count. 0 to not follow redirect
    //     timeout: CompareTabService.timeOutRequest,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
    //     compress: true,     // support gzip/deflate content encoding. false to disable
    //     size: 0,            // maximum response body size in bytes. 0 to disable
    //     agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
    // }

    /**
     * Get Compare chart data
     */
    static getCompareChartData(isWatchlist, instrumentIds, period, fDate = null) {
        if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);
        return new Promise(
            (resolve) => {
                // compareServicesUrl = globalVars.servicesUrl + apiName + "/compare/";
                this.compareServicesUrl = global.serviceUrl + this.apiName + "/compare/";
                const isMultiIds = instrumentIds.toString().indexOf(",") >= 0; // 
                //console.log("Multi ", isMultiIds)
                if (period == 1) // Period = 1
                    this.getDailyCompareData(resolve, instrumentIds, isMultiIds, fDate);
                else { // Get 3M,6M,1Y
                    this.getHistoryCompareData(resolve, isWatchlist, instrumentIds, period, isMultiIds);
                }
            }
            // (reject) => {
            //     //console.log(" Fetch Compare Chart Data Error ", reject);
            // }
        );
    }

    static getDailyCompareData(resolve, instrumentIds, isMultiIds = false, fDate) {
        // if (globalVars.isOnline) {
        let dailyServiceUrl = this.compareServicesUrl + "1d/" + instrumentIds;

        if (fDate != null)
            dailyServiceUrl += "/" + fDate;
        if (!global.generalSettings.currency.isDefault)
            dailyServiceUrl += "/" + global.generalSettings.currency.value;
        console.log(dailyServiceUrl)
        ajax.get(dailyServiceUrl)
            .timeout(global.defaultSettingsData.common.requestTimeout)
            .retry(global.defaultSettingsData.common.retry)
            // .catch(err => Observable.of(err.xhr))
            .map(data => data.response)
            .subscribe((data) => {
                // console.log(data);
                if (data != undefined && data != null) {
                    if (data.length > 0) {
                        const dataProcess = this.processData(data, isMultiIds);
                        resolve(dataProcess);
                    } else {
                        resolve(undefined);
                    }
                }
            }
            , (err) => {
                console.log("Error fetch daily chart data", err);
                resolve(undefined);
            });
        // }
        // fetch(dailyServiceUrl, CompareTabService.options).then((response) => response.json())
        //     .then(data => {
        //         if (data != undefined && data != null) {
        //             if (data.length > 0) {
        //                 const dataProcess = CompareTabService.processData(data, isMultiIds);
        //                 resolve(dataProcess);
        //             }
        //             else {
        //                 resolve(data);
        //             }
        //         }
        //         else {
        //             resolve(data);
        //         }
        //     },
        //     error => {
        //         //console.log(error);
        //         resolve(data);
        //     });
    }

    static getHistoryCompareData(resolve, isWatchlist, instrumentIds, period, isMultiIds = false) {
        var fDate = this.getFromDate(period);
        var tDate = new Date();
        let historyServiceUrl = this.compareServicesUrl;
        if (isWatchlist)
            historyServiceUrl += "watchlist/";
        else if (isMultiIds) // is multi shares
            historyServiceUrl += "shares/";
        //console.log(" Get Histority ");
        let params = instrumentIds + "/" +
            Helper.formatDate(fDate, this.defaultHisoryDateFormat, false) + "/" +
            Helper.formatDate(tDate, this.defaultHisoryDateFormat, false);
        if (!global.generalSettings.currency.isDefault)
            params += "/" + global.generalSettings.currency.value;
        console.log(historyServiceUrl + params);

        ajax.get(historyServiceUrl + params)
        .timeout(global.defaultSettingsData.common.requestTimeout)
        .retry(global.defaultSettingsData.common.retry)
        // .catch(err => Observable.of(err.xhr))
        .map(data => data.response)
        .subscribe((data) => {
            // console.log(data);
            if (data != undefined && data != null) {
                if (data.length > 0) {
                    const dataProcess = this.processData(data, isMultiIds);
                    resolve(dataProcess);
                } else {
                    resolve(undefined);
                }
            }
        }
        , (err) => {
            console.log("Error fetch history chart data", err);
            resolve(undefined);
        });
        // fetch(historyServiceUrl + params, CompareTabService.options).then((response) => response.json())
        //     .then(
        //     data => {
        //         if (data != undefined && data != null) {
        //             if (data.length > 0) {
        //                 const dataProcess = CompareTabService.processData(data, isMultiIds);
        //                 resolve(dataProcess);
        //             }
        //             else {
        //                 resolve(data);
        //             }
        //         }
        //         else {
        //             resolve(data);
        //         }
        //     },
        //     error => {
        //         resolve(data);
        //     });
    }
    /**
     * get From date
     */
    static getFromDate(period) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(today.setMonth(today.getMonth() - period));
    }
    // Convert from RAW DATA Time -> Miliseconds
    static convertTimeToSeconds(dateTime) {
        const sDate = dateTime.split("T");
        const dDate = sDate[0].split("-");
        const dTime = sDate[1].split(":");
        const date = (new Date(dDate[0],dDate[1]-1,dDate[2],dTime[0],dTime[1],dTime[2])).getTime();
        return date;
    }
    /**
     * Process data
     */
    static processData(data, isMultiple = false) {
        let firstPrice = parseFloat(data[0].Close);
        let chartData = [];
        if (!isMultiple) {
            data.forEach((obj, index) => {
                const date = this.convertTimeToSeconds(obj.Date);
                const changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                chartData.push([date, changePercent]);
            });
        } else {
            const multiData = {};
            data.forEach((instrument) => {
                multiData[instrument.InstrumentId] = [];
                if (instrument.Data.length > 0) {
                    firstPrice = parseFloat(instrument.Data[0].Close);
                    instrument.Data.forEach((obj, index) => {
                        const date = this.convertTimeToSeconds(obj.Date);
                        const changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                        multiData[instrument.InstrumentId].push([date, changePercent]);
                    });
                }
            });
            chartData = multiData;
        }
        return chartData;
    }
}
