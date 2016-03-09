/* SysFreight Server */
var strBaseUrl = "WebApi";
var strWebServiceURL = "www.sysfreight.net:8081";
var strWebSiteURL = "www.sysfreight.net:8081/mobileapp";
var strSecretKey = "9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F";
var strAppRootPath = "FreightApp";
var strAppConfigFileName = "Config.txt";
var blnMobilePlatform = false;

var onGetRegistradionID = function (data) {
    try {
        console.log("JPushPlugin:registrationID is " + data)
    }
    catch (exception) {
        console.log(exception);
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
    post: 1,
    postContextInfo: 1,
    postUrl: "/api/exception"
});
