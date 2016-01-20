var GuiNotifications = {
		timeout : null
}

GuiNotifications.setNotification = function (Message, Title,alterHeight) {	
	//Clear any existing message
	clearInterval(this.timeout);
	document.getElementById("Notifications").style.visibility = "hidden";
	document.getElementById("NotificationText").innerHTML = "";
	
	//Code to move based on screen (fix for GuiPage_IP)
	if (alterHeight == true) {
		document.getElementById("Notifications").style.top = "620px";
		document.getElementById("Notifications").style.left = "430px";
	} else {
		document.getElementById("Notifications").style.top = "390px";
		document.getElementById("Notifications").style.left = "710px";
	}
	
/*	if (Message.length > 30) {
		var brpoint = 30;
		newmessage = "";
		while (brpoint < Message.length) {
			temphold = Message.substring((brpoint-30),brpoint+4);
			if (temphold.indexOf("<br>") == -1) {
				newmessage += Message.substring((brpoint-30),brpoint) + "<br>";		
			} else {
				newmessage += Message.substring((brpoint-30),brpoint);
			}
			alert(newmessage);
			brpoint = brpoint + 30;
		}
		newmessage += Message.substring((brpoint-30), Message.length);
		Message = newmessage;
	}*/
	
	document.getElementById("NotificationText").innerHTML = "<p class=notificationTitle>" + Title + "</p><p><br>"+Message+"</p>";
	document.getElementById("Notifications").style.visibility ="";
	
	if (Title != "Test Mode") {
		this.timeout = setTimeout(function(){
			document.getElementById("Notifications").style.visibility = "hidden";
			document.getElementById("NotificationText").innerHTML = "";
		}, 6000);
	}
}