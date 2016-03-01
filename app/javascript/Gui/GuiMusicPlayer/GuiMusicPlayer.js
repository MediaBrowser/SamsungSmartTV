var GuiMusicPlayer = {	
		player : null,

		currentPlayingItem : 0,
		
		Status : "STOPPED",
		currentTime : 0,
		updateTimeCount : 0,

		videoURL : null,
		
		selectedItem : 0,
		playedFromPage : null,
		selectedDivId : 0,
		selectedDivClass : "",
		previousImagePlayerOverlay : 0,
		
		queuedItems : [],
		
		isThemeMusicPlaying : false,
		showThemeId : null,
}

GuiMusicPlayer.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,null,"Return");
}

GuiMusicPlayer.init = function(callback) {
	GuiPlayer.stopOnAppExit();

	webapis.avplay.getAVPlay(function (player) {
		if (this.player && this.player !== player) {
			this.player.destroy();
		}
		this.player = player;
		player.init({
			displayRect: {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			},
			bufferingCallback: {
				onbufferingstart: GuiMusicPlayer.OnStreamInfoReady.bind(this),
			},
			playCallback: {
				oncurrentplaytime: GuiMusicPlayer.setCurrentTime.bind(this),
				onstreamcompleted: GuiMusicPlayer.handleOnRenderingComplete.bind(this),
				onerror: GuiMusicPlayer.handleError.bind(this),
			},
		});

		if (typeof callback === 'function') {
			callback(player);
		}
	}.bind(this));
}

GuiMusicPlayer.showMusicPlayer = function(playedFromPage,selectedDivId,selectedDivClass) {
	if (this.Status != "STOPPED") {

		this.playedFromPage = playedFromPage;
		this.selectedDivId = selectedDivId;
		
		//Unhighlight the page's selected content
		if (selectedDivId != null) {
			if (selectedDivClass === undefined) {
				this.selectedDivClass = "UNDEFINED";
			} else {
				this.selectedDivClass = selectedDivClass;
			}
			document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("GuiPage_Setting_Changing arrowUpDown","");
			document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("EpisodeListSelected","");
			document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("BannerSelected","");
			document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("seriesSelected","");
			document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("Selected","");
		}
		
		if (playedFromPage == "GuiImagePlayer") {
			clearTimeout(GuiImagePlayer.infoTimer);
			document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility="hidden";
			document.getElementById("guiButtonShade").style.visibility = "";
		}
		document.getElementById("guiMusicPlayerDiv").style.bottom = "-60px";
		document.getElementById("guiMusicPlayerDiv").style.visibility = "";
		$('.guiMusicPlayerDiv').animate({
			bottom: 0
		}, 300, function() {
			//animate complete.
		});
		document.getElementById("Counter").style.visibility = "hidden";
		document.getElementById("GuiMusicPlayer").focus();
	}
}

GuiMusicPlayer.start = function(title,url,playedFromPage,isQueue,showThemeId,itemId) {
	this.selectedItem = 0;
	var start = function (player) {
		if (title == "Theme") {
			//Only play music is no real music is playing!
			if (this.Status == "STOPPED" || this.isThemeMusicPlaying == true) {
				//Check if Theme Playback is enabled
				if (File.getUserProperty("AudioTheme")) {
					//Check if show Id has changed
					if (showThemeId != this.showThemeId) {
						var urlTheme = Server.getThemeMedia(itemId);
						this.ItemData = Server.getContent(urlTheme);
						if (this.ItemData == null) { return; }

						if (this.ItemData.ThemeSongsResult.Items.length > 0) {
							//Play something
							if (this.Status != "STOPPED") {
								this.stopPlayback();
							}
							this.currentPlayingItem = 0;
							this.showThemeId = showThemeId;
							this.isThemeMusicPlaying = true;

							for (var index = 0; index < this.ItemData.ThemeSongsResult.Items.length; index++){
								this.queuedItems.push(this.ItemData.ThemeSongsResult.Items[index]);
							}

							this.videoURL = Server.getServerAddr() + '/Audio/'+this.queuedItems[this.currentPlayingItem].Id+'/Stream.mp3?static=true&MediaSource='+this.queuedItems[this.currentPlayingItem].MediaSources[0].Id;
							this.updateSelectedItem();
							//Start Playback
							this.handlePlayKey();
						} else {
							this.showThemeId = null;
							this.isThemeMusicPlaying = false;
						}
					}
				}
			}
		} else {
			//get info from URL
			this.ItemData = Server.getContent(url);
			if (this.ItemData == null) { return; }

			//See if item is to be added to playlist or not - if not reset playlist
			if (this.Status != "STOPPED" && (this.isThemeMusicPlaying == true || isQueue == false)) {
				this.stopPlayback();
			}

			if (title != "Song") {
				for (var index = 0; index < this.ItemData.Items.length; index++) {
					this.queuedItems.push(this.ItemData.Items[index]);
				}
			} else {
				//Is Individual Song
				this.queuedItems.push(this.ItemData);
			}

			//Only start if not already playing!
			//If reset this will be true, if not it will be added to queued items
			if (this.Status == "STOPPED") {
				this.currentPlayingItem = 0;
				if (this.queuedItems[this.currentPlayingItem].Type == "ChannelAudioItem") {
					this.videoURL = Server.getCustomURL("/audio/"+this.queuedItems[this.currentPlayingItem].Id+"/stream.mp3?DeviceId="+Server.getDeviceID()+"&AudioCodec=mp3&AudioBitrate=192000&MaxAudioChannels=2");
				} else {
					this.videoURL = Server.getServerAddr() + '/Audio/'+this.queuedItems[this.currentPlayingItem].Id+'/Stream.mp3?static=true&MediaSource='+this.queuedItems[this.currentPlayingItem].MediaSources[0].Id;
				}

				//Update selected Item
				this.updateSelectedItem();

				//Start Playback
				this.handlePlayKey();

				//Show Content
				this.showMusicPlayer(playedFromPage,itemId,"Music seriesSelected");
			}
		}
	}.bind(this);


	//Initiate Player for Music if required.
	//Set to null on end of playlist or stop.
	if (this.player == null) {
		this.init(start);
	} else {
		start(this.player);
	}
}

GuiMusicPlayer.updateSelectedItem = function() {
	/*document.getElementById("guiMusicPlayerNowPlaying").style.color = "white";*/
	document.getElementById("guiMusicPlayerScreenOff").style.color = "white";
	switch (this.selectedItem ) {
/*		case 0:
			document.getElementById("guiMusicPlayerNowPlaying").style.color = "#27a436";
			break;*/
		case 0:
			document.getElementById("guiMusicPlayerScreenOff").className = "guiMusicPlayerScreenOff SelectedButton";
			break;
		default:
			document.getElementById("guiMusicPlayerNowPlaying").className = "guiMusicPlayerNowPlaying SelectedButton";
			break;
		}
}

//--------------------------------------------------------------------------------------------------

GuiMusicPlayer.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);
	
	//Returning from blank screen
	if (document.getElementById("everything").style.visibility=="hidden") {
		document.getElementById("everything").style.visibility="";
		
		//Turn On Screensaver
	    Support.screensaverOn();
		Support.screensaver();
		
		//Don't let Return exit the app.
		switch(keyCode) {
		case tvKey.KEY_RETURN:
			widgetAPI.blockNavigation(event);
			break;
		}
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
		case tvKey.KEY_LEFT:
			this.selectedItem--;
			if (this.selectedItem < 0) {
				this.selectedItem = 0;
			}
			this.updateSelectedItem();
			break;
		case tvKey.KEY_RIGHT:
			this.selectedItem++;
			if (this.selectedItem > 0) {
				this.selectedItem = 0;
			}
			this.updateSelectedItem();
			break;
		case tvKey.KEY_ENTER:	
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER-player");
			switch (this.selectedItem) {
				/*case 0:
					//Hide the music player.
					$('.guiMusicPlayerDiv').animate({
						bottom: -60
					}, 400, function() {
						document.getElementById("guiMusicPlayerDiv").style.visibility = "hidden";
						document.getElementById("guiMusicPlayerDiv").style.bottom = "0";
					});
					//Set Focus for Key Events
					//document.getElementById("GuiPage_Music").focus();
					break;*/
				case 0:
					this.handleScreenKey();
					break;	
			}
			break;	
		case tvKey.KEY_PLAY:
			this.handlePlayKey();
			break;	
		case tvKey.KEY_PAUSE:	
			this.handlePauseKey();
			break;
		case tvKey.KEY_STOP:	
			this.handleStopKey();
			break;
		case tvKey.KEY_FF:	
			this.handleNextKey();
			break;
		case tvKey.KEY_RW:	
			this.handlePreviousKey();
			break;
		case tvKey.KEY_UP:
		case tvKey.KEY_DOWN:
		case tvKey.KEY_RETURN:
		case tvKey.KEY_BLUE:	
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			if (this.status == "PAUSED") {
				this.handleStopKey();
			} else {
				if (this.playedFromPage == "GuiImagePlayer") {
					document.getElementById("guiButtonShade").style.visibility = "hidden";
					document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility="";
				}
				//Hide the music player.
				document.getElementById("guiMusicPlayerDiv").style.visibility = "hidden";
				document.getElementById("guiMusicPlayerDiv").style.bottom = "0";
				document.getElementById("Counter").style.visibility = "";
				
				//Hide colour buttons if a slideshow is running.
				if (GuiImagePlayer.ImageViewer != null){
					GuiHelper.setControlButtons(null,null,null,null,null);
				}
				
				//Set Page GUI elements Correct & Set Focus
				if (this.selectedDivId != null) {
					if (this.selectedDivClass == "UNDEFINED") {
						document.getElementById(this.selectedDivId).className = document.getElementById(this.selectedDivId).className + " Selected";		
					} else {
						document.getElementById(this.selectedDivId).className = this.selectedDivClass;
					}
				}
				document.getElementById(this.playedFromPage).focus();
			}
			break;
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

GuiMusicPlayer.handlePlayKey = function() {
	if (this.Status != "PLAYING") {
		webapis.audiocontrol.setMute(false);

		if (this.Status == "PAUSED") {
			this.player.resume();
		} else {
			//Clear down any variables
			this.currentTime = 0;
		    this.updateTimeCount = 0;

			//Calculate position in seconds
			this.player.open(this.videoURL);
			this.player.play(function() {}, GuiMusicPlayer.handleError, this.currentTime);
		}
		document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-active-29x37.png')";
		document.getElementById("guiMusicPlayerPause").style.backgroundImage="url('images/musicplayer/pause-32x37.png')";
		this.Status = "PLAYING";
	}
}

GuiMusicPlayer.handlePauseKey = function() {
	this.player.pause();
	Server.videoPaused(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,this.currentTime,"DirectStream");
	document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-29x37.png')";
	document.getElementById("guiMusicPlayerPause").style.backgroundImage="url('images/musicplayer/pause-active-32x37.png')";
	this.Status = "PAUSED";
}

GuiMusicPlayer.stopPlayback = function() {
	//Reset everything
	this.Status = "STOPPED";
	alert (this.currentPlayingItem);
	Server.videoStopped(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,this.currentTime,"DirectStream");
	this.showThemeId = null;
	this.isThemeMusicPlaying = false;
	this.currentPlayingItem = 0;
	this.queuedItems.length = 0;
	this.player.stop();

	document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-29x37.png')";
	document.getElementById("guiMusicPlayerPause").style.backgroundImage="url('images/musicplayer/pause-32x37.png')";
	document.getElementById("guiMusicPlayerStop").style.backgroundImage="url('images/musicplayer/stop-active-37x37.png')";
	setTimeout(function(){
		document.getElementById("guiMusicPlayerStop").style.backgroundImage="url('images/musicplayer/stop-37x37.png')";
	}, 400);
}

GuiMusicPlayer.handleStopKey = function() {
	alert ("STOPPING PLAYBACK");
	this.stopPlayback();
	GuiHelper.setControlButtons(0,0,0,null,0);
	this.returnToPage();
}

GuiMusicPlayer.returnToPage = function() {
	//Reset NAVI - Works
    pluginAPI.SetBannerState(0);
    pluginAPI.registKey(tvKey.KEY_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_MUTE);
	
	
	//Set queued Items to 0
    this.isThemeMusicPlaying = false;
	this.queuedItems.length = 0;
	
    if (document.getElementById("guiMusicPlayerDiv").style.visibility == "") {
		document.getElementById("guiMusicPlayerDiv").style.visibility = "hidden";
		document.getElementById("guiMusicPlayerDiv").style.bottom = "0";	
    }
    
	//Set Page GUI elements Correct & Set Focus
	if (this.selectedDivId != null) {
		if (this.selectedDivClass == "UNDEFINED") {
			document.getElementById(this.selectedDivId).className = document.getElementById(this.selectedDivId).className + " Selected";		
		} else {
			document.getElementById(this.selectedDivId).className = this.selectedDivClass;
		}
	}
	document.getElementById(this.playedFromPage).focus();
}

GuiMusicPlayer.handleNextKey = function() {
	
	//Stop Any Playback
	Server.videoStopped(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,this.currentTime,"DirectStream");
	this.player.stop();
	this.Status = "STOPPED";
		
	this.currentPlayingItem++;
		
	if (this.queuedItems.length <= this.currentPlayingItem) {	
		this.returnToPage();
	} else {
		//Play Next Item
		this.videoURL = Server.getServerAddr() + '/Audio/'+this.queuedItems[this.currentPlayingItem].Id+'/Stream.mp3?static=true&MediaSource='+this.queuedItems[this.currentPlayingItem].MediaSources[0].Id;
		alert ("Next " + this.videoURL);
		//Start Playback
		this.handlePlayKey();
	}
	
	document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-29x37.png')";
	document.getElementById("guiMusicPlayerPause").style.backgroundImage="url('images/musicplayer/pause-32x37.png')";
	document.getElementById("guiMusicPlayerNext").style.backgroundImage="url('images/musicplayer/skip-next-active-36x37.png')";
	setTimeout(function(){
		document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-active-29x37.png')";
		document.getElementById("guiMusicPlayerNext").style.backgroundImage="url('images/musicplayer/skip-next-36x37.png')";
	}, 300);
}

GuiMusicPlayer.handlePreviousKey = function() {
	//Stop Any Playback
	var timeOfStoppedSong = Math.floor((this.currentTime % 60000) / 1000);

	Server.videoStopped(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,this.currentTime,"DirectStream");
	this.playe.stop();
	this.Status = "STOPPED";
	
	//If song over 5 seconds long, previous song returns to start of current song, else go back to previous
	this.currentPlayingItem = (timeOfStoppedSong > 5 ) ? this.currentPlayingItem : this.currentPlayingItem-1;
		
	alert ("Queue Length : " + this.queuedItems.length);
	alert ("Current Playing ID : " + this.currentPlayingItem);
		
	if (this.queuedItems.length <= this.currentPlayingItem) {	
		this.returnToPage();
	} else {
		//Play Next Item
		this.videoURL = Server.getServerAddr() + '/Audio/'+this.queuedItems[this.currentPlayingItem].Id+'/Stream.mp3?static=true&MediaSource='+this.queuedItems[this.currentPlayingItem].MediaSources[0].Id;
		alert ("Next " + this.videoURL);
		//Start Playback
		this.handlePlayKey();
	}
	
	document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-29x37.png')";
	document.getElementById("guiMusicPlayerPause").style.backgroundImage="url('images/musicplayer/pause-32x37.png')";
	document.getElementById("guiMusicPlayerPrevious").style.backgroundImage="url('images/musicplayer/skip-previous-active-36x37.png')";
	setTimeout(function(){
		document.getElementById("guiMusicPlayerPlay").style.backgroundImage="url('images/musicplayer/play-active-29x37.png')";
		document.getElementById("guiMusicPlayerPrevious").style.backgroundImage="url('images/musicplayer/skip-previous-36x37.png')";
	}, 300);
}
GuiMusicPlayer.handleScreenKey = function() {
	 //Turn off screensaver
	Support.screensaverOff();
	
	document.getElementById("everything").style.visibility="hidden";
}

GuiMusicPlayer.handlePlaylistKey = function() {
	//Redo another day
	/*
	if (document.getElementById("guiMusicPlayerShowPlaylist").style.visibility == "hidden") {
		document.getElementById("guiMusicPlayerShowPlaylist").style.visibility = "";
	} else {
		document.getElementById("guiMusicPlayerShowPlaylist").style.visibility = "hidden";
	}
	
	document.getElementById("guiMusicPlayerShowPlaylistContent").innerHTML = "";
	for (var index = 0; index < this.queuedItems.length; index++) {
		document.getElementById("guiMusicPlayerShowPlaylistContent").innerHTML += this.queuedItems[index].Name;
	}
	*/
}

//--------------------------------------------------------------------------------------------------

GuiMusicPlayer.handleOnRenderingComplete = function() {
	alert ("File complete")
	this.handleNextKey();
}

GuiMusicPlayer.handleError = function(error) {
	alert("Error : " + error.name + " : " + error.message);
}

GuiMusicPlayer.setCurrentTime = function(time){
	if (this.Status == "PLAYING") {
		this.currentTime = time.millisecond;
		this.updateTimeCount++;
		
		if (this.queuedItems[this.currentPlayingItem].Type == "ChannelAudioItem") {
			document.getElementById("guiMusicPlayerTime").innerHTML = Support.convertTicksToTimeSingle(this.currentTime);
		} else {
			//Update Server every 8 ticks
			if (this.updateTimeCount == 8) {
				this.updateTimeCount = 0;
				//Update Server
				Server.videoPaused(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,this.currentTime,"DirectStream");
			}
			document.getElementById("guiMusicPlayerTime").innerHTML = Support.convertTicksToTime(this.currentTime, (this.queuedItems[this.currentPlayingItem].RunTimeTicks / 10000));
		}
	}
}

GuiMusicPlayer.OnStreamInfoReady = function() {
	var playingTitle = "";
	if (this.isThemeMusicPlaying == false) {
		if (this.queuedItems[this.currentPlayingItem].IndexNumber){
			if (this.queuedItems[this.currentPlayingItem].IndexNumber < 10) {
				playingTitle = " - " + "0"+this.queuedItems[this.currentPlayingItem].IndexNumber+" - ";
			} else {
				playingTitle = " - " + this.queuedItems[this.currentPlayingItem].IndexNumber+" - ";
			}	
		}
		var songName = this.queuedItems[this.currentPlayingItem].Name;
		var title = "";
		if (this.queuedItems[this.currentPlayingItem].Artists) {
			title += this.queuedItems[this.currentPlayingItem].Artists + " ";
		}
		if (playingTitle) {
			title += playingTitle;
		}
		if (this.queuedItems[this.currentPlayingItem].Name) {
			title += this.queuedItems[this.currentPlayingItem].Name;
		}
		//Truncate long title.
		if (title.length > 67){
			title = title.substring(0,65) + "..."; 
		}

		document.getElementById("guiMusicPlayerTitle").innerHTML = title;
	} else {
		document.getElementById("guiMusicPlayerTitle").innerHTML = "Theme Music";
	}

	document.getElementById("guiMusicPlayerTime").innerHTML = Support.convertTicksToTime(this.currentTime, (this.queuedItems[this.currentPlayingItem].RunTimeTicks / 10000));
	
	//Playback Checkin
	Server.videoStarted(this.queuedItems[this.currentPlayingItem].Id,this.queuedItems[this.currentPlayingItem].MediaSources[0].Id,"DirectStream");
	
    //Volume & Mute Control - Works!
    pluginAPI.SetBannerState(1);
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
}

GuiMusicPlayer.stopOnAppExit = function() {
	if (this.player != null) {
		this.player.destroy();
		this.player = null;
	}
}