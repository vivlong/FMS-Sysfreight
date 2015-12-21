appControllers.controller('MainCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', '$cordovaBarcodeScanner', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, $cordovaBarcodeScanner, WebApiService) {
            $scope.GoToSA = function () {
                $state.go('salesmanActivity', {}, { reload: true });
            };
            $scope.GoToRcbp = function () {
                $state.go('contacts', {}, { reload: true });
            };
            $scope.GoToPa = function () {
                $state.go('paymentApproval', {}, { reload: true });
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
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);			
            /*
            // Set Motion
            //$timeout(function () {
            //    ionicMaterialMotion.slideup({
            //        selector: '.slide-up'
            //    });
            //}, 300);
            //$timeout(function () {
            //    ionicMaterialMotion.fadeSlideInRight({
            //        startVelocity: 3000
            //    });
            //}, 700);
            $scope.scanBarcode = function () {
                $cordovaBarcodeScanner.scan().then(function (imageData) {
                    alert(imageData.text);
                }, function (error) {
                    alert(error);
                });
            };
            */
        }]);

