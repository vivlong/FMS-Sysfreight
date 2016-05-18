'use strict';
var appConfig = angular.module('MobileAPP.config', []);
appConfig.value('ENV', {
    'website': 'https://www.sysfreight.net/mobileapp',
    'api': 'https://www.sysfreight.net/WebApi',
    'debug': true,
    'mock': false,
    'fromWeb': true,
    'appId': '9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F',
    'rootPath': 'FreightApp',
    'configFile': 'config.txt',
    'mapProvider': 'google',
    'version': '1.0.26'
});

var onGetRegistradionID = function(data) {
    try {
        console.log("JPushPlugin:registrationID is " + data)
    } catch (exception) {
        console.log(exception);
    }
};

var onStrToURL = function(strURL) {
    if (strURL.length > 0 && strURL.indexOf('http://') < 0 && strURL.indexOf('HTTP://') < 0) {
        strURL = "http://" + strURL;
    }
    return strURL;
};
