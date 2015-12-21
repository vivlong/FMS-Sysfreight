appControllers.controller('ContactsCtl',
        ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$ionicLoading', '$ionicScrollDelegate', '$cordovaDialogs', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
			$scope.Rcbp = {
                BusinessPartyName: ''
            };
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.GoToList = function () {
                $state.go('contactsList', { 'BusinessPartyName': $scope.Rcbp.BusinessPartyName }, { reload: true });
            };
			var runMaterial = function () {
				$timeout(function () {
					ionicMaterialMotion.blinds();
					ionicMaterialInk.displayEffect();
				}, 0);
			};
			runMaterial();
        }]);

