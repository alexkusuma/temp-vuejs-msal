import Auth from '@/vuejs-msal';

const applicationConfig = {
 clientId: 'd81d142b-bd09-4f58-9a86-bca402c4a1bc',
 tenantId: '03ed2d27-eefc-4018-8a19-9963edaf5ce1', // Options: Tenant Id|Tenant name e.g. contoso.microsoft.com|organizations|common|consumers
 // The options below are not implemented, yet
 appinsightsid: '',
 // The options below are no longer required
 graphscopes: ['user.read.all','group.read.all'],  // user.read is minimal required to get user's information, while user.read.all + group.read.all are what's required to get user's group information
 redirecturl: '',
 postLogoutRedirectUri: ''
}

const iam = new Auth(applicationConfig);
export default iam;
