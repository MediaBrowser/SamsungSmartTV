var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
	
var Main =
{
		version : "v2.2.5",
		requiredServerVersion : "3.0.5211",
		requiredDevServerVersion : "3.0.5507.2131",
		
		//TV Series Version
		modelYear : null,
		width : 1920,
		height : 1080,
		backdropWidth : 1920,
		backdropHeight : 1080,
		posterWidth : 473,
		posterHeight : 267,
		seriesPosterWidth : 180,
		seriesPosterHeight : 270,
		seriesPosterLargeWidth : 235,
		seriesPosterLargeHeight : 350,
		
		forceDeleteSettings : false,
		highlightColour : 1,
		
		enableMusic : true,
		enableLiveTV : true,
		enableCollections : true,
		enableChannels : true,
		enableImageCache : true,
		
		enableScreensaver : true,
		isScreensaverRunning : false,
};

Main.getModelYear = function() {
	return this.modelYear;
};

Main.isMusicEnabled = function() {
	return this.enableMusic;
};

Main.isLiveTVEnabled = function() {
	return this.enableLiveTV;
};

Main.isCollectionsEnabled = function() {
	return this.enableCollections;
};

Main.isChannelsEnabled = function() {
	return this.enableChannels;
};

Main.isScreensaverEnabled = function() {
	return this.enableScreensaver;
};

Main.isImageCaching = function() {
	return this.enableImageCache;
};

Main.getRequiredServerVersion = function() {
	return this.requiredServerVersion;
};

Main.getVersion = function() {
	return this.version;
};

Main.getIsScreensaverRunning = function() {
	return this.isScreensaverRunning;
};

Main.setIsScreensaverRunning = function() {
	if (this.isScreensaverRunning == false) {
		this.isScreensaverRunning = true;
	} else {
		this.isScreensaverRunning = false;
	}
};

Main.onLoad = function()
{	
	//Support.removeSplashScreen();
	//Setup Logging
	FileLog.loadFile(false); // doesn't return contents, done to ensure file exists
	FileLog.write("---------------------------------------------------------------------",true);
	FileLog.write("Emby Application Started");
	
	if (Main.isImageCaching()) {
		var fileSystemObj = new FileSystem();
		fileSystemObj.deleteCommonFile(curWidget.id + '/cache.json');
		Support.imageCachejson = JSON.parse('{"Images":[]}');
	}
	
	document.getElementById("splashscreen_version").innerHTML = Main.version;
	
	//Turn ON screensaver
	pluginAPI.setOnScreenSaver();
	FileLog.write("Screensaver enabled.");
	Support.clock();
	widgetAPI.sendReadyEvent();
	window.onShow = Main.initKeys();	

	//Set DeviceID & Device Name
	var NNaviPlugin = document.getElementById("pluginObjectNNavi");
	var pluginNetwork = document.getElementById("pluginObjectNetwork");
	var pluginTV = document.getElementById("pluginObjectTV");
	FileLog.write("Plugins initialised.");

	var ProductType = pluginNetwork.GetActiveType();
	FileLog.write("Product type is "+ProductType);
	var phyConnection = pluginNetwork.CheckPhysicalConnection(ProductType); //returns -1
	FileLog.write("Check physical connection returned "+phyConnection);
	var http = pluginNetwork.CheckHTTP(ProductType); //returns -1
	FileLog.write("Check HTTP returned "+http);
	var gateway = pluginNetwork.CheckGateway(ProductType); //returns -1
	FileLog.write("Check gateway returned "+gateway);
	
	//Get the model year - Used for transcoding
	if (pluginTV.GetProductCode(0).substring(0,2) == "HT" || pluginTV.GetProductCode(0).substring(0,2) == "BD"){
		this.modelYear = pluginTV.GetProductCode(0).substring(3,4);

	} else if (pluginTV.GetProductCode(0).substring(4,7) == "H52") {
		this.modelYear = "F";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J43") {
		this.modelYear = "F";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J52") {
		this.modelYear = "F";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J53") {
		this.modelYear = "F";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J62") {
		this.modelYear = "F";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J55") {
		this.modelYear = "H";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J63") {
		this.modelYear = "H";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "J64") {
		this.modelYear = "H";
	} else if (pluginTV.GetProductCode(0).substring(4,6) == "HU") {
		this.modelYear = "HU";
	} else if (pluginTV.GetProductCode(0).substring(4,7) == "K85") {
		this.modelYear = "HU";
	} else {
		this.modelYear = pluginTV.GetProductCode(0).substring(4,5);
	}
	FileLog.write("Model Year is " + this.modelYear);
	
	if (phyConnection && http && gateway) {
		var MAC = pluginNetwork.GetMAC(1);
		if (MAC == false || MAC == null) { //Set mac to fake	
			MAC = "0123456789ab" ;
		}
		FileLog.write("MAC address is "+MAC);
		Server.setDevice ("Samsung " + pluginTV.GetProductCode(0));
		Server.setDeviceID(NNaviPlugin.GetDUID(MAC));
		
	    //Load Settings File - Check if file needs to be deleted due to development
	    var fileJson = JSON.parse(File.loadFile()); 
	    var version = File.checkVersion(fileJson);
	    if (version == "Undefined" ) {
	    	//Delete Settings file and reload
	    	File.deleteSettingsFile();
	    	fileJson = JSON.parse(File.loadFile());
	    } else if (version != this.version) {
	    	if (this.forceDeleteSettings == true) {
	    		//Delete Settings file and reload
	    		File.deleteSettingsFile();
		    	fileJson = JSON.parse(File.loadFile());
	    	} else {
	    		//Update version in settings file to current version
	    		fileJson.Version = this.version;
	    	} 	File.writeAll(fileJson);
	    }
	    
	    //Allow Evo Kit owners to override the model year.
	    if (fileJson.TV.ModelOverride != "None") {
	    	switch(fileJson.TV.ModelOverride){
	    	case "SEK1000":
	    		this.modelYear = "F";
	    		break;
	    	case "SEK2000":
	    		this.modelYear = "H";
	    		break;
	    	case "SEK2500":
	    		this.modelYear = "H";
	    		break;
	    	}
	    	FileLog.write("Model Year Override: " + this.modelYear);
	    }
	    
	    //Check if Server exists
	    if (fileJson.Servers.length > 1) {
	    	//If no default show user Servers page (Can set default on that page)
	    	var foundDefault = false;
	    	for (var index = 0; index < fileJson.Servers.length; index++) {
	    		if (fileJson.Servers[index].Default == true) {
	    			foundDefault = true;
	    			FileLog.write("Default server found.");
	    			File.setServerEntry(index);
	    			Server.testConnectionSettings(fileJson.Servers[index].Path,true);    				
	    			break;
	    		}
	    	}
	    	if (foundDefault == false) {
	    		FileLog.write("Multiple servers defined. Loading the select server page.");
	    		GuiPage_Servers.start();
	    	}
	    } else if (fileJson.Servers.length == 1) {
	    	//If 1 server auto login with that
	    	FileLog.write("Emby server name found in settings. Auto-connecting.");
	    	File.setServerEntry(0);
	    	Server.testConnectionSettings(fileJson.Servers[0].Path,true);
	    } else {
	    	//No Server Defined - Load GuiPage_IP
	    	FileLog.write("No server defined. Loading the new server page.");
	    	GuiPage_NewServer.start();
	    }
	} else {
		document.getElementById("pageContent").innerHTML = "You have no network connectivity to the TV - Please check the settings on the TV";
	}
};

Main.initKeys = function() {
	pluginAPI.registKey(tvKey.KEY_TOOLS);
	pluginAPI.registKey(tvKey.KEY_3D); 
	FileLog.write("Key handlers initialised.");
};

Main.onUnload = function()
{
	//Write Cache to disk
	ImageCache.writeAll(Support.imageCachejson);
	Support.screensaverOff();
	GuiImagePlayer.kill();
	GuiMusicPlayer.stopOnAppExit();
	GuiPlayer.stopOnAppExit();
	pluginAPI.unregistKey(tvKey.KEY_TOOLS);
	pluginAPI.unregistKey(tvKey.KEY_3D);
};
