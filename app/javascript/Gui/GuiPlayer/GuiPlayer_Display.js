var GuiPlayer_Display = {	
		PlayerData : null,
		playingMediaSource : null,
		playingMediaSourceIndex : null,
		playingTranscodeStatus : null,
		playingVideoIndex : null,
		playingAudioIndex : null,
		playingSubtitleIndex : null,
		offsetSeconds : 0,
		
		ItemData : null,
		
		videoToolsOptions : [],
		videoToolsSelectedItem : 0,
		subtitleIndexes : [], 
		
		audioIndexes : [],
		chapterIndexes : [], 
		
		topLeftItem : 0,
		videoToolsSelectedItemSub : 0,
		maxDisplay : 5,
		videoToolsSubOptions : [],
		videoToolsaudioOptions : [],
		
		sliderCurrentTime : 0
};

GuiPlayer_Display.setDisplay = function(playerdata,playingmediasource,playingtranscodestatus,offsetSeconds,playingVideoIndex,playingAudioIndex,playingSubtitleIndex,playingmediasourceindex) {
	this.PlayerData = playerdata;
	this.playingMediaSource = playingmediasource;
	this.playingMediaSourceIndex = playingmediasourceindex;
	this.playingTranscodeStatus = playingtranscodestatus;
	this.offsetSeconds = offsetSeconds;
	this.playingVideoIndex = playingVideoIndex;
	this.playingAudioIndex = playingAudioIndex;
	this.playingSubtitleIndex = playingSubtitleIndex;
	
	//Reset Vars
	this.videoToolsOptions = [];
	this.videoToolsSelectedItem = 0;
	this.subtitleIndexes = [];
	this.audioIndexes = [];
	this.chapterIndexes = [];
	this.topLeftItme = 0;
	this.videoToolsSelectedItemSub = 0;
	
	//Reset Page Elements
	document.getElementById("guiPlayer_Info_Details").style.backgroundImage="";
	document.getElementById("guiPlayer_ItemDetails_Overview").innerHTML = "";
	document.getElementById("guiPlayer_ItemDetails_Title").innerHTML = "";
    document.getElementById("guiPlayer_ItemDetails_SubData").innerHTML = "";
	
	//Hide page!
    document.getElementById("pageContent").innerHTML = "";
    document.getElementById("page").style.visibility="hidden";
    document.getElementById("pageBackgroundFade").style.visibility="hidden";
    document.getElementById("pageBackgroundHolder").style.visibility="hidden";
    document.getElementById("pageBackground").style.visibility="hidden";
    document.getElementById("guiPlayer_Loading").style.visibility = ""; 
    document.getElementById("guiPlayer_Ratings").innerHTML="";

    //Set PageContent
    var fileInfo = "";
    if (this.PlayerData.Type == "Episode") {
    	fileInfo = Support.getNameFormat(this.PlayerData.SeriesName, this.PlayerData.ParentIndexNumber, this.PlayerData.Name, this.PlayerData.IndexNumber);
    	fileInfo = fileInfo.replace("<br>", " ");
    	
    	//Add the series logo at the top left.
    	if (this.PlayerData.ParentLogoImageTag) {
    		document.getElementById("guiPlayer_Info_Details").innerHTML = "";
    		var imgsrc = Server.getImageURL(this.PlayerData.SeriesId,"Logo",820,110,0,false,0);
    		document.getElementById("guiPlayer_Info_Details").style.backgroundImage="url('"+imgsrc+"')";	
		}
    	
        //Add the TV series DVD cover art to the GUI display.
        var diskImgsrc = Server.getImageURL(this.PlayerData.SeriesId,"Primary",200,280,0,false,0);
    	document.getElementById("guiPlayer_DvdArt").style.backgroundImage="url('" + diskImgsrc + "')";
    	
    	//Get ratings info.
    	var toms = this.PlayerData.CriticRating;
    	var stars = this.PlayerData.CommunityRating;
    	var tomsImage = "";
    	var starsImage = "";
    	if (toms){
    		if (toms > 59){
    			tomsImage = "images/fresh-40x40.png";
    		} else {
    			tomsImage = "images/rotten-40x40.png";
    		}
    		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsTomatoIcon' style=background-image:url("+tomsImage+")></div>";
    		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsTomato'>"+toms+"%</div>";
    	}
    	if (stars){
        	if (stars <3.1){
        		starsImage = "images/star_empty-46x40.png"; 
        	} else if (stars >=3.1 && stars < 6.5) {
        		starsImage = "images/star_half-46x40.png";
        	} else {
        		starsImage = "images/star_full-46x40.png";
        	}
        	document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsStarIcon' style=background-image:url("+starsImage+")></div>";
       		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsStar'>"+stars+"</div>";
    	}
    } else {
    	fileInfo = this.PlayerData.Name;
    	
    	//Add the movie logo at the top left.
    	if (this.PlayerData.ImageTags.Logo) {
    		document.getElementById("guiPlayer_Info_Details").innerHTML = "";
    		var imgsrc = Server.getImageURL(this.PlayerData.Id,"Logo",820,110,0,false,0);
    		document.getElementById("guiPlayer_Info_Details").style.backgroundImage="url('"+imgsrc+"')";	
    	}
    	
        //Add the movie DVD cover art to the GUI display.
        var diskImgsrc = Server.getImageURL(this.PlayerData.Id,"Primary",200,280,0,false,0);
    	document.getElementById("guiPlayer_DvdArt").style.backgroundImage="url('" + diskImgsrc + "')";
    	
    	//Get ratings info.
    	var toms = this.PlayerData.CriticRating;
    	var stars = this.PlayerData.CommunityRating;
    	var tomsImage = "";
    	var starsImage = "";
    	if (toms){
    		if (toms > 59){
    			tomsImage = "images/fresh-40x40.png";
    		} else {
    			tomsImage = "images/rotten-40x40.png";
    		}
    		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsTomatoIcon' style=background-image:url("+tomsImage+")></div>";
    		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsTomato'>"+toms+"%</div>";
    	}
    	if (stars){
        	if (stars <3.1){
        		starsImage = "images/star_empty-46x40.png"; 
        	} else if (stars >=3.1 && stars < 6.5) {
        		starsImage = "images/star_half-46x40.png";
        	} else {
        		starsImage = "images/star_full-46x40.png";
        	}
        	document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsStarIcon' style=background-image:url("+starsImage+")></div>";
       		document.getElementById("guiPlayer_Ratings").innerHTML += "<div class='videoItemRatingsStar'>"+stars+"</div>";
    	}
    }
    
   	var videoName = this.playingMediaSource.Name;
    document.getElementById("guiPlayer_ItemDetails_Title").innerHTML = fileInfo;
    document.getElementById("guiPlayer_ItemDetails_Title2").innerHTML = fileInfo;
    document.getElementById("guiPlayer_ItemDetails_SubData").innerHTML = videoName + " : " + this.playingTranscodeStatus; 
    document.getElementById("guiPlayer_ItemDetails_SubData2").innerHTML = videoName + " : " + this.playingTranscodeStatus; 
    
    if (this.PlayerData.Overview !== undefined) {
    	document.getElementById("guiPlayer_ItemDetails_Overview").innerHTML = this.PlayerData.Overview;
    }
};

GuiPlayer_Display.restorePreviousMenu = function() {
	//Hide Player GUI Elements
	if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
		$('#guiPlayer_Osd').css('opacity',1).animate({opacity:0}, 500);
	}
	if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
		$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
	}
	document.getElementById("guiPlayer_ItemDetails").style.visibility="hidden";
	document.getElementById("guiPlayer_ItemDetails2").style.visibility="";
    document.getElementById("guiPlayer_Loading").style.visibility = "hidden";
    document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
    document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";  
    
    document.getElementById("pageBackgroundFade").style.visibility="";
    document.getElementById("pageBackgroundHolder").style.visibility="";
    document.getElementById("pageBackground").style.visibility="";
    document.getElementById("page").style.visibility="";
    
    //Reset Volume & Mute Keys
	//Reset NAVI - Works
	NNaviPlugin = document.getElementById("pluginObjectNNavi");
    NNaviPlugin.SetBannerState(PL_NNAVI_STATE_BANNER_NONE);
    pluginAPI.registKey(tvKey.KEY_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_MUTE);

    //Turn On Screensaver
    Support.screensaverOn();
	Support.screensaver();

	//Return to correct Page
	Support.processReturnURLHistory();
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//GUIPLAYER TOOLS MENU FUNCTIONS
//-----------------------------------------------------------------------------------------------------------------------------------------

GuiPlayer_Display.createToolsMenu = function() {
    //Create Tools Menu Subtitle
    //Must reset tools menu here on each playback!
    document.getElementById("guiPlayer_Tools").innerHTML = "";
    this.videoToolsOptions = [];
	for (var index = 0;index < this.playingMediaSource.MediaStreams.length;index++) {
		var Stream = this.playingMediaSource.MediaStreams[index];
		if (Stream.Type == "Audio") {
			if (Main.getModelYear() == "D" && File.getTVProperty("TranscodeDSeries") == false) {
				//Don't add it!
			} else {
				this.audioIndexes.push(index);
			}	
		} 
		
		if (Stream.IsTextSubtitleStream) {
			this.subtitleIndexes.push(index); //
		} 
	}
	
	if (this.PlayerData.Chapters !== undefined) {
		for (var index = 0; index < this.PlayerData.Chapters.length; index++) {
			this.chapterIndexes.push(index);
		}
		if (this.chapterIndexes.length > 0) {
			this.videoToolsOptions.push("videoOptionChapters");
		    document.getElementById("guiPlayer_Tools").innerHTML += '<div id="videoOptionChapters" class="videoToolsItem";">Chapters</div>';
		}
	}
	    
	if (this.subtitleIndexes.length > 0) {
		this.subtitleIndexes.unshift(-1);
	    this.videoToolsOptions.push("videoOptionSubtitles");
	    document.getElementById("guiPlayer_Tools").innerHTML += '<div id="videoOptionSubtitles" class="videoToolsItem";">Subtitles</div>';
		}
	    
	//Hide if only 1 audio stream given thats the one playing!
	if (this.audioIndexes.length > 1) {
	    this.videoToolsOptions.push("videoOptionAudio");
	   	document.getElementById("guiPlayer_Tools").innerHTML += '<div id="videoOptionAudio" class="videoToolsItem";">Audio</div>';
	}
	
	//Add Slider Bar
	this.videoToolsOptions.push("videoOptionSlider");
	document.getElementById("guiPlayer_Tools").innerHTML += '<div id="videoOptionSlider" class="videoToolsItem";">Position</div>';
};


GuiPlayer_Display.keyDownTools = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);
	this.videoToolsSelectedItemSub = 0;
	document.getElementById("guiPlayer_Tools_SubOptions").innerHTML = "";

	switch(keyCode) {
		case tvKey.KEY_RETURN:
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.videoToolsSelectedItem = 0;
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="none";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			document.getElementById("GuiPlayer").focus();
			break;	
		case tvKey.KEY_UP:
			widgetAPI.blockNavigation(event);
			this.videoToolsSelectedItem = 0;
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="none";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			GuiPlayer.handlePlayKey();
			document.getElementById("GuiPlayer").focus();
			break;	
		case tvKey.KEY_LEFT:
			if (this.videoToolsSelectedItem > 0) {
				this.videoToolsSelectedItem--;
				this.updateSelectedItems();
			}
			break;
		case tvKey.KEY_RIGHT:
			if (this.videoToolsSelectedItem < this.videoToolsOptions.length-1) {
				this.videoToolsSelectedItem++;
				this.updateSelectedItems();
			}
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");	
			this.topLeftItem = 0;
			switch (this.videoToolsOptions[this.videoToolsSelectedItem]) {
			case "videoOptionChapters":
				this.videoToolsSubOptions = this.chapterIndexes;
				this.updateDisplayedItemsSub();
				this.updateSelectedItemsSub();
				document.getElementById("GuiPlayer_ToolsSub").focus();
				break;
			case "videoOptionSubtitles":
				this.videoToolsSubOptions = this.subtitleIndexes;
				this.updateDisplayedItemsSub();
				this.updateSelectedItemsSub();
				document.getElementById("GuiPlayer_ToolsSub").focus();
				break;
			case "videoOptionAudio":
				this.videoToolsSubOptions = this.audioIndexes;
				this.updateDisplayedItemsSub();
				this.updateSelectedItemsSub();
				document.getElementById("GuiPlayer_ToolsSub").focus();
				break;	
			case "videoOptionSlider":
				this.sliderCurrentTime = GuiPlayer.currentTime + this.offsetSeconds;
				var leftPos = (1800 *  this.sliderCurrentTime/ (this.PlayerData.RunTimeTicks / 10000))-20+60;
				document.getElementById("guiPlayer_Tools_SliderBarCurrent").style.left = leftPos+"px";	
				document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").innerHTML = Support.convertTicksToTimeSingle(this.sliderCurrentTime);
				document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").style.left = leftPos-40+"px";
				document.getElementById("guiPlayer_Tools_Slider").style.visibility = "";
				document.getElementById("GuiPlayer_ToolsSlider").focus();	
				break;
			}
			break;		
		case tvKey.KEY_PLAY:
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="none";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePlayKey();
			break;
		case tvKey.KEY_STOP:
			GuiPlayer.handleStopKey();
            break;
		case tvKey.KEY_PAUSE:
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePauseKey();
			break;
        case tvKey.KEY_FF:
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleFFKey();      
            break;       
        case tvKey.KEY_RW:
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleRWKey();
            break;
        case tvKey.KEY_INFO:	
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handleInfoKey();
			break;
        case tvKey.KEY_EXIT:
            alert("EXIT");
            widgetAPI.blockNavigation(event);
            GuiPlayer.stopPlayback();
            GuiPlayer_Display.restorePreviousMenu();
            break;	
	}
};


GuiPlayer_Display.keyDownToolsSlider = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	switch(keyCode) {
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			document.getElementById("GuiPlayer_Tools").focus();
			break;	
		case tvKey.KEY_LEFT:
			this.sliderCurrentTime = this.sliderCurrentTime - 30000; //30 seconds
			this.sliderCurrentTime = (this.sliderCurrentTime < 0) ? 0 : this.sliderCurrentTime;
			var leftPos = (1800 * this.sliderCurrentTime / (this.PlayerData.RunTimeTicks / 10000))-20+60; //-20 half width of selector, +60 as left as progress bar is 30 from left
			document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").innerHTML = Support.convertTicksToTimeSingle(this.sliderCurrentTime);
			document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").style.left = leftPos-40+"px";
			document.getElementById("guiPlayer_Tools_SliderBarCurrent").style.left = leftPos+"px";	
			break;
		case tvKey.KEY_RIGHT:
			this.sliderCurrentTime = this.sliderCurrentTime + 30000; //30 seconds
			this.sliderCurrentTime = (this.sliderCurrentTime > this.PlayerData.RunTimeTicks / 10000) ? this.PlayerData.RunTimeTicks / 10000 : this.sliderCurrentTime;
			var leftPos = (1800 * this.sliderCurrentTime / (this.PlayerData.RunTimeTicks / 10000))-20+60;
			document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").innerHTML = Support.convertTicksToTimeSingle(this.sliderCurrentTime);
			document.getElementById("guiPlayer_Tools_SliderBarCurrentTime").style.left = leftPos-40+"px";
			document.getElementById("guiPlayer_Tools_SliderBarCurrent").style.left = leftPos+"px";	
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="none";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			GuiPlayer.newPlaybackPosition(this.sliderCurrentTime * 10000);
			break;
		case tvKey.KEY_PLAY:
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePlayKey();
			break;
		case tvKey.KEY_STOP:
			GuiPlayer.handleStopKey();
            break;
		case tvKey.KEY_PAUSE:
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePauseKey();
			break;
        case tvKey.KEY_FF:
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleFFKey();      
            break;       
        case tvKey.KEY_RW:
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleRWKey();
            break;
        case tvKey.KEY_INFO:	
			document.getElementById("guiPlayer_Tools_Slider").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handleInfoKey();
			break;
        case tvKey.KEY_EXIT:
            alert("EXIT");
            widgetAPI.blockNavigation(event);
            GuiPlayer.stopPlayback();
            GuiPlayer_Display.restorePreviousMenu();
            break;	
	}
};

GuiPlayer_Display.updateSelectedItems = function() {
	for (var index = 0; index < this.videoToolsOptions.length; index++){	
		if (index == this.videoToolsSelectedItem) {
			document.getElementById(this.videoToolsOptions[index]).className = "videoToolsItem videoToolsItemSelected";	
		} else {	
			document.getElementById(this.videoToolsOptions[index]).className = "videoToolsItem";		
		}		
	} 
};

GuiPlayer_Display.keyDownToolsSub = function() {
	var keyCode = event.keyCode;
	alert("Key pressed keyDownToolsSub: " + keyCode);

	switch(keyCode) {
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			this.updateSelectedItems();
			document.getElementById("GuiPlayer_Tools").focus();
			break;	
		case tvKey.KEY_UP:
			this.videoToolsSelectedItemSub--;
			if (this.videoToolsSelectedItemSub < 0) {
				this.videoToolsSelectedItemSub++;
			}
			if (this.videoToolsSelectedItemSub < this.topLeftItem) {
				this.topLeftItem--;
				this.updateDisplayedItemsSub();
			}
			this.updateSelectedItemsSub();
		break;
		case tvKey.KEY_DOWN:
			this.videoToolsSelectedItemSub++;
			if (this.videoToolsSelectedItemSub > this.videoToolsSubOptions.length-1) {
				this.videoToolsSelectedItemSub--;
			}
			if (this.videoToolsSelectedItemSub >= this.topLeftItem + this.maxDisplay) {
				this.topLeftItem++;
				this.updateDisplayedItemsSub();
			}
			this.updateSelectedItemsSub();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");	
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			setTimeout(function(){
				document.getElementById("guiPlayer_Subtitles").style.top="none";
				document.getElementById("guiPlayer_Subtitles").style.bottom="60px";
			}, 500);
			switch (this.videoToolsOptions[this.videoToolsSelectedItem]) {
			case "videoOptionChapters":
				GuiPlayer.newPlaybackPosition(this.PlayerData.Chapters[this.videoToolsSelectedItemSub].StartPositionTicks);
				break;	
			case "videoOptionSubtitles":
				GuiPlayer.newSubtitleIndex(this.videoToolsSubOptions[this.videoToolsSelectedItemSub]);
				break;
			case "videoOptionAudio":
				if (this.videoToolsSubOptions[this.videoToolsSelectedItemSub] != this.playingAudioIndex) {
					GuiPlayer.stopPlayback();
					document.getElementById("GuiPlayer").focus();
					
					//Check if first index - If it is need to stream copy audio track
					var isFirstAudioIndex = (this.videoToolsSubOptions[this.videoToolsSelectedItemSub] == this.audioIndexes[0]) ? true : false;
					var transcodeResult = GuiPlayer_Transcoding.start(this.PlayerData.Id,this.playingMediaSource,this.playingMediaSourceIndex,this.playingVideoIndex,this.videoToolsSubOptions[this.videoToolsSelectedItemSub],isFirstAudioIndex,this.playingSubtitleIndex);
					GuiPlayer.startPlayback(transcodeResult, GuiPlayer.currentTime);
				} else {
					//Do Nothing!
					document.getElementById("GuiPlayer").focus();
				}
				break;	
			}	
			break;	
		case tvKey.KEY_PLAY:
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePlayKey();
			break;
		case tvKey.KEY_STOP:
			GuiPlayer.handleStopKey();
            break;
		case tvKey.KEY_PAUSE:
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handlePauseKey();
			break;
        case tvKey.KEY_FF:
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleFFKey();      
            break;       
        case tvKey.KEY_RW:
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
        	GuiPlayer.handleRWKey();
            break;
        case tvKey.KEY_INFO:	
			document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "hidden";
			if (document.getElementById("guiPlayer_Tools").style.opacity != 0) {
    			$('#guiPlayer_Tools').css('opacity',1).animate({opacity:0}, 500);
    		}
			document.getElementById("GuiPlayer").focus();
			GuiPlayer.handleInfoKey();
			break;
        case tvKey.KEY_EXIT:
            alert("EXIT");
            widgetAPI.blockNavigation(event);
            GuiPlayer.stopPlayback();
            GuiPlayer_Display.restorePreviousMenu();
            break;	
	}
};

GuiPlayer_Display.updateSelectedItemsSub = function() {	
	document.getElementById(this.videoToolsOptions[this.videoToolsSelectedItem]).className = "videoToolsItem";
	for (var index = this.topLeftItem; index < Math.min(this.videoToolsSubOptions.length,this.topLeftItem + this.maxDisplay);index++){
		var classes = "videoToolsOption";
		if (index == this.videoToolsSelectedItemSub) {
			classes += " videoToolsOptionSelected";	
		}
		if (index == this.topLeftItem && this.topLeftItem != 0){
			classes += " arrowUp";
		}
		if (index == this.topLeftItem + this.maxDisplay -1 && this.topLeftItem + this.maxDisplay -1 != this.videoToolsSubOptions.length -1){
			classes += " arrowDown";
		}
		document.getElementById("videoToolsSubOptions"+index).className = classes;
	} 
};

GuiPlayer_Display.updateDisplayedItemsSub = function() {
	document.getElementById("guiPlayer_Tools_SubOptions").innerHTML = "";
	alert ("VideoToolsSubOptions Length: " + this.videoToolsSubOptions.length);
	for (var index = this.topLeftItem; index < Math.min(this.videoToolsSubOptions.length,this.topLeftItem + this.maxDisplay);index++) {
		switch (this.videoToolsOptions[this.videoToolsSelectedItem]) {
		case "videoOptionSubtitles":
			alert ("Subtitle Option Index in DisplayItems: " + this.videoToolsSubOptions[index]);
			if (this.videoToolsSubOptions[index] == -1) {
				document.getElementById("guiPlayer_Tools_SubOptions").innerHTML += "<div id=videoToolsSubOptions"+index+" class=videoToolsOption>None</div>";	
			} else {
				var Name = "";
				if (this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Language !== undefined) {
					Name = getLanguageName(this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Language);
					if (Name === undefined) {
						Name = this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Language;
					}
				} else {
					Name = "Unknown Language";
				}
				if (this.playingSubtitleIndex == this.videoToolsSubOptions[index]) {
					Name += " - Showing";
				}
				document.getElementById("guiPlayer_Tools_SubOptions").innerHTML += "<div id=videoToolsSubOptions"+index+" class=videoToolsOption>"+Name+"</div>";	
			}	
			break;
		case "videoOptionAudio":
			//Run option through transcoding algorithm - see if it plays natively
			var transcodeResult = GuiPlayer_Transcoding.start(this.PlayerData.Id, this.playingMediaSource,this.playingMediaSourceIndex, this.playingVideoIndex, this.videoToolsSubOptions[index]);
					
			var Name = this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Codec + " - ";
			if (this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Language !== undefined) {
				Name += this.playingMediaSource.MediaStreams[this.videoToolsSubOptions[index]].Language;
			} else {
				Name += "Unknown Language";
			}
			
			var requireTranscode = (transcodeResult[2] == "Direct Stream") ? "Direct Play" : "Transcode";
			Name += "<br>" + requireTranscode;
			if (this.playingAudioIndex == this.videoToolsSubOptions[index]) {
				Name += " - Currently Playing";
			}
			
			document.getElementById("guiPlayer_Tools_SubOptions").innerHTML += "<div id=videoToolsSubOptions"+index+" class=videoToolsOption>"+Name+"</div>";
			break;	
		case "videoOptionChapters":
			document.getElementById("guiPlayer_Tools_SubOptions").innerHTML += "<div id=videoToolsSubOptions"+index+" class=videoToolsOption>"+this.PlayerData.Chapters[index].Name+"</div>";
			break;	
		}	
	}
	document.getElementById("guiPlayer_Tools_SubOptions").style.visibility = "";
};