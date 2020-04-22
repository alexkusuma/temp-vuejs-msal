<template>
 <div id="app">
  <div id="nav">
   <router-link to="/">Home</router-link> | 
   <router-link to="/about">About</router-link>
   <p><button @click="say(buttonCaption + '!')">{{ buttonCaption }}</button> | <button @click="say('graph!')">Calling Graph API</button> | <button @click="login()">Login</button> </p>
   <span>{{ this.graphAPIResult }}|{{ this.myGraphApiSpan }}</span>
  </div>
  <p><span>[{{ this.myClientId }}]</span></p>
  <p><span>[{{ this.aClientId }}]</span></p>
  <p><span>[{{ this.authorityBaseUrl }}]</span></p>
  <p><pre>[{{ this.myToken }}]</pre></p>
  <p><pre id="json"></pre></p>
  <router-view/>
 </div>
</template>
<script>
//import axios from "axios";
//import {applicationConfig, vueauth} from "./auth";
import auth from "./auth";

export default {
 name: 'msal-app',
 props:{
 },
 data: () => ({
  user: "",
  myToken: "",
  buttonCaption: "my caption",
  graphAPIResult: "",
  myGraphApiSpan: "",
  myClientId: auth.msalConfig.auth.clientId,
  aClientId: auth.msalConfig.auth.clientId
 }),
 created: function () {
 },
 mounted: function () {
 },
 computed: {
  authorityBaseUrl(){
   return auth.msalConfig.auth.authority;
  }
 },
 watch: {
  group (){
   //this.drawer = false
  },
 },
 methods:{
  say(message){
   alert(message);
  },
  login(){
   this.user = auth.signIn();
   this.myToken = auth.userToken;
  }
 },
};
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
