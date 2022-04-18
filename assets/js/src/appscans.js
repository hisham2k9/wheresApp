const btcConfig = getConfig();


function rowEditHandler(num, data) {
    console.log(data);

    {AppScanInfoForm}

    //var codes_ids = data.codecs.split(",");
    //$('#phoneDevice_Codecs').selectpicker('val', codes_ids);

    $('#AppScanListTbl_Action').val('edit');
    $('#AppScanListTbl_DeviceName').attr('disabled', true);

    $('#AppScanListTblDiv').addClass('d-none');
    $('#AppScanInfoDiv').removeClass('d-none');
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
}var AppScanListTbl = null;

function getAppScans() {
    //const token = window.sessionStorage.getItem("bcx-access-token");
    //console.log('bcx-access-token: '+token);
    const apiURL = '/api/appscans';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd AppScans successfully: "+JSON.stringify(response));
                        AppScanListTbl.loadData(response.AppScans);
                        //toastr.success('Loaded device_types');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.failed('Failed loading AppScans');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}
function getApplications() {
    //const token = window.sessionStorage.getItem("bcx-access-token");
    //console.log('bcx-access-token: '+token);
    const apiURL = '/api/applications';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd applications successfully: "+JSON.stringify(response));
                        for (var idx in response.applications) {
                            var applications = response.applications[idx];
                            $("#appscan_Apps").append('<option value="'+applications.id+'">'+applications.display_name+'</option>');
                        }
                        $("#appscan_Apps").selectpicker("refresh");
                        toastr.success('Loaded applications');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.failed('Failed loading applications');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}


$(document).ready(function () {

    $('[data-toggle="popover"]').popover()

    $('#AppScanInfoDiv').addClass('d-none');


    var tblConfig = {
        id: 'AppScanListTbl',
        form_id: 'AppScanInfo',
        cntrlbox_id: 'AppScanInfo',
        paging: true,
        sort: true,
        search: true,
        autoWidth: false,
        checkBox: true,
        rowEdit: true,
        rowDel: true,
        newFormCb: rowNewHandler,
        rowEditCb: rowEditHandler,
        rowRemoveCb: rowRemoveHandler,
        rowSelStyle: 'multi',
        dataSet: [
            { __blank: "", id: "1", scan_date: "Mar 29, 2022 12:18 PM", scan_id: "e3d25393-8b29-4414-a1c6-2f5eb0388e5b", build_id: "10", scan_status: "SUCCESS", app_name: "Code Review", app_cat: "AppScan", owner_name: "Athif Aziz", owner_email: "athif.aziz@bupa.com.sa", reports: '<a href="#"><i class="fa fa-lg fa-file"></i></a>' },
        ],
        dataTitleMap: [
            { "data": "scan_date", "title": "Scan Date" },
            { "data": "scan_id", "title": "Scan ID" },
            { "data": "build_id", "title": "Jenkins Build ID" },
            { "data": "scan_status", "title": "Scan Status" },
            { "data": "app_name", "title": "App Name" },
            { "data": "app_cat", "title": "App Category" },
            { "data": "owner_name", "title": "Owner Name" },
            { "data": "owner_email", "title": "Owner E-mail" },
            { "data": "reports", "title": "Reports" }
        ],
        noSortCols:  [6]
    }

    var AppScanListTbl = new basicStandardTable(tblConfig);
    

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