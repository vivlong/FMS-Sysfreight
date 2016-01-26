var appFactory = angular.module('MobileAPP.factories', [
    'MobileAPP.services'
]);

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

appFactory.factory('CONTACTS_ORM',function(){
    var CONTACTS_ORM = {
        CONTACTS_SEARCH : {
            BusinessPartyNameLike:  '',
            _set:   function(value) {
                CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike = value;
            }
        },
        CONTACTS_LIST : {
            CanLoadedMoreData:      true,
            Rcbp1s:                 {},
            _set:   function(value) {
                CONTACTS_ORM.CONTACTS_LIST.Rcbp1s = value;
            }
        },
        CONTACTS_DETAIL : {
            TrxNo:                  '',
            TabIndex:               0,
            Rcbp1:                  {},
            _setId:     function(value) {
                CONTACTS_ORM.CONTACTS_DETAIL.TrxNo = value;
            },
            _setTab:    function(value) {
                CONTACTS_ORM.CONTACTS_DETAIL.TabIndex = value;
            },
            _setObj:    function(value) {
                CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1 = value;
            }
        },
        CONTACTS_SUBLIST : {
            BusinessPartyCode:      '',
            Rcbp3s:                 {},
            _setId:     function(value) {
                CONTACTS_ORM.CONTACTS_SUBLIST.BusinessPartyCode = value;
            },
            _setObj:    function(value) {
                CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s = value;
            }
        },
        CONTACTS_SUBDETAIL : {
            Rcbp3:                  {},
            _setObj:    function(value) {
                CONTACTS_ORM.CONTACTS_SUBDETAIL.Rcbp3 = value;
            }
        }
    };
    CONTACTS_ORM.init = function() {
        CONTACTS_ORM.CONTACTS_SEARCH.BusinessPartyNameLike =    '';
        CONTACTS_ORM.CONTACTS_LIST.CanLoadedMoreData =          true;
        CONTACTS_ORM.CONTACTS_LIST.Rcbp1s =                     {};
        CONTACTS_ORM.CONTACTS_DETAIL.TrxNo =                    '';
        CONTACTS_ORM.CONTACTS_DETAIL.TabIndex =                 0;
        CONTACTS_ORM.CONTACTS_DETAIL.Rcbp1 =                    {};
        CONTACTS_ORM.CONTACTS_SUBLIST.BusinessPartyCode =       '';
        CONTACTS_ORM.CONTACTS_SUBLIST.Rcbp3s =                  {};
        CONTACTS_ORM.CONTACTS_SUBDETAIL.Rcbp3 =                  {};
    };
    return CONTACTS_ORM;
});
