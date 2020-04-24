# vuejs-msal (vue.msal.pwa.route.jest)

## Core components to port over
- /src/iam
- /src/vuejs-msal

## How to use it in your code
Look at /src/App.vue

### Dependencies
- msal: npm install msal
- axios: npm install axios

### How to get clientId and tenantId
- make note of the url of the deployment website, and the local url including the port, e.g. http://localhost:8081. Yes, the referer can use localhost
- go to portal.azure.com
- go to Azure AD
- register your app with Azure AD
[https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-preview#register-a-web-api](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-preview#register-a-web-api)

## Modules
- msal
- pwa
- route
- jest

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
