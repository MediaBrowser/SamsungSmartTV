var GuiUsers_Manual = {
	UserData : null,
	selectedItem : 0, //0 = User, 1 = Password
	rememberPassword : false
}

GuiUsers_Manual.start = function() {
	alert("Page Enter : GuiUsers_Manual");
	GuiHelper.setControlButtons(null,null,null,null,"Return");
	
	//Reset Properties
	this.selectedItem = 0;
	this.rememberPassword = false;
	
	document.getElementById("NotificationText").innerHTML = "";
	document.getElementById("Notifications").style.visibility = "hidden";
	
	//Load Data
	var url = Server.getServerAddr() + "/Users/Public?format=json";
	this.UserData = Server.getContent(url);
	if (this.UserData == null) { return; }
	
	//Change Display
	document.getElementById("pageContent").innerHTML = "<div class='GuiPage_NewServer12key'> \
		<p style='padding-bottom:5px'>Username</p> \
		<form><input id='user' style='z-index:10;' type='text' size='40' value=''/></form> \
		<p style='padding-bottom:5px'>Password</p> \
		<form><input id='pass' style='z-index:10;' type='password' size='40' value=''/></form> \
		<br><span id='guiUsers_rempwd'>Remember Password </span> : <span id='guiUsers_rempwdvalue'>" + this.rememberPassword + "</span> \
		</div>";
	
	new GuiUsers_Manual_Input("user");	
}

GuiUsers_Manual.IMEAuthenticate = function(user, password) {
    var authenticateSuccess = Server.Authenticate(null, user, password);		
    if (authenticateSuccess) {   	
    	document.getElementById("NoKeyInput").focus();
    	
    	//Check if this user is already in the DB.
    	var userInFile = false;
    	var fileJson = JSON.parse(File.loadFile()); 
		for (var index = 0; index < fileJson.Servers[File.getServerEntry()].Users.length; index++) {
			if (fileJson.Servers[File.getServerEntry()].Users[index].UserName == user) {
				userInFile = true;
				File.setUserEntry(index);
			}
		}
    	
		//Otherwise add them.
		if (userInFile == false) {
			alert("Need to add the user to the DB");
			//Add Username & Password to DB - Save password only if rememberPassword = true
			if (this.rememberPassword == true) {
				File.addUser(Server.UserID,user,password,this.rememberPassword);
			} else {
				File.addUser(Server.UserID,user,"",this.rememberPassword);
			}
		}
			
    	//Change Focus and call function in GuiMain to initiate the page!
    	GuiMainMenu.start();
    } else {
    			
    	alert ("Authentication Failed");		
    	document.getElementById("user").focus();
    	GuiNotifications.setNotification("Wrong username, bad password or network error.","Logon Error",true);
    }     		
}

//////////////////////////////////////////////////////////////////
//  Input method for entering user password.                    //
//////////////////////////////////////////////////////////////////
var GuiUsers_Manual_Input  = function(id) {   
    var imeReady = function(imeObject) {    	
    	installFocusKeyCallbacks(); 
    	document.getElementById(id).focus();
    }
    
    var ime = new IMEShell(id, imeReady,'num');
    ime.setKeypadPos(680,90);
/*	ime.setKeypadChangeFunc('qwerty',onSwitchToQwerty);
	ime.setKeypadChangeFunc('12key',onSwitchTo12key);
	
	function onSwitchToQwerty(arg){
		alert("IME selected:"+arg);
		document.getElementById("pageContent").className = "GuiPage_NewServerQwerty";
	}
	
	function onSwitchTo12key(arg){
		alert("IME selected:"+arg);
		document.getElementById("pageContent").className = "GuiPage_NewServer12key";
	}*/
           
    var installFocusKeyCallbacks = function () {
        ime.setKeyFunc(tvKey.KEY_ENTER, function (keyCode) {
            alert("Enter key pressed");  
            if (GuiUsers_Manual.selectedItem == 0) {
            	//Set IME to Password field
            	GuiUsers_Manual.selectedItem++;
            	new GuiUsers_Manual_Input("pass");
            	document.getElementById("pass").focus;
            } else {
            	//Process Login Here
            	var usr = document.getElementById("user").value;
            	var pwd = document.getElementById("pass").value;
            	GuiUsers_Manual.IMEAuthenticate(usr,pwd);
            }        
        });
        
        ime.setKeyFunc(tvKey.KEY_DOWN, function (keyCode) {
            alert("Down key pressed");  
            if (GuiUsers_Manual.selectedItem == 0) {
            	//Set IME to Password field
            	GuiUsers_Manual.selectedItem++;
            	new GuiUsers_Manual_Input("pass");
            	document.getElementById("pass").focus;
            } else {
            	document.getElementById("guiUsers_rempwd").style.color = "red";
            	document.getElementById("GuiUsers_Manual_Pwd").focus();
            }        
        });
        
        ime.setKeyFunc(tvKey.KEY_UP, function (keyCode) {
            alert("Up key pressed");  
            if (GuiUsers_Manual.selectedItem == 1) {
            	//Set IME to Password field
            	GuiUsers_Manual.selectedItem--;
            	new GuiUsers_Manual_Input("user");
            	document.getElementById("user").focus;
            }        
        });
        
        //Keycode to abort login from password screen      
        ime.setKeyFunc(tvKey.KEY_RETURN, function (keyCode) {
        	widgetAPI.blockNavigation(event);
        	var fileJson = JSON.parse(File.loadFile());    
    	    if (fileJson.Servers.length > 0) {
    	    	document.getElementById("pageContent").focus();
    	    	GuiUsers.start();
    	    }
        });
        
        ime.setKeyFunc(tvKey.KEY_EXIT, function (keyCode) {
        	document.getElementById("NoKeyInput").focus();
        	widgetAPI.sendExitEvent();
        });   
    }
};

GuiUsers_Manual.keyDownPassword = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			widgetAPI.sendReturnEvent();
			break;
		case tvKey.KEY_UP:
			if (document.getElementById("guiUsers_rempwd").style.color == "red") {
				document.getElementById("guiUsers_rempwd").style.color = "#f9f9f9";
				document.getElementById("pass").focus();  
			} else {
				this.rememberPassword = (this.rememberPassword == false) ? true : false;
				document.getElementById("guiUsers_rempwdvalue").innerHTML = this.rememberPassword;
			}
			break;	
		case tvKey.KEY_DOWN:
			if (document.getElementById("guiUsers_rempwdvalue").style.color == "red") {
				this.rememberPassword = (this.rememberPassword == false) ? true : false;
				document.getElementById("guiUsers_rempwdvalue").innerHTML = this.rememberPassword;
			}
			break;	
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			if (document.getElementById("guiUsers_rempwd").style.color == "red") {
				document.getElementById("guiUsers_rempwd").style.color = "green";
				document.getElementById("guiUsers_rempwdvalue").style.color = "red";
			}
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			if (document.getElementById("guiUsers_rempwdvalue").style.color == "red") {
				document.getElementById("guiUsers_rempwd").style.color = "red";
				document.getElementById("guiUsers_rempwdvalue").style.color = "#f9f9f9";
			}
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			if (document.getElementById("guiUsers_rempwdvalue").style.color == "red") {
				document.getElementById("guiUsers_rempwd").style.color = "red";
				document.getElementById("guiUsers_rempwdvalue").style.color = "#f9f9f9";
			} else {
				document.getElementById("guiUsers_rempwd").style.color = "green";
				document.getElementById("guiUsers_rempwdvalue").style.color = "red";
			}
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
		default:
			alert("Unhandled key");
			break;
	}
};