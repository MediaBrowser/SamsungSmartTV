var FileLog = {
};

FileLog.deleteFile = function() {
	var fileSystemObj = new FileSystem();
	fileSystemObj.deleteCommonFile(curWidget.id + '/MB3_Log.txt');
}

FileLog.loadFile = function(returnContents) {
	var fileSystemObj = new FileSystem();
	
	var bValid = fileSystemObj.isValidCommonPath(curWidget.id); 
	if (!bValid) {  
		fileSystemObj.createCommonDir(curWidget.id); 
		var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/MB3_Log.txt', 'a+');
		fileSystemObj.closeCommonFile(fileObj); 
	}
	
	var openRead = fileSystemObj.openCommonFile(curWidget.id + '/MB3_Log.txt', 'r');
	if (!openRead) {
		fileSystemObj.createCommonDir(curWidget.id); 
		var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/MB3_Log.txt', 'a+');
		fileSystemObj.closeCommonFile(fileObj); 
		return null;
	} else {
		var strLine = "";
		var arrayFile = new Array();
		while ((strLine=openRead.readLine())) {
			arrayFile.push(strLine);
		}
		fileSystemObj.closeCommonFile(openRead);	
		if (returnContents) {
			return arrayFile;
		} else {
			return null;
		}		
	}
};

FileLog.write = function (toWrite,noDate) {
	
	var writeDate = (noDate == undefined) ? true : false;
	toWrite = (writeDate == true) ? FileLog.getTimeStamp() + " " + toWrite : toWrite;
	var fileSystemObj = new FileSystem();
	var openWrite = fileSystemObj.openCommonFile(curWidget.id + '/MB3_Log.txt', 'a+');
	if (openWrite) {
		openWrite.writeLine(toWrite); 
		fileSystemObj.closeCommonFile(openWrite); 
	}
}

FileLog.empty = function () {
	var fileSystemObj = new FileSystem();
	var openWrite = fileSystemObj.openCommonFile(curWidget.id + '/MB3_Log.txt', 'w');
	if (openWrite) {
		fileSystemObj.closeCommonFile(openWrite); 
	}
}

FileLog.getTimeStamp = function () {
	var date = new Date();
	var day = (date.getDate() + 1 < 10) ? "0" + (date.getDate() + 1) : date.getDate() + 1;
	var month = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var year = date.getFullYear();
	
	var h=date.getHours();
	var offset = File.getTVProperty("ClockOffset");
	h = h+offset;
	if (h<0) {h = h + 24;};
	if (h>23){h = h - 24;};
	if (h<10) {h = "0" + h;};
	var m=date.getMinutes(); 
	if (m<10) {m = "0" + m;};
	return day + "/" + month + "/" + year + " " + h+':'+m;
}