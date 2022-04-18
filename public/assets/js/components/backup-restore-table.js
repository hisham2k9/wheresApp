

var bcxBackupTable = function (tblConfig) {
    if (!tblConfig || !tblConfig.id) return;

    this.id = tblConfig.id;

    if (!tblConfig.hasOwnProperty('paging')) {
        tblConfig.paging = false;
    }

    if (!tblConfig.hasOwnProperty('sort')) {
        tblConfig.sort = false;
    }

    if (!tblConfig.hasOwnProperty('search')) {
        tblConfig.search = false;
    }

    if (!tblConfig.hasOwnProperty('autoWidth')) {
        tblConfig.autoWidth = false;
    }

    if (!tblConfig.hasOwnProperty('controlsLayout')) {
        tblConfig.controlsLayout = '<"left"f>rt<"bottom"lp><"clear">';
    }

    if (!tblConfig.hasOwnProperty('defSortList')) {
        tblConfig.defSortList = [1, 'desc'];
    }

    if (!tblConfig.hasOwnProperty('rowSelStyle')) {
        tblConfig.rowSelStyle = 'single';
    }

    if (!tblConfig.hasOwnProperty('searchTitle')) {
        tblConfig.searchTitle = "Filter: ";
    }

    if (!tblConfig.hasOwnProperty('searchPlaceholder')) {
        tblConfig.searchPlaceholder = "Search records";
    }

    if (!tblConfig.hasOwnProperty('dataSet')) {
        tblConfig.dataSet = []
    }

    if (!tblConfig.hasOwnProperty('checkBox')) {
        tblConfig.checkBox = false;
    }

    
    if (!tblConfig.hasOwnProperty('rowDownloadCb')) {
        tblConfig.rowDownloadCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowRestoreCb')) {
        tblConfig.rowRestoreCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowDownload')) {
        tblConfig.rowDownload = false;
    }

    if (!tblConfig.hasOwnProperty('deleteSelCb')) {
        tblConfig.deleteSelCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowRestore')) {
        tblConfig.rowRestore = false;
    }

    var dataTitleMap = [];
    if (tblConfig.hasOwnProperty('dataTitleMap')) {
        
        if (tblConfig.checkBox) {
            dataTitleMap.push({ "data": "cid", "title": '<input type="checkbox" style="cursor: pointer" id="'+tblConfig.id+'_checkAll"/>'});
        }
        for (var idx in tblConfig.dataTitleMap) {
            dataTitleMap.push(tblConfig.dataTitleMap[idx]);
        }

        if (tblConfig.rowDownload) {
            var rowData = { "data": "id", "title": "",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                console.log(row);
                                if (type === 'display') {
                                    data = '<i class="fa fa-download text-success fa-1x" style="cursor: pointer" data-toggle="tooltip" data-placement="top" title="Download" onclick="downloadRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }
        if (tblConfig.rowRestore) {
            var rowData = { "data": "id", "title": "",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                if (type === 'display') {
                                    data = '<i class="fa fa-undo fa-1x text-primary" style="cursor: pointer" data-toggle="tooltip" data-placement="bottom" title="Restore" onclick="restoreRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }
    }

    var colDefs = [];
    if (tblConfig.hasOwnProperty('checkBox')) {
        colDefs.push({ 
            "title": '<input type="checkbox" style="cursor: pointer" id="'+tblConfig.id+'_checkAll"/>', 
            "targets": 0 
        });
        colDefs.push({
            "searchable": false,
            "orderable": false,
            "sort": false,
            "className": 'select-checkbox',
            "targets":   0
        });
    }

    if (tblConfig.hasOwnProperty('hiddenCols')) {
        colDefs.push({
            "targets": tblConfig.hiddenCols,
            "visible": false,
            "searchable": false
        });
    }

    if (tblConfig.hasOwnProperty('noSortCols')) {
        colDefs.push({
            "targets": tblConfig.noSortCols,
            "searchable": false,
            "orderable": false,
            "sort": false
        } );
    }

    this.backupTable = $('#'+tblConfig.id).DataTable({
        destroy: true,
        responsive: true,
        paging: tblConfig.paging,
        sort: tblConfig.sort,
        searching: tblConfig.search,
        autoWidth: tblConfig.autoWidth,
        dom: tblConfig.controlsLayout,
        order: [tblConfig.defSortList],
        select: {
            style: tblConfig.rowSelStyle
        },
        oLanguage: {
            "sSearch": tblConfig.searchTitle
        },
        language: {
            searchPlaceholder: tblConfig.searchPlaceholder
        },
        data: tblConfig.dataSet,
        columns: dataTitleMap,
        columnDefs: colDefs
    });
    
    this.backupTable.rowDownloadCb = tblConfig.rowDownloadCb;
    this.backupTable.rowRestoreCb = tblConfig.rowRestoreCb;
    this.backupTable.deleteSelCb = tblConfig.deleteSelCb;

    window.bcxBackupRestoreTable = this.backupTable;

    _this_bkuprestTbl = this;

    $('#'+tblConfig.id+'_checkAll').click(function () {
        if ($('#'+tblConfig.id+'_checkAll').is(":checked")) {
            window.bcxBackupRestoreTable.rows().select();
        } else {
            window.bcxBackupRestoreTable.rows().deselect();
        }
    });

    $('#'+tblConfig.form_id+'New').click(function () {
        /*
        $('#'+tblConfig.cntrlbox_id+'CntrlBoxDiv').removeClass('d-none');
        $('#'+tblConfig.form_id+'Div').removeClass('d-none');
        $('#'+tblConfig.id+'Div').addClass('d-none');
        */
    });

    $('#'+tblConfig.cntrlbox_id+"Cancel").click(function () {
        $('#'+tblConfig.cntrlbox_id+'CntrlBoxDiv').addClass('d-none');
        $('#'+tblConfig.form_id+'Div').addClass('d-none');
        $('#'+tblConfig.id+'Div').removeClass('d-none');
    });

    $('#'+tblConfig.form_id+'Remove').click(function () {
        var count = window.bcxBackupRestoreTable.rows( { selected: true } ).count();
        console.log(count);
        if (count > 0) {
            var rowData = window.bcxBackupRestoreTable.rows( { selected: true } ).data().toArray();
            console.log(rowData);
            //window.bcxBackupRestoreTable.rows('.selected').remove().draw();

            var delData = {
                "rows" : rowData
            };
            const apiURL = btcConfig.ninjas_mngr+'/backup';
            const options = {
                method: "DELETE",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(delData)
                //headers: {"Authorization": "Bearer "+token}
            }
            const actionHandlers = {
                success: {
                            handler: function (args, response, textStatus, request) {
                                //success_cb(response);
                                console.log("delete success_cb: "+response);
                                toastr.success('Deleted Successfully');
                                _this_bkuprestTbl.getAllBackups();
                            },  
                            args: null
                },
                error: {
                        handler: function (args, jqXhr, statusInfo, errorThrown) {
                            //failure_cb(statusInfo);
                            console.log("delete failure_cb: "+statusInfo);
                            toastr.success('Delete failed');
                        }, 
                        args: null
                }
            }
        
            makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
    
            //var anSelected = fnGetSelected( window.bcxBackupRestoreTable );
            //$(anSelected).remove();            
        }
        $('#'+tblConfig.id+'_checkAll').prop('checked', false);
    });

}

bcxBackupTable.prototype.getAllBackups = function() {
    window.bcxBackupRestoreTable.rows().remove().draw();
    //const token = window.sessionStorage.getItem("bcx-access-token");
    //console.log('bcx-access-token: '+token);
    const apiURL = btcConfig.ninjas_mngr+'/backup';
    const options = {
        method: "GET",
        dataType: "json",
        contentType: "application/json"
        //headers: {"Authorization": "Bearer "+token}
    }
    const actionHandlers = {
        success: {
                    handler: function (args, response, textStatus, request) {
                        //success_cb(response);
                        console.log("refresh:success_cb: "+response);
                        window.bcxBackupRestoreTable.rows.add(response.backups).draw();
                    },  
                    args: null
        },
        error: {
                handler: function (args, jqXhr, statusInfo, errorThrown) {
                    //failure_cb(statusInfo);
                    console.log("refresh:failure_cb: "+statusInfo);
                }, 
                args: null
        }
    }

    makeRestRequest(btcConfig.ninjas_server + apiURL, options, actionHandlers);
}

function fnGetSelected(oTableLocal) {
    return oTableLocal.$('tr.selected');
}

function downloadRowCb(num) {

    var data = window.bcxBackupRestoreTable.row(num).data();
    //console.log(data);
    if (window.bcxBackupRestoreTable.rowDownloadCb) 
        window.bcxBackupRestoreTable.rowDownloadCb(num, data);
}
 
function restoreRowCb(num) {
    var data = window.bcxBackupRestoreTable.row(num).data();
    //console.log(data);
   
    if (window.bcxBackupRestoreTable.rowRestoreCb)
        window.bcxBackupRestoreTable.rowRestoreCb(num, data);
    //window.bcxBackupRestoreTable.row(num).remove().draw();
}
