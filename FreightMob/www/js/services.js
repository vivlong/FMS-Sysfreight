var appService = angular.module( 'MobileAPP.services', [
    'ionic',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.inAppBrowser',
    'ngCordova.plugins.geolocation',
    'MobileAPP.config'
] );

appService.service( 'ApiService', [ '$q', 'ENV', '$http', '$ionicLoading', '$ionicPopup', '$timeout',
    function( $q, ENV, $http, $ionicLoading, $ionicPopup, $timeout ) {
        this.Post = function( requestUrl, requestData, blnShowLoad ) {
            if ( blnShowLoad ) {
                $ionicLoading.show();
            }
            var deferred = $q.defer();
            var strSignature = hex_md5( requestUrl + ENV.appId.replace( /-/ig, "" ) );
            var url = ENV.api + requestUrl;
            console.log( url );
            var config = {
                'Content-Type': 'application/json'
            };
            $http.post( url, requestData, config ).success( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.resolve( data );
            } ).error( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.reject( data );
                console.log( data );
            } );
            return deferred.promise;
        };
        this.Get = function( requestUrl, blnShowLoad ) {
            if ( blnShowLoad ) {
                $ionicLoading.show();
            }
            var deferred = $q.defer();
            var strSignature = hex_md5( requestUrl + "?format=json" + ENV.appId.replace( /-/ig, "" ) );
            var url = ENV.api + requestUrl + "?format=json";
            console.log( url );
            $http.get( url ).success( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.resolve( data );
            } ).error( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.reject( data );
                console.log( data );
            } );
            return deferred.promise;
        };
        this.GetParam = function( requestUrl, blnShowLoad ) {
            if ( blnShowLoad ) {
                $ionicLoading.show();
            }
            var deferred = $q.defer();
            var strSignature = hex_md5( requestUrl + "&format=json" + ENV.appId.replace( /-/ig, "" ) );
            var url = ENV.api + requestUrl + "&format=json";
            console.log( url );
            $http.get( url ).success( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.resolve( data );
            } ).error( function( data, status, headers, config, statusText ) {
                if ( blnShowLoad ) {
                    $ionicLoading.hide();
                }
                deferred.reject( data );
                console.log( data );
            } );
            return deferred.promise;
        };
    }
] );

appService.service( 'DownloadFileService', [ 'ENV', '$timeout', '$ionicLoading', '$cordovaToast', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2',
    function( ENV, $timeout, $ionicLoading, $cordovaToast, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2 ) {
        this.Download = function( url, fileName, fileType, onPlatformError, onCheckError, onDownloadError ) {
            $ionicLoading.show( {
                template: "Download  0%"
            } );
            if ( !ENV.fromWeb ) {
                var targetPath = cordova.file.externalRootDirectory + '/' + ENV.rootPath + '/' + fileName;
                var trustHosts = true;
                var options = {};
                //$cordovaFile.checkFile(cordova.file.externalRootDirectory, ENV.rootPath + '/' + fileName)
                //    .then(function(success) {
                $cordovaFileTransfer.download( url, targetPath, trustHosts, options ).then( function( result ) {
                    $ionicLoading.hide();
                    $cordovaFileOpener2.open( targetPath, fileType ).then( function() {
                        // success
                    }, function( err ) {
                        console.error( err );
                    } ).catch( function( ex ) {
                        console.error( ex );
                    } );
                }, function( err ) {
                    console.error( err );
                    $ionicLoading.hide();
                    $cordovaToast.showShortCenter( 'Download faild' );
                    if ( typeof( onDownloadError ) == 'function' ) onDownloadError();
                }, function( progress ) {
                    $timeout( function() {
                        var downloadProgress = ( progress.loaded / progress.total ) * 100;
                        $ionicLoading.show( {
                            template: 'Download  ' + Math.floor( downloadProgress ) + '%'
                        } );
                        if ( downloadProgress > 99 ) {
                            $ionicLoading.hide();
                        }
                    } )
                } ).catch( function( ex ) {
                    console.error( ex );
                } );
                //    }, function(error) {
                //        console.error(error);
                //        $ionicLoading.hide();
                //        $cordovaToast.showShortCenter('Check file faild.');
                //        if( typeof(onDownloadError) == 'function') onDownloadError();
                //    }).catch(function(ex) {
                //        console.log(ex);
                //    });
            } else {
                $ionicLoading.hide();
                if ( typeof( onPlatformError ) == 'function' ) onPlatformError( url );
            }
        };
    }
] );

appService.service( 'OpenUrlService', [ 'ENV', '$cordovaInAppBrowser',
    function( ENV, $cordovaInAppBrowser ) {
        this.Open = function( url ) {
            if ( !ENV.fromWeb ) {
                var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'no'
                };
                $cordovaInAppBrowser.open( url, '_system', options )
                    .then( function( event ) {
                        // success
                    } )
                    .catch( function( event ) {
                        // error
                        $cordovaInAppBrowser.close();
                    } );
            } else {
                window.open( url );
            }
        };
    }
] );

appService.service( 'GeoService', [ '$q', '$cordovaGeolocation',
    function( $q, $cordovaGeolocation ) {
        this.BaiduGetCurrentPosition = function() {
            var deferred = $q.defer();
            if(is.not.undefined(BMap)){
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition( function( r ) {
                    if ( this.getStatus() == BMAP_STATUS_SUCCESS ) {
                        deferred.resolve( r.point );
                        var pos = {
                            type: 'Baidu',
                            lat: r.point.lat,
                            lng: r.point.lng
                        };
                        console.log( pos );
                    } else {
                        deferred.reject( this.getStatus() );
                        console.log( this.getStatus() );
                    }
                }, {
                    maximumAge: 60000,
                    timeout: 5000,
                    enableHighAccuracy: true
                } )
            }
            return deferred.promise;
        };
        this.GoogleGetCurrentPosition = function() {
            var deferred = $q.defer();
            var options = {
                maximumAge: 60000,
                timeout: 10000,
                enableHighAccuracy: true
            };
            $cordovaGeolocation.getCurrentPosition( options ).then( function( position ) {
                deferred.resolve( position );
                var pos = {
                    type: 'Google',
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log( pos );
            }, function( error ) {
                deferred.reject( error );
                console.log( error );
            } );
            /*
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    deferred.resolve(position);
                    var pos = {
                        type: 'Google',
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log(pos);
                }, function() {
                    deferred.reject('The Geolocation service failed.');
                    console.log('The Geolocation service failed.');
                }, {
                    maximumAge: 60000,
                    timeout: 5000,
                    enableHighAccuracy: true
                });
            } else {
                deferred.reject('Browser does not support Geolocation');
                console.log('Browser does not support Geolocation');
            }
            */
            return deferred.promise;
        };
    }
] );

appService.service( 'EnvService', [ '$q', 'ENV', '$cordovaFile',
    function( $q, ENV, $cordovaFile ) {
        this.GetENV = function() {
            var deferred = $q.defer();
            var data = 'website=' + ENV.website + '##' +
                'api=' + ENV.api + '##' +
                'map=' + ENV.mapProvider;
            var path = cordova.file.externalRootDirectory,
                directory = ENV.rootPath,
                file = ENV.rootPath + '/' + ENV.configFile;
            $cordovaFile.createDir( path, directory, false )
                .then( function( success ) {
                    $cordovaFile.writeFile( path, file, data, true )
                        .then( function( success ) {
                            var blnSSL = ENV.ssl === 0 ? false : true;
                            ENV.website = appendProtocol( ENV.website, blnSSL, ENV.port );
                            ENV.api = appendProtocol( ENV.api, blnSSL, ENV.port );
                            deferred.resolve( ENV );
                        }, function( error ) {
                            deferred.reject( error );
                            console.error( error );
                        } );
                }, function( error ) {
                    // If an existing directory exists
                    $cordovaFile.checkFile( path, file )
                        .then( function( success ) {
                            $cordovaFile.readAsText( path, file )
                                .then( function( success ) {
                                    var arConf = success.split( '##' );
                                    var arWebServiceURL = arConf[ 0 ].split( '=' );
                                    if ( is.not.empty( arWebServiceURL[ 1 ] ) ) {
                                        ENV.website = arWebServiceURL[ 1 ];
                                    }
                                    var arWebSiteURL = arConf[ 1 ].split( '=' );
                                    if ( is.not.empty( arWebSiteURL[ 1 ] ) ) {
                                        ENV.api = arWebSiteURL[ 1 ];
                                    }
                                    var arMapProvider = arConf[ 2 ].split( '=' );
                                    if ( is.not.empty( arMapProvider[ 1 ] ) ) {
                                        ENV.mapProvider = arMapProvider[ 1 ];
                                    }
                                    var blnSSL = ENV.ssl === 0 ? false : true;
                                    ENV.website = appendProtocol( ENV.website, blnSSL, ENV.port );
                                    ENV.api = appendProtocol( ENV.api, blnSSL, ENV.port );
                                    deferred.resolve( ENV );
                                }, function( error ) {
                                    deferred.reject( error );
                                    console.error( error );
                                } );
                        }, function( error ) {
                            // If file not exists
                            $cordovaFile.writeFile( path, file, data, true )
                                .then( function( success ) {
                                    var blnSSL = ENV.ssl === 0 ? false : true;
                                    ENV.website = appendProtocol( ENV.website, blnSSL, ENV.port );
                                    ENV.api = appendProtocol( ENV.api, blnSSL, ENV.port );
                                    deferred.resolve( ENV );
                                }, function( error ) {
                                    deferred.reject( error );
                                    console.error( error );
                                } );
                        } );
                } );
            return deferred.promise;
        };
        this.SaveENV = function() {
            var deferred = $q.defer();

            return deferred.promise;
        };
    }
] );
