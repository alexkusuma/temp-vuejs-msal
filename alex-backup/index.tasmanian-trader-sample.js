import * as Msal from 'msal';

export var config =  {
 clientid: 'your-cient-id',
 redirecturl: 'http://localhost:8080/callback',
 authority: 'https://login.microsoftonline.com/common',
 graphscopes: ['user.read'],
 graphendpoint: 'https://graph.microsoft.com/v1.0/me',
 appinsightsid: ''
}

class AuthService {
 constructor() {
  // let redirectUri = window.location.origin;
  let redirectUri = config.redirecturl
  //let PostLogoutRedirectUri = '/'
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
  return null;
  /*
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
  
export const auth = new AuthService();
