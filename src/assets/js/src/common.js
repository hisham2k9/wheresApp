
function changeDeployModeSuccess(args, response, textStatus, request) {
    console.log(response);
    $("#frame").attr("src", "http://localhost:5000/whatsapp_v2/app.html");
}

function changeDeployModeFailure(args, jqXhr, statusInfo, errorThrown) {
    toastr.error('Error Occured while Fetching Data!');
}

function changeDeployMode(mode) {

    const options = {
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({DEPLOY_MODE: mode})
    }

    const apiURL = btcConfig.ninjas_mngr+'/ninjaDeployMode';

    const actionHandlers = {
        success: {
                    handler: changeDeployModeSuccess, 
                    args: null
        },
        error: {
                handler: changeDeployModeFailure, 
                args: null
        }
    }
    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function populate(data) {
    $.each(data, function (key, val) {
        var $el = $('[id="' + key + '"]'),
            type = $el.attr('type');

        switch (type) {
            case 'checkbox':
                if (val=='yes' || val=='enabled') {
                    val=true;
                } else if (val=='no' || val=='disabled') {
                    val=false;
                }
                if (val) {
                    $el.attr('checked', true);
                } else {
                    $el.attr('checked', false);
                }
                break;
            case 'radio':
                $el.filter('[value="' + val + '"]').attr('checked', 'checked');
                break;
            case 'select':
                $el.val(val);
                break;
            case 'selectpicker':
                $el.selectpicker('val', val);
                break;
            case 'hidden':
                $el.val(val);
                break;
            default:
                $el.val(val);
        }
    });
}

function validateForm(id) {	
    var form = document.getElementById(id);
    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return false
    } else {
        form.classList.remove('was-validated');
        form.classList.remove('invalid-feedback');
    }
    return true
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

function updateDualListBox(id, srcCaption, dstCaption, srcList, dstList) {
    var dlBox = null;
    var list_options = $('#'+id+'_ListID option');
    if (list_options.length > 0) {
        var dlBox = $('#'+id+'_ListID').bootstrapDualListbox();   
        dlBox.bootstrapDualListbox('destroy', true);
        $('#'+id).html('<select multiple="multiple" size="10" id="'+id+'_ListID">');
    }
    dlBox = $('#'+id+'_ListID').bootstrapDualListbox({
        nonSelectedListLabel: srcCaption,
        selectedListLabel: dstCaption,
        //preserveSelectionOnMove: 'moved',
        moveOnSelect: false
    });
    for (var idx in srcList) {
        var itemInfo = srcList[idx];
        /*
        var itemRating = "";

        if (itemInfo.hasOwnProperty('rating')) {
            itemRating = '<div class="col-sm-6">'+
                            '<div class="myrating" id="skillProficiency2'+idx+'">'+
                                '<input type="radio" name="proficiency2" class="rating" value="1" />'+
                                '<input type="radio" name="proficiency2" class="rating" value="2" />'+
                                '<input type="radio" name="proficiency2" class="rating" value="3" />'+
                                '<input type="radio" name="proficiency2" class="rating" value="4" />'+
                                '<input type="radio" name="proficiency2" class="rating" value="5" />'+        
                            '</div>'+
                        '</div>';
        }

        var itemRow = '<div class="row">'+
                        '<div class="col-sm-6">'+
                            itemInfo.display_name+
                        '</div>'+
                        itemRating+
                    '</div>';

        dlBox.append('<option value="'+itemInfo.id+'">'+itemRow+'</option>');

        for (var idx in srcList) {
            var id = "skillProficiency2"+idx;
            $('#'+id).rating();
        }
        */
        dlBox.append('<option value="'+itemInfo.id+'">'+itemInfo.display_name+'</option>');
    }
    for (var idx in dstList) {
        var itemInfo = dstList[idx];
        dlBox.append('<option value="'+itemInfo.id+'" selected>'+itemInfo.display_name+'</option>');
    }
    dlBox.bootstrapDualListbox('refresh', true);
}
