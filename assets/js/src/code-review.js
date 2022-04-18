const btcConfig = getConfig();

var codeRevListTbl = null;

const projectCategories = {
    "Online Service": 1,
    "EDGE": 2,
    "IBM Middleware": 3,
    "CRM": 4
}

const reviewTypes = {
    "Code Review": 1,
    "TDD Review": 2
}

function rowEditHandler(num, data) {
    console.log(data);

    var formData = [data].map(({
        "title": codeRevName,
        "review_type": codeRev_Type,
        "category": codeRev_Project,
        "pid": codeRevDet_PIDLink,
        "tdd": codeRevDet_TDDLink,
        "cr_num": codeRevDet_CRnum,
        "priority": codeRev_Priority,
        "descr": codeRevDet_Descr
    }) => ({
            
    codeRevName,
    codeRev_Type,
    codeRev_Project,
    codeRevDet_PIDLink,
    codeRevDet_TDDLink,
    codeRevDet_CRnum,
    codeRev_Priority,
    codeRevDet_Descr,
    }));
    populate(formData[0]);

    $('#codeReviewTitle').text("Update Code Review");
    $('#codeRevListTbl_Action').val('edit');
    
    $('#codeRevListTblDiv').addClass('d-none');
    $('#codeRevInfoDiv').removeClass('d-none');

    $('#codeRev_Type').selectpicker('val', reviewTypes[data.review_type]);
    $('#codeRev_Project').selectpicker('val', projectCategories[data.category]);

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

    const apiURL = '/api/codereviews';
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
    $('#codeRevListTbl_Action').val('new');
    $('#codeRev_Type').selectpicker('val', "1");
    $('#codeRev_Project').selectpicker('val', "1");
    $('#codeRev_Priority').selectpicker('val', "4");
    $('#codeReviewTitle').text("New Code Review");
}

function getCodeReviews() {
    //const token = window.sessionStorage.getItem("access-token");
    //console.log('access-token: '+token);
    const apiURL = '/wheresapp/api/v1/code/reviews';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd codeReviews successfully: "+JSON.stringify(response));
                        codeRevListTbl.loadData(response.codeReviews);
                        //toastr.success('Loaded device_types');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.error('Failed loading codeReviews');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function getCategories() {
    //const token = window.sessionStorage.getItem("access-token");
    //console.log('access-token: '+token);
    const apiURL = '/api/categories';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd categories successfully: "+JSON.stringify(response));
                        for (var idx in response.categories) {
                            var categories = response.categories[idx];
                            $("#codeRev_PRoject").append('<option value="'+categories.id+'">'+categories.display_name+'</option>');
                        }
                        $("#codeRev_PRoject").selectpicker("refresh");
                        toastr.success('Loaded categories');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.failed('Failed loading categories');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function getReviewPriorities() {
    //const token = window.sessionStorage.getItem("bcx-access-token");
    //console.log('bcx-access-token: '+token);
    const apiURL = '/api/priority';

    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        console.log("Recvd priorities successfully: "+JSON.stringify(response));
                        for (var idx in response.priorities) {
                            var priorities = response.priorities[idx];
                            $("#codeRev_Project").append('<option value="'+priorities.id+'">'+priorities.display_name+'</option>');
                        }
                        $("#codeRev_Project").selectpicker("refresh");
                        toastr.success('Loaded priorities');
                    },
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    console.log("FAILED: "+JSON.stringify(statusInfo));
                    toastr.failed('Failed loading priorities');
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function submitCodeReview() {

    var coderevname = $('#codeRevName').val();
    
    var coderev_Type = $('#codeRev_Type').find('option:selected').text();
    var coderev_project = $('#codeRev_Project').find('option:selected').text();
    var coderevdet_pidlink = $('#codeRevDet_PIDLink').val();
    var coderevdet_tddlink = $('#codeRevDet_TDDLink').val();
    var coderevdet_crnum = $('#codeRevDet_CRnum').val();
    var coderev_priority = $('#codeRev_Priority').find('option:selected').val();
    var coderevdet_descr = $('#codeRevDet_Descr').val();
    var coderevdet_codenum = $('#codeRevDet_Codenum').val();
    

    //const token = window.sessionStorage.getItem("wheresapp-access-token");
    //console.log('wheresapp-access-token: '+token);
    const apiURL = '/wheresapp/api/v1/code/reviews';
    /*
    var postData = {
        codeReview_info:{            
                "status": "New",
                "priority": coderev_priority,
                "title":  coderevname,
                "review_type": coderev_Type,
                "category": coderev_project,
                "cr_num": coderevdet_crnum,
                "tdd": coderevdet_tddlink,
                "pid": coderevdet_pidlink,
                "description": coderevdet_descr         
        }
    };
    */

    var codeReview_info = {            
        "status": "New",
        "priority": coderev_priority,
        "title":  coderevname,
        "review_type": coderev_Type,
        "category": coderev_project,
        "cr_num": coderevdet_crnum,
        "codenum": coderevdet_codenum,
        "tdd": coderevdet_tddlink,
        "pid": coderevdet_pidlink,
        "description": coderevdet_descr         
    }

    var file_data1_type = 'upload'
    var file_data2_type = 'upload'

    var file_data1 = $("#codeRevDet_PIDLinkFileBrowse").prop("files")[0];
    var file_data2 = $("#codeRevDet_TDDLinkFileBrowse").prop("files")[0];

    if (file_data1 == undefined) {
        file_data1_type = 'link'
        file_data1 = $('#codeRevDet_PIDLink').val();
    }
    
    if (file_data2 == undefined) {
        file_data2_type = 'link'
        file_data2 = $('#codeRevDet_TDDLink').val();
    }

    var activity_status='Added';
    var httpMethod='POST';
    if ($('#codeRevListTbl_Action').val() == 'edit') {
        httpMethod='PUT';
        activity_status='Updated';
    }

    var form_data = new FormData(); // Creating object of FormData class
    form_data.append("codeReview_info", JSON.stringify({            
        "status": "New",
        "priority": coderev_priority,
        "title":  coderevname,
        "review_type": coderev_Type,
        "category": coderev_project,
        "cr_num": coderevdet_crnum,
        "code_num": coderevdet_codenum,
        "tdd": coderevdet_tddlink,
        "pid": coderevdet_pidlink,
        "description": coderevdet_descr         
    }));

    form_data.append("pid_link", file_data1);
    form_data.append("pid_link_type", file_data1_type);
    form_data.append("tdd_link", file_data2);    
    form_data.append("tdd_link_type", file_data2_type);

    console.log(JSON.stringify(form_data));

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: btcConfig.ninjas_server + apiURL,
        data: form_data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 800000,
        success: function (response) {
            if (response.status == 0) {
                console.log("SUCCESS CREATED: "+JSON.stringify(response));
                toastr.success(activity_status+' Successfully');
                $('#codeRevInfoDiv').addClass('d-none');
                $('#codeRevListTblDiv').removeClass('d-none');
                getCodeReviews();
            } else {
                console.log("FAILED: "+JSON.stringify(response));
                toastr.error('Failed '+activity_status);
            }
        },
        error: function (e) {
            console.log("ERROR : ", e);
            toastr.error("new code review Failed");
        }
    });


    /*
    const options = {
        method: httpMethod,
        dataType: "json",
        //contentType: "application/json",
        data: form_data,
        //processData: false,
        contentType: 'multipart/form-data',
        cache: false,
        timeout: 800000,
        //enctype: 'multipart/form-data',
        //data: JSON.stringify(postData)
        //headers: {"Authorization": "Bearer "+token}
    }

    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        if (response.status == 0) {
                            console.log("SUCCESS CREATED: "+JSON.stringify(response));
                            toastr.success(activity_status+' Successfully');
                            $('#codeRevInfoDiv').addClass('d-none');
                            $('#codeRevListTblDiv').removeClass('d-none');
                            getCodeReviews();
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
    */
}

$(document).ready(function () {

    $('[data-toggle="popover"]').popover()

    var tblConfig = {
        id: 'codeRevListTbl',
        form_id: 'codeRevInfo',
        cntrlbox_id: 'codeRevInfo',
        paging: true,
        sort: true,
        search: true,
        autoWidth: false,
        checkBox: false,
        rowEdit: true,
        rowDel: false,
        newFormCb: rowNewHandler,
        rowEditCb: rowEditHandler,
        rowRemoveCb: rowRemoveHandler,
        rowSelStyle: 'single',
        dataSet: [],
        dataTitleMap: [
            { "data": "review_type", "title": "Review Type" },
            { "data": "status", "title": "Status" },
            { "data": "priority", "title": "Priority" },
            { "data": "title", "title": "Title" },
            { "data": "category", "title": "Project Category" },
            { "data": "cr_num", "title": "CR Number" },
            { "data": "code_num", "title": "Code Req#" },
            { "data": "tdd", "title": "TDD" },
            { "data": "pid", "title": "PID" },
        ],
        noSortCols:  [7,8,9]
    }

    codeRevListTbl = new basicStandardTable(tblConfig);
    
    getCodeReviews();

    $("#codeRevInfoSave").click(function (event) {
        if (validateForm('newCodeReviewForm'))
            submitCodeReview();
    });

    
    $("#codeRevDet_TDDLinkBtn").click(function (e) {
        e.preventDefault();
        $("#codeRevDet_TDDLinkFileBrowse").trigger('click');
    });

    $("#codeRevDet_PIDLinkBtn").click(function (e) {
        e.preventDefault();
        $("#codeRevDet_PIDLinkFileBrowse").trigger('click');
    });

    $("#codeRevDet_TDDLinkFileBrowse").change(function(e) {
        //var file = e.currentTarget.files[0];
        //$("#voicep_filename").val(file.name);
        //$("#voicep_fileformat").val(file.type);
        //$("#voicep_filesize").val(file.size);
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.doc|.docx)$/;
        if (regex.test($("#codeRevDet_TDDLinkFileBrowse").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                console.log(e.target.files[0].name);
                $("#codeRevDet_TDDLink").val(e.target.files[0].name);
                reader.readAsText($("#codeRevDet_TDDLinkFileBrowse")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid TDD file.");
        }
    });

    $("#codeRevDet_PIDLinkFileBrowse").change(function(e) {
        //var file = e.currentTarget.files[0];
        //$("#voicep_filename").val(file.name);
        //$("#voicep_fileformat").val(file.type);
        //$("#voicep_filesize").val(file.size);
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.doc|.docx)$/;
        if (regex.test($("#codeRevDet_PIDLinkFileBrowse").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                console.log(e.target.files[0].name);
                $("#codeRevDet_PIDLink").val(e.target.files[0].name);
                reader.readAsText($("#codeRevDet_PIDLinkFileBrowse")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid PID file.");
        }
    });

    /*
    $('#featureCfg_ChatEnable').change(function() {
        if(this.checked) {
            $('#featureCfg_ChatDomainRow').show(500);
        } else {
            $('#featureCfg_ChatDomainRow').hide(500);;
        }
    });
    */

})