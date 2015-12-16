var ServerVersion = {
		ServerInfo : null
}

ServerVersion.start = function() {
	document.getElementById("pageContent").innerHTML = "<div class='padding60' style='text-align:center'> \
		<p style='padding-bottom:5px;'>The Samsung app requires a later version of the Server - Please update it and restart the app</p>";
	
	document.getElementById("ServerVersion").focus();
}

ServerVersion.checkServerVersion = function() {
	var url = Server.getCustomURL("/System/Info/Public?format=json");
	this.ServerInfo = Server.getContent(url);
	if (this.ServerInfo == null) { return; }
	
	var requiredServerVersion = Main.getRequiredServerVersion();
	var currentServerVersion = this.ServerInfo.Version;
	
	if (currentServerVersion >= requiredServerVersion) {
		return true;
	} else {
		return false;
	}
}

ServerVersion.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		default:
			widgetAPI.sendExitEvent();
			break;
	}
}