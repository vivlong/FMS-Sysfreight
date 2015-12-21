appControllers.controller('VesselScheduleDetailCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Rcvy1Detail = {
                PortOfDischargeName : $stateParams.PortOfDischargeName
            };
            $scope.returnList = function () {
                $state.go('vesselSchedule', {}, {});
            };
            $scope.ShowDate= function (utc) {
				if (typeof (utc) === 'undefined') return ''
				var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
				var newDate = new Date(utcDate);
				if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
					return newDate.Format('dd-NNN-yyyy');
				} else {
					return '';
				}
			};$scope.ShowDatetime= function (utc) {
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

