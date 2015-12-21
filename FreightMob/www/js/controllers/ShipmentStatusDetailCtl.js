appControllers.controller('ShipmentStatusDetailCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicHistory', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.Detail = {};
            $scope.Detail.FilterName = $stateParams.FilterName;
            $scope.Detail.FilterValue = $stateParams.FilterValue;
			$scope.Detail.ModuleCode = $stateParams.ModuleCode;
            $scope.returnList = function () {
				if ($ionicHistory.backView()) {
					$ionicHistory.goBack();
				}else{
					$state.go('shipmentStatus', {}, {});
				}
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
			};
			$scope.ShowDatetime= function (utc) {
				if (typeof (utc) === 'undefined') return ''
				var utcDate = Number(utc.substring(utc.indexOf('(') + 1, utc.lastIndexOf('-')));
				var newDate = new Date(utcDate);
				if (newDate.getUTCFullYear() < 2166 && newDate.getUTCFullYear() > 1899) {
					return newDate.Format('dd-NNN-yyyy HH:mm');
				} else {
					return '';
				}
			};			
			$scope.funcShowLabel = function(FilterName){
				if(FilterName === $scope.Detail.FilterName){
					return true;
				}else { return false; }				
			};
            var getJmjm1 = function (FilterName, FilterValue, ModuleCode) {
                $ionicLoading.show();
                var strUri = '';
                var onSuccess = null;
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                if (FilterName === 'ContainerNo') {
                    strUri = '/api/freight/tracking/ContainerNo/' + ModuleCode + '/' + FilterValue;
                    onSuccess = function (response) {
                        $scope.Jmjm1s = response.data.results;
                        runMaterial();
                    };
                }
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            getJmjm1($scope.Detail.FilterName, $scope.Detail.FilterValue, $scope.Detail.ModuleCode);
			var runMaterial = function () {
				$timeout(function () {
					ionicMaterialMotion.blinds();
					ionicMaterialInk.displayEffect();
				}, 0);
			};
        }]);

