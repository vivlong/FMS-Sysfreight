if (typeof define !== 'function') {
  // to be able to require file from node
  var define = require('amdefine')(module);
}

define({
	baseUrl: './js',
	//enforceDefine: true,
	paths: {
		'angular':			'../lib/angular/angular.min',
		'angular-route':	'../lib/angular-ui-router/release/angular-ui-router.min',
		'angular_ionic':	'../lib/ionic/js/ionic-angular.min',
		'ionic':			'../lib/ionic/js/ionic.min',
		'ionic-material':	'../lib/ionic-material/dist/ionic.material.min',
		'ngCordova':		'../lib/ngCordova/dist/ng-cordova.min',
		'domReady':			'../lib/domReady/domReady',
		'jquery': 			'../lib/jquery/dist/jquery.min',
		'echarts':			'../lib/echarts/build/dist/echarts-all',
		'p_select': 		'../lib/ui-select/dist/select.min',
		'ion-md-input': 	'../lib/ion-md-input/js/ion-md-input.min',
		'waves':			'../lib/Waves/dist/waves.min',
		'app':				"app",
	},
	shim: {
		'angular' : { 'exports' : 'angular' },
        'ionic': { deps: ['angular'], exports: 'ionic' },
		'angular_ionic': ['angular', 'ionic', 'angular_sanitize', 'angular_animate', 'angular_route', 'angular_uirouter'],
		'angular-route':{
            deps:['angular'],
            exports: 'angular-route'
        },
		'ngCordova': {
            exports: 'ngCordova'
        },
		'ionic-material': {
			deps: ['','css!../lib/ionic-material/dist/ionic.material.min.css']
			// exports: 'Select'
		},
		'p_select': {
			deps: ['jquery','css!../lib/ui-select/dist/select.min.css']
			// exports: 'Select'
		},
		'ion-md-input': {
			deps: ['','css!../lib/ion-md-input/css/ion-md-input.min.css']
			// exports: 'ion-md-input'
		}
	},
	priority: [
        'angular',
        'angular-ionic',
    ],
	map: {
		'*': {
			'css': '../lib/require-css/css.min'
		}
	}
	//urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});
