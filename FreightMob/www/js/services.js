var appService = angular.module('MobileAPP.services', [
    'ionic',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2'
]);

appService.service('WebApiService', ['$http', '$ionicPopup', '$timeout',
    function ($http, $ionicPopup, $timeout) {
        function parseResponseStatus (status) {
            if (!status) return { isSuccess: true };
            var result =
            {
                isSuccess: status.meta.code === 200, // && status.meta.errors.code === 0,
                errorCode: status.meta.errors.code,
                message: status.meta.message,
                data: status.data.results,
                errorMessage: status.meta.errors.message//,
                //fieldErrors: [],
            };
            /*
            if (status.meta.errors.field) {
                for (var i = 0, len = status.FieldErrors.length; i < len; i++) {
                    var err = status.FieldErrors[i];
                    var error = { errorCode: err.ErrorCode, fieldName: err.FieldName, errorMessage: err.ErrorMessage || '' };
                    result.fieldErrors.push(error);
                    if (error.fieldName) {
                        result.fieldErrorMap[error.fieldName] = error;
                    }
                }
            }
            */
            return result;
        }
        this.Post = function (requestUrl, requestData, onSuccess, onError) {
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
              if (!response) {
                  if (onSuccess) onSuccess(null);
                  return;
              }
              var status = parseResponseStatus(response);
              if (status.isSuccess) {
                  if (onSuccess) onSuccess(response);
              }
              else {
                  if (onError) onError(response);
                  var alertPopup = $ionicPopup.alert({
                      title: response.meta.message,
                      subTitle: response.meta.errors.message,
                      okType: 'button-assertive'
                  });
                  $timeout(function () {
                      alertPopup.close();
                  }, 2500);
              }
            }).error(function (response) {
              try {
                  if (onError) onError(response);
                  var alertPopup = $ionicPopup.alert({
                      title: 'Connect to WebService failed.',
                      okType: 'button-assertive'
                  });
                  $timeout(function () {
                      alertPopup.close();
                  }, 2500);
              }
              catch (e) { }
            });
        };
        this.Get = function (requestUrl, onSuccess, onError, onFinally) {
            var strSignature = hex_md5(strBaseUrl + requestUrl + "?format=json" + strSecretKey.replace(/-/ig, ""));
            $http({
                method: "GET",
                url: strWebServiceURL + strBaseUrl + requestUrl + "?format=json"
                //headers: {
                //    "Signature": strSignature
                //}
            }).success(function (response) {
                if (!response) {
                    if (onSuccess) onSuccess(null);
                    return;
                }
                var status = parseResponseStatus(response);
                if (status.isSuccess) {
                    if (onSuccess) onSuccess(response);
                }
                else {
                    if (onError) onError(response);
                    var alertPopup = $ionicPopup.alert({
                        title: response.meta.message,
                        subTitle: response.meta.errors.message,
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
            }).error(function (response) {
                try {
                    if (onError) onError(response);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Connect to WebService failed.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
                catch (e) { }
            }).finally(function () {
                if (onFinally) onFinally();
            });
        };
        this.GetParam = function (requestUrl, onSuccess, onError, onFinally) {
            var strSignature = hex_md5(strBaseUrl + requestUrl + "&format=json" + strSecretKey.replace(/-/ig, ""));
            $http({
                method: "GET",
                url: strWebServiceURL + strBaseUrl + requestUrl + "&format=json"
                //headers: {
                //    "Signature": strSignature
                //}
            }).success(function (response) {
                if (!response) {
                    if (onSuccess) onSuccess(null);
                    return;
                }
                var status = parseResponseStatus(response);
                if (status.isSuccess) {
                    if (onSuccess) onSuccess(response);
                }
                else {
                    if (onError) onError(response);
                    var alertPopup = $ionicPopup.alert({
                        title: response.meta.message,
                        subTitle: response.meta.errors.message,
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
            }).error(function (response) {
                try {
                    if (onError) onError(response);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Connect to WebService failed.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
                catch (e) { }
            }).finally(function () {
                if (onFinally) onFinally();
            });
        };
    }]);

appService.service('DownloadFileService', ['$http', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaToast', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2',
    function ($http, $timeout, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2) {
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
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
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
