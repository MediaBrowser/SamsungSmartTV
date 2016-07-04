var GuiImagePlayer_Screensaver = {	
		ImageViewer : null,
		newItemData : null,
		imagesToUse : "MetaData",
		
		Timeout : null,
		
		images : [],
		overlay : [],
        imageIdx : 0,		// Image index
        effectIdx : 0,		// Transition effect index
        effectNames : ['FADE1', 'FADE2', 'BLIND', 'SPIRAL','CHECKER', 'LINEAR', 'STAIRS', 'WIPE', 'RANDOM'],
}

GuiImagePlayer_Screensaver.kill = function() {
	if (this.ImageViewer != null) {
		this.ImageViewer.destroy();	
	}
}

GuiImagePlayer_Screensaver.start = function() {
	this.imagesToUse = File.getUserProperty("ScreensaverImages");
	alert(this.imagesToUse);
	this.images = []
	this.overlay = []
	this.imageIdx = 0
	//alert("imagestouse - " + this.imagesToUse)
	//Update Main.js isScreensaverRunning - Sets to True
	Main.setIsScreensaverRunning();
	
	//Hide helper page if shown
	GuiHelper.keyDown();
	
	//Hide the trailer PiP window if shown
	if (Main.getModelYear() != "D") {
		sf.service.VideoPlayer.stop();
		sf.service.VideoPlayer.hide();
	}
	
	Support.styleSubtitles("GuiImagePlayer_ScreensaverOverlay")
	
	if (this.imagesToUse == "Media") {
		var randomImageURL = Server.getItemTypeURL("&SortBy=Random&MediaTypes=Photo&Recursive=true&CollapseBoxSetItems=false&Limit=1000");
		var randomImageData = Server.getContent(randomImageURL);
		if (randomImageData == null) { return; }
		
		for (var index = 0; index < randomImageData.Items.length; index++) {
			//Only add images with higher res
			if (randomImageData.Items[index].Width >= 1920 && randomImageData.Items[index].Height >= 1080){
				var imgsrc = Server.getScreenSaverImageURL(randomImageData.Items[index].Id,"Primary",1920,1080);
				this.images.push(imgsrc);
				if (randomImageData.Items[index].PremiereDate !== undefined) {
					this.overlay.push(Support.formatDateTime(randomImageData.Items[index].PremiereDate,1))
				} else {
					this.overlay.push(""); //Need to push something to keep indexes matched up!
				}
				
			}
		}
	} else {
		var randomImageURL = Server.getItemTypeURL("&SortBy=Random&IncludeItemTypes=Series,Movie&Recursive=true&CollapseBoxSetItems=false&Limit=1000");
		var randomImageData = Server.getContent(randomImageURL);
		if (randomImageData == null) { return; }
			
		for (var index = 0; index < randomImageData.Items.length; index++) {
			if (randomImageData.Items[index].BackdropImageTags.length > 0) {
				var imgsrc = Server.getScreenSaverImageURL(randomImageData.Items[index ].Id,"Backdrop",1920,1080);
				this.images.push(imgsrc);
				if (randomImageData.Items[index].Name !== undefined) {
					this.overlay.push(randomImageData.Items[index].Name)
				} else {
					this.overlay.push(""); //Need to push something to keep indexes matched up!
				}
				
			}
		}		
	}

	//Hide Page Contents
	document.getElementById("everything").style.visibility="hidden";

	//Initialte new instance, set Frame Area & Set Notifications
	this.ImageViewer = new CImageViewer('Common ImageViewer');
	this.ImageViewer.setFrameArea(0, 0, Main.width, Main.height); 
	
	this.ImageViewer.setOnNetworkError(function() {
		GuiNotifications.setNotification("Network Error");
	});
	
	this.ImageViewer.setOnRenderError(function() {
		GuiNotifications.setNotification("Render Error");
	});
	
	//Start Slide Show
	this.ImageViewer.show();
	this.setSlideshowMode();
}

// Set Slideshow mode
// You can use Transtion effect
GuiImagePlayer_Screensaver.setSlideshowMode = function() {
	this.ImageViewer.startSlideshow();
	this.ImageViewer.setOnBufferingComplete(function(){
		GuiImagePlayer_Screensaver.ImageViewer.showNow();
		});
	this.ImageViewer.setOnRenderingComplete(function(){
		clearTimeout(GuiImagePlayer_Screensaver.Timeout);
		if (GuiImagePlayer_Screensaver.imagesToUse == "Media") {
			Support.setImagePlayerOverlay(GuiImagePlayer_Screensaver.overlay[GuiImagePlayer_Screensaver.imageIdx], GuiImagePlayer.overlayFormat);
		} else {
			Support.setImagePlayerOverlay(GuiImagePlayer_Screensaver.overlay[GuiImagePlayer_Screensaver.imageIdx], 2);
		} 
		
		GuiImagePlayer_Screensaver.Timeout = setTimeout(function(){
			GuiImagePlayer_Screensaver.imageIdx = GuiImagePlayer_Screensaver.imageIdx+1;
			if (GuiImagePlayer_Screensaver.imageIdx >= GuiImagePlayer_Screensaver.images.length ) {
				GuiImagePlayer_Screensaver.imageIdx = 0;
			}		
			GuiImagePlayer_Screensaver.ImageViewer.prepareNext(GuiImagePlayer_Screensaver.images[GuiImagePlayer_Screensaver.imageIdx], GuiImagePlayer_Screensaver.ImageViewer.Effect.FADE1);
		}, File.getUserProperty("ScreensaverImageTime"));	
    });
	
	this.ImageViewer.stop();
	this.playImage();
}

// Play image - only called once in slideshow!
//SS calls  play -> BufferComplete, then the showNow will call RendComplete which starts timer for next image
GuiImagePlayer_Screensaver.playImage = function() {	
	var url = GuiImagePlayer_Screensaver.images[GuiImagePlayer_Screensaver.imageIdx];
	GuiImagePlayer_Screensaver.ImageViewer.play(url, 1920, 1080);
}

GuiImagePlayer_Screensaver.stopScreensaver = function() {	
	clearTimeout(this.Timeout);
	this.Timeout = null;
	this.images = [];
	this.ImageViewer.endSlideshow();
	this.ImageViewer.hide();
	widgetAPI.blockNavigation(event);
	GuiImagePlayer_Screensaver.kill();
	document.getElementById("GuiImagePlayer_ScreensaverOverlay").innerHTML = "";
	//Show Page Contents
	document.getElementById("everything").style.visibility="";
}