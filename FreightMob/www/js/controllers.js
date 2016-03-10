var appControllers = angular.module('MobileAPP.controllers', [
    'ionic',
    'ionic.ion.headerShrink',
    'jett.ionic.filter.bar',
    'ionMdInput',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.sms',
    'ngCordova.plugins.actionSheet',
    'MobileAPP.config',
    'MobileAPP.directives',
    'MobileAPP.services',
    'MobileAPP.factories'
]);

appControllers.controller('IndexCtrl',
        ['ENV', '$scope', '$state', '$http', '$ionicPopup', '$cordovaAppVersion',
        function (ENV, $scope, $state, $http, $ionicPopup, $cordovaAppVersion) {
            $scope.GoToLogin = function () {
                $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
            };
            $scope.GoToSetting = function () {
                $state.go('setting', {}, { reload: true });
            };
            $scope.GoToUpdate = function () {
                if(!ENV.fromWeb){
                    var url = ENV.website + '/update.json';
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
        ['ENV', '$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$cordovaToast',
        '$cordovaAppVersion', 'WebApiService', 'SALES_ORM',
        function (ENV, $scope, $http, $state, $stateParams, $ionicPopup, $cordovaToast,
        $cordovaAppVersion, WebApiService, SALES_ORM) {
            $scope.logininfo = {
                strUserName: '',
                strPassword: ''
            };
            var alertPopup = null;
            var alertTitle = '';
            $scope.login = function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.close();
                }
                if (is.empty($scope.logininfo.strUserName)) {
                    alertTitle = 'Please Enter User Name.';
                    alertPopup = $ionicPopup.alert({
                        title: alertTitle,
                        okType: 'button-assertive'
                    });
                    alertPopup.then(function(res) {
                        log4web.log(alertTitle);
                    });
                }else{
                    var strUri = '/api/freight/login/check?UserId=' + $scope.logininfo.strUserName + '&Md5Stamp=' + hex_md5($scope.logininfo.strPassword);
                    WebApiService.GetParam(strUri, true).then(function success(result){
                        if(result.data.results>0){
                            sessionStorage.clear();
                            sessionStorage.setItem("UserId", $scope.logininfo.strUserName);
                            //Add JPush RegistradionID
                            if (!ENV.fromWeb) {
                                window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                            }
                            SALES_ORM.init();
                            $state.go('main', {}, { reload: true });
                        }else{
                            alertTitle = 'Invaild User';
                            alertPopup = $ionicPopup.alert({
                                title: alertTitle,
                                okType: 'button-assertive'
                            });
                            alertPopup.then(function(res) {
                                log4web.log(alertTitle);
                            });
                        }
                    });
                }
            };
            if (!ENV.fromWeb && is.equal($stateParams.CanCheckUpdate,'Y')) {
                var url = ENV.website + '/update.json';
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
        ['ENV', '$scope', '$state', '$ionicPopup', '$cordovaToast', '$cordovaFile',
        function (ENV, $scope, $state, $ionicPopup, $cordovaToast, $cordovaFile) {
            $scope.Setting = {
                WebApiURL:          ENV.api.replace('http://', ''),
                WebSiteUrl:         ENV.website.replace('http://', ''),
                MapProviderOptions:  [{'value':'google','name':'Google'},{'value':'baidu','name':'Baidu'}],
                MapProvider:        ''
            };
            $scope.returnLogin = function () {
                $state.go('login', { 'CanCheckUpdate': 'Y' }, { reload: true });
            };
            $scope.saveSetting = function () {
                if (is.not.empty($scope.Setting.WebApiURL)) {
                    ENV.api = onStrToURL($scope.Setting.WebApiURL);
                } else { $scope.Setting.WebApiURL = ENV.website }
                if (is.not.empty($scope.Setting.WebSiteUrl)) {
                    ENV.website = onStrToURL($scope.Setting.WebSiteUrl);
                } else { $scope.Setting.WebSiteUrl = ENV.api }
                if (is.not.empty($scope.Setting.MapProvider)) {
                    ENV.mapProvider = $scope.Setting.MapProvider.value;
                } else { $scope.Setting.MapProvider = ENV.mapProvider }
                var data = 'website=' + $scope.Setting.WebSiteUrl + '##api=' + $scope.Setting.WebApiURL + '##map=' + $scope.Setting.MapProvider;
                var path = cordova.file.externalRootDirectory;
                var file = ENV.rootPath + '/' + ENV.configFile;
                $cordovaFile.writeFile(path, file, data, true)
                .then(function (success) {
                    $state.go('login', { 'CanCheckUpdate': 'Y' }, { reload: true });
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
            $scope.delSetting = function () {
                var path = cordova.file.externalRootDirectory;
                var file = ENV.rootPath + '/' + ENV.configFile;
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
        ['$scope', '$state', 'SALES_ORM',
        function ($scope, $state, SALES_ORM) {
            $scope.GoToSalesCost = function (Type) {
                SALES_ORM.SEARCH.setType(Type);
                $state.go('salesCost', {}, { reload: true });
            };
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
            $scope.GoToDocScan = function(){
                $state.go('documentScan', {}, { reload: true });
            };
        }]);
