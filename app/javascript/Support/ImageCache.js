var ImageCache = {
};

ImageCache.deleteCache = function() {
	var fileSystemObj = new FileSystem();
	fileSystemObj.deleteCommonFile(curWidget.id + '/cache.json');
}

ImageCache.loadFile = function() {
	var fileSystemObj = new FileSystem();
	
	var bValid = fileSystemObj.isValidCommonPath(curWidget.id); 
	if (!bValid) {  
		fileSystemObj.createCommonDir(curWidget.id); 
		var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/cache.json', 'w');
		var contentToWrite = '{"Images":[]}';
		fileObj.writeLine(contentToWrite); 
		fileSystemObj.closeCommonFile(fileObj); 
	}
	
	var openRead = fileSystemObj.openCommonFile(curWidget.id + '/cache.json', 'r');
	if (!openRead) {
		fileSystemObj.createCommonDir(curWidget.id); 
		var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/cache.json', 'w');
		var contentToWrite = '{"Images":[]}';
		fileObj.writeLine(contentToWrite); 
		fileSystemObj.closeCommonFile(fileObj); 
		return contentToWrite;
	} else {
		var fileContents = openRead.readAll();
		fileSystemObj.closeCommonFile(openRead);	
		return fileContents;
	}
};

ImageCache.writeAll = function (toWrite) {
	var fileSystemObj = new FileSystem();
	var openWrite = fileSystemObj.openCommonFile(curWidget.id + '/cache.json', 'w');
	if (openWrite) {
		openWrite.writeLine(JSON.stringify(toWrite)); 
		fileSystemObj.closeCommonFile(openWrite); 
	}
}
ImageCache.empty = function () {
	var fileSystemObj = new FileSystem();
	var openWrite = fileSystemObj.openCommonFile(curWidget.id + '/cache.json', 'w');
	if (openWrite) {
		fileSystemObj.closeCommonFile(openWrite); 
	}
}