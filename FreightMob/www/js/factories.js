var appFactory = angular.module('MobileAPP.factories', []);

appFactory.factory('ShipmentStatusFilter' , function(){
	var Filter = {};
	var ListFilter = {
		FilterName: '',
        FilterValue:''
    };
	var DetialFilter = {
		FilterName: '',
        FilterValue:'',
        ModuleCode: ''
    };
    Filter.Init = function(){
    	ListFilter.FilterName    = '';
    	ListFilter.FilterValue   = '';
        DetialFilter.FilterName  = '';
        DetialFilter.FilterValue = '';
        DetialFilter.ModuleCode  = '';
    };
    Filter.GetList = function(){
    	return ListFilter;
    };
    Filter.SetList = function(Name, Value){
    	ListFilter.FilterName  = Name;
    	ListFilter.FilterValue = Value;
    	return ListFilter;
    };
    Filter.GetDetial = function(){
    	return DetialFilter;
    };
    Filter.SetDetial = function(Name, Value, Code){
    	DetialFilter.FilterName  = Name;
    	DetialFilter.FilterValue = Value;
    	DetialFilter.ModuleCode  = Code;
    	return DetialFilter;
    };
    return Filter;
});
