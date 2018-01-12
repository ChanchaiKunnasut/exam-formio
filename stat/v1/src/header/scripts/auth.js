var addtwonumbersurl = null;
var mailboxSettingsAvailable = true;
var ADAL = new AuthenticationContext({
    instance: 'https://login.microsoftonline.com/',
    tenant: '3e0b6cbd-4959-4d01-81bf-ce883ddabd96', //COMMON OR YOUR TENANT ID
    clientId: '8abc815a-6fc1-4419-a172-bab1ef5bdbeb', //REPLACE WITH YOUR CLIENT ID
    redirectUri: [window.location.protocol, '//', window.location.host, window.location.pathname].join(''), // THE CDN URI
    cacheLocation: isIEBrowser() ? 'localStorage' : 'sessionStorage', // enable this for IE, as sessionStorage does not work for localhost.
    popUp: false
});   

// output ADAL logs to the console
Logging = {
   level: 3,
   log: function (message) {
      console.log(message);
   }
};

var currentUser = {
    name: "",
    uid: "",
    member: false,
    personal: false
};

(function () {
    // parsing the query string into JSON 
    var query = window.location.search.substring(1);
    var qs = '{}';
    if (query!=null && query!='') {
        var qs = parse_query_string(query);
    }
    
    var isIfrm = isIframe();
    var isCallback = ADAL.isCallback(window.location.hash);
    console.log('isIframe: '+isIfrm+', isADALInitialized: '+isSignedInUser()+', isCallback='+isCallback+', query string: '+query);
    
    // check and use ADAL if we have signed in user or we need to initialize it
    // NOTE: ADAL should be used if this is running inside iFrame (it means it is refreshing the ID token), or if we already have signed-in user, 
    // or we are in process of initialization (callback), or if we have the query parameter 'online' equal to 'true'
    var shouldUseADAL = isIfrm || isSignedInUser() || isCallback || qs['online']=='true';
    console.log('should use ADAL: '+shouldUseADAL);
    if (shouldUseADAL) {
        // doing ADAL logic
        console.log('iscallback='+isCallback);
        if (isCallback) {
            ADAL.handleWindowCallback();	
        }
        
        if (isCallback && !ADAL.getLoginError()) {
            console.log('Now redirecting to original URL');
            window.location = ADAL._getItem(ADAL.CONSTANTS.STORAGE.LOGIN_REQUEST);
            return;
        }	
        
        if (!ADAL.getCachedUser()) {
            console.log('handling signin...');
            ADAL.login();
            return;
        }
    }    
})();


   
function isIEBrowser() {
    var mybrowser = window.navigator.userAgent;
    if (mybrowser.indexOf('MSIE')>0 || mybrowser.indexOf('Trident/')>0){
        return true;
    }
                
    return false;
}
   
function isSignedInUser () {
    return ADAL.getCachedUser()!=null;
}

function isUseOutlookMailSettings() {
    return typeof headerObj !== 'undefined' && headerObj["use outlook settings"];
}
   
function fillUserInfo() {
    var signeduser = ADAL.getCachedUser();
    if (signeduser && headerObj !== 'undefined' && headerObj.hasOwnProperty("account") && headerObj["account"]) {
        if (signeduser.profile.upn) {
            // For work or school accounts (tenant members)
            currentUser.member = true;
            currentUser.personal = false;
            currentUser.uid = signeduser.profile.upn;
            $('.useremail').html(signeduser.profile.upn);
            $('#usersettingslinklist').append('<div><div class="user-settings-link-wrapper"><a id="myProfileLink" class="user-settings-link" role="link" href="https://delve.office.com/"><span class="user-settings-link-label" lang-tran="My profile">My profile</span></a></div><div class="user-settings-link-wrapper"><a id="myAccountLink" class="user-settings-link" role="link" href="https://portal.office.com/account/"><span class="user-settings-link-label" lang-tran="My account">My account</span></a></div><div class="user-settings-link-wrapper"><a id="signOutLink" class="user-settings-link" role="link" href="https://login.microsoftonline.com/' + ADAL.config.tenant + '/oauth2/logout"><span class="user-settings-link-label" lang-tran="Sign out">Sign out</span></a></div></div>');
        } else if (signeduser.profile.idp === "live.com") {
            // For personal accounts
            currentUser.member = false;
            currentUser.personal = true;
            currentUser.uid = signeduser.profile.email;
            $('.useremail').html(signeduser.profile.email);
            $('#usersettingslinklist').append('<div><div class="user-settings-link-wrapper"><a id="myProfileLink" class="user-settings-link" role="link" href="https://account.microsoft.com/profile/"><span class="user-settings-link-label" lang-tran="My profile">My profile</span></a></div><div class="user-settings-link-wrapper"><a id="myAccountLink" class="user-settings-link" role="link" href="https://account.microsoft.com/"><span class="user-settings-link-label" lang-tran="My account">My account</span></a></div><div class="user-settings-link-wrapper"><a id="signOutLink" class="user-settings-link" role="link" href="https://login.microsoftonline.com/' + ADAL.config.tenant + '/oauth2/logout"><span class="user-settings-link-label" lang-tran="Sign out">Sign out</span></a></div></div>');
        } else {
            // For work or school accounts which are guests
            currentUser.member = false;
            currentUser.personal = false;
            currentUser.uid = signeduser.profile.email;
            $('.useremail').html(signeduser.profile.email);
            $('#usersettingslinklist').append('<div><div class="user-settings-link-wrapper"><a id="myProfileLink" class="user-settings-link" role="link" href="https://delve.office.com/"><span class="user-settings-link-label" lang-tran="My profile">My profile</span></a></div><div class="user-settings-link-wrapper"><a id="myAccountLink" class="user-settings-link" role="link" href="https://portal.office.com/account/"><span class="user-settings-link-label" lang-tran="My account">My account</span></a></div><div class="user-settings-link-wrapper"><a id="signOutLink" class="user-settings-link" role="link" href="https://login.microsoftonline.com/' + ADAL.config.tenant + '/oauth2/logout"><span class="user-settings-link-label" lang-tran="Sign out">Sign out</span></a></div></div>');
        }
        
        
        currentUser.name = signeduser.profile.name;
        $('.username').html(signeduser.profile.name);
        getuserphotometadata();
    }
}
   
function isIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {   
        console.log('error while checking iframe...');
            return true;
    }
}   
            
function parse_query_string(query) {
    return parse_string(query,"&");
} 
            
function parse_string(str,del) {
    var vars = str.split(del);
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    
    return query_string;
}

function executeAjaxRequestWithAdalLogic(resource,callbackfunc,ajaxurl,ajaxjsondata) {
    ADAL.acquireToken(resource, function (error, token, errcode) {
        // Handle ADAL Error
        if (error || errcode || !token) {
           var msg = '';
            if (error || errcode) {
               msg+='Error '+(errcode!=null ? '"'+errcode+'"' : '')+' occured when acquiring token for the resource "'+resource+'" for calling function "'+getFunctionName(callbackfunc)+'" with ajax url "'+ajaxurl+'"'+(ajaxjsondata!=null ? ' and JSON data '+JSON.stringify(ajaxjsondata) : '')+'.';
               msg+='\n\nError details:\n'+error;
            }
            var dologin = false;
            if (errcode=='login_required' || errcode=='interaction_required' || errcode=='account_selection_required' || errcode=='consent_required' || errcode=='login required' || errcode=='access_denied') {
               dologin = true;
               msg='You will be redirected to the login page.\n\n'+msg;
            } else if (errcode=='Token Renewal Failed') {
               msg='Please try again latter.\n\n'+msg;
            } else {
               var msgpart = '';
               if (errcode=='resource is required') {
                  msgpart='The application is not providing resource to ADAL call';
               } else if (errcode=='invalid_resource') {
                  msgpart='The application is trying to use invalid resource';
               } else if (errcode=='unsupported_response_type') {
                  msgpart='The application authentication setting must be adjusted to support implicit flow';
               } else {
                  msgpart = 'Unknown error happened';
               }
               msgpart+=' - please contact the support and send the screenshot of this dialog.\n\n'
               msg=msgpart+msg;
            }
            if (!token) {
               msg = 'Token is not acquired!\n\n'+msg;
            }
            console.log(msg);
            alert(msg);
            if (dologin) {
               ADAL.login();
            } 
            //if (errcode=='interaction_required' && resource!=ADAL.config.clientId) {
            //   ADAL.acquireTokenRedirect(resource, null, null);               
            //}
            return;
        } else {
            console.log('Token for the resource "'+resource+'" is valid. Now executing function "'+getFunctionName(callbackfunc)+'" with ajax url "'+ajaxurl+'"'+(ajaxjsondata!=null ? ' and JSON data '+JSON.stringify(ajaxjsondata) : '')+'.');
        }
        if (ajaxurl==null) {
           var noaurlmsg = 'The function "'+getFunctionName(callbackfunc)+'" will not be called because URL is not provided!';
           console.log(noaurlmsg);
           alert(noaurlmsg);
        } else {
         callbackfunc(token,ajaxurl,ajaxjsondata);
        }
    });
}

function getFunctionName(funct) {
   if (isIEBrowser()) {
      var ret = funct.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret;
   } else {
      return funct.name;
   }
}

function getdata(url) {
    document.getElementById('mymessage').innerHTML='Waiting for data...';
    executeAjaxRequestWithAdalLogic(ADAL.config.clientId,getdatanoadal,url);
}

function getdatanoadal(token,url) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    }
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getdata call successfully executed');
        document.getElementById('mymessage').innerHTML='Data successfully retrieved!';
        addtwonumbersurl = request.getResponseHeader('API_add_url');
        console.log('Data successfully retrieved! ATNURL='+addtwonumbersurl);
    }).fail(function (err, textStatus, errorThrown) {
        console.log('getdata call failed');
        document.getElementById('mymessage').innerHTML='Failed to retrieve the data!';
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        alert("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getmailboxsettingsdata(url) {   
    document.getElementById('mailboxsettingsmessage').innerHTML='Waiting for data...';
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",getdatanoadalmailboxsettings,url);
}

function getdatanoadalmailboxsettings(token,url) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    }
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getmailboxsettingsdata call successfully executed');
        document.getElementById('mailboxsettingsmessage').innerHTML='Mailbox data successfully retrieved!';
        if (data && data["language"] && data["language"]["locale"]) {
            languageSelector.selectedLanguage = convertGraphLanguage(data["language"]["locale"]);
        }
        
        console.log("Selected language="+languageSelector.selectedLanguage);
        
        if (data && data["timeZone"]) {
            setInitialTimeZone(data["timeZone"]);
            console.log("User's current time zone alias: " + data["timeZone"]);
        } else {
            console.log("User's current time zone hasn't been received.");
        }
        
        // Translate the page
        setupPredefinedLanguage();
        setupStyle();
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        mailboxSettingsAvailable = false;
        applyTranslation();
        setupStyle();
        console.log('getmailboxsettingsdata call failed');
        document.getElementById('mailboxsettingsmessage').innerHTML='Failed to retrieve the mailbox data!';
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        alert("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getSupportedTimeZones() {
    document.getElementById('supportedtimezonesmessage').innerHTML='Waiting for data...';
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com", getDataOnAdalSupportedTimeZones, 'https://graph.microsoft.com/beta/me/outlook/supportedTimeZones');
}

function getDataOnAdalSupportedTimeZones(token, url) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    }
    
    $.ajax(settings).done(function (data, textStatus, request) {
        console.log('getSupportedTimeZones call successfully executed');
        document.getElementById('supportedtimezonesmessage').innerHTML='Supported time zones successfully retrieved!';
        if (data && data["value"]) {
            setSupportedTimeZones(data["value"]);
            console.log('Supported time zones successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
        } else {
            console.log("Invalid response format!");
        }
    }).fail(function (err, textStatus, errorThrown) {
        mailboxSettingsAvailable = false;
        console.log('getSupportedTimeZones call failed');
        document.getElementById('supportedtimezonesmessage').innerHTML='Failed to retrieve supported time zones!';
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        alert("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function patchmailboxsettingsdata(url, payload) {
    document.getElementById('mailboxsettingsmessage').innerHTML="Updating user's data...";
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",patchdatanoadal,url,payload);
}

function patchdatanoadal(token, url, payload) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "PATCH",        
        "headers": {
            "Authorization": "Bearer " + token
        },
        "data": JSON.stringify(payload),
        "contentType": "application/json"
    }
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('patchmailboxsettingsdata call successfully executed');
        document.getElementById('mailboxsettingsmessage').innerHTML="User's data successfully updated!";
        console.log('Data successfully updated! DATA='+(data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        console.log('patchmailboxsettingsdata call failed');
        document.getElementById('mailboxsettingsmessage').innerHTML="Failed to update user's data!";
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        alert("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getuserphotometadata() {
    document.getElementById('userphotomessage').innerHTML="Waiting for user's photo meta data...";
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",getdatanoadalphotometadata,"https://graph.microsoft.com/beta/me/photo");
}

function getdatanoadalphotometadata(token,url) {
    var settings = {
        "crossDomain": true,
        "url": url,
        "timeout":30000,
        "method": "GET",        
        "headers": {
            "Authorization": "Bearer " + token
        }
    }
    
    $.ajax(settings).done(function (data,textStatus,request) {
        console.log('getuserphotometadata call successfully executed');
        document.getElementById('userphotomessage').innerHTML="User's photo meta data successfully retrieved!";
        
        if (data && data["width"] && data["width"] > 1) {
            getuserphoto();
        } else {
            document.getElementById('userphotomessage').innerHTML="User hasn't set his photo.";
        }
        
        console.log('Data successfully retrieved! payload: ' + (data!=null ? JSON.stringify(data) : null));
    }).fail(function (err, textStatus, errorThrown) {
        console.log('getuserphotometadata call failed');
        document.getElementById('userphotomessage').innerHTML='Failed to retrieve the photo meta data!';
        console.log("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
        alert("AJAX REQUEST FAILED:"+err.toString()+',textStatus='+textStatus+', errorThrown='+errorThrown);
    });
}

function getuserphoto() {
    document.getElementById('userphotomessage').innerHTML="Waiting for user's photo...";
    executeAjaxRequestWithAdalLogic("https://graph.microsoft.com",getdatanoadalphoto,"https://graph.microsoft.com/beta/me/photo/$value");
}

function getdatanoadalphoto(token,url) {
    var request = new XMLHttpRequest;
    request.open("GET", url);
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.responseType = "blob";
    request.onload = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log('getuserphoto call successfully executed');
            document.getElementById('userphotomessage').innerHTML="User's photo successfully retrieved!";
            
            var reader = new FileReader();
            reader.onload = function () {
                $('.userphoto').attr('src', reader.result).show();
            }
            
            reader.readAsDataURL(request.response);
        } else {
            console.log('getdatanoadalphoto call failed');
            document.getElementById('userphotomessage').innerHTML='Failed to retrieve the photo!';
            console.log("AJAX REQUEST FAILED:"+request.statusText);
            alert("AJAX REQUEST FAILED:"+request.statusText);
        }
    };
    request.send(null);
}