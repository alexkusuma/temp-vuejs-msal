import axios from "axios";
import * as Msal from 'msal';

export default class Auth {
 /*
 For plug-ins purposes
 install (){

 }
 */
 graphEndpoint = 'https://graph.microsoft.com/v1.0/';
 graphMeEndpoint = this.graphEndpoint+'me/';
 graphGroupEndpoint = this.graphEndpoint+'groups/';
 app = '';
 tokens = {
  idToken: {},
  accessToken: {}
 };
 userLoggedIn = false;
 obtainUserInfo = false;
 obtainUserGroup = false;
 user = {
  info: {},
  groups: []
 };
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
 get isUserLoggedin() { return this.userLoggedIn }
 get isUserInfoObtained() { return this.obtainUserInfo }
 get isuserGroupObtained() { return this.obtainUserGroup }
 // Shared Functionality
 requiresInteraction(errorCode) {
  if (!errorCode || !errorCode.length) {
   return false;
  }
  return errorCode === "consent_required" || errorCode === "interaction_required" || errorCode === "login_required";
 }
 // Acquiring tokens
 async getIdToken(){
  this.tokens.idToken = await this.app.loginPopup(this.requestObj)
   .then(tokenResponse => {
    this.userLoggedIn=true;
    return tokenResponse.idToken;
   })
   .catch(error => { console.log(error) });
 }
 async getAccessToken() {
  this.tokens.accessToken = await this.app.acquireTokenSilent(this.requestObj)
   .then(tokenResponse => { return tokenResponse.accessToken; })
   .catch(async error => {
    if(this.requiresInteraction(error.errorCode)){
      return await this.app.acquireTokenPopup(this.requestObj)
     .then(async tokenResponse => { return tokenResponse.accessToken; })
     .catch(error => console.log(error));
    }
    else{
     console.log(error);
    }
   });
 }
 // Core functionality
 signOut() {
  this.app.logout()
 }
 async signIn(){
  await this.getIdToken();
  await this.getAccessToken();
 }

 /*
  * NOTE:
  * Login Redirect is mainly for IE11 support.
  * It's left unsupported at the moment
  * 
 // Register Callbacks for login redirect flow
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
 loginRedirect() {
  this.app.loginRedirect(this.requestObj.scopes)
 }
 */

 // Graph Related
 async getUserInfo(){
  await axios.get(this.graphMeEndpoint, {
   headers: {
    'Authorization': 'Bearer ' + this.tokens.accessToken
   },
  })
  .then(response => {
   this.user.info = response.data;
   this.obtainUserInfo = true;
  })
  .catch(error => console.log(error));
 }
 async getUserGroups(isSecurityEnabledGroupsOnly){
  let mygroups = {};
  let isSecurityOnly = (typeof isSecurityEnabledGroupsOnly === "boolean") ? isSecurityEnabledGroupsOnly : true;
  
  // The groups will be returned as list of GUIDs
  await axios.post(this.graphMeEndpoint+'getMemberGroups', {
   "securityEnabledOnly": isSecurityOnly
  }, {
   headers: {
    'Authorization': 'Bearer ' + this.tokens.accessToken
   },
  })
   .then(response => { mygroups = response.data.value; })
   .catch(error => console.log(error));
  // Query the display name for each of the group
  await mygroups.forEach(async group => {
   await axios.get(this.graphGroupEndpoint + group, {
    headers: {
     'Authorization': 'Bearer ' + this.tokens.accessToken
    },
   })
    .then(response => {
     this.user.groups.push({
      "id": group,
      "displayName": response.data.displayName,
      "description": response.data.description,
      "securityEnabled": response.data.securityEnabled,
      "deletedDateTime": response.data.deletedDateTime
     });
    })
    .catch(error => console.log(error));
  });
  this.obtainUserGroup = true;
 }
}
