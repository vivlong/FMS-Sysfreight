var appService = angular.module('MobileAPP.services', [
    'ionic',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.inAppBrowser'
]);

appService.service('WebApiService', ['$q', '$http', '$ionicLoading', '$ionicPopup', '$timeout',
    function ($q, $http, $ionicLoading, $ionicPopup, $timeout) {
        this.Post = function (requestUrl, requestData, blnShowLoad) {
            if(blnShowLoad){$ionicLoading.show();}
            var deferred = $q.defer();
            if (strBaseUrl.length > 0 && strBaseUrl.indexOf('/') < 0 ) {
                strBaseUrl = "/" + strBaseUrl;
            }
            strWebServiceURL = onStrToURL(strWebServiceURL);
            strWebSiteURL = onStrToURL(strWebSiteURL);
            var strSignature = hex_md5(strBaseUrl + requestUrl + strSecretKey.replace(/-/ig, ""));
            var url = strWebServiceURL + strBaseUrl + requestUrl;
            var config = {
                withCredentials: false,
                headers: {
                  'content-type': 'application/json',
                  'cache-control': 'no-cache'
                  //'Signature': strSignature
                }
            };
            $http.post(url, requestData, config).success(function (response) {
                if(blnShowLoad){$ionicLoading.hide();}
                deferred.resolve(response.data.results);
            }).error(function (response) {
                if(blnShowLoad){$ionicLoading.hide();}
                deferred.reject(response);
            });
            return deferred.promise;
        };
        this.Get = function (requestUrl, blnShowLoad) {
            if(blnShowLoad){$ionicLoading.show();}
            var deferred = $q.defer();
            if (strBaseUrl.length > 0 && strBaseUrl.indexOf('/') < 0 ) {
                strBaseUrl = "/" + strBaseUrl;
            }
            strWebServiceURL = onStrToURL(strWebServiceURL);
            strWebSiteURL = onStrToURL(strWebSiteURL);
            var strSignature = hex_md5(strBaseUrl + requestUrl + "?format=json" + strSecretKey.replace(/-/ig, ""));
            var url = strWebServiceURL + strBaseUrl + requestUrl + "?format=json";
            console.log(url);
            $http({
                method: "GET",
                url:    url
                //headers: {
                //    "Signature": strSignature
                //}
            }).success(function (response) {
                if(blnShowLoad){$ionicLoading.hide();}
                deferred.resolve(response.data.results);
            }).error(function (response) {
                if(blnShowLoad){$ionicLoading.hide();}
                deferred.reject(response);
            });
            return deferred.promise;
        };
        this.GetParam = function (requestUrl, blnShowLoad) {
            if(blnShowLoad){$ionicLoading.show();}
            var deferred = $q.defer();
            if (strBaseUrl.length > 0 && strBaseUrl.indexOf('/') < 0 ) {
                strBaseUrl = "/" + strBaseUrl;
            }
            strWebServiceURL = onStrToURL(strWebServiceURL);
            strWebSiteURL = onStrToURL(strWebSiteURL);
            var strSignature = hex_md5(strBaseUrl + requestUrl + "&format=json" + strSecretKey.replace(/-/ig, ""));
            var url = strWebServiceURL + strBaseUrl + requestUrl + "&format=json";
            console.log(url);
            $http({
                method: "GET",
                url:    url
                //headers: {
                //    "Signature": strSignature
                //}
            }).success(function (response) {
                if(blnShowLoad){$ionicLoading.hide();}
                deferred.resolve(response.data.results);
            }).error(function (error) {
                if(blnShowLoad){$ionicLoading.hide();}
                var alertPopup = $ionicPopup.alert({
                    title: error,
                    okType: 'button-assertive'
                });
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }]);

appService.service('DownloadFileService', ['$http', '$timeout', '$ionicLoading', '$cordovaToast', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2',
    function ($http, $timeout, $ionicLoading, $cordovaToast, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2) {
        this.Download = function(fileName, fileType, onPlatformError, onCheckError, onDownloadError){
            $ionicLoading.show({
                template: "Download  0%"
            });
            var url = strWebSiteURL + "/" + fileName;
            var blnError = false;
            if (blnMobilePlatform) {
                $cordovaFile.checkFile(cordova.file.externalRootDirectory, fileName)
                .then(function (success) {
                    //
                }, function (error) {
                    blnError = true;
                });
                var targetPath = cordova.file.externalRootDirectory + fileName;
                var trustHosts = true;
                var options = {};
                if (!blnError) {
                    $cordovaFileTransfer.download(url, targetPath, trustHosts, options).then(function (result) {
                        $ionicLoading.hide();
                        $cordovaFileOpener2.open(targetPath, fileType
                        ).then(function () {
                            // success
                        }, function (err) {
                            // error
                        });
                    }, function (err) {
                        $cordovaToast.showShortCenter('Download faild.');
                        $ionicLoading.hide();
                        if (onDownloadError) onDownloadError();
                    }, function (progress) {
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "Download  " + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.showShortCenter('Check file faild.');
                    if (onCheckError) onCheckError();
                }
            } else {
                $ionicLoading.hide();
                if (onPlatformError) onPlatformError(url);
            }
        };
    }]);

appService.service('DateTimeService', [
    function () {
        this.ShowDate = function (utc) {
            if (typeof (utc) === 'undefined') return ''
            var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
            var newDate = new Date(utcDate);
            if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                return newDate.Format('dd-NNN-yyyy');
            } else {
                return '';
            }
        };
        this.ShowDatetime = function (utc) {
            if (typeof (utc) === 'undefined') return ''
            var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
            var newDate = new Date(utcDate);
            if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                return newDate.Format('dd-NNN-yyyy HH:mm');
            } else {
                return '';
            }
        };
    }]);

appService.service('OpenUrlService', ['$cordovaInAppBrowser',
    function ($cordovaInAppBrowser) {
        this.Open = function (url) {
            if(blnMobilePlatform){
                var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'no'
                };
                $cordovaInAppBrowser.open(url, '_system', options)
                .then(function(event) {
                // success
                })
                .catch(function(event) {
                // error
                    $cordovaInAppBrowser.close();
                });
            }else{
                window.open(url);
            }
        };
    }]);
