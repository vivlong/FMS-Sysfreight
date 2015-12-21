appControllers.controller('ReminderCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { id: 1, Subject: 'Payment Voucher need Approve', Message: 'Please help to approve the ref no : PV15031841', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 14,2015', DueTime: '11:20' },
                { id: 2, Subject: 'Email to Henry', Message: 'Need email to henry for the new request for the mobile at the monring.', CreateBy: 'S', UserID: 'S', DueDate: 'Nov 16,2015', DueTime: '09:20' }
            ];
        }]);