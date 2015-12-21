appControllers.controller('ContactsListCtl',
        ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$ionicLoading', '$ionicScrollDelegate', '$cordovaDialogs', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
			var RecordCount = 0;
			var dataResults = new Array();
			$scope.Rcbp = {
                BusinessPartyName: $stateParams.BusinessPartyName,
				moreDataCanBeLoaded: true
            };
            $scope.returnSearch = function () {
                $state.go('contacts', {}, {});
            };
            $scope.GoToDetail = function (Rcbp1) {
                $state.go('contactsDetail', { 'TrxNo': Rcbp1.TrxNo }, { reload: true });
            };
			$scope.loadMore = function() {
				var strUri = "/api/freight/rcbp1/sps/" + RecordCount;
				if ($scope.Rcbp.BusinessPartyName != null && $scope.Rcbp.BusinessPartyName.length > 0) {
                    strUri = strUri + "/" + $scope.Rcbp.BusinessPartyName;
                }
                var onSuccess = function (response) {
					if(response.data.results.length > 0){
						dataResults = dataResults.concat(response.data.results);
						$scope.Rcbp1s = dataResults;
						RecordCount = RecordCount + 20;
						$scope.Rcbp.moreDataCanBeLoaded = true;
					}else{
						$scope.Rcbp.moreDataCanBeLoaded = false;
					}
                };
				var onError = function (response) {
                };
                var onFinally = function (response) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					runMaterial();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
			};
            var getRcbp1 = function (BusinessPartyName) {
                $ionicLoading.show();
				RecordCount = 0;				
				$scope.Rcbp.moreDataCanBeLoaded = true;
				dataResults = new Array();
                $scope.Rcbp1s = dataResults;
                var strUri = "/api/freight/rcbp1/sps/" + RecordCount;
                if (BusinessPartyName != null && BusinessPartyName.length > 0) {
                    strUri = strUri + "/" + $scope.Rcbp.BusinessPartyName;
                }
                var onSuccess = function (response) {
					if(response.data.results.length > 0){
						dataResults = dataResults.concat(response.data.results);
						RecordCount = RecordCount + 20;                    
                        $scope.Rcbp.moreDataCanBeLoaded = true;
					}
					$scope.Rcbp1s = dataResults;
                };
                var onError = function (response) {
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
					runMaterial();
                    $ionicScrollDelegate.scrollTop();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
			var runMaterial = function () {
				$timeout(function () {
					ionicMaterialMotion.blinds();
					ionicMaterialInk.displayEffect();
				}, 0);
			};
        }]);

