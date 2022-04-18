
var basicStandardTable = function (tblConfig) {
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
        //tblConfig.controlsLayout = '<"left"f>rt<"bottom"lp><"clear">';
        tblConfig.controlsLayout = '<"left"f>lt<"bottom"p><"clear">';
    }

    if (!tblConfig.hasOwnProperty('defSortList')) {
        tblConfig.defSortList = [1, 'asc'];
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

    if (!tblConfig.hasOwnProperty('newFormCb')) {
        tblConfig.newFormCb = null;
    }
    
    if (!tblConfig.hasOwnProperty('rowViewCb')) {
        tblConfig.rowViewCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowEditCb')) {
        tblConfig.rowEditCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowRemoveCb')) {
        tblConfig.rowRemoveCb = null;
    }

    if (!tblConfig.hasOwnProperty('rowCopy')) {
        tblConfig.rowCopy = false;
    }

    if (!tblConfig.hasOwnProperty('rowView')) {
        tblConfig.rowView = false;
    }

    if (!tblConfig.hasOwnProperty('rowEdit')) {
        tblConfig.rowEdit = false;
    }

    if (!tblConfig.hasOwnProperty('rowDel')) {
        tblConfig.rowDel = false;
    }

    var dataTitleMap = [];
    if (tblConfig.hasOwnProperty('dataTitleMap')) {
        if (tblConfig.checkBox) {
            dataTitleMap.push({ "data": "__blank", "title": '<input type="checkbox" style="cursor: pointer;" id="'+tblConfig.id+'_checkAll"/>'});
        }
        for (var idx in tblConfig.dataTitleMap) {
            dataTitleMap.push(tblConfig.dataTitleMap[idx]);
        }
        if (tblConfig.rowView) {
            var rowData = { "data": "id", "title": "View",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                console.log(row);
                                if (type === 'display') {
                                    data = '<i class="fa fa-eye fa-1x" data-toggle="tooltip" data-placement="top" title="View" style="cursor: pointer" onclick="viewRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }
        if (tblConfig.rowEdit) {
            var rowData = { "data": "id", "title": "Edit",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                console.log(row);
                                if (type === 'display') {
                                    data = '<i class="fa fa-edit fa-1x" data-toggle="tooltip" data-placement="top" title="Edit" style="cursor: pointer" onclick="editRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }
        if (tblConfig.rowCopy) {
            var rowData = { "data": "id", "title": "Copy",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                console.log(row);
                                if (type === 'display') {
                                    data = '<i class="fa fa-copy fa-1x" data-toggle="tooltip" data-placement="top" title="Copy" style="cursor: pointer" onclick="copyRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }
        /*if (tblConfig.rowDel) {
            var rowData = { "data": "id", "title": "",
                            "render": function (data, type, row, meta) {
                                var id=meta.row;
                                if (type === 'display') {
                                    data = '<i class="fa fa-times fa-1x text-danger" style="cursor: pointer" onclick="removeRowCb('+id+');return false;"></i>';
                                }
                                return data;
                            }
                        }
            dataTitleMap.push(rowData);
        }*/
    }

    var colDefs = [];
    if (tblConfig.hasOwnProperty('checkBox') && tblConfig.checkBox) {
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

    this.stdTable = $('#'+tblConfig.id).DataTable({
        destroy: true,
        responsive: true,
        paging: tblConfig.paging,
        sort: tblConfig.sort,
        searching: tblConfig.search,
        autoWidth: tblConfig.autoWidth,
        dom: tblConfig.controlsLayout,
        order: tblConfig.defSortList,
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
    this.stdTable.form_id = tblConfig.form_id;
    this.stdTable.newFormCb = tblConfig.newFormCb;
    this.stdTable.rowCopyCb = tblConfig.rowCopyCb;
    this.stdTable.rowViewCb = tblConfig.rowViewCb;
    this.stdTable.rowEditCb = tblConfig.rowEditCb;
    this.stdTable.rowRemoveCb = tblConfig.rowRemoveCb;

    window.bcxStdTable = this.stdTable;
    $('#'+tblConfig.id+'_checkAll').click(function () {
        if ($('#'+tblConfig.id+'_checkAll').is(":checked")) {
            window.bcxStdTable.rows().select();
        } else {
            window.bcxStdTable.rows().deselect();
        }
    });

    $('#'+tblConfig.form_id+'New').click(function () {
        //$('#'+tblConfig.cntrlbox_id+'CntrlBoxDiv').removeClass('d-none');
        $('#'+tblConfig.form_id+'Div').removeClass('d-none');
        $('#'+tblConfig.id+'Div').addClass('d-none');
        $('#'+tblConfig.form_id+'_Action').val('new');
        $('#'+tblConfig.form_id+'Div form').trigger('reset');
        $('#'+tblConfig.form_id+'Div .selectpicker').val('0').selectpicker('refresh');
        
        if (window.bcxStdTable.newFormCb) {
            window.bcxStdTable.newFormCb();
        }
    });

    $('#'+tblConfig.cntrlbox_id+"Cancel").click(function () {
        //$('#'+tblConfig.cntrlbox_id+'CntrlBoxDiv').addClass('d-none');
        $('#'+tblConfig.form_id+'Div').addClass('d-none');
        $('#'+tblConfig.id+'Div').removeClass('d-none');
    });

    $('#'+tblConfig.form_id+'Remove').click(function () {
        var count = window.bcxStdTable.rows( { selected: true } ).count();
        console.log(count);
        if (count > 0) {
            var rowData = window.bcxStdTable.rows( { selected: true } ).data().toArray();
            console.log(rowData);

            if (window.bcxStdTable.rowRemoveCb) {
                window.bcxStdTable.rowRemoveCb(count, rowData);
            }

            //var anSelected = fnGetSelected( window.bcxStdTable );
            //$(anSelected).remove();
        }
        $('#'+tblConfig.id+'_checkAll').prop('checked', false);
    });
}

basicStandardTable.prototype.loadData = function(data) {
    window.bcxStdTable.rows().remove().draw();
    /*Temporary: To remove. this is for making 1st column null in datatables*/
    for (var idx in data) {
        data[idx]['__blank'] = "";
    }
    window.bcxStdTable.rows.add(data).draw();
}

basicStandardTable.prototype.addRow = function(data) {
    window.bcxStdTable.rows.add(data).draw();
}

basicStandardTable.prototype.instance = function(data) {
    return window.bcxStdTable.stdTable;
}

function fnGetSelected(oTableLocal) {
    return oTableLocal.$('tr.selected');
}

function viewRowCb(num) {
    $('#'+window.bcxStdTable.form_id+'_Action').val('edit');
    var data = window.bcxStdTable.row(num).data();
    //console.log(data);
    if (window.bcxStdTable.rowViewCb) 
        window.bcxStdTable.rowViewCb(num, data);
}

function editRowCb(num) {
    $('#'+window.bcxStdTable.form_id+'_Action').val('edit');
    var data = window.bcxStdTable.row(num).data();
    //console.log(data);
    if (window.bcxStdTable.rowEditCb) 
        window.bcxStdTable.rowEditCb(num, data);
}
 
function removeRowCb(num) {
    var data = window.bcxStdTable.row(num).data();
    //console.log(data);
    if (window.bcxStdTable.rowRemoveCb)
        window.bcxStdTable.rowRemoveCb(num, data);
    window.bcxStdTable.row(num).remove().draw();
}

function copyRowCb(num) {
    $('#'+window.bcxStdTable.form_id+'_Action').val('copy');
    var data = window.bcxStdTable.row(num).data();
    //console.log(data);
    if (window.bcxStdTable.rowCopyCb) 
        window.bcxStdTable.rowCopyCb(num, data);
}