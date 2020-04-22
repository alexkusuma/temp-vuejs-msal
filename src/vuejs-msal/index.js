import * as Msal from 'msal';

export default class Auth {
 app = '';
 graphMeEndpoint = 'https://graph.microsoft.com/v1.0/me';
 userToken = '';
 requestObj = {};
 msalConfig = {};

 constructor(options = {}) {
  this.msalConfig = {
   auth: {
    clientId: options.clientId,
    authority: 'https://login.microsoftonline.com/' + options.tenantId
   },
   cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
   }
  }
  this.requestObj = {
   scopes: options.graphscopes
  };
  this.app = new Msal.UserAgentApplication(this.msalConfig);
 }
 // Shared Functionality
 requiresInteraction(errorCode) {
  if (!errorCode || !errorCode.length) {
   return false;
  }
  return errorCode === "consent_required" || errorCode === "interaction_required" || errorCode === "login_required";
 }
 graphAPICallback(data) {
  document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
 }
 callMSGraph(theUrl, accessToken, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200)
   callback(JSON.parse(this.responseText));
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xmlHttp.send();
 }
 acquireTokenPopupAndCallMSGraph() {
  //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
  this.app.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
   this.userToken = tokenResponse.accessToken;
   this.callMSGraph(this.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
  }).catch(function (error) {
   console.log(error);
   // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
   // Call acquireTokenPopup(popup window)
   if (this.requiresInteraction(error.errorCode)) {
    this.app.acquireTokenPopup(this.requestObj).then(function (tokenResponse) {
     this.userToken = tokenResponse.accessToken;
     this.callMSGraph(this.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
    }).catch(function (error) {
     console.log(error);
    });
   }
  });
 }
 acquireToken(){
  //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
  this.app.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
   this.userToken = tokenResponse.accessToken;
  }).catch(function (error) {
   console.log(error);
   // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
   // Call acquireTokenPopup(popup window)
   if (this.requiresInteraction(error.errorCode)) {
    this.app.acquireTokenPopup(this.requestObj).then(function (tokenResponse) {
     this.userToken = tokenResponse.accessToken;
    }).catch(function (error) {
     console.log(error);
    });
   }
  });
 }
 // Core functionality
 signOut() {
  this.app.logout()
 }
 signIn(){
  this.app.loginPopup(this.requestObj)
   .then(function () {
     this.acquireToken();
    })
   .catch(function (error) {
     console.log(error);
    });
 }

 /*
 // Register Callbacks for redirect flow
 this.app.handleRedirectCallback(authRedirectCallBack);
 function authRedirectCallBack(error, response) {
  if (error) {
   console.log(error);
  }
  else {
   if (response.tokenType === "access_token") {
    this.callMSGraph(this.graphEndpoint, response.accessToken, this.graphAPICallback);
   } else {
    console.log("token type is:" + response.tokenType);
   }
  }
 }
 //This function can be removed if you do not need to support IE
 function acquireTokenRedirectAndCallMSGraph() {
  //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
  this.app.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
   this.callMSGraph(this.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
  }).catch(function (error) {
   console.log(error);
   // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
   // Call acquireTokenRedirect
   if (this.requiresInteraction(error.errorCode)) {
    this.app.acquireTokenRedirect(this.requestObj);
   }
  });
 }
 */
 loginRedirect() {
  this.app.loginRedirect(this.requestObj.scopes)
 }

 // Graph Related
 getGraphToken() {
  alert(this.requestObj.scopes[0]);
  /*
  return this.app.acquireTokenSilent(this.requestObj.scopes).then(
   accessToken => {
    return accessToken
   },
   _error => {
    return this.app
    .acquireTokenPopup(this.requestObj.scopes)
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
  return fetch(`${this.graphMeEndpoint}`, options)
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

/*



*/