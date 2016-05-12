var appControllers = angular.module('MobileAPP.controllers', [
    'ionic',
    'ionic.ion.headerShrink',
    'jett.ionic.filter.bar',
    'ionMdInput',
    'angularFileUpload',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.sms',
    'ngCordova.plugins.camera',
    'ngCordova.plugins.actionSheet',
    'ngCordova.plugins.barcodeScanner',
    'MobileAPP.config',
    'MobileAPP.directives',
    'MobileAPP.services',
    'MobileAPP.factories'
]);

appControllers.controller('GeoCtrl', ['ENV', '$scope',
    function(ENV, $scope) {
        function loadJScript() {
            var uri = '';
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (is.equal(ENV.mapProvider, 'baidu')) {
                script.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=94415618dfaa9ff5987dd07983f25159';
                document.body.appendChild(script);
            } else if (is.equal(ENV.mapProvider, 'google')) {
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxtVdmOCYy4UWz8eW4z4Eo-DF3cjRoMUM';
                document.body.appendChild(script);
                /*
                uri = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxtVdmOCYy4UWz8eW4z4Eo-DF3cjRoMUM';
                $.ajax({
                    url: uri,
                    type: 'GET',
                    timeout: 10000,
                    complete: function(response) {
                        if (response.status == 200) {
                            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxtVdmOCYy4UWz8eW4z4Eo-DF3cjRoMUM';
                            document.body.appendChild(script);
                        } else {
                            console.log('Load Map ' + response.status);
                        }
                    }
                });
                */
            }
        }
        $scope.$watch('$viewContentLoaded', function() {
            loadJScript();
        });
    }
]);

appControllers.controller('IndexCtrl', ['ENV', '$scope', '$state', '$rootScope',
    '$http', '$ionicLoading', '$ionicPopup', '$ionicSideMenuDelegate',
    function(ENV, $scope, $state, $rootScope, $http, $ionicLoading, $ionicPopup,
        $ionicSideMenuDelegate) {
        $scope.Status = {
            Login: false
        };
        $scope.logout = function() {
            $rootScope.$broadcast('logout');
            $state.go('index.login', {}, {});
        };
        $scope.gotoSetting = function() {
            $state.go('index.setting', {}, {
                reload: true
            });
        };
        $scope.gotoUpdate = function() {
            if (!ENV.fromWeb) {
                var url = ENV.website + '/update.json';
                $http.get(url)
                    .success(function(res) {
                        var serverAppVersion = res.version;
                        $cordovaAppVersion.getVersionNumber().then(function(version) {
                            if (version != serverAppVersion) {
                                $ionicSideMenuDelegate.toggleLeft();
                                $state.go('index.update', {
                                    'Version': serverAppVersion
                                });
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: "Already the Latest Version!",
                                    okType: 'button-assertive'
                                });
                            }
                        });
                    })
                    .error(function(res) {
                        var alertPopup = $ionicPopup.alert({
                            title: "Connect Update Server Error!",
                            okType: 'button-assertive'
                        });
                    });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: "Web Platform Not Supported!",
                    okType: 'button-assertive'
                });
            }
        }
        $rootScope.$on('logout', function() {
            $scope.Status.Login = false;
            $ionicSideMenuDelegate.toggleLeft();
        });
        $rootScope.$on('login', function() {
            $scope.Status.Login = true;
        });
    }
]);

appControllers.controller('LoadingCtrl', ['$state', '$timeout',
    function($state, $timeout) {
        $timeout(function() {
            $state.go('login', {}, {
                reload: true
            });
        }, 2000);
    }
]);

appControllers.controller('LoginCtrl', ['ENV', '$scope', '$rootScope', '$http', '$state', '$stateParams', '$ionicPopup', '$cordovaToast',
    '$cordovaAppVersion', 'ApiService', 'SALES_ORM',
    function(ENV, $scope, $rootScope, $http, $state, $stateParams, $ionicPopup, $cordovaToast,
        $cordovaAppVersion, ApiService, SALES_ORM) {
        $scope.logininfo = {
            strUserName: '',
            strPassword: ''
        };
        var alertPopup = null, alertTitle = '';
        $scope.login = function() {
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
                    console.log(alertTitle);
                });
            } else {
                var strUri = '/api/freight/login/check?UserId=' + $scope.logininfo.strUserName + '&Md5Stamp=' + hex_md5($scope.logininfo.strPassword);
                ApiService.GetParam(strUri, true).then(function success(result) {
                    if (result.data.results > 0) {
                        $rootScope.$broadcast('login');
                        sessionStorage.clear();
                        sessionStorage.setItem('UserId', $scope.logininfo.strUserName);
                        //Add JPush RegistradionID
                        if (!ENV.fromWeb) {
                            window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                        }
                        SALES_ORM.init();
                        $state.go('index.main', {}, {
                            reload: true
                        });
                    } else {
                        alertTitle = 'Invaild User';
                        alertPopup = $ionicPopup.alert({
                            title: alertTitle,
                            okType: 'button-assertive'
                        });
                        alertPopup.then(function(res) {
                            console.log(alertTitle);
                        });
                    }
                });
            }
        };
        if (!ENV.fromWeb && is.equal($stateParams.CanCheckUpdate, 'Y')) {
            var url = ENV.website + '/update.json';
            $http.get(url)
                .success(function(res) {
                    var serverAppVersion = res.version;
                    $cordovaAppVersion.getVersionNumber().then(function(version) {
                        if (version != serverAppVersion) {
                            $state.go('update', {
                                'Version': serverAppVersion
                            });
                        }
                    });
                })
                .error(function(res) {});
        }
        $('#iUserName').on('keydown', function(e) {
            if (e.which === 9 || e.which === 13) {
                $('#iPassword').focus();
            }
        });
        $('#iPassword').on('keydown', function(e) {
            if (e.which === 9 || e.which === 13) {
                if (alertPopup === null) {
                    $scope.login();
                } else {
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        });
        $('#iUserName').focus();
    }
]);

appControllers.controller('SettingCtrl', ['ENV', '$scope', '$state', '$ionicHistory', '$ionicPopup', '$cordovaToast', '$cordovaFile',
    function(ENV, $scope, $state, $ionicHistory, $ionicPopup, $cordovaToast, $cordovaFile) {
        $scope.Setting = {
            Version: ENV.version,
            WebApiURL: ENV.api.replace('http://', ''),
            WebSiteUrl: ENV.website.replace('http://', ''),
            MapProvider: ENV.mapProvider
        };
        $scope.return = function() {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index.login', {}, {
                    reload: true
                });
            }
        };
        $scope.save = function() {
            if (is.not.empty($scope.Setting.WebApiURL)) {
                ENV.api = onStrToURL($scope.Setting.WebApiURL);
            } else {
                $scope.Setting.WebApiURL = ENV.website.replace('http://', '');
            }
            if (is.not.empty($scope.Setting.WebSiteUrl)) {
                ENV.website = onStrToURL($scope.Setting.WebSiteUrl);
            } else {
                $scope.Setting.WebSiteUrl = ENV.api.replace('http://', '');
            }
            if (is.not.empty($scope.Setting.MapProvider)) {
                ENV.mapProvider = $scope.Setting.MapProvider;
            } else {
                $scope.Setting.MapProvider = ENV.mapProvider;
            }
            if (!ENV.fromWeb) {
                var data = 'website=' + ENV.website + '##api=' + ENV.api + '##map=' + ENV.mapProvider;
                var path = cordova.file.externalRootDirectory;
                var file = ENV.rootPath + '/' + ENV.configFile;
                $cordovaFile.writeFile(path, file, data, true)
                    .then(function(success) {
                        $state.go('index.login', {}, {
                            reload: true
                        });
                    }, function(error) {
                        $cordovaToast.showShortBottom(error);
                    });
            } else {
                $state.go('index.login', {}, {
                    reload: true
                });
            }
        };
        $scope.reset = function() {
            $scope.Setting.WebApiURL = 'www.sysfreight.net:8081/WebApi';
            $scope.Setting.WebSiteUrl = 'www.sysfreight.net:8081/mobileapp';
            $scope.Setting.MapProvider = 'baidu';
            if (!ENV.fromWeb) {
                var path = cordova.file.externalRootDirectory;
                var file = ENV.rootPath + '/' + ENV.configFile;
                $cordovaFile.removeFile(path, file)
                    .then(function(success) {

                    }, function(error) {
                        $cordovaToast.showShortBottom(error);
                    });
            }
        };
    }
]);

appControllers.controller('UpdateCtrl', ['ENV', '$scope', '$state', '$stateParams', 'DownloadFileService',
    function(ENV, $scope, $state, $stateParams, DownloadFileService) {
        $scope.strVersion = $stateParams.Version;
        $scope.return = function() {
            onError();
        };
        var onError = function() {
            $state.go('login', {}, {
                reload: true
            });
        };
        $scope.upgrade = function() {
            DownloadFileService.Download(ENV.website + '/FreightApp.apk', 'application/vnd.android.package-archive', null, onError, onError);
        };
    }
]);

appControllers.controller('MainCtrl', ['ENV', '$scope', '$state', 'SALES_ORM', 'GeoService', 'GEO_CONSTANT',
    function(ENV, $scope, $state, SALES_ORM, GeoService, GEO_CONSTANT) {
        $scope.GoToSalesCost = function(Type) {
            SALES_ORM.SEARCH.setType(Type);
            $state.go('salesCost', {}, {
                reload: true
            });
        };
        $scope.GoToSA = function() {
            $state.go('salesmanActivity', {}, {
                reload: true
            });
        };
        $scope.GoToRcbp = function() {
            $state.go('contacts', {}, {
                reload: true
            });
        };
        $scope.GoToPa = function() {
            $state.go('paymentApproval', {}, {
                reload: true
            });
        };
        $scope.GoToVS = function() {
            $state.go('vesselSchedule', {}, {
                reload: true
            });
        };
        $scope.GoToSS = function() {
            $state.go('shipmentStatus', {}, {
                reload: true
            });
        };
        $scope.GoToInv = function() {
            $state.go('invoice', {}, {
                reload: true
            });
        };
        $scope.GoToBL = function() {
            $state.go('bl', {}, {
                reload: true
            });
        };
        $scope.GoToAWB = function() {
            $state.go('awb', {}, {
                reload: true
            });
        };
        $scope.GoToSOA = function() {
            $state.go('soa', {}, {
                reload: true
            });
        };
        $scope.GoToMemo = function() {
            $state.go('memo', {}, {
                reload: true
            });
        };
        $scope.GoToReminder = function() {
            $state.go('reminder', {}, {
                reload: true
            });
        };
        $scope.GoToDocScan = function() {
            $state.go('documentScan', {}, {
                reload: true
            });
        };
        $scope.GoToRetrieveDoc = function() {
            $state.go('retrieveDoc', {}, {
                reload: true
            });
        };
        if (is.equal(ENV.mapProvider, 'baidu')) {
            GeoService.BaiduGetCurrentPosition().then(function onSuccess(point) {
                var pos = {
                    lat: point.lat,
                    lng: point.lng
                };
                GEO_CONSTANT.Baidu.set(pos);
            }, function onError(msg) {});
        } else if (is.equal(ENV.mapProvider, 'google')) {
            GeoService.GoogleGetCurrentPosition().then(function onSuccess(point) {
                var pos = {
                    lat: point.coords.latitude,
                    lng: point.coords.longitude
                };
                GEO_CONSTANT.Google.set(pos);
            }, function onError(msg) {});
        }
    }
]);
