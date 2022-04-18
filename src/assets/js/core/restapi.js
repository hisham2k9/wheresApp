function makeRestRequest(url, options, actionHandlers) {

    var reqBody = {
		url: url,
		type: options["method"],
		success: function(response, textStatus, request){
			actionHandlers.success.handler(actionHandlers.success.args, response, textStatus, request);
		},

		error: function(jqXhr, statusInfo, errorThrown) {
			actionHandlers.error.handler(actionHandlers.success.args, jqXhr, statusInfo, errorThrown);
		}
    }

    if ('dataType' in options) reqBody["dataType"] = options["dataType"]
    if ('contentType' in options) reqBody["contentType"] = options["contentType"]
    if ('data' in options) reqBody["data"] = options["data"]
    if ('headers' in options) reqBody["headers"] = options["headers"]

    $.ajax(reqBody);
    
}