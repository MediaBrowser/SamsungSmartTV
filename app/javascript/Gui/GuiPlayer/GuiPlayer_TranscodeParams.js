var GuiPlayer_TranscodeParams = {
		codec : null,
		container : null,
		resolution : null,
		bitrate : null,
		framerate : null,
		level : null,
		profile : null,
		audiocodec : null,
		audiocontainer : null,
		audiochannels : null
} 

// Special Thanks to gbone8106 for providing the H series Transcode Settings!


GuiPlayer_TranscodeParams.getParameters = function(codec,videoWidth) {
	alert("videoWidth "+videoWidth);
	switch (Main.getModelYear()) {
        case "H":
    		switch (codec) {
    		case "mpeg2video":
    			this.codec = true;
    			this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    			this.resolution = [1920,1080];
    			this.bitrate = 30720000;
    			this.framerate = 30;
    			this.level = true;
    			this.profile = true;
    			break;
    		case "mpeg4":
    			this.codec = true;
    			this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    			this.resolution = [1920,1080];
    			this.bitrate = 30720000;
    			if (videoWidth > 720){
    				this.framerate = 30;
    			} else {
    				this.framerate = 60;
    			}
    			this.level = true;
    			this.profile = true;
    			break;
    		case "h264":
    			this.codec = true;
    			this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    			this.resolution = [1920,1080];
    			this.bitrate = 50720000;
    			this.framerate = 30;
    			this.level = 41;
    			this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
    			break;
    	    case "hevc":    	    
    	    	this.codec = true;
    	    	this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    	    	this.resolution = [1920,1080];
    	    	this.bitrate = 50720000;
    	    	this.framerate = 30;
    	    	this.level = 120;			//  Level 4  (HEVC is x30 not x10 like h264)
    	    	this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
    	    	break;			
    	    case "h265":
    	    	this.codec = true;
    	    	this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    	    	this.resolution = [1920,1080];
    	    	this.bitrate = 50720000;
    	    	this.framerate = 30;
    	    	this.level = 51;
    	    	this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
    	    	break;
    	    case "mvc":	
    	    	this.codec = true;
    	    	this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    	    	this.resolution = [1920,1080];
    	    	this.bitrate = 60720000;
    	    	this.framerate = 30;
    	    	this.level = 41;
    	    	this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
    	    	break;
    		case "wmv2":
    			this.codec = true;
    			this.container = ["asf"];
    			this.resolution = [1920,1080];
    			this.resolution = 25600000;
    			this.framerate = 30;
    			this.level = true;
    			this.profile = true;
    			break;
    		case "wmv3":
    			this.codec = true;
    			this.container = ["asf"];
    			this.resolution = [1920,1080];
    			this.resolution = 25600000;
    			this.framerate = 30;
    			this.level = true;
    			this.profile = true;
    			break;
    		case "vc1":	
    			this.codec = true;
    			this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
    			this.resolution = [1920,1080];
    			this.bitrate = 30720000;
    			this.framerate = 30;
    			this.level = true;
    			this.profile = true;
    			break;
    		default:
    			this.codec = null;
    			this.container = null;
    			this.resolution = null;
    			this.bitrate = 50720000;
    			this.framerate = null;
    			this.level = null;
    			this.profile = null;
    			break;
    		}
    		break;	
        case "F":
        case "B":
    		switch (codec) {
			case "mpeg2video":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "mpeg4":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "h264":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1088];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = 41;
				this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
				break;
		    case "mvc":	
		    	this.codec = true;
		    	this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
		    	this.resolution = [1920,1080];
		    	this.bitrate = 62914560;
		    	this.framerate = 30;
		    	this.level = 41;
		    	this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
		    	break;
			case "wmv2":
				this.codec = true;
				this.container = ["asf"];
				this.resolution = [1920,1080];
				this.resolution = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "wmv3":
				this.codec = true;
				this.container = ["asf"];
				this.resolution = [1920,1080];
				this.resolution = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "vc1":	
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			default:
				this.codec = null;
				this.container = null;
				this.resolution = null;
				this.bitrate = 50720000;
				this.framerate = null;
				this.level = null;
				this.profile = null;
				break;
			}
			break;	
        case "E":
		switch (codec) {
			case "mpeg2video":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "mpeg4":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "h264":
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = 41;
				this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
				break;
		    case "mvc":	
		    	this.codec = true;
		    	this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
		    	this.resolution = [1920,1080];
		    	this.bitrate = 41943040;
		    	this.framerate = 30;
		    	this.level = 41;
		    	this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
		    	break;
			case "wmv2":
				this.codec = true;
				this.container = ["asf"];
				this.resolution = [1920,1080];
				this.resolution = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "wmv3":
				this.codec = true;
				this.container = ["asf"];
				this.resolution = [1920,1080];
				this.resolution = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			case "vc1":	
				this.codec = true;
				this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx","wmv"];
				this.resolution = [1920,1080];
				this.bitrate = 30720000;
				this.framerate = 30;
				this.level = true;
				this.profile = true;
				break;
			default:
				this.codec = null;
				this.container = null;
				this.resolution = null;
				this.bitrate = 50720000;
				this.framerate = null;
				this.level = null;
				this.profile = null;
				break;
			}
			break;	
	case "D":
	default:	
		switch (codec) {
		case "mpeg2video":
			this.codec = true;
			this.container = ["mpg","mkv","mpeg","vro","vob","ts"];
			this.resolution = [1920,1080];
			this.bitrate = 30720000;
			this.framerate = 30;
			this.level = true;
			this.profile = true;
			break;
		case "mpeg4":
			this.codec = true;
			this.container = ["asf","avi","mkv","mp4","3gpp"];
			this.resolution = [1920,1080];
			this.bitrate = 8192000;
			this.framerate = 30;
			this.level = true;
			this.profile = true;
			break;
		case "h264":	
			this.codec = true;
			this.container = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v"];
			this.resolution = [1920,1080];
			this.bitrate = 37500000;
			this.framerate = 30;
			this.level = 41;
			this.profile = ["Base","Constrained Baseline","Baseline","Main","High"];
			break;
		case "wmv2":
			this.codec = true;
			this.container = ["asf"];
			this.resolution = [1920,1080];
			this.bitrate = 25600000;
			this.framerate = 30;
			this.level = true;
			this.profile = true;
			break;
		case "wmv3":
			this.codec = true;
			this.container = ["asf"];
			this.resolution = [1920,1080];
			this.bitrate = 25600000;
			this.framerate = 30;
			this.level = true;
			this.profile = true;
			break;
		case "vc1":	
			this.codec = true;
			this.container = ["ts"];
			this.resolution = [1920,1080];
			this.bitrate = 25600000;
			this.framerate = 30;
			this.level = true;
			this.profile = true;
			break;
		default:
			this.codec = null;
			this.container = null;
			this.resolution = null;
			this.bitrate = 37500000;
			this.framerate = null;
			this.level = null;
			this.profile = null;
			break;
		}
		break;
	}
	return [this.codec,this.container,this.resolution,this.bitrate,this.framerate,this.level,this.profile];
}


GuiPlayer_TranscodeParams.getAudioParameters = function(audiocodec) {
	switch (Main.getModelYear()) {
	case "H":
		switch (audiocodec) {
		case "aac":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "ac3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmav2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmapro":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmavoice":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "dca":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 7;
			break;
		case "eac3":	
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "pcm":	
		case "pcm_s16le":	
		case "pcm_s24le":
		case "pcm_s32le":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 2;
			break;	
		default:
			this.audiocodec = false;
			this.audiocontainer = null;
			this.audiochannels = null;
			break;
		}
		break;	
    case "F":
		switch (audiocodec) {
		case "aac":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "ac3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmav2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmapro":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmavoice":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "dca":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 7;
			break;
		case "eac3":	
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "pcm":	
		case "pcm_s16le":	
		case "pcm_s24le":
		case "pcm_s32le":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 2;
			break;	
		default:
			this.audiocodec = false;
			this.audiocontainer = null;
			this.audiochannels = null;
			break;
		}
		break;	
    case "E":
		switch (audiocodec) {
		case "aac":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "mp2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "ac3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmav2":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmapro":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "wmavoice":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "dca":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "eac3":	
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 6;
			break;
		case "pcm":	
		case "pcm_s16le":	
		case "pcm_s24le":
		case "pcm_s32le":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","3gpp","mpg","mpeg","ts","m4v","m2ts","mov","vro","tp","trp","flv","vob","svi","mts","divx"];
			this.audiochannels = 2;
			break;	
		default:
			this.audiocodec = false;
			this.audiocontainer = null;
			this.audiochannels = null;
			break;
		}
		break;	
	case "D":
	default:	
		switch (audiocodec) {
		case "aac":
			this.audiocodec = true;
			this.audiocontainer = ["mkv","mp4","3gpp","mpg","mpeg","ts"];
			this.audiochannels = 6;
			break;
		case "mp3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","mpg","mpeg","vro","vob","ts"];
			this.audiochannels = 6;
			break;
		case "mp2":	
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","mpg","mpeg","vro","vob","ts"];
			this.audiochannels = 6;
			break;
		case "ac3":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mpg","mpeg","vro","vob","ts"];
			this.audiochannels = 6;
			break;
		case "wmav2":
			this.audiocodec = true;
			this.audiocontainer = ["asf"];
			this.audiochannels = 6;
			break;
		case "wmapro":
			this.audiocodec = true;
			this.audiocontainer = ["asf"];
			this.audiochannels = 6;
			break;
		case "wmavoice":
			this.audiocodec = true;
			this.audiocontainer = ["asf"];
			this.audiochannels = 6;
			break;
		case "dca":
			this.audiocodec = true;
			this.audiocontainer = ["avi","mkv"];
			this.audiochannels = 6;
			break;
		case "eac3":	
			this.audiocodec = true;
			this.audiocontainer = ["ts"];
			this.audiochannels = 6;
			break;
		case "pcm":	
		case "pcm_s16le":	
		case "pcm_s24le":
		case "pcm_s32le":
			this.audiocodec = true;
			this.audiocontainer = ["asf","avi","mkv","mp4","mpg","mpeg","vro","vob","ts"];
			this.audiochannels = 2;
			break;		
		default:
			this.audiocodec = false;
			this.audiocontainer = null;
			this.audiochannels = null;
			break;
		}
		break;
	}
	return [this.audiocodec,this.audiocontainer,this.audiochannels];
}