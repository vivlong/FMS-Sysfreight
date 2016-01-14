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

appFactory.factory('ContactsParam' , function(){
	var Contacts = {};
    var ListContacts = {
		BusinessPartyNameLike: '',
        CanLoadedMoreData:true
    };
	var DetialContacts = {
		BusinessPartyNameLike: '',
        TrxNo:'',
        CanAddInfos:false
    };
    Contacts.Init = function(){
    	ListContacts.BusinessPartyNameLike    = '';
    	ListContacts.CanLoadedMoreData = true;
        DetialContacts.BusinessPartyNameLike  = '';
        DetialContacts.TrxNo  = '';
    };
    Contacts.GetList = function(){
    	return ListContacts;
    };
    Contacts.SetList = function(Name){
    	ListContacts.BusinessPartyNameLike  = Name;
    	return ListContacts;
    };
    Contacts.GetDetial = function(){
    	return DetialContacts;
    };
    Contacts.SetDetial = function(Name, Value){
        DetialContacts.BusinessPartyNameLike = Name;
        DetialContacts.TrxNo = Value;
    	return DetialContacts;
    };
    return Contacts;
});
