const btcConfig = getConfig();


function showGlobalConfig(data) {
    var formattedData = [data].map(({
        SHOW_PRECHAT: inputglobal_prechat, 
        SHOW_SURVEY: inputglobal_survey,
        SHOW_CONTACTUS: inputglobal_contactus,
        SHOW_EST_WAITTIME: inputglobal_esttime,
        SHOW_AGENT_NAME: inputglobal_agentname,
        SHOW_RESTART_CHAT: inputglobal_restartbutt,
        PREVIEW_ATTACHMENT: inputglobal_attachprev,
        SHOW_ACCEPT_ATTACH: inputglobal_attachaccept,
        CHECK_AVAILABILITY: inputglobal_agentavail,
        AUTO_LOGIN: inputglobal_ncblogin,
        EMOJIS: inputglobal_emojis,
        SHOW_ADVERTISEMENT: inputglobal_advert,
        ADVERT_URL: inputglobal_advert_url

        }) => ({
            inputglobal_prechat,
            inputglobal_survey,
            inputglobal_contactus,
            inputglobal_esttime,
            inputglobal_agentname,
            inputglobal_restartbutt,
            inputglobal_attachprev,
            inputglobal_attachaccept,
            inputglobal_agentavail,
            inputglobal_ncblogin,
            inputglobal_emojis,
            inputglobal_restartbutt,
            inputglobal_advert,
            inputglobal_advert_url
        }));

    populate(formattedData[0]);
    
    $('#inputglobal_advert_url_label').hide();
    $('#inputglobal_advert_url').hide();
    if ($('#inputglobal_advert').prop("checked") == "yes") {
        $('#inputglobal_advert_url_label').show();
        $('#inputglobal_advert_url').show();
    }
    $('#inputglobal_advert').change(function(e){
        if ($('#inputglobal_advert').prop("checked")) {
            $('#inputglobal_advert_url_label').show();
            $('#inputglobal_advert_url').show();
        } else {
            $('#inputglobal_advert_url_label').hide();
            $('#inputglobal_advert_url').hide();
        }
    });
    
    $('#inputglobal_ncblogin').change(function(e){
        if ($('#inputglobal_ncblogin').prop("checked")) {
            $('#inputglobal_prechat_label').hide();
            $('#inputglobal_prechat').hide();
        } else {
            $('#inputglobal_prechat_label').show();
            $('#inputglobal_prechat').show();
        }
    });
}

function getGlobalSettingsSuccess(args, response, textStatus, request) {
    console.log(response);
    showGlobalConfig(response.NINJA_GLOBAL);
}

function getGlobalSettingsFailure(args, jqXhr, statusInfo, errorThrown) {
    toastr.error('Error Occured while Fetching Data!');
}

function getGlobalSettings() {
    
    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
    }

    const apiURL = btcConfig.ninjas_mngr+'/ninjaGlobalConfig';

    const actionHandlers = {
        success: {
                    handler: getGlobalSettingsSuccess, 
                    args: null
        },
        error: {
                handler: getGlobalSettingsFailure, 
                args: null
        }
    }
    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function saveGlobalSettingsSuccess(args, response, textStatus, request) {
    console.log(response);
    toastr.success('Saved Successfully');
}

function saveGlobalSettingsFailure(args, jqXhr, statusInfo, errorThrown) {
    toastr.error('Error Occured while Fetching Data!');
}

function saveGlobalSettings() {
    var NINJA_GLOBALCFG_NEW = {
        SHOW_PRECHAT: ($('#inputglobal_prechat').prop("checked") == true)?"yes":"no", 
        SHOW_SURVEY: ($('#inputglobal_survey').prop("checked") == true)?"yes":"no",
        SHOW_CONTACTUS: ($('#inputglobal_contactus').prop("checked") == true)?"yes":"no",
        SHOW_EST_WAITTIME: ($('#inputglobal_esttime').prop("checked") == true)?"yes":"no",
        SHOW_AGENT_NAME: ($('#inputglobal_agentname').prop("checked") == true)?"yes":"no",
        SHOW_RESTART_CHAT: ($('#inputglobal_restartbutt').prop("checked") == true)?"yes":"no",
        PREVIEW_ATTACHMENT: ($('#inputglobal_attachprev').prop("checked") == true)?"yes":"no",
        SHOW_ACCEPT_ATTACH: ($('#inputglobal_attachaccept').prop("checked") == true)?"yes":"no",
        CHECK_AVAILABILITY: ($('#inputglobal_agentavail').prop("checked") == true)?"yes":"no",
        AUTO_LOGIN: ($('#inputglobal_ncblogin').prop("checked") == true)?"yes":"no",
        EMOJIS: ($('#inputglobal_emojis').prop("checked") == true)?"enabled":"disabled",
        SHOW_ADVERTISEMENT: ($('#inputglobal_advert').prop("checked") == true)?"yes":"no",
    }

    if ($('#inputglobal_advert').prop("checked") == true) {
        NINJA_GLOBALCFG_NEW['ADVERT_URL'] = $('#inputglobal_advert_url').val();
    } else {
        NINJA_GLOBALCFG_NEW['ADVERT_URL'] = "";
    }

    const options = {
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({NINJA_GLOBALCFG_NEW: NINJA_GLOBALCFG_NEW})
    }

    const apiURL = btcConfig.ninjas_mngr+'/ninjaGlobalConfig';

    const actionHandlers = {
        success: {
                    handler: saveGlobalSettingsSuccess, 
                    args: null
        },
        error: {
                handler: saveGlobalSettingsFailure, 
                args: null
        }
    }
    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function checkSidebarImage(id) {
    $sidebar = $(id);
    image_src = $sidebar.data('image');
  
    if (image_src !== undefined) {
        sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
        $sidebar.append(sidebar_container);
    }
  }
  
$(document).ready(function () {

    checkSidebarImage('.mysidebar');
    
    $( ".nav__link" ).click(function() {
        $( ".nav__link" ).removeClass('active');
        $(this).addClass('active');
    });

    $('#logout').click(function () {
        document.location.href = "/login"
    });

    getGlobalSettings();

    $('#saveGlobalConfig').click(function () {
        saveGlobalSettings();
    });

    $('#exportGlobalConfig').click(function () {
        //saveAs('http://localhost:5000/whatsapp_v2/assets/js/newconfig.json', "newconfig.json");
        window.open("http://localhost:5000/whatsapp_v2/assets/js/newconfig.json", "_blank");
    });

    $('#importGlobalConfig').click(function () {
        $('#inputlogo_file').trigger('click');
    });

    $('#inputlogo_file').change(function(e){
        var fileName = e.target.files[0].name;
        $('#btnSubmit').trigger('click');
    });

    $("#btnSubmit").click(function (event) {
        event.preventDefault();

        var file_data = $("#inputlogo_file").prop("files")[0];
        var form_data = new FormData(); // Creating object of FormData class
        form_data.append("inputlogo_file", file_data)

       // disabled the submit button
        $("#btnSubmit").prop("disabled", true);
 
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: 'http://localhost:5000/api/ninjaExportImport',
            data: form_data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 800000,
            success: function (data) {
                $("#btnSubmit").prop("disabled", false);
                toastr.success("Import Successful");
            },
            error: function (e) {
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);
                toastr.error("Import Failed");
            }
        });
 
    });
});
