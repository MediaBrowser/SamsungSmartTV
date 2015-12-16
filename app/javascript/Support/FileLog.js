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

FileLog.write = function (toWrite) {
	alert (toWrite)
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