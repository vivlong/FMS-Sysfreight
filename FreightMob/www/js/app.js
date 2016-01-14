var app = angular.module('MobileAPP', [
    'ionic',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.datePicker',
    'ngCordova.plugins.barcodeScanner',
    'MobileAPP.controllers'
]);

app.run(['$ionicPlatform', '$rootScope', '$state', '$location', '$timeout', '$ionicPopup', '$ionicHistory', '$ionicLoading', '$cordovaToast', '$cordovaFile',
    function ($ionicPlatform, $rootScope, $state, $location, $timeout, $ionicPopup, $ionicHistory, $ionicLoading, $cordovaToast, $cordovaFile) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
				blnMobilePlatform = true;
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
                var data = 'BaseUrl=' + strBaseUrl + '##WebServiceURL=' + strWebServiceURL + '##WebSiteURL=' + strWebSiteURL;
                var path = cordova.file.externalRootDirectory;
                var directory = strAppRootPath;
                var file = directory + "/" + strAppConfigFileName;
                $cordovaFile.createDir(path, directory, false)
                    .then(function (success) {
                        $cordovaFile.writeFile(path, file, data, true)
                            .then(function (success) {
                                //
                                if (strBaseUrl.length > 0) {
                                    strBaseUrl = "/" + strBaseUrl;
                                }
                                strWebServiceURL = onStrToURL(strWebServiceURL);
                                //if (strWebServiceURL.length > 0) {
                                //    strWebServiceURL = "http://" + strWebServiceURL;
                                //}
                                strWebSiteURL = onStrToURL(strWebSiteURL);
                                //if (strWebSiteURL.length > 0) {
                                //    strWebSiteURL = "http://" + strWebSiteURL;
                                //}
                            }, function (error) {
                                $cordovaToast.showShortBottom(error);
                            });
                    }, function (error) {
                        // If an existing directory exists
                        $cordovaFile.checkFile(path, file)
                            .then(function (success) {
                                $cordovaFile.readAsText(path, file)
                                    .then(function (success) {
                                        var arConf = success.split("##");
                                        var arBaseUrl = arConf[0].split("=");
                                        if (arBaseUrl[1].length > 0) {
                                            strBaseUrl = arBaseUrl[1];
                                        }
                                        var arWebServiceURL = arConf[1].split("=");
                                        if (arWebServiceURL[1].length > 0) {
                                            strWebServiceURL = arWebServiceURL[1];
                                        }
                                        var arWebSiteURL = arConf[2].split("=");
                                        if (arWebSiteURL[1].length > 0) {
                                            strWebSiteURL = arWebSiteURL[1];
                                        }
                                        //
                                        if (strBaseUrl.length > 0) {
                                            strBaseUrl = "/" + strBaseUrl;
                                        }
                                        strWebServiceURL = onStrToURL(strWebServiceURL);
                                        //if (strWebServiceURL.length > 0) {
                                        //    strWebServiceURL = "http://" + strWebServiceURL;
                                        //}
                                        strWebSiteURL = onStrToURL(strWebSiteURL);
                                        //if (strWebSiteURL.length > 0) {
                                        //    strWebSiteURL = "http://" + strWebSiteURL;
                                        //}
                                    }, function (error) {
                                        $cordovaToast.showShortBottom(error);
                                    });
                            }, function (error) {
                                // If file not exists
                                $cordovaFile.writeFile(path, file, data, true)
                                    .then(function (success) {
                                        //
                                        if (strBaseUrl.length > 0) {
                                            strBaseUrl = "/" + strBaseUrl;
                                        }
                                        strWebServiceURL = onStrToURL(strWebServiceURL);
                                        //if (strWebServiceURL.length > 0) {
                                        //    strWebServiceURL = "http://" + strWebServiceURL;
                                        //}
                                        strWebSiteURL = onStrToURL(strWebSiteURL);
                                        //if (strWebSiteURL.length > 0) {
                                        //    strWebSiteURL = "http://" + strWebSiteURL;
                                        //}
                                    }, function (error) {
                                        $cordovaToast.showShortBottom(error);
                                    });
                            });
                    });
            } else {
                if (strBaseUrl.length > 0) {
                    strBaseUrl = "/" + strBaseUrl;
                }
                strWebServiceURL = onStrToURL(strWebServiceURL);
                strWebSiteURL = onStrToURL(strWebSiteURL);
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
    }]);

app.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false);
        $stateProvider
            .state('loading', {
                url: '/loading',
                cache: 'false',
                templateUrl: 'view/loading.html',
                controller: 'LoadingCtrl'
            })
            .state('login', {
                url: '/login/:CanCheckUpdate',
                cache: 'false',
                templateUrl: 'view/login.html',
                controller: 'LoginCtrl'
            })
            .state('setting', {
                url: '/setting',
                cache: 'false',
                templateUrl: 'view/setting.html',
                controller: 'SettingCtrl'
            })
            .state('update', {
                url: '/update/:Version',
                cache: 'false',
                templateUrl: 'view/update.html',
                controller: 'UpdateCtrl'
            })
            .state('main', {
                url: "/main",
                templateUrl: "view/main.html",
                controller: 'MainCtrl'
            })
            .state('salesmanActivity', {
                url: '/salesmanActivity',
                templateUrl: 'view/crm/SalesmanActivity.html',
                controller: 'SalesmanActivityCtrl'
            })
            .state('contacts', {
                url: '/contacts',
                cache: 'false',
                templateUrl: 'view/crm/Contacts.html',
                controller: 'ContactsCtrl'
            })
			.state('contactsList', {
                url: '/contacts/list/:BusinessPartyNameLike',
                cache: 'false',
                templateUrl: 'view/crm/Contacts-list.html',
                controller: 'ContactsListCtrl'
            })
            .state('contactsDetail', {
                url: '/contacts/detail/:TrxNo/:BusinessPartyNameLike',
                templateUrl: 'view/crm/Contacts-detail.html',
                controller: 'ContactsDetailCtrl'
            })
            .state('contactsDetailEdit', {
                url: '/contacts/detail/Edit/:TrxNo/:BusinessPartyName',
                cache: 'false',
                templateUrl: 'view/crm/Contacts-detail-Edit.html',
                controller: 'ContactsDetailEditCtrl'
            })
            .state('contactsInfoAdd', {
                url: '/contacts/info/Add/:TrxNo/:LineItemNo',
                cache: 'false',
                templateUrl: 'view/crm/Contacts-info-Add.html',
                controller: 'ContactsInfoAddCtrl'
            })
            .state('contactsInfoEdit', {
                url: '/contacts/info/Edit/:TrxNo/:LineItemNo',
                cache: 'false',
                templateUrl: 'view/crm/Contacts-info-Edit.html',
                controller: 'ContactsInfoEditCtrl'
            })
            .state('paymentApproval', {
                url: '/paymentApproval',
                cache: 'false',
                templateUrl: 'view/productivity/PaymentApproval.html',
                controller: 'PaymentApprovalCtrl'
            })
            .state('vesselSchedule', {
                url: '/vesselSchedule',
                //cache: 'false',
                templateUrl: 'view/tracking/VesselSchedule.html',
                controller: 'VesselScheduleCtrl'
            })
            .state('vesselScheduleDetail', {
                url: '/vesselSchedule/detail/:PortOfDischargeName',
                cache: 'false',
                templateUrl: 'view/tracking/VesselSchedule-detail.html',
                controller: 'VesselScheduleDetailCtrl'
            })
            .state('shipmentStatus', {
                url: '/shipmentStatus',
                templateUrl: 'view/tracking/ShipmentStatus.html',
                controller: 'ShipmentStatusCtrl'
            })
            .state('shipmentStatusList', {
                url: '/shipmentStatus/list/:FilterName/:FilterValue',
                cache: 'false',
                templateUrl: 'view/tracking/ShipmentStatus-list.html',
                controller: 'ShipmentStatusListCtrl'
            })
            .state('shipmentStatusDetail', {
                url: '/shipmentStatus/detail/:FilterName/:FilterValue/:ModuleCode',
                cache: 'false',
                templateUrl: 'view/tracking/ShipmentStatus-detail.html',
                controller: 'ShipmentStatusDetailCtrl'
            })
            .state('invoice', {
                url: '/invoice',
                cache: 'false',
                templateUrl: 'view/tracking/Invoice.html',
                controller: 'InvoiceCtrl'
            })
            .state('bl', {
                url: '/bl',
                cache: 'false',
                templateUrl: 'view/tracking/BL.html',
                controller: 'BlCtrl'
            })
            .state('awb', {
                url: '/awb',
                cache: 'false',
                templateUrl: 'view/tracking/AWB.html',
                controller: 'AwbCtrl'
            })
            .state('soa', {
                url: '/soa',
                cache: 'false',
                templateUrl: 'view/tracking/SOA.html',
                controller: 'SOACtrl'
            })
            .state('memo', {
                url: '/Memo',
                cache: 'false',
                templateUrl: 'view/productivity/Memo.html',
                controller: 'MemoCtrl'
            })
            .state('reminder', {
                url: '/Reminder',
                cache: 'false',
                templateUrl: 'view/productivity/Reminder.html',
                controller: 'ReminderCtrl'
            });
        $urlRouterProvider.otherwise('/login/N');
    }]);

app.constant('$ionicLoadingConfig', {
    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
});

app.constant('ApiEndpoint', {
    url: strWebServiceURL + "/" + strBaseUrl
});
