const btcConfig = getConfig();

var DEFAULT_NINJA_HEADER={
    "COLOR": {
        "BACKGROUND"       : "#075e55",
        "BORDER"           : "#075e55",
        "TEXT"             : "#fff"
    },
    "FONT": {
        "FAMILY"           : "Arial",
        "SIZE"             : "18px",
        "WEIGHT"           : "400"
    },
    "ICON": {
        "LOGO": {
            "TYPE"     : "IMG", 
            "URL"      : "assets/img/ncb_logo.png",
            "WIDTH"    : "128px",
            "HEIGHT"   : "36px"
        }
    },
    "LAYOUT": {
        "BORDER_RADIUS"    : "4px",
        "HEIGHT"           : "60px"
    }
}

function resetCfg(id) {
    if (id=='inputhdr_logoheight') {
        $('#inputhdr_logoheight').val(parseNumber(DEFAULT_NINJA_HEADER.ICON.LOGO.HEIGHT));
    } else if (id=='inputhdr_logowidth') {
        $('#inputhdr_logowidth').val(parseNumber(DEFAULT_NINJA_HEADER.ICON.LOGO.WIDTH));
    } else if (id=='inputhdr_logofname') {
        $('#inputhdr_logofname').val(getFilename(DEFAULT_NINJA_HEADER.ICON.LOGO.URL));
    } else if (id=='inputhdr_bgcolor') {
        $('#inputhdr_bgcolor')[0].jscolor.fromString(DEFAULT_NINJA_HEADER.COLOR.BACKGROUND);
    } else if (id=='inputhdr_bdrcolor') {
        $('#inputhdr_bdrcolor')[0].jscolor.fromString(DEFAULT_NINJA_HEADER.COLOR.BORDER);
    } else if (id=='inputhdr_txtcolor') {
        $('#inputhdr_txtcolor')[0].jscolor.fromString(DEFAULT_NINJA_HEADER.COLOR.TEXT);
    } else if (id=='inputhdr_layheight') {
        $('#inputhdr_layheight').val(parseNumber(DEFAULT_NINJA_HEADER.LAYOUT.HEIGHT));
    } else if (id=='inputhdr_layradius') {
        $('#inputhdr_layradius').val(parseNumber(DEFAULT_NINJA_HEADER.LAYOUT.BORDER_RADIUS));
    }
    updateHeaderCfg();
}

function putHeaderSuccess(args, response, textStatus, request) {
    console.log(response);
    $("#frame").attr("src", "http://localhost:5000/whatsapp_v2/app.html");
}

function putHeaderFailure(args, jqXhr, statusInfo, errorThrown) {
    toastr.error('Error Occured while Fetching Data!');
}

function updateHeaderCfg() {
    var NINJA_HEADER = JSON.parse(JSON.stringify(DEFAULT_NINJA_HEADER))

    NINJA_HEADER.COLOR.TEXT='#'+$('#inputhdr_txtcolor').val();
    NINJA_HEADER.COLOR.BORDER='#'+$('#inputhdr_bdrcolor').val();
    NINJA_HEADER.COLOR.BACKGROUND='#'+$('#inputhdr_bgcolor').val();

    //NINJA_HEADER.FONT.FAMILY=$('#inputhdr_font_family').val();
    //NINJA_HEADER.FONT.SIZE=$('#inputhdr_font_size').val();
    //NINJA_HEADER.FONT.WEIGHT=$('#inputhdr_font_weight').val();

    NINJA_HEADER.LAYOUT.HEIGHT=$('#inputhdr_layheight').val()+"px";
    NINJA_HEADER.LAYOUT.BORDER_RADIUS=$('#inputhdr_layradius').val()+"px";

    NINJA_HEADER.ICON.LOGO.WIDTH=$('#inputhdr_logowidth').val()+"px";
    NINJA_HEADER.ICON.LOGO.HEIGHT=$('#inputhdr_logoheight').val()+"px";
    NINJA_HEADER.ICON.LOGO.URL="assets/img/"+$('#inputhdr_logofname').val();

    const options = {
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(NINJA_HEADER)
    }

    const apiURL = btcConfig.ninjas_mngr+'/ninjaHeader';

    const actionHandlers = {
        success: {
                    handler: putHeaderSuccess, 
                    args: null
        },
        error: {
                handler: putHeaderFailure, 
                args: null
        }
    }
    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function parseNumber(str) {
    var numberPattern = /\d+/g;
    res=str.match( numberPattern );
    return res[0];
}

function getFilename(fullPath) {
    var filename = fullPath.replace(/^.*[\\\/]/, '')
    return filename;
}

function getHeaderSuccess(args, response, textStatus, request) {
    console.log(response);
    if (response.status==0) {
        var NINJA_HEADER=response.NINJA_HEADER;
        $('#inputhdr_bgcolor')[0].jscolor.fromString(NINJA_HEADER.COLOR.BACKGROUND);
        $('#inputhdr_bdrcolor')[0].jscolor.fromString(NINJA_HEADER.COLOR.BORDER);
        $('#inputhdr_txtcolor')[0].jscolor.fromString(NINJA_HEADER.COLOR.TEXT);

        $('#inputhdr_logowidth').val(parseNumber(NINJA_HEADER.ICON.LOGO.WIDTH));
        $('#inputhdr_logoheight').val(parseNumber(NINJA_HEADER.ICON.LOGO.HEIGHT));
        $('#inputhdr_layradius').val(parseNumber(NINJA_HEADER.LAYOUT.BORDER_RADIUS));
        $('#inputhdr_layheight').val(parseNumber(NINJA_HEADER.LAYOUT.HEIGHT));
        $('#inputhdr_logofname').val(getFilename(NINJA_HEADER.ICON.LOGO.URL));

    }
}

function getHeaderFailure(args, jqXhr, statusInfo, errorThrown) {
    toastr.error('Error Occured while Fetching Data!');
}

function getHeaderCfg() {
    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
    }

    const apiURL = btcConfig.ninjas_mngr+'/ninjaHeader';

    const actionHandlers = {
        success: {
                    handler: getHeaderSuccess, 
                    args: null
        },
        error: {
                handler: getHeaderFailure, 
                args: null
        }
    }
    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

$(document).ready(function () {

    changeDeployMode("ui-chat")

    getHeaderCfg();

    $('#browseLogoFname').click(function(){
        $('#inputlogo_file').trigger('click');
    });

    $('#inputlogo_file').change(function(e){
        var fileName = e.target.files[0].name;
        $('#inputhdr_logofname').val(fileName);
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
            url: 'http://localhost:5000/api/ninjaHeader',
            data: form_data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 800000,
            success: function (data) {
                $("#btnSubmit").prop("disabled", false);
                updateHeaderCfg();
            },
            error: function (e) {
                $("#output").text(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);
            }
        });
 
    });

    $('#logout').click(function () {
        document.location.href = "/login"
    });

    $('.applyHeaderCfg').click(function () {
        updateHeaderCfg()
    });

    $(".jscolor").on('keyup', function(evt) {
		if (evt.which == 13)
		{
            $('.applyHeaderCfg').trigger('click');
        }
    });
});
