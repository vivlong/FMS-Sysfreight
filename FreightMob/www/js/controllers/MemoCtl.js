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

