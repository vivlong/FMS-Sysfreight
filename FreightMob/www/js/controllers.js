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
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    sessionStorage.clear();
                    sessionStorage.setItem("UserId", $scope.logininfo.strUserName);
                    //Add JPush RegistradionID
                    if (blnMobilePlatform) {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                    }
                    $state.go('main', {}, { reload: true });
                };
                var onError = function () {
                    $ionicLoading.hide();
                };
                var onFinally = function () {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
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
        ['$scope', '$http', '$state', '$stateParams', '$timeout', '$ionicPopup', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $timeout, $ionicPopup, WebApiService) {
            $scope.GoToSA = function () {
                $state.go('salesmanActivity', {}, { reload: true });
            };
            $scope.GoToRcbp = function () {
                $state.go('contacts', {}, { reload: true });
            };
            $scope.GoToPa = function () {
                //$state.go('paymentApproval', {}, { reload: true });
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
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaDialogs', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $cordovaDialogs, WebApiService) {
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

appControllers.controller('ContactsCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaDialogs', 'WebApiService', 'ContactsParam',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $cordovaDialogs, WebApiService, ContactsParam) {
            $scope.Rcbp = {
                BusinessPartyNameLike: ''
            };
            ContactsParam.Init();
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                ContactsParam.SetList($scope.Rcbp.BusinessPartyNameLike);
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
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$cordovaDialogs', 'WebApiService', 'ContactsParam',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $cordovaDialogs, WebApiService, ContactsParam) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.ContactsList = ContactsParam.GetList();
            if($scope.ContactsList.BusinessPartyNameLike === ''){
                $scope.ContactsList.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
            }
            $scope.ContactsList.CanLoadedMoreData = true;
            $scope.returnSearch = function () {
                $state.go('contacts', {}, {});
            };
            $scope.GoToDetail = function (Rcbp1) {
                ContactsParam.SetDetial($scope.ContactsList.BusinessPartyNameLike, Rcbp1.TrxNo);
                $state.go('contactsDetail', { 'TrxNo': Rcbp1.TrxNo, 'BusinessPartyNameLike': $stateParams.BusinessPartyNameLike }, { reload: true });
            };
            $scope.loadMore = function() {
                var strUri = "/api/freight/rcbp1/sps?RecordCount=" + RecordCount;
                if ($scope.ContactsList.BusinessPartyNameLike != null && $scope.ContactsList.BusinessPartyNameLike.length > 0) {
                    strUri = strUri + "&BusinessPartyName=" + $scope.ContactsList.BusinessPartyNameLike;
                }
                var onSuccess = function (response) {
                    if(response.data.results.length > 0){
                        dataResults = dataResults.concat(response.data.results);
                        $scope.Rcbp1s = dataResults;
                        RecordCount = RecordCount + 20;
                        $scope.ContactsList.CanLoadedMoreData = true;
                    }else{
                        $scope.ContactsList.CanLoadedMoreData = false;
                    }
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                };
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
            };
        }]);

appControllers.controller('ContactsDetailCtrl',
        ['$scope', '$stateParams', '$state', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicModal', 'DateTimeService', 'WebApiService', 'ContactsParam',
        function ($scope, $stateParams, $state, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, $ionicModal, DateTimeService, WebApiService, ContactsParam) {
            $scope.ContactsDetail = ContactsParam.GetDetial();
            if($scope.ContactsDetail.TrxNo === ''){
                $scope.ContactsDetail.TrxNo = $stateParams.TrxNo;
            }
            if($scope.ContactsDetail.BusinessPartyNameLike === ''){
                $scope.ContactsDetail.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
            }
            $scope.ContactsDetail.CanAddInfos = false;
            $scope.rcbpDetail = {};
            $scope.rcbp3Detail = {};
            $scope.returnList = function () {
                $scope.ContactsList = ContactsParam.GetList();
                if($scope.ContactsList.BusinessPartyNameLike === ''){
                    $scope.ContactsList.BusinessPartyNameLike = $stateParams.BusinessPartyNameLike;
                }
                $state.go('contactsList', { 'BusinessPartyNameLike': $scope.ContactsList.BusinessPartyNameLike }, {});
            };
            $scope.TabClick = function (TabIndex) {
                if(TabIndex === 1){
                    $scope.ContactsDetail.CanAddInfos = false;
                }else{
                    $scope.ContactsDetail.CanAddInfos = true;
                }
            };
            $scope.GoToDetailEdit = function () {
                $state.go('contactsDetailEdit', { 'TrxNo': $scope.ContactsDetail.TrxNo }, { reload: true });
            };
            $scope.GoToContactEdit = function (rcbp3) {
                $state.go('contactsInfoEdit', { 'BusinessPartyCode': rcbp3.BusinessPartyCode, 'LineItemNo': rcbp3.LineItemNo }, { reload: true });
            };
            $scope.GoToContactDel = function (index,rcbp3) {
                var strUri = "/api/freight/rcbp3/delete?BusinessPartyCode=" + rcbp3.BusinessPartyCode + "&LineItemNo=" + rcbp3.LineItemNo;
                var onSuccess = function (response) {
                    if(response.data.results > 0){
                        $scope.rcbp3s.splice(index, 1);
                    }
                };
                WebApiService.GetParam(strUri, onSuccess, null, null);
            };
            $scope.GoToContactAdd = function () {
                $state.go('contactsInfoAdd', { 'TrxNo': $scope.rcbpDetail.TrxNo, 'BusinessPartyName': $stateParams.BusinessPartyName }, { reload: true });
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
            var onFinally = function (response) {
                $ionicLoading.hide();
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp3?BusinessPartyCode=" + BusinessPartyCode;
                var onSuccess = function (response) {
                    $scope.rcbp3s = response.data.results;
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
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
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            GetRcbp1Detail($scope.ContactsDetail.TrxNo);
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
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
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

appControllers.controller('ContactsInfoAddCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            var TrxNo = $stateParams.TrxNo;
            var LineItemNo = $stateParams.LineItemNo;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo': TrxNo,'BusinessPartyName': BusinessPartyName }, { reload: true });
            };
        }]);

appControllers.controller('ContactsInfoEditCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            var BusinessPartyCode = $stateParams.BusinessPartyCode;
            var LineItemNo = $stateParams.LineItemNo;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', {}, { reload: true });
            };
        }]);

appControllers.controller('PaymentApprovalCtrl',
        ['$scope', '$state', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService',
        function ($scope, $state, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, DateTimeService, WebApiService) {
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
                var strUri = "/api/freight/rcbp1?BusinessPartyName=" + BusinessPartyName;
                var onSuccess = function (response) {
                    $scope.Rcbp1s = response.data.results;
                };
                WebApiService.GetParam(strUri, onSuccess);
            };
            $scope.funcShowDatetime = function (utc) {
                return DateTimeService.ShowDatetime(utc);
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
                    $scope.Plcp1s = response.data.results;
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onFinally);
            };
            getPlcp1(null, null, $scope.plcpStatus.text);
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
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.PortOfDischargeNames = response.data.results;
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                var strUri = "/api/freight/rcvy1";
                if (PortOfDischargeName != null && PortOfDischargeName.length > 0) {
                    strUri = strUri + "?PortOfDischargeName=" + PortOfDischargeName;
                    WebApiService.GetParam(strUri, onSuccess, onFinally);
                } else {
                    WebApiService.Get(strUri, onSuccess, onFinally);
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
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.Rcvy1s = response.data.results;
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onFinally);
            };
            getRcvy1($scope.Rcvy1Detail.PortOfDischargeName);
        }]);

appControllers.controller('ShipmentStatusCtrl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService', 'ShipmentStatusFilter',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, WebApiService, ShipmentStatusFilter) {
            $scope.Tracking = {
                ContainerNo: '',
                JobNo: '',
                BLNo: '',
                AWBNo: '',
                OrderNo: '',
                ReferenceNo: ''
            };
            ShipmentStatusFilter.Init('','');
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            var getSearchResult = function (FilterName, FilterValue) {
                $ionicLoading.show();
                var strUri = "";
                var onSuccess = null;
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                var onNoRecords = function () {
                    var alertPopup = $ionicPopup.alert({
                            title: 'No Records Found.',
                            okType: 'button-assertive'
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                };
                strUri = '/api/freight/tracking/count?FilterName=' + FilterName + '&FilterValue=' + FilterValue;
                onSuccess = function (response) {
                    $ionicLoading.hide();
                    if (response.data.results > 1) {
                        ShipmentStatusFilter.SetList(FilterName, FilterValue);
                        $state.go('shipmentStatusList', { 'FilterName':FilterName, 'FilterValue':FilterValue }, { reload: true });
                    } else if (response.data.results === 1) {
                        $ionicLoading.show();
                        if (FilterName === 'OrderNo') {
                            ShipmentStatusFilter.SetDetial(FilterName, FilterValue, '4');
                            $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'FilterValue':FilterValue, 'ModuleCode':'4' }, { reload: true });
                        } else{
                            strUri = '/api/freight/tracking/sps?FilterName=' + FilterName + '&RecordCount=0&FilterValue=' + FilterValue;
                            onSuccess = function (response) {
                                if(response.data.results.length > 0){
                                    ShipmentStatusFilter.SetDetial(FilterName, response.data.results[0].JobNo, response.data.results[0].ModuleCode);
                                    $state.go('shipmentStatusDetail', { 'FilterName':FilterName, 'FilterValue':response.data.results[0].JobNo, 'ModuleCode':response.data.results[0].ModuleCode }, { reload: true });
                                }
                            };
                            WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
                        }
                    } else {
                        onNoRecords();
                    }
                };
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
            };
            $scope.GoToDetail = function (TypeName) {
                var FilterName = '';
                var FilterValue = '';
                if (TypeName === 'Container No') { FilterValue = $scope.Tracking.ContainerNo; FilterName = 'ContainerNo'}
                else if (TypeName === 'Job No') { FilterValue = $scope.Tracking.JobNo; FilterName = 'JobNo'}
                else if (TypeName === 'BL No') { FilterValue = $scope.Tracking.BLNo; FilterName = 'AwbBlNo'}
                else if (TypeName === 'AWB No') { FilterValue = $scope.Tracking.AWBNo; FilterName = 'AwbBlNo'}
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
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService', 'ShipmentStatusFilter',
        function ($scope, $state, $stateParams, $timeout, $ionicLoading, $ionicPopup, DateTimeService, WebApiService, ShipmentStatusFilter) {
            var RecordCount = 0;
            var dataResults = new Array();
            $scope.Filter = ShipmentStatusFilter.GetList();
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
                ShipmentStatusFilter.SetDetial($scope.Filter.FilterName, Jmjm1.JobNo, Jmjm1.ModuleCode)
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
                var onSuccess = function (response) {
                    if(response.data.results.length > 0){
                        dataResults = dataResults.concat(response.data.results);
                        $scope.Jmjm1s = dataResults;
                        RecordCount = RecordCount + 20;
                        $scope.List.moreDataCanBeLoaded = true;
                    }else{
                        $scope.List.moreDataCanBeLoaded = false;
                    }
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                };
                WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
            };
        }]);

appControllers.controller('ShipmentStatusDetailCtrl',
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', 'DateTimeService', 'WebApiService', 'ShipmentStatusFilter',
        function ($scope, $state, $stateParams, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, DateTimeService, WebApiService, ShipmentStatusFilter) {
            $scope.Detail = ShipmentStatusFilter.GetDetial();
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
                    onSuccess = function (response) {
                        $scope.Omtx1s = response.data.results;
                    };
                    WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
                };
                getOmtx1($scope.Detail.FilterName, $scope.Detail.FilterValue);
            }else{
                var getJmjm1 = function (FilterName, FilterValue, ModuleCode) {
                    $ionicLoading.show();
                    strUri = '/api/freight/tracking?FilterName=' + FilterName + '&ModuleCode=' + ModuleCode + '&FilterValue=' + FilterValue;
                    onSuccess = function (response) {
                        $scope.Jmjm1s = response.data.results;
                    };
                    WebApiService.GetParam(strUri, onSuccess, onError, onFinally);
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
        ['$scope', '$state', '$stateParams', '$timeout', '$ionicPopup', 'WebApiService',
        function ($scope, $state, $stateParams, $timeout, $ionicPopup, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.Memo = {
                MemoInfo : 'Hello this is sysmagic mobile support'
            };
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
