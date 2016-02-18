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
        ['$scope', '$state', '$http', '$ionicPopup', '$cordovaAppVersion',
        function ($scope, $state, $http, $ionicPopup, $cordovaAppVersion) {
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
                                }
                            });
                        })
                    .error(function (res) {
                        var alertPopup = $ionicPopup.alert({
                            title: "Connect Update Server Error!",
                            okType: 'button-assertive'
                        });
                    });
                    //$state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: "Web Platform Not Supported!",
                        okType: 'button-assertive'
                    });
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
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$cordovaToast', '$cordovaAppVersion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $cordovaToast, $cordovaAppVersion, WebApiService) {
            $scope.logininfo = {
                strUserName: '',
                strPassword: ''
            };
            var alertPopup = null;
            $scope.login = function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.close();
                }
                if ($scope.logininfo.strUserName == "") {
                    alertPopup = $ionicPopup.alert({
                        title: 'Please Enter User Name.',
                        okType: 'button-assertive'
                    });
                    alertPopup.then(function(res) {
                        console.log('Please Enter User Name.');
                    });
                }else{
                    var strUri = '/api/freight/login/check?UserId=' + $scope.logininfo.strUserName + '&Md5Stamp=' + hex_md5($scope.logininfo.strPassword);
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        if(result.data.results>0){
                            sessionStorage.clear();
                            sessionStorage.setItem("UserId", $scope.logininfo.strUserName);
                            //Add JPush RegistradionID
                            if (blnMobilePlatform) {
                                window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                            }
                            $state.go('main', {}, { reload: true });
                        }else{
                            alertPopup = $ionicPopup.alert({
                                title: 'Invaild User',
                                okType: 'button-assertive'
                            });
                            alertPopup.then(function(res) {
                                console.log('Invaild User');
                            });
                        }
                    });
                }
            };
            if (!blnMobilePlatform && $stateParams.CanCheckUpdate === 'Y') {
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
                    if(alertPopup === null){
                        $scope.login();
                    }else{
                        alertPopup.close();
                        alertPopup = null;
                    }
                }
            });
            $('#iUserName').focus();
        }]);

appControllers.controller('SettingCtrl',
        ['$scope', '$state', '$ionicPopup', '$cordovaToast', '$cordovaFile',
        function ($scope, $state, $ionicPopup, $cordovaToast, $cordovaFile) {
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
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
        }]);

appControllers.controller('UpdateCtrl',
        ['$scope', '$state', '$stateParams', 'DownloadFileService',
        function ($scope, $state, $stateParams, DownloadFileService) {
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
        ['$scope', '$state', '$ionicPopup', 'WebApiService', 'SALESMANACTIVITY_ORM',
        function ($scope, $state, $ionicPopup, WebApiService, SALESMANACTIVITY_ORM) {
            $scope.Rcsm1 = {
                SalesmanNameLike: SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike
            };
            var alertPopup = null;
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                if (SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike != $scope.Rcsm1.SalesmanNameLike) {
                    SALESMANACTIVITY_ORM.init();
                    SALESMANACTIVITY_ORM.SEARCH._setKey($scope.Rcsm1.SalesmanNameLike);
                    var strUri = '/api/freight/smsa1/count?SalesmanName=' + $scope.Rcsm1.SalesmanNameLike;
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        if (result.data.results > 0) {
                            $state.go('salesmanActivityList', { 'SalesmanNameLike': $scope.Rcsm1.SalesmanNameLike }, { reload: true });
                        } else {
                            alertPopup = $ionicPopup.alert({
                                    title: 'No Records Found.',
                                    okType: 'button-assertive'
                            });
                        }
                    });
                } else {
                    if(SALESMANACTIVITY_ORM.LIST.Smsa1s.length > 0){
                        $state.go('salesmanActivityList', { 'SalesmanNameLike': $scope.Rcsm1.SalesmanNameLike }, { reload: true });
                    } else {
                        alertPopup = $ionicPopup.alert({
                                title: 'No Records Found.',
                                okType: 'button-assertive'
                        });
                    }
                }
            };
            $('#iSalesmanName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    if(alertPopup === null){
                        $scope.GoToList();
                    }else{
                        alertPopup.close();
                        alertPopup = null;
                    }
                }
            });
            //$('#iSalesmanName').focus();
        }]);

appControllers.controller('SalesmanActivityListCtrl',
        ['$scope', '$state', '$stateParams', 'WebApiService', 'SALESMANACTIVITY_ORM',
        function ($scope, $state, $stateParams, WebApiService, SALESMANACTIVITY_ORM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.List = {
                SalesmanNameLike:   SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike,
                CanLoadedMoreData:  true
            };
            if($scope.List.SalesmanNameLike === ''){
                $scope.List.SalesmanNameLike = $stateParams.SalesmanNameLike;
            }
            $scope.returnSearch = function () {
                $state.go('salesmanActivity', {}, {});
            };
            $scope.GoToDetail = function (Smsa1) {
                SALESMANACTIVITY_ORM.DETAIL._setKey(Smsa1.TrxNo);
                $state.go('salesmanActivityDetail', { 'TrxNo': Smsa1.TrxNo, 'SalesmanNameLike': $scope.List.SalesmanNameLike }, { reload: true });
            };
            $scope.loadMore = function() {
                if (SALESMANACTIVITY_ORM.LIST.Smsa1s != null && SALESMANACTIVITY_ORM.LIST.Smsa1s.length > 0) {
                    $scope.Smsa1s = SALESMANACTIVITY_ORM.LIST.Smsa1s;
                    $scope.List.CanLoadedMoreData = false;
                } else {
                    var strUri = "/api/freight/smsa1/sps?RecordCount=" + RecordCount;
                    if ($scope.List.SalesmanNameLike != null && $scope.List.SalesmanNameLike.length > 0) {
                        strUri = strUri + "&SalesmanName=" + $scope.List.SalesmanNameLike;
                    }
                    WebApiService.GetParam(strUri, false).then(function success(result){
                        if(result.data.results.length > 0){
                            dataResults = dataResults.concat(result.data.results);
                            $scope.Smsa1s = dataResults;
                            $scope.List.CanLoadedMoreData = true;
                            RecordCount = RecordCount + 20;
                            SALESMANACTIVITY_ORM.LIST._setObj($scope.Smsa1s);
                        }else{
                            $scope.List.CanLoadedMoreData = false;
                            RecordCount = 0;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            };
        }]);

appControllers.controller('SalesmanActivityDetailCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'WebApiService', 'SALESMANACTIVITY_ORM',
        function ($scope, $state, $stateParams, DateTimeService, WebApiService, SALESMANACTIVITY_ORM) {
            $scope.Detail = {
                TrxNo : SALESMANACTIVITY_ORM.DETAIL.TrxNo
            };
            if($scope.Detail.TrxNo === ''){
                $scope.Detail.TrxNo = $stateParams.TrxNo;
            }
            $scope.returnList = function () {
                $state.go('salesmanActivityList', { 'SalesmanNameLike':SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike }, { reload:true });
            };
            $scope.GoToAdd = function () {
                $state.go('salesmanActivityDetailAdd', { 'TrxNo':$scope.Detail.TrxNo, 'LineItemNo':$scope.Smsa2s.length+1 }, { reload:true });
            };
            $scope.GoToEdit = function (Smsa2) {
                if(Smsa2 != SALESMANACTIVITY_ORM.SUBDETAIL.Smsa2){
                    SALESMANACTIVITY_ORM.SUBDETAIL._setObj(Smsa2);
                }
                $state.go('salesmanActivityDetailEdit', { 'TrxNo':$scope.Detail.TrxNo,'LineItemNo':Smsa2.LineItemNo }, { reload:true });
            };
            $scope.GoToDel = function () {
                //
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            var GetSmsa2Detail = function (TrxNo) {
                if (SALESMANACTIVITY_ORM.DETAIL.Smsa2s != null && SALESMANACTIVITY_ORM.DETAIL.Smsa2s.length > 0 && SALESMANACTIVITY_ORM.DETAIL.TrxNo === parseInt(TrxNo)) {
                    $scope.Smsa2s = SALESMANACTIVITY_ORM.DETAIL.Smsa2s;
                } else {
                    var strUri = "/api/freight/smsa2/read?TrxNo=" + TrxNo;
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        $scope.Smsa2s = result.data.results;
                        SALESMANACTIVITY_ORM.DETAIL._setKey(TrxNo);
                        SALESMANACTIVITY_ORM.DETAIL._setObj($scope.Smsa2s);
                    });
                }
            };
            GetSmsa2Detail($scope.Detail.TrxNo);
        }]);

appControllers.controller('SalesmanActivityDetailEditCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'WebApiService', 'SALESMANACTIVITY_ORM',
        function ($scope, $state, $stateParams, DateTimeService, WebApiService, SALESMANACTIVITY_ORM) {
            $scope.Smsa2 = SALESMANACTIVITY_ORM.SUBDETAIL.Smsa2;
            $scope.returnDetail = function () {
                $state.go('salesmanActivityDetail', { 'TrxNo': $scope.Smsa2.TrxNo, 'SalesmanNameLike': SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike }, { reload:true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.returnUpdateSmsa2 = function () {
                var jsonData = { "smsa2": $scope.Smsa2 };
                var strUri = "/api/freight/smsa2/update";
                WebApiService.Post(strUri, jsonData, true).then(function success(result){
                    $scope.returnDetail();
                });
            };
        }]);

appControllers.controller('SalesmanActivityDetailAddCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'WebApiService', 'SALESMANACTIVITY_ORM',
        function ($scope, $state, $stateParams, DateTimeService, WebApiService, SALESMANACTIVITY_ORM) {
            var currentDate = new Date();
            $scope.smsa2 = {
                TrxNo           : $stateParams.TrxNo,
                LineItemNo      : $stateParams.LineItemNo,
                Action          : '',
                Conclusion      : '',
                CustomerCode    : '',
                CustomerName    : '',
                DateTime        : currentDate.Format('dd-NNN-yyyy'),
                Description     : '',
                Discussion      : '',
                QuotationNo     : '',
                Reference       : '',
                Remark          : '',
                Status          : ''
            };
            $scope.returnDetail = function () {
                $state.go('salesmanActivityDetail', { 'TrxNo': $scope.smsa2.TrxNo, 'SalesmanNameLike': SALESMANACTIVITY_ORM.SEARCH.SalesmanNameLike }, { reload:true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.returnInsertSmsa2 = function () {
                var jsonData = { "smsa2": $scope.smsa2 };
                var strUri = "/api/freight/smsa2/create";
                WebApiService.Post(strUri, jsonData, true).then(function success(result){
                    if (SALESMANACTIVITY_ORM.DETAIL.Smsa2s != null && SALESMANACTIVITY_ORM.DETAIL.Smsa2s.length > 0) {
                        SALESMANACTIVITY_ORM.DETAIL.Smsa2s.push($scope.smsa2);
                    } else {
                        var arrSmsa2s=[];
                        arrSmsa2s.push($scope.smsa2);
                        SALESMANACTIVITY_ORM.DETAIL._setObj(arrSmsa2s);
                    }
                    $scope.returnDetail();
                });
            };
        }]);

appControllers.controller('ContactsCtrl',
        ['$scope', '$state', '$stateParams', 'CONTACTS_ORM',
        function ($scope, $state, $stateParams, CONTACTS_ORM) {
            $scope.Rcbp = {
                BusinessPartyNameLike: CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                if(CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike != $scope.Rcbp.BusinessPartyNameLike){
                    CONTACTS_ORM.init();
                    CONTACTS_ORM.CONTACTS_SEARCH._set($scope.Rcbp.BusinessPartyNameLike);
                }
                $state.go('contactsList', { 'BusinessPartyNameLike': $scope.Rcbp.BusinessPartyNameLike }, { reload: true });
            };
            $('#iBusinessPartyName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    $scope.GoToList();
                }
            });
            //$('#iBusinessPartyName').focus();
        }]);

appControllers.controller('ContactsListCtrl',
        ['$scope', '$state', '$stateParams', '$ionicScrollDelegate', 'WebApiService', 'CONTACTS_ORM',
        function ($scope, $state, $stateParams, $ionicScrollDelegate, WebApiService, CONTACTS_ORM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.ContactsList = {
                BusinessPartyNameLike : CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike,
                CanLoadedMoreData :     true
            };
            if($scope.ContactsList.BusinessPartyNameLike === ''){
                $scope.ContactsList.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
            }
            $scope.returnSearch = function () {
                $state.go('contacts', {}, {});
            };
            $scope.GoToDetail = function (Rcbp1) {
                CONTACTS_ORM.CONTACTS_DETAIL._setId(Rcbp1.TrxNo);
                $state.go('contactsDetail', { 'TrxNo': Rcbp1.TrxNo, 'BusinessPartyNameLike': $scope.ContactsList.BusinessPartyNameLike }, { reload: true });
            };
            $scope.loadMore = function() {
                if(CONTACTS_ORM.CONTACTS_LIST.Rcbp1s != null && CONTACTS_ORM.CONTACTS_LIST.Rcbp1s.length > 0){
                    $scope.Rcbp1s = CONTACTS_ORM.CONTACTS_LIST.Rcbp1s;
                    $scope.ContactsList.CanLoadedMoreData = false;
                }
                else{
                    var strUri = "/api/freight/rcbp1/sps?RecordCount=" + RecordCount;
                    if ($scope.ContactsList.BusinessPartyNameLike != null && $scope.ContactsList.BusinessPartyNameLike.length > 0) {
                        strUri = strUri + "&BusinessPartyName=" + $scope.ContactsList.BusinessPartyNameLike;
                    }
                    WebApiService.GetParam(strUri, false).then(function success(result){
                        if(result.data.results.length > 0){
                            dataResults = dataResults.concat(result.data.results);
                            $scope.Rcbp1s = dataResults;
                            $scope.ContactsList.CanLoadedMoreData = true;
                            RecordCount = RecordCount + 20;
                            CONTACTS_ORM.CONTACTS_LIST._set($scope.Rcbp1s);
                        }else{
                            $scope.ContactsList.CanLoadedMoreData = false;
                            RecordCount = 0;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            };
        }]);

appControllers.controller('ContactsDetailCtrl',
        ['$scope', '$stateParams', '$state', '$ionicTabsDelegate', '$ionicPopup',
         '$cordovaActionSheet', '$cordovaToast', '$cordovaSms', 'DateTimeService', 'WebApiService',
         'OpenUrlService', 'CONTACTS_ORM',
        function ($scope, $stateParams, $state, $ionicTabsDelegate, $ionicPopup,
             $cordovaActionSheet, $cordovaToast, $cordovaSms, DateTimeService, WebApiService,
             OpenUrlService, CONTACTS_ORM) {
            $scope.ContactsDetail = {
                TrxNo :     CONTACTS_ORM.CONTACTS_DETAIL.TrxNo,
                TabIndex :  CONTACTS_ORM.CONTACTS_DETAIL.TabIndex
            };
            if($scope.ContactsDetail.TrxNo === ''){
                $scope.ContactsDetail.TrxNo = $stateParams.TrxNo;
            }
            $scope.returnList = function () {
                $state.go('contactsList', { 'BusinessPartyNameLike': CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike }, {});
            };
            $scope.TabClick = function (index) {
                $scope.ContactsDetail.TabIndex = index;
                CONTACTS_ORM.CONTACTS_DETAIL._setTab(index);
                if(index === 1){
                    GetRcbp3s($scope.rcbp1.BusinessPartyCode);
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
            $scope.GoToCustomerEdit = function () {
                $state.go('contactsDetailEdit', {}, { reload: true });
            };
            $scope.GoToContactInfo = function (rcbp3) {
                if(rcbp3 != CONTACTS_ORM.CONTACTS_SUBDETAIL.Rcbp3){
                    CONTACTS_ORM.CONTACTS_SUBDETAIL._setObj(rcbp3);
                }
                $state.go('contactsInfo', { 'BusinessPartyCode': rcbp3.BusinessPartyCode, 'LineItemNo': rcbp3.LineItemNo }, { reload: true });
            };
            $scope.GoToContactDel = function (index,rcbp3) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '',
                    template: 'Are you sure to DELETE this contact?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        var strUri = "/api/freight/rcbp3/delete?BusinessPartyCode=" + rcbp3.BusinessPartyCode + "&LineItemNo=" + rcbp3.LineItemNo;
                        WebApiService.GetParam(strUri, true).then(function success(result){
                            if(result.data.results > 0){
                                $scope.rcbp3s.splice(index, 1);
                            }
                        });
                        console.log('Del Rcbp3 ' + rcbp3.BusinessPartyCode + ' at ' + rcbp3.LineItemNo);
                    }
                });
            };
            $scope.GoToContactAdd = function (rcbp3) {
                $state.go('contactsInfoAdd', { 'BusinessPartyCode': $scope.rcbp1.BusinessPartyCode, 'LineItemNo': rcbp3.length + 1 }, { reload: true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                if(CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s != null && CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s.length > 0 && CONTACTS_ORM.CONTACTS_SUBLIST.BusinessPartyCode === CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s[0].BusinessPartyCode){
                    $scope.rcbp3s = CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s;
                }else{
                    var strUri = '/api/freight/rcbp3/read?BusinessPartyCode=' + BusinessPartyCode;
                    WebApiService.GetParam(strUri, false).then(function success(result){
                        $scope.rcbp3s = result.data.results;
                        CONTACTS_ORM.CONTACTS_SUBLIST._setId(BusinessPartyCode);
                        CONTACTS_ORM.CONTACTS_SUBLIST._setObj($scope.rcbp3s);
                    });
                }
            };
            var GetRcbp1 = function (TrxNo) {
                if(CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1 != null && CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1.TrxNo === parseInt(TrxNo)){
                    $scope.rcbp1 = CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1;
                }
                else{
                    var strUri = '/api/freight/rcbp1/read?TrxNo=' + TrxNo;
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        $scope.rcbp1 = result.data.results[0];
                        CONTACTS_ORM.CONTACTS_DETAIL._setId(TrxNo);
                        CONTACTS_ORM.CONTACTS_DETAIL._setObj($scope.rcbp1);
                    });
                }
            };
            GetRcbp1($scope.ContactsDetail.TrxNo);
        }]);

appControllers.controller('ContactsDetailEditCtrl',
        ['$scope', '$stateParams', '$state', 'WebApiService', 'CONTACTS_ORM',
        function ($scope, $stateParams, $state, WebApiService, CONTACTS_ORM) {
            $scope.rcbp1 = CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo': $scope.rcbp1.TrxNo }, { reload: true });
            };
            $scope.returnUpdateRcbp1 = function () {
                var jsonData = { "rcbp1": $scope.rcbp1 };
                var strUri = "/api/freight/rcbp1/update";
                WebApiService.Post(strUri, jsonData, true).then(function success(result){
                    $scope.returnDetail();
                });
            };
        }]);

appControllers.controller('ContactsInfoCtrl',
        ['$scope', '$state', '$stateParams', 'CONTACTS_ORM',
        function ($scope, $state, $stateParams, CONTACTS_ORM) {
            $scope.rcbp3 = CONTACTS_ORM.CONTACTS_SUBDETAIL.Rcbp3;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo':CONTACTS_ORM.CONTACTS_DETAIL.TrxNo }, { reload: true });
            };
            $scope.GoToContactEdit = function () {
                $state.go('contactsInfoEdit', {}, { reload: true });
            };
            $scope.blnContainNameCard = function (rcbp3) {
                if (typeof (rcbp3) == "undefined") return false;
                if (typeof (rcbp3.NameCard) == "undefined") return false;
                if (rcbp3.NameCard.length > 0) {
                    return true;
                } else { return false; }
            };
        }]);

appControllers.controller('ContactsInfoAddCtrl',
        ['$scope', '$state', '$stateParams', 'WebApiService', 'CONTACTS_ORM',
        function ($scope, $state, $stateParams, WebApiService, CONTACTS_ORM) {
            $scope.rcbp3 = {
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
                $state.go('contactsDetail', { 'TrxNo':CONTACTS_ORM.CONTACTS_DETAIL.TrxNo }, { reload: true });
            };
            $scope.returnInsertRcbp3 = function () {
                var jsonData = { "rcbp3": $scope.rcbp3 };
                var strUri = "/api/freight/rcbp3/create";
                WebApiService.Post(strUri, jsonData, true).then(function success(result){
                    if(CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s != null && CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s.length > 0) {
                        CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s.push($scope.rcbp3);
                    }else{
                        var arrRcbp3s=[];
                        arrRcbp3s.push($scope.rcbp3);
                        CONTACTS_ORM.CONTACTS_SUBLIST._setObj(arrRcbp3s);
                    }
                    $scope.returnDetail();
                });
            };
        }]);

appControllers.controller('ContactsInfoEditCtrl',
        ['$scope', '$state', '$stateParams', 'WebApiService', 'CONTACTS_ORM',
        function ($scope, $state, $stateParams, WebApiService, CONTACTS_ORM) {
            $scope.rcbp3 = CONTACTS_ORM.CONTACTS_SUBDETAIL.Rcbp3;
            $scope.returnInfo = function () {
                $state.go('contactsInfo', {}, { reload: true });
            };
            $scope.returnUpdateRcbp3 = function () {
                var jsonData = { "rcbp3": $scope.rcbp3 };
                var strUri = "/api/freight/rcbp3/update";
                WebApiService.Post(strUri, jsonData, true).then(function success(result){
                    $scope.returnInfo();
                });
            };
        }]);

appControllers.controller('PaymentApprovalCtrl',
        ['$scope', '$state',
        function ($scope, $state) {
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
        ['$scope', '$state', '$stateParams', '$ionicPopup', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $stateParams, $ionicPopup, DateTimeService, WebApiService) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.Filter = {
                FilterName:         $stateParams.FilterName,
                FilterValue:        $stateParams.FilterValue,
                CanLoadedMoreData:  true,
                IsSelectAll:        false
            };
            $scope.plviStatus = { text: "USE", checked: false };
            $scope.returnSearch = function () {
                $state.go('paymentApproval', {}, {});
            };
            $scope.funcShowDate = function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.showApproval = function () {
                if($scope.plviStatus.text === 'USE'){
                    var appPlvi1 = [];
                    for(var i=0;i<=$scope.plvi1s.length-1;i++){
                        if($scope.plvi1s[i].StatusCode === 'APP'){
                            appPlvi1.push($scope.plvi1s[i]);
                        }
                    }
                    if(appPlvi1.length > 0){
                        var jsonData = { "plvi1s": appPlvi1 };
                        var strUri = "/api/freight/plvi1/update";
                        WebApiService.Post(strUri, jsonData, true).then(function success(result){
                            var removeApp = function(plvi1s){
                                for(var i=0;i<=plvi1s.length-1;i++){
                                    if(plvi1s[i].StatusCode === 'APP'){
                                        $scope.plvi1s.splice(i, 1);
                                        removeApp($scope.plvi1s);
                                        break;
                                    }
                                }
                            };
                            removeApp($scope.plvi1s);
                            var alertPopup = $ionicPopup.alert({
                                title: "Approval Successfully!",
                                okType: 'button-calm'
                            });
                        },function error(error){
                            var strError = '';
                            if(error === null){
                                strError = 'Approval Failed! XHR Error 500.';
                            }else{
                                strError = 'Approval Failed! ' + error;
                            }
                            var alertPopup = $ionicPopup.alert({
                                title: strError,
                                okType: 'button-assertive'
                            });
                            alertPopup.then(function(res) {
                                console.log(strError);
                            });
                        });
                    }
                }
            };
            $scope.plviStatusChange = function () {
                if ($scope.plviStatus.checked) {
                    $scope.plviStatus.text = "APP";
                } else {
                    $scope.plviStatus.text = "USE";
                }
                RecordCount = 0;
                dataResults = new Array();
                $scope.Filter.CanLoadedMoreData = true;
                $scope.plvi1s = dataResults;
                $scope.loadMore();
            };
            $scope.ClickSelect = function(Plvi1) {
                if($scope.plviStatus.text != 'USE'){
                    Plvi1.IsSelected = false;
                }else{
                    if(Plvi1.IsSelected){
                        Plvi1.StatusCode = 'APP';
                    } else {
                        Plvi1.StatusCode = 'USE';
                    }
                }
            };
            $scope.ClickSelectAll = function() {
                if($scope.plvi1s != null && $scope.plvi1s.length > 0 && $scope.plviStatus.text === 'USE'){
                    $scope.Filter.IsSelectAll = !$scope.Filter.IsSelectAll;
                    if($scope.Filter.IsSelectAll){
                        for(var i=0;i<=$scope.plvi1s.length-1;i++){
                            $scope.plvi1s[i].IsSelected = true;
                            $scope.plvi1s[i].StatusCode = 'APP';
                        }
                    }else{
                        for(var i=0;i<=$scope.plvi1s.length-1;i++){
                            $scope.plvi1s[i].IsSelected = false;
                            $scope.plvi1s[i].StatusCode = 'USE';
                        }
                    }
                }
            };
            $scope.loadMore = function() {
                var strUri = "/api/freight/plvi1/sps?RecordCount=" + RecordCount + "&StatusCode=" + $scope.plviStatus.text
                if ($scope.Filter.FilterValue != null && $scope.Filter.FilterValue.length > 0) {
                    if($scope.Filter.FilterName === "VoucherNo"){
                        strUri = strUri + "&VoucherNo=" + $scope.Filter.FilterValue;
                    }else{
                        strUri = strUri + "&VendorName=" + $scope.Filter.FilterValue;
                    }
                }
                WebApiService.GetParam(strUri, false).then(function success(result){
                    if(result.data.results.length > 0){
                        dataResults = dataResults.concat(result.data.results);
                        $scope.plvi1s = dataResults;
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
        ['$scope', '$state', '$stateParams', 'WebApiService',
        function ($scope, $state, $stateParams, WebApiService) {
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
                var strUri = "/api/freight/rcvy1";
                if (PortOfDischargeName != null && PortOfDischargeName.length > 0) {
                    strUri = strUri + "?PortOfDischargeName=" + PortOfDischargeName;
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        $scope.PortOfDischargeNames = result.data.results;
                    });
                } else {
                    WebApiService.Get(strUri, true).then(function success(result){
                        $scope.PortOfDischargeNames = result.data.results;
                    });
                }
            };
            getRcvy1(null);
        }]);

appControllers.controller('VesselScheduleDetailCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $stateParams, DateTimeService, WebApiService) {
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
                var strUri = "/api/freight/rcvy1/sps?PortOfDischargeName=" + PortOfDischargeName;
                WebApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Rcvy1s = result.data.results;
                });
            };
            getRcvy1($scope.Rcvy1Detail.PortOfDischargeName);
        }]);

appControllers.controller('ShipmentStatusCtrl',
        ['$scope', '$state', '$ionicPopup', 'WebApiService', 'TRACKING_ORM',
        function ($scope, $state, $ionicPopup, WebApiService, TRACKING_ORM) {
            $scope.Tracking = {
                ContainerNo: '',
                JobNo: '',
                BLNo: '',
                AWBNo: '',
                OrderNo: '',
                ReferenceNo: ''
            };
            switch(TRACKING_ORM.TRACKING_SEARCH.FilterName)
            {
                case 'ContainerNo':
                    $scope.Tracking.ContainerNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                case 'JobNo':
                    $scope.Tracking.JobNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                case 'BLNo':
                    $scope.Tracking.BLNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                case 'AWBNo':
                    $scope.Tracking.AWBNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                case 'OrderNo':
                    $scope.Tracking.OrderNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                case 'ReferenceNo':
                    $scope.Tracking.ReferenceNo = TRACKING_ORM.TRACKING_SEARCH.FilterValue;
                    break;
                default:
            }
            var alertPopup = null;
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            var getSearchResult = function (FilterName, FilterValue) {
                var strUri = '/api/freight/tracking/count?FilterName=' + FilterName + '&FilterValue=' + FilterValue;
                WebApiService.GetParam(strUri, true).then(function chkCount(result){
                    if (result.data.results > 1) {
                        $state.go('shipmentStatusList', { 'FilterName':FilterName, 'FilterValue':FilterValue }, { reload: true });
                    } else if (result.data.results === 1) {
                        return FilterName;
                    } else {
                        alertPopup = $ionicPopup.alert({
                                title: 'No Records Found.',
                                okType: 'button-assertive'
                        });
                    }
                }).then(function chkFilter(FilterName){
                    if(typeof(FilterName) != 'undefined'){
                        if (FilterName === 'OrderNo') {
                            TRACKING_ORM.TRACKING_DETAIL._set(FilterValue, '4');
                            $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'Key':FilterValue, 'ModuleCode':'4' }, { reload: true });
                        } else{
                            strUri = '/api/freight/tracking/sps?FilterName=' + FilterName + '&RecordCount=0&FilterValue=' + FilterValue;
                            WebApiService.GetParam(strUri, false).then(function success(result){
                                if(result.data.results.length > 0){
                                    TRACKING_ORM.TRACKING_DETAIL._set(result.data.results[0].JobNo, result.data.results[0].ModuleCode);
                                    $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'Key':result.data.results[0].JobNo, 'ModuleCode':result.data.results[0].ModuleCode }, { reload: true });
                                }
                            });
                        }
                    }
                });
            };
            $scope.GoToDetail = function (TypeName) {
                if(alertPopup === null){
                    var FilterName = '';
                    var FilterValue = '';
                    if (TypeName === 'Container No') { FilterValue = $scope.Tracking.ContainerNo; FilterName = 'ContainerNo'}
                    else if (TypeName === 'Job No') { FilterValue = $scope.Tracking.JobNo; FilterName = 'JobNo'}
                    else if (TypeName === 'BL No') { FilterValue = $scope.Tracking.BLNo; FilterName = 'BlNo'}
                    else if (TypeName === 'AWB No') { FilterValue = $scope.Tracking.AWBNo; FilterName = 'AwbNo'}
                    else if (TypeName === 'Order No') { FilterValue = $scope.Tracking.OrderNo; FilterName = 'OrderNo'}
                    else if (TypeName === 'Reference No') { FilterValue = $scope.Tracking.ReferenceNo; FilterName = 'CustomerRefNo'}
                    if (FilterValue.length > 0) {
                        if(TRACKING_ORM.TRACKING_SEARCH.FilterName != FilterName || TRACKING_ORM.TRACKING_SEARCH.FilterValue != FilterValue){
                            TRACKING_ORM.init();
                            TRACKING_ORM.TRACKING_SEARCH._set(FilterName,FilterValue);
                        }
                        getSearchResult(FilterName, FilterValue);
                    } else {
                        alertPopup = $ionicPopup.alert({
                            title: TypeName + ' is Empty.',
                            okType: 'button-assertive'
                        });
                    }
                }else{
                    alertPopup.close();
                    alertPopup = null;
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
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'WebApiService', 'TRACKING_ORM',
        function ($scope, $state, $stateParams, DateTimeService, WebApiService, TRACKING_ORM) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.TrackingList = {
                FilterName :        TRACKING_ORM.TRACKING_SEARCH.FilterName,
                FilterValue :       TRACKING_ORM.TRACKING_SEARCH.FilterValue,
                CanLoadedMoreData : true
            };
            if($scope.TrackingList.FilterName === ''){
                $scope.TrackingList.FilterName = $stateParams.FilterName;
                $scope.TrackingList.FilterValue = $stateParams.FilterValue;
            }
            $scope.returnShipmentStatus = function () {
                $state.go('shipmentStatus', {}, {});
            };
            $scope.GoToDetail = function (Jmjm1) {
                TRACKING_ORM.TRACKING_DETAIL._set(Jmjm1.JobNo, Jmjm1.ModuleCode);
                $state.go('shipmentStatusDetail', { 'FilterName':$scope.TrackingList.FilterName, 'Key':Jmjm1.JobNo, 'ModuleCode':Jmjm1.ModuleCode }, { reload: true });
            };
            $scope.ShowDate= function (utc) {
                return DateTimeService.ShowDate(utc);
            };
            $scope.ShowDatetime= function (utc) {
                return DateTimeService.ShowDatetime(utc);
            };
            $scope.funcShowLabel = function(FilterName){
                if(FilterName === $scope.TrackingList.FilterName){
                    return true;
                }else { return false; }
            };
            $scope.funcLoadMore = function() {
                if(TRACKING_ORM.TRACKING_LIST.Jmjm1s != null && TRACKING_ORM.TRACKING_LIST.Jmjm1s.length > 0){
                    $scope.Jmjm1s = TRACKING_ORM.TRACKING_LIST.Jmjm1s;
                    $scope.TrackingList.CanLoadedMoreData = false;
                }else{
                    var strUri = '/api/freight/tracking/sps?FilterName=' + $scope.TrackingList.FilterName + '&RecordCount=' + RecordCount + '&FilterValue=' + $scope.TrackingList.FilterValue;
                    WebApiService.GetParam(strUri, false).then(function success(result){
                        if(result.data.results.length > 0){
                            dataResults = dataResults.concat(result.data.results);
                            $scope.Jmjm1s = dataResults;
                            $scope.TrackingList.CanLoadedMoreData = true;
                            RecordCount = RecordCount + 20;
                            TRACKING_ORM.TRACKING_LIST._setJmjm($scope.Jmjm1s);
                        }else{
                            $scope.TrackingList.CanLoadedMoreData = false;
                            RecordCount = 0;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            };
        }]);

appControllers.controller('ShipmentStatusDetailCtrl',
        ['$scope', '$state', '$stateParams', '$ionicPopup', 'DateTimeService', 'WebApiService', 'TRACKING_ORM',
        function ($scope, $state, $stateParams, $ionicPopup, DateTimeService, WebApiService, TRACKING_ORM) {
            $scope.Detail = {
                FilterName :    TRACKING_ORM.TRACKING_SEARCH.FilterName,
                Key :           TRACKING_ORM.TRACKING_DETAIL.Key,
                ModuleCode :    TRACKING_ORM.TRACKING_DETAIL.ModuleCode
            };
            if($scope.Detail.FilterName === ''){
                $scope.Detail.FilterName =  $stateParams.FilterName;
                $scope.Detail.Key =         $stateParams.Key;
                $scope.Detail.ModuleCode =  $stateParams.ModuleCode;
            }
            $scope.returnList = function () {
                $state.go('shipmentStatusList', { 'FilterName':TRACKING_ORM.TRACKING_SEARCH.FilterName, 'FilterValue':TRACKING_ORM.TRACKING_SEARCH.FilterValue }, { reload:true });
            };
            $scope.ShowDate = function(utc){
                return DateTimeService.ShowDate(utc);
            };
            $scope.ShowDatetime = function(utc){
                return DateTimeService.ShowDatetime(utc);
            };
            if($scope.Detail.FilterName === 'OrderNo'){
                if(TRACKING_ORM.TRACKING_DETAIL.Omtx1 != null && TRACKING_ORM.TRACKING_DETAIL.Omtx1.OrderNo === $scope.Detail.Key){
                    $scope.Omtx1s = TRACKING_ORM.TRACKING_DETAIL.Omtx1;
                }else{
                    var getOmtx1 = function (FilterName, FilterValue) {
                        var strUri = '/api/freight/tracking?FilterName=' + FilterName + '&FilterValue=' + FilterValue;
                        WebApiService.GetParam(strUri, true).then(function success(result){
                            $scope.Omtx1s = result.data.results;
                            TRACKING_ORM.TRACKING_DETAIL._setOmtx($scope.Omtx1s);
                        });
                    };
                    getOmtx1($scope.Detail.FilterName, $scope.Detail.Key);
                }
            }else{
                if(TRACKING_ORM.TRACKING_DETAIL.Jmjm1 != null && TRACKING_ORM.TRACKING_DETAIL.Jmjm1.JobNo === $scope.Detail.Key){
                    $scope.jmjm1 = TRACKING_ORM.TRACKING_DETAIL.Jmjm1;
                }else{
                    var getJmjm1 = function (FilterName, FilterValue, ModuleCode) {
                        var strUri = '/api/freight/tracking?FilterName=' + FilterName + '&ModuleCode=' + ModuleCode + '&FilterValue=' + FilterValue;
                        WebApiService.GetParam(strUri, true).then(function success(result){
                            $scope.jmjm1 = result.data.results[0];
                            TRACKING_ORM.TRACKING_DETAIL._setJmjm($scope.jmjm1);
                        });
                    };
                    getJmjm1($scope.Detail.FilterName, $scope.Detail.Key, $scope.Detail.ModuleCode);
                }
            }
        }]);

appControllers.controller('InvoiceCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, DateTimeService, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.ShowDate = function(utc){
                return DateTimeService.ShowDate(utc);
            };
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function (Ivcr1) {
                DownloadFileService.Download('attach/' + Ivcr1.FilePath, 'application/pdf', onPlatformError, null, null);
            };
            var GetIvcr1s = function () {
                var strUri = "/api/freight/view/pdf?FolderName=ivcr1";
                WebApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Ivcr1s = result.data.results;
                });
            };
            GetIvcr1s();
        }]);

appControllers.controller('BlCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, DateTimeService, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.ShowDate = function(utc){
                return DateTimeService.ShowDate(utc);
            };
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function (Jmjm1) {
                DownloadFileService.Download('attach/' + Jmjm1.FilePath, 'application/pdf', onPlatformError, null, null);
            };
            var GetJmjm1s = function () {
                var strUri = "/api/freight/view/pdf?FolderName=jmjm1";
                WebApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Jmjm1s = result.data.results;
                });
            };
            GetJmjm1s();
        }]);

appControllers.controller('AwbCtrl',
        ['$scope', '$state', '$stateParams', 'DateTimeService', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, DateTimeService, DownloadFileService, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.ShowDate = function(utc){
                return DateTimeService.ShowDate(utc);
            };
            var onPlatformError = function(url){
                window.open(url);
            };
            $scope.download = function (Jmjm1) {
                DownloadFileService.Download('attach/' + Jmjm1.FilePath, 'application/pdf', onPlatformError, null, null);
            };
            var GetJmjm1s = function () {
                var strUri = "/api/freight/view/pdf?FolderName=jmjm1";
                WebApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Jmjm1s = result.data.results;
                });
            };
            GetJmjm1s();
        }]);

appControllers.controller('SOACtrl',
        ['$scope', '$state', '$stateParams', '$ionicPopup', 'DownloadFileService', 'WebApiService',
        function ($scope, $state, $stateParams, $ionicPopup, DownloadFileService, WebApiService) {
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
        ['$scope', '$state', '$stateParams', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $ionicPopup, WebApiService) {
            $scope.Saus1 = {
                UserID: sessionStorage.getItem("UserId"),
                Memo :  ''
            };
            if($scope.Saus1.UserID === null){ $scope.Saus1.UserID='s'; }
            var alertPopup = null;
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.returnUpdateMemo = function(){
                if(alertPopup === null){
                    var jsonData = { "saus1": $scope.Saus1 };
                    var strUri = "/api/freight/saus1/memo";
                    WebApiService.Post(strUri, jsonData, true).then(function success(result){
                        alertPopup = $ionicPopup.alert({
                            title: "Save Successfully!",
                            okType: 'button-calm'
                        });
                    });
                }else{
                    alertPopup.close();
                    alertPopup = null;
                }
            };
            var GetSaus1 = function (uid) {
                var strUri = "/api/freight/saus1/memo?userID=" + uid;
                WebApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Saus1.Memo = result.data.results;
                });
            };
            GetSaus1($scope.Saus1.UserID);
        }]);

appControllers.controller('ReminderCtrl',
        ['$scope', '$state', '$stateParams', 'WebApiService',
        function ($scope, $state, $stateParams, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { id: 1, Subject: 'Payment Voucher need Approve', Message: 'Please help to approve the ref no : PV15031841', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 14,2015', DueTime: '11:20' },
                { id: 2, Subject: 'Email to Henry', Message: 'Need email to henry for the new request for the mobile at the monring.', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 16,2015', DueTime: '09:20' }
            ];
        }]);
