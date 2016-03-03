var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
	
var Main =
{
		version : "v2.2.0a",
		requiredServerVersion : "3.0.5211",
		requiredDevServerVersion : "3.0.5507.2131",
		
		//TV Series Version
		modelYear : null,
		width : 1920,
		height : 1080,
		backdropWidth : 1920,
		backdropHeight : 1080,
		posterWidth : 427,
		posterHeight : 240,
		seriesPosterWidth : 180,
		seriesPosterHeight : 270,
		seriesPosterLargeWidth : 235,
		seriesPosterLargeHeight : 350,
		
		forceDeleteSettings : false,
		
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
	
	window.onShow = Main.initKeys();
	FileLog.write("Key handlers initialised.");
	
	//Set Version Number & initialise clock
	//document.getElementById("menuVersion").innerHTML = this.version;
	Support.clock();

	//Get the model year - Used for transcoding
	var matches = [];
	if (webapis.tv.info.getProduct() === webapis.tv.info.PRODUCT_TYPE_BD) {
		matches = (webapis.tv.info.getModel() || '').match(/^\w\w(\w)/);
	} else {
		matches = (webapis.tv.info.getModel() || '').match(/^\w+\d+(\w)/);
	}

	if (!matches || !matches.length) {
		FileLog.write("Unknown product type, assuming D series");
		this.modelYear = "D";
	} else {
		this.modelYear = matches[1];
		FileLog.write("Model Year is " + this.modelYear);
	}

	webapis.network.getAvailableNetworks(function(networks) {
		var activeNetwork = networks.find(function(network) { return network.isActive(); });
		if (!activeNetwork) {
			// failsafe, should never get here
			FileLog.write('Found available networks but none are active');
			document.getElementById("pageContent").innerHTML = "You have no network connectivity to the TV - Please check the settings on the TV";
			return;
		}

		Server.setDevice ("Samsung " + webapis.tv.info.getModel());
		Server.setDeviceID(webapis.tv.info.getDeviceID() || "0123456789ab");

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
	    	FileLog.write("Emby server found.");
	    	File.setServerEntry(0);
	    	Server.testConnectionSettings(fileJson.Servers[0].Path,true); 
	    } else {
	    	//No Server Defined - Load GuiPage_IP
	    	FileLog.write("No server defined. Loading the new server page.");
	    	GuiPage_NewServer.start();
	    }
	}, function() {
		document.getElementById("pageContent").innerHTML = "You have no network connectivity to the TV - Please check the settings on the TV";
	});
	widgetAPI.sendReadyEvent();
	Support.clock();

	setTimeout(function(){
		document.getElementById("splashscreen").style.opacity=0;
		setTimeout(function(){
			document.getElementById("splashscreen").style.visibility="hidden";
		}, 1100);
		FileLog.write("Ready to start. Removing the splash screen.");
	}, 2500);
};

Main.initKeys = function() {
	pluginAPI.registKey(tvKey.KEY_TOOLS);
	pluginAPI.registKey(tvKey.KEY_3D); 
	return;
}


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