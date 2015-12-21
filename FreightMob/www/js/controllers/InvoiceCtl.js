appControllers.controller('InvoiceCtl',
        ['$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', 'ionicMaterialInk', 'ionicMaterialMotion', 'WebApiService',
        function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, ionicMaterialInk, ionicMaterialMotion, WebApiService) {
            $scope.returnMain = function () {
                $state.go('main', {}, {});
            };
            $scope.items = [
                { InvoiceNo: 'SESIN0905182-00', InvoiceDate: '04/11/2015', CustomerName: 'S A ORANJE 123', Amt: '100' },
                { InvoiceNo: 'SESIN1511137-02', InvoiceDate: '04/11/2015', CustomerName: 'KADIMA', Amt: '500' }
            ];
            $scope.download = function () {
                $ionicLoading.show({
                    template: "Download  0%"
                });
                var url = strWebServiceURL + "/mobileapp/INVOICE.pdf";
                var blnError = false;
                if (window.cordova) {
                    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "INVOICE.pdf")
                    .then(function (success) {
                        //
                    }, function (error) {
                        blnError = true;
                    });
                    var targetPath = cordova.file.externalRootDirectory + "INVOICE.pdf";
                    var trustHosts = true;
                    var options = {};
                    if (!blnError) {
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            $ionicLoading.hide();
                            $cordovaFileOpener2.open(targetPath, 'application/pdf'
                            ).then(function () {
                                // success
                            }, function (err) {
                                // error
                            });
                        }, function (err) {
                            $cordovaToast.showShortCenter('Download faild.');
                            $ionicLoading.hide();
                        }, function (progress) {
                            $timeout(function () {
                                var downloadProgress = (progress.loaded / progress.total) * 100;
                                $ionicLoading.show({
                                    template: "Download  " + Math.floor(downloadProgress) + "%"
                                });
                                if (downloadProgress > 99) {
                                    $ionicLoading.hide();
                                }
                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.showShortCenter('Download PDF file faild.');
                    }
                } else {
                    $ionicLoading.hide();
                    window.open(url);               
                }                
            };
            $timeout(function () {
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.ripple();
            }, 0);
        }]);

