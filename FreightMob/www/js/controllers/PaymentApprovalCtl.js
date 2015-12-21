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

