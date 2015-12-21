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

