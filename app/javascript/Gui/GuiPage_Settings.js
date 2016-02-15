var GuiPage_Settings = {
		AllData : null,
		UserData : null,
		ServerUserData : null,

		selectedItem : 0,
		currentPage : 0,
		selectedBannerItem : -1,
		selectedSubItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 1,
		MAXROWCOUNT : 10,
		
		bannerItems : ["User Settings","Server Settings","TV Settings","Log","About"],
		currentView : null,
		currentViewSettings : null,
		currentViewSettingsName : null,
		currentViewSettingsDefaults : null,
		
		CurrentSubSettings : [],
		CurrentSettingValue : null,
		
		//Per Setting Type List of settings, names & defaults
		Settings : ["Default","ContinueWatching","View1","View2","LargerView","AudioTheme","MusicView","SkipMusicAZ","SkipShow","SeasonLabel","AutoPlay","EnableCinemaMode","ShowDisc","SubtitleSize","SubtitleColour","ImagePlayerImageTime","ScreensaverImages","ScreensaverTimeout","ScreensaverImageTime","ForgetSavedPassword"],
		SettingsName : ["Default User: ","Continue Watching:","Home View 1: ","Home View 2: ","Show Larger Icons: ", "Play Audio Themes: ", "Default Music View: ", "Skip Music A-Z: ", "Skip TV Show Page: ","Use Alternate Season Label: ","Auto Play Next Episode: ","Enable cinema mode: ","Show Disc Art: ","Subtitle Text Size: ","Subtitle Text Colour: ","Image Player Rotate Speed: ", "Screensaver Image Source: ", "Screensaver Timeout: ", "Screensaver Rotate Speed: ", "Forget Password at Log Out:"],
		SettingsDefaults : [false,true,"ddddd","aaaaa",false,false,"Album",false,false,false,false,true,true,"50px","white",10000,"Media",300000,10000,false],
		
		TVSettings : ["Bitrate","Dolby","DTS","AACtoDolby","ItemPaging","ClockOffset"],
		TVSettingsName : ["Max Bitrate: ","Enable Dolby Digital Playback: ","Enable DTS Playback: ","Enable AAC Transcoding to Dolby: ","Item Paging: ","Clock Offset: "],
		TVSettingsDefaults : [60,false,false,false,150,0],
		
		ServerSettings : ["DisplayMissingEpisodes","DisplayUnairedEpisodes","GroupMovieCollections","DefaultAudioLang","PlayDefaultAudioTrack","DefaultSubtitleLang", "SubtitleMode", "HidePlayedInLatest"],
		ServerSettingsName : ["Display Missing Episodes: ", "Display Unaired Episodes: ","Group Movies into Collections: ","Default Audio Language: ","Play default audio track regardless of language: ", "Default Subtitle Language: ","Subtitle Mode:","Hide watched content from latest media:"], 
		ServerSettingsDefaults : [false,false,false,"",true,"","default",false], //Not actually Used but implemented for clean code!!! Values read from Server so no default needed!
		
		//Per Setting Options & Values
		DefaultOptions : ["True","False"],
		DefaultValues : [true,false], 
		
		View1Options : [], 
		View1Values : [], 
		
		View2Options : [], 
		View2Values : [], 
		
		MusicViewOptions : ["Recent", "Frequent", "Album", "Album Artist", "Artist"],
		MusicViewValues : ["Recent", "Frequent", "Album", "Album Artist", "Artist"],

		TvConnectionOptions : ["120Mb/s","100Mb/s","80Mb/s","60Mb/s","40Mb/s","30Mb/s","20Mb/s","15Mb/s","10Mb/s","8Mb/s","6Mb/s","5Mb/s","4Mb/s","3Mb/s","2Mb/s","1Mb/s","0.5Mb/s"], 
		TvConnectionValues : [120,100,80,60,40,30,20,15,10,8,6,5,4,3,2,1,0.5], 
		
		ItemPagingOptions : [100,150,200,300,500],
		ItemPagingValues : [100,150,200,300,500],
		
		SubtitleSizeOptions: ["70px","66px","62px","58px","54px","50px"],
		SubtitleSizeValues: ["70px","66px","62px","58px","54px","50px"],
		
		SubtitleColourOptions: ["White","Red","Green","Blue","Yellow"],
		SubtitleColourValues: ["white","red","green","blue","yellow"],
		
		ScreensaverImagesOptions : ["Photos from Media Folders","Images from TVs or Movies"],
		ScreensaverImagesValues : ["Media","Metadata"],
		
		ScreensaverTimeoutOptions : ["20 Minutes", "10 Minutes", "5 Minutes", "2 Minutes", "1 Minute"],
		ScreensaverTimeoutValues : [1200000,600000,300000,120000,60000],
		
		ClockOffsetOptions : ["+12 hour", "+11 hours", "+10 hours", "+9 hours", "+8 hours", "+7 hours", "+6 hours", "+5 hours", "+4 hours", "+3 hours", "+2 hours", "+1 hour","0 hours", "-1 hour", "-2 hours", "-3 hours", "-4 hours", "-5 hours", "-6 hours", "-7 hours", "-8 hours", "-9 hours", "-10 hours", "-11 hours", "-12 hours"],
		ClockOffsetValues : [12,11,10,9,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12],
		
		//Also used for Image Player - Different setting!
		ScreensaverImageTimeOptions : ["5 Minutes", "2 Minutes", "1 Minute", "30 Seconds", "20 Seconds", "10 Seconds", "5 Seconds"],
		ScreensaverImageTimeValues : [300000,120000,60000,30000,20000,10000,5000],
		
		LanguageOptions : ["None","English","French","German","Spanish","Italian"],
		LanguageValues : ["","eng","fre","ger","spa","ita"],
		
		SubtitleModeOptions : ["Default","Only Forced Subtitles", "Always Play Subtitles", "None"],
		SubtitleModeValues : ["Default","OnlyForced", "Always", "None"]
}

GuiPage_Settings.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_Settings.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiPage_Settings.initiateViewValues = function() {
	TVNextUp = Server.getServerAddr() + "/Shows/NextUp?format=json&UserId="+Server.getUserID()+"&IncludeItemTypes=Episode&ExcludeLocationTypes=Virtual&Limit=24&Fields=PrimaryImageAspectRatio,SeriesInfo,DateCreated,SyncInfo,SortName&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Banner,Thumb";
	Favourites = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&Filters=IsFavorite&fields=SortName&recursive=true");
	FavouriteMovies = Server.getServerAddr() + "/Users/"+Server.getUserID()+"/Items?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Movie&Filters=IsFavorite&Limit=10&Recursive=true&Fields=PrimaryImageAspectRatio,SyncInfo&CollapseBoxSetItems=false&ExcludeLocationTypes=Virtual";
	FavouriteSeries = Server.getServerAddr() + "/Users/"+Server.getUserID()+"/Items?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&Filters=IsFavorite&Limit=10&Recursive=true&Fields=PrimaryImageAspectRatio,SyncInfo&CollapseBoxSetItems=false&ExcludeLocationTypes=Virtual";
	FavouriteEpisodes = Server.getServerAddr() + "/Users/"+Server.getUserID()+"/Items?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Episode&Filters=IsFavorite&Limit=10&Recursive=true&Fields=PrimaryImageAspectRatio,SyncInfo&CollapseBoxSetItems=false&ExcludeLocationTypes=Virtual";
	SuggestedMovies = Server.getCustomURL("/Movies/Recommendations?format=json&userId="+Server.getUserID()+"&categoryLimit=2&ItemLimit=6&Fields=PrimaryImageAspectRatio,MediaSourceCount,SyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Banner,Thumb");
	MediaFolders = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&CollapseBoxSetItems=false&fields=SortName");
	LatestTV = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Episode&IsFolder=false&fields=SortName,Overview,Genres,RunTimeTicks");
	LatestMovies = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Movie&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");

	this.View1Options = ["Next Up","All Favourites","Favourite Movies","Favourite Series","Favourite Episodes","Suggested For You","Media Folders","Latest TV","Latest Movies"];
	this.View1Values = [TVNextUp,Favourites,FavouriteMovies,FavouriteSeries,FavouriteEpisodes,SuggestedMovies,MediaFolders,LatestTV,LatestMovies];
	this.View2Options = ["None","Next Up","All Favourites","Favourite Movies","Favourite Series","Favourite Episodes","Suggested For You","Media Folders","Latest TV","Latest Movies"];
	this.View2Values = [null,TVNextUp,Favourites,FavouriteMovies,FavouriteSeries,FavouriteEpisodes,SuggestedMovies,MediaFolders,LatestTV,LatestMovies];
	
	this.SettingsDefaults[2] = TVNextUp;
	this.SettingsDefaults[3] = LatestMovies;
}

GuiPage_Settings.start = function(viewToDisplay) {	
	alert("Page Enter : GuiPage_Settings");
	
	//Reset Vars
	this.selectedItem = 0;
	this.currentPage = 0;
	this.selectedBannerItem = -1;
	this.selectedSubItem = 0;
	this.topLeftItem = 0;
	
	//Get View Vaules - Specific per user due to Id!
	this.initiateViewValues();
	
	//Load Data
	var fileJson = JSON.parse(File.loadFile());  
	this.AllData = fileJson;
	this.UserData = fileJson.Servers[File.getServerEntry()].Users[File.getUserEntry()];
	
	//Check settings in file - If not write defaults
	this.checkSettingsInFile();
	
	//Load Server Data for User
	var userURL = Server.getServerAddr() + "/Users/" + Server.getUserID() + "?format=json";
	this.ServerUserData = Server.getContent(userURL);
	if (this.ServerUserData == null) { return; }
	
	document.getElementById("pageContent").className = "";
	document.getElementById("pageContent").style.color = "white"; 
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div><div id='guiTV_Show_Title' class='guiPage_Settings_Title'></div>" +
		"<div id='guiPage_Settings_Settings' class='guiPage_Settings_Settings'></div>" +
		"<div id='guiPage_Settings_Overview' class='guiPage_Settings_Overview'>" +
			"<div id=guiPage_Settings_Overview_Title></div>" +
			"<div id=guiPage_Settings_Overview_Content></div>" +
		"</div>";
	
	//Create Banner Items
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index != this.bannerItems.length-1) {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ')+"</div>";			
		} else {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ')+"</div>";					
		}
	}

	//Set default view as the User Settings Page
	if (viewToDisplay == null || viewToDisplay === undefined || viewToDisplay == "User Settings") {
		this.currentView = "User Settings";
		this.currentPage = 0;
		this.currentViewSettings = this.Settings;
		this.currentViewSettingsName = this.SettingsName;
		this.currentViewSettingsDefaults = this.SettingsDefaults;
		document.getElementById("guiTV_Show_Title").innerHTML = "User Settings for "+this.UserData.UserName;
	} else if (viewToDisplay == "TV Settings") {
		this.currentView = "TV Settings";
		this.currentPage = 2;
		this.currentViewSettings = this.TVSettings;
		this.currentViewSettingsName = this.TVSettingsName;
		this.currentViewSettingsDefaults = this.TVSettingsDefaults;
		document.getElementById("guiTV_Show_Title").innerHTML = "TV Settings for " + Server.getDevice();
	} else {
		//Set default view as the User Settings Page
		this.currentView = "Server Settings";
		this.currentPage = 1;
		this.currentViewSettings = this.ServerSettings;
		this.currentViewSettingsName = this.ServerSettingsName;
		this.currentViewSettingsDefaults = this.ServerSettingsDefaults;
		document.getElementById("guiTV_Show_Title").innerHTML = "Server Settings for "+this.UserData.UserName;	
	}
	
	//Update Displayed & Updates Settings
	this.updateDisplayedItems();
	this.updateSelectedItems();
	this.updateSelectedBannerItems();
	
	document.getElementById("GuiPage_Settings").focus();
}

GuiPage_Settings.checkSettingsInFile = function() {
	var changed = false;
	
	for (var index = 0; index < this.Settings.length;index++) {
		if (this.UserData[this.Settings[index]] === undefined) {
			this.UserData[this.Settings[index]] = this.SettingsDefaults[index];
			changed = true; 
		}
	}
	
	if (changed == true) {
		File.updateUserSettings(this.UserData);
		changed = false;
	}
	
	//Check TV Settings
	changed = false;
	if (this.AllData.TV === undefined) {
		this.AllData.TV = {};
		File.writeAll (this.AllData);
	}
	
	for (var index = 0; index < this.TVSettings.length;index++) {
		if (this.AllData.TV[this.TVSettings[index]] === undefined) {
			this.AllData.TV[this.TVSettings[index]] = this.TVSettingsDefaults[index];
			changed = true; 
		}
	}
	
	if (changed == true) {
		File.writeAll(this.AllData);
		changed = false;
	}
};

GuiPage_Settings.updateDisplayedItems = function() {
	var htmlToAdd = "<table class=guiSettingsTable>";
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.currentViewSettings.length); index++) {
		//Finds the setting in the file and generates the correct current set value
		//Only needs new entries here if they have differing settings (true false is top so works for many settings)
		var Setting = "";
		switch (this.currentViewSettings[index]) {
		case "Default":
		case "ContinueWatching":
		case "AudioTheme":
		case "SkipShow":
		case "SkipMusicAZ":
		case "SeasonLabel":
		case "AutoPlay":
		case "EnableCinemaMode":
		case "ShowDisc":	
		case "LargerView":
		case "ForgetSavedPassword":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;
		case "View1":
			for (var index2 = 0; index2 < this.View1Values.length; index2++) {				
				if (this.View1Options[index2] == this.UserData.View1Name) {
					Setting = this.View1Options[index2];
					break;
				}
			}
			break;
		case "View2":
			for (var index2 = 0; index2 < this.View2Values.length; index2++) {
				if (this.View2Options[index2] == this.UserData.View2Name) {
					Setting = this.View2Options[index2];
					break;
				}
			}
			break;
		
		case "MusicView":
			for (var index2 = 0; index2 < this.MusicViewValues.length; index2++) {
				if (this.MusicViewValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.MusicViewOptions[index2];
					break;
				}
			}
			break;
		case "SubtitleSize":
			for (var index2 = 0; index2 < this.SubtitleSizeValues.length; index2++) {
				if (this.SubtitleSizeValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.SubtitleSizeOptions[index2];
					break;
				}
			}
			break;	
		case "SubtitleColour":
			for (var index2 = 0; index2 < this.SubtitleColourValues.length; index2++) {
				if (this.SubtitleColourValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.SubtitleColourOptions[index2];
					break;
				}
			}
			break;	
		case "ScreensaverImages":
			for (var index2 = 0; index2 < this.ScreensaverImagesValues.length; index2++) {
				if (this.ScreensaverImagesValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.ScreensaverImagesOptions[index2];
					break;
				}
			}
			break;
		case "ScreensaverTimeout":
			for (var index2 = 0; index2 < this.ScreensaverTimeoutValues.length; index2++) {
				if (this.ScreensaverTimeoutValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.ScreensaverTimeoutOptions[index2];
					break;
				}
			}
			break;	
		case "ScreensaverImageTime":
		case "ImagePlayerImageTime":	
			for (var index2 = 0; index2 < this.ScreensaverImageTimeValues.length; index2++) {
				if (this.ScreensaverImageTimeValues[index2] == this.UserData[this.currentViewSettings[index]]) {
					Setting = this.ScreensaverImageTimeOptions[index2];
					break;
				}
			}
			break;
		case "ClockOffset":
			for (var index2 = 0; index2 < this.ClockOffsetValues.length; index2++) {
				if (this.ClockOffsetValues[index2] == this.AllData.TV[this.currentViewSettings[index]]) {
					Setting = this.ClockOffsetOptions[index2];
					break;
				}
			}
			break;
		case "Dolby":
		case "DTS":	
		case "AACtoDolby":	
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.AllData.TV[this.currentViewSettings[index]]) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;	
		case "ItemPaging":	
			for (var index2 = 0; index2 < this.ItemPagingValues.length; index2++) {
				if (this.ItemPagingValues[index2] == this.AllData.TV[this.currentViewSettings[index]]) {
					Setting = this.ItemPagingOptions[index2];
					break;
				}
			}
			break;		
		case "Bitrate":
			for (var index2 = 0; index2 < this.TvConnectionValues.length; index2++) {
				if (this.TvConnectionValues[index2] == this.AllData.TV[this.currentViewSettings[index]]) {
					Setting = this.TvConnectionOptions[index2];
					break;
				}
			}
			break;	
		case "DefaultAudioLang":
			for (var index2 = 0; index2 < this.LanguageValues.length; index2++) {
				if (this.LanguageValues[index2] == this.ServerUserData.Configuration.AudioLanguagePreference) {
					Setting = this.LanguageOptions[index2];
					break;
				}
			}
			if (Setting == "") {
				Setting = this.ServerUserData.Configuration.AudioLanguagePreference
			}
			break;
		case "PlayDefaultAudioTrack":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.ServerUserData.Configuration.PlayDefaultAudioTrack) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;	
		case "DefaultSubtitleLang":
			for (var index2 = 0; index2 < this.LanguageValues.length; index2++) {
				if (this.LanguageValues[index2] == this.ServerUserData.Configuration.SubtitleLanguagePreference) {
					Setting = this.LanguageOptions[index2];
					break;
				}
			}
			if (Setting == "") {
				Setting = this.ServerUserData.Configuration.SubtitleLanguagePreference
			}
			break;	
		case "SubtitleMode":
			for (var index2 = 0; index2 < this.SubtitleModeValues.length; index2++) {
				if (this.SubtitleModeValues[index2] == this.ServerUserData.Configuration.SubtitleMode) {
					Setting = this.SubtitleModeOptions[index2];
					break;
				}
			}
			break;
		case "DisplayMissingEpisodes":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.ServerUserData.Configuration.DisplayMissingEpisodes) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;
		case "DisplayUnairedEpisodes":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.ServerUserData.Configuration.DisplayUnairedEpisodes) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;	
		case "GroupMovieCollections":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.ServerUserData.Configuration.GroupMoviesIntoBoxSets) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;
		case "HidePlayedInLatest":
			for (var index2 = 0; index2 < this.DefaultValues.length; index2++) {
				if (this.DefaultValues[index2] == this.ServerUserData.Configuration.HidePlayedInLatest) {
					Setting = this.DefaultOptions[index2];
					break;
				}
			}
			break;			
		}
		htmlToAdd += "<tr class=guiSettingsRow><td id="+index+">" + this.currentViewSettingsName[index] + "</td><td id=Value"+index+" class='guiSettingsTD'>"+Setting+"</td></tr>";
	}
	document.getElementById("guiPage_Settings_Settings").innerHTML = htmlToAdd + "</table>";
}

GuiPage_Settings.updateSelectedItems = function() {
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.currentViewSettings.length); index++) {
		if (index == this.selectedItem) {
			document.getElementById(index).className = "guiSettingsTD GuiPage_Setting_Selected";
		} else {
			document.getElementById(index).className = "guiSettingsTD";
		}
	}
	
	if (this.selectedItem == -1) {
		document.getElementById("Counter").innerHTML = (this.selectedBannerItem + 1) + "/" + (this.bannerItems.length);
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + (this.currentViewSettingsName.length);
		this.setOverview();
	}		
}

GuiPage_Settings.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) { //Don't put padding on the last one.
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem green";
			}		
		} else {
			if (index != this.bannerItems.length-1) { //Don't put padding on the last one.
				if (index == this.currentPage) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				}
			} else {
				if (index == this.currentPage) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem";
				}
			}
		}
	}
	//Update the counter in the bottom left.
	if (this.selectedItem == -1) {
		document.getElementById("Counter").innerHTML = (this.selectedBannerItem + 1) + "/" + (this.bannerItems.length);
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + (this.currentViewSettingsName.length);
		this.setOverview();
	}
}

GuiPage_Settings.processSelectedItem = function() {	
	if (this.selectedItem == -1) {
		switch (this.bannerItems[this.selectedBannerItem]) {
		case "User Settings":
			this.currentPage = 0;
			this.currentViewSettings = this.Settings;
			this.currentViewSettingsName = this.SettingsName;
			this.currentViewSettingsDefaults = this.SettingsDefaults;
			document.getElementById("guiTV_Show_Title").innerHTML = "User Settings for "+this.UserData.UserName;
			break;
		case "Server Settings":
			this.currentPage = 1;
			this.currentViewSettings = this.ServerSettings;
			this.currentViewSettingsName = this.ServerSettingsName;
			this.currentViewSettingsDefaults = this.ServerSettingsDefaults;
			document.getElementById("guiTV_Show_Title").innerHTML = "Server Settings for "+this.UserData.UserName;
			break;
		case "TV Settings":
			this.currentPage = 2;
			this.currentViewSettings = this.TVSettings;
			this.currentViewSettingsName = this.TVSettingsName;
			this.currentViewSettingsDefaults = this.TVSettingsDefaults;
			document.getElementById("guiTV_Show_Title").innerHTML = "TV Settings for " + Server.getDevice();
			break;	
		case "Log":
			GuiPage_SettingsLog.start();
			return;
			break;
		case "About":
			Support.updateURLHistory("GuiPage_Settings",null,null,null,null,0,0,null);
			GuiPage_Contributors.start();
			return;
			break;
		}
		//Set Current View - needed to write to file
		this.currentView = this.bannerItems[this.selectedBannerItem];
		
		//Update Displayed & Updates Settings
		this.selectedItem = 0;
		this.selectedBannerItem = -1;
		this.updateDisplayedItems();
		this.updateSelectedItems();
		this.updateSelectedBannerItems();
	} else {
		document.getElementById(this.selectedItem).className = "guiSettingsTD GuiPage_Setting_SubSelected";
		document.getElementById("Value"+this.selectedItem).className = "guiSettingsTD GuiPage_Setting_Changing arrowUpDown";
		
		switch (this.currentViewSettings[this.selectedItem]) {
		case "Default":
		case "ContinueWatching":
		case "AudioTheme":
		case "SkipShow":	
		case "SkipMusicAZ":
		case "SeasonLabel":	
		case "AutoPlay":
		case "Dolby":
		case "DTS":	
		case "DisplayMissingEpisodes":
		case "DisplayUnairedEpisodes":	
		case "GroupMovieCollections":
		case "PlayDefaultAudioTrack":
		case "ShowDisc":	
		case "AACtoDolby":	
		case "LargerView":
		case "ForgetSavedPassword":
		case "HidePlayedInLatest":
		case "EnableCinemaMode":
			this.CurrentSubSettings = this.DefaultOptions;
			break;
		case "View1":
			this.CurrentSubSettings = this.View1Options;
			break;
		case "View2":
			this.CurrentSubSettings = this.View2Options;
			break;
		case "MusicView":
			this.CurrentSubSettings = this.MusicViewOptions;
			break;
		case "SubtitleSize":
			this.CurrentSubSettings = this.SubtitleSizeOptions;
			break;	
		case "SubtitleColour":
			this.CurrentSubSettings = this.SubtitleColourOptions;
			break;	
		case "ScreensaverImages":
			this.CurrentSubSettings = this.ScreensaverImagesOptions;
			break;
		case "ScreensaverTimeout":
			this.CurrentSubSettings = this.ScreensaverTimeoutOptions;
			break;	
		case "ScreensaverImageTime":
		case "ImagePlayerImageTime":		
			this.CurrentSubSettings = this.ScreensaverImageTimeOptions;
			break;	
		case "ClockOffset":
			this.CurrentSubSettings = this.ClockOffsetOptions;
			break;	
		case "ItemPaging":
			this.CurrentSubSettings = this.ItemPagingOptions;
			break;	
		case "Bitrate":
			this.CurrentSubSettings = this.TvConnectionOptions;
			break;
		case "DefaultAudioLang":
		case "DefaultSubtitleLang":	
			this.CurrentSubSettings = this.LanguageOptions;
			break;	
		case "SubtitleMode":
			this.CurrentSubSettings = this.SubtitleModeOptions;
			break;	
		}
		
		//Set the selectedSubItem to the existing setting
		this.selectedSubItem = 0;
		this.CurrentSettingValue = document.getElementById("Value"+this.selectedItem).innerHTML;
		
		for (var index = 0; index < this.CurrentSubSettings.length; index++) {
			if (this.CurrentSubSettings[index] == this.CurrentSettingValue) {
				this.selectedSubItem = index;
				break;
			}
		}		
		document.getElementById("GuiPage_SettingsBottom").focus();
	}
};
 

GuiPage_Settings.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		//Need Logout Key
		case tvKey.KEY_UP:
			alert("UP");	
			this.processUpKey();
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");	
			this.processDownKey();
			break;	
		case tvKey.KEY_LEFT:
			alert("LEFT");	
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");	
			this.processRightKey();
			break;	
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedItem();
			break;
		case tvKey.KEY_YELLOW:	
			//Favourites - Not needed on this page!
			break;	
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiPage_Settings");
			break;		
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.openMenu();
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_Settings.openMenu = function() {
	if (this.selectedItem == -1) {
		if (this.currentPage == 0){
			document.getElementById("bannerItem0").className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
		} else {
			document.getElementById("bannerItem0").className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
		}
		GuiMainMenu.requested("GuiPage_Settings","bannerItem0","guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green");
	} else {
		document.getElementById(this.selectedItem).className = "guiSettingsTD GuiPage_Setting_UnSelected";
		GuiMainMenu.requested("GuiPage_Settings",this.selectedItem,"guiSettingsTD GuiPage_Setting_Selected");
	}
}

GuiPage_Settings.processUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem == -2) {
		this.selectedItem = -1;
	} else if (this.selectedItem == -1) {
		this.selectedBannerItem = 0;
		this.updateSelectedItems();
		this.updateSelectedBannerItems();
	} else {
		if (this.selectedItem < this.topLeftItem) {
			if (this.topLeftItem - this.MAXCOLUMNCOUNT < 0) {
				this.topLeftItem = 0;
			} else {
				this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
			}
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}	
}

GuiPage_Settings.processDownKey = function() {
	if (this.selectedItem == -1) {
		this.selectedItem = 0;
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
	} else {
		this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;
		if (this.selectedItem >= this.currentViewSettings.length) {
			this.selectedItem = (this.currentViewSettings.length-1);
			if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
				this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
				this.updateDisplayedItems();
			}
		} else {
			if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
				this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
				this.updateDisplayedItems();
			}
		}
	}
	this.updateSelectedItems();
}

GuiPage_Settings.processLeftKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem--;
		if (this.selectedBannerItem == -1) {
			this.selectedBannerItem = 0;
			this.openMenu();
		} else {
			this.updateSelectedBannerItems();	
		}	
	} else {
		this.openMenu();
	}
}

GuiPage_Settings.processRightKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem++;
		if (this.selectedBannerItem >= this.bannerItems.length) {
			this.selectedBannerItem--;
		} else {
			this.updateSelectedBannerItems();	
		}
	} else {
		this.processSelectedItem();
	}
}

//------------------------------------------------------------------------------------------------------------------------

GuiPage_Settings.processSelectedSubItem = function() {
	switch (this.currentViewSettings[this.selectedItem]) {
	case "Default":	
		this.UserData.Default = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
		
		//Default User ONLY - Check All Other Users and set to false
		if (this.currentViewSettings[this.selectedItem] == "Default") {
			var fileJson = JSON.parse(File.loadFile());  
			for (var index = 0; index < fileJson.Servers[File.getServerEntry()].Users.length; index++) {
				fileJson.Servers[File.getServerEntry()].Users[index].Default = false;
			}
			File.updateServerSettings(fileJson.Servers[File.getServerEntry()]);
		}
		break;
	case "ContinueWatching":
	case "AudioTheme":
	case "SkipShow":
	case "SkipMusicAZ":
	case "SeasonLabel":	
	case "AutoPlay":
	case "EnableCinemaMode":
	case "ShowDisc":	
	case "LargerView":
	case "ForgetSavedPassword":
		this.UserData[this.currentViewSettings[this.selectedItem]] = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
		break;
	case "View1":
		this.UserData.View1Name = this.View1Options[this.selectedSubItem];
		this.UserData.View1 = this.View1Values[this.selectedSubItem];
		this.CurrentSettingValue = this.View1Options[this.selectedSubItem];
	
		Support.updateHomePageURLs(this.UserData.View1Name ,this.UserData.View1,this.UserData.View2Name,true);
		break;
	case "View2":
		this.UserData.View2Name = this.View2Options[this.selectedSubItem];
		this.UserData.View2 = this.View2Values[this.selectedSubItem];
		this.CurrentSettingValue = this.View2Options[this.selectedSubItem];
	
		Support.updateHomePageURLs(this.UserData.View2Name ,this.UserData.View2,this.UserData.View2Name,false);
		break;
	case "MusicView":
		this.UserData.MusicView = this.MusicViewValues[this.selectedSubItem];
		this.CurrentSettingValue = this.MusicViewOptions[this.selectedSubItem];
		break;
	case "SubtitleSize":
		this.UserData.SubtitleSize = this.SubtitleSizeValues[this.selectedSubItem];
		this.CurrentSettingValue = this.SubtitleSizeOptions[this.selectedSubItem];
		break;
	case "SubtitleColour":
		this.UserData.SubtitleColour = this.SubtitleColourValues[this.selectedSubItem];
		this.CurrentSettingValue = this.SubtitleColourOptions[this.selectedSubItem];
		break;	
	case "ImagePlayerImageTime":	
		this.UserData.ImagePlayerImageTime = this.ScreensaverImageTimeValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ScreensaverImageTimeOptions[this.selectedSubItem];
		break;
	case "ScreensaverImages":
		this.UserData.ScreensaverImages = this.ScreensaverImagesValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ScreensaverImagesOptions[this.selectedSubItem];
		break;	
	case "ScreensaverTimeout":
		this.UserData.ScreensaverTimeout = this.ScreensaverTimeoutValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ScreensaverTimeoutOptions[this.selectedSubItem];
		break;
	case "ScreensaverImageTime":
		this.UserData.ScreensaverImageTime = this.ScreensaverImageTimeValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ScreensaverImageTimeOptions[this.selectedSubItem];
		break;
	case "ClockOffset":
		this.AllData.TV.ClockOffset = this.ClockOffsetValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ClockOffsetOptions[this.selectedSubItem];
		break;
	case "Dolby":
	case "DTS":
	case "AACtoDolby":	
		this.AllData.TV[this.currentViewSettings[this.selectedItem]] = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
		break;
	case "Bitrate":
		this.AllData.TV.Bitrate = this.TvConnectionValues[this.selectedSubItem];
		this.CurrentSettingValue = this.TvConnectionOptions[this.selectedSubItem];
		break;
	case "ItemPaging":
		this.AllData.TV.ItemPaging = this.ItemPagingValues[this.selectedSubItem];
		this.CurrentSettingValue = this.ItemPagingOptions[this.selectedSubItem];
		break;	
	case "DefaultAudioLang":
		this.ServerUserData.Configuration.AudioLanguagePreference = this.LanguageValues[this.selectedSubItem];
		this.CurrentSettingValue = this.LanguageOptions[this.selectedSubItem];
		
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;	
	case "PlayDefaultAudioTrack":
		this.ServerUserData.Configuration.PlayDefaultAudioTrack = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
		
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;	
	case "DefaultSubtitleLang":
		this.ServerUserData.Configuration.SubtitleLanguagePreference = this.LanguageValues[this.selectedSubItem];
		this.CurrentSettingValue = this.LanguageOptions[this.selectedSubItem];
		
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;		
	case "SubtitleMode":
		this.ServerUserData.Configuration.SubtitleMode = this.SubtitleModeValues[this.selectedSubItem];
		this.CurrentSettingValue = this.SubtitleModeOptions[this.selectedSubItem];
		
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;	
	case "DisplayMissingEpisodes":
		this.ServerUserData.Configuration.DisplayMissingEpisodes = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
			
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;	
	case "DisplayUnairedEpisodes":
		this.ServerUserData.Configuration.DisplayUnairedEpisodes = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
				
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;
	case "GroupMovieCollections":
		this.ServerUserData.Configuration.GroupMoviesIntoBoxSets = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
				
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;	
	case "HidePlayedInLatest":
		this.ServerUserData.Configuration.HidePlayedInLatest = this.DefaultValues[this.selectedSubItem];
		this.CurrentSettingValue = this.DefaultOptions[this.selectedSubItem];
				
		//Update Server	
		Server.updateUserConfiguration(JSON.stringify(this.ServerUserData.Configuration));
		break;
	}
		
	switch (this.currentView) {
		case "User Settings":
			File.updateUserSettings(this.UserData);
		break;
		case "TV Settings":
			File.writeAll(this.AllData);
		break;
	}
		
	document.getElementById("Value"+this.selectedItem).innerHTML = this.CurrentSettingValue;
	document.getElementById("Value"+this.selectedItem).className = "guiSettingsTD GuiPage_Setting_UnSelected";
	document.getElementById(this.selectedItem).className = "guiSettingsTD GuiPage_Setting_Selected";
	document.getElementById("GuiPage_Settings").focus();
}


GuiPage_Settings.bottomKeyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		case tvKey.KEY_UP:
			alert("UP");	
			this.selectedSubItem--;
			if (this.selectedSubItem < 0) {
				this.selectedSubItem = this.CurrentSubSettings.length-1;
			} 
			document.getElementById("Value"+this.selectedItem).innerHTML = this.CurrentSubSettings[this.selectedSubItem];
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");	
			this.selectedSubItem++;
			if (this.selectedSubItem > this.CurrentSubSettings.length-1) {
				this.selectedSubItem = 0;;
			}
			document.getElementById("Value"+this.selectedItem).innerHTML = this.CurrentSubSettings[this.selectedSubItem];
			break;
		case tvKey.KEY_LEFT:	
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			document.getElementById("Value"+this.selectedItem).innerHTML = this.CurrentSettingValue;		
			document.getElementById("Value"+this.selectedItem).className = "guiSettingsTD GuiPage_Setting_UnSelected";
			document.getElementById(this.selectedItem).className = "guiSettingsTD GuiPage_Setting_Selected";

			document.getElementById("GuiPage_Settings").focus();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedSubItem();
			break;
		case tvKey.KEY_BLUE:	
			Support.logout();
			break;		
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			document.getElementById("Value"+this.selectedItem).className = "guiSettingsTD GuiPage_Setting_UnSelected";
			document.getElementById(this.selectedItem).className = "guiSettingsTD GuiPage_Setting_UnSelected";
			document.getElementById("GuiPage_Settings").focus();
			GuiMainMenu.requested("GuiPage_Settings",this.selectedItem,"guiSettingsTD GuiPage_Setting_Selected");
			break;	
		case tvKey.KEY_INFO:
			alert ("INFO KEY");
			GuiHelper.toggleHelp("GuiPage_Settings");
			break;
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_Settings.setOverview = function() {
	switch (this.currentViewSettings[this.selectedItem]) {
		case "Default":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Default User";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Setting the default user to True allows for the app to sign in the user automatically." +
					"<br><br>Changing this setting to True will change all other users to False.";
			break;
		case "ContinueWatching":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Continue Watching";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Show partially watched items on the home page." +
					"<br><br>If you have any partially watched programs they will be shown on the home page along with Home View 1.";
			break;
		case "View1":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Home View 1";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Sets the content of the first view on the Home page." +
					"<br><br>Available Choices:<br>&nbsp;<ul style='padding-left:22px'><li>Next Up</li><li>All Favourites</li><li>Favourite Movies</li><li>Favourite Series</li><li>Favourite Episodes</li><li>Suggested For You</li><li>Media Folders</li><li>Latest TV</li><li>Latest Movies</li></ul>" +
					"<br><br>Setting Home View 2 to None will show more content in this view.";
			break; 
		case "View2":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Home View 2";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Sets the content of the second view on the Home page." +
					"<br><br>Available Choices:<br>&nbsp;<ul style='padding-left:22px'><li>None</li><li>Next Up</li><li>All Favourites</li><li>Favourite Movies</li><li>Favourite Series</li><li>Favourite Episodes</li><li>Suggested For You</li><li>Media Folders</li><li>Latest TV</li><li>Latest Movies</li></ul>" +
					"<br><br>Setting this to None will show more content from Home View 1.";
			break;	
		case "MusicView":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Default Music view";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Sets the default view the Music page will open up on." +
					"<br><br>Available Choices:<br>&nbsp;<ul style='padding-left:22px'><li>Recent</li><li>Frequent</li><li>Album</li><li>Album Artist</li><li>Artist</li></ul>";
			break;	
		case "SkipMusicAZ":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Skip A-Z Page When Entering Music";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Go directly to your entire music collection instead of to the A-Z page." +
					"<br><br>Only set this True if you have a workable combination of the following:<br>&nbsp;<ul style='padding-left:22px'><li>A modest size music collection.</li><li>A reasonably powerful Emby server.</li><li>A little patience.</li></ul>";
			break;
		case "LargerView":	
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Display Larger View";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Enabling this changes the TV & Movies view from 9 items across to 7 items across, allowing for larger images for each item.";
			break;
		case "AudioTheme":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Play Audio Theme";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "This option allows for audio themes to be played when viewing the details of an item." +
					"<br><br>Default behaviour is to play the theme 3 times then stop.";
			break;
		case "SkipShow":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Skip TV Show Page";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "This option allows for the TV Show page to be skipped if there is only one season, taking you directly to the episodes page.";
			break;
		case "SeasonLabel":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Use Alternate Season Label";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Use an alternative format for the season and episode label formats.";
			break;
		case "AutoPlay":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Auto Play Next Episode";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "If enabled, when a playing episode has finished, the next episode will automatically load.";
			break;
		case "ShowDisc":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Show Disc Art";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Enable or disable the disc art on episode & film pages.";
			break;
		case "SubtitleSize":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Subtitle Text Size";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The font size for displayed subtitles.<br><br>Image player and screensaver overlays also use this setting.";
			break;
		case "SubtitleColour":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Subtitle Text Colour";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The font colour for displayed subtitles.<br><br>Image player and screensaver overlays also use this setting.";
			break;	
		case "ImagePlayerImageTime":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Image Player Rotate Speed";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The amount of time an image is shown during image playback until the next one is displayed.";
			break;	
		case "ScreensaverImages":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Screensaver Image Source";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The screensaver can use images either from photos you have added to your library or tv & movie images.";
			break;
		case "ScreensaverTimeout":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Screensaver Timeout";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The amount of inactivity before the screensaver starts.";
			break;	
		case "ScreensaverImageTime":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Screensaver Rotate Speed";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "The amount of time an image is shown during screensaver playback until the next one is displayed.";
			break;
		case "ForgetSavedPassword":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Forget Saved Password at Next Log Out";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "To remove your saved password, select this option and log out.";
			break;
		case "ClockOffset":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Clock Offset";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Some devices report their system time incorrectly. Use this option to apply a correction.";
			break;	
		case "Bitrate":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Max Bitrate";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Use this setting to select the maximum video bitrate your network can handle. If a video bitrate is higher than this, the video will be transcoded to use the max bitrate setting here.";
			break;
		case "Dolby":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Enable Dolby Digital Playback";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Select this option if your receiver is capable of decoding AC3 streams";
			break;
		case "DTS":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Enable DTS Playback";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Select this option if your receiver is capable of decoding DTS streams";
			break;
		case "AACtoDolby":	
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Enable AAC Transcoding to Dolby";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Set this option only if you have an external receiver capable of receiving Dolby but not AAC<br><br>Will be ignored if Enable Dolby Digital Playback is false";
			break;
		case "ItemPaging":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Item Paging";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "As nobody likes waiting, items on screen are loaded in batches, with each new batch called when needed, as opposed to loading everything and making you wait until its all ready.<br><br>Change the number of items loaded in a batch dependant on how fast your server is.";
			break;	
		case "DefaultAudioLang":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Audio Language Preference";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Select the preferred audio language.<br><br>If your language is not listed, you will need to change the setting via the web app which has a full list of languages.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;	
		case "PlayDefaultAudioTrack":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Play default audio track regardless of language";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Will play the default audio track even if it doesn't match your language setting.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;	
		case "DefaultSubtitleLang":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Subtitle Language Preference";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Select the preferred subtitle language.<br><br>If your language is not listed, you will need to change the setting via the web app which has a full list of languages.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;		
		case "SubtitleMode":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Subtitle Mode";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Select the default behaviour of when subtitles are loaded<br><br>Default: Subtitles matching the language preference will be loaded when the audio is in a foreign language.<br><br>Only Forced Subtitles: Only subtitles marked as forced will be loaded.<br><br>Always Play Subtitles: Subtitles matching the language preference will be loaded regardless of the audio language.<br><br>None: Subtitles will not be loaded by default.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;	
		case "HidePlayedInLatest":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Hide watched content from latest media";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Watched items will not appear in the Latest TV or Latest Movies home views or pages.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;
		case "EnableCinemaMode":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Enable cinema mode";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Cinema mode brings the theater experience straight to your living room with the ability to play trailers and custom intros before the main feature.<br><br>This is a server option and will affect your Emby experience on all clients";
			break;
		case "DisplayMissingEpisodes":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Display Missing Episodes within Seasons";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Display missing episodes within TV seasons<br><br>This is a server option and will affect your Emby experience on all clients";
			break;	
		case "DisplayUnairedEpisodes":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Display Unaired Episodes within Seasons";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Display unaired episodes within TV seasons<br><br>This is a server option and will affect your Emby experience on all clients";
			break;	
		case "GroupMovieCollections":
			document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Group Movies into Collections";
			document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "When displaying movie lists, movies belonging to a collection will be displayed as one grouped item<br><br>This is a server option and will affect your Emby experience on all clients";
			break;		
	}
}

GuiPage_Settings.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}