/* SysFreight Server */
var strBaseUrl = "WebApi";
var strWebServiceURL = "www.sysfreight.net:8081";
var strWebSiteURL = "www.sysfreight.net:8081/mobileapp";
var strSecretKey = "9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F";
var strAppRootPath = "FreightApp";
var strAppConfigFileName = "Config.txt";
var blnMobilePlatform = false;

Date.prototype.Format = function (fmt) {
	var Month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var o = {
        "M+": this.getMonth() + 1,		
        "NNN": Month[this.getMonth()],
        "d+": this.getDate(),
        "H+": this.getHours(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
	{
		if(k==='NNN'){
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length-1)));
		}
		else{
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
    return fmt;
}
/*
var funcShowDate = function (utc) {
	if (typeof (utc) === 'undefined') return ''
	var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
	var newDate = new Date(utcDate);
	if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
		return newDate.Format('dd-NNN-yyyy');
	} else {
		return '';
	}
};
var funcShowDatetime = function (utc) {
	if (typeof (utc) === 'undefined') return ''
	var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
	var newDate = new Date(utcDate);
	if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
		return newDate.Format('dd-NNN-yyyy HH:mm');
	} else {
		return '';
	}
};
*/		
var onGetRegistradionID = function (data) {
    try {
        console.log("JPushPlugin:registrationID is " + data)
    }
    catch (exception) {
        console.log(exception);
    }
}