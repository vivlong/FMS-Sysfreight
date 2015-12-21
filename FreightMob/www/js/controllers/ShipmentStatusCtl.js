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
                ionicMaterialMotion.blinds();
                ionicMaterialInk.displayEffect();
            }, 0);
        }]);

