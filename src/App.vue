<template>
 <div id="app">
  <div id="nav">
   <router-link to="/">Home</router-link> | 
   <router-link to="/about">About</router-link>
   <p><button v-show="!this.userLoggedin" @click="login()">Log In</button><button v-show="this.userLoggedin" @click="logout()">Log Out</button> | <button @click="graphMe()">Get User's Info</button> | <button @click="graphMyGroup()">Get User's Groups</button></p>
  </div>
  <div><pre>{{ this.userLoggedin }}|{{ this.userInfoObtained }}</pre></div>
  <div v-show="this.userInfoObtained">
   <p>User Info:</p>
   <pre style="text-align: left;">{{ this.user.info }}</pre>
  </div>
  <div v-show="this.userGroupObtained">
   <p>User's groups:</p>
   <pre style="text-align: left;">{{ this.user.groups }}</pre>
  </div>
  <router-view/>
 </div>
</template>
<script>
import iam from "./iam";

export default {
 name: 'msal-app',
 props:{
 },
 data: () => ({
  user: {
   info: "",
   groups: ""
  },
  userLoggedin: false,
  userInfoObtained: false,
  userGroupObtained: false,
  buttonCaption: "my caption",
 }),
 created: function () {
 },
 mounted: function () {
  this.userLoggedin = iam.isUserLoggedin;
  this.userInfoObtained = iam.isUserInfoObtained;
 },
 computed: {
  authorityBaseUrl(){
   return null;
  }
 },
 watch: {
  group (){
   //this.drawer = false
  },
 },
 methods:{
  async login(){
   await iam.signIn();
   this.userLoggedin = iam.isUserLoggedin;
  },
  logout(){
   iam.signOut();
  },
  async graphMe(){
   await iam.getUserInfo();
   this.user.info = iam.user.info;
   this.userInfoObtained = iam.isUserInfoObtained;
  },
  async graphMyGroup(){
   await iam.getUserGroups(false);
   this.user.groups = iam.user.groups;
   this.userGroupObtained = iam.isuserGroupObtained;
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
