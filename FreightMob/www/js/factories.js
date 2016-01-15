var appFactory = angular.module('MobileAPP.factories', []);

appFactory.factory('SHIPMENTSTATUS_PARAM' , function(){
	var SHIPMENTSTATUS_PARAM = {};
	var ListFilter = {
		FilterName: '',
        FilterValue:''
    };
	var DetialFilter = {
		FilterName: '',
        FilterValue:'',
        ModuleCode: ''
    };
    SHIPMENTSTATUS_PARAM.Init = function(){
    	ListFilter.FilterName    = '';
    	ListFilter.FilterValue   = '';
        DetialFilter.FilterName  = '';
        DetialFilter.FilterValue = '';
        DetialFilter.ModuleCode  = '';
    };
    SHIPMENTSTATUS_PARAM.GetList = function(){
    	return ListFilter;
    };
    SHIPMENTSTATUS_PARAM.SetList = function(Name, Value){
    	ListFilter.FilterName  = Name;
    	ListFilter.FilterValue = Value;
    	return ListFilter;
    };
    SHIPMENTSTATUS_PARAM.GetDetial = function(){
    	return DetialFilter;
    };
    SHIPMENTSTATUS_PARAM.SetDetial = function(Name, Value, Code){
    	DetialFilter.FilterName  = Name;
    	DetialFilter.FilterValue = Value;
    	DetialFilter.ModuleCode  = Code;
    	return DetialFilter;
    };
    return SHIPMENTSTATUS_PARAM;
});

appFactory.factory('CONTACTS_PARAM' , function(){
	var CONTACTS_PARAM = {};
    var ListContacts = {
		BusinessPartyNameLike: '',
        CanLoadedMoreData:true
    };
	var DetialContacts = {
		BusinessPartyNameLike: '',
        TrxNo:'',
        CanAddInfos:false
    };
    CONTACTS_PARAM.Init = function(){
    	ListContacts.BusinessPartyNameLike    = '';
    	ListContacts.CanLoadedMoreData = true;
        DetialContacts.BusinessPartyNameLike  = '';
        DetialContacts.TrxNo  = '';
        DetialContacts.CanAddInfos  = false;
    };
    CONTACTS_PARAM.GetList = function(){
    	return ListContacts;
    };
    CONTACTS_PARAM.SetList = function(Name){
    	ListContacts.BusinessPartyNameLike  = Name;
    	return ListContacts;
    };
    CONTACTS_PARAM.GetDetial = function(){
    	return DetialContacts;
    };
    CONTACTS_PARAM.SetDetial = function(Name, Value){
        DetialContacts.BusinessPartyNameLike = Name;
        DetialContacts.TrxNo = Value;
    	return DetialContacts;
    };
    return CONTACTS_PARAM;
});
