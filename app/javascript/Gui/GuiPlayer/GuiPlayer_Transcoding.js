/*
Render Error 1 :  Unsupported container
Render Error 2 :  Unsupported video codec
Render Error 3 :  Unsupported audio codec
Render Error 4 :  Unsupported video resolution
Render Error 6 :  Corrupt Stream
*/

var GuiPlayer_Transcoding = {		
		//File Information
		MediaSource : null,
		videoIndex : 0,
		audioIndex : 0,
	
		//Bitrate check
		bitRateToUse : null,
		
		//Boolean that conclude if all Video or All Audio elements will play without transcode
		isVideo : true,
		isAudio : true,
		
		//All Video Elements
		isCodec : null,
		isResolution : null,
		isContainer : null,
		isBitRate : null,
		isLevel : null,	
		isFrameRate : null,
		isProfile : null,
		
		//All Audio elements
		isAudioCodec : null,
		isAudioContainer : null,
		isAudioChannel : null
}

//--------------------------------------------------------------------------------------
GuiPlayer_Transcoding.start = function(showId, MediaSource,MediaSourceIndex, videoIndex, audioIndex, isFirstAudioIndex, subtitleIndex,forceVideoTranscode) {	
	//Set Class Vars
	this.MediaSource = MediaSource;
	this.videoIndex = videoIndex;
	this.audioIndex = audioIndex;
	
	//Check Video & Audio Compatibility
	this.checkCodec(videoIndex);
	this.checkAudioCodec(audioIndex);

	var streamparams = "";
	var transcodeStatus = "";

	//If audiocheck failed convert to AAC OR AC3 depending on setting
	//If audiocheck ok convert to AAC or dont convert & leave as original codec

	var fileAudioCodec = this.MediaSource.MediaStreams[this.audioIndex].Codec.toLowerCase();
	var streamAudioCodec = "aac"; //Default, supported by all tv's (?)
	var convertAACtoDolby = false;
	if (File.getTVProperty("Dolby") && File.getTVProperty("AACtoDolby") && fileAudioCodec == "aac") {
		convertAACtoDolby = true;
	}
	if (this.isAudio == false) {
	   streamAudioCodec = (File.getTVProperty("Dolby") && File.getTVProperty("AACtoDolby")) ? "ac3" : "aac";
	} else {
	   streamAudioCodec = (File.getTVProperty("Dolby") && File.getTVProperty("AACtoDolby") && fileAudioCodec == "aac") ? "ac3" : fileAudioCodec;
	}
	
	if (forceVideoTranscode !== undefined && forceVideoTranscode == true) {
		FileLog.write("Forcing Video Transcoding");
		this.isVideo = false;
	}

	if (this.isVideo && this.isAudio && convertAACtoDolby == false) {
		if (isFirstAudioIndex == true) {
			transcodeStatus = "Direct Play";
			streamparams = '/Stream.'+this.MediaSource.Container+'?static=true&MediaSourceId='+this.MediaSource.Id + '&api_key=' + Server.getAuthToken();
		} else {			
			transcodeStatus = "Stream Copy - Audio Not First Track";
			streamparams = '/Stream.ts?VideoStreamIndex='+this.videoIndex+'&AudioStreamIndex='+this.audioIndex+'&VideoCodec=copy&AudioCodec=copy&MediaSourceId='+this.MediaSource.Id + '&api_key=' + Server.getAuthToken();
		}	
	} else if (this.isVideo == false) {
		transcodeStatus = "Transcoding Audio & Video";	
		streamparams = '/Stream.ts?VideoStreamIndex='+this.videoIndex+'&AudioStreamIndex='+this.audioIndex+'&VideoCodec=h264&Profile=high&Level=41&MaxVideoBitDepth=8&MaxWidth=1280&VideoBitrate='+this.bitRateToUse+'&AudioCodec=' + streamAudioCodec +'&AudioBitrate=360000&MaxAudioChannels=6&MediaSourceId='+this.MediaSource.Id + '&api_key=' + Server.getAuthToken();	
	} else if (this.isVideo == true && (this.isAudio == false || convertAACtoDolby == true)) {
		transcodeStatus = "Transcoding Audio";	
		streamparams = '/Stream.ts?VideoStreamIndex='+this.videoIndex+'&AudioStreamIndex='+this.audioIndex+'&VideoCodec=copy&AudioCodec='+ streamAudioCodec +'&audioBitrate=360000&MaxAudioChannels=6&MediaSourceId='+this.MediaSource.Id + '&api_key=' + Server.getAuthToken();
	}
	var url = Server.getServerAddr() + '/Videos/' + showId + streamparams + '&DeviceId='+Server.getDeviceID();
	FileLog.write("Video : Transcode Status : " + transcodeStatus);
	FileLog.write("Video : URL : " + url);

	//Return results to Versions
	//MediaSourceId,Url,transcodeStatus,videoIndex,audioIndex
	return [MediaSourceIndex,url,transcodeStatus,videoIndex,audioIndex,subtitleIndex];	
}

GuiPlayer_Transcoding.checkCodec = function() {
	var codec = this.MediaSource.MediaStreams[this.videoIndex].Codec.toLowerCase();
	var codecParams = GuiPlayer_TranscodeParams.getParameters(codec,this.MediaSource.MediaStreams[this.videoIndex].Width);
	
	this.isCodec = codecParams[0];
	this.isContainer = this.checkContainer(codecParams[1]);
	this.isResolution = this.checkResolution(codecParams[2]);
	this.isBitRate = this.checkBitRate(codecParams[3]);
	this.isFrameRate = this.checkFrameRate(codecParams[4]);
	this.isLevel = this.checkLevel(codecParams[5]);
	this.isProfile = this.checkProfile(codecParams[6]);
	
	//Results
	FileLog.write("Video : Video File Analysis Results");
	FileLog.write("Video : Codec Compatibility: " + this.isCodec + " : " + this.MediaSource.MediaStreams[this.videoIndex].Codec);
	FileLog.write("Video : Container Compatibility: " + this.isContainer + " : " + this.MediaSource.Container);
	FileLog.write("Video : Resolution Compatibility: " + this.isResolution + " : " +this.MediaSource.MediaStreams[this.videoIndex].Width + "x" + this.MediaSource.MediaStreams[this.videoIndex].Height);
	FileLog.write("Video : BitRate Compatibility: " + this.isBitRate + " : " + this.MediaSource.MediaStreams[this.videoIndex].BitRate + " : " + this.bitRateToUse);
	FileLog.write("Video : FrameRate Compatibility: " + this.isFrameRate + " : " + this.MediaSource.MediaStreams[this.videoIndex].AverageFrameRate);
	FileLog.write("Video : Level Compatibility: " + this.isLevel + " : " + this.MediaSource.MediaStreams[this.videoIndex].Level);
	FileLog.write("Video : Profile Compatibility: " + this.isProfile + " : " + this.MediaSource.MediaStreams[this.videoIndex].Profile);
	
	//Put it all together
	if (this.isCodec && this.isContainer && this.isResolution && this.isBitRate && this.isFrameRate && this.isLevel && this.isProfile) { // 
		this.isVideo = true;
	} else {
		this.isVideo = false;
	}
}

GuiPlayer_Transcoding.checkAudioCodec = function() {
	var audiocodec = this.MediaSource.MediaStreams[this.audioIndex].Codec.toLowerCase();
	var audiocodecParams = GuiPlayer_TranscodeParams.getAudioParameters(audiocodec);
	
	this.isAudioCodec = audiocodecParams[0];
	this.isAudioContainer = this.checkContainer(audiocodecParams[1]);
	this.isAudioChannel = this.checkAudioChannels(audiocodecParams[2]);		
	
	//Results
	FileLog.write("Video : Audio File Analysis Results");
	FileLog.write("Video : Codec Compatibility: " + this.isAudioCodec + " : " + this.MediaSource.MediaStreams[this.audioIndex].Codec);
	FileLog.write("Video : Container Compatibility: " + this.isAudioContainer + " : " + this.MediaSource.Container);
	FileLog.write("Video : Channel Compatibility: " + this.isAudioChannel + " : " + this.MediaSource.MediaStreams[this.audioIndex].Channels);
	
	//Put it all together
	if (this.isAudioCodec && this.isAudioChannel) {
		this.isAudio = true;
	} else {
		this.isAudio = false;
	}		
}

GuiPlayer_Transcoding.checkAudioChannels = function(maxChannels) {
	if (maxChannels == null) {
		return false;
	} else {
		if (this.MediaSource.MediaStreams[this.audioIndex].Channels <= maxChannels) {
			return true;
		} else {
			return false;
		}
	}
}

GuiPlayer_Transcoding.checkResolution = function(maxResolution) {
	if (maxResolution == null) {
		return false;
	} else if (this.MediaSource.MediaStreams[this.videoIndex].Width <= maxResolution[0] && this.MediaSource.MediaStreams[this.videoIndex].Height <= maxResolution[1]) {
		return true;
	} else {
		return false;
	}
}

GuiPlayer_Transcoding.checkContainer = function(supportedContainers) {
	if (supportedContainers == null) {
		return false
	} else {
		var isContainer = false;
		for (var index = 0; index < supportedContainers.length; index++) {
			if (this.MediaSource.Container.toLowerCase() == supportedContainers[index]) {
				isContainer =  true;
				break;
			}
		}
		return isContainer;
	}
}

GuiPlayer_Transcoding.checkBitRate = function(maxBitRate) {
	//Get Bitrate from Settings File
	var maxBitRateSetting = File.getTVProperty("Bitrate")*1024*1024;
	if (this.MediaSource.MediaStreams[this.videoIndex].BitRate > maxBitRateSetting) {
		this.bitRateToUse = maxBitRateSetting;
		return false;
	} else {
		this.bitRateToUse = this.MediaSource.MediaStreams[this.videoIndex].BitRate;
		return true;
	}
}

GuiPlayer_Transcoding.checkFrameRate = function(maxFrameRate) {
	if (maxFrameRate == null) {
		return false;
	} else if (this.MediaSource.MediaStreams[this.videoIndex].AverageFrameRate <= maxFrameRate) {
		return true;
	} else {
		return false;
	}
}

GuiPlayer_Transcoding.checkLevel = function(maxLevel) {
	var level = this.MediaSource.MediaStreams[this.videoIndex].Level;
	if (maxLevel == null) {
		return false;
	} if (maxLevel == true) {
		return true;
	} else {
		var level = this.MediaSource.MediaStreams[this.videoIndex].Level;
		level = (level < 10) ? level * 10 : level; //If only 1 long, multiply by 10 to make it correct!
		if (level <= maxLevel && level >= 0) {
			return true;
		} else {
			return false;
		}
	}
}

GuiPlayer_Transcoding.checkProfile = function(supportedProfiles) {
	if (supportedProfiles == null) {
		return false;
	} if (supportedProfiles == true) {
		return true;
	} else {
		var profile = false;
		for (var index = 0; index < supportedProfiles.length; index++) {
			if (this.MediaSource.MediaStreams[this.videoIndex].Profile == supportedProfiles[index]) {
				profile = true;
				break;
			}
		}
		return profile;
	}
}