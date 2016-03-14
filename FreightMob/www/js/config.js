'use strict';
var appConfig = angular.module('MobileAPP.config',[]);
appConfig.value('ENV', {
    'website':      'http://www.sysfreight.net:8081/mobileapp',
    'api':          'http://www.sysfreight.net:8081/WebApi',
    'debug':        true,
    'mock':         false,
    'fromWeb':      true,
    'appId':        '9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F',
    'rootPath':     'FreightApp',
    'configFile':   'config.txt',
    'mapProvider':  'baidu',
    'version':      '1.0.24'
});

var onGetRegistradionID = function (data) {
    try {
        log4web.log("JPushPlugin:registrationID is " + data)
    }
    catch (exception) {
        log4web.log(exception);
    }
};

var onStrToURL = function(strURL){
    if (strURL.length > 0 && strURL.indexOf('http://') < 0 && strURL.indexOf('HTTP://') < 0) {
        strURL = "http://" + strURL;
    }
    return strURL;
};

log4web.config({
    debug: 0,
    level: "debug",
    tagFilter: "",
    post: 0,
    postContextInfo: 1,
    postUrl: "http://www.sysfreight.net:8081/bugreport/api/exception"
});
