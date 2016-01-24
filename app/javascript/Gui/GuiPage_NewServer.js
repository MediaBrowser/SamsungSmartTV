var GuiPage_NewServer = {
	elementIds : [ "1","2","3","4","port","host"],
	inputs : [ null,null,null,null,null],
	ready : [ false,false,false,false,false],

}

GuiPage_NewServer.start = function() {
	alert("Page Enter : GuiPage_NewServer");
	GuiHelper.setControlButtons(null,null,null,null,"Return");
	Support.fadeImage("images/bg1.jpg");
	
	//Insert html into page
	document.getElementById("pageContent").innerHTML = "<div class='GuiPage_NewServer12key'> \
		<p style='padding-bottom:5px;'>Enter the IP address & port number of your Emby server. <br>(You can leave the port blank for 8096)</p> \
		<form><input id='1' type='text' size='5'  maxlength='3' value=''/>. \
		<input id='2' type='text' size='5'  maxlength='3' value=''/>. \
		<input id='3' type='text' size='5'  maxlength='3' value=''/>. \
		<input id='4' type='text' size='5'  maxlength='3' value=''/>: \
		<input id='port' type='text' size='8'  maxlength='5'/></form> \ \
		<p style='padding-top:10px;padding-bottom:5px'>OR</p> \
		<p style='padding-bottom:5px'>Enter your server hostname here without http:// and <br>including : and port number.</p> \
		<form><input id='host' style='z-index:10;' type='text' size='45' value=''/></form> \
		</div>";
	
	//Set Backdrop
	if (document.getElementById("splashscreen").style.visibility != "hidden") {
		document.getElementById("splashscreen").style.visibility="hidden";
	}

	//Prepare all input elements for IME
	GuiPage_NewServer.createInputObjects();
	pluginAPI.registIMEKey();
}

//Prepare all input elements for IME on Load!
GuiPage_NewServer.createInputObjects = function() {
	var previousIndex = 0;
	var nextIndex = 0;
    for (var index in this.elementIds) {
    	previousIndex = index - 1;
        if (previousIndex < 0) {
            previousIndex = GuiPage_NewServer.inputs.length - 1;
        }
        
        nextIndex = (previousIndex + 2) % GuiPage_NewServer.inputs.length;
        GuiPage_NewServer.inputs[index] = new GuiPage_NewServer_Input(this.elementIds[index],this.elementIds[previousIndex], this.elementIds[nextIndex]);
    }
}

//Function to check if IME is ready, and when so sets focus on first element in array
GuiPage_NewServer.ready = function(id) {
    var ready = true;
 
    for (var i in GuiPage_NewServer.elementIds) {
        if (GuiPage_NewServer.elementIds[i] == id) {
        	GuiPage_NewServer.ready[i] = true;
        }
        
        if (GuiPage_NewServer.ready[i] == false) {
            ready = false;
        }
    }
   
    if (ready) {
        document.getElementById(GuiPage_NewServer.elementIds[0]).focus();
    }
}

//Function to delete all the contents of the boxes
GuiPage_NewServer.deleteAllBoxes = function(currentId) {
	for (var index = 0;index < GuiPage_NewServer.elementIds.length;index++) {
		document.getElementById(GuiPage_NewServer.elementIds[index]).value=""; 
	}
}

//IME Key Handler
var GuiPage_NewServer_Input  = function(id,previousId, nextId) {   
    var imeReady = function(imeObject) {
    	installFocusKeyCallbacks();   
        GuiPage_NewServer.ready(id);
    }
    
    var ime = new IMEShell(id, imeReady,'en');
    ime.setKeypadPos(1300,90);
    ime.setMode('_num');
    
    var previousElement = document.getElementById(previousId);
    var nextElement = document.getElementById(nextId);
    
    var installFocusKeyCallbacks = function () {
        ime.setKeyFunc(tvKey.KEY_ENTER, function (keyCode) {
            alert("Enter key pressed");
            
            GuiNotifications.setNotification("Please Wait","Checking Details",true);
                                  
            //Get content from 4 boxes
            var IP1 = document.getElementById('1').value;
            var IP2 = document.getElementById('2').value;
            var IP3 = document.getElementById('3').value;
            var IP4 = document.getElementById('4').value;
            
            var host = document.getElementById('host').value;
            
            if (IP1 == "" || IP2 == "" || IP3 == "" || IP4 == "" ) {
            	//Check if host is empty
            	if (host == "") {
            		//not valid
                	GuiNotifications.setNotification("Please re-enter your server details.","Incorrect Details",true);
            	} else {
            		document.getElementById("pageContent").focus();                                   
                    //Timeout required to allow notification command above to be displayed              
                    setTimeout(function(){Server.testConnectionSettings(host,false);}, 1000);
            	}
            } else {	
            	var Port = document.getElementById('port').value;
                if (Port == "") {
                	Port = "8096";
                }
                
                var ip = IP1 + '.' +  IP2 + '.' +  IP3 + '.' +  IP4 + ':' + Port;
                document.getElementById("pageContent").focus();                                   
                //Timeout required to allow notification command above to be displayed              
                setTimeout(function(){Server.testConnectionSettings(ip,false);}, 1000);
                
            }       
        });
        ime.setKeyFunc(tvKey.KEY_LEFT, function (keyCode) {
            previousElement.focus();
            return false;
        });
        ime.setKeyFunc(tvKey.KEY_RIGHT, function (keyCode) {
            nextElement.focus();
            return false;
        });
        ime.setKeyFunc(tvKey.KEY_UP, function (keyCode) {
        	document.getElementById("1").focus();
            return false;
        });
        ime.setKeyFunc(tvKey.KEY_DOWN, function (keyCode) {
        	document.getElementById("host").focus();
            return false;
        });
        ime.setKeyFunc(tvKey.KEY_BLUE, function (keyCode) {
        	ime.setString(""); //Clears the currently focused Input - REQUIRED
        	GuiPage_NewServer.deleteAllBoxes();
            return false;
        });
        ime.setKeyFunc(tvKey.KEY_RETURN, function (keyCode) {
        	widgetAPI.blockNavigation(event);
        	var fileJson = JSON.parse(File.loadFile());    
    	    if (fileJson.Servers.length > 0) {
    	    	document.getElementById("pageContent").focus();  
    	    	GuiPage_Servers.start();
    	    }
    	    return false;
        });
        ime.setKeyFunc(tvKey.KEY_EXIT, function (keyCode) {
        	widgetAPI.sendExitEvent(); 	
        	return false;
        }); 
    }   
}