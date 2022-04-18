const btcConfig = getConfig();

var AppScanListTbl = null;

function rowEditHandler(num, data) {
    console.log(data);

    {ApplicationInfoForm}

    //var codes_ids = data.codecs.split(",");
    //$('#phoneDevice_Codecs').selectpicker('val', codes_ids);

    $('#AppScanListTbl_Action').val('edit');
    $('#AppScanListTbl_DeviceName').attr('disabled', true);

    $('#AppScanListTblDiv').addClass('d-none');
    $('#ApplicationInfoDiv').removeClass('d-none');
}

function rowRemoveHandler(num, data) {
    console.log(data);

    var id_list = [];
    if (parseInt(num) > 0) {
        for (var idx in data) {
            id_list.push("'"+data[idx].id+"'");
        }
    }

    var postData = {
        id_list: id_list
    };

    const apiURL = '/api/device';
    const options = {
        method: 'DELETE',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(postData)
        //headers: {"Authorization": "Bearer "+token}
    }

    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        if (response.status == 0) {
                            toastr.success('Deleted Successfully');
                            getDeviceList();
                        } else {
                            console.log("FAILED: "+response);
                            toastr.error('Failed deleting');
                        }
                    },  
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.error('Failed deleting device');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}


function rowNewHandler() {
    $('#AppScanListTbl_DeviceName').attr('disabled', false);
    $('#AppScanListTbl_Action').val('new');
}

function getApplications() {
    //const token = window.sessionStorage.getItem("bcx-access-token");
    //console.log('bcx-access-token: '+token);
    const apiURL = '/wheresapp/api/v1/applications';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd Applications successfully: "+JSON.stringify(response));
                        AppScanListTbl.loadData(response.applications);
                        //toastr.success('Loaded device_types');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.failed('Failed loading Applications');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function exportApplications() {

    var rowCount = AppScanListTbl.stdTable.rows({ selected: true}).count();
    if (rowCount < 1) {
        toastr.info("Please select rows");
        return;
    }

    var applications = AppScanListTbl.stdTable.rows({ selected: true}).data().toArray();
    console.log(JSON.stringify(applications));    

    //const token = window.sessionStorage.getItem("wheresapp-access-token");
    //console.log('wheresapp-access-token: '+token);
    
    const apiURL = '/wheresapp/api/v1/applications/export';
    var postData = {
        applications: applications
    };

    var activity_status='Added';
    var httpMethod='POST';
    if ($('#codeRevListTbl_Action').val() == 'edit') {
        httpMethod='PUT';
        activity_status='Updated';
    }

    const options = {
        method: httpMethod,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(postData)
        //headers: {"Authorization": "Bearer "+token}
    }

    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        if (response.status == 0) {
                            console.log("SUCCESS CREATED: "+JSON.stringify(response));
                            //toastr.success(activity_status+' Successfully');
                            window.open("http://bjhqdev53:5005/wheresapp/export/"+response.fileName, "_blank");
                        } else {
                            console.log("FAILED: "+JSON.stringify(response));
                            toastr.error('Failed '+activity_status);
                        }
                    },  
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.error('Failed '+activity_status+' add/update');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
    
}

$(document).ready(function () {

    $('[data-toggle="popover"]').popover()

    

    var tblConfig = {
        id: 'AppScanListTbl',
        form_id: 'ApplicationInfo',
        cntrlbox_id: 'ApplicationInfo',
        paging: true,
        sort: true,
        search: true,
        autoWidth: false,
        checkBox: true,
        rowEdit: false,
        rowDel: false,
        newFormCb: rowNewHandler,
        rowEditCb: rowEditHandler,
        rowRemoveCb: rowRemoveHandler,
        rowSelStyle: 'multi',
        dataSet: [],
        dataTitleMap: [
            { "data": "app_name", "title": "Application Name" },
            { "data": "app_version", "title": "Version" },
            { "data": "app_owner_pri", "title": "Primary Owner" },
            { "data": "app_owner_sec", "title": "Secondary Owner" },
            { "data": "app_tech", "title": "Technology" },
            { "data": "app_cat", "title": "Category" },
            { "data": "app_type", "title": "Type" },
        ],
        noSortCols:  [6]
    }

    AppScanListTbl = new basicStandardTable(tblConfig);
    
    getApplications();

    $("#ApplicationExport").click(function (event) {
        exportApplications();
    });

/* Un-comment and customize as per your needs
    getPhoneList();

    $("#phoneInfoSave").click(function (event) {
        savePhoneConfig();
    });

    $('#featureCfg_ChatEnable').change(function() {
        if(this.checked) {
            $('#featureCfg_ChatDomainRow').show(500);
        } else {
            $('#featureCfg_ChatDomainRow').hide(500);;
        }
    });
    */

})