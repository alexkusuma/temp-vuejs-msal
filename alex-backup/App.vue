<template>
 <div id="app">
  <div id="nav">
   <router-link to="/">Home</router-link> | 
   <router-link to="/about">About</router-link>
   <p><button @click="say(buttonCaption + '!')">{{ buttonCaption }}</button> | <button @click="say('graph!')">Calling Graph API</button></p>
   <span>{{ this.graphAPIResult }}|{{ this.myGraphApiSpan }}</span>
  </div>
  <router-view/>
 </div>
</template>
<script>
import * as Msal from "msal";
//import axios from "axios";

export default {
 name: 'msal-app',
 props:{
  /*
  test: {
   type: [String, Number],
   required: false
  },
  */
  buttonCaption: {
   type: String,
   default: 'Login'
  }
 },
 data: function() {
  return{
   myGraphApiSpan: 'test',
   /*
   clientId: 'c58d5c8c-7d5a-4c59-9219-c77576d6a8ea',
   authority: '',
   cacheLocation: '',
   storeAuthStateInCookie: '',
   graphMeEndpoint: '',
   scopes: '',
   myMSALObj: null,
   */
   msalConfig: {
    auth: {
     clientId: 'c58d5c8c-7d5a-4c59-9219-c77576d6a8ea',
     authority: 'https://login.microsoftonline.com/7fab64ae-c78a-430b-8380-5ea2cedf0244'
    },
    cache: {
     cacheLocation: 'localStorage',
     storeAuthStateInCookie: true
    }
   },
   graphConfig: {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
   },
   requestObj: {
    scopes: ['user.read']
   },
   loginRequest: {
    scopes: ['user.read', 'mail.send'] // optional Array<string>
   },
   myMSALObj: new Msal.UserAgentApplication(this.msalConfig)
  }
 },
 created: ()=>({
 }),
 mounted: ()=>({
 }),
 computed: {
  graphAPIResult() {
   //return this.myGraphApiSpan;
   return 'test';
  },
 },
 watch: {
 },
 methods:{
  // UI Related
  say(caption){
   alert(caption);
  },
  graphAPICallback(data) {
   document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
  },
  showWelcomeMessage() {
   var divWelcome = document.getElementById('WelcomeMessage');
   divWelcome.innerHTML = 'Welcome ' + this.loginRequest.myMSALObj.getAccount().userName + " to Microsoft Graph API";
   var loginbutton = document.getElementById('SignIn');
   loginbutton.innerHTML = 'Sign Out';
   loginbutton.setAttribute('onclick', 'signOut();');
  },
  // Login/Logout related
  loginPopup(){
   if (this.loginRequest.myMSALObj.getAccount()) {// avoid duplicate code execution on page load in case of iframe and popup window.
    this.showWelcomeMessage();
    this.acquireTokenPopupAndCallMSGraph();
   }
  },
  loginRedirect(){
   document.getElementById("SignIn").onclick = function () {
    this.loginRequest.myMSALObj.loginRedirect(this.requestObj);
   };
   if (this.loginRequest.myMSALObj.getAccount() && !this.loginRequest.myMSALObj.isCallback(window.location.hash)) {// avoid duplicate code execution on page load in case of iframe and popup window.
    this.showWelcomeMessage();
    this.acquireTokenRedirectAndCallMSGraph();
   }
  },
  logout(){
   this.myMSALObj.logout();
  },
  signOut(){
   this.logout();
  },
  // Acquiring tokens related
  acquireTokenPopupAndCallMSGraph() {
   //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
   this.loginRequest.myMSALObj.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
    this.callMSGraph(this.graphConfig.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
   }).catch(function (error) {
    console.log(error);
    // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
    // Call acquireTokenPopup(popup window)
    if (this.requiresInteraction(error.errorCode)) {
     this.loginRequest.myMSALObj.acquireTokenPopup(this.requestObj).then(function (tokenResponse) {
      this.callMSGraph(this.graphConfig.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
     }).catch(function (error) {
      console.log(error);
     });
    }
   });
  },
  acquireTokenRedirectAndCallMSGraph() {
   //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
   this.loginRequest.myMSALObj.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
    this.callMSGraph(this.graphConfig.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
   }).catch(function (error) {
    console.log(error);
    // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
    // Call acquireTokenRedirect
    if (this.requiresInteraction(error.errorCode)) {
     this.loginRequest.myMSALObj.acquireTokenRedirect(this.requestObj);
    }
   });
  },
  // Callbacks
  authRedirectCallBack(error, response) {
   if (error) {
    console.log(error);
   }
   else {
    if (response.tokenType === "access_token") {
     this.loginRequest.callMSGraph(this.graphConfig.graphEndpoint, response.accessToken, this.graphAPICallback);
    } else {
     console.log("token type is:" + response.tokenType);
    }
   }
  },
  // Calling MS Graph API
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
 }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
