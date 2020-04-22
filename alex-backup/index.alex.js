import * as Msal from 'msal';

export var applicationConfig = {
 clientId: 'c58d5c8c-7d5a-4c59-9219-c77576d6a8ea',
 tenantId: '03ed2d27-eefc-4018-8a19-9963edaf5ce1',
 authority: 'https://login.microsoftonline.com/03ed2d27-eefc-4018-8a19-9963edaf5ce1',
 redirecturl: 'https://vuejsmsal.z8.web.core.windows.net/',
 postLogoutRedirectUri: 'https://vuejsmsal.z8.web.core.windows.net/',
 graphscopes: ['user.read'],
 appinsightsid: ''
}

class Auth {
 constructor() {
  let redirectUri = applicationConfig.redirecturl
  //let PostLogoutRedirectUri = applicationConfig.postLogoutRedirectUri
  this.graphUrl = 'https://graph.microsoft.com/v1.0/me'
  this.applicationConfig = {
   clientID: applicationConfig.clientId,
   authority: applicationConfig.authority,
   graphScopes: applicationConfig.graphscopes
  }
  this.app = new Msal.UserAgentApplication(
   this.applicationConfig.clientID,
   this.applicationConfig.authority,
   () => {
    // callback for login redirect
   },
   {
    redirectUri
   }
  )
 }
 // Core Functionality
 loginPopup() {
  return null;
  /*
  return this.app.loginPopup(this.applicationConfig.graphScopes).then(
   _idToken => {
    const user = this.app.getUser();
    if (user) {
     return user;
    } else {
     return null;
    }
   },
   () => {
    return null;
   }
  );
  */
 }
 loginRedirect() {
  this.app.loginRedirect(this.applicationConfig.graphScopes)
 }
 logout() {
  this.app._user = null
  this.app.logout()
 }
 // Graph Related
 getGraphToken() {
  return null;
  /*
  return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
   accessToken => {
    return accessToken
   },
   _error => {
    return this.app
    .acquireTokenPopup(this.applicationConfig.graphScopes)
    .then(
     accessToken => {
      return accessToken
     },
     err => {
      console.error(err)
     }
    )
   }
  )
  */
 }
 getGraphUserInfo(token) {
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const options = {
   headers
  };
  return fetch(`${this.graphUrl}`, options)
   .then(response => response.json())
   .catch(response => {
    throw new Error(response.text());
  });
 }
 // Utility
 getUser() {
  return this.app.getUser()
 }
}

export const auth = new Auth();

//export default auth;

/*

 var myMSALObj = new Msal.UserAgentApplication(msalConfig);
 // Register Callbacks for redirect flow
 myMSALObj.handleRedirectCallback(authRedirectCallBack);

 function authRedirectCallBack(error, response) {
    if (error) {
        console.log(error);
    }
    else {
        if (response.tokenType === "access_token") {
            callMSGraph(graphConfig.graphEndpoint, response.accessToken, graphAPICallback);
        } else {
            console.log("token type is:" + response.tokenType);
        }
    }
 }

 
 function signIn() {
    myMSALObj.loginPopup(requestObj).then(function (loginResponse) {
        //Login Success
        showWelcomeMessage();
        acquireTokenPopupAndCallMSGraph();
    }).catch(function (error) {
        console.log(error);
    });
 }

 function showWelcomeMessage() {
    var divWelcome = document.getElementById('WelcomeMessage');
    divWelcome.innerHTML = 'Welcome ' + myMSALObj.getAccount().userName + " to Microsoft Graph API";
    var loginbutton = document.getElementById('SignIn');
    loginbutton.innerHTML = 'Sign Out';
    loginbutton.setAttribute('onclick', 'signOut();');
 }
 function acquireTokenPopupAndCallMSGraph() {
    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
         callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
    }).catch(function (error) {
         console.log(error);
         // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
         // Call acquireTokenPopup(popup window)
         if (requiresInteraction(error.errorCode)) {
             myMSALObj.acquireTokenPopup(requestObj).then(function (tokenResponse) {
                 callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
             }).catch(function (error) {
                 console.log(error);
             });
         }
    });
 }
 //This function can be removed if you do not need to support IE
 function acquireTokenRedirectAndCallMSGraph() {
     //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
     myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
         callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
     }).catch(function (error) {
         console.log(error);
         // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
         // Call acquireTokenRedirect
         if (requiresInteraction(error.errorCode)) {
             myMSALObj.acquireTokenRedirect(requestObj);
         }
     });
 }

 function signOut() {
     myMSALObj.logout();
 }

 function callMSGraph(theUrl, accessToken, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            callback(JSON.parse(this.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
 }
 function graphAPICallback(data) {
    document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
}


*/