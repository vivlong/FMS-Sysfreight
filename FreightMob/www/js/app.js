var app = angular.module('MobileAPP', [
    'ionic',
    'jett.ionic.filter.bar',
    'ionic-datepicker',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'MobileAPP.config',
    'MobileAPP.factories',
    'MobileAPP.services',
    'MobileAPP.controllers'
]);

app.run(['ENV', '$ionicPlatform', '$rootScope', '$state', '$location', '$timeout', '$ionicPopup',
'$ionicHistory', '$ionicLoading', '$cordovaToast', '$cordovaFile', 'GeoService', 'GEO_CONSTANT',
    function (ENV, $ionicPlatform, $rootScope, $state, $location, $timeout, $ionicPopup,
    $ionicHistory, $ionicLoading, $cordovaToast, $cordovaFile, GeoService, GEO_CONSTANT) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                ENV.fromWeb = false;
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                /*
                if(window.plugins.jPushPlugin){
                    // Add JPush
                    window.plugins.jPushPlugin.init();
                    //window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.setLatestNotificationNum(5);
                    //window.plugins.jPushPlugin.openNotificationInAndroidCallback = function(data);
                    //window.plugins.jPushPlugin.receiveMessageInAndroidCallback = function(data);
                }
                */
                var data = 'website=' + ENV.website + '##api=' + ENV.api + '##map=' + ENV.mapProvider;
                var path = cordova.file.externalRootDirectory;
                var directory = ENV.rootPath;
                var file = directory + "/" + ENV.configFile;
                $cordovaFile.createDir(path, directory, false)
                    .then(function (success) {
                        $cordovaFile.writeFile(path, file, data, true)
                            .then(function (success) {
                                //
                            }, function (error) {
                                $cordovaToast.showShortBottom(error);
                            });
                    }, function (error) {
                        // If an existing directory exists
                        $cordovaFile.checkFile(path, file)
                            .then(function (success) {
                                $cordovaFile.readAsText(path, file)
                                    .then(function (success) {
                                        var arConf = success.split('##');
                                        var arWebServiceURL = arConf[0].split('=');
                                        if (is.not.empty(arWebServiceURL[1])) {
                                            ENV.website = arWebServiceURL[1];
                                        }
                                        var arWebSiteURL = arConf[1].split('=');
                                        if (is.not.empty(arWebSiteURL[1])) {
                                            ENV.api = arWebSiteURL[1];
                                        }
                                        var arMapProvider = arConf[2].split('=');
                                        if (is.not.empty(arMapProvider[1])) {
                                            ENV.mapProvider = arMapProvider[1];
                                        }
                                    }, function (error) {
                                        $cordovaToast.showShortBottom(error);
                                    });
                            }, function (error) {
                                // If file not exists
                                $cordovaFile.writeFile(path, file, data, true)
                                    .then(function (success) {
                                        //
                                    }, function (error) {
                                        $cordovaToast.showShortBottom(error);
                                    });
                            });
                    });
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        $ionicPlatform.registerBackButtonAction(function (e) {
            e.preventDefault();
            // Is there a page to go back to?  $state.include ??
            if ($state.includes('main') || $state.includes('login') || $state.includes('loading')) {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('Press again to exit.');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            } else if ($state.includes('setting')) {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }else{
                    $state.go('login', { 'CanCheckUpdate': 'Y' }, { reload: true });
                }
            } else if ($state.includes('update')) {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }else{
                    $state.go('login', { 'CanCheckUpdate': 'N' }, { reload: true });
                }
            } else if ($state.includes('contacts' || $state.includes('paymentApproval') || $state.includes('vesselSchedule') || $state.includes('shipmentStatus') || $state.includes('invoice') || $state.includes('bl') || $state.includes('awb'))) {
                $state.go('main', { }, { });
            } else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                // This is the last page: Show confirmation popup
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('Press again to exit.');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            return false;
        }, 101);

        function getJS(url) {
            return new Promise(function(resolve, reject) {
                var script = document.createElement('script');
                script.type = "text/javascript";
                if (script.readyState){  //IE
                    script.onreadystatechange = function() {
                        if (script.readyState == "loaded" ||
                                script.readyState == "complete") {
                            script.onreadystatechange = null;
                            resolve('success');
                        }
                    };
                } else {  //Others
                    script.onload = function(){
                        resolve('success');
                    };
                }
                script.onerror = function() {
                    reject(Error('load error!'));
                };
                script.src = url;
                document.body.appendChild(script);
            });
        }
        GEO_CONSTANT.init();
        if(is.equal(ENV.mapProvider,'baidu')){
            var baiduJs = 'http://api.map.baidu.com/api?v=2.0&ak=94415618dfaa9ff5987dd07983f25159';
            getJS(baiduJs).then(function(msg){
                GeoService.BaiduGetCurrentPosition().then(function onSuccess(point){
                    var pos = {
                        lat: point.lat,
                        lng: point.lng
                    };
                    GEO_CONSTANT.Baidu.set(pos);
                }, function onError(msg){
                });
            });
        }else if(is.equal(ENV.mapProvider,'google')){
            var googleJs = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxtVdmOCYy4UWz8eW4z4Eo-DF3cjRoMUM';
            getJS(googleJs).then(function(msg){
                GeoService.GoogleGetCurrentPosition().then(function onSuccess(point){
                    var pos = {
                        lat: point.coords.latitude,
                        lng: point.coords.longitude
                    };
                    GEO_CONSTANT.Google.set(pos);
                }, function onError(msg){
                });
            });
        }
    }]);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$ionicFilterBarConfigProvider',
    function ($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {
        /*
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        */
        $ionicConfigProvider.backButton.previousTitleText(false);
        /*
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        */
        $stateProvider
            .state('loading', {
                url:            '/loading',
                cache:          'false',
                templateUrl:    'view/loading.html',
                controller:     'LoadingCtrl'
            })
            .state('login', {
                url:            '/login/:CanCheckUpdate',
                cache:          'false',
                templateUrl:    'view/login.html',
                controller:     'LoginCtrl'
            })
            .state('setting', {
                url:            '/setting',
                cache:          'false',
                templateUrl:    'view/setting.html',
                controller:     'SettingCtrl'
            })
            .state('update', {
                url:            '/update/:Version',
                cache:          'false',
                templateUrl:    'view/update.html',
                controller:     'UpdateCtrl'
            })
            .state('main', {
                url:            '/main',
                templateUrl:    'view/main.html',
                controller:     'MainCtrl'
            })
            .state('salesCost',{
                url:            '/salesCost',
                cache:          'false',
                templateUrl:    'view/crm/SalesCost.html',
                controller:     'SalesCostCtrl'
            })
            .state('salesCostList',{
                url:            '/salesCost/list',
                cache:          'false',
                templateUrl:    'view/crm/SalesCost-list.html',
                controller:     'SalesCostListCtrl'
            })
            .state('salesCostDetail',{
                url:            '/salesCost/detail',
                cache:          'false',
                templateUrl:    'view/crm/SalesCost-Detail.html',
                controller:     'SalesCostDetailCtrl'
            })
            .state('salesmanActivity', {
                url:            '/salesmanActivity',
                cache:          'false',
                templateUrl:    'view/crm/SalesmanActivity.html',
                controller:     'SalesmanActivityCtrl'
            })
            .state('salesmanActivityList', {
            url:                '/salesmanActivity/list/:SalesmanNameLike',
                cache:          'false',
                templateUrl:    'view/crm/SalesmanActivity-list.html',
                controller:     'SalesmanActivityListCtrl'
            })
            .state('salesmanActivityDetail', {
                url:            '/salesmanActivity/detail/:SalesmanNameLike/:TrxNo',
                cache:          'false',
                templateUrl:    'view/crm/SalesmanActivity-detail.html',
                controller:     'SalesmanActivityDetailCtrl'
            })
            .state('salesmanActivityDetailEdit', {
                url:            '/salesmanActivity/detail/edit/:TrxNo/:LineItemNo',
                cache:          'false',
                templateUrl:    'view/crm/SalesmanActivity-detail-Edit.html',
                controller:     'SalesmanActivityDetailEditCtrl'
            })
            .state('salesmanActivityDetailAdd', {
                url:            '/salesmanActivity/detail/add/:TrxNo/:LineItemNo',
                cache:          'false',
                templateUrl:    'view/crm/SalesmanActivity-detail-Add.html',
                controller:     'SalesmanActivityDetailAddCtrl'
            })
            .state('contacts', {
                url:            '/contacts',
                cache:          'false',
                templateUrl:    'view/crm/Contacts.html',
                controller:     'ContactsCtrl'
            })
			.state('contactsList', {
                url:            '/contacts/list/:BusinessPartyNameLike',
                cache:          'false',
                templateUrl:    'view/crm/Contacts-list.html',
                controller:     'ContactsListCtrl'
            })
            .state('contactsDetail', {
                url:            '/contacts/detail/:TrxNo',
                templateUrl:    'view/crm/Contacts-detail.html',
                controller:     'ContactsDetailCtrl'
            })
            .state('contactsDetailEdit', {
                url:            '/contacts/detail/Edit',
                cache:          'false',
                templateUrl:    'view/crm/Contacts-detail-Edit.html',
                controller:     'ContactsDetailEditCtrl'
            })
            .state('contactsInfo', {
                url:            '/contacts/info',
                cache:          'false',
                templateUrl:    'view/crm/Contacts-info.html',
                controller:     'ContactsInfoCtrl'
            })
            .state('contactsInfoEdit', {
                url:            '/contacts/info/Edit',
                cache:          'false',
                templateUrl:    'view/crm/Contacts-info-Edit.html',
                controller:     'ContactsInfoEditCtrl'
            })
            .state('contactsInfoAdd', {
                url:            '/contacts/info/Add/:BusinessPartyCode/:LineItemNo',
                cache:          'false',
                templateUrl:    'view/crm/Contacts-info-Add.html',
                controller:     'ContactsInfoAddCtrl'
            })
            .state('vesselSchedule', {
                url:            '/vesselSchedule',
                //cache:        'false',
                templateUrl:    'view/tracking/VesselSchedule.html',
                controller:     'VesselScheduleCtrl'
            })
            .state('vesselScheduleDetail', {
                url:            '/vesselSchedule/detail/:PortOfDischargeName',
                cache:          'false',
                templateUrl:    'view/tracking/VesselSchedule-detail.html',
                controller:     'VesselScheduleDetailCtrl'
            })
            .state('shipmentStatus', {
                url:            '/shipmentStatus',
                templateUrl:    'view/tracking/ShipmentStatus.html',
                controller:     'ShipmentStatusCtrl'
            })
            .state('shipmentStatusList', {
                url:            '/shipmentStatus/list/:FilterName/:FilterValue',
                cache:          'false',
                templateUrl:    'view/tracking/ShipmentStatus-list.html',
                controller:     'ShipmentStatusListCtrl'
            })
            .state('shipmentStatusDetail', {
                url:            '/shipmentStatus/detail/:FilterName/:Key/:ModuleCode',
                cache:          'false',
                templateUrl:    'view/tracking/ShipmentStatus-detail.html',
                controller:     'ShipmentStatusDetailCtrl'
            })
            .state('invoice', {
                url:            '/invoice',
                cache:          'false',
                templateUrl:    'view/tracking/Invoice.html',
                controller:     'InvoiceCtrl'
            })
            .state('bl', {
                url:            '/bl',
                cache:          'false',
                templateUrl:    'view/tracking/BL.html',
                controller:     'BlCtrl'
            })
            .state('awb', {
                url:            '/awb',
                cache:          'false',
                templateUrl:    'view/tracking/AWB.html',
                controller:     'AwbCtrl'
            })
            .state('soa', {
                url:            '/soa',
                cache:          'false',
                templateUrl:    'view/tracking/SOA.html',
                controller:     'SOACtrl'
            })
            .state('paymentApproval', {
                url:            '/paymentApproval',
                templateUrl:    'view/productivity/PaymentApproval.html',
                controller:     'PaymentApprovalCtrl'
            })
            .state('paymentApprovalList', {
                url:            '/paymentApproval/list/:FilterName/:FilterValue',
                cache:          'false',
                templateUrl:    'view/productivity/PaymentApproval-list.html',
                controller:     'PaymentApprovalListCtrl'
            })
            .state('memo', {
                url:            '/Memo',
                cache:          'false',
                templateUrl:    'view/productivity/Memo.html',
                controller:     'MemoCtrl'
            })
            .state('reminder', {
                url:            '/Reminder',
                cache:          'false',
                templateUrl:    'view/productivity/Reminder.html',
                controller:     'ReminderCtrl'
            })
            .state('documentScan', {
                url:            '/DocumentScan',
                cache:          'false',
                templateUrl:    'view/productivity/DocumentScan.html',
                controller:     'DocumentScanCtrl'
            });
        $urlRouterProvider.otherwise('/login/N');
        /*
        $ionicFilterBarConfigProvider.theme('calm');
        $ionicFilterBarConfigProvider.clear('ion-close');
        $ionicFilterBarConfigProvider.search('ion-search');
        $ionicFilterBarConfigProvider.backdrop(false);
        $ionicFilterBarConfigProvider.transition('vertical');
        $ionicFilterBarConfigProvider.placeholder('Filter');
        */
    }]);

app.constant('$ionicLoadingConfig', {
    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
});
