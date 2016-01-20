var GuiImagePlayer = {	
		ImageViewer : null,
		newItemData : null,
		
		Timeout : null,
		infoTimer : null,
		Paused : false,
		
		overlayFormat : 0, // 0 - date, 1 - date:time, 2 - off 
		
		photos : [],
		
		images : [],
		overlay : [],
        imageIdx : 0,		// Image index
        effectIdx : 0,		// Transition effect index
        effectNames : ['FADE1', 'FADE2', 'BLIND', 'SPIRAL','CHECKER', 'LINEAR', 'STAIRS', 'WIPE', 'RANDOM']
}

//ImageViewer.destroy doesn't work. Set it to null instead.
GuiImagePlayer.kill = function() {
	if (this.ImageViewer != null) {
		this.ImageViewer = null;	
	}
}

GuiImagePlayer.start = function(ItemData,selectedItem,isPhotoCollection) {
	alert("Page Enter : GuiImagePlayer");
	
	//Show colour buttons on screen for a few seconds when a slideshow starts.
	document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility="hidden";
	document.getElementById("guiButtonShade").style.visibility = "";
	GuiHelper.setControlButtons("Favourite","Date/Time","Help",GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	this.infoTimer = setTimeout(function(){
		GuiHelper.setControlButtons(null,null,null,null,null);
		document.getElementById("Clock").style.visibility = "hidden";
		document.getElementById("guiButtonShade").style.visibility = "hidden";
		document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility="";
	}, 6000);

	//Turn off screensaver
	Support.screensaverOff();

	var url = "";
	if (isPhotoCollection) {
		url = Server.getChildItemsURL(ItemData.Items[selectedItem].Id,"&Recursive=true&SortBy=Random&SortOrder=Ascending&IncludeItemTypes=Photo&fields=SortName,Overview&Limit=2500");	
	} else {
		url = Server.getChildItemsURL(ItemData.Items[selectedItem].ParentId,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Photo&fields=SortName,Overview&Limit=2500");	
	}
	
	var result = Server.getContent(url);
	if (result == null) { return; }
	this.newItemData = result; //Misleading I know!

	Support.styleSubtitles("GuiImagePlayer_ScreensaverOverlay")
	
	//Create ARRAY of all URL's!
	//Order from starting selectedItem!
	imageIdx = 0;
	for (var index = 0; index < result.Items.length; index++) {
		var temp = Server.getImageURL(this.newItemData.Items[index].Id,"Primary",1920,1080,0,false,0);
		this.images.push(temp);
		
		if (this.newItemData.Items[index].PremiereDate !== undefined) {
			this.overlay.push(Support.formatDateTime(this.newItemData.Items[index].PremiereDate,1))
		} else {
			this.overlay.push(""); //Need to push something to keep indexes matched up!
		}
		if (result.Items[index].Id == ItemData.Items[selectedItem].Id) {
			this.imageIdx = index;
		}
	}

	//Initialte new instance, set Frame Area & Set Notifications
	this.ImageViewer = new CImageViewer('Common ImageViewer');
	this.ImageViewer.setFrameArea(0, 0, Main.width, Main.height); 
	
	this.ImageViewer.setOnNetworkError(function() {
		GuiNotifications.setNotification("Network Error");
	});
	
	this.ImageViewer.setOnRenderError(function() {
		GuiNotifications.setNotification("Render Error");
	});
	
	
	//Set Focus for Key Events
	document.getElementById("GuiImagePlayer").focus();	
	
	//Start Slide Show
	this.ImageViewer.show();
	this.setSlideshowMode();
	//this.setNormalMode();
}

// Set normal mode
// You can play images on the area you set.
GuiImagePlayer.setNormalMode = function() {
	
	sf.service.ImageViewer.setPosition({
		left: 0,
		top: 0,
		width: 1920,
		height: 1080,
	});
	
	sf.service.ImageViewer.show();
	
	for (var i=0; i < this.newItemData.Items.length; i++){
		var ImageUrl = Server.getImageURL(this.newItemData.Items[i].Id,"Primary",1920,1080,0,false,0);
		this.photos[i] = {
		        url: ImageUrl,
		        width: 1920,
		        height: 1080,
		        filename: this.newItemData.Items[i].name,
		        date: '2011/06/24'	
		}
	}
	
	// Draw the image in the specified area defined by "setPosition" function.
	sf.service.ImageViewer.draw(this.photos[0]);
	
	
	//this.ImageViewer.endSlideshow();
    //playImage();
}

// Set Slideshow mode
// You can use Transtion effect
GuiImagePlayer.setSlideshowMode = function() {
	this.ImageViewer.startSlideshow();
	this.ImageViewer.setOnBufferingComplete(function(){
		GuiImagePlayer.ImageViewer.showNow();			
    });
	this.ImageViewer.setOnRenderingComplete(function(){
		clearTimeout(GuiImagePlayer.Timeout);
		Support.setImagePlayerOverlay(GuiImagePlayer.overlay[GuiImagePlayer.imageIdx], GuiImagePlayer.overlayFormat);
		GuiImagePlayer.Timeout = setTimeout(function(){
			if (GuiImagePlayer.Paused == false) {
				GuiImagePlayer.imageIdx = GuiImagePlayer.imageIdx+1;
				if (GuiImagePlayer.imageIdx >= GuiImagePlayer.newItemData.Items.length ) {
					GuiImagePlayer.imageIdx = 0;
				}
				GuiImagePlayer.prepImage(GuiImagePlayer.imageIdx);
			}
		}, File.getUserProperty("ImagePlayerImageTime"));	
    });
	
	this.ImageViewer.stop();
	this.playImage();
}

//Prepare next image
GuiImagePlayer.prepImage = function(imageIdx) {
	this.ImageViewer.prepareNext(GuiImagePlayer.images[imageIdx], this.ImageViewer.Effect.FADE1);
}

// Play image - only called once in slideshow!
//SS calls  play -> BufferComplete, then the showNow will call RendComplete which starts timer for next image
GuiImagePlayer.playImage = function() {	
	var url = GuiImagePlayer.images[GuiImagePlayer.imageIdx];
	GuiImagePlayer.ImageViewer.play(url, 1920, 1080);	
}


GuiImagePlayer.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode){		
		case tvKey.KEY_STOP:   
		case tvKey.KEY_RETURN:
			alert("RETURN");
    		clearTimeout(this.infoTimer);
			clearTimeout(this.Timeout);
			this.Timeout = null;
			this.images = [];
			this.overlay = [];
			document.getElementById("GuiImagePlayer_ScreensaverOverlay").innerHTML = "";
			document.getElementById("guiButtonShade").style.visibility = "hidden";
			document.getElementById("Clock").style.visibility = "";
			this.ImageViewer.endSlideshow();
			this.ImageViewer.hide();
			widgetAPI.blockNavigation(event);
			GuiImagePlayer.kill();
			
			//Turn On Screensaver
			Support.screensaverOn();
			Support.screensaver();
			
			Support.processReturnURLHistory();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			this.imageIdx++;
			if (this.imageIdx == this.images.length) {
				this.imageIdx = 0;	
			}
			GuiImagePlayer.prepImage(GuiImagePlayer.imageIdx);
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			this.imageIdx--;
			if (this.imageIdx < 0) {
				this.imageIdx = this.images.length-1;
			}
			GuiImagePlayer.prepImage(GuiImagePlayer.imageIdx);
			break;
		case tvKey.KEY_PAUSE:
			alert("PAUSE")
			this.Paused = true
			break;
		case tvKey.KEY_PLAY:
			alert("PLAY")
			this.Paused = false
			GuiImagePlayer.prepImage(GuiImagePlayer.imageIdx);
			break;
		case tvKey.KEY_RED:	
			if (this.newItemData.Items[this.imageIdx].UserData.IsFavorite == true) {
				Server.deleteFavourite(this.newItemData.Items[this.imageIdx].Id);
				this.newItemData.Items[this.imageIdx].UserData.IsFavorite = false;
				GuiNotifications.setNotification ("Item has been removed from<br>favourites","Favourites");
			} else {
				Server.setFavourite(this.newItemData.Items[this.imageIdx].Id);
				this.newItemData.Items[this.imageIdx].UserData.IsFavorite = true;
				GuiNotifications.setNotification ("Item has been added to<br>favourites","Favourites");
			}
			break;
		case tvKey.KEY_GREEN:
			if (this.overlayFormat == 2) {
				this.overlayFormat = 0;
			} else {
				this.overlayFormat = this.overlayFormat + 1;
			}
			Support.setImagePlayerOverlay(this.overlay[this.imageIdx], this.overlayFormat);
			break;
		case tvKey.KEY_YELLOW:
			GuiHelper.toggleHelp("GuiImagePlayer");
			break;
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiImagePlayer");
			break;
	}
}

