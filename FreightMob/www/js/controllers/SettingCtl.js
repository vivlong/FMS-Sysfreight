appControllers.controller('SettingCtl',
        ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaToast', '$cordovaFile',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, $cordovaToast, $cordovaFile) {
            $scope.Setting = {};
            $scope.Setting.WebServiceURL = strWebServiceURL.replace('http://', '');
            $scope.Setting.BaseUrl = strBaseUrl.replace('/', '');
            $scope.returnLogin = function () {
                $state.go('login', { 'CheckUpdate': 'Y' }, { reload: true });
            };
            $scope.saveSetting = function () {
                if ($scope.Setting.WebServiceURL.length > 0) {
                    strWebServiceURL = $scope.Setting.WebServiceURL;
                    if (strWebServiceURL.length > 0) {
                        strWebServiceURL = "http://" + strWebServiceURL;
                    }
                } else { $scope.Setting.WebServiceURL = strWebServiceURL }
                if ($scope.Setting.BaseUrl.length > 0) {
                    strBaseUrl = $scope.Setting.BaseUrl;
                    if (strBaseUrl.length > 0) {
                        strBaseUrl = "/" + strBaseUrl;
                    }
                } else { $scope.Setting.BaseUrl = strBaseUrl }
                if ($scope.Setting.WebSiteUrl.length > 0) {
                    strWebSiteURL = $scope.Setting.WebSiteUrl;
                    if (strWebSiteURL.length > 0) {
                        strWebSiteURL = "http://" + strWebSiteURL;
                    }
                } else { $scope.Setting.WebSiteUrl = strWebSiteURL }
                var data = 'BaseUrl=' + $scope.Setting.BaseUrl + '##WebServiceURL=' + $scope.Setting.WebServiceURL + '##WebSiteURL=' + strWebSiteURL;
                var path = cordova.file.externalRootDirectory;
                var directory = "TmsApp";
                var file = directory + "/Config.txt";
                $cordovaFile.writeFile(path, file, data, true)
                .then(function (success) {
                    $state.go('login', { 'CheckUpdate': 'Y' }, { reload: true });
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
            $scope.delSetting = function () {
                var path = cordova.file.externalRootDirectory;
                var directory = "TmsApp";
                var file = directory + "/Config.txt";
                $cordovaFile.removeFile(path, file)
                .then(function (success) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Delete Config File Success.',
                        okType: 'button-calm'
                    });
                    $timeout(function () {
                        ionicMaterialInk.displayEffect();
                    }, 0);
                    $timeout(function () {
                        alertPopup.close();
                    }, 2500);
                }, function (error) {
                    $cordovaToast.showShortBottom(error);
                });
            };
        }]);
