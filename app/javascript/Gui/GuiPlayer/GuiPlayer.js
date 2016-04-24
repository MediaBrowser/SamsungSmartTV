//NOTE
//
//Samsung Player accepts seconds
//Samsung Current time works in seconds * 1000
//Emby works in seconds * 10000000

var GuiPlayer = {	
		plugin : null,
		pluginAudio : null,
		pluginScreen : null,
		
		Status : "STOPPED",
		currentTime : 0,
		updateTimeCount : 0,
		setThreeD : false,
		PlayMethod : "",
		videoStartTime : null,
		offsetSeconds : 0, //For transcode, this holds the position the transcode started in the file
		
		playingMediaSource : null,
		playingMediaSourceIndex : null,
		playingURL : null,
		playingTranscodeStatus : null,
		playingVideoIndex : null,
		playingAudioIndex : null,
		playingSubtitleIndex : null,
			
		VideoData : null,
		PlayerData : null,
		PlayerDataSubtitle : null,
		PlayerIndex : null,
		
		subtitleInterval : null,
		subtitleShowingIndex : 0,
		subtitleSeeking : false,
		startParams : [],
		infoTimer : null
};


GuiPlayer.init = function() {
	GuiMusicPlayer.stopOnAppExit();
	
	this.plugin = document.getElementById("pluginPlayer");
	this.pluginAudio = document.getElementById("pluginObjectAudio");
	this.pluginScreen = document.getElementById("pluginScreen");
	
	//Set up Player
	this.plugin.OnConnectionFailed = 'GuiPlayer.handleConnectionFailed';
	this.plugin.OnAuthenticationFailed = 'GuiPlayer.handleAuthenticationFailed';
	this.plugin.OnNetworkDisconnected = 'GuiPlayer.handleOnNetworkDisconnected';
	this.plugin.OnRenderError = 'GuiPlayer.handleRenderError';
	this.plugin.OnStreamNotFound = 'GuiPlayer.handleStreamNotFound';
	this.plugin.OnRenderingComplete = 'GuiPlayer.handleOnRenderingComplete';
	this.plugin.OnCurrentPlayTime = 'GuiPlayer.setCurrentTime';
    this.plugin.OnBufferingStart = 'GuiPlayer.onBufferingStart';
    this.plugin.OnBufferingProgress = 'GuiPlayer.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'GuiPlayer.onBufferingComplete';  
    this.plugin.OnStreamInfoReady = 'GuiPlayer.OnStreamInfoReady'; 
    this.plugin.SetTotalBufferSize(40*1024*1024);
};

GuiPlayer.start = function(title,url,startingPlaybackTick,playedFromPage,isCinemaMode,featureUrl) { 
	if (GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED") {
		GuiMusicPlayer.stopPlayback();
	}
	
	//Run only once in loading initial request - subsequent vids should go thru the startPlayback
	this.startParams = [title,url,startingPlaybackTick,playedFromPage,isCinemaMode,featureUrl];
	
	//Display Loading 
	document.getElementById("guiPlayer_Loading").style.visibility = "";

    //Get Item Data (Media Streams)
    this.VideoData = Server.getContent(url);
    if (this.VideoData == null) { return; }
    
    this.PlayerIndex = 0; // Play All  - Default
    if (title == "PlayAll") {
    	if (this.VideoData.TotalRecordCount == 0) {
    		return;
    	}
    	if (this.startParams[4] === true && this.startParams[5] != null) {
    		//We are in Cinema Mode. Add the main feature to the end of the intros playlist.
    		this.featureData = Server.getContent(this.startParams[5]);
    		this.VideoData.Items.push(this.featureData);
    	}
    	this.PlayerData = this.VideoData.Items[this.PlayerIndex];
    } else {
    	if (this.VideoData.LocationType == "Virtual") {
    		return
    	}
    	//Enter Cinema Mode?
    	var introsUrl = Server.getItemIntrosUrl(this.VideoData.Id);
    	var intros = Server.getContent(introsUrl);
    	if (File.getUserProperty("EnableCinemaMode") && intros.TotalRecordCount > 0 && startingPlaybackTick == 0) {
    		FileLog.write("Playback: Switching to Cinema Mode.");
    		//Start again in Cinema Mode.
    		GuiPlayer.start("PlayAll",introsUrl,0,"GuiPage_ItemDetails",true,this.startParams[1]);
    		return;
    	} else {
    		this.PlayerData = this.VideoData;
    	}
    }

    //Take focus to no input
	document.getElementById("NoKeyInput").focus();
    
	//Load Versions
    GuiPlayer_Versions.start(this.PlayerData,startingPlaybackTick,playedFromPage);
};

GuiPlayer.startPlayback = function(TranscodeAlg, resumeTicksSamsung) {
	//Initiate Player for Video
	this.init();
	FileLog.write("Playback : Player Initialised");
	
	//Turn off Screensaver
    Support.screensaverOff();
	pluginAPI.setOffScreenSaver();  

	//Reset Vars
	this.Status = "STOPPED";
	this.currentTime = 0;
    this.updateTimeCount = 0;
    this.setThreeD = false;
	this.offsetSeconds = 0;
	this.PlayerDataSubtitle = null;
	this.subtitleShowingIndex = 0;
	this.subtitleSeeking = false;
	this.videoStartTime = resumeTicksSamsung;
	
	//Expand TranscodeAlg to useful variables!!!
	this.playingMediaSourceIndex = TranscodeAlg[0];
	this.playingMediaSource = this.PlayerData.MediaSources[TranscodeAlg[0]];
	this.playingURL = TranscodeAlg[1];
	this.playingTranscodeStatus = TranscodeAlg[2];
	this.playingVideoIndex = TranscodeAlg[3];
	this.playingAudioIndex = TranscodeAlg[4];
	this.playingSubtitleIndex = TranscodeAlg[5];
	
	//Set PlayMethod
	if (this.playingTranscodeStatus == "Direct Play"){
		this.PlayMethod = "DirectPlay";
	} else if (this.playingTranscodeStatus == "Transcoding Audio & Video"){
		this.PlayMethod = "Transcode";
	}

    //Set offsetSeconds time
    if (this.PlayMethod == "Transcode") {
    	this.offsetSeconds = resumeTicksSamsung;
    } else {
    	this.offsetSeconds = 0;
    }

    //Set up GuiPlayer_Display
    GuiPlayer_Display.setDisplay(this.PlayerData,this.playingMediaSource,this.playingTranscodeStatus,this.offsetSeconds,this.playingVideoIndex,this.playingAudioIndex,this.playingSubtitleIndex,this.playingMediaSourceIndex);
    
	//Set Resolution Display
	this.setDisplaySize();
	
	//Subtitles - If resuming find the correct index to start from!
    FileLog.write("Playback : Start Subtitle Processing");
	this.setSubtitles(this.playingSubtitleIndex);
	this.updateSubtitleTime(resumeTicksSamsung,"NewSubs");
	FileLog.write("Playback : End Subtitle Processing");

	//Create Tools Menu
	GuiPlayer_Display.createToolsMenu();
	
	//Update Server content is playing * update time
	Server.videoStarted(this.PlayerData.Id,this.playingMediaSource.Id,this.PlayMethod);
    
	//Update URL with resumeticks
	FileLog.write("Playback : E+ Series Playback - Load URL");
	var url = this.playingURL + '&StartTimeTicks=' + (resumeTicksSamsung*10000);
	var position = 0;
	if (this.PlayMethod == "DirectPlay") {
		position = Math.round(resumeTicksSamsung / 1000);
	}
    this.plugin.ResumePlay(url,position); 
};

GuiPlayer.stopPlayback = function() {
	FileLog.write("Playback : Stopping");
	this.clearGuiItems();
	this.plugin.Stop();
	this.Status = "STOPPED";
	Server.videoStopped(this.PlayerData.Id,this.playingMediaSource.Id,this.currentTime,this.PlayMethod);
	
	//If D series need to stop HLS Encoding
	if (Main.getModelYear() == "D") {
		Server.stopHLSTranscode();
	}	
};

GuiPlayer.setDisplaySize = function() {
	var aspectRatio = (this.playingMediaSource.MediaStreams[this.playingVideoIndex] === undefined) ? "16:9" : this.playingMediaSource.MediaStreams[this.playingVideoIndex].AspectRatio;
	if (aspectRatio == "16:9") {
		this.plugin.SetDisplayArea(0, 0, 960, 540);
	} else {
		//Scale Video	
		var ratioToShrinkX = 960 / this.playingMediaSource.MediaStreams[this.playingVideoIndex].Width;
		var ratioToShrinkY = 540 / this.playingMediaSource.MediaStreams[this.playingVideoIndex].Height;
			
		if (ratioToShrinkX < ratioToShrinkY) {
			var newResolutionX = 960;
			var newResolutionY = Math.round(this.playingMediaSource.MediaStreams[this.playingVideoIndex].Height * ratioToShrinkX);
			var centering = Math.round((540-newResolutionY)/2);
				
			this.plugin.SetDisplayArea(parseInt(0), parseInt(centering), parseInt(newResolutionX), parseInt(newResolutionY));
		} else {
			var newResolutionX = Math.round(this.playingMediaSource.MediaStreams[this.playingVideoIndex].Width * ratioToShrinkY);
			var newResolutionY = 540;
			var centering = Math.round((960-newResolutionX)/2);
				
			this.plugin.SetDisplayArea(parseInt(centering), parseInt(0), parseInt(newResolutionX), parseInt(newResolutionY));
		}			
	}	
};

GuiPlayer.setSubtitles = function(selectedSubtitleIndex) {
	if (selectedSubtitleIndex > -1) {
		var Stream = this.playingMediaSource.MediaStreams[selectedSubtitleIndex];
		if (Stream.IsTextSubtitleStream) {
			//Set Colour & Size from User Settings
			Support.styleSubtitles("guiPlayer_Subtitles");
			
		    var url = Server.getCustomURL("/Videos/"+ this.PlayerData.Id+"/"+this.playingMediaSource.Id+"/Subtitles/"+selectedSubtitleIndex+"/Stream.srt?api_key=" + Server.getAuthToken());
		    this.PlayerDataSubtitle = Server.getSubtitles(url);
			FileLog.write("Subtitles : loaded "+url);
			
		    if (this.PlayerDataSubtitle == null) { 
		    	this.playingSubtitleIndex = -1; 
		    	return; 
		    } else {
		    	this.playingSubtitleIndex = selectedSubtitleIndex;
		    }
		    try{
		    	 this.PlayerDataSubtitle = parser.fromSrt(this.PlayerDataSubtitle,true);
		    }catch(e){
		        alert(e); //error in the above string(in this case,yes)!
		    }

			// subtitles may not be sorted ascending by startTime, but we require it
			this.PlayerDataSubtitle.sort(function(a, b) {
				return a.startTime - b.startTime;
			});
		}
	}
};

GuiPlayer.updateSubtitleTime = function(newTime,direction) {
	if (this.playingSubtitleIndex != -1) {
		//Clear Down Subtitles
		this.subtitleSeeking = true;
		document.getElementById("guiPlayer_Subtitles").innerHTML = "";
		document.getElementById("guiPlayer_Subtitles").style.visibility = "hidden";
		
		if (direction == "FF") {
			if (newTime > this.PlayerDataSubtitle[this.PlayerDataSubtitle.length -1].startTime) {
				this.subtitleShowingIndex = this.PlayerDataSubtitle.length -1;
			} else {
				for (var index = this.subtitleShowingIndex; index < this.PlayerDataSubtitle.length; index++) {
					if (newTime <= this.PlayerDataSubtitle[index].startTime) {
						this.subtitleShowingIndex = index;
						break;
					}
				}
			}
		} else if (direction == "RW") {
			if (newTime < this.PlayerDataSubtitle[1].startTime) {
				this.subtitleShowingIndex = 1;
			} else {
				for (var index = 1; index <= this.subtitleShowingIndex; index++) {
					if (newTime <= this.PlayerDataSubtitle[index].startTime) {
						this.subtitleShowingIndex = index;
						break;
					}
				}
			}	
		} else {
			this.subtitleShowingIndex = 0;
			for (var index = 0; index < this.PlayerDataSubtitle.length; index++) {				
				if (newTime <= this.PlayerDataSubtitle[index].startTime) {
					this.subtitleShowingIndex = index;
					break;
				}
			}	
		}
		FileLog.write("Subtitle : new subtitleShowingIndex:  "+this.subtitleShowingIndex +" @ "+newTime);
		this.subtitleSeeking = false;
	}
};


//--------------------------------------------------------------------------------------------------

GuiPlayer.handleOnRenderingComplete = function() {
	GuiPlayer.stopPlayback();
	FileLog.write("Playback : Rendering Complete");
	
	if (this.startParams[0] == "PlayAll") {
	////Call Resume Option - Check playlist first, then AutoPlay property, then return
		this.PlayerIndex++;
		if (this.VideoData.Items.length > this.PlayerIndex) {	
			//Take focus to no input
			document.getElementById("NoKeyInput").focus();
			
			this.PlayerData = this.VideoData.Items[this.PlayerIndex];
			GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3]);
		} else {
			this.PlayerIndex = 0;
			GuiPlayer_Display.restorePreviousMenu();
		}
	} else if (File.getUserProperty("AutoPlay")){
		if (this.PlayerData.Type == "Episode") {
			this.AdjacentData = Server.getContent(Server.getAdjacentEpisodesURL(this.PlayerData.SeriesId,this.PlayerData.SeasonId,this.PlayerData.Id));
			if (this.AdjacentData == null) { return; }
			
			if (this.AdjacentData.Items.length == 2 && (this.AdjacentData.Items[1].IndexNumber > this.ItemData.IndexNumber)) {
				var url = Server.getItemInfoURL(this.AdjacentData.Items[1].Id);
				//Take focus to no input
				document.getElementById("NoKeyInput").focus();
				this.PlayerData = Server.getContent(url);
				if (this.PlayerData == null) { return; }
				GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3]);
			} else if (this.AdjacentData.Items.length > 2) {
				//Take focus to no input
				document.getElementById("NoKeyInput").focus();
				var url = Server.getItemInfoURL(this.AdjacentData.Items[2].Id);
				this.PlayerData = Server.getContent(url);
				if (this.PlayerData == null) { return; }
				GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3]);
			} else {
				GuiPlayer_Display.restorePreviousMenu();
			}
		} else {
			GuiPlayer_Display.restorePreviousMenu();
		}
	} else {
		GuiPlayer_Display.restorePreviousMenu();
	}
};

GuiPlayer.handleOnNetworkDisconnected = function() {
	//Transcoded files throw this error at end of playback?
	FileLog.write("Playback : Network Disconnected");
	GuiNotifications.setNotification(this.playingURL,"NETWORK DISCONNECTED");
	GuiPlayer.stopPlayback();
	GuiPlayer_Display.restorePreviousMenu();
};

GuiPlayer.handleConnectionFailed = function() {
	FileLog.write("Playback : Network Disconnected");
	GuiNotifications.setNotification(this.playingURL,"CONNECTION ERROR");
	GuiPlayer.stopPlayback();
	GuiPlayer_Display.restorePreviousMenu();
};

GuiPlayer.handleAuthenticationFailed = function() {
	FileLog.write("Playback : Authentication Error");
	GuiNotifications.setNotification("AUTHENTICATION ERROR");
	GuiPlayer.stopPlayback();
	GuiPlayer_Display.restorePreviousMenu();
};

GuiPlayer.handleRenderError = function(RenderErrorType) {
	if (RenderErrorType == 7 && this.PlayMethod == "DirectPlay") {
	    FileLog.write("Playback : Render Error (7) while trying to DirectPlay.  Attempting playback with Transcoding...");
	    GuiNotifications.setNotification("Render Error (7) while trying to DirectPlay.<br>Attempting playback with Transcoding...");
	    GuiPlayer.stopPlayback();
	    GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3],true);
	} else {
	    FileLog.write("Playback : Render Error " + RenderErrorType);
	    GuiNotifications.setNotification("Render Error Type : " + RenderErrorType);
	    GuiPlayer.stopPlayback();
	    GuiPlayer_Display.restorePreviousMenu();
	}
};

GuiPlayer.handleStreamNotFound = function() {
	FileLog.write("Playback : Stream Not Found");
	GuiNotifications.setNotification("STREAM NOT FOUND");
	GuiPlayer.stopPlayback();
	GuiPlayer_Display.restorePreviousMenu();
};

GuiPlayer.setCurrentTime = function(time) {
	if (this.Status == "PLAYING") {
		if (this.PlayMethod == "Transcode") {
			this.currentTime = parseInt(time) + this.offsetSeconds;
		} else {
			this.currentTime = parseInt(time);
		}
		//Subtitle Update
		if (this.playingSubtitleIndex != null && this.PlayerDataSubtitle != null && this.subtitleSeeking == false) {
			if (this.currentTime >= this.PlayerDataSubtitle[this.subtitleShowingIndex].endTime) {
				document.getElementById("guiPlayer_Subtitles").innerHTML = "";
				document.getElementById("guiPlayer_Subtitles").style.visibility = "hidden";
				if (this.PlayerDataSubtitle.length -1 > this.subtitleShowingIndex){
					this.subtitleShowingIndex++;
				}
			}
			if (this.currentTime >= this.PlayerDataSubtitle[this.subtitleShowingIndex].startTime && this.currentTime < this.PlayerDataSubtitle[this.subtitleShowingIndex].endTime && document.getElementById("guiPlayer_Subtitles").innerHTML != this.PlayerDataSubtitle.text) {
				var subtitleText = this.PlayerDataSubtitle[this.subtitleShowingIndex].text;
				subtitleText = subtitleText.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2'); //support two-line subtitles

				// remove redundant breaks
				subtitleText = subtitleText.replace(/^<br \/>/, '');
				subtitleText = subtitleText.replace(/<br \/>$/, '');

				document.getElementById("guiPlayer_Subtitles").innerHTML = subtitleText; 
				document.getElementById("guiPlayer_Subtitles").style.visibility = "";
			}
		}
		
		//Update GUIs
		if (this.PlayerData.Type == "ChannelVideoItem") {
			document.getElementById("guiPlayer_Info_ProgressBar_Current").style.width = "0%";
			document.getElementById("guiPlayer_Info_Time").innerHTML = Support.convertTicksToTimeSingle(this.currentTime);
		} else {
			if (time > 0 && this.setThreeD == false) {
				//Check 3D & Audio
			    //Set Samsung Audio Output between DTS or PCM
			    this.setupAudioConfiguration();
			    this.setupThreeDConfiguration();			
			    this.setThreeD = true;
			}
			percentage = (100 * this.currentTime / (this.PlayerData.RunTimeTicks / 10000));	
			document.getElementById("guiPlayer_Info_ProgressBar_Current").style.width = percentage + "%";
			document.getElementById("guiPlayer_Info_Time").innerHTML = Support.convertTicksToTime(this.currentTime, (this.PlayerData.RunTimeTicks / 10000));
			this.updateTimeCount++;
			if (this.updateTimeCount == 8) {
				this.updateTimeCount = 0;
				Server.videoTime(this.PlayerData.Id,this.playingMediaSource.Id,this.currentTime,this.PlayMethod);
			}
		}
	}
};

GuiPlayer.onBufferingStart = function() {
	if (GuiMusicPlayer.Status == "PLAYING"){
		return;
	}
	this.Status = "PLAYING";
	FileLog.write("Playback : Buffering...");
	
	//Show Loading Screen
    document.getElementById("guiPlayer_Loading").style.visibility = "";
	
	//Stop Subtitle Display - Mainly for Transcode pauses
	if (this.playingSubtitleIndex != null) {
		this.subtitleSeeking = true;
	}
};

GuiPlayer.onBufferingProgress = function(percent) {
	if (document.getElementById("guiPlayer_Loading").style.visibility == "" && percent > 5){
		document.getElementById("guiPlayer_Loading").innerHTML = "Buffering " + percent + "%";
	}
	FileLog.write("Playback : Buffering " + percent + "%");
};

GuiPlayer.onBufferingComplete = function() {
	if (GuiMusicPlayer.Status == "PLAYING"){
		return;
	}
	FileLog.write("Playback : Buffering Complete");
    
  //Start Subtitle Display - Mainly for Transcode pauses
	if (this.playingSubtitleIndex != null) {
		this.subtitleSeeking = false;
	}
    
    //Hide Loading Screen
	document.getElementById("guiPlayer_Loading").innerHTML = "Loading";
    document.getElementById("guiPlayer_Loading").style.visibility = "hidden";
    
	//Setup Volume & Mute Keys
	//Volume & Mute Control - Works!
	NNaviPlugin = document.getElementById("pluginObjectNNavi");
    NNaviPlugin.SetBannerState(PL_NNAVI_STATE_BANNER_VOL);
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
       
	//Set Focus for Key Events - Must be done on successful load of video
	document.getElementById("GuiPlayer").focus();
};

GuiPlayer.OnStreamInfoReady = function() {
	FileLog.write("Playback : Stream Info Ready");
	document.getElementById("guiPlayer_Info_Time").innerHTML = Support.convertTicksToTime(this.currentTime, (this.PlayerData.RunTimeTicks / 10000));
};

GuiPlayer.clearGuiItems = function() {
	if (this.infoTimer != null){
		clearTimeout(this.infoTimer);
	}
	document.getElementById("guiPlayer_Osd").style.opacity = 0;
	document.getElementById("guiPlayer_Tools").style.opacity = 0;
	document.getElementById("guiPlayer_Subtitles").innerHTML = "";
	document.getElementById("guiPlayer_Subtitles").style.visibility = "hidden";
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//       GUIPLAYER PLAYBACK KEY HANDLERS
//-----------------------------------------------------------------------------------------------------------------------------------------

GuiPlayer.keyDown = function() {
	var keyCode = event.keyCode;

	switch(keyCode) {
		case tvKey.KEY_RETURN:
			FileLog.write("Playback : Return By User");
			widgetAPI.blockNavigation(event);
			this.stopPlayback();
            GuiPlayer_Display.restorePreviousMenu();
			break;	
		case tvKey.KEY_RIGHT:
			this.handleRightKey();
			break;
		case tvKey.KEY_LEFT:
			this.handleLeftKey();
			break;		
		case tvKey.KEY_PLAY:
		case tvKey.KEY_UP:
			this.handlePlayKey();
			break;
		case tvKey.KEY_STOP:
			this.handleStopKey();
            break;
		case tvKey.KEY_PAUSE:
			this.handlePauseKey();
            break;   
        case tvKey.KEY_FF:
            this.handleFFKey();      
            break;       
        case tvKey.KEY_RW:
            this.handleRWKey();
            break;
        case tvKey.KEY_INFO:	
			GuiPlayer.handleInfoKey();
			break;
        case tvKey.KEY_3D:	
        	GuiPlayer.setupThreeDConfiguration();
			break;
        case tvKey.KEY_TOOLS:
        case tvKey.KEY_DOWN:
        	widgetAPI.blockNavigation(event);
    		if (this.infoTimer != null){
    			clearTimeout(this.infoTimer);
    		}
    		if (document.getElementById("guiPlayer_Osd").style.opacity != 0) {
    			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
    		}
    		document.getElementById("guiPlayer_Subtitles").style.top="auto";
    		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
    		GuiPlayer_Display.updateSelectedItems();
    		if (document.getElementById("guiPlayer_Tools").style.opacity != 1) {
    			$('#guiPlayer_Tools').css('opacity',0).animate({opacity:1}, 500);
    		}
    		document.getElementById("GuiPlayer_Tools").focus();
        	break;
        case tvKey.KEY_EXIT:
        	FileLog.write("EXIT KEY");
            widgetAPI.blockNavigation(event);
            this.stopPlayback();
            GuiPlayer_Display.restorePreviousMenu();
            break;	
	}
};

GuiPlayer.handleRightKey = function() {
	if (this.startParams[0] == "PlayAll") {
		this.PlayerIndex++;
		if (this.VideoData.Items.length > this.PlayerIndex) {	
			this.stopPlayback();
			this.PlayerData = this.VideoData.Items[this.PlayerIndex];
			GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3]);
		} else {
			//Reset PlayerData to correct index!!
			this.PlayerIndex--;
			this.PlayerData = this.VideoData.Items[this.PlayerIndex];
		}
	} else {
		GuiPlayer.handleFFKey();
	}
};

GuiPlayer.handleLeftKey = function() {
	if (this.startParams[0] == "PlayAll") {
		this.PlayerIndex--;
		if (this.PlayerIndex >= 0) {	
			this.stopPlayback();
			this.PlayerData = this.VideoData.Items[this.PlayerIndex];
			GuiPlayer_Versions.start(this.PlayerData,0,this.startParams[3]);
		} else {
			//Reset PlayerData to correct index!!
			this.PlayerIndex++;
			this.PlayerData = this.VideoData.Items[this.PlayerIndex];
		}
	} else {
		GuiPlayer.handleRWKey();
	}
};

GuiPlayer.handlePlayKey = function() {
	if (this.Status == "PAUSED") {
		FileLog.write("Playback : Play by User");
		this.Status = "PLAYING";
		this.plugin.Resume();
		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		}
		Support.clock();
		if (this.infoTimer != null){
			document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
			document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
			clearTimeout(this.infoTimer);
		}
		this.infoTimer = setTimeout(function(){
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
		}, 3000);
	}
	else
	{
		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		}
		if (this.infoTimer != null){
			document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
			document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
			clearTimeout(this.infoTimer);
		}
		this.infoTimer = setTimeout(function(){
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
		}, 3000);
	}
};

GuiPlayer.handleStopKey = function() {
    FileLog.write("Playback : Stopped by User");
    this.stopPlayback();
    setTimeout(function(){
	    document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
		document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
	    GuiPlayer_Display.restorePreviousMenu();
    }, 250);
};

GuiPlayer.handlePauseKey = function() {
	if(this.Status == "PLAYING") {
		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		}
		FileLog.write("Playback : Paused by User");
		this.plugin.Pause();
		this.Status = "PAUSED";
		Server.videoPaused(this.PlayerData.Id,this.playingMediaSource.Id,this.currentTime,this.PlayMethod);           	
		if (this.infoTimer != null){
			clearTimeout(this.infoTimer);
		}
		this.infoTimer = setTimeout(function(){
			setTimeout(function(){
				document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
				document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
			}, 500);
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
		}, 10000);
	} 
};

GuiPlayer.handleFFKey = function() {
	FileLog.write("Playback : Fast Forward");
    if(this.Status == "PLAYING") {
    	if (this.PlayMethod == "DirectPlay") {
    		FileLog.write("Playback : Fast Forward : Direct Play");
    		GuiPlayer.updateSubtitleTime(this.currentTime + 29000,"FF");
        	this.plugin.JumpForward(30);
    	} else {
    		FileLog.write("Playback : Fast Forward : Transcoding");
    		this.newPlaybackPosition((this.currentTime + 30000) * 10000);
    	}
		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		} 
		if (this.infoTimer != null){
			clearTimeout(this.infoTimer);
		}
    	this.infoTimer = setTimeout(function(){
			setTimeout(function(){
				document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
				document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
		}, 3000);    	
    }  
};

GuiPlayer.handleRWKey = function() {
	FileLog.write("Playback : Rewind");
    if(this.Status == "PLAYING") {
    	if (this.PlayMethod == "DirectPlay") {
    		FileLog.write("Playback : Rewind : Direct Play");
    		GuiPlayer.updateSubtitleTime(this.currentTime - 13000,"RW");
    		this.plugin.JumpBackward(10);
    	} else {
    		FileLog.write("Playback : Rewind : Transcoding");
    		this.newPlaybackPosition((this.currentTime - 10000) * 10000);
    	}
		document.getElementById("guiPlayer_Subtitles").style.bottom="100px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		} 
		if (this.infoTimer != null){
			clearTimeout(this.infoTimer);
		}
    	this.infoTimer = setTimeout(function(){
			setTimeout(function(){
				document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
				document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
		}, 3000);   
    }  
};

GuiPlayer.handleInfoKey = function () {
	if (this.infoTimer != null){
		clearTimeout(this.infoTimer);
	}
	if (document.getElementById("guiPlayer_Osd").style.opacity == 0 || 
			document.getElementById("guiPlayer_ItemDetails").style.visibility == "hidden"){ //Full info called
		document.getElementById("guiPlayer_ItemDetails").style.visibility="";
		document.getElementById("guiPlayer_ItemDetails2").style.visibility="hidden";
		document.getElementById("guiPlayer_Subtitles").style.top="170px";
		if (document.getElementById("guiPlayer_Osd").style.opacity == 0) {
			$('#guiPlayer_Osd').css('opacity',0).animate({opacity:1}, 500);
		}
		this.infoTimer = setTimeout(function(){
			setTimeout(function(){
				document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
				document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
				document.getElementById("guiPlayer_Subtitles").style.top="auto";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
		}, 10000);
	} else { //Full info cancelled while on screen.
		$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
		this.infoTimer = setTimeout(function(){
			document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
			document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
			document.getElementById("guiPlayer_Subtitles").style.top="auto";
			document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
		}, 500);
	}
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//       GUIPLAYER 3D & AUDIO OUTPUT SETTERS
//-----------------------------------------------------------------------------------------------------------------------------------------

GuiPlayer.setupThreeDConfiguration = function() {
	if (this.playingMediaSource.Video3DFormat !== undefined) {
		if (this.pluginScreen.Flag3DEffectSupport()) {
			switch (this.playingMediaSource.Video3DFormat) {
			case "FullSideBySide":
			case "HalfSideBySide":
				result = GuiPlayer.pluginScreen.Set3DEffectMode(2);
			break;
			default:
				this.pluginScreen.Set3DEffectMode(0);
				break;
			}
		} else {
			this.pluginScreen.Set3DEffectMode(0);
		}
	} else {
		this.pluginScreen.Set3DEffectMode(0);
	}
};

GuiPlayer.setupAudioConfiguration = function() {

	var audioInfoStream = this.playingMediaSource.MediaStreams[this.playingAudioIndex];
	var codec = audioInfoStream.Codec.toLowerCase();
	
	//If audio has been transcoded need to manually set codec as codec in stream info will be wrong
	if ((File.getTVProperty("Dolby") && File.getTVProperty("AACtoDolby")) && audioInfoStream.Codec.toLowerCase() == "aac") {
		codec = "ac3";
	}

	switch (codec) {
	case "dca":
		if (File.getTVProperty("DTS")){
			var checkAudioOutModeDTS = this.pluginAudio.CheckExternalOutMode(2);
			if (checkAudioOutModeDTS > 0) {
				this.pluginAudio.SetExternalOutMode(2);
			} else {
				this.pluginAudio.SetExternalOutMode(0);
			}
			
		} else {
			this.pluginAudio.SetExternalOutMode(0);
		}
		break;	
	case "ac3":
		if (File.getTVProperty("Dolby")) {
			var checkAudioOutModeDolby = this.pluginAudio.CheckExternalOutMode(1);
			if (checkAudioOutModeDolby > 0) {
				this.pluginAudio.SetExternalOutMode(1);
			} else {
				this.pluginAudio.SetExternalOutMode(0);
			}	
		}else {
			this.pluginAudio.SetExternalOutMode(0);
		}
		break;
	default:
		this.pluginAudio.SetExternalOutMode(0);
		break;
	}
};

GuiPlayer.getTranscodeProgress = function() {
	//Get Session Data (Media Streams)
    var SessionData = Server.getContent(Server.getCustomURL("/Sessions?format=json"));
    if (SessionData == null) { return; }
    
    for (var index = 0; index < SessionData.length; index++) {
    	if (SessionData[index].DeviceId == Server.getDeviceID()) {
    		return Math.floor(SessionData[index].TranscodingInfo.CompletionPercentage);
    	}
    }
    return null;  
};

GuiPlayer.checkTranscodeCanSkip = function(newtime) {	
	var transcodePosition = (transcodeProgress / 100) * ((this.PlayerData.RunTimeTicks / 10000) - this.offsetSeconds);
	if ((newtime > this.offsetSeconds) && newtime < transcodePosition) {
		return true;
	} else {
		return false;
	}
};

GuiPlayer.newPlaybackPosition = function(startPositionTicks) {
	document.getElementById("NoKeyInput").focus();		
	this.stopPlayback();
	//Update URL with resumeticks
	this.setDisplaySize();
	var position = Math.round(startPositionTicks / 10000000);
	var url = this.playingURL + '&StartTimeTicks=' + (Math.round(startPositionTicks));
	
	if (this.PlayMethod == "Transcode") {
		this.offsetSeconds = this.offsetSeconds + ((position * 1000) - this.currentTime);
		this.plugin.ResumePlay(url,0); //0 as if transcoding the transcode will start from the supplied starttimeticks
	} else {
		this.plugin.ResumePlay(url,position); 
	}    
    this.updateSubtitleTime(startPositionTicks / 10000,"NewSubs");
};

GuiPlayer.newSubtitleIndex = function (newSubtitleIndex) {
	if (newSubtitleIndex == -1 && this.playingSubtitleIndex != null) {
		//Turn Off Subtitles
		this.PlayerDataSubtitle = null;
		this.playingSubtitleIndex = -1;
		this.subtitleShowingIndex = 0;
		this.subtitleSeeking = false;
		document.getElementById("guiPlayer_Subtitles").innerHTML = "";
		document.getElementById("guiPlayer_Subtitles").style.visibility = "hidden";
		document.getElementById("GuiPlayer").focus();	
	} else {
		//Check its not already selected 
		if (newSubtitleIndex != this.playingSubtitleIndex) {
			//Prevent displaying Subs while loading
			this.subtitleSeeking = true; 
			document.getElementById("guiPlayer_Subtitles").innerHTML = "";
			document.getElementById("guiPlayer_Subtitles").style.visibility = "hidden";
			
			//Update SubtitleIndex and reset index
			this.playingSubtitleIndex = newSubtitleIndex;
			
			//Load New Subtitle File
			this.setSubtitles(this.playingSubtitleIndex);
		    
		    //Update subs index
		    this.updateSubtitleTime(this.currentTime,"NewSubs");
		    
		    //Load Back to main page GUI
		    document.getElementById("GuiPlayer").focus();
		} else {
			//Do Nothing!
			document.getElementById("GuiPlayer").focus();
		}		
	}	
	//Keep the Subtitles menu up to date with the currently playing subs.
	GuiPlayer_Display.playingSubtitleIndex = this.playingSubtitleIndex;
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//       GUIPLAYER STOP HANDLER ON APP EXIT
//-----------------------------------------------------------------------------------------------------------------------------------------

GuiPlayer.stopOnAppExit = function() {
	if (this.plugin != null) {
		this.plugin.Stop();
		this.plugin = null;
	}
};

