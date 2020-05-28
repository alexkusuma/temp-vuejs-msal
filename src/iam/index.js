import Auth from '@/vuejs-msal';

const applicationConfig = {
 clientId: 'your-client-id',
 tenantId: 'common', // Options: Tenant Id|Tenant name e.g. contoso.microsoft.com|organizations|common|consumers
 // The options below are not implemented, yet
 appinsightsid: '',
 // The options below are no longer required
 graphscopes: ['user.read.all','group.read.all'],  // user.read is minimal required to get user's information, while user.read.all + group.read.all are what's required to get user's group information
 redirecturl: '',
 postLogoutRedirectUri: ''
}

const iam = new Auth(applicationConfig);
export default iam;
