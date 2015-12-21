requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
	//配置angular的路径
    paths:{
        "angular":"path/to/angular", 
        "angular-route":"path/to/angular-route",
    },
    //这个配置是你在引入依赖的时候的包名
    shim:{
        "angular":{
            exports:"angular"
        },
        "angular-route":{
            exports:"angular-route"
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'canvas', 'app/sub'],
function   ($,        canvas,   sub) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});