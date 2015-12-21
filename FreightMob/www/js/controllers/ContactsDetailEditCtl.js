appControllers.controller('ContactsDetailEditCtl',
        ['$scope', '$stateParams', '$state', '$http', '$timeout', '$ionicLoading', '$ionicPopup', 'WebApiService',
        function ($scope, $stateParams, $state, $http, $timeout, $ionicLoading, $ionicPopup, WebApiService) {
            $scope.rcbpDetail = {};
            $scope.rcbp3Detail = {};
            $scope.rcbpDetail.TrxNo = $stateParams.TrxNo;
            $scope.returnDetail = function () {
                $state.go('contactsDetail', { 'TrxNo': $scope.rcbpDetail.TrxNo }, { reload: true });
            };
            var GetRcbp3s = function (BusinessPartyCode) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp3?BusinessPartyCode=" + BusinessPartyCode;
                var onSuccess = function (response) {
                    $scope.rcbp3s = response.data.results;
                    $ionicLoading.hide();
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.GetParam(strUri, onSuccess, onError, OnFinally);
            };
            var GetRcbp1Detail = function (TrxNo) {
                $ionicLoading.show();
                var strUri = "/api/freight/rcbp1/trxNo/" + TrxNo;
                var onSuccess = function (response) {
                    $scope.rcbpDetail = response.data.results[0];
                    $ionicLoading.hide();
                    GetRcbp3s($scope.rcbpDetail.BusinessPartyCode);
                };
                var onError = function (response) {
                    $ionicLoading.hide();
                };
                var onFinally = function (response) {
                    $ionicLoading.hide();
                };
                WebApiService.Get(strUri, onSuccess, onError, onFinally);
            };
            GetRcbp1Detail($scope.rcbpDetail.TrxNo);
            $scope.returnUpdateRcbp1 = function () {
                $ionicLoading.show();
                var jsonData = { "rcbp1": $scope.rcbpDetail };
                var strUri = "/api/freight/rcbp1";
                var onSuccess = function (response) {
                    $ionicLoading.hide();
                    $scope.returnDetail();
                };
                var onError = function () {
                    $ionicLoading.hide();
                };
                WebApiService.Post(strUri, jsonData, onSuccess, onError);
            };
        }]);

