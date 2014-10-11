function setUserInGroup(){
	var sCurrentUser 	= $("#dbgUsername").val();
	var sCurrentGroup 	= $("#dbgGroup").val();
	var sCurrentToken	= $("#dbgToken").val();
//	alert('token in function: '+ sCurrentToken );
//	alert('token in function 2: '+ $("#dbgToken").val());
	var sMethode		= 'loginuser';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey + '&group='+ sCurrentGroup +'&username='+ sCurrentUser +'&token='+ sCurrentToken +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api/api.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    group: sCurrentGroup,
	    username: sCurrentUser,
	    token: sCurrentToken,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
		console.log('gathering data from json');
			$(function(){
				var sResult 	= data.result;
				console.log('result of setRoundProduct is '+ sResult);
		});	    	
	});
}	

function setRoundProduct(sProductName){
	var sCurrentUser 	= $("#dbgUsername").val();
	var sCurrentGroup 	= $("#dbgGroup").val();
	var sCurrentToken	= $("#dbgToken").val();
	var sProductname	= sProductName;
	var sMethode		= 'setProductInRound';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey + '&group='+ sCurrentGroup +'&username='+ sCurrentUser +'&token='+ sCurrentToken +'&product='+ sProductname +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api/api.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    group: sCurrentGroup,
	    username: sCurrentUser,
	    token: sCurrentToken,
	    product: sProductname,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
		console.log('gathering data from json');
			$(function(){
				var sResult 	= data.result;
				console.log('result of setRoundProduct is '+ sResult);
				console.log('get the event for the group from api');
				getGroupDataFromApi();
				console.log('flip page, after short delay');
				setTimeout(function() {$.mobile.changePage("#group_eventlist", {transition : "flip"}); },200);
		});	    	
	});
}	
	
function getGroupDataFromApi(){
	var sCurrentUser 	= $("#dbgUsername").val();
	var sCurrentGroup 	= $("#dbgGroup").val();
	var sCurrentToken	= $("#dbgToken").val();
	var sMethode		= 'getGroup';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey + '&group='+ sCurrentGroup +'&username='+ sCurrentUser +'&token='+ sCurrentToken +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api/api.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    group: sCurrentGroup,
	    username: sCurrentUser,
	    token: sCurrentToken,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
		console.log('gathering data from json');
			$(function(){
				var sOutputUsers 	= '<table><tr><td width="30%"></td><td></td></tr>';
				$.each(data.users, function(index, value){
					 sOutputUsers += '<tr><td class="tdEvent">' + value.active + '</td><td class="tdEvent">' + value.username + '</td></tr>';
				});
				 sOutputUsers += '</table>';
				 $("#lstUserlist").html(sOutputUsers);

				var sOutputEvents 	= '';
				$.each(data.events, function(index, value){
					 sOutputEvents += '<div class="event '+ value.classname +'"><div class="eventTime">' + value.time + '</div><div class="eventMessage">' + value.message + '</div>';
				});
				 sOutputEvents += '';
				 $("#lstEventlist").html(sOutputEvents);
				 $("#dbgSync").val(data.datetime);
				 
				 
				if (typeof data.round != 'undefined'){
					var sOutputRound = '';
					var sRoundStatus 	= data.round.status;
					var dEndDateTime 	= data.round.end;
					var iSecsLeft 		= data.round.seconds_left;
					// status 1 is invited, 2 is runner is underway, status 9 is closed 
					if (sRoundStatus == 1){
						console.log('the round is considered OPEN');
						console.log('the round will be open for another '+ iSecsLeft +' seconds');		
						startRoundCountDown(iSecsLeft);
						$("#dbgRound").val('true');
						$(".divRoundCounter").show();
						$(".divRoundButton").hide();
					 	$(".divRoundRunner").hide();
					} else {
						if (sRoundStatus == 2) {
							$("#dbgRound").val('true');
						 	$(".divRoundCounter").hide();
						 	$(".divRoundButton").hide();							
						 	$(".divRoundRunner").show();
						 	$(".lblRunnerName").text(data.round.runnername);
						 	if (data.round.runnername == $("#dbgUsername").val()) {
						 		$(".divCloseRound").show();
						 		console.log('This user is the runner ('+ $("#dbgUsername").val() +')');
						 		
						 		if (typeof data.order != 'undefined'){
									console.log('there is order data');
									var sOutputOrder 	= '<table><tr><td width="30%"></td><td></td></tr>';
									$.each(data.order, function(index, value){
										 sOutputOrder += '<tr><td class="tdEvent">' + value.name + '</td><td class="tdEvent">' + value.product + '</td></tr>';
									});
									 sOutputOrder += '</table>';
									console.log('order data fetched');
									 $("#lstRoundlist").html(sOutputOrder);
									console.log('order data in html');
									 $("#dbgSync").val(data.datetime);
									 $.mobile.changePage('#order', {transition : "flip"});
									console.log('flipped');
									 	 				
						 		}
						 	} else {
						 		$(".divCloseRound").hide();						 		
						 		console.log('This user is not the selected runner ('+ $("#dbgUsername").val() +')');
						 	}
							
						} else {
						 	console.log('the round is considered CLOSED');	
							$("#dbgRound").val('false');
						 	$(".divRoundCounter").hide();
						 	$(".divRoundButton").show();							
						 	$(".divRoundRunner").hide();
						}
					}
				} else {
					 	console.log('the round is considered NON EXISTING');	
						$("#dbgRound").val('false');
					 	$(".divRoundCounter").hide();
					 	$(".divRoundButton").show();
					 	$(".divRoundRunner").hide();
					
				}				 	
				 console.log('button and counter are setup');
				});	    	
		});
}	

function registerDevice() {
	console.log('registration try started');
	$("#app-status-ul").append('<li>deviceready event received</li>');
	document.addEventListener("backbutton", function(e)
	{
		$("#app-status-ul").append('<li>backbutton event received</li>');
		if( $("#content").length > 0)
		{
			// call this to get a new token each time. don't call it to reuse existing token.
			//pushNotification.unregister(successHandler, errorHandler);
			e.preventDefault();
			navigator.app.exitApp();
		}
		else
		{
			navigator.app.backHistory();
		}
	}, false);

	try 
	{ 
		pushNotification = window.plugins.pushNotification;
		$("#app-status-ul").append('<li>registering: ' + device.platform + '</li>');
		$("#app-status-ul").append('<li>cordova: ' + device.cordova + '</li>');
		$("#app-status-ul").append('<li>model: ' + device.model + '</li>');
		$("#app-status-ul").append('<li>name: ' + device.name + '</li>');
		$("#app-status-ul").append('<li>platform: ' + device.platform + '</li>');
		$("#app-status-ul").append('<li>uuid: ' + device.uuid + '</li>');
		$("#app-status-ul").append('<li>version: ' + device.version + '</li>');

		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
			pushNotification.register(successHandler, errorHandler, {"senderID":"709162159686","ecb":"onNotification"});		// required!
		} else {
			pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
	    	}
    }
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		alert(txt); 
	} 

}			

// handle APNS notifications for iOS
function onNotificationAPN(e) {
	if (e.alert) {
         $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
         // showing an alert also requires the org.apache.cordova.dialogs plugin
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotification(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
    
    switch( e.event )
    {
        case 'registered':
		if ( e.regid.length > 0 )
		{
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + '</li>');
			$("#dbgToken").val(e.regid);
//			alert('reg done... '+$("#dbgToken").val());
			$("#app-status-ul").append('<li>REGISTERED -> LOG: added regid in textbox</li>');
			console.log("regID = " + e.regid);
		}
        break;
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	if (e.foreground)
        	{
				$("#app-status-ul").append('<li>--FOREGROUND NOTIFICATION--' + '</li>');
			      
			        // on Android soundname is outside the payload. 
		                // On Amazon FireOS all custom attributes are contained within payload
		                var soundfile = e.soundname || e.payload.sound;
		                // if the notification contains a soundname, play it.
		                // playing a sound also requires the org.apache.cordova.media plugin
		                var my_media = new Media("/android_asset/www/"+ soundfile);
				my_media.play();
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart)
					$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				else
				$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
			}
			$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + ' met pl</li>');
			$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.collapse_key + ' is de sync-key so no popup !</li>');
			$("#app-status-ul").append('<li>MESSAGE -> MSG: page = '+ e.payload.page +'</li>');
			$("#app-status-ul").append('<li>MESSAGE -> MSG: page = '+ e.payload.message +'</li>');
			$("#app-status-ul").append('<li>MESSAGE -> MSG: page = '+ e.collapse_key +'</li>');
			if (e.collapse_key == "event") {
				$("#app-status-ul").append('<li>MESSAGE -> MSG: getting the events</li>');
				getGroupDataFromApi();
				$("#app-status-ul").append('<li>MESSAGE -> MSG: got events succesfully</li>');							
			}
			else {
				$("#app-status-ul").append('<li>MESSAGE -> MSG: popup message</li>');
    			navigator.notification.alert(e.payload.message,  'Booons update1', 'Booons update2');
				if (e.payload.page != ''){
					$.mobile.changePage('#'+e.payload.page, {transition : "flip"});
				}
				$("#app-status-ul").append('<li>MESSAGE -> MSG: popup message delivered</li>');
			};
			
            break;
        
        case 'error':
			$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
        break;
        
        default:
			$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
        break;
    }
}

function tokenHandler (result) {
    $("#app-status-ul").append('<li>token: '+ result +'</li>');
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    $("#app-status-ul").append('<li>success:'+ result +'</li>');
}

function errorHandler (error) {
    $("#app-status-ul").append('<li>error:'+ error +'</li>');
}

var max_time = 5;
var cinterval;
	
function startRoundCountDown(iSecondsLeft) {
    clearInterval(cinterval);
	max_time = iSecondsLeft;
	cinterval = setInterval('countdown_timer()', 1000);
}

function countdown_timer(){
  max_time--;
  $(".countDown").text(max_time);
  if(max_time == 0){
  	setTimeout(function() {getGroupDataFromApi(); },500);
    clearInterval(cinterval);
  }
}
