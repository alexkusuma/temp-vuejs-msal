import Auth from '@/vuejs-msal';

const applicationConfig = {
 clientId: 'c58d5c8c-7d5a-4c59-9219-c77576d6a8ea',
 // Options: Tenant Id|Tenant name e.g. contoso.microsoft.com|organizations|common|consumers
 tenantId: '7fab64ae-c78a-430b-8380-5ea2cedf0244',
 redirecturl: 'https://vuejsmsal.z8.web.core.windows.net/',
 postLogoutRedirectUri: 'https://vuejsmsal.z8.web.core.windows.net/',
 // this can be used for login or token request, however in more complex situations
 // this can have diverging options
 graphscopes: ['user.read'],
 appinsightsid: ''
}

//export const vueauth = new Auth(applicationConfig);
const auth = new Auth(applicationConfig);
export default auth;
