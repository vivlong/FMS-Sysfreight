var appControllers = angular.module('MobileAPP.controllers', [
    'ionic',
    'ionMdInput',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.datePicker',
    'ngCordova.plugins.barcodeScanner',
    'ngCordova.plugins.sms',
    'ngCordova.plugins.actionSheet',
    'MobileAPP.directives',
    'MobileAPP.services',
    'MobileAPP.factories'
]);

appControllers.controller('IndexCtrl',
        ['$scope', '$state', '$http', '$timeout', '$ionicPopup', '$cordovaAppVersion',
        function ($scope, $state, $http, $timeout, $ionicPopup, $cordovaAppVersion) {
            $scope.GoToLogin = function () {
                $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
            };
            $scope.GoToSetting = function () {
                $state.go('setting', {}, { reload: true });
            };
            $scope.GoToUpdate = function () {
                if(blnMobilePlatform){
                    var url = strWebSiteURL + '/update.json';
                    $http.get(url)
                    .success(function (res) {
                            var serverAppVersion = res.version;
                            $cordovaAppVersion.getVersionNumber().then(function (version) {
                                if (version != serverAppVersion) {
                                    $state.go('update', { 'Version': serverAppVersion });
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: "Already the Latest Version!",
                                        okType: 'button-assertive'
                                    });
                                    $timeout(function () {
                                        alertPopup.close();
                                    }, 2500);
                                }
                            });
                        })
                    .error(function (res) {
                        var alertPopup = $ionicPopup.alert({
                            title: "Connect Update Server Error!",
                            okType: 'button-assertive'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                    });
                    //$state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: "Web Platform Not Supported!",
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
            }
        }]);

appControllers.controller('LoadingCtrl',
        ['$state', '$timeout',
        function ($state, $timeout) {
            $timeout(function () {
                $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
            }, 2000);
        }]);

appControllers.controller('LoginCtrl',
        ['$scope', '$http', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaToast', '$cordovaAppVersion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaAppVersion, WebApiService) {
            $scope.logininfo = {
                strUserName: "",
                strPassword: ""
            };
            $scope.GoToUpdate = function () {
                var url = strWebSiteURL + '/update.json';
                $http.get(url)
                .success(function (res) {
                    var serverAppVersion = res.version;
                    $cordovaAppVersion.getVersionNumber().then(function (version) {
                        if (version != serverAppVersion) {
                            $state.go('update', { 'Version': serverAppVersion });
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: "Already the Latest Version!",
                                okType: 'button-assertive'
                            });
                            $timeout(function () {
                                alertPopup.close();
                            }, 2500);
                        }
                    });
                })
                .error(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: "Get Update Info Faild!",
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                });
            };
            $scope.GoToSetting = function () {
                $state.go('setting', {}, { reload: true });
            };
            $scope.login = function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.close();
                }
                if ($scope.logininfo.strUserName == "") {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please Enter User Name.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                    return;
                }
                $ionicLoading.show();
                var strUri = '/api/freight/login/check?UserId=' + $scope.logininfo.strUserName + '&Md5Stamp=' + hex_md5($scope.logininfo.strPassword);
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    sessionStorage.clear();
                    sessionStorage.setItem("UserId", $scope.logininfo.strUserName);
                    //Add JPush RegistradionID
                    if (blnMobilePlatform) {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                    }
                    $state.go('main', {}, { reload: true });
                });
            };
            if ($stateParams.CanCheckUpdate === 'Y') {
                var url = strWebSiteURL + '/update.json';
                $http.get(url)
                .success(function (res) {
                        var serverAppVersion = res.version;
                        $cordovaAppVersion.getVersionNumber().then(function (version) {
                            if (version != serverAppVersion) {
                                $state.go('update', { 'Version': serverAppVersion });
                            }
                        });
                    })
                .error(function (res) {});
            }
            $('#iUserName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $('#iPassword').focus();
                }
            });
            $('#iPassword').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.login();
                }
            });
            $('#iUserName').focus();
        }]);

appControllers.controller('SettingCtrl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaToast', '$cordovaFile',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaFile) {
            $scope.Setting = {
                WebServiceURL: strWebServiceURL.replace('http://', ''),
                BaseUrl: strBaseUrl.replace('/', ''),
                WebSiteUrl: strWebSiteURL.replace('http://', '')
            };
            $scope.returnLogin = function () {
                $state.go('login', { 'CanCheckUpdate': 'Y' }, { reload: true });
            };
            $scope.saveSetting = function () {
                if ($scope.Setting.WebServiceURL.length > 0) {
                    strWebServiceURL = onStrToURL($scope.Setting.WebServiceURL);
                } else { $scope.Setting.WebServiceURL = strWebServiceURL }
                if ($scope.Setting.BaseUrl.length > 0) {
                    strBaseUrl = $scope.Setting.BaseUrl;
                    if (strBaseUrl.length > 0) {
                        strBaseUrl = "/" + strBaseUrl;
                    }
                } else { $scope.Setting.BaseUrl = strBaseUrl }
                if ($scope.Setting.WebSiteUrl.length > 0) {
                    strWebSiteURL = onStrToURL($scope.Setting.WebSiteUrl);
                } else { $scope.Setting.WebSiteUrl = strWebSiteURL }
                var data = 'BaseUrl=' + $scope.Setting.BaseUrl + '##WebServiceURL=' + $scope.Setting.WebServiceURL + '##WebSiteURL=' + strWebSiteURL;
                var path = cordova.file.externalRootDirectory;
                var file = strAppRootPath + "/" + strAppConfigFileName;
                $cordovaFile.writeFile(path, file, data, true)
                .then(function (success) {
                    $state.go('login', { 'CanCheckUpdate': 'Y' }, { reload: true });
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
            $scope.delSetting = function () {
                var path = cordova.file.externalRootDirectory;
                var file = strAppRootPath + "/" + strAppConfigFileName;
                $cordovaFile.removeFile(path, file)
                .then(function (success) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Delete Config File Success.',
                        okType: 'button-calm'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
        }]);

appControllers.controller('UpdateCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', 'DownloadFileService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, DownloadFileService) {
            $scope.strVersion = $stateParams.Version;
            $scope.returnLogin = function () {
                $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
            };
            var onError = function(){
                $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
            };
            $scope.upgrade = function () {
                DownloadFileService.Download('FreightApp.apk', 'application/vnd.android.package-archive', null, onError, onError);
            };
        }]);

appControllers.controller('MainCtrl',
        ['$scope', '$state',
        function ($scope, $state ) {
            $scope.GoToSA = function () {
                $state.go('salesmanActivity', {}, { reload: true });
            };
            $scope.GoToRcbp = function () {
                $state.go('contacts', {}, { reload: true });
            };
            $scope.GoToPa = function () {
                $state.go('paymentApproval', {}, { reload: true });
            };
            $scope.GoToVS = function () {
                $state.go('vesselSchedule', {}, { reload: true });
            };
            $scope.GoToSS = function () {
                $state.go('shipmentStatus', {}, { reload: true });
            };
            $scope.GoToInv = function () {
                $state.go('invoice', {}, { reload: true });
            };
            $scope.GoToBL= function () {
                $state.go('bl', {}, { reload: true });
            };
            $scope.GoToAWB = function () {
                $state.go('awb', {}, { reload: true });
            };
            $scope.GoToSOA = function () {
                $state.go('soa', {}, { reload: true });
            };
            $scope.GoToMemo = function () {
                $state.go('memo', {}, { reload: true });
            };
            $scope.GoToReminder = function () {
                $state.go('reminder', {}, { reload: true });
            };
        }]);

appControllers.controller('SalesmanActivityCtrl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.Rcsm1 = {
                SalesmanNameLike: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                $ionicLoading.show();
                var strUri = '/api/freight/smsa1/count?SalesmanName=' + $scope.Rcsm1.SalesmanNameLike;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    if (result > 0) {
                        $state.go('salesmanActivityList', { 'SalesmanNameLike': $scope.Rcsm1.SalesmanNameLike }, { reload: true });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                                title: 'No Records Found.',
                                okType: 'button-assertive'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                    }
                });
            };
            $('#iSalesmanName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToList();
                }
            });
            $('#iSalesmanName').focus();
        }]);

appControllers.controller('SalesmanActivityListCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$cordovaDialogs', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $cordovaDialogs, WebApiService, CONTACTS_PARAM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.List = {
                SalesmanNameLike:   $stateParams.SalesmanNameLike,
                CanLoadedMoreData:  true
            };
            $scope.returnSearch = function () {
                $state.go('salesmanActivity', {}, {});
            };
            $scope.GoToDetail = function (Smsa1) {
                $state.go('salesmanActivityDetail', { 'TrxNo': Smsa1.TrxNo, 'SalesmanNameLike': $stateParams.SalesmanNameLike }, { reload: true });
            };
            $scope.loadMore = function() {
                var strUri = "/api/freight/smsa1/sps?RecordCount=" + RecordCount;
                if ($scope.List.SalesmanNameLike != null && $scope.List.SalesmanNameLike.length > 0) {
                    strUri = strUri + "&SalesmanName=" + $scope.List.SalesmanNameLike;
                }
                WebApiService.GetParam(strUri).then(function success(result){
                    if(result.length > 0){
                        dataResults = dataResults.concat(result);
                        $scope.Smsa1s = dataResults;
                        $scope.List.CanLoadedMoreData = true;
                        RecordCount = RecordCount + 20;
                    }else{
                        $scope.List.CanLoadedMoreData = false;
                        RecordCount = 0;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        }]);

appControllers.controller('SalesmanActivityDetailCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DateTimeService, WebApiService) {
            $scope.Detail = {
                SalesmanNameLike:   $stateParams.SalesmanNameLike,
                TrxNo:              $stateParams.TrxNo
            };
            $scope.returnList = function () {
                $state.go('salesmanActivityList', { 'SalesmanNameLike':$scope.Detail.SalesmanNameLike }, { reload:true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            var GetSmsa2Detail = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/smsa2/read/" + TrxNo;
                WebApiService.Get(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.Smsa2s = result;
                });
            };
            GetSmsa2Detail($scope.Detail.TrxNo);
        }]);

appControllers.controller('ContactsCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaDialogs', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $cordovaDialogs, WebApiService, CONTACTS_PARAM) {
            $scope.Rcbp = {
                BusinessPartyNameLike: ''
            };
            CONTACTS_PARAM.Init();
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                CONTACTS_PARAM.SetList($scope.Rcbp.BusinessPartyNameLike);
                $state.go('contactsList', { 'BusinessPartyNameLike': $scope.Rcbp.BusinessPartyNameLike }, { reload: true });
            };
            $('#iBusinessPartyName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToList();
                }
            });
            $('#iBusinessPartyName').focus();
        }]);

appControllers.controller('ContactsListCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$cordovaDialogs', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $cordovaDialogs, WebApiService, CONTACTS_PARAM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.ContactsList = CONTACTS_PARAM.GetList();
            if($scope.ContactsList.BusinessPartyNameLike === ''){
                $scope.ContactsList.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
            }
            $scope.ContactsList.CanLoadedMoreData = true;
            $scope.returnSearch = function () {
                $state.go('contacts', {}, {});
            };
            $scope.GoToDetail = function (Rcbp1) {
                CONTACTS_PARAM.SetDetial($scope.ContactsList.BusinessPartyNameLike, Rcbp1.TrxNo);
                $state.go('contactsDetail', { 'TrxNo': Rcbp1.TrxNo, 'BusinessPartyNameLike': $stateParams.BusinessPartyNameLike }, { reload: true });
            };
            $scope.loadMore = function() {
                var strUri = "/api/freight/rcbp1/sps?RecordCount=" + RecordCount;
                if ($scope.ContactsList.BusinessPartyNameLike != null && $scope.ContactsList.BusinessPartyNameLike.length > 0) {
                    strUri = strUri + "&BusinessPartyName=" + $scope.ContactsList.BusinessPartyNameLike;
                }
                WebApiService.GetParam(strUri).then(function success(result){
                    if(result.length > 0){
                        dataResults = dataResults.concat(result);
                        $scope.Rcbp1s = dataResults;
                        RecordCount = RecordCount + 20;
                        $scope.ContactsList.CanLoadedMoreData = true;
                    }else{
                        $scope.ContactsList.CanLoadedMoreData = false;
                        RecordCount = 0;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        }]);

appControllers.controller('ContactsDetailCtrl',
        ['$scope', '$stateParams', '$state', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicModal', '$ionicTabsDelegate',
         '$cordovaActionSheet', '$cordovaToast', '$cordovaSms', 'DateTimeService', 'WebApiService',
         'OpenUrlService', 'CONTACTS_PARAM',
        function ($scope, $stateParams, $state, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, $ionicModal, $ionicTabsDelegate,
             $cordovaActionSheet, $cordovaToast, $cordovaSms, DateTimeService, WebApiService,
             OpenUrlService, CONTACTS_PARAM) {
            $scope.ContactsDetail = CONTACTS_PARAM.GetDetial();
            if($scope.ContactsDetail.TrxNo === ''){
                $scope.ContactsDetail.TrxNo = $stateParams.TrxNo;
            }
            if($scope.ContactsDetail.BusinessPartyNameLike === ''){
                $scope.ContactsDetail.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
            }
            if($scope.ContactsDetail.TabIndex === ''){
                $scope.ContactsDetail.TabIndex = 0;
            }
            $scope.rcbpDetail = {};
            $scope.rcbp3Detail = {};
            $scope.returnList = function () {
                $scope.ContactsList = CONTACTS_PARAM.GetList();
                if($scope.ContactsList.BusinessPartyNameLike === ''){
                    $scope.ContactsList.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
                }
                $state.go('contactsList', { 'BusinessPartyNameLike': $scope.ContactsList.BusinessPartyNameLike }, {});
            };
            $scope.TabClick = function (index) {
                CONTACTS_PARAM.SetIndex(index);
                $scope.ContactsDetail.TabIndex = index;
                if(index === 1){
                    GetRcbp3s($scope.rcbpDetail.BusinessPartyCode);
                };
            };
            $scope.ClickWebUrl = function(url) {
                OpenUrlService.Open(url);
            };
            $scope.ClickSendSMS = function(num) {
                /*
                var options = {
                    title: num,
                    buttonLabels: ['Call', 'Send SMS'],
                    addCancelButtonWithLabel: 'Cancel',
                    androidEnableCancelButton : true,
                    winphoneEnableCancelButton : true
                };
                $cordovaActionSheet.show(options)
                .then(function(btnIndex) {
                    var index = btnIndex;
                    if(index === 2){
                        var options = {
                            replaceLineBreaks: false, // true to replace \n by a new line, false by default
                            android: {
                                intent: 'INTENT'  // send SMS with the native android SMS messaging
                                //intent: '' // send SMS without open any other app
                            }
                        };
                        $cordovaSms.send(num, '', options)
                        .then(function() {
                            $cordovaToast.showShortBottom('Message sent successfully');
                        }, function(error) {
                            $cordovaToast.showShortBottom('Message Failed:' + error);
                        });
                    }else{
                        //$window.location.href = "tel:" + num;
                    }
                });
                */
                var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                        intent: 'INTENT'  // send SMS with the native android SMS messaging
                        //intent: '' // send SMS without open any other app
                    }
                };
                $cordovaSms.send(num, '', options)
                .then(function() {
                    //$cordovaToast.showShortBottom('Message sent successfully');
                }, function(error) {
                    //$cordovaToast.showShortBottom('Message Failed:' + error);
                });
            };
            $scope.GoToDetailEdit = function () {
                $state.go('contactsDetailEdit', { 'TrxNo': $scope.ContactsDetail.TrxNo }, { reload: true });
            };
            $scope.GoToContactInfo = function (rcbp3) {
                $state.go('contactsInfo', { 'BusinessPartyCode': rcbp3.BusinessPartyCode, 'LineItemNo': rcbp3.LineItemNo }, { reload: true });
            };
            $scope.GoToContactEdit = function (rcbp3) {
                $state.go('contactsInfoEdit', { 'BusinessPartyCode': rcbp3.BusinessPartyCode, 'LineItemNo': rcbp3.LineItemNo }, { reload: true });
            };
            $scope.GoToContactDel = function (index,rcbp3) {
                var strUri = "/api/freight/rcbp3/delete?BusinessPartyCode=" + rcbp3.BusinessPartyCode + "&LineItemNo=" + rcbp3.LineItemNo;
                WebApiService.GetParam(strUri).then(function success(result){
                    if(result > 0){
                        $scope.rcbp3s.splice(index, 1);
                    }
                });
            };
            $scope.GoToContactAdd = function (rcbp3) {
                $state.go('contactsInfoAdd', { 'BusinessPartyCode': $scope.rcbpDetail.BusinessPartyCode, 'LineItemNo': rcbp3.length + 1 }, { reload: true });
            };
            $scope.blnContainNameCard = function (rcbp3) {
                if (typeof (rcbp3) == "undefined") return false;
                if (typeof (rcbp3.NameCard) == "undefined") return false;
                if (rcbp3.NameCard.length > 0) {
                    return true;
                } else { return false; }
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                var strUri = "/api/freight/rcbp3?BusinessPartyCode=" + BusinessPartyCode;
                WebApiService.GetParam(strUri).then(function success(result){
                    $scope.rcbp3s = result;
                });
            };
            var GetRcbp1 = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1/TrxNo/" + TrxNo;
                WebApiService.Get(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.rcbpDetail = result[0];
                }, function error(error) {
                    $ionicLoading.hide();
                });
            };
            GetRcbp1($scope.ContactsDetail.TrxNo);
        }]);

appControllers.controller('ContactsDetailEditCtrl',
        ['$scope', '$stateParams', '$state', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $stateParams, $state, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.rcbpDetail = {
                TrxNo: $stateParams.TrxNo
            };
            $scope.rcbp3Detail = {};
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo': $scope.rcbpDetail.TrxNo }, { reload: true });
            };
            $scope.returnUpdateRcbp1 = function () {
                $ionicLoading.show();
                var jsonData = { "rcbp1": $scope.rcbpDetail };
                var strUri = "/api/freight/rcbp1";
                WebApiService.Post(strUri, jsonData).then(function success(result){
                    $ionicLoading.hide();
                    $scope.returnDetail();
                });
            };
            var GetRcbp1Detail = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1/trxno/" + TrxNo;
                WebApiService.Get(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.rcbpDetail = result[0];
                });
            };
            GetRcbp1Detail($scope.rcbpDetail.TrxNo);
        }]);

appControllers.controller('ContactsInfoCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService, CONTACTS_PARAM) {
            $scope.rcbp3Detail = {};
            var BusinessPartyCode = $stateParams.BusinessPartyCode;
            var LineItemNo = $stateParams.LineItemNo;
            $scope.returnDetail = function () {
                $scope.ContactsDetail = CONTACTS_PARAM.GetDetial();
                $state.go('contactsDetail', { 'TrxNo':$scope.ContactsDetail.TrxNo, 'BusinessPartyNameLike':$scope.ContactsDetail.BusinessPartyNameLike}, { reload: true });
            };
            var GetRcbp3s = function () {
                $ionicLoading.show();
                var strUri = '/api/freight/rcbp3?BusinessPartyCode=' + BusinessPartyCode + '&LineItemNo=' + LineItemNo;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.rcbp3Detail = result[0];
                });
            };
            GetRcbp3s();
        }]);

appControllers.controller('ContactsInfoAddCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService, CONTACTS_PARAM) {
            $scope.rcbp3Detail = {
                BusinessPartyCode : $stateParams.BusinessPartyCode,
                LineItemNo : $stateParams.LineItemNo,
                ContactName : '',
                Department : '',
                Dislike : '',
                Email : '',
                Facebook : '',
                Fax : '',
                Handphone : '',
                Like : '',
                MSN : '',
                Others : '',
                QQ : '',
                Skype : '',
                Telephone : '',
                Title : '',
                Twitter : ''
            };
            $scope.returnDetail = function () {
                $scope.ContactsDetail = CONTACTS_PARAM.GetDetial();
                $state.go('contactsDetail', { 'TrxNo':$scope.ContactsDetail.TrxNo, 'BusinessPartyNameLike':$scope.ContactsDetail.BusinessPartyNameLike}, { reload: true });
            };
            $scope.returnInsertRcbp3 = function () {
                $ionicLoading.show();
                var jsonData = { "rcbp3": $scope.rcbp3Detail };
                var strUri = "/api/freight/rcbp3";
                WebApiService.Post(strUri, jsonData).then(function success(result){
                    $ionicLoading.hide();
                    $scope.returnDetail();
                });
            };
        }]);

appControllers.controller('ContactsInfoEditCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService', 'CONTACTS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService, CONTACTS_PARAM) {
            $scope.rcbp3Detail = {};
            var BusinessPartyCode = $stateParams.BusinessPartyCode;
            var LineItemNo = $stateParams.LineItemNo;
            $scope.returnDetail = function () {
                $scope.ContactsDetail = CONTACTS_PARAM.GetDetial();
                $state.go('contactsDetail', { 'TrxNo':$scope.ContactsDetail.TrxNo, 'BusinessPartyNameLike':$scope.ContactsDetail.BusinessPartyNameLike}, { reload: true });
            };
            $scope.returnUpdateRcbp3 = function () {
                $ionicLoading.show();
                var jsonData = { "rcbp3": $scope.rcbp3Detail };
                var strUri = "/api/freight/rcbp3/update";
                WebApiService.Post(strUri, jsonData).then(function success(result){
                    $ionicLoading.hide();
                    $scope.returnDetail();
                });
            };
            var GetRcbp3s = function () {
                $ionicLoading.show();
                var strUri = '/api/freight/rcbp3?BusinessPartyCode=' + BusinessPartyCode + '&LineItemNo=' + LineItemNo;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.rcbp3Detail = result[0];
                });
            };
            GetRcbp3s();
        }]);

appControllers.controller('PaymentApprovalCtrl',
        ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.PA = {
                VoucherNo: '',
                VendorName: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function (TypeName) {
                var FilterName = '';
                var FilterValue = '';
                if (TypeName === 'Voucher No') { FilterValue = $scope.PA.VoucherNo; FilterName = 'VoucherNo'}
                else if (TypeName === 'Vendor Name') { FilterValue = $scope.PA.VendorName; FilterName = 'VendorName'}
                $state.go('paymentApprovalList', { 'FilterName':FilterName, 'FilterValue':FilterValue }, {reload: true});
            };
            $('#iVoucherNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToList('Voucher No');
                }
            });
            $('#iVendorName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToList('Vendor Name');
                }
            });
        }]);

appControllers.controller('PaymentApprovalListCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, DateTimeService, WebApiService) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.Filter = {
                FilterName:         $stateParams.FilterName,
                FilterValue:        $stateParams.FilterValue,
                CanLoadedMoreData:  true,
                IsSelectAll:          false
            };
            $scope.plcpStatus = { text: "USE", checked: false };
            $scope.returnSearch = function () {
                $state.go('paymentApproval', {}, {});
            };
            $scope.funcShowDate = function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.showApproval = function () {
                var blnSelect = false;
                for(var index in $scope.Plcp1s){
                    if($scope.Plcp1s[index].IsSelected){
                        blnSelect = true;
                        break;
                    }
                }
                if(blnSelect){
                    $ionicLoading.show();
                    var jsonData = { "plcp1s": $scope.Plcp1s };
                    var strUri = "/api/freight/plcp1";
                    WebApiService.post(strUri, jsonData).then(function success(result){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: "Approval Success!",
                            okType: 'button-calm'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                        for(i=0;i<=$scope.Plcp1s.length -1;i++){
                            if($scope.Plcp1s[i].StatusCode === 'APP'){
                                $scope.Plcp1s.splice(i, 1);
                            }
                        }
                    },function error(error){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: "Approval Faild",
                            okType: 'button-assertive'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                    });
                }
            };
            $scope.plcpStatusChange = function () {
                if ($scope.plcpStatus.checked) {
                    $scope.plcpStatus.text = "APP";
                } else {
                    $scope.plcpStatus.text = "USE";
                }
                RecordCount = 0;
                dataResults = new Array();
                $scope.Filter.CanLoadedMoreData = true;
                $scope.Plcp1s = dataResults;
                $scope.loadMore();
            };
            $scope.ClickSelect = function(Plcp1) {
                if(Plcp1.IsSelected){
                    Plcp1.StatusCode = 'APP';
                } else {
                    Plcp1.StatusCode = 'USE';
                }
            };
            $scope.ClickSelectAll = function() {
                if($scope.Plcp1s != null && $scope.Plcp1s.length > 0){
                    $scope.Filter.IsSelectAll = !$scope.Filter.IsSelectAll;
                    if($scope.Filter.IsSelectAll){
                        $scope.Plcp1s.forEach( function(plcp1) { plcp1.IsSelected = true;plcp1.StatusCode = 'APP'; });
                    }else{
                        $scope.Plcp1s.forEach( function(plcp1) { plcp1.IsSelected = false;plcp1.StatusCode = 'USE' });
                    }
                }
            };
            $scope.loadMore = function() {
                var strUri = "/api/freight/plcp1/sps?RecordCount=" + RecordCount + "&StatusCode=" + $scope.plcpStatus.text
                if ($scope.Filter.FilterValue != null && $scope.Filter.FilterValue.length > 0) {
                    if($scope.Filter.FilterName === "VoucherNo"){
                        strUri = strUri + "&VoucherNo=" + $scope.Filter.FilterValue;
                    }else{
                        strUri = strUri + "&VendorName=" + $scope.Filter.FilterValue;
                    }
                }
                WebApiService.GetParam(strUri).then(function success(result){
                    if(result.length > 0){
                        dataResults = dataResults.concat(result);
                        $scope.Plcp1s = dataResults;
                        $scope.Filter.CanLoadedMoreData = true;
                        RecordCount = RecordCount + 20;
                    }else{
                        $scope.Filter.CanLoadedMoreData = false;
                        RecordCount = 0;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        }]);

appControllers.controller('VesselScheduleCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.rcvy = {
                PortOfDischargeName: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToDetail = function (PortOfDischargeName) {
                $state.go('vesselScheduleDetail', { 'PortOfDischargeName': PortOfDischargeName }, { reload: true });
            };
            $('#txt-PortOfDischargeName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    getRcvy1($scope.rcvy.PortOfDischargeName);
                }
            });
            var getRcvy1 = function (PortOfDischargeName) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcvy1";
                if (PortOfDischargeName != null && PortOfDischargeName.length > 0) {
                    strUri = strUri + "?PortOfDischargeName=" + PortOfDischargeName;
                    WebApiService.Get(strUri).then(function success(result){
                        $ionicLoading.hide();
                        $scope.PortOfDischargeNames = result;
                    });
                } else {
                    WebApiService.Get(strUri).then(function success(result){
                        $ionicLoading.hide();
                        $scope.PortOfDischargeNames = result;
                    });
                }
            };
            getRcvy1(null);
        }]);

appControllers.controller('VesselScheduleDetailCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DateTimeService, WebApiService) {
            $scope.Rcvy1Detail = {
                PortOfDischargeName : $stateParams.PortOfDischargeName
            };
            $scope.returnList = function () {
                $state.go('vesselSchedule', {}, {});
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };$scope.ShowDatetime= function (utc) {
                return DateTimeService.ShowDatetime(utc);
            };
            var getRcvy1 = function (PortOfDischargeName) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcvy1/sps?PortOfDischargeName=" + PortOfDischargeName;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.Rcvy1s = result;
                });
            };
            getRcvy1($scope.Rcvy1Detail.PortOfDischargeName);
        }]);

appControllers.controller('ShipmentStatusCtrl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService', 'SHIPMENTSTATUS_PARAM',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, WebApiService, SHIPMENTSTATUS_PARAM) {
            $scope.Tracking = {
                ContainerNo: '',
                JobNo: '',
                BLNo: '',
                AWBNo: '',
                OrderNo: '',
                ReferenceNo: ''
            };
            SHIPMENTSTATUS_PARAM.Init('','');
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            var getSearchResult = function (FilterName, FilterValue) {
                $ionicLoading.show();
                var strUri = '/api/freight/tracking/count?FilterName=' + FilterName + '&FilterValue=' + FilterValue;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    if (result > 1) {
                        SHIPMENTSTATUS_PARAM.SetList(FilterName, FilterValue);
                        $state.go('shipmentStatusList', { 'FilterName':FilterName, 'FilterValue':FilterValue }, { reload: true });
                    } else if (result === 1) {
                        $ionicLoading.show();
                        if (FilterName === 'OrderNo') {
                            SHIPMENTSTATUS_PARAM.SetDetial(FilterName, FilterValue, '4');
                            $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'FilterValue':FilterValue, 'ModuleCode':'4' }, { reload: true });
                        } else{
                            strUri = '/api/freight/tracking/sps?FilterName=' + FilterName + '&RecordCount=0&FilterValue=' + FilterValue;
                            WebApiService.GetParam(strUri).then(function success(result){
                                if(result.length > 0){
                                    SHIPMENTSTATUS_PARAM.SetDetial(FilterName, result[0].JobNo, result[0].ModuleCode);
                                    $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'FilterValue':result[0].JobNo, 'ModuleCode':result[0].ModuleCode }, { reload: true });
                                }
                            });
                        }
                    } else {
                        var alertPopup = $ionicPopup.alert({
                                title: 'No Records Found.',
                                okType: 'button-assertive'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                    }
                });
            };
            $scope.GoToDetail = function (TypeName) {
                var FilterName = '';
                var FilterValue = '';
                if (TypeName === 'Container No') { FilterValue = $scope.Tracking.ContainerNo; FilterName = 'ContainerNo'}
                else if (TypeName === 'Job No') { FilterValue = $scope.Tracking.JobNo; FilterName = 'JobNo'}
                else if (TypeName === 'BL No') { FilterValue = $scope.Tracking.BLNo; FilterName = 'BlNo'}
                else if (TypeName === 'AWB No') { FilterValue = $scope.Tracking.AWBNo; FilterName = 'AwbNo'}
                else if (TypeName === 'Order No') { FilterValue = $scope.Tracking.OrderNo; FilterName = 'OrderNo'}
                else if (TypeName === 'Reference No') { FilterValue = $scope.Tracking.ReferenceNo; FilterName = 'CustomerRefNo'}
                if (FilterValue.length > 0) {
                    getSearchResult(FilterName, FilterValue);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: TypeName + ' is Empty.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
            };
            $('#iContainerNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('Container No');
                }
            });
            $('#iJobNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('Job No');
                }
            });
            $('#iBLNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('BL No');
                }
            });
            $('#iAWBNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('AWB No');
                }
            });
            $('#iOrderNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('Order No');
                }
            });
            $('#iReferenceNo').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToDetail('Reference No');
                }
            });
        }]);

appControllers.controller('ShipmentStatusListCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService', 'SHIPMENTSTATUS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DateTimeService, WebApiService, SHIPMENTSTATUS_PARAM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.Filter = SHIPMENTSTATUS_PARAM.GetList();
            $scope.List = {
                moreDataCanBeLoaded: true
            };
            if($scope.Filter.FilterName === ""){
                $scope.Filter.FilterName = $stateParams.FilterName;
                $scope.Filter.FilterValue = $stateParams.FilterValue;
            }
            $scope.returnShipmentStatus = function () {
                $state.go('shipmentStatus', {}, {});
            };
            $scope.GoToDetail = function (Jmjm1) {
                SHIPMENTSTATUS_PARAM.SetDetial($scope.Filter.FilterName, Jmjm1.JobNo, Jmjm1.ModuleCode)
                $state.go('shipmentStatusDetail', { 'FilterName':$scope.Filter.FilterName, 'FilterValue':Jmjm1.JobNo, 'ModuleCode':Jmjm1.ModuleCode }, { reload: true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.ShowDatetime= function (utc) {
                return DateTimeService.ShowDatetime(utc);
            };
            $scope.funcShowLabel = function(FilterName){
                if(FilterName === $scope.Filter.FilterName){
                    return true;
                }else { return false; }
            };
            $scope.funcLoadMore = function() {
                var strUri = '/api/freight/tracking/sps?FilterName=' + $scope.Filter.FilterName + '&RecordCount=' + RecordCount + '&FilterValue=' + $scope.Filter.FilterValue;
                WebApiService.GetParam(strUri).then(function success(result){
                    if(result.length > 0){
                        dataResults = dataResults.concat(result);
                        $scope.Jmjm1s = dataResults;
                        $scope.List.moreDataCanBeLoaded = true;
                        RecordCount = RecordCount + 20;
                    }else{
                        $scope.List.moreDataCanBeLoaded = false;
                        RecordCount = 0;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        }]);

appControllers.controller('ShipmentStatusDetailCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService', 'SHIPMENTSTATUS_PARAM',
        function ($scope, $state, $stateParams, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, DateTimeService, WebApiService, SHIPMENTSTATUS_PARAM) {
            $scope.Detail = SHIPMENTSTATUS_PARAM.GetDetial();
            if($scope.Detail.FilterName === ""){
                $scope.Detail.FilterName = $stateParams.FilterName;
                $scope.Detail.FilterValue = $stateParams.FilterValue;
                $scope.Detail.ModuleCode = $stateParams.ModuleCode;
            }
            $scope.returnList = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }else{
                    $state.go('shipmentStatus', {}, {});
                }
            };
            $scope.ShowDate = function(utc){
                return DateTimeService.ShowDate(utc);
            };
            $scope.ShowDatetime = function(utc){
                return DateTimeService.ShowDatetime(utc);
            };
            $scope.funcShowLabel = function(FilterName){
                if(FilterName === $scope.Detail.FilterName){
                    return true;
                }else { return false; }
            };
            var strUri = '';
            var onSuccess = null;
            var onError = function (response) {
            };
            var onFinally = function (response) {
                $ionicLoading.hide();
            };
            if($scope.Detail.FilterName === 'OrderNo'){
                var getOmtx1 = function (FilterName, FilterValue) {
                    $ionicLoading.show();
                    strUri = '/api/freight/tracking?FilterName=' + FilterName + '&FilterValue=' + FilterValue;
                    WebApiService.GetParam(strUri).then(function success(result){
                        $ionicLoading.hide();
                        $scope.Omtx1s = result;
                    });
                };
                getOmtx1($scope.Detail.FilterName, $scope.Detail.FilterValue);
            }else{
                var getJmjm1 = function (FilterName, FilterValue, ModuleCode) {
                    $ionicLoading.show();
                    strUri = '/api/freight/tracking?FilterName=' + FilterName + '&ModuleCode=' + ModuleCode + '&FilterValue=' + FilterValue;
                    WebApiService.GetParam(strUri).then(function success(result){
                        $ionicLoading.hide();
                        $scope.Jmjm1s = result;
                    });
                };
                getJmjm1($scope.Detail.FilterName, $scope.Detail.FilterValue, $scope.Detail.ModuleCode);
            }
        }]);

appControllers.controller('InvoiceCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function () {
                DownloadFileService.Download('INVOICE.pdf', 'application/pdf', onPlatformError, null, null);
            };
        }]);

appControllers.controller('BlCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function () {
                DownloadFileService.Download('HOUSE-BL.pdf', 'application/pdf', onPlatformError, null, null);
            };
        }]);

appControllers.controller('AwbCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function () {
                DownloadFileService.Download('AWB.pdf', 'application/pdf', onPlatformError, null, null);
            };
        }]);

appControllers.controller('SOACtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function () {
                DownloadFileService.Download('CUSTOMER-STATEMENT.pdf', 'application/pdf', onPlatformError, null, null);
            };
        }]);

appControllers.controller('MemoCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.Saus1 = {
                UserID: sessionStorage.getItem("UserId"),
                Memo :  ''
            };
            if($scope.Saus1.UserID === null){ $scope.Saus1.UserID='s'; }
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.returnUpdateMemo = function(){
                $ionicLoading.show();
                var jsonData = { "saus1": $scope.Saus1 };
                var strUri = "/api/freight/saus1/memo";
                WebApiService.Post(strUri, jsonData).then(function success(result){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: "Save Success!",
                        okType: 'button-calm'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                });
            };
            var GetSaus1 = function (uid) {
                $ionicLoading.show();
                var strUri = "/api/freight/saus1/memo?userID=" + uid;
                WebApiService.GetParam(strUri).then(function success(result){
                    $ionicLoading.hide();
                    $scope.Saus1.Memo = result;
                });
            };
            GetSaus1($scope.Saus1.UserID);
        }]);

appControllers.controller('ReminderCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicPopup, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { id: 1, Subject: 'Payment Voucher need Approve', Message: 'Please help to approve the ref no : PV15031841', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 14,2015', DueTime: '11:20' },
                { id: 2, Subject: 'Email to Henry', Message: 'Need email to henry for the new request for the mobile at the monring.', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 16,2015', DueTime: '09:20' }
            ];
        }]);
