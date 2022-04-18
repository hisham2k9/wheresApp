
function getConfig() {
	var appConfig = {};
				
	appConfig.ninjas_transport 	= "http://";
	appConfig.ninjas_server    	=  appConfig.ninjas_transport+"bjhqdev53:5005"
	appConfig.core_server    	=  appConfig.ninjas_transport+"bjhqdev53:443"
	appConfig.ninjas_ws             =  appConfig.core_server+'/wheresapp'
	appConfig.ninjas_mngr           =  '/wheresapp'

	appConfig.imgdir            = "img/"
	appConfig.imgdir            = "css/"
	
	return appConfig;			 
}
