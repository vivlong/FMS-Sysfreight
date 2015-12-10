var appControllers = angular.module('MobileAPP.controllers', [
    'ionic',
	'ionic-material',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.datePicker',
    'ngCordova.plugins.barcodeScanner',
    'ui.select',
    'MobileAPP.directives',
    'MobileAPP.services'
]);

appControllers.controller('LoadingCtl',
        ['$state', '$timeout',
        function ($state, $timeout) {
            $timeout(function () {
                $state.go('login', { 'CheckUpdate': 'N' }, { reload: true });
            }, 2500);
        }]);

appControllers.controller('LoginCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', '$ionicLoading', 'ionicMaterialInk', 'ionicMaterialMotion', '$cordovaToast', '$cordovaAppVersion', 'WebApiService', 
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, $ionicLoading, ionicMaterialInk, ionicMaterialMotion, $cordovaToast, $cordovaAppVersion, WebApiService) {
            $scope.logininfo = {};
            $scope.logininfo.strUserName = "";
            $scope.logininfo.strPassword = "";
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
            if ($stateParams.CheckUpdate === 'Y') {
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
            $scope.checkUpdate = function () {
                var url = strWebServiceURL + strBaseUrl + '/update.json';
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
                                    ionicMaterialInk.displayEffect();
                                }, 0);
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
                            ionicMaterialInk.displayEffect();
                        }, 0);
                        $timeout(function () {
                            alertPopup.close();
                        }, 2500);
                    });
            };
            $scope.setConf = function () {
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
                        ionicMaterialInk.displayEffect();
                    }, 0);
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                    return;
                }
                /*
                if ($scope.logininfo.strPassword == "") {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please Enter Password.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                    return;
                }
                */
                $ionicLoading.show();
                var jsonData = { "UserId": $scope.logininfo.strUserName, "Password": hex_md5($scope.logininfo.strPassword) };
                var strUri = "/api/freight/login";
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    sessionStorage.clear();
                    sessionStorage.setItem("UserId", $scope.logininfo.strUserName);
                    //Add JPush RegistradionID
                    if (window.plugins) {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                    }
                    $state.go('main', {}, { reload: true });
                };
                var onError = function () {
                    $ionicLoading.hide();
                };
                WebApiService.Post(strUri, jsonData, onSuccess, onError);
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 0);
        }]);

appControllers.controller('SettingCtl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaToast', '$cordovaFile',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaFile) {
            $scope.Setting = {};
            $scope.Setting.WebServiceURL = strWebServiceURL.replace('http://', '');
            $scope.Setting.BaseUrl = strBaseUrl.replace('/', '');
            $scope.returnLogin = function () {
                $state.go('login', { 'CheckUpdate': 'Y' }, { reload: true });
            };
            $scope.saveSetting = function () {
                if ($scope.Setting.WebServiceURL.length > 0) {
                    strWebServiceURL = $scope.Setting.WebServiceURL;
                    if (strWebServiceURL.length > 0) {
                        strWebServiceURL = "http://" + strWebServiceURL;
                    }
                } else { $scope.Setting.WebServiceURL = strWebServiceURL }
                if ($scope.Setting.BaseUrl.length > 0) {
                    strBaseUrl = $scope.Setting.BaseUrl;
                    if (strBaseUrl.length > 0) {
                        strBaseUrl = "/" + strBaseUrl;
                    }
                } else { $scope.Setting.BaseUrl = strBaseUrl }
                if ($scope.Setting.WebSiteUrl.length > 0) {
                    strWebSiteURL = $scope.Setting.WebSiteUrl;
                    if (strWebSiteURL.length > 0) {
                        strWebSiteURL = "http://" + strWebSiteURL;
                    }
                } else { $scope.Setting.WebSiteUrl = strWebSiteURL }
                var data = 'BaseUrl=' + $scope.Setting.BaseUrl + '##WebServiceURL=' + $scope.Setting.WebServiceURL + '##WebSiteURL=' + strWebSiteURL;
                var path = cordova.file.externalRootDirectory;
                var directory = "TmsApp";
                var file = directory + "/Config.txt";
                $cordovaFile.writeFile(path, file, data, true)
                .then(function (success) {
                    $state.go('login', { 'CheckUpdate': 'Y' }, { reload: true });
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
            $scope.delSetting = function () {
                var path = cordova.file.externalRootDirectory;
                var directory = "TmsApp";
                var file = directory + "/Config.txt";
                $cordovaFile.removeFile(path, file)
                .then(function (success) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Delete Config File Success.',
                        okType: 'button-calm'
                    });
                    $timeout(function () {
                        ionicMaterialInk.displayEffect();
                    }, 0);
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
        }]);

appControllers.controller('UpdateCtl',
        ['$scope', '$stateParams', '$state', '$timeout', '$ionicLoading', '$cordovaToast', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2',
        function ($scope, $stateParams, $state, $timeout, $ionicLoading, $cordovaToast, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2) {
            $scope.strVersion = $stateParams.Version;
            $scope.returnLogin = function () {
                $state.go('login', { 'CheckUpdate': 'N' }, { reload: true });
            };
            $scope.upgrade = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebSiteURL + "/FreightApp.apk";
                var blnError = false;
                $cordovaFile.checkFile(cordova.file.externalRootDirectory, "FreightApp.apk")
                .then(function (success) {
                    //
                }, function (error) {
                    blnError = true;
                });
                var targetPath = cordova.file.externalRootDirectory + "FreightApp.apk";
                var trustHosts = true;
                var options = {};
                if (!blnError) {
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                        $ionicLoading.hide();
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                            // success
                        }, function (err) {
                            // error
                        });
                    }, function (err) {
                        $cordovaToast.showShortCenter('Download faild.');
                        $ionicLoading.hide();
                        $state.go('login', { 'CheckUpdate': 'N' }, { reload: true });
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
                    $cordovaToast.showShortCenter('Check APK file faild.');
                    $state.go('login', { 'CheckUpdate': 'N' }, { reload: true });
                }
            };
        }]);

appControllers.controller('MainCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', '$cordovaBarcodeScanner', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, $cordovaBarcodeScanner, WebApiService) {
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
            // Set Motion
            //$timeout(function () {
            //    ionicMaterialMotion.slideup({
            //        selector: '.slide-up'
            //    });
            //}, 300);
            //$timeout(function () {
            //    ionicMaterialMotion.fadeSlideInRight({
            //        startVelocity: 3000
            //    });
            //}, 700);
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
            /*
            $scope.scanBarcode = function () {
                $cordovaBarcodeScanner.scan().then(function (imageData) {
                    alert(imageData.text);
                }, function (error) {
                    alert(error);
                });
            };
            */
        }]);

appControllers.controller('SalesmanActivityCtl',
        ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$ionicLoading', '$cordovaDialogs', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $ionicLoading, $cordovaDialogs, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            // initial echarts
            var myChart = echarts.init(document.getElementById('echartsPie'));
            var option = {
                title: {
                    text: 'Salesman',
                    subtext: 'Access Source',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['DA', 'EDM', 'ADs', 'VedioADs', 'SE']
                },
                toolbox: {
                    show: false,
                    feature: {
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                series: [
                    {
                        name: 'Access Source',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: 'DA' },
                            { value: 310, name: 'EDM' },
                            { value: 234, name: 'ADs' },
                            { value: 135, name: 'VedioADs' },
                            { value: 1548, name: 'SE' }
                        ]
                    }
                ]
            };
            myChart.setOption(option);
        }]);

appControllers.controller('ContactsCtl',
        ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$ionicLoading', '$cordovaDialogs', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $ionicLoading, $cordovaDialogs, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Rcbp = {
                BusinessPartyName: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToDetail = function (Rcbp1) {
                $state.go('contactsDetail', { 'TrxNo': Rcbp1.TrxNo }, { reload: true });
            };
            $('#txt-rcbp-list-BusinessPartyName').on('keydown', function (e) {
                if (e.which === 9 || e.which === 13) {
                    getRcbp1($scope.Rcbp.BusinessPartyName);
                }
            });
            var getRcbp1 = function (BusinessPartyName) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1";
                if (BusinessPartyName != null && BusinessPartyName.length > 0) {
                    strUri = strUri + "/" + $scope.Rcbp.BusinessPartyName;
                }
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.Rcbp1s = response.data.results;
                    $timeout(function () {
                        ionicMaterialMotion.blinds();
                        ionicMaterialInk.displayEffect();
                    }, 0);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            getRcbp1(null);
        }]);

appControllers.controller('ContactsDetailCtl',
        ['$scope', '$stateParams', '$state', '$http', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicModal', 'WebApiService',
        function ($scope, $stateParams, $state, $http, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, $ionicModal, WebApiService) {
            $scope.rcbpDetail = {};
            $scope.rcbp3Detail = {};
            $scope.rcbpDetail.TrxNo = $stateParams.TrxNo;
            $scope.returnList = function () {
                $state.go('contacts', {}, {});
            };
            $scope.GoToDetailEdit = function () {
                $state.go('contactsDetailEdit', { 'TrxNo': $scope.rcbpDetail.TrxNo }, { reload: true });
            };
            $scope.blnContainNameCard = function (rcbp3) {
                if (typeof (rcbp3) == "undefined") return false;
                if (typeof (rcbp3.NameCard) == "undefined") return false;
                if (rcbp3.NameCard.length > 0) {
                    return true;
                } else { return false; }
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp3?BusinessPartyCode=" + BusinessPartyCode;
                var onSuccess = function (response) {
                    $scope.rcbp3s = response.data.results;
                    $ionicLoading.hide();
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onError, OnFinally);
            };
            var GetRcbp1Detail = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1/trxNo/" + TrxNo;
                var onSuccess = function (response) {
                    $scope.rcbpDetail = response.data.results[0];
                    $ionicLoading.hide();
                    GetRcbp3s($scope.rcbpDetail.BusinessPartyCode);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            GetRcbp1Detail($scope.rcbpDetail.TrxNo);
            $ionicModal.fromTemplateUrl('rcbp3Detail.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });//Cleanup the modal when done with it!
            $scope.openModal = function (rcbp3) {
                $scope.rcbp3Detail = rcbp3;
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
        }]);

appControllers.controller('ContactsDetailEditCtl',
        ['$scope', '$stateParams', '$state', '$http', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $stateParams, $state, $http, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.rcbpDetail = {};
            $scope.rcbp3Detail = {};
            $scope.rcbpDetail.TrxNo = $stateParams.TrxNo;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo': $scope.rcbpDetail.TrxNo }, { reload: true });
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp3?BusinessPartyCode=" + BusinessPartyCode;
                var onSuccess = function (response) {
                    $scope.rcbp3s = response.data.results;
                    $ionicLoading.hide();
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onError, OnFinally);
            };
            var GetRcbp1Detail = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1/trxNo/" + TrxNo;
                var onSuccess = function (response) {
                    $scope.rcbpDetail = response.data.results[0];
                    $ionicLoading.hide();
                    GetRcbp3s($scope.rcbpDetail.BusinessPartyCode);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            GetRcbp1Detail($scope.rcbpDetail.TrxNo);
            $scope.returnUpdateRcbp1 = function () {
                $ionicLoading.show();
                var jsonData = { "rcbp1": $scope.rcbpDetail };
                var strUri = "/api/freight/rcbp1";
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.returnDetail();
                };
                var onError = function () {
                    $ionicLoading.hide();
                };
                WebApiService.Post(strUri, jsonData, onSuccess, onError);
            };
        }]);

appControllers.controller('PaymentApprovalCtl',
        ['$scope', '$http', '$timeout', '$state', '$ionicHistory', '$ionicLoading', '$ionicPopup', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $timeout, $state, $ionicHistory, $ionicLoading, $ionicPopup, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.plcp1 = {};
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.showApproval = function () {
                var alertPopup = $ionicPopup.alert({
                    title: "Approval Success!",
                    okType: 'button-calm'
                });
                $timeout(function () {
                    ionicMaterialInk.displayEffect();
                }, 0);
                $timeout(function () {
                    alertPopup.close();
                }, 2500);
            };
            $scope.plcpStatus = { text: "USE", checked: false };
            $scope.plcpStatusChange = function () {
                if ($scope.plcpStatus.checked) {
                    $scope.plcpStatus.text = "APP";
                } else {
                    $scope.plcpStatus.text = "USE";
                }
                //
                getPlcp1(null, null, $scope.plcpStatus.text);
            };
            $scope.refreshRcbp1 = function (BusinessPartyName) {
                var strUri = "/api/freight/rcbp1/" + BusinessPartyName;
                var onSuccess = function (response) {
                    $scope.Rcbp1s = response.data.results;
                };
                WebApiService.Get(strUri, onSuccess);
            };
            $scope.funcShowDatetime = function (utc) {
                if (typeof (utc) === 'undefined') return ''
                var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
                var newDate = new Date(utcDate);
                if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                    return newDate.Format('yyyy-MM-dd hh:mm');
                } else {
                    return '';
                }
            };
            var getPlcp1 = function (VoucherNo, VendorName, StatusCode) {
                $ionicLoading.show();
                var strUri = "/api/freight/plcp1";
                if (VoucherNo != null && VoucherNo.length > 0) {
                    strUri = strUri + "/VoucherNo/" + VoucherNo;
                }else if (VendorName != null && VendorName.length > 0) {
                    strUri = strUri + "/VendorName/" + VendorName;
                }
                if (StatusCode != null && StatusCode.length > 0) {
                    strUri = strUri + "/" + StatusCode;
                }
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.Plcp1s = response.data.results;
                    $timeout(function () {
                        ionicMaterialMotion.blinds();
                        ionicMaterialInk.displayEffect();
                    }, 0);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onFinally);
            };
            getPlcp1(null, null, $scope.plcpStatus.text);
        }]);

appControllers.controller('VesselScheduleCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
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
                    strUri = strUri + "/" + PortOfDischargeName;
                }
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.PortOfDischargeNames = response.data.results;
                    $timeout(function () {
                        ionicMaterialMotion.ripple();
                        ionicMaterialInk.displayEffect();
                    }, 0);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onFinally);
            };
            getRcvy1(null);
        }]);

appControllers.controller('VesselScheduleDetailCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Rcvy1Detail = {
                PortOfDischargeName : $stateParams.PortOfDischargeName
            };
            $scope.returnList = function () {
                $state.go('vesselSchedule', {}, {});
            };
            $scope.funcShowDate= function (utc) {
                if (typeof (utc) === 'undefined') return ''
                var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
                var newDate = new Date(utcDate);
                if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                    return newDate.Format('dd-NNN-yyyy');
                } else {
                    return '';
                }
            };
			$scope.funcShowDatetime = function (utc) {
                if (typeof (utc) === 'undefined') return ''
                var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
                var newDate = new Date(utcDate);
                if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                    return newDate.Format('dd-NNN-yyyy HH:mm');
                } else {
                    return '';
                }
            };
            var getRcvy1 = function (PortOfDischargeName) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcvy1/sps/" + PortOfDischargeName;
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.Rcvy1s = response.data.results;
                    $timeout(function () {
                        ionicMaterialMotion.ripple();
                        ionicMaterialInk.displayEffect();
                    }, 0);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onFinally);
            };
            getRcvy1($scope.Rcvy1Detail.PortOfDischargeName);
        }]);

appControllers.controller('ShipmentStatusCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Tracking = {
                ContainerNo: '',
                JobNo: '',
                BLNo: '',
                AWBNo: '',
                OrderNo: '',
                ReferenceNo: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            var getSearchResult = function (FilterName, FilterValue) {
                $ionicLoading.show();
                var strUri = "";
                var onSuccess = null;
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                if (FilterName === 'ContainerNo') {
                    strUri = "/api/freight/tracking/ContainerNo/count/" + FilterValue;
                    onSuccess = function (response) {
                        $ionicLoading.hide();
                        if (response.data.results.length > 1) {
                            $state.go('shipmentStatusList', { 'FilterName': FilterName, 'FilterValue': FilterValue }, { reload: true });
                        } else if (response.data.results.length === 1) {
                            $state.go('shipmentStatusDetail', { 'FilterName': FilterName, 'FilterValue': FilterValue, 'ModuleCode': response.data.results[0].ModuleCode }, { reload: true });
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'No Records Found.',
                                okType: 'button-assertive'
                            });
                            $timeout(function () {
                                alertPopup.close();
                            }, 2500);
                        }
                    };
                } else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'No Records Found.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                    return;
                    //To-Do
                }
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            $scope.GoToDetail = function (FilterName) {
                var FilterValue = '';
                if (FilterName === 'ContainerNo') { FilterValue = $scope.Tracking.ContainerNo }
                else if (FilterName === 'JobNo') { FilterValue = $scope.Tracking.JobNo }
                else if (FilterName === 'BLNo') { FilterValue = $scope.Tracking.BLNo }
                else if (FilterName === 'AWBNo') { FilterValue = $scope.Tracking.AWBNo }
                else if (FilterName === 'OrderNo') { FilterValue = $scope.Tracking.OrderNo }
                else if (FilterName === 'ReferenceNo') { FilterValue = $scope.Tracking.ReferenceNo }
                if (FilterValue.length > 0) {
                    getSearchResult(FilterName, FilterValue);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: FilterName + ' is Empty.',
                        okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.blinds();
            }, 0);
        }]);

appControllers.controller('ShipmentStatusListCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.List = {};
            $scope.List.FilterName = $stateParams.FilterName;
            $scope.List.FilterValue = $stateParams.FilterValue;
            $scope.returnShipmentStatus = function () {
                $state.go('shipmentStatus', {}, {});
            };
            $scope.funcShowDatetime = function (utc) {
                if (typeof (utc) === 'undefined') return ''
                var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
                var newDate = new Date(utcDate);
                if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
                    return newDate.Format('dd-NNN-yyyy');
                } else {
                    return '';
                }
            };
            var getJmjm1 = function (FilterName, FilterValue) {
                $ionicLoading.show();
                var strUri = '';
                var onSuccess = null;
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                if (FilterName === 'ContainerNo') {
                    strUri = '/api/freight/tracking/ContainerNo/' + FilterValue;
                    onSuccess = function (response) {
                        $ionicLoading.hide();
                        $scope.Jmjm1s = response.data.results;
                        $timeout(function () {
                            ionicMaterialMotion.blinds();
                            ionicMaterialInk.displayEffect();
                        }, 0);
                    };
                }
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            getJmjm1($scope.List.FilterName, $scope.List.FilterValue);
        }]);

appControllers.controller('ShipmentStatusDetailCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Detail = {};
            $scope.Detail.FilterName = $stateParams.FilterName;
            $scope.Detail.FilterValue = $stateParams.FilterValue;
            $scope.returnList = function () {
                $state.go('shipmentStatus', {}, { reload: true });
            };
            $scope.items= [
                { JobNo: 'SESIN0905182-00', BLNo: 'SESIN0905182-00', RefNo: 'RN0907033', ETD: '04/11/2015', ETA: '07/11/2015', Origin: 'XMN', Destination: 'SIN', Vessel: 'S A ORANJE 123', Pcs: '100', Weight: '1000', Volume: '1000', Status: 'USE' },
                { JobNo: 'SESIN1511137-02', BLNo: 'SESIN1511137-02', RefNo: 'RN1511051', ETD: '04/11/2015', ETA: '07/11/2015', Origin: 'SIN', Destination: 'XMN', Vessel: 'KADIMA', Pcs: '500', Weight: '50,000', Volume: '50,000', Status: 'USE' }
            ];
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

appControllers.controller('InvoiceCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            $scope.download = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebServiceURL + "/mobileapp/INVOICE.pdf";
                var blnError = false;
                if (window.cordova) {
                    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "INVOICE.pdf")
                    .then(function (success) {
                        //
                    }, function (error) {
                        blnError = true;
                    });
                    var targetPath = cordova.file.externalRootDirectory + "INVOICE.pdf";
                    var trustHosts = true;
                    var options = {};
                    if (!blnError) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            $ionicLoading.hide();
                            $cordovaFileOpener2.open(targetPath, 'application/pdf'
                            ).then(function () {
                                // success
                            }, function (err) {
                                // error
                            });
                        }, function (err) {
                            $cordovaToast.showShortCenter('Download faild.');
                            $ionicLoading.hide();
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
                        $cordovaToast.showShortCenter('Download PDF file faild.');
                    }
                } else {
                    $ionicLoading.hide();
                    window.open(url);               
                }                
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

appControllers.controller('BlCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            $scope.download = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebServiceURL + "/mobileapp/HOUSE-BL.pdf";
                var blnError = false;
                if (window.cordova) {
                    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "HOUSE-BL.pdf")
                    .then(function (success) {
                        //
                    }, function (error) {
                        blnError = true;
                    });
                    var targetPath = cordova.file.externalRootDirectory + "HOUSE-BL.pdf";
                    var trustHosts = true;
                    var options = {};
                    if (!blnError) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            $ionicLoading.hide();
                            $cordovaFileOpener2.open(targetPath, 'application/pdf'
                            ).then(function () {
                                // success
                            }, function (err) {
                                // error
                            });
                        }, function (err) {
                            $cordovaToast.showShortCenter('Download faild.');
                            $ionicLoading.hide();
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
                        $cordovaToast.showShortCenter('Download PDF file faild.');
                    }
                } else {
                    $ionicLoading.hide();
                    window.open(url);
                }
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

appControllers.controller('AwbCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            $scope.download = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebServiceURL + "/mobileapp/AWB.pdf";
                var blnError = false;
                if (window.cordova) {
                    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "AWB.pdf")
                    .then(function (success) {
                        //
                    }, function (error) {
                        blnError = true;
                    });
                    var targetPath = cordova.file.externalRootDirectory + "AWB.pdf";
                    var trustHosts = true;
                    var options = {};
                    if (!blnError) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            $ionicLoading.hide();
                            $cordovaFileOpener2.open(targetPath, 'application/pdf'
                            ).then(function () {
                                // success
                            }, function (err) {
                                // error
                            });
                        }, function (err) {
                            $cordovaToast.showShortCenter('Download faild.');
                            $ionicLoading.hide();
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
                        $cordovaToast.showShortCenter('Download PDF file faild.');
                    }
                } else {
                    $ionicLoading.hide();
                    window.open(url);
                }
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

appControllers.controller('SOACtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            $scope.download = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebServiceURL + "/mobileapp/CUSTOMER-STATEMENT.pdf";
                var blnError = false;
                if (window.cordova) {
                    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "CUSTOMER-STATEMENT.pdf")
                    .then(function (success) {
                        //
                    }, function (error) {
                        blnError = true;
                    });
                    var targetPath = cordova.file.externalRootDirectory + "CUSTOMER-STATEMENT.pdf";
                    var trustHosts = true;
                    var options = {};
                    if (!blnError) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            $ionicLoading.hide();
                            $cordovaFileOpener2.open(targetPath, 'application/pdf'
                            ).then(function () {
                                // success
                            }, function (err) {
                                // error
                            });
                        }, function (err) {
                            $cordovaToast.showShortCenter('Download faild.');
                            $ionicLoading.hide();
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
                        $cordovaToast.showShortCenter('Download PDF file faild.');
                    }
                } else {
                    $ionicLoading.hide();
                    window.open(url);
                }
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

appControllers.controller('MemoCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.Memo = {
                MemoInfo : 'Hello this is sysmagic mobile support'
            };
        }]);

appControllers.controller('ReminderCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { id: 1, Subject: 'Payment Voucher need Approve', Message: 'Please help to approve the ref no : PV15031841', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 14,2015', DueTime: '11:20' },
                { id: 2, Subject: 'Email to Henry', Message: 'Need email to henry for the new request for the mobile at the monring.', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 16,2015', DueTime: '09:20' }
            ];
        }]);