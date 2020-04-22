import * as Msal from 'msal';
//import axios from "axios";

/*
 Config for itaccount
 clientId: 'c58d5c8c-7d5a-4c59-9219-c77576d6a8ea',
 tenantId: '7fab64ae-c78a-430b-8380-5ea2cedf0244',
 authority: 'https://login.microsoftonline.com/7fab64ae-c78a-430b-8380-5ea2cedf0244',
 redirectUri: 'https://vuejsmsal.z8.web.core.windows.net/',
 postLogoutRedirectUri: 'https://vuejsmsal.z8.web.core.windows.net/'
 
 Config for UoA
 clientId: 'd81d142b-bd09-4f58-9a86-bca402c4a1bc',
 tenantId: '03ed2d27-eefc-4018-8a19-9963edaf5ce1',
 authority: 'https://login.microsoftonline.com/03ed2d27-eefc-4018-8a19-9963edaf5ce1',
 redirectUri: 'https://uoavuejsmsaltest.z26.web.core.windows.net/',
 postLogoutRedirectUri: 'https://uoavuejsmsaltest.z26.web.core.windows.net/'
 */

export var appConfig = {
 clientId: 'your-client-id',
 tenantId: 'your-tenant-id',
 redirecturl: 'http://localhost:8080/callback',
 postLogoutRedirectUri: '',
 graphscopes: ['user.read'],
 appinsightsid: ''
}

export var msalConfig = {
 defaultTenantId: 'common',
 authorityBaseUrl: 'https://login.microsoftonline.com/',
 graphendpoint: 'https://graph.microsoft.com/v1.0/me',
}

// With a lot of help from ; https://stackoverflow.com/questions/52944052/creating-a-single-instance-of-a-class-within-a-vue-application 
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/UserAgentApplication.ts

export default class Auth {
 constructor() {
  // let redirectUri = window.location.origin;
  let redirectUri = config.redirecturl
  let PostLogoutRedirectUri = '/'
  this.graphUrl = config.graphendpoint
  this.applicationConfig = {
   clientID: config.clientid,
   authority: config.authority,
   graphScopes: config.graphscopes
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
  return this.app.loginPopup(this.applicationConfig.graphScopes).then(
   idToken => {
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
  return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
   accessToken => {
    return accessToken
   },
   error => {
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

/*
export default class NewAuth{
 cache = {
   cacheLocation: "localStorage",
   storeAuthStateInCookie: true
 };
 graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
 };
 requestObj = {
  scopes: ["user.read"]
 };

 myMSALObj = new Msal.UserAgentApplication(msalConfig);

 constructor(){
 }
 login(){
 }

 signIn() {
  myMSALObj.loginPopup(requestObj).then(function (loginResponse) {
   //Login Success
   showWelcomeMessage();
   acquireTokenPopupAndCallMSGraph();
  }).catch(function (error) {
   console.log(error);
  });
 }

 acquireTokenPopupAndCallMSGraph() {
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

 handleRedirectCallback(authRedirectCallBack){
  // Register Callbacks for redirect flow
  myMSALObj.handleRedirectCallback(authRedirectCallBack);
 }
}
*/