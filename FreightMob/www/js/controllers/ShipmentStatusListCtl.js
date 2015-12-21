appControllers.controller('ShipmentStatusListCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            var RecordCount = 0;
			var dataResults = new Array();
			$scope.List = {
				FilterName:		$stateParams.FilterName,
				FilterValue:	$stateParams.FilterValue,
				moreDataCanBeLoaded: true
			};
            $scope.returnShipmentStatus = function () {
                $state.go('shipmentStatus', {}, {});
            };
			$scope.GoToDetail = function (Jmjm1) {
				$state.go('shipmentStatusDetail', { 'FilterName': $scope.List.FilterName, 'FilterValue': Jmjm1.JobNo, 'ModuleCode': Jmjm1.ModuleCode }, { reload: true });    
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
				if(FilterName === $scope.List.FilterName){
					return true;
				}else { return false; }				
			};
			$scope.funcLoadMore = function() {
				if ($scope.List.FilterName === 'ContainerNo') {
					var strUri = '/api/freight/tracking/ContainerNo/sps/' + RecordCount + '/' + $scope.List.FilterValue;				
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
						runMaterial();
					};
					WebApiService.Get(strUri, onSuccess, onError, onFinally);
				}
			};
			var runMaterial = function () {
				$timeout(function () {
					ionicMaterialMotion.blinds();
					ionicMaterialInk.displayEffect();
				}, 0);
			};
        }]);

